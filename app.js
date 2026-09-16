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
const state = {
  days:28,mode:"demo",videos:[...demoVideos],daily:buildDaily(28),accessToken:null,
  revenue:buildDemoRevenue(),revenueMode:"demo",taxRate:20,revenueCurrency:"USD",
  fx:{usdToRial:null,usdToTry:null,updatedAt:null,source:""},
  analysisVideos:buildDemoAnalysis(),recommendations:[],analysisUpdatedAt:null,channelItem:null,
  comments:buildDemoComments(),commentsPermission:false,commentStatus:"published",heldCount:1,
  publicHistory:[],historyUpdatedAt:null,
  range:null,comparisonMode:"previous",comparisonDaily:[],comparisonVideos:[],rangePreset:"28d"
};

function buildDemoAnalysis(){return demoVideos.map((v,i)=>({...v,revenue:Number((v.views/1000*(v.format==="long"?3.8+i*.17:.22+i*.025)).toFixed(2)),duration:v.format==="long"?540+i*73:42+i,description:v.title,tags:[v.series],recentViews:v.views,publishedAt:`${v.date}T${String(15+(i%4)*2).padStart(2,"0")}:${i%2?"30":"00"}:00Z`}))}
function buildDemoComments(){return[
  {id:"c1",author:"آرش",avatar:"",text:"قسمت بعدی جان کلام دربارهٔ سناریوی گذار هم صحبت می‌کنید؟",publishedAt:new Date(Date.now()-46*60000).toISOString(),likes:12,videoTitle:"اپوزیسیون چندپاره، مردم دائم‌الاعتراض و رهبر ناتوان",status:"published",replyCount:0},
  {id:"c2",author:"سارا",avatar:"",text:"تحلیل متعادل و قابل‌فهمی بود. مخصوصاً بخش مربوط به اعتماد عمومی.",publishedAt:new Date(Date.now()-3*3600000).toISOString(),likes:8,videoTitle:"چرا مردم ساکت هستند؟",status:"published",replyCount:1},
  {id:"c3",author:"کاربر یوتیوب",avatar:"",text:"لطفاً منبع آماری که در دقیقهٔ چهار گفتید را هم در توضیحات بگذارید.",publishedAt:new Date(Date.now()-7*3600000).toISOString(),likes:3,videoTitle:"تجزیه‌طلبان، فدرالیسم و شاهزاده رضا پهلوی",status:"heldForReview",replyCount:0}
]}

function buildDaily(days){
  const slice=dayBase.slice(-Math.min(days,dayBase.length));
  const extra=Math.max(0,days-slice.length);
  const values=[...Array(extra)].map((_,i)=>Math.round(4500+(i%9)*430+(i*41)%1700)).concat(slice);
  const today=new Date("2026-09-16T12:00:00Z");
  return values.map((views,i)=>{const d=new Date(today);d.setUTCDate(d.getUTCDate()-(values.length-1-i));return {date:d.toISOString().slice(0,10),views,watch:Math.round(views*(.071+(i%5)*.003)),subs:Math.round(views*(.006+(i%4)*.0007))};});
}

function buildDemoRevenue(){
  const now=new Date(),start=new Date(now.getFullYear(),now.getMonth()-1,1),rows=[];
  for(let d=new Date(start);d<=now;d.setDate(d.getDate()+1)){
    const i=rows.length,weekday=d.getDay();
    const base=weekday===5?2.4:4.1+(i%7)*.48+((i*13)%9)*.11;
    rows.push({date:localISO(d),revenue:Number(base.toFixed(2))});
  }
  return rows;
}
function localISO(d){const z=new Date(d.getTime()-d.getTimezoneOffset()*60000);return z.toISOString().slice(0,10)}

function dateAtNoon(value){const d=value instanceof Date?new Date(value):new Date(`${value}T12:00:00`);d.setHours(12,0,0,0);return d}
function inclusiveDays(start,end){return Math.max(1,Math.round((dateAtNoon(end)-dateAtNoon(start))/864e5)+1)}
function shiftISO(value,days){const d=dateAtNoon(value);d.setDate(d.getDate()+days);return localISO(d)}
function presetRange(key){
  const now=dateAtNoon(new Date()),end=localISO(now);let start=end,label="بازهٔ دلخواه";
  const rolling={"7d":[6,"۷ روز اخیر"],"28d":[27,"۲۸ روز اخیر"],"90d":[89,"۹۰ روز اخیر"],"180d":[179,"۶ ماه اخیر"],"365d":[364,"۳۶۵ روز اخیر"],"730d":[729,"۲ سال اخیر"]};
  if(rolling[key]){start=shiftISO(end,-rolling[key][0]);label=rolling[key][1]}
  else if(key==="today"){label="امروز"}
  else if(key==="yesterday"){start=shiftISO(end,-1);return{start,end:start,label:"دیروز",key}}
  else if(key==="thisWeek"){const offset=(now.getDay()+1)%7;start=shiftISO(end,-offset);label="هفتهٔ جاری"}
  else if(key==="lastWeek"){const offset=(now.getDay()+1)%7,e=shiftISO(end,-offset-1);return{start:shiftISO(e,-6),end:e,label:"هفتهٔ قبل",key}}
  else if(key==="thisMonth"){start=localISO(new Date(now.getFullYear(),now.getMonth(),1));label="ماه جاری"}
  else if(key==="lastMonth"){start=localISO(new Date(now.getFullYear(),now.getMonth()-1,1));const e=new Date(now.getFullYear(),now.getMonth(),0);return{start,end:localISO(e),label:"ماه قبل",key}}
  else if(key==="thisQuarter"){const q=Math.floor(now.getMonth()/3)*3;start=localISO(new Date(now.getFullYear(),q,1));label="فصل جاری"}
  else if(key==="lastQuarter"){const q=Math.floor(now.getMonth()/3)*3-3,s=new Date(now.getFullYear(),q,1),e=new Date(s.getFullYear(),s.getMonth()+3,0);return{start:localISO(s),end:localISO(e),label:"فصل قبل",key}}
  else if(key==="thisYear"){start=localISO(new Date(now.getFullYear(),0,1));label="سال جاری"}
  else if(key==="lastYear"){return{start:`${now.getFullYear()-1}-01-01`,end:`${now.getFullYear()-1}-12-31`,label:"سال قبل",key}}
  else if(key==="allTime"){start=(state.channelItem?.snippet?.publishedAt||"2005-01-01").slice(0,10);label="از آغاز کانال"}
  return{start,end,label,key};
}
function comparisonRange(range,mode=state.comparisonMode){
  if(mode==="none")return null;
  if(mode==="year"){const s=dateAtNoon(range.start),e=dateAtNoon(range.end);s.setFullYear(s.getFullYear()-1);e.setFullYear(e.getFullYear()-1);return{start:localISO(s),end:localISO(e),label:"همین بازه در سال قبل"}}
  const days=inclusiveDays(range.start,range.end),end=shiftISO(range.start,-1),start=shiftISO(end,-days+1);return{start,end,label:"دورهٔ قبل با طول برابر"};
}
function faDate(value,options={year:"numeric",month:"short",day:"numeric"}){return dateAtNoon(value).toLocaleDateString("fa-IR",options)}
function rangeText(range=state.range){return range?`${range.label} · ${faDate(range.start)} تا ${faDate(range.end)}`:"۲۸ روز اخیر"}
function comparisonText(){const c=comparisonRange(state.range);return c?c.label:"بدون مقایسه"}
function percentChange(current,previous){if(!previous)return current?100:0;return (current-previous)/Math.abs(previous)*100}
function buildDemoRange(range){const days=Math.min(inclusiveDays(range.start,range.end),1200),base=buildDaily(days);return base.map((row,i)=>({...row,date:shiftISO(range.start,i)}))}

state.range=presetRange("28d");
state.comparisonDaily=buildDemoRange(comparisonRange(state.range)).map(x=>({...x,views:Math.round(x.views*.88),watch:Math.round(x.watch*.9),subs:Math.round(x.subs*.91)}));
state.comparisonVideos=demoVideos.map(v=>({...v,retention:v.retention-2}));

function n(value,type="number"){
  if(type==="compact") return compact.format(value);
  if(type==="decimal") return fa.format(value);
  return faInt.format(value);
}
function esc(s=""){return String(s).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));}
function sum(items,key){return items.reduce((a,x)=>a+(Number(x[key])||0),0)}
function avg(items,key){return items.length?sum(items,key)/items.length:0}
function showToast(message){const el=document.getElementById("toast");el.textContent=message;el.classList.add("show");clearTimeout(showToast.t);showToast.t=setTimeout(()=>el.classList.remove("show"),2800)}

function renderAll(){renderKPIs();renderTrend();renderInsights();renderTopVideos();renderFormats();renderVelocity();renderHeatmap();renderVideoTable();renderSeries();renderAudience();renderRevenue();renderAdvisor();renderComments();renderReport();}

function renderKPIs(){
  const views=sum(state.daily,"views"),watch=sum(state.daily,"watch"),subs=sum(state.daily,"subs"),ret=avg(state.videos,"retention");
  const previous={views:sum(state.comparisonDaily,"views"),watch:sum(state.comparisonDaily,"watch"),subs:sum(state.comparisonDaily,"subs"),retention:avg(state.comparisonVideos,"retention")};
  const delta=(current,old)=>{if(state.comparisonMode==="none")return{label:"مقایسه غیرفعال",down:false};const value=percentChange(current,old);return{label:`${n(Math.abs(value),"decimal")}٪ ${value>=0?"بیشتر":"کمتر"}`,down:value<0}};
  const changes=[delta(views,previous.views),delta(watch,previous.watch),delta(subs,previous.subs),delta(ret,previous.retention)];
  const cards=[
    {label:"بازدید",value:n(views,"compact"),delta:changes[0].label,icon:"◉",accent:"#6d8cff",down:changes[0].down},
    {label:"زمان تماشا",value:`${n(watch,"compact")} ساعت`,delta:changes[1].label,icon:"◷",accent:"#a779ff",down:changes[1].down},
    {label:"مشترک خالص",value:`+${n(subs)}`,delta:changes[2].label,icon:"＋",accent:"#38d39f",down:changes[2].down},
    {label:"میانگین مشاهده",value:`${n(ret,"decimal")}٪`,delta:changes[3].label,icon:"⌁",accent:"#ff4e61",down:changes[3].down}
  ];
  document.getElementById("kpiGrid").innerHTML=cards.map(c=>`<article class="kpi-card" style="--accent:${c.accent};--glow:${c.accent}"><div class="kpi-top"><span>${c.label}</span><i class="kpi-icon">${c.icon}</i></div><div class="kpi-value">${c.value}</div><div class="delta ${c.down?"down":""}">${state.comparisonMode==="none"?"—":c.down?"↓":"↑"} ${c.delta}${state.comparisonMode==="none"?"":` نسبت به ${comparisonText()}`}</div></article>`).join("");
}

function lineSVG(data,second=true){
  if(!data.length)return`<div class="comment-empty">در این بازه داده‌ای گزارش نشده است.</div>`;
  const w=800,h=235,pad={x:20,y:18,b:26};const max=Math.max(1,...data.map(d=>d.views))*1.08;const maxW=Math.max(1,...data.map(d=>d.watch))*1.08;
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
  if(!state.daily.length){document.getElementById("trendSummary").innerHTML="";return}const best=state.daily.reduce((a,b)=>a.views>b.views?a:b),change=percentChange(sum(state.daily,"views"),sum(state.comparisonDaily,"views"));document.getElementById("trendSummary").innerHTML=`<div><span>بهترین روز</span><strong>${new Date(best.date).toLocaleDateString("fa-IR",{weekday:"long",day:"numeric",month:"long"})}</strong></div><div><span>میانگین روزانه</span><strong>${n(avg(state.daily,"views"),"compact")} بازدید</strong></div><div><span>مقایسهٔ دوره</span><strong style="color:var(--${change>=0?"green":"red"})">${state.comparisonMode==="none"?"غیرفعال":`${change>=0?"+":"−"}${n(Math.abs(change),"decimal")}٪`}</strong></div>`;
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
async function loadFxRates(){
  const manual=Number(localStorage.getItem("nimaManualUsdToman"));
  try{
    const [nobitex,globalFx]=await Promise.all([
      fetch("https://apiv2.nobitex.ir/v3/orderbook/USDTIRT").then(r=>{if(!r.ok)throw new Error("Nobitex");return r.json()}),
      fetch("https://open.er-api.com/v6/latest/USD").then(r=>{if(!r.ok)throw new Error("FX");return r.json()})
    ]);
    const bid=Number(nobitex.bids?.[0]?.[0]),ask=Number(nobitex.asks?.[0]?.[0]),last=Number(nobitex.lastTradePrice);
    state.fx.usdToRial=manual?manual*10:(bid&&ask?(bid+ask)/2:last);
    state.fx.usdToTry=Number(globalFx.rates?.TRY)||null;
    state.fx.updatedAt=new Date(Number(nobitex.lastUpdate)||Date.now());
    state.fx.source=manual?"نرخ دستی شما":"میانگین خرید و فروش USDT/IRR نوبیتکس";
  }catch(e){
    if(manual){state.fx.usdToRial=manual*10;state.fx.source="نرخ دستی شما";state.fx.updatedAt=new Date()}
  }
  const input=document.getElementById("manualRate");if(input&&state.fx.usdToRial)input.value=Math.round(state.fx.usdToRial/10);
  renderRevenue();
}
function dateRevenue(date){return state.revenue.find(r=>r.date===date)?.revenue||0}
function rangeRevenue(start,end){return state.revenue.filter(r=>r.date>=start&&r.date<=end).reduce((a,r)=>a+r.revenue,0)}
function addDays(d,n){const x=new Date(d);x.setDate(x.getDate()+n);return x}
function revenuePeriods(){
  const now=new Date(),today=localISO(now),yesterday=localISO(addDays(now,-1)),weekStart=localISO(addDays(now,-6));
  const monthStart=localISO(new Date(now.getFullYear(),now.getMonth(),1));
  const prevStart=localISO(new Date(now.getFullYear(),now.getMonth()-1,1)),prevEnd=localISO(new Date(now.getFullYear(),now.getMonth(),0));
  return [
    {label:"امروز",sub:today,value:dateRevenue(today),pending:true},
    {label:"دیروز",sub:yesterday,value:dateRevenue(yesterday),pending:true},
    {label:"۷ روز اخیر",sub:`${weekStart} تا امروز`,value:rangeRevenue(weekStart,today)},
    {label:"ماه جاری تاکنون",sub:new Date(monthStart).toLocaleDateString("fa-IR",{month:"long",year:"numeric"}),value:rangeRevenue(monthStart,today),featured:true},
    {label:"ماه میلادی قبل",sub:new Date(prevStart).toLocaleDateString("fa-IR",{month:"long",year:"numeric"}),value:rangeRevenue(prevStart,prevEnd)},
    {label:`بازهٔ انتخابی: ${state.range?.label||"۲۸ روز"}`,sub:state.range?`${faDate(state.range.start)} تا ${faDate(state.range.end)}`:"",value:state.range?rangeRevenue(state.range.start,state.range.end):0,featured:true}
  ];
}
function foreignValue(usd){return state.revenueCurrency==="TRY"?usd*(state.fx.usdToTry||1):usd}
function foreignLabel(value){return new Intl.NumberFormat("fa-IR",{style:"currency",currency:state.revenueCurrency,maximumFractionDigits:2}).format(value)}
function netRial(usd){return usd*(1-state.taxRate/100)*(state.fx.usdToRial||0)}
function rialLabels(rial){return {rial:`${n(rial,"compact")} ریال`,toman:`${n(rial/10,"compact")} تومان`}}
function renderRevenue(){
  const grid=document.getElementById("revenueGrid");if(!grid)return;
  const periods=revenuePeriods();
  grid.innerHTML=periods.map(p=>{const converted=foreignValue(p.value),net=netRial(p.value),money=rialLabels(net);return `<article class="revenue-card ${p.featured?"featured":""}"><div class="period"><span>${p.label}</span>${p.pending?`<span class="pending">با تأخیر گزارش</span>`:""}</div><div class="foreign">${foreignLabel(converted)}</div><div class="gross-label">برآورد یوتیوب، پیش از کسر مفروض</div><div class="net-rial"><strong>${state.fx.usdToRial?money.toman:"نرخ تبدیل موجود نیست"}</strong><span>${state.fx.usdToRial?`${money.rial} · پس از کسر ${n(state.taxRate)}٪`:"نرخ دلار را دستی وارد کن"}</span></div></article>`}).join("");
  const status=document.getElementById("revenueStatus"),latest=state.revenue.filter(x=>x.revenue>0).at(-1)?.date;
  if(state.revenueMode==="live") status.innerHTML=`<span class="status-dot" style="background:var(--green)"></span><div><strong>درآمد واقعی YouTube Analytics متصل است</strong><small>آخرین روز دارای داده: ${latest?new Date(latest).toLocaleDateString("fa-IR"):"هنوز گزارشی نیامده"} · نرخ تبدیل: ${state.fx.source||"نامشخص"}</small></div>`;
  else status.innerHTML=`<span class="status-dot"></span><div><strong>درآمد فعلاً نمایشی است</strong><small>برای دریافت درآمد واقعی، مجوز مالی YouTube Analytics را اضافه و دوباره متصل شو. نرخ تبدیل: ${state.fx.source||"در انتظار نرخ"}</small></div>`;
  const selected=state.range?state.revenue.filter(r=>r.date>=state.range.start&&r.date<=state.range.end):state.revenue.slice(-31),chartRows=selected.map(r=>({date:r.date,views:r.revenue,watch:r.revenue*(1-state.taxRate/100)}));document.getElementById("revenueChart").innerHTML=lineSVG(chartRows,true);
  const rate=state.fx.usdToRial||0,month=periods[3],monthNet=netRial(month.value),labels=rialLabels(monthNet);
  document.getElementById("revenueFormula").innerHTML=`<div class="formula-step"><i>۱</i><div><span>درآمد گزارش‌شدهٔ ماه</span><strong>${foreignLabel(foreignValue(month.value))}</strong></div></div><div class="formula-step"><i>۲</i><div><span>پس از کسر مفروض ${n(state.taxRate)}٪</span><strong>${foreignLabel(foreignValue(month.value*(1-state.taxRate/100)))}</strong></div></div><div class="formula-step"><i>۳</i><div><span>نرخ دلار امروز</span><strong>${rate?`${n(rate/10)} تومان · ${n(rate)} ریال`:"وارد نشده"}</strong></div></div><div class="formula-step"><i>۴</i><div><span>برآورد خالص ماه جاری</span><strong>${rate?`${labels.toman} (${labels.rial})`:"—"}</strong></div></div>`;
}
async function loadRevenueData(token){
  try{
    const now=new Date(),monthStart=localISO(new Date(now.getFullYear(),now.getMonth()-1,1)),compare=comparisonRange(state.range),start=[monthStart,state.range?.start,compare?.start].filter(Boolean).sort()[0],dates=`startDate=${start}&endDate=${localISO(now)}`;
    const rows=await analyticsPages(`https://youtubeanalytics.googleapis.com/v2/reports?ids=channel%3D%3DMINE&${dates}&dimensions=day&metrics=estimatedRevenue&currency=USD&sort=day`,token);
    state.revenue=rows.map(r=>({date:r[0],revenue:Number(r[1])||0}));state.revenueMode="live";renderRevenue();
  }catch(e){console.warn("Revenue permission unavailable",e);state.revenueMode="demo";renderRevenue();showToast("برای درآمد واقعی، مجوز مالی Analytics را اضافه کن")}
}

function periodBreakdown(){
  const map=new Map();state.daily.forEach(row=>{const d=dateAtNoon(row.date),key=inclusiveDays(state.range.start,state.range.end)>370?`${d.getFullYear()}-Q${Math.floor(d.getMonth()/3)+1}`:row.date.slice(0,7);const item=map.get(key)||{key,views:0,watch:0,subs:0};item.views+=Number(row.views)||0;item.watch+=Number(row.watch)||0;item.subs+=Number(row.subs)||0;map.set(key,item)});return[...map.values()].slice(-12);
}
function renderReport(){
  const top=[...state.videos].sort((a,b)=>b.score-a.score)[0],weak=[...state.videos].sort((a,b)=>a.retention-b.retention)[0],views=sum(state.daily,"views"),previous=sum(state.comparisonDaily,"views"),change=percentChange(views,previous),breakdown=periodBreakdown();
  const rows=breakdown.map(x=>`<tr><td>${esc(x.key)}</td><td>${n(x.views)}</td><td>${n(x.watch)} ساعت</td><td>+${n(x.subs)}</td></tr>`).join("");
  document.getElementById("reportContent").innerHTML=`<article class="report-card"><h3>نتیجهٔ کلیدی دوره</h3><div class="report-number">${n(views,"compact")}</div><p>${rangeText()} · ${n(state.days)} روز داده</p></article><article class="report-card"><h3>مقایسهٔ دوره</h3><div class="report-number" style="color:var(--${change>=0?"green":"red"})">${state.comparisonMode==="none"?"—":`${change>=0?"+":"−"}${n(Math.abs(change),"decimal")}٪`}</div><p>${comparisonText()}${state.comparisonMode==="none"?"":` · ${n(previous,"compact")} بازدید`}</p></article><article class="report-card"><h3>برندهٔ دوره</h3><p><strong>${esc(top?.title||"داده‌ای نیست")}</strong></p><p>${top?`امتیاز ${n(top.score)} از ۱۰۰؛ ترکیب بازدید، ماندگاری و جذب مشترک.`:"در این بازه ویدئویی گزارش نشده است."}</p></article><article class="report-card"><h3>ضعیف‌ترین ماندگاری</h3><p><strong>${esc(weak?.title||"داده‌ای نیست")}</strong></p><p>${weak?`${n(weak.retention,"decimal")}٪ میانگین مشاهده؛ شروع و ساختار این ویدئو ارزش بازبینی دارد.`:"—"}</p></article><article class="report-card wide"><h3>روند ${inclusiveDays(state.range.start,state.range.end)>370?"فصلی":"ماهانه"}</h3><div class="table-wrap"><table><thead><tr><th>دوره</th><th>بازدید</th><th>زمان تماشا</th><th>مشترک</th></tr></thead><tbody>${rows||`<tr><td colspan="4">داده‌ای نیست.</td></tr>`}</tbody></table></div></article><article class="report-card wide"><h3>سه تصمیم پیشنهادی برای دورهٔ بعد</h3><ul><li>قالب و مجموعهٔ ویدئوی برنده را در برنامهٔ بعدی تکرار کن، اما زاویه و تیتر تازه بساز.</li><li>${weak?`هوک ویدئوی «${esc(shortTitle(weak.title,60))}» را کوتاه‌تر و مستقیم‌تر آزمایش کن.`:"پس از جمع‌شدن داده، ضعیف‌ترین ماندگاری بررسی می‌شود."}</li><li>نتیجهٔ این بازه را با «دورهٔ قبل» و سپس «همین بازه در سال قبل» مقایسه کن تا اثر فصل از رشد واقعی جدا شود.</li></ul></article>`;
}

function switchView(name){document.querySelectorAll(".view").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".nav-item[data-view]").forEach(x=>x.classList.toggle("active",x.dataset.view===name));document.getElementById(`view-${name}`)?.classList.add("active");const titles={overview:"صبح بخیر نیما؛ این‌جا نبض کانال است.",videos:"هر ویدئو، یک سرنخ برای تصمیم بعدی.",series:"ستون‌های محتوایی را با هم مقایسه کن.",audience:"ببین چه کسانی می‌آیند و چرا برمی‌گردند.",revenue:"درآمد را به عدد قابل‌استفاده تبدیل کن.",advisor:"پیشنهادهای اختصاصی برای قدم بعدی کانال.",comments:"گفت‌وگو با مخاطب، در یک صندوق واحد.",reports:"عددها را به برنامهٔ عملی تبدیل کن."};document.getElementById("pageTitle").textContent=titles[name];document.getElementById("sidebar").classList.remove("open");window.scrollTo({top:0,behavior:"smooth"})}

async function startOAuth(){
  const msg=document.getElementById("oauthMessage");
  if(!cfg.googleClientId){msg.textContent="هنوز Client ID گوگل در config.js ثبت نشده است. پس از فعال‌شدن GitHub Pages، این مرحله را با هم انجام می‌دهیم.";return}
  if(!window.google?.accounts?.oauth2){msg.textContent="کتابخانهٔ ورود گوگل هنوز بارگذاری نشده؛ چند ثانیه بعد دوباره امتحان کن.";return}
  msg.textContent="پنجرهٔ ورود گوگل در حال بازشدن است…";
  const client=google.accounts.oauth2.initTokenClient({client_id:cfg.googleClientId,scope:"https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly https://www.googleapis.com/auth/yt-analytics-monetary.readonly",callback:async response=>{if(response.error){msg.textContent=`خطای ورود: ${response.error}`;return}state.accessToken=response.access_token;await loadLiveData(response.access_token);document.getElementById("connectionDialog").close()}});client.requestAccessToken({prompt:"consent"});
}
async function api(url,token){const r=await fetch(url,{headers:{Authorization:`Bearer ${token}`}});if(!r.ok)throw new Error(`${r.status}: ${await r.text()}`);return r.json()}
async function apiRequest(url,token,options={}){const r=await fetch(url,{...options,headers:{Authorization:`Bearer ${token}`,...(options.body?{"Content-Type":"application/json"}:{}),...(options.headers||{})}});if(!r.ok)throw new Error(`${r.status}: ${await r.text()}`);return r.status===204?null:r.json()}
async function requestCommentPermission(){
  if(!window.google?.accounts?.oauth2){showToast("کتابخانهٔ ورود گوگل آماده نیست");return}
  const scopes="https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/yt-analytics.readonly https://www.googleapis.com/auth/yt-analytics-monetary.readonly";
  const client=google.accounts.oauth2.initTokenClient({client_id:cfg.googleClientId,scope:scopes,include_granted_scopes:true,callback:async response=>{if(response.error){showToast("مجوز مدیریت کامنت‌ها صادر نشد");return}state.accessToken=response.access_token;state.commentsPermission=true;if(!state.channelItem)await loadLiveData(response.access_token);await loadComments("published");renderComments();showToast("مدیریت کامنت‌ها فعال شد")}});client.requestAccessToken({prompt:"consent"});
}
async function loadLiveData(token){
  try{showToast("در حال دریافت آمار واقعی کانال…");const channel=await api("https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",token);const item=channel.items?.[0];if(!item)throw new Error("کانالی برای این حساب پیدا نشد");state.channelItem=item;
    await loadAnalyticsRange(token);
    state.mode="live";document.getElementById("channelName").textContent=item.snippet.title;document.getElementById("channelAvatar").style.backgroundImage=`url('${item.snippet.thumbnails?.default?.url}')`;document.getElementById("channelAvatar").textContent="";document.getElementById("syncState").textContent="متصل به یوتیوب";document.getElementById("syncTime").textContent="همین حالا به‌روزرسانی شد";document.querySelector(".status-dot").style.background="var(--green)";renderAll();await loadRevenueData(token);await loadRecommendationDataset(token,item);showToast("آمار و پیشنهادهای اختصاصی به‌روز شد");
  }catch(e){console.error(e);showToast("دریافت آمار کامل نشد؛ تنظیمات API را بررسی کن")}
}
async function loadAnalyticsRange(token){
  const range=state.range||presetRange("28d"),comparison=comparisonRange(range),dates=r=>`startDate=${r.start}&endDate=${r.end}`;
  const dailyUrl=r=>`https://youtubeanalytics.googleapis.com/v2/reports?ids=channel%3D%3DMINE&${dates(r)}&dimensions=day&metrics=views,estimatedMinutesWatched,subscribersGained&sort=day`;
  const videoUrl=r=>`https://youtubeanalytics.googleapis.com/v2/reports?ids=channel%3D%3DMINE&${dates(r)}&dimensions=video&metrics=views,estimatedMinutesWatched,averageViewPercentage,subscribersGained,likes,comments&sort=-views`;
  const [daily,vr,previousDaily,previousVideos]=await Promise.all([analyticsPages(dailyUrl(range),token),analyticsPages(videoUrl(range),token),comparison?analyticsPages(dailyUrl(comparison),token):Promise.resolve([]),comparison?analyticsPages(videoUrl(comparison),token):Promise.resolve([])]);
  state.daily=daily.map(r=>({date:r[0],views:Number(r[1])||0,watch:Math.round((Number(r[2])||0)/60),subs:Number(r[3])||0}));
  state.comparisonDaily=previousDaily.map(r=>({date:r[0],views:Number(r[1])||0,watch:Math.round((Number(r[2])||0)/60),subs:Number(r[3])||0}));
  state.comparisonVideos=previousVideos.map(r=>({views:Number(r[1])||0,watch:Math.round((Number(r[2])||0)/60),retention:Number(r[3])||0,subs:Number(r[4])||0}));
  const ids=vr.map(r=>r[0]),meta={};for(let i=0;i<ids.length;i+=50){const res=await api(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${ids.slice(i,i+50).join(",")}`,token);res.items?.forEach(v=>meta[v.id]=v)}
  const maxViews=Math.max(1,...vr.map(r=>Number(r[1])||0));state.videos=vr.map(r=>{const m=meta[r[0]],title=m?.snippet?.title||r[0],duration=parseDuration(m?.contentDetails?.duration||""),format=duration<=70?"short":"long",views=Number(r[1])||0,retention=Number(r[3])||0,subs=Number(r[4])||0;return{id:r[0],title,date:m?.snippet?.publishedAt?.slice(0,10)||"",format,series:detectSeries(title,format),views,watch:Math.round((Number(r[2])||0)/60),retention,subs,likes:Number(r[5])||0,comments:Number(r[6])||0,velocity:Math.round(views*.42),score:Math.min(99,Math.round((views/maxViews)*38+(retention/100)*42+Math.min(subs/250,1)*20)),thumb:m?.snippet?.thumbnails?.medium?.url}});
  state.days=inclusiveDays(range.start,range.end);updateRangeUI();
}
function parseDuration(s){const m=s.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);return m?Number(m[1]||0)*3600+Number(m[2]||0)*60+Number(m[3]||0):0}
function detectSeries(title,format){if(/جان کلام/.test(title))return format==="short"?"جان کلام کوتاه":"جان کلام";if(/رستوران|کافه|منو|غذا/.test(title))return"صنعت غذا";if(/زندگی/.test(title))return"زندگی‌های نزیسته";return"خبر و تحلیل"}
function scoreVideo(views,ret,subs){const max=Math.max(1,...state.videos.map(v=>v.views));return Math.min(99,Math.round((views/max)*38+(ret/100)*42+Math.min(subs/250,1)*20))}

function median(values){const a=values.filter(Number.isFinite).sort((x,y)=>x-y);if(!a.length)return 0;const m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2}
function videoRPM(v){return v.views>0?(Number(v.revenue)||0)/v.views*1000:0}
function subRate(v){return v.views>0?(Number(v.subs)||0)/v.views*1000:0}
function formatDollar(value){return new Intl.NumberFormat("fa-IR",{style:"currency",currency:"USD",maximumFractionDigits:2}).format(value||0)}
function shortTitle(title="",limit=54){return title.length>limit?`${title.slice(0,limit)}…`:title}

function topicSignals(videos){
  const stop=new Set("از به در با برای که این آن یک و یا را های ها می شود شده بود است اگر اما تا بر روی چه چرا هر خود تو من ما شما آنها درباره بعد پیش خیلی بیش کمتر بدون فقط وقتی چگونه کدام فیلم ویدئو youtube shorts video the a an of to in for on and is are".split(" "));
  const topics=new Map();
  videos.forEach(v=>{
    const text=[v.title,v.description,...(v.tags||[])].join(" ").toLowerCase().replace(/[\u200c_\-–—|،؛:!?؟()[\]{}«»'".,/\\]+/g," ");
    const words=[...new Set(text.split(/\s+/).map(x=>x.trim()).filter(x=>x.length>2&&!stop.has(x)&&!/^\d+$/.test(x)))];
    const quality=Math.log10((v.views||0)+10)*(1+Math.min(videoRPM(v),20)/12)*(1+(v.retention||0)/150);
    words.slice(0,40).forEach(word=>topics.set(word,(topics.get(word)||0)+quality));
  });
  return [...topics.entries()].map(([word,score])=>({word,score})).sort((a,b)=>b.score-a.score).slice(0,18);
}

function recordPerformanceSnapshot(videos){
  try{const key="nimaYoutubeSnapshots",history=JSON.parse(localStorage.getItem(key)||"[]");history.push({at:Date.now(),views:Object.fromEntries(videos.map(v=>[v.id,v.views]))});localStorage.setItem(key,JSON.stringify(history.slice(-30)))}catch(e){console.warn("Snapshot storage unavailable",e)}
}
function snapshotVelocity(video){
  const publicRows=(state.publicHistory||[]).map(snapshot=>({at:new Date(snapshot.capturedAt||snapshot.date).getTime(),video:snapshot.videos?.find(v=>v.id===video.id)})).filter(row=>row.video&&Number.isFinite(row.at));
  if(publicRows.length>=2){const first=publicRows[0],last=publicRows.at(-1),days=Math.max(1,(last.at-first.at)/864e5),growth=(Number(last.video.views)||0)-(Number(first.video.views)||0);if(growth>=0)return growth/days}
  try{const history=JSON.parse(localStorage.getItem("nimaYoutubeSnapshots")||"[]"),old=[...history].reverse().find(s=>Date.now()-s.at>12*3600000&&s.views?.[video.id]!=null);if(old){const days=Math.max(.5,(Date.now()-old.at)/864e5);return Math.max(0,(video.views-old.views[video.id])/days)}}catch(e){}
  const age=Math.max(1,(Date.now()-new Date(video.publishedAt||video.date).getTime())/864e5);return video.views/Math.min(age,365);
}
async function loadPublicHistory(){
  try{const response=await fetch(`data/public-snapshots.json?t=${Date.now()}`,{cache:"no-store"});if(!response.ok)throw new Error(`History ${response.status}`);const data=await response.json();state.publicHistory=(data.snapshots||[]).sort((a,b)=>a.date.localeCompare(b.date));state.historyUpdatedAt=data.updatedAt||null;renderAdvisor()}catch(e){console.warn("Public history unavailable",e)}
}
function tehranParts(date){const parts=new Intl.DateTimeFormat("fa-IR",{timeZone:"Asia/Tehran",weekday:"long",hour:"2-digit",hourCycle:"h23"}).formatToParts(new Date(date));const weekday=parts.find(x=>x.type==="weekday")?.value||"نامشخص",raw=parts.find(x=>x.type==="hour")?.value||"0";return{weekday,hour:Number(raw.replace(/[۰-۹]/g,d=>"۰۱۲۳۴۵۶۷۸۹".indexOf(d)))||0}}
function timeBucket(hour){if(hour<6)return{key:"night",label:"نیمه‌شب تا ۶"};if(hour<12)return{key:"morning",label:"۶ تا ۱۲"};if(hour<18)return{key:"afternoon",label:"۱۲ تا ۱۸"};return{key:"evening",label:"۱۸ تا ۲۴"}}
function durationLabel(v){if(v.format==="short")return"۳۰ تا ۶۰ ثانیه";const min=(v.duration||0)/60;if(min<8)return"۵ تا ۸ دقیقه";if(min<15)return"۸ تا ۱۵ دقیقه";return"بیش از ۱۵ دقیقه"}
function publishingSignals(){
  const videos=(state.analysisVideos||[]).filter(v=>v.views>0&&v.publishedAt),groups=new Map();if(!videos.length)return{slots:[],plans:[]};
  const maxVelocity=Math.max(1,...videos.map(snapshotVelocity)),maxRpm=Math.max(.01,...videos.map(videoRPM));
  videos.forEach(v=>{const t=tehranParts(v.publishedAt),bucket=timeBucket(t.hour),score=snapshotVelocity(v)/maxVelocity*46+(v.retention||0)/100*24+videoRPM(v)/maxRpm*20+Math.min(subRate(v)/10,1)*10,key=`${t.weekday}|${bucket.key}`;const row=groups.get(key)||{weekday:t.weekday,bucket:bucket.label,key,scores:[],hours:[],videos:[]};row.scores.push(score);row.hours.push(t.hour);row.videos.push(v);groups.set(key,row)});
  const slots=[...groups.values()].map(g=>({...g,score:median(g.scores),recommendedHour:Math.round(median(g.hours)),count:g.videos.length})).sort((a,b)=>(b.count>=2)-(a.count>=2)||b.score-a.score);
  const series={};videos.forEach(v=>(series[v.series||"سایر"]??=[]).push(v));
  const plans=Object.entries(series).map(([name,items])=>{const best=[...items].sort((a,b)=>(snapshotVelocity(b)+videoRPM(b)*30+b.retention)-(snapshotVelocity(a)+videoRPM(a)*30+a.retention))[0],t=tehranParts(best.publishedAt),slot=slots.find(s=>s.key===`${t.weekday}|${timeBucket(t.hour).key}`)||slots[0];return{name,format:best.format,length:durationLabel(best),day:slot?.weekday||t.weekday,time:`حدود ساعت ${n(slot?.recommendedHour??t.hour)}:۰۰`,score:(sum(items,"revenue")+sum(items,"watch")/100)/Math.max(1,items.length),sample:best.title}}).sort((a,b)=>b.score-a.score).slice(0,3);
  return{slots:slots.slice(0,8),plans};
}
function renderPublishingPlan(){
  const root=document.getElementById("publishingPlan");if(!root)return;const {slots,plans}=publishingSignals(),best=slots[0];
  document.getElementById("bestSlot").innerHTML=best?`<span>زمان پیشنهادی</span><strong>${esc(best.weekday)} · حدود ${n(best.recommendedHour)}:۰۰</strong><small>${esc(best.bucket)} · بر پایهٔ ${n(best.count)} انتشار مشابه</small>`:`<span>زمان پیشنهادی</span><strong>داده کافی نیست</strong><small>پس از اتصال ساخته می‌شود</small>`;
  document.getElementById("plannerMethod").textContent=state.analysisUpdatedAt?`برآورد از ساعت انتشار، سرعت رشد، نگهداشت، جذب مشترک و RPM است${state.publicHistory.length?`؛ سرعت رشد با ${n(state.publicHistory.length)} snapshot روزانه سنجیده می‌شود`:"؛ پس از اولین اجرای جمع‌آورنده، حافظهٔ روزانه نیز وارد محاسبه می‌شود"}.`:"نمونهٔ برنامه بر اساس دادهٔ نمایشی است؛ پس از اتصال با سابقهٔ واقعی کانال جایگزین می‌شود.";
  root.innerHTML=plans.map((p,i)=>`<article class="plan-card"><span class="plan-number">${n(i+1)}</span><h3>${esc(p.name)}</h3><p>الگوی موفق نزدیک: ${esc(shortTitle(p.sample,58))}</p><div class="plan-meta"><span>${p.format==="short"?"شورتز":"ویدئوی بلند"}</span><span>${esc(p.length)}</span><span>${esc(p.day)}</span><span>${esc(p.time)}</span></div></article>`).join("")||`<div class="comment-empty">برای پیشنهاد زمان و طول، دادهٔ بیشتری لازم است.</div>`;
  const max=Math.max(1,...slots.map(s=>s.score));document.getElementById("slotGrid").innerHTML=slots.map((s,i)=>`<div class="slot-cell ${i===0?"best":""}"><span>${esc(s.weekday)} · حدود ${n(s.recommendedHour)}:۰۰</span><strong>${esc(s.bucket)} · ${n(s.count)} ویدئو</strong><i style="--strength:${Math.max(8,s.score/max*100)}%"></i></div>`).join("");
}

function buildRecommendations(){
  const videos=state.analysisVideos.filter(v=>v.views>0),recs=[];
  if(!videos.length)return recs;
  const long=videos.filter(v=>v.format==="long"),shorts=videos.filter(v=>v.format==="short");
  const rpmMedian=median(videos.map(videoRPM)),retMedian=median(videos.map(v=>v.retention||0));
  const totalRevenue=sum(videos,"revenue"),totalViews=sum(videos,"views");
  const add=(priority,icon,color,title,why,body,evidence,action,score)=>recs.push({priority,icon,color,title,why,body,evidence,action,score});

  const seriesMap={};videos.forEach(v=>(seriesMap[v.series||"سایر"]??=[]).push(v));
  const bestSeries=Object.entries(seriesMap).map(([name,items])=>({name,items,revenue:sum(items,"revenue"),views:sum(items,"views"),watch:sum(items,"watch"),rpm:sum(items,"revenue")/Math.max(1,sum(items,"views"))*1000})).sort((a,b)=>b.revenue-a.revenue)[0];
  if(bestSeries)add("اولویت بالا","◆","#38d39f",`روی «${bestSeries.name}» بیشتر سرمایه‌گذاری کن`,`درآمدسازترین خانوادهٔ محتوایی کانال`,`${n(bestSeries.items.length)} ویدئوی این مجموعه بیشترین سهم درآمد را ساخته‌اند. یک دنبالهٔ نزدیک به موضوع و قالب برنده منتشر کن.`,[["درآمد",formatDollar(bestSeries.revenue)],["RPM تقریبی",formatDollar(bestSeries.rpm)],["زمان تماشا",`${n(bestSeries.watch,"compact")} ساعت`]],"اقدام: موضوع مشترک ۳ برنده را به قسمت بعدی تبدیل کن",98);

  const bestRpm=[...videos].filter(v=>v.views>=Math.max(500,totalViews/videos.length*.2)).sort((a,b)=>videoRPM(b)-videoRPM(a))[0];
  if(bestRpm)add("درآمد","$","#ffbd59","فرمول این ویدئو را تکرار کن",`RPM آن ${n(videoRPM(bestRpm)/Math.max(.01,rpmMedian),"decimal")} برابر میانهٔ کانال است`,`«${shortTitle(bestRpm.title)}» به ازای هر هزار بازدید درآمد بیشتری ساخته؛ موضوع، طول و نوع وعدهٔ عنوانش را به‌عنوان الگوی آزمایش بعدی نگه دار.`,[["RPM",formatDollar(videoRPM(bestRpm))],["درآمد",formatDollar(bestRpm.revenue)],["بازدید",n(bestRpm.views,"compact")]],"اقدام: یک ویدئوی هم‌خانواده با زاویهٔ تازه بساز",94);

  const longWinner=[...long].sort((a,b)=>b.watch-a.watch)[0];
  if(longWinner&&shorts.length)add("رشد و درآمد","↗","#6d8cff","از ویدئوی عمیق، ورودی کوتاه بساز","بیشترین زمان تماشای ویدئوهای بلند",`«${shortTitle(longWinner.title)}» ظرفیت تبدیل‌شدن به ۲ تا ۳ شورت مستقل را دارد؛ هر شورت باید به ویدئوی کامل هدایت کند.`,[["زمان تماشا",`${n(longWinner.watch,"compact")} ساعت`],["ماندگاری",`${n(longWinner.retention,"decimal")}٪`],["مشترک",`+${n(longWinner.subs)}`]],"اقدام: سه نقطهٔ اوج را به کلیپ ۳۰ تا ۵۵ ثانیه‌ای تبدیل کن",88);

  const leakage=[...videos].filter(v=>v.views>=median(videos.map(x=>x.views))&&videoRPM(v)<rpmMedian*.65).sort((a,b)=>b.views-a.views)[0];
  if(leakage)add("بهینه‌سازی","⇄","#a779ff","بازدید این ویدئو را به درآمد وصل کن","بازدید خوب دارد، اما RPM زیر میانه است",`«${shortTitle(leakage.title)}» توجه گرفته ولی درآمد متناسب نساخته است. پایان و توضیحاتش را به یک ویدئوی بلندِ پُرRPM متصل کن.`,[["بازدید",n(leakage.views,"compact")],["RPM",formatDollar(videoRPM(leakage))],["فاصله با میانه",`${n((1-videoRPM(leakage)/Math.max(.01,rpmMedian))*100)}٪`]],"اقدام: لینک، کامنت سنجاق‌شده و انداسکرین هدفمند اضافه کن",84);

  const weakRetention=[...videos].filter(v=>v.views>=median(videos.map(x=>x.views))&&v.retention<retMedian*.82).sort((a,b)=>b.views-a.views)[0];
  if(weakRetention)add("نگهداشت","◷","#ff4e61","شروع این ویدئو را بازطراحی کن","تقاضا وجود دارد اما بخشی از تماشا از دست می‌رود",`«${shortTitle(weakRetention.title)}» بازدید کافی گرفته ولی ماندگاری‌اش پایین‌تر از الگوی کانال است؛ وعدهٔ عنوان را در ۱۵ ثانیهٔ اول سریع‌تر تحویل بده.`,[["ماندگاری",`${n(weakRetention.retention,"decimal")}٪`],["میانهٔ کانال",`${n(retMedian,"decimal")}٪`],["بازدید",n(weakRetention.views,"compact")]],"اقدام: مقدمه را حذف و با نتیجه یا سؤال اصلی شروع کن",80);

  const evergreen=[...videos].filter(v=>v.recentViews>0&&Date.now()-new Date(v.date).getTime()>90*864e5).sort((a,b)=>b.recentViews-a.recentViews)[0];
  if(evergreen)add("فرصت تازه","↻","#38d39f","این موضوع قدیمی هنوز زنده است","با وجود قدمت، در ۲۸ روز اخیر بازدید گرفته",`«${shortTitle(evergreen.title)}» هنوز تقاضا دارد. نسخهٔ به‌روزشده یا پاسخ به تحولات جدید می‌تواند سریع‌تر از یک موضوع کاملاً تازه رشد کند.`,[["بازدید ۲۸ روز",n(evergreen.recentViews,"compact")],["کل بازدید",n(evergreen.views,"compact")],["درآمد",formatDollar(evergreen.revenue)]],"اقدام: نسخهٔ «چه چیزی تغییر کرده؟» را منتشر کن",76);

  const topic=topicSignals(videos)[0];
  if(topic)add("سیگنال موضوعی","#","#6d8cff",`خوشهٔ «${topic.word}» را آزمایش کن`,`این واژه در محتوای پُرتماشا و پردرآمد تکرار شده است`,`وزن این پیشنهاد از عنوان، توضیحات و تگ‌ها همراه با درآمد، بازدید و ماندگاری واقعی محاسبه شده است.`,[["رتبهٔ موضوع","۱"],["ویدئوی بررسی‌شده",n(videos.length)],["درآمد پوشش‌داده‌شده",formatDollar(totalRevenue)]],"اقدام: سه زاویهٔ تازه برای همین خوشه بنویس",72);
  return recs.sort((a,b)=>b.score-a.score).slice(0,6);
}

function renderAdvisor(){
  const root=document.getElementById("recommendationList");if(!root)return;
  const videos=state.analysisVideos||[],revenue=sum(videos,"revenue"),recs=buildRecommendations();state.recommendations=recs;
  const live=state.mode==="live"&&state.analysisUpdatedAt;
  document.getElementById("advisorSummary").textContent=live?`از ${n(videos.length)} ویدئو و عملکرد واقعی آن‌ها، ${n(recs.length)} فرصت اولویت‌دار پیدا شد.`:"نمونهٔ پیشنهادها را می‌بینی؛ پس از اتصال، تحلیل با کل آرشیو واقعی کانال جایگزین می‌شود.";
  const score=Math.min(96,Math.round(55+recs.reduce((a,r)=>a+r.score,0)/Math.max(1,recs.length)*.35));
  document.getElementById("opportunityScore").textContent=n(score);document.querySelector(".advisor-score")?.style.setProperty("--score",`${score}%`);
  document.getElementById("analyzedCount").textContent=n(videos.length);document.getElementById("analyzedRevenue").textContent=formatDollar(revenue);document.getElementById("analysisTime").textContent=state.analysisUpdatedAt?new Date(state.analysisUpdatedAt).toLocaleTimeString("fa-IR",{hour:"2-digit",minute:"2-digit"}):"دادهٔ نمونه";
  const coverage=document.getElementById("historyCoverage");if(coverage)coverage.textContent=state.publicHistory.length?`${n(state.publicHistory.length)} روز · تا ${new Date(state.historyUpdatedAt).toLocaleDateString("fa-IR")}`:"در انتظار اولین اجرا";
  root.innerHTML=recs.map(r=>`<article class="recommendation-card" style="--rec-color:${r.color}"><div class="recommendation-head"><div><span class="rec-icon">${r.icon}</span><div><h3>${esc(r.title)}</h3><p class="why">${esc(r.why)}</p></div></div><span class="priority">${r.priority}</span></div><p>${esc(r.body)}</p><div class="evidence-box">${r.evidence.map(([label,value])=>`<div><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join("")}</div><div class="rec-action"><span>قدم پیشنهادی</span><strong>${esc(r.action.replace(/^اقدام:\s*/,""))}</strong></div></article>`).join("")||`<div class="panel">برای ساخت پیشنهاد، دادهٔ کافی از ویدئوها پیدا نشد.</div>`;
  const ranked=[...videos].sort((a,b)=>videoRPM(b)-videoRPM(a)).slice(0,10);
  document.getElementById("economicsTable").innerHTML=ranked.map(v=>`<tr><td title="${esc(v.title)}">${esc(shortTitle(v.title,42))}</td><td>${formatDollar(v.revenue)}</td><td>${formatDollar(videoRPM(v))}</td><td>${n(v.retention,"decimal")}٪</td><td>${n(subRate(v),"decimal")}</td></tr>`).join("")||`<tr><td colspan="5">هنوز داده‌ای نیست.</td></tr>`;
  const colors=["#6d8cff","#a779ff","#38d39f","#ffbd59","#ff7b8a"],topics=topicSignals(videos),max=topics[0]?.score||1,min=topics.at(-1)?.score||0;
  document.getElementById("topicCloud").innerHTML=topics.map((t,i)=>`<span class="topic-tag" style="--tag-color:${colors[i%colors.length]};--tag-size:${10+((t.score-min)/Math.max(.01,max-min))*8}px">${esc(t.word)}</span>`).join("")||"سیگنال موضوعی کافی نیست.";
  renderPublishingPlan();
}

async function analyticsPages(baseUrl,token){
  const rows=[];let startIndex=1;
  for(let page=0;page<20;page++){
    const separator=baseUrl.includes("?")?"&":"?",data=await api(`${baseUrl}${separator}maxResults=200&startIndex=${startIndex}`,token),batch=data.rows||[];rows.push(...batch);
    if(batch.length<200)break;startIndex+=batch.length;
  }
  return rows;
}

async function loadRecommendationDataset(token,channelItem){
  const button=document.getElementById("refreshAdviceBtn");if(button){button.disabled=true;button.textContent="در حال تحلیل…"}
  try{
    const today=localISO(new Date()),published=(channelItem?.snippet?.publishedAt||"2005-01-01").slice(0,10),base=`https://youtubeanalytics.googleapis.com/v2/reports?ids=channel%3D%3DMINE&startDate=${published}&endDate=${today}&dimensions=video`;
    const [performance,money]=await Promise.all([
      analyticsPages(`${base}&sort=-views&metrics=views,estimatedMinutesWatched,averageViewPercentage,subscribersGained`,token),
      analyticsPages(`${base}&sort=-estimatedRevenue&metrics=estimatedRevenue&currency=USD`,token)
    ]);
    const revenueById=new Map(money.map(r=>[r[0],Number(r[1])||0])),ids=performance.map(r=>r[0]),meta={};
    for(let i=0;i<ids.length;i+=50){const res=await api(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${ids.slice(i,i+50).join(",")}`,token);res.items?.forEach(v=>meta[v.id]=v)}
    const recentById=new Map(state.videos.map(v=>[v.id,Number(v.views)||0]));
    state.analysisVideos=performance.map(r=>{const m=meta[r[0]],duration=parseDuration(m?.contentDetails?.duration||""),format=duration<=70?"short":"long",title=m?.snippet?.title||r[0],publishedAt=m?.snippet?.publishedAt||`${published}T12:00:00Z`;return{id:r[0],title,description:m?.snippet?.description||"",tags:m?.snippet?.tags||[],date:publishedAt.slice(0,10),publishedAt,duration,format,series:detectSeries(title,format),views:Number(r[1])||0,watch:Math.round((Number(r[2])||0)/60),retention:Number(r[3])||0,subs:Number(r[4])||0,revenue:revenueById.get(r[0])||0,recentViews:recentById.get(r[0])||0,thumb:m?.snippet?.thumbnails?.medium?.url||""}});
    recordPerformanceSnapshot(state.analysisVideos);state.analysisUpdatedAt=Date.now();renderAdvisor();
  }catch(e){console.error("Advisor analysis failed",e);showToast("تحلیل اختصاصی کامل نشد؛ دوباره امتحان کن")}
  finally{if(button){button.disabled=false;button.textContent="بازسازی پیشنهادها"}}
}

function relativeTime(date){const sec=Math.max(1,(Date.now()-new Date(date).getTime())/1000),units=[[86400,"روز"],[3600,"ساعت"],[60,"دقیقه"]];for(const [size,label] of units)if(sec>=size)return`${n(Math.floor(sec/size))} ${label} پیش`;return"همین حالا"}
function commentVideoTitle(videoId){return state.analysisVideos.find(v=>v.id===videoId)?.title||state.videos.find(v=>v.id===videoId)?.title||"ویدئوی کانال"}
async function loadComments(status=state.commentStatus){
  state.commentStatus=status;const list=document.getElementById("commentList");if(list)list.innerHTML=`<div class="comment-empty">در حال دریافت کامنت‌ها…</div>`;
  if(!state.commentsPermission||!state.accessToken||!state.channelItem?.id){renderComments();return}
  try{
    const url=`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&allThreadsRelatedToChannelId=${encodeURIComponent(state.channelItem.id)}&moderationStatus=${encodeURIComponent(status)}&order=time&maxResults=100&textFormat=plainText`,data=await api(url,state.accessToken);
    state.comments=(data.items||[]).map(thread=>{const c=thread.snippet.topLevelComment,s=c.snippet;return{id:c.id,author:s.authorDisplayName||"کاربر یوتیوب",avatar:s.authorProfileImageUrl||"",text:s.textDisplay||s.textOriginal||"",publishedAt:s.publishedAt,likes:s.likeCount||0,videoId:thread.snippet.videoId||s.videoId,videoTitle:commentVideoTitle(thread.snippet.videoId||s.videoId),status:s.moderationStatus||status,replyCount:thread.snippet.totalReplyCount||0,canReply:thread.snippet.canReply!==false}});
    if(status==="heldForReview")state.heldCount=state.comments.length;else{try{const held=await api(`https://www.googleapis.com/youtube/v3/commentThreads?part=id&allThreadsRelatedToChannelId=${encodeURIComponent(state.channelItem.id)}&moderationStatus=heldForReview&maxResults=1`,state.accessToken);state.heldCount=held.pageInfo?.totalResults||0}catch(e){console.warn("Held count unavailable",e)}}renderComments();
  }catch(e){console.error("Comments failed",e);showToast("دریافت کامنت‌ها کامل نشد؛ مجوز را بررسی کن");renderComments()}
}
function filteredComments(){const q=(document.getElementById("commentSearch")?.value||"").trim().toLowerCase();return(state.comments||[]).filter(c=>(!q||`${c.author} ${c.text} ${c.videoTitle}`.toLowerCase().includes(q))&&(state.commentsPermission||c.status===state.commentStatus))}
function renderComments(){
  const root=document.getElementById("commentList");if(!root)return;const comments=filteredComments(),held=state.commentsPermission?state.heldCount:(state.comments||[]).filter(c=>c.status==="heldForReview").length,questions=comments.filter(c=>/[؟?]|چرا|چطور|کِی|کی |کجا|آیا/.test(c.text)).length;
  document.getElementById("commentCount").textContent=n(comments.length);document.getElementById("heldCount").textContent=n(held);document.getElementById("questionCount").textContent=n(questions);
  const note=document.getElementById("commentsPermissionNote");if(state.commentsPermission)note.innerHTML=`<span class="status-dot" style="background:var(--green)"></span><div><strong>مدیریت کامنت‌ها فعال است</strong><small>پاسخ‌ها و تغییر وضعیت مستقیماً روی YouTube اعمال می‌شوند.</small></div>`;else note.innerHTML=`<span class="status-dot"></span><div><strong>فعلاً دادهٔ نمونه نمایش داده می‌شود</strong><small>برای دیدن و مدیریت کامنت‌های واقعی، مجوز مدیریت کامنت‌ها را فعال کن.</small></div>`;
  document.getElementById("enableCommentsBtn").textContent=state.commentsPermission?"مجوز فعال است":"فعال‌کردن مدیریت کامنت‌ها";document.getElementById("enableCommentsBtn").disabled=state.commentsPermission;
  root.innerHTML=comments.map(c=>`<article class="comment-card" data-comment-id="${esc(c.id)}"><div class="comment-avatar" ${c.avatar?`style="background-image:url('${esc(c.avatar)}')"`:""}>${c.avatar?"":esc(c.author.slice(0,1))}</div><div><div class="comment-author"><strong>${esc(c.author)}</strong><span>${relativeTime(c.publishedAt)} · ${n(c.likes)} پسند</span></div><div class="comment-video">${esc(shortTitle(c.videoTitle,75))}${c.replyCount?` · ${n(c.replyCount)} پاسخ`:""}</div><p class="comment-text">${esc(c.text)}</p></div><div class="comment-actions">${c.status==="heldForReview"?`<button class="approve" data-comment-action="approve">تأیید و انتشار</button>`:""}<button data-comment-action="reply" ${c.canReply===false?"disabled":""}>پاسخ</button><button class="reject" data-comment-action="reject">مخفی‌کردن</button></div></article>`).join("")||`<div class="comment-empty">در این بخش کامنتی پیدا نشد.</div>`;
}
function openReply(comment){const dialog=document.getElementById("replyDialog");document.getElementById("replyToName").textContent=`پاسخ به ${comment.author}`;document.getElementById("replyOriginal").textContent=comment.text;document.getElementById("replyParentId").value=comment.id;document.getElementById("replyText").value="";dialog.showModal();setTimeout(()=>document.getElementById("replyText").focus(),80)}
async function replyToComment(parentId,text){
  if(!state.commentsPermission)return requestCommentPermission();await apiRequest("https://www.googleapis.com/youtube/v3/comments?part=snippet",state.accessToken,{method:"POST",body:JSON.stringify({snippet:{parentId,textOriginal:text}})});const c=state.comments.find(x=>x.id===parentId);if(c)c.replyCount=(c.replyCount||0)+1;renderComments();showToast("پاسخ در یوتیوب منتشر شد")
}
async function moderateComment(id,status){
  if(!state.commentsPermission)return requestCommentPermission();const target=state.comments.find(c=>c.id===id),url=`https://www.googleapis.com/youtube/v3/comments/setModerationStatus?id=${encodeURIComponent(id)}&moderationStatus=${encodeURIComponent(status)}`;await apiRequest(url,state.accessToken,{method:"POST"});if(target?.status==="heldForReview")state.heldCount=Math.max(0,state.heldCount-1);state.comments=state.comments.filter(c=>c.id!==id);renderComments();showToast(status==="published"?"کامنت منتشر شد":"کامنت مخفی شد")
}

function updateRangePreview(){
  const start=document.getElementById("rangeStart")?.value,end=document.getElementById("rangeEnd")?.value,preview=document.getElementById("rangePreview");if(!preview||!start||!end)return;
  if(start>end){preview.textContent="تاریخ شروع باید پیش از تاریخ پایان باشد.";return}const range={start,end},mode=document.getElementById("comparisonMode")?.value||"previous",compare=comparisonRange(range,mode);preview.innerHTML=`<strong>${n(inclusiveDays(start,end))} روز</strong> · ${faDate(start)} تا ${faDate(end)}${compare?`<br>مقایسه با ${faDate(compare.start)} تا ${faDate(compare.end)} (${compare.label})`:" · بدون مقایسه"}`;
}
function fillRangeDialog(){
  document.getElementById("rangeStart").value=state.range.start;document.getElementById("rangeEnd").value=state.range.end;document.getElementById("comparisonMode").value=state.comparisonMode;document.querySelectorAll("[data-dialog-preset]").forEach(b=>b.classList.toggle("active",b.dataset.dialogPreset===state.rangePreset));updateRangePreview();
}
function updateRangeUI(){
  const quick=["7d","28d","90d"];document.querySelectorAll("[data-range-preset]").forEach(b=>b.classList.toggle("active",b.dataset.rangePreset===state.rangePreset));const more=document.getElementById("openRangeDialog"),label=document.getElementById("activeRangeLabel");if(more&&label){const advanced=!quick.includes(state.rangePreset);more.classList.toggle("has-custom",advanced);label.textContent=advanced?state.range.label:"بازه‌های بیشتر"}document.getElementById("pageSubtitle").textContent=`عملکرد ${rangeText()} · مقایسه با ${comparisonText()}`;
}
async function applyReportingRange(range,preset=range.key||"custom",comparisonMode=state.comparisonMode){
  if(!range.start||!range.end||range.start>range.end){showToast("بازهٔ زمانی معتبر نیست");return}if(range.end>localISO(new Date())){showToast("تاریخ پایان نمی‌تواند در آینده باشد");return}
  state.range={...range,key:preset,label:range.label||"بازهٔ دلخواه"};state.rangePreset=preset;state.comparisonMode=comparisonMode;state.days=inclusiveDays(range.start,range.end);document.body.classList.add("range-loading");updateRangeUI();
  try{if(state.mode==="live"&&state.accessToken){await loadAnalyticsRange(state.accessToken);await loadRevenueData(state.accessToken);renderAll()}else{state.daily=buildDemoRange(state.range);const compare=comparisonRange(state.range);state.comparisonDaily=compare?buildDemoRange(compare).map(x=>({...x,views:Math.round(x.views*.88),watch:Math.round(x.watch*.9),subs:Math.round(x.subs*.91)})):[];state.comparisonVideos=state.comparisonMode==="none"?[]:demoVideos.map(v=>({...v,retention:v.retention-2}));state.videos=[...demoVideos];renderAll()}showToast(`گزارش ${state.range.label} آماده شد`)}catch(e){console.error("Range update failed",e);showToast("دریافت این بازه کامل نشد؛ دوباره امتحان کن")}finally{document.body.classList.remove("range-loading")}
}

document.addEventListener("DOMContentLoaded",()=>{
  renderAll();
  loadPublicHistory();
  loadFxRates();
  document.querySelectorAll(".nav-item[data-view]").forEach(b=>b.addEventListener("click",()=>switchView(b.dataset.view)));
  document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>switchView(b.dataset.go)));
  updateRangeUI();
  document.querySelectorAll("[data-range-preset]").forEach(b=>b.addEventListener("click",()=>applyReportingRange(presetRange(b.dataset.rangePreset),b.dataset.rangePreset,state.comparisonMode)));
  const rangeDialog=document.getElementById("rangeDialog"),closeRange=()=>rangeDialog.close();document.getElementById("openRangeDialog")?.addEventListener("click",()=>{fillRangeDialog();rangeDialog.showModal()});document.getElementById("closeRangeDialog")?.addEventListener("click",closeRange);document.getElementById("cancelRangeDialog")?.addEventListener("click",closeRange);
  document.querySelectorAll("[data-dialog-preset]").forEach(b=>b.addEventListener("click",()=>{const key=b.dataset.dialogPreset;document.querySelectorAll("[data-dialog-preset]").forEach(x=>x.classList.toggle("active",x===b));state.pendingRangePreset=key;if(key!=="custom"){const r=presetRange(key);document.getElementById("rangeStart").value=r.start;document.getElementById("rangeEnd").value=r.end}updateRangePreview()}));
  ["rangeStart","rangeEnd","comparisonMode"].forEach(id=>document.getElementById(id)?.addEventListener("change",()=>{if(id!=="comparisonMode"){state.pendingRangePreset="custom";document.querySelectorAll("[data-dialog-preset]").forEach(x=>x.classList.toggle("active",x.dataset.dialogPreset==="custom"))}updateRangePreview()}));
  document.getElementById("rangeForm")?.addEventListener("submit",async e=>{e.preventDefault();const start=document.getElementById("rangeStart").value,end=document.getElementById("rangeEnd").value,mode=document.getElementById("comparisonMode").value,preset=state.pendingRangePreset||state.rangePreset,label=preset==="custom"?"بازهٔ دلخواه":presetRange(preset).label;if(start>end){showToast("تاریخ شروع باید قبل از پایان باشد");return}closeRange();await applyReportingRange({start,end,label,key:preset},preset,mode);state.pendingRangePreset=null});
  ["videoSearch","formatFilter","sortFilter"].forEach(id=>document.getElementById(id)?.addEventListener(id==="videoSearch"?"input":"change",renderVideoTable));
  document.getElementById("menuBtn").addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));
  const dialog=document.getElementById("connectionDialog");["connectBtn","settingsBtn"].forEach(id=>document.getElementById(id).addEventListener("click",()=>dialog.showModal()));
  document.getElementById("oauthStartBtn").addEventListener("click",startOAuth);
  document.getElementById("exportBtn").addEventListener("click",()=>{switchView("reports");setTimeout(()=>window.print(),250)});
  document.getElementById("generateReportBtn").addEventListener("click",()=>{renderReport();showToast("گزارش تازه بر اساس بازهٔ انتخاب‌شده ساخته شد")});
  document.getElementById("taxRate").addEventListener("input",e=>{state.taxRate=Math.min(100,Math.max(0,Number(e.target.value)||0));renderRevenue()});
  document.getElementById("revenueCurrency").addEventListener("change",e=>{state.revenueCurrency=e.target.value;renderRevenue()});
  document.getElementById("manualRate").addEventListener("change",e=>{const toman=Number(e.target.value);if(toman>0){localStorage.setItem("nimaManualUsdToman",String(toman));state.fx.usdToRial=toman*10;state.fx.source="نرخ دستی شما";state.fx.updatedAt=new Date();renderRevenue();showToast("نرخ دستی دلار ذخیره شد")}else{localStorage.removeItem("nimaManualUsdToman");loadFxRates()}});
  document.getElementById("refreshAdviceBtn")?.addEventListener("click",()=>{if(!state.accessToken){showToast("برای تحلیل واقعی، ابتدا حساب یوتیوب را متصل کن");return}loadRecommendationDataset(state.accessToken,state.channelItem)});
  document.getElementById("enableCommentsBtn")?.addEventListener("click",requestCommentPermission);
  document.getElementById("refreshCommentsBtn")?.addEventListener("click",()=>loadComments());
  document.getElementById("commentSearch")?.addEventListener("input",renderComments);
  document.querySelectorAll("[data-comment-status]").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("[data-comment-status]").forEach(x=>x.classList.toggle("active",x===b));loadComments(b.dataset.commentStatus)}));
  document.getElementById("commentList")?.addEventListener("click",async e=>{const action=e.target.closest("[data-comment-action]")?.dataset.commentAction,id=e.target.closest(".comment-card")?.dataset.commentId;if(!action||!id)return;const comment=state.comments.find(c=>c.id===id);try{if(action==="reply")openReply(comment);if(action==="approve")await moderateComment(id,"published");if(action==="reject"&&confirm("این کامنت از نمایش عمومی مخفی شود؟"))await moderateComment(id,"rejected")}catch(err){console.error(err);showToast("انجام این عملیات ممکن نشد")}});
  const closeReply=()=>document.getElementById("replyDialog").close();document.getElementById("closeReplyDialog")?.addEventListener("click",closeReply);document.getElementById("cancelReply")?.addEventListener("click",closeReply);
  document.getElementById("replyForm")?.addEventListener("submit",async e=>{e.preventDefault();const id=document.getElementById("replyParentId").value,text=document.getElementById("replyText").value.trim();if(!text)return;const submit=e.target.querySelector('[type="submit"]');submit.disabled=true;try{await replyToComment(id,text);closeReply()}catch(err){console.error(err);showToast("ارسال پاسخ ممکن نشد")}finally{submit.disabled=false}});
});
