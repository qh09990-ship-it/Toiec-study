(()=> {
const root=document.getElementById("grammarSection"),data=window.TOEIC_GRAMMAR_LESSONS;
if(!root||!Array.isArray(data)||document.getElementById("grammarCourseV2"))return;
document.getElementById("courseCurriculum")?.remove();
const style=document.createElement("style");style.textContent="#grammarCourseV2{margin:18px 0}.glesson-topic{border:1px solid var(--line);border-radius:9px;padding:10px 12px;margin:8px 0;background:#fbfcfe}.glesson-topic summary{cursor:pointer;font-weight:750}.glesson-topic-content{padding:8px 2px;line-height:1.65}.glesson-topic-content p{margin:5px 0}#grammarCourseV2 h2{margin:0 0 6px}#grammarCourseV2 .course-intro{color:var(--muted);font-size:13px;margin:0 0 14px}.glesson{border:1px solid var(--line);border-radius:14px;background:#fff;margin:12px 0;overflow:hidden}.glesson>summary{cursor:pointer;padding:15px 17px;font-weight:800;display:flex;justify-content:space-between;gap:10px;align-items:center}.glesson[open]>summary{border-bottom:1px solid var(--line);background:#f7f9fc}.glesson-body{padding:14px 16px}.glesson-body h3{margin:15px 0 8px}.glesson-notes{white-space:pre-wrap;overflow-wrap:anywhere;font:14px/1.75 system-ui,sans-serif;color:#263448;background:#f8fafc;border-radius:10px;padding:14px;margin:10px 0}.gq{border-top:1px solid var(--line);padding:13px 0}.gq-title{font-weight:700;margin-bottom:9px}.gq-option{display:block;width:100%;text-align:left;padding:10px 12px;border:1px solid var(--line);border-radius:9px;background:#fff;margin:6px 0;cursor:pointer;color:inherit}.gq-option.selected{border-color:#315efb;background:#eef3ff}.gq-option.correct{border-color:#16834a;background:#e9f8ef}.gq-option.incorrect{border-color:#c43d3d;background:#fff0f0}.gq-explain{background:#f2f7f3;border-radius:8px;padding:10px;margin-top:8px;font-size:13px;line-height:1.6}.gq-meta{color:var(--muted);font-size:12px}.glesson-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:14px}.glesson-actions button{border:1px solid var(--line);border-radius:9px;padding:10px 13px;background:white;cursor:pointer;font-weight:700}.glesson-actions .primary{background:var(--navy);color:white}.glesson-score{font-weight:800}";document.head.append(style);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const section=document.createElement("section");section.id="grammarCourseV2";
section.innerHTML='<h2>Ngữ pháp theo 8 buổi học</h2><p class="course-intro">Mỗi buổi gồm phần kiến thức cần nhớ và bài tập thực hành. Câu hỏi được lấy từ phần chữa BTVN tương ứng; đáp án và giải thích mở sau khi bạn nộp bài.</p>';
data.forEach((lesson,idx)=>{
 const d=document.createElement("details");d.className="glesson";d.open=idx===0;
 const sum=document.createElement("summary");sum.innerHTML='<span>'+esc(lesson.title)+'</span><span class="gq-meta">'+lesson.questions.length+' câu</span>';
 const body=document.createElement("div");body.className="glesson-body";
 const notes=document.createElement("div");notes.className="glesson-notes";notes.textContent=lesson.notes;
 const h1=document.createElement("h3");h1.textContent="1. Kiến thức cần nhớ";body.append(h1,notes);
 const topics=(typeof GRAMMAR!=="undefined"?GRAMMAR:[]).filter(t=>t.lesson==="Buổi "+lesson.lesson);
 if(topics.length||lesson.lesson===1){
  const th=document.createElement("h3");th.textContent="Các chủ điểm và cấu trúc ngữ pháp trong buổi "+lesson.lesson;body.append(th);
  topics.forEach(t=>{const item=document.createElement("details");item.className="glesson-topic";const sm=document.createElement("summary");sm.textContent=t.title;const content=document.createElement("div");content.className="glesson-topic-content";content.innerHTML='<p>'+esc(t.summary)+'</p><b>Công thức / cấu trúc</b><p>'+esc(t.formula)+'</p><b>Cách dùng</b><p>'+esc(t.usage)+'</p><b>Ví dụ</b><p>'+esc(t.example)+'</p><p>'+esc(t.translation)+'</p><p><b>Mẹo TOEIC:</b> '+esc(t.tip)+(t.mistake?' <br><b>Lỗi cần tránh:</b> '+esc(t.mistake):'')+'</p>';item.append(sm,content);body.append(item)});
 }
 if(lesson.lesson===1){
  const patterns=[
   {title:"Failure to + V",formula:"failure + to + động từ nguyên mẫu (V)",meaning:"Việc không làm được / không thực hiện được một việc gì đó.",example:"The advertising agency's failure to meet the deadline disappointed the client.",translation:"Việc công ty quảng cáo không đáp ứng thời hạn đã khiến khách hàng thất vọng.",note:"Failure là danh từ; to meet là động từ nguyên mẫu có to. Cả cụm failure to meet the deadline có thể làm chủ ngữ hoặc tân ngữ trong câu."},
   {title:"The importance of + V-ing",formula:"the importance of + danh từ / V-ing",meaning:"Tầm quan trọng của một việc hoặc hành động nào đó.",example:"The marketing manager emphasized the importance of understanding customer needs.",translation:"Giám đốc marketing nhấn mạnh tầm quan trọng của việc thấu hiểu nhu cầu khách hàng.",note:"Of là giới từ; khi theo sau là một hành động, động từ phải ở dạng V-ing. Không dùng to V sau of trong cấu trúc này."}
  ];
  const ph=document.createElement("h3");ph.textContent="Cấu trúc trọng tâm đi kèm Buổi 1";body.append(ph);
  patterns.forEach(p=>{const item=document.createElement("details");item.className="glesson-topic";const sm=document.createElement("summary");sm.textContent=p.title;const content=document.createElement("div");content.className="glesson-topic-content";content.innerHTML='<b>Công thức</b><p>'+esc(p.formula)+'</p><b>Ý nghĩa</b><p>'+esc(p.meaning)+'</p><b>Ví dụ</b><p>'+esc(p.example)+'</p><p>'+esc(p.translation)+'</p><p>'+esc(p.note)+'</p>';item.append(sm,content);body.append(item)});
 }
 const h2=document.createElement("h3");h2.textContent="2. Bài tập thực hành";body.append(h2);
 const form=document.createElement("div");form.className="glesson-quiz";
 const state={answers:{},submitted:false};
 lesson.questions.forEach((q,qi)=>{
  const card=document.createElement("div");card.className="gq";
  const title=document.createElement("div");title.className="gq-title";title.textContent="Câu "+(qi+1)+". "+q.question;card.append(title);
  q.options.forEach((opt,oi)=>{
   const b=document.createElement("button");b.type="button";b.className="gq-option";b.textContent=opt.label+". "+opt.text;
   b.addEventListener("click",()=>{if(state.submitted)return;state.answers[qi]=opt.label;card.querySelectorAll("button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");submit.disabled=Object.keys(state.answers).length!==lesson.questions.length;});
   card.append(b);
  });
  const explain=document.createElement("div");explain.className="gq-explain";explain.hidden=true;explain.textContent="Đáp án: "+q.answer+". "+q.explanation;card.append(explain);form.append(card);
 });
 const actions=document.createElement("div");actions.className="glesson-actions";
 const submit=document.createElement("button");submit.className="primary";submit.textContent="Nộp bài buổi "+lesson.lesson;submit.disabled=true;
 const reset=document.createElement("button");reset.textContent="Làm lại";
 const score=document.createElement("span");score.className="glesson-score";
 submit.addEventListener("click",()=>{state.submitted=true;let correct=0;[...form.querySelectorAll(".gq")].forEach((card,qi)=>{const q=lesson.questions[qi],selected=state.answers[qi];if(selected===q.answer)correct++;card.querySelectorAll("button").forEach((b,oi)=>{const label=q.options[oi].label;if(label===q.answer)b.classList.add("correct");else if(label===selected)b.classList.add("incorrect");b.disabled=true});card.querySelector(".gq-explain").hidden=false});const total=lesson.questions.length,percent=Math.round(correct/total*100),wrong=total-correct;
  score.textContent="Điểm: "+correct+"/"+total+" câu đúng · "+percent+"% · Sai "+wrong+" câu";
  submit.disabled=true;});
 reset.addEventListener("click",()=>{state.answers={};state.submitted=false;score.textContent="";form.querySelectorAll(".gq").forEach(card=>{card.querySelectorAll("button").forEach(b=>{b.disabled=false;b.classList.remove("selected","correct","incorrect")});card.querySelector(".gq-explain").hidden=true});submit.disabled=true});
 actions.append(submit,reset,score);body.append(form,actions);

 // Bài tập từ vựng theo đúng buổi học: điền từ đã học vào câu tiếng Anh.
 const lessonWords=(Array.isArray(window.VOCAB)?window.VOCAB:[])
  .filter(x=>x.lesson==="Buổi "+lesson.lesson&&x.en);
 const shuffled=lessonWords.slice().sort(()=>Math.random()-.5).slice(0,5);
 if(shuffled.length){
  const vh=document.createElement("h3");vh.textContent="3. Vận dụng từ vựng của buổi "+lesson.lesson;body.append(vh);
  const intro=document.createElement("p");intro.className="gq-meta";intro.textContent="Chọn từ tiếng Anh phù hợp để hoàn thành câu. Các lựa chọn chỉ hiển thị bằng tiếng Anh; nghĩa và giải thích sẽ xuất hiện sau khi nộp bài.";body.append(intro);
  const vform=document.createElement("div");vform.className="glesson-quiz";
  const vstate={answers:{},submitted:false};
  const vqs=shuffled.map(word=>{
   const sentence=word.example&&word.example.toLowerCase().includes(word.en.toLowerCase())?word.example.replace(word.en,"________"):"Choose the English word that means: "+word.vi;
   const pool=lessonWords.filter(x=>x.en!==word.en).map(x=>x.en);
   const wrong=pool.sort(()=>Math.random()-.5).slice(0,3);
   const choices=[word.en,...wrong].sort(()=>Math.random()-.5);
   return {word,sentence,choices,answer:choices.indexOf(word.en)};
  });
  vqs.forEach((q,qi)=>{
   const card=document.createElement("div");card.className="gq";
   const title=document.createElement("div");title.className="gq-title";title.textContent="Từ vựng "+(qi+1)+". "+q.sentence;card.append(title);
   q.choices.forEach((choice,oi)=>{
    const b=document.createElement("button");b.type="button";b.className="gq-option";b.textContent=String.fromCharCode(65+oi)+". "+choice;
    b.addEventListener("click",()=>{if(vstate.submitted)return;vstate.answers[qi]=oi;card.querySelectorAll("button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");vsubmit.disabled=Object.keys(vstate.answers).length!==vqs.length});
    card.append(b);
   });
   const explain=document.createElement("div");explain.className="gq-explain";explain.hidden=true;
   explain.textContent="Đáp án: "+q.word.en+" – "+q.word.vi+". "+(q.word.example_vi||"");card.append(explain);vform.append(card);
  });
  const vactions=document.createElement("div");vactions.className="glesson-actions";
  const vsubmit=document.createElement("button");vsubmit.className="primary";vsubmit.textContent="Nộp bài từ vựng buổi "+lesson.lesson;vsubmit.disabled=true;
  const vreset=document.createElement("button");vreset.textContent="Làm lại bài từ vựng";
  const vscore=document.createElement("span");vscore.className="glesson-score";
  vsubmit.addEventListener("click",()=>{vstate.submitted=true;let correct=0;[...vform.querySelectorAll(".gq")].forEach((card,qi)=>{const selected=vstate.answers[qi],q=vqs[qi];if(selected===q.answer)correct++;card.querySelectorAll("button").forEach((b,oi)=>{if(oi===q.answer)b.classList.add("correct");else if(oi===selected)b.classList.add("incorrect");b.disabled=true});card.querySelector(".gq-explain").hidden=false});const total=vqs.length;vscore.textContent="Điểm từ vựng: "+correct+"/"+total+" · "+Math.round(correct/total*100)+"% · Sai "+(total-correct)+" câu";vsubmit.disabled=true});
  vreset.addEventListener("click",()=>{vstate.answers={};vstate.submitted=false;vscore.textContent="";vform.querySelectorAll(".gq").forEach(card=>{card.querySelectorAll("button").forEach(b=>{b.disabled=false;b.classList.remove("selected","correct","incorrect")});card.querySelector(".gq-explain").hidden=true});vsubmit.disabled=true});
  vactions.append(vsubmit,vreset,vscore);body.append(vform,vactions);
 }
 d.append(sum,body);section.append(d);
});
const anchor=document.getElementById("grammarList");if(anchor){anchor.style.display="none";const controls=anchor.parentElement?.querySelector(".panel");if(controls)controls.style.display="none";anchor.parentNode.insertBefore(section,anchor)}else root.append(section);
})();