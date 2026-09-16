const cfg = window.YT_DASHBOARD_CONFIG || {};
const fa = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 1 });
const faInt = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 });
const compact = new Intl.NumberFormat("fa-IR", { notation: "compact", maximumFractionDigits: 1 });

const demoVideos = [
  {id:"d1",title:"اپوزیسیون چندپاره، مردم دائم‌الاعتراض و رهبر ناتوان",date:"2026-09-15",format:"long",series:"جان کلام",views:18420,watch:2190,retention:51.8,subs:194,likes:1240,comments:189,velocity:7200,score:94},
  {id:"d2",title:"چرا مردم ساکت هستند؟ جان کلام مهدی مطهرنیا",date:"2026-09-14",format:"short",series:"جان کلام کوتاه",views:52300,watch:701,retention:78.4,subs:281,likes:3980,comments:244,velocity:26100,score:91},
  {id:"d3",title:"تجزیه‌طلبان، فدرالیسم و شاهزاده رضا پهلوی",date:"2026-09-13",format:"long",series:"جان کلام",views:14680,watch:1826,retention:48.2,subs:132,likes:917,comments:206,velocity:5900,score:88},
  {id:"d4",title:"راز منوی مخفی رستوران‌ها",date:"2026-09-12",format:"short",series:"صنعت غذا",views:38750,watch:485,retention:72.1,subs:119,likes:2240,comments:81,velocity:18300,score:84},
  {id:"d5",title:"نوبت شکار تهران است؟",date:"2026-09-11",format:"short",series:"جان کلام کوتاه",views:31420,watch:402,retention:69.5,subs:168,likes:2110,comments:173,velocity:14900,score:82},
  {id:"d6",title:"درباره انقلاب، فروپاشی و آن‌چه در انتظار ایران است",date:"2026-09-10",format:"long",series:"گفت‌وگو و تحلیل",views:12140,watch:1705,retention:55.1,subs:143,likes:854,comments:129,velocity:4100,score:86},
  {id:"d7",title:"چرا کافه‌ها کلمه تومان را از منو پاک می‌کنند؟",date:"2026-09-08",format:"short",series:"صنعت غذا",views:28460,watch:351,retention:66.8,subs:76,likes:1680,comments:63,velocity:11600,score:77},
  {id:"d8",title:"زندگی‌های نزیسته؛ کاری که نشد",date:"2026-09-06",format:"long",series:"زندگی‌های نزیسته",views:7940,watch:1240,retention:61.7,subs:98,likes:720,comments:116,velocity:2300,score:81},
  {id:"d9",title:"قاتل رستوران‌های سنتی: مدل سلف‌سرویس",date:"2026-09-04",format:"short",series:"صنعت غذا",views:22100,watch:271,retention:63.4,subs:51,likes:1190,comments:55,velocity:9400,score:72},
  {id:"d10",title:"عملیات پیچیده فرقه رجوی با هوش مصنوعی لو رفت",date:"2026-09-02",format:"long",series:"خبر و تحلیل",views:9680,watch:1090,retention:43.9,subs:71,likes:611,comments:98,velocity:3200,score:70}
];

const dayBase = [6100,7200,6800,8300,7900,9400,11200,9800,10500,8900,12100,11800,13600,12900,15300,14700,13200,16100,15800,17400,16900,18800,18100,20700,19400,22600,21800,24100];
const state = {days:28,mode:"demo",videos:[...demoVideos],daily:buildDaily(28),accessToken:null};

function buildDaily(days){
  const slice=dayBase.slice(-Math.min(days,dayBase.length));
  const extra=Math.max(0,days-slice.length);
  const values=[...Array(extra)].map((_,i)=>Math.round(4500+(i%9)*430+(i*41)%1700)).concat(slice);
  const today=new Date("2026-09-16T12:00:00Z");
  return values.map((views,i)=>{const d=new Date(today);d.setUTCDate(d.getUTCDate()-(values.length-1-i));return {date:d.toISOString().slice(0,10),views,watch:Math.round(views*(.071+(i%5)*.003)),subs:Math.round(views*(.006+(i%4)*.0007))};});
}

function n(value,type="number"){
  if(type==="compact") return compact.format(value);
  if(type==="decimal") return fa.format(value);
  return faInt.format(value);
}
function esc(s=""){return String(s).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));}
function sum(items,key){return items.reduce((a,x)=>a+(Number(x[key])||0),0)}
function avg(items,key){return items.length?sum(items,key)/items.length:0}
function showToast(message){const el=document.getElementById("toast");el.textContent=message;el.classList.add("show");clearTimeout(showToast.t);showToast.t=setTimeout(()=>el.classList.remove("show"),2800)}

function renderAll(){renderKPIs();renderTrend();renderInsights();renderTopVideos();renderFormats();renderVelocity();renderHeatmap();renderVideoTable();renderSeries();renderAudience();renderReport();}

function renderKPIs(){
  const views=sum(state.daily,"views"),watch=sum(state.daily,"watch"),subs=sum(state.daily,"subs"),ret=avg(state.videos,"retention");
  const cards=[
    {label:"بازدید",value:n(views,"compact"),delta:"۱۸٫۶٪ بیشتر",icon:"◉",accent:"#6d8cff"},
    {label:"زمان تماشا",value:`${n(watch,"compact")} ساعت`,delta:"۲۳٫۱٪ بیشتر",icon:"◷",accent:"#a779ff"},
    {label:"مشترک خالص",value:`+${n(subs)}`,delta:"۹٫۴٪ بیشتر",icon:"＋",accent:"#38d39f"},
    {label:"میانگین مشاهده",value:`${n(ret,"decimal")}٪`,delta:"۲٫۷٪ کمتر",icon:"⌁",accent:"#ff4e61",down:true}
  ];
  document.getElementById("kpiGrid").innerHTML=cards.map(c=>`<article class="kpi-card" style="--accent:${c.accent};--glow:${c.accent}"><div class="kpi-top"><span>${c.label}</span><i class="kpi-icon">${c.icon}</i></div><div class="kpi-value">${c.value}</div><div class="delta ${c.down?"down":""}">${c.down?"↓":"↑"} ${c.delta} نسبت به دورهٔ قبل</div></article>`).join("");
}

function lineSVG(data,second=true){
  const w=800,h=235,pad={x:20,y:18,b:26};const max=Math.max(...data.map(d=>d.views))*1.08;const maxW=Math.max(...data.map(d=>d.watch))*1.08;
  const point=(v,i,m)=>[pad.x+i*((w-pad.x*2)/(data.length-1||1)),h-pad.b-(v/m)*(h-pad.y-pad.b)];
  const pts=data.map((d,i)=>point(d.views,i,max));const wpts=data.map((d,i)=>point(d.watch,i,maxW));
  const path=pts.map((p,i)=>(i?"L":"M")+p.join(",")).join(" ");const wp=wpts.map((p,i)=>(i?"L":"M")+p.join(",")).join(" ");
  const area=`${path} L${pts.at(-1)[0]},${h-pad.b} L${pts[0][0]},${h-pad.b} Z`;
  const ticks=[0,.25,.5,.75,1].map(q=>{const y=h-pad.b-q*(h-pad.y-pad.b);return `<line class="grid-line" x1="${pad.x}" x2="${w-pad.x}" y1="${y}" y2="${y}"/><text class="chart-label" x="${w-2}" y="${y+3}" text-anchor="end">${n(max*q,"compact")}</text>`}).join("");
  const labels=data.filter((_,i)=>i===0||i===data.length-1||i%Math.max(1,Math.floor(data.length/5))===0).map((d)=>{const i=data.indexOf(d),p=pts[i];return `<text class="chart-label" x="${p[0]}" y="${h-5}" text-anchor="middle">${new Date(d.date).toLocaleDateString("fa-IR",{month:"short",day:"numeric"})}</text>`}).join("");
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6d8cff" stop-opacity=".25"/><stop offset="1" stop-color="#6d8cff" stop-opacity="0"/></linearGradient></defs>${ticks}<path class="area-fill" d="${area}"/><path class="series-line" d="${path}"/>${second?`<path class="watch-line" d="${wp}"/>`:""}${pts.filter((_,i)=>i===pts.length-1).map(p=>`<circle class="chart-dot" cx="${p[0]}" cy="${p[1]}" r="5"/>`).join("")}${labels}</svg>`;
}
function renderTrend(){
  document.getElementById("trendChart").innerHTML=lineSVG(state.daily);
  const best=state.daily.reduce((a,b)=>a.views>b.views?a:b);document.getElementById("trendSummary").innerHTML=`<div><span>بهترین روز</span><strong>${new Date(best.date).toLocaleDateString("fa-IR",{weekday:"long",day:"numeric",month:"long"})}</strong></div><div><span>میانگین روزانه</span><strong>${n(avg(state.daily,"views"),"compact")} بازدید</strong></div><div><span>روند کلی</span><strong style="color:var(--green)">صعودی +۱۸٫۶٪</strong></div>`;
}
function renderInsights(){
  const long=state.videos.filter(v=>v.format==="long"),short=state.videos.filter(v=>v.format==="short");
  const insights=[
    ["جان کلام همچنان موتور رشد است","سه ویدئوی برتر این دوره از خانوادهٔ جان کلام‌اند.","فرصت"],
    ["شورتز سریع‌تر، بلندها عمیق‌تر",`شورتز ${n(avg(short,"views")/avg(long,"views"),"decimal")} برابر بازدید؛ ویدئوی بلند ${n(avg(long,"watch")/avg(short,"watch"),"decimal")} برابر زمان تماشا دارد.`,"تعادل"],
    ["ماندگاری بلندها جای بهبود دارد","شروع ویدئوهای بلند را ۲۰ تا ۳۰ ثانیه کوتاه‌تر آزمایش کن.","هشدار"]
  ];
  document.getElementById("insightList").innerHTML=insights.map((x,i)=>`<div class="insight"><div><strong>${x[0]}</strong><b class="${i===2?"warn":""}">${x[2]}</b></div><p>${x[1]}</p></div>`).join("");
}
function renderTopVideos(){
  document.getElementById("topVideos").innerHTML=[...state.videos].sort((a,b)=>b.score-a.score).slice(0,5).map((v,i)=>`<div class="video-row"><div class="video-rank">${n(i+1)}</div><div class="video-info"><strong title="${esc(v.title)}">${esc(v.title)}</strong><span>${esc(v.series)} · ${new Date(v.date).toLocaleDateString("fa-IR")}</span></div><div class="video-stat"><strong>${n(v.views,"compact")}</strong><span>بازدید</span></div><div class="score">${n(v.score)}</div></div>`).join("");
}
function renderFormats(){
  const short=state.videos.filter(v=>v.format==="short"),long=state.videos.filter(v=>v.format==="long");const sv=sum(short,"views"),lv=sum(long,"views"),total=sv+lv;
  document.getElementById("formatChart").innerHTML=`<div style="width:${sv/total*100}%;background:var(--purple)"></div><div style="width:${lv/total*100}%;background:var(--blue)"></div>`;
  document.getElementById("formatLegend").innerHTML=`<div class="format-item"><div><span>شورتز</span><strong>${n(sv/total*100,"decimal")}٪</strong></div><small>${n(avg(short,"retention"),"decimal")}٪ میانگین مشاهده</small></div><div class="format-item"><div><span>ویدئوی بلند</span><strong>${n(lv/total*100,"decimal")}٪</strong></div><small>${n(sum(long,"watch"),"compact")} ساعت تماشا</small></div>`;
}
function renderVelocity(){const list=[...state.videos].sort((a,b)=>b.velocity-a.velocity).slice(0,7);const max=Math.max(...list.map(x=>x.velocity));document.getElementById("velocityChart").innerHTML=list.map(v=>`<div class="bar-group"><div class="bar" style="height:${v.velocity/max*88}%" data-value="${n(v.velocity,"compact")}"></div><span>${esc(v.series.slice(0,11))}</span></div>`).join("")}
function renderHeatmap(){const days=["ش","ی","د","س","چ","پ","ج"],hours=["۱۲","۱۵","۱۸","۲۱"];let html=`<div></div>${days.map(d=>`<div class="heat-label">${d}</div>`).join("")}`;hours.forEach((h,ri)=>{html+=`<div class="heat-label">${h}</div>`;days.forEach((_,ci)=>{const val=.08+(((ri+1)*(ci+3)*17)%85)/100;html+=`<div class="heat-cell" style="--alpha:${val.toFixed(2)}" title="امتیاز ${Math.round(val*100)}"></div>`})});document.getElementById("heatmap").innerHTML=html}

function filteredVideos(){const q=(document.getElementById("videoSearch")?.value||"").trim().toLowerCase(),format=document.getElementById("formatFilter")?.value||"all",sort=document.getElementById("sortFilter")?.value||"views";return state.videos.filter(v=>(format==="all"||v.format===format)&&v.title.toLowerCase().includes(q)).sort((a,b)=>sort==="retention"?b.retention-a.retention:sort==="subs"?b.subs-a.subs:sort==="recent"?new Date(b.date)-new Date(a.date):b.views-a.views)}
function renderVideoTable(){const body=document.getElementById("videoTable");if(!body)return;body.innerHTML=filteredVideos().map(v=>`<tr><td><div class="table-video"><div class="thumb" ${v.thumb?`style="background-image:url('${v.thumb}')"`:""}>▶</div><div><strong title="${esc(v.title)}">${esc(v.title)}</strong><span>${new Date(v.date).toLocaleDateString("fa-IR")} · ${esc(v.series)}</span></div></div></td><td><span class="type-badge ${v.format}">${v.format==="short"?"شورتز":"بلند"}</span></td><td>${n(v.views)}</td><td>${n(v.watch)} ساعت</td><td>${n(v.retention,"decimal")}٪</td><td style="color:var(--green)">+${n(v.subs)}</td><td><span class="score">${n(v.score)}</span></td></tr>`).join("")||`<tr><td colspan="7">موردی پیدا نشد.</td></tr>`}

function seriesData(){const colors=["#6d8cff","#a779ff","#ff4e61","#38d39f","#ffbd59"];const map={};state.videos.forEach(v=>(map[v.series]??=[]).push(v));return Object.entries(map).map(([name,items],i)=>({name,items,color:colors[i%colors.length],views:sum(items,"views"),watch:sum(items,"watch"),retention:avg(items,"retention"),subs:sum(items,"subs"),score:Math.round(avg(items,"score"))})).sort((a,b)=>b.score-a.score)}
function renderSeries(){const series=seriesData();document.getElementById("seriesGrid").innerHTML=series.map(s=>`<article class="series-card" style="--series-color:${s.color}"><div class="series-card-head"><h3>${esc(s.name)}</h3><span class="series-score">${n(s.score)}</span></div><p>${n(s.items.length)} ویدئو در بازهٔ انتخاب‌شده</p><div class="series-metrics"><div><span>بازدید</span><strong>${n(s.views,"compact")}</strong></div><div><span>ماندگاری</span><strong>${n(s.retention,"decimal")}٪</strong></div><div><span>مشترک</span><strong>+${n(s.subs)}</strong></div></div></article>`).join("");const maxSubs=Math.max(...series.map(s=>s.subs)),maxRet=Math.max(...series.map(s=>s.retention));document.getElementById("seriesMatrix").innerHTML=series.map(s=>`<div class="matrix-dot" style="right:${Math.max(8,s.retention/maxRet*85)}%;bottom:${Math.max(8,s.subs/maxSubs*82)}%;--size:${Math.max(42,Math.min(72,s.views/900))}px;--color:${s.color}" title="${esc(s.name)}">${esc(s.name.slice(0,8))}</div>`).join("")}

function renderAudience(){
  const audience=state.daily.map((d,i)=>({...d,views:Math.round(d.views*(.34+(i/state.daily.length)*.19))}));document.getElementById("audienceTrend").innerHTML=lineSVG(audience,false);
  const sources=[["صفحهٔ اصلی",38],["پیشنهادهای یوتیوب",24],["جست‌وجوی یوتیوب",18],["Shorts Feed",14],["خارج از یوتیوب",6]];document.getElementById("sourceList").innerHTML=sources.map(x=>`<div class="source-row"><span>${x[0]}</span><div class="progress"><i style="--width:${x[1]}%"></i></div><strong>${n(x[1])}٪</strong></div>`).join("");
  const countries=[["ایران",62],["آلمان",9],["ایالات متحده",8],["کانادا",6],["ترکیه",5],["سایر",10]];document.getElementById("countryList").innerHTML=countries.map(x=>`<div class="country-row"><span>${x[0]}</span><div class="progress"><i style="--width:${x[1]}%"></i></div><strong>${n(x[1])}٪</strong></div>`).join("");
  document.getElementById("deviceChart").innerHTML=`<div class="donut"><div class="donut-label"><strong>۵۸٪</strong><span>موبایل</span></div></div><div class="device-legend">${[["موبایل",58,"#6d8cff"],["تلویزیون",22,"#ff4e61"],["رایانه",14,"#a779ff"],["تبلت",6,"#ffbd59"]].map(x=>`<div><i style="--c:${x[2]}"></i><span>${x[0]}</span><strong>${n(x[1])}٪</strong></div>`).join("")}</div>`;
}
function renderReport(){const top=[...state.videos].sort((a,b)=>b.score-a.score)[0],weak=[...state.videos].sort((a,b)=>a.retention-b.retention)[0],views=sum(state.daily,"views");document.getElementById("reportContent").innerHTML=`<article class="report-card"><h3>نتیجهٔ کلیدی دوره</h3><div class="report-number">${n(views,"compact")}</div><p>بازدید در ${n(state.days)} روز؛ روند کلی مثبت است و سرعت رشد در هفتهٔ اخیر افزایش یافته.</p></article><article class="report-card"><h3>برندهٔ دوره</h3><p><strong>${esc(top.title)}</strong></p><p>امتیاز ${n(top.score)} از ۱۰۰؛ ترکیب مناسبی از کلیک، ماندگاری و جذب مشترک.</p></article><article class="report-card wide"><h3>سه تصمیم پیشنهادی برای دورهٔ بعد</h3><ul><li>انتشار منظم جان کلام را حفظ کن؛ این مجموعه هم بازدید و هم مشترک می‌سازد.</li><li>برای ویدئوهای بلند، هوک را سریع‌تر وارد مسئله کن. «${esc(weak.title)}» کمترین ماندگاری این دوره را داشته است.</li><li>از موضوع‌های موفق بلند، یک شورتز مستقل بساز و در ۲۴ ساعت بعد منتشر کن.</li></ul></article><article class="report-card"><h3>هدف پیشنهادی</h3><p>افزایش میانگین ماندگاری ویدئوهای بلند به <strong>۵۵٪</strong> و تثبیت حداقل دو انتشار در هفته.</p></article><article class="report-card"><h3>آزمایش بعدی</h3><p>دو تیتر با ساختار «پرسش مستقیم» و «ادعای روشن» را روی موضوع‌های مشابه مقایسه کن.</p></article>`}

function switchView(name){document.querySelectorAll(".view").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".nav-item[data-view]").forEach(x=>x.classList.toggle("active",x.dataset.view===name));document.getElementById(`view-${name}`)?.classList.add("active");const titles={overview:"صبح بخیر نیما؛ این‌جا نبض کانال است.",videos:"هر ویدئو، یک سرنخ برای تصمیم بعدی.",series:"ستون‌های محتوایی را با هم مقایسه کن.",audience:"ببین چه کسانی می‌آیند و چرا برمی‌گردند.",reports:"عددها را به برنامهٔ عملی تبدیل کن."};document.getElementById("pageTitle").textContent=titles[name];document.getElementById("sidebar").classList.remove("open");window.scrollTo({top:0,behavior:"smooth"})}

async function startOAuth(){
  const msg=document.getElementById("oauthMessage");
  if(!cfg.googleClientId){msg.textContent="هنوز Client ID گوگل در config.js ثبت نشده است. پس از فعال‌شدن GitHub Pages، این مرحله را با هم انجام می‌دهیم.";return}
  if(!window.google?.accounts?.oauth2){msg.textContent="کتابخانهٔ ورود گوگل هنوز بارگذاری نشده؛ چند ثانیه بعد دوباره امتحان کن.";return}
  msg.textContent="پنجرهٔ ورود گوگل در حال بازشدن است…";
  const client=google.accounts.oauth2.initTokenClient({client_id:cfg.googleClientId,scope:"https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly",callback:async response=>{if(response.error){msg.textContent=`خطای ورود: ${response.error}`;return}state.accessToken=response.access_token;await loadLiveData(response.access_token);document.getElementById("connectionDialog").close()}});client.requestAccessToken({prompt:"consent"});
}
async function api(url,token){const r=await fetch(url,{headers:{Authorization:`Bearer ${token}`}});if(!r.ok)throw new Error(`${r.status}: ${await r.text()}`);return r.json()}
async function loadLiveData(token){
  try{showToast("در حال دریافت آمار واقعی کانال…");const channel=await api("https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",token);const item=channel.items?.[0];if(!item)throw new Error("کانالی برای این حساب پیدا نشد");const end=new Date(),start=new Date();start.setDate(end.getDate()-state.days);const dates=`startDate=${start.toISOString().slice(0,10)}&endDate=${end.toISOString().slice(0,10)}`;
    const daily=await api(`https://youtubeanalytics.googleapis.com/v2/reports?ids=channel%3D%3DMINE&${dates}&dimensions=day&metrics=views,estimatedMinutesWatched,subscribersGained&sort=day`,token);
    state.daily=(daily.rows||[]).map(r=>({date:r[0],views:r[1],watch:Math.round(r[2]/60),subs:r[3]}));
    const vr=await api(`https://youtubeanalytics.googleapis.com/v2/reports?ids=channel%3D%3DMINE&${dates}&dimensions=video&metrics=views,estimatedMinutesWatched,averageViewPercentage,subscribersGained,likes,comments&sort=-views&maxResults=200`,token);
    const ids=(vr.rows||[]).map(r=>r[0]);let meta={};for(let i=0;i<ids.length;i+=50){const res=await api(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${ids.slice(i,i+50).join(",")}`,token);res.items?.forEach(v=>meta[v.id]=v)}
    state.videos=(vr.rows||[]).map((r,i)=>{const m=meta[r[0]],title=m?.snippet?.title||r[0],duration=parseDuration(m?.contentDetails?.duration||"");const format=duration<=70?"short":"long";return{id:r[0],title,date:m?.snippet?.publishedAt?.slice(0,10)||"",format,series:detectSeries(title,format),views:r[1],watch:Math.round(r[2]/60),retention:r[3],subs:r[4],likes:r[5],comments:r[6],velocity:Math.round(r[1]*.42),score:scoreVideo(r[1],r[3],r[4]),thumb:m?.snippet?.thumbnails?.medium?.url}});
    state.mode="live";document.getElementById("channelName").textContent=item.snippet.title;document.getElementById("channelAvatar").style.backgroundImage=`url('${item.snippet.thumbnails?.default?.url}')`;document.getElementById("channelAvatar").textContent="";document.getElementById("syncState").textContent="متصل به یوتیوب";document.getElementById("syncTime").textContent="همین حالا به‌روزرسانی شد";document.querySelector(".status-dot").style.background="var(--green)";renderAll();showToast("آمار واقعی کانال با موفقیت دریافت شد");
  }catch(e){console.error(e);showToast("دریافت آمار کامل نشد؛ تنظیمات API را بررسی کن")}
}
function parseDuration(s){const m=s.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);return m?Number(m[1]||0)*3600+Number(m[2]||0)*60+Number(m[3]||0):0}
function detectSeries(title,format){if(/جان کلام/.test(title))return format==="short"?"جان کلام کوتاه":"جان کلام";if(/رستوران|کافه|منو|غذا/.test(title))return"صنعت غذا";if(/زندگی/.test(title))return"زندگی‌های نزیسته";return"خبر و تحلیل"}
function scoreVideo(views,ret,subs){const max=Math.max(1,...state.videos.map(v=>v.views));return Math.min(99,Math.round((views/max)*38+(ret/100)*42+Math.min(subs/250,1)*20))}

document.addEventListener("DOMContentLoaded",()=>{
  renderAll();
  document.querySelectorAll(".nav-item[data-view]").forEach(b=>b.addEventListener("click",()=>switchView(b.dataset.view)));
  document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>switchView(b.dataset.go)));
  document.querySelectorAll(".date-range button").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".date-range button").forEach(x=>x.classList.remove("active"));b.classList.add("active");state.days=Number(b.dataset.days);if(state.mode==="demo")state.daily=buildDaily(state.days);document.getElementById("pageSubtitle").textContent=`عملکرد ${b.textContent} اخیر در مقایسه با دورهٔ پیش`;renderAll()}));
  ["videoSearch","formatFilter","sortFilter"].forEach(id=>document.getElementById(id)?.addEventListener(id==="videoSearch"?"input":"change",renderVideoTable));
  document.getElementById("menuBtn").addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));
  const dialog=document.getElementById("connectionDialog");["connectBtn","settingsBtn"].forEach(id=>document.getElementById(id).addEventListener("click",()=>dialog.showModal()));
  document.getElementById("oauthStartBtn").addEventListener("click",startOAuth);
  document.getElementById("exportBtn").addEventListener("click",()=>{switchView("reports");setTimeout(()=>window.print(),250)});
  document.getElementById("generateReportBtn").addEventListener("click",()=>{renderReport();showToast("گزارش تازه بر اساس بازهٔ انتخاب‌شده ساخته شد")});
});
