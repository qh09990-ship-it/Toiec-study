(()=> {
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const K="toeicStudy_tools_v1";
const getState=()=>{try{return JSON.parse(localStorage.getItem(K)||"{}")}catch(e){return {}}};
const saveState=s=>localStorage.setItem(K,JSON.stringify(s));
const css=document.createElement("style");
css.textContent=".vocab-view-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}.vocab-view-tabs button{border:1px solid var(--line);border-radius:10px;background:#fff;padding:10px 14px;font-weight:750}.vocab-view-tabs button.active{background:var(--navy);color:#fff}#vocabListView,#vocabDueView{display:none}.vocab-mode-list #vocabListView,.vocab-mode-due #vocabDueView{display:block}.vocab-mode-list .card-wrap,.vocab-mode-list .progress,.vocab-mode-list .card-buttons,.vocab-mode-list #spacedRate,.vocab-mode-list #vCaption,.vocab-mode-due .card-wrap,.vocab-mode-due .progress,.vocab-mode-due .card-buttons,.vocab-mode-due #spacedRate,.vocab-mode-due #vCaption{display:none!important}.vocab-table{width:100%;border-collapse:collapse;background:white}.vocab-table th,.vocab-table td{padding:9px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}.vocab-table th{background:#f6f8fc;font-size:12px}.vocab-table .en{font-weight:800;color:#172b4d}.vocab-table .ipa{font-size:13px;color:#596579}.vocab-table .meaning,.due-card .meaning{color:#176b37;font-weight:750}.vocab-table .example{font-size:12px;color:#667085}.due-card,.course-lesson{background:white;border:1px solid var(--line);border-radius:12px;padding:13px;margin:9px 0}.due-card strong{font-size:19px}.course-curriculum{margin:18px 0}.course-lesson summary{cursor:pointer;font-weight:800}.course-lesson pre{white-space:pre-wrap;overflow-wrap:anywhere;font:14px/1.7 system-ui,sans-serif;margin:12px 0 0}";
document.head.append(css);
const vocab=$("vocabSection"),grammar=$("grammarSection");
if(vocab){
 const stats=vocab.querySelector(".stats");
 if(stats&&!$("vocabViewTabs"))stats.insertAdjacentHTML("afterend",'<div class="vocab-view-tabs" id="vocabViewTabs"><button class="active" data-vmode="flash">Flashcard</button><button data-vmode="list">Danh sách từ vựng</button><button data-vmode="due">Từ đến hạn ôn tập</button></div><div id="vocabListView"></div><div id="vocabDueView"></div>');
 function ipaDots(raw){
  if(!raw)return "";
  let s=String(raw),lead=s.startsWith("/")?"/":"",trail=s.endsWith("/")?"/":"",core=s.replace(/^\/|\/$/g,"");
  if(core.includes("."))return s;
  const matches=[...core.matchAll(/[iɪeɛæɑɒɔoʊuʌəɜɐɚɝɨʉɯɤøœɵ]+/gu)].map(m=>({start:m.index,end:m.index+m[0].length}));
  if(matches.length<2)return s;
  const onsets=["str","spl","spr","skw","thr","sk","sp","st","sm","sn","sl","sw","tw","dw","kw","pr","br","tr","dr","kr","gr","fr","pl","bl","kl","gl","fl","θr","ʃr","pj","bj","kj","mj","nj","fj","vj","hj","wr","j","w","r","l","m","n","ŋ","f","v","θ","ð","s","z","ʃ","ʒ","h","p","b","t","d","k","g","tʃ","dʒ"];
  const cuts=[];
  for(let i=0;i<matches.length-1;i++){
   const a=matches[i],b=matches[i+1],cluster=core.slice(a.end,b.start);if(!cluster)continue;
   let onset="";for(const c of onsets)if(cluster.endsWith(c)&&c.length>onset.length)onset=c;
   if(!onset)onset=cluster.slice(-1);
   let cut=b.start-onset.length;while(cut>0&&/[ˈˌ]/.test(core[cut-1]))cut--;
   if(cut>0&&cut<core.length)cuts.push(cut);
  }
  for(const p of cuts.reverse())core=core.slice(0,p)+"."+core.slice(p);
  return lead+core+trail;
 }
 function filtered(){
  const q=$("vSearch").value.trim().toLowerCase(),l=$("vLesson").value,lv=$("vLevel").value;
  return VOCAB.filter(x=>(!l||x.lesson===l)&&(!lv||x.level===lv)&&(!q||[x.en,x.vi,x.ipa,x.example,x.pos].some(v=>String(v||"").toLowerCase().includes(q))));
 }
 function renderList(){
  const arr=filtered(),target=$("vocabListView");
  target.innerHTML='<p>'+arr.length+' / '+VOCAB.length+' từ vựng</p>'+(arr.length?'<table class="vocab-table"><thead><tr><th>#</th><th>Từ · Phiên âm · Ví dụ</th><th>Từ loại</th><th>Buổi</th><th>Nghĩa</th></tr></thead><tbody>'+arr.map((x,i)=>'<tr><td>'+(i+1)+'</td><td><div class="en">'+esc(x.en)+'</div><div class="ipa">'+esc(ipaDots(x.ipa||""))+'</div><div class="example">'+esc(x.example||"")+'</div></td><td>'+esc(x.pos||"")+'</td><td>'+esc(x.lesson||"")+'</td><td class="meaning">'+esc(x.vi||"")+'</td></tr>').join("")+'</tbody></table>':'<p>Không tìm thấy từ phù hợp.</p>');
 }
 function renderDue(){
  const st=getState(),review=st.review||{},now=Date.now();
  const arr=Object.entries(review).filter(e=>Number(e[1].due||0)<=now).map(e=>({key:e[0],x:VOCAB.find(x=>x.lesson+"::"+x.en===e[0])})).filter(o=>o.x);
  $("vocabDueView").innerHTML='<p>'+arr.length+' từ đến hạn ôn tập</p>'+(arr.length?arr.map(o=>'<article class="due-card"><strong>'+esc(o.x.en)+'</strong><div>'+esc(ipaDots(o.x.ipa||""))+' · '+esc(o.x.lesson)+'</div><div class="meaning">'+esc(o.x.vi)+'</div><p>'+esc(o.x.example||"")+'</p><button data-open="'+esc(o.key)+'">Mở flashcard</button><button data-grade="again" data-key="'+esc(o.key)+'">Chưa nhớ</button><button data-grade="good" data-key="'+esc(o.key)+'">Đã nhớ</button><button data-grade="easy" data-key="'+esc(o.key)+'">Dễ</button></article>').join(""):'<p>Chưa có từ đến hạn. Hãy lật flashcard và đánh giá mức độ ghi nhớ để hệ thống lên lịch ôn.</p>');
  $("vocabDueView").querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>{setMode("flash");$("vSearch").value=b.dataset.open.split("::").slice(1).join("::");$("vSearch").dispatchEvent(new Event("input"))});
  $("vocabDueView").querySelectorAll("[data-grade]").forEach(b=>b.onclick=()=>{const s=getState();s.review=s.review||{};const ms={again:600000,good:259200000,easy:604800000};s.review[b.dataset.key]={due:Date.now()+ms[b.dataset.grade],grade:b.dataset.grade};saveState(s);renderDue()});
 }
 function setMode(mode){
  vocab.classList.remove("vocab-mode-list","vocab-mode-due");
  if(mode==="list")vocab.classList.add("vocab-mode-list");
  if(mode==="due")vocab.classList.add("vocab-mode-due");
  $("vocabViewTabs").querySelectorAll("button").forEach(b=>b.classList.toggle("active",b.dataset.vmode===mode));
  if(mode==="list")renderList();if(mode==="due")renderDue();
 }
 $("vocabViewTabs").querySelectorAll("button").forEach(b=>b.onclick=()=>setMode(b.dataset.vmode));
 ["vSearch","vLesson","vLevel"].forEach(id=>$(id).addEventListener(id==="vSearch"?"input":"change",()=>{renderList();if(vocab.classList.contains("vocab-mode-due"))renderDue()}));
 const word=$("wordIpa");
 if(word&&window.MutationObserver){const obs=new MutationObserver(()=>{const v=word.textContent;if(v&&v!=="Chưa có IPA")word.textContent=ipaDots(v)});obs.observe(word,{childList:true,characterData:true,subtree:true});if(word.textContent)word.textContent=ipaDots(word.textContent)}
}
if(grammar&&Array.isArray(window.TOEIC_CURRICULUM)&&!$("courseCurriculum")){
 const anchor=$("grammarList"),section=document.createElement("section");section.className="course-curriculum";section.id="courseCurriculum";
 section.innerHTML='<h3>Kiến thức cần nhớ – đầy đủ theo 7 buổi</h3><p>Nội dung lấy từ đúng phần ghi chú trong tài liệu BTVN bạn đã gửi. Buổi 1 hiển thị phần mẹo chung đầu bài vì tài liệu buổi 1 không có mục riêng tên “Kiến thức cần nhớ”.</p>';
 window.TOEIC_CURRICULUM.forEach(item=>{const d=document.createElement("details");d.className="course-lesson";const summary=document.createElement("summary");summary.textContent=item.title;const pre=document.createElement("pre");pre.textContent=item.content;d.append(summary,pre);section.append(d)});
 if(anchor)anchor.parentNode.insertBefore(section,anchor);
}
})();