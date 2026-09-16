import { mkdir, readFile, writeFile } from "node:fs/promises";

const apiKey = process.env.YOUTUBE_API_KEY;
const channelHandle = process.env.YOUTUBE_CHANNEL_HANDLE || "@nimaafsharnaderi";
const outputPath = new URL("../data/public-snapshots.json", import.meta.url);

if (!apiKey) {
  throw new Error("YOUTUBE_API_KEY is required");
}

async function youtube(path, params = {}) {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${path}`);
  Object.entries({ ...params, key: apiKey }).forEach(([key, value]) => url.searchParams.set(key, value));
  const response = await fetch(url);
  if (!response.ok) throw new Error(`YouTube API ${response.status}: ${await response.text()}`);
  return response.json();
}

async function allPlaylistItems(playlistId) {
  const items = [];
  let pageToken = "";
  do {
    const data = await youtube("playlistItems", {
      part: "contentDetails",
      playlistId,
      maxResults: "50",
      ...(pageToken ? { pageToken } : {})
    });
    items.push(...(data.items || []));
    pageToken = data.nextPageToken || "";
  } while (pageToken);
  return items;
}

function durationSeconds(value = "") {
  const match = value.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  return match ? Number(match[1] || 0) * 3600 + Number(match[2] || 0) * 60 + Number(match[3] || 0) : 0;
}

const channelResponse = await youtube("channels", {
  part: "snippet,statistics,contentDetails",
  forHandle: channelHandle
});
const channel = channelResponse.items?.[0];
if (!channel) throw new Error(`Channel not found for ${channelHandle}`);

const uploads = channel.contentDetails?.relatedPlaylists?.uploads;
if (!uploads) throw new Error("Uploads playlist not found");

const playlistItems = await allPlaylistItems(uploads);
const ids = playlistItems.map(item => item.contentDetails?.videoId).filter(Boolean);
const videos = [];
for (let index = 0; index < ids.length; index += 50) {
  const data = await youtube("videos", {
    part: "snippet,statistics,contentDetails",
    id: ids.slice(index, index + 50).join(","),
    maxResults: "50"
  });
  videos.push(...(data.items || []));
}

let store = { version: 1, updatedAt: null, channel: null, videos: [], snapshots: [] };
try {
  store = JSON.parse(await readFile(outputPath, "utf8"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const now = new Date();
const snapshot = {
  date: now.toISOString().slice(0, 10),
  capturedAt: now.toISOString(),
  channel: {
    views: Number(channel.statistics?.viewCount || 0),
    subscribers: Number(channel.statistics?.subscriberCount || 0),
    videos: Number(channel.statistics?.videoCount || 0)
  },
  videos: videos.map(video => ({
    id: video.id,
    views: Number(video.statistics?.viewCount || 0),
    likes: Number(video.statistics?.likeCount || 0),
    comments: Number(video.statistics?.commentCount || 0)
  }))
};

const snapshots = (store.snapshots || []).filter(item => item.date !== snapshot.date);
snapshots.push(snapshot);
snapshots.sort((a, b) => a.date.localeCompare(b.date));

const next = {
  version: 1,
  updatedAt: snapshot.capturedAt,
  channel: {
    id: channel.id,
    title: channel.snippet?.title || "",
    handle: channelHandle
  },
  videos: videos.map(video => ({
    id: video.id,
    title: video.snippet?.title || "",
    publishedAt: video.snippet?.publishedAt || null,
    duration: durationSeconds(video.contentDetails?.duration)
  })),
  snapshots: snapshots.slice(-180)
};

await mkdir(new URL("../data/", import.meta.url), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
console.log(`Saved ${snapshot.videos.length} videos for ${snapshot.date}`);
