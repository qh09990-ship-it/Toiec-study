(() => {
 const bank=window.TOEIC_LESSONS;
 if(!bank)return;
 const $=id=>document.getElementById(id);
 let vocabPage=0; const pageSize=20;
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 function renderVocab(){
  const q=$("course-vocab-search").value.trim().toLocaleLowerCase("vi"),lesson=$("course-vocab-lesson").value,level=$("course-vocab-level").value;
  const rows=bank.vocab.filter(x=>(!lesson||x.lesson===lesson)&&(!level||x.level===level)&&(!q||[x.en,x.vi,x.ipa,x.pos,x.example,x.example_vi,x.lesson].join(" ").toLocaleLowerCase("vi").includes(q)));
  const pages=Math.max(1,Math.ceil(rows.length/pageSize));vocabPage=Math.min(vocabPage,pages-1);
  $("course-vocab-count").textContent="Đang hiển thị "+rows.length+" / 730 mục từ vựng";
  $("course-vocab-page").textContent="Trang "+(vocabPage+1)+" / "+pages;
  $("course-vocab-prev").disabled=vocabPage===0;$("course-vocab-next").disabled=vocabPage>=pages-1;
  $("course-vocab-list").innerHTML=rows.slice(vocabPage*pageSize,(vocabPage+1)*pageSize).map(x=>'<article class="course-word"><div class="course-word-top"><div><div class="course-word-en">'+esc(x.en)+'</div><div class="course-word-ipa">'+esc(x.ipa||"Chưa có IPA")+'</div></div><span class="lesson-pill">'+esc(x.lesson)+'</span></div><div class="course-word-meta">'+esc(x.pos)+' · '+esc(x.level)+'</div><div class="course-word-vi">'+esc(x.vi)+'</div>'+(x.example?'<div class="course-word-example"><b>Ví dụ:</b><p>'+esc(x.example)+'</p>'+(x.example_vi?'<p>'+esc(x.example_vi)+'</p>':'')+'</div>':'')+'</article>').join("")||'<div class="panel">Không tìm thấy từ phù hợp.</div>';
 }
 function renderGrammar(){
  const q=$("course-grammar-search").value.trim().toLocaleLowerCase("vi"),lesson=$("course-grammar-lesson").value;
  const rows=bank.grammar.filter(x=>(!lesson||x.lesson===lesson)&&(!q||[x.title,x.summary,x.formula,x.usage,x.example,x.tip,x.mistake,x.lesson].join(" ").toLocaleLowerCase("vi").includes(q)));
  $("course-grammar-count").textContent="Đang hiển thị "+rows.length+" / 48 chủ đề ngữ pháp";
  $("course-grammar-list").innerHTML=rows.map(x=>'<article class="course-topic"><span class="lesson-pill">'+esc(x.lesson)+'</span><h3>'+esc(x.title)+'</h3><p>'+esc(x.summary)+'</p><h4>Công thức / cấu trúc</h4><div class="formula">'+esc(x.formula)+'</div><h4>Cách dùng</h4><p>'+esc(x.usage)+'</p><div class="topic-example"><b>Ví dụ:</b><p>'+esc(x.example)+'</p><p>'+esc(x.translation)+'</p></div><div class="topic-tip"><b>Mẹo làm bài:</b> '+esc(x.tip)+(x.mistake?'<br><b>Lỗi cần tránh:</b> '+esc(x.mistake):'')+'</div></article>').join("")||'<div class="panel">Không tìm thấy chủ đề phù hợp.</div>';
 }
 ["course-vocab-search","course-vocab-lesson","course-vocab-level"].forEach(id=>$(id).addEventListener(id.endsWith("search")?"input":"change",()=>{vocabPage=0;renderVocab()}));
 $("course-vocab-prev").addEventListener("click",()=>{vocabPage=Math.max(0,vocabPage-1);renderVocab()});
 $("course-vocab-next").addEventListener("click",()=>{vocabPage++;renderVocab()});
 ["course-grammar-search","course-grammar-lesson"].forEach(id=>$(id).addEventListener(id.endsWith("search")?"input":"change",renderGrammar));
 const oldSetView=window.setView;
 window.setView=function(name){if(oldSetView)oldSetView(name);if(name==="vocabulary")renderVocab();if(name==="grammar")renderGrammar()};
 renderVocab();renderGrammar();
})();