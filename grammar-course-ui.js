(()=> {
const root=document.getElementById("grammarSection"),data=window.TOEIC_GRAMMAR_LESSONS;
if(!root||!Array.isArray(data)||document.getElementById("grammarCourseV2"))return;
document.getElementById("courseCurriculum")?.remove();
const style=document.createElement("style");style.textContent="#grammarCourseV2{margin:18px 0}#grammarCourseV2 h2{margin:0 0 6px}#grammarCourseV2 .course-intro{color:var(--muted);font-size:13px;margin:0 0 14px}.glesson{border:1px solid var(--line);border-radius:14px;background:#fff;margin:12px 0;overflow:hidden}.glesson>summary{cursor:pointer;padding:15px 17px;font-weight:800;display:flex;justify-content:space-between;gap:10px;align-items:center}.glesson[open]>summary{border-bottom:1px solid var(--line);background:#f7f9fc}.glesson-body{padding:14px 16px}.glesson-body h3{margin:15px 0 8px}.glesson-notes{white-space:pre-wrap;overflow-wrap:anywhere;font:14px/1.75 system-ui,sans-serif;color:#263448;background:#f8fafc;border-radius:10px;padding:14px;margin:10px 0}.gq{border-top:1px solid var(--line);padding:13px 0}.gq-title{font-weight:700;margin-bottom:9px}.gq-option{display:block;width:100%;text-align:left;padding:10px 12px;border:1px solid var(--line);border-radius:9px;background:#fff;margin:6px 0;cursor:pointer;color:inherit}.gq-option.selected{border-color:#315efb;background:#eef3ff}.gq-option.correct{border-color:#16834a;background:#e9f8ef}.gq-option.incorrect{border-color:#c43d3d;background:#fff0f0}.gq-explain{background:#f2f7f3;border-radius:8px;padding:10px;margin-top:8px;font-size:13px;line-height:1.6}.gq-meta{color:var(--muted);font-size:12px}.glesson-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:14px}.glesson-actions button{border:1px solid var(--line);border-radius:9px;padding:10px 13px;background:white;cursor:pointer;font-weight:700}.glesson-actions .primary{background:var(--navy);color:white}.glesson-score{font-weight:800}";document.head.append(style);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const section=document.createElement("section");section.id="grammarCourseV2";
section.innerHTML='<h2>Ngữ pháp theo 7 buổi học</h2><p class="course-intro">Mỗi buổi gồm phần kiến thức cần nhớ và bài tập thực hành. Câu hỏi được lấy từ phần chữa BTVN tương ứng; đáp án và giải thích mở sau khi bạn nộp bài.</p>';
data.forEach((lesson,idx)=>{
 const d=document.createElement("details");d.className="glesson";d.open=idx===0;
 const sum=document.createElement("summary");sum.innerHTML='<span>'+esc(lesson.title)+'</span><span class="gq-meta">'+lesson.questions.length+' câu</span>';
 const body=document.createElement("div");body.className="glesson-body";
 const notes=document.createElement("div");notes.className="glesson-notes";notes.textContent=lesson.notes;
 const h1=document.createElement("h3");h1.textContent="1. Kiến thức cần nhớ";body.append(h1,notes);
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
 submit.addEventListener("click",()=>{state.submitted=true;let correct=0;[...form.querySelectorAll(".gq")].forEach((card,qi)=>{const q=lesson.questions[qi],selected=state.answers[qi];if(selected===q.answer)correct++;card.querySelectorAll("button").forEach((b,oi)=>{const label=q.options[oi].label;if(label===q.answer)b.classList.add("correct");else if(label===selected)b.classList.add("incorrect");b.disabled=true});card.querySelector(".gq-explain").hidden=false});score.textContent="Kết quả: "+correct+"/"+lesson.questions.length+" câu đúng";submit.disabled=true;});
 reset.addEventListener("click",()=>{state.answers={};state.submitted=false;score.textContent="";form.querySelectorAll(".gq").forEach(card=>{card.querySelectorAll("button").forEach(b=>{b.disabled=false;b.classList.remove("selected","correct","incorrect")});card.querySelector(".gq-explain").hidden=true});submit.disabled=true});
 actions.append(submit,reset,score);body.append(form,actions);d.append(sum,body);section.append(d);
});
const anchor=document.getElementById("grammarList");if(anchor)anchor.parentNode.insertBefore(section,anchor);else root.append(section);
})();