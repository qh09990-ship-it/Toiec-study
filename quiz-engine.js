(()=> {
const $=id=>document.getElementById(id),esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const old=$("quizPart");
old.innerHTML='<option value="all">Tổng hợp 4 nhóm</option><option value="vocab">Từ vựng trong 7 buổi</option><option value="grammar">Ngữ pháp trong 7 buổi</option><option value="apply">Vận dụng kiến thức đã học</option><option value="toeic">Mở rộng theo định dạng TOEIC</option>';
const sample=(arr,n)=>{const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a.slice(0,n)};
const uniq=a=>[...new Set(a.filter(Boolean))];
const vocabBank=()=>sample(VOCAB.filter(x=>x.en&&x.vi),5).map(x=>{const wrong=sample(uniq(VOCAB.filter(y=>y.vi!==x.vi).map(y=>y.vi)),3);const opts=sample([x.vi,...wrong],4);return {group:"Từ vựng · "+x.lesson,q:'Từ "'+x.en+'" có nghĩa là gì?',opts,answer:opts.indexOf(x.vi),explain:x.en+" ("+x.pos+") = "+x.vi+".",source:"730 từ vựng trong tài liệu 7 buổi."}});
const grammarBank=()=>sample(GRAMMAR.filter(x=>x.title&&x.formula),5).map(x=>{const wrong=sample(uniq(GRAMMAR.filter(y=>y.formula!==x.formula).map(y=>y.formula)),3);const opts=sample([x.formula,...wrong],4);return {group:"Ngữ pháp · "+x.lesson,q:'Chọn công thức phù hợp với chủ đề: '+x.title,opts,answer:opts.indexOf(x.formula),explain:x.summary+" Công thức: "+x.formula,source:"48 chủ đề ngữ pháp hiện có trong tài liệu học."}});
const apply=[
{q:"The manager requested a detailed _____ of the sales figures.",opts:["analyze","analysis","analytical","analyst"],answer:1,explain:"Sau a detailed cần danh từ. Analysis là danh từ chỉ bản phân tích.",source:"Vận dụng kiến thức từ loại và danh từ – Buổi 1."},
{q:"Please check _____ information on the company's official website.",opts:["a","an","the","Ø"],answer:2,explain:"Cụm on the company's official website xác định thông tin nào nên dùng the.",source:"Vận dụng kiến thức mạo từ – Buổi 2."},
{q:"The cat looks _____ in the basket.",opts:["cute","cutely","cuteness","cuterly"],answer:0,explain:"Look mang nghĩa trông có vẻ là động từ nối; theo sau là tính từ.",source:"Vận dụng linking verbs – Buổi 3."},
{q:"Neither the manager nor the employees _____ about the maintenance.",opts:["knows","know","is knowing","has known"],answer:1,explain:"Neither A nor B: động từ chia theo chủ ngữ gần nhất B (the employees), số nhiều.",source:"Vận dụng hòa hợp chủ ngữ – động từ – Buổi 4."},
{q:"Everybody _____ the annual company party.",opts:["enjoy","enjoys","are enjoying","enjoying"],answer:1,explain:"Everybody là đại từ bất định số ít; hiện tại đơn dùng enjoys.",source:"Vận dụng hiện tại đơn và đại từ bất định – Buổi 5."},
{q:"Look! The employees _____ the new policy now.",opts:["discuss","discussed","are discussing","have discussed"],answer:2,explain:"Look! và now là dấu hiệu hiện tại tiếp diễn: am/is/are + V-ing.",source:"Vận dụng hiện tại tiếp diễn – Buổi 6."},
{q:"Ms. Lee _____ here since 2020.",opts:["works","worked","has worked","is working"],answer:2,explain:"Since + mốc thời gian, hành động kéo dài đến hiện tại: hiện tại hoàn thành has + V3.",source:"Vận dụng hiện tại hoàn thành – Buổi 7."},
{q:"We _____ the invoice yesterday.",opts:["send","sent","have sent","are sending"],answer:1,explain:"Yesterday là mốc quá khứ đã kết thúc; dùng quá khứ đơn, send → sent.",source:"Vận dụng quá khứ đơn – Buổi 7."}
].map(x=>({...x,group:"Bài tập vận dụng"}));
const toeic=[
{q:"The manager asked all employees _____ the updated safety guidelines.",opts:["review","to review","reviewing","reviewed"],answer:1,explain:"Ask + object + to-infinitive.",source:"Câu tự biên soạn theo dạng TOEIC Part 5; không phải câu hỏi chính thức."},
{q:"The new software is _____ than the previous version.",opts:["efficient","more efficient","most efficient","efficiency"],answer:1,explain:"So sánh hơn với tính từ dài: more efficient.",source:"Câu tự biên soạn theo dạng TOEIC Part 5; không phải câu hỏi chính thức."},
{q:"All invoices must be submitted _____ the fifth day of each month.",opts:["by","during","among","while"],answer:0,explain:"By diễn tả hạn chót: trước hoặc vào ngày thứ năm.",source:"Câu tự biên soạn theo dạng TOEIC Part 5; không phải câu hỏi chính thức."},
{q:"Ms. Chen has worked in the accounting department _____ 2021.",opts:["for","since","during","until"],answer:1,explain:"Since đi với mốc thời gian.",source:"Câu tự biên soạn theo dạng TOEIC Part 5; không phải câu hỏi chính thức."},
{q:"The conference room is currently _____.",opts:["available","availability","avail","availably"],answer:0,explain:"Sau is cần tính từ: available.",source:"Câu tự biên soạn theo dạng TOEIC Part 5; không phải câu hỏi chính thức."},
{q:"When will the delivery arrive?",opts:["At approximately 3 p.m.","At the loading dock.","The blue package."],answer:0,explain:"When hỏi thời gian; đáp án nêu thời điểm.",source:"Câu tự biên soạn theo dạng TOEIC Listening Part 2; không có audio."},
{q:"Where can I find the application form?",opts:["Next Monday.","On the company website.","For two weeks."],answer:1,explain:"Where hỏi địa điểm; đáp án là trên website công ty.",source:"Câu tự biên soạn theo dạng TOEIC Listening Part 2; không có audio."},
{q:"Who is leading the training session?",opts:["In the main hall.","Mr. Davis from HR.","At nine o'clock."],answer:1,explain:"Who hỏi người phụ trách.",source:"Câu tự biên soạn theo dạng TOEIC Listening Part 2; không có audio."}
].map(x=>({...x,group:"TOEIC mở rộng"}));
let quiz=[],answers={},submitted=false;
function build(){
 const mode=old.value;
 let a=[];
 if(mode==="all")a=[...sample(vocabBank(),5),...sample(grammarBank(),5),...sample(apply,5),...sample(toeic,5)];
 if(mode==="vocab")a=vocabBank();
 if(mode==="grammar")a=grammarBank();
 if(mode==="apply")a=sample(apply,8);
 if(mode==="toeic")a=sample(toeic,8);
 quiz=a;answers={};submitted=false;draw();
}
function draw(){
 const correct=quiz.filter((q,i)=>answers[i]===q.answer).length;
 $("quizArea").innerHTML='<p><b>'+quiz.length+' câu hỏi</b> · '+(submitted?'Kết quả: '+correct+'/'+quiz.length+' câu đúng':'Chọn một đáp án cho mỗi câu rồi nộp bài.')+'</p>'+quiz.map((q,i)=>'<div class="quiz-q"><small>'+esc(q.group)+'</small><p>'+esc(q.q)+'</p>'+q.opts.map((o,j)=>'<button class="quiz-opt '+(answers[i]===j?'chosen ':'')+(submitted&&j===q.answer?'right':submitted&&answers[i]===j?'wrong':'')+'" data-q="'+i+'" data-a="'+j+'" '+(submitted?'disabled':'')+'>'+String.fromCharCode(65+j)+'. '+esc(o)+'</button>').join("")+(submitted?'<p class="tool-muted">'+(answers[i]===q.answer?'Chính xác. ':'Chưa đúng. Đáp án: '+q.opts[q.answer]+'. ')+esc(q.explain)+'</p><p class="tool-muted">Nguồn: '+esc(q.source)+'</p>':'')+'</div>').join("")+'<div class="tool-row">'+(submitted?'<button class="primary" id="quizAgain">Làm bài khác</button>':'<button class="primary" id="quizSubmit" '+(Object.keys(answers).length!==quiz.length?'disabled':'')+'>Nộp bài</button>')+'</div><p class="tool-muted">Bộ mở rộng tham khảo cấu trúc bài thi từ ETS. Website không sao chép nguyên văn câu hỏi có bản quyền.</p><p><a href="https://www.ets.org/toeic/test-takers/prepare.html" target="_blank" rel="noopener">Tài liệu luyện thi TOEIC chính thức của ETS</a></p>';
 $("quizArea").querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>{answers[+b.dataset.q]=+b.dataset.a;draw()});
 $("quizSubmit")?.addEventListener("click",()=>{submitted=true;draw()});$("quizAgain")?.addEventListener("click",build);
}
$("quizBegin").onclick=build;
})();