const QUESTIONS = {
 reading:[
 {part:"Part 5 · Hoàn thành câu",prompt:"Please submit the completed expense report _____ Friday afternoon.",options:["A. by","B. since","C. during","D. while"],answer:0,explanation:"“By Friday afternoon” nghĩa là chậm nhất vào chiều thứ Sáu. Giới từ by diễn tả hạn chót."},
 {part:"Part 5 · Từ loại",prompt:"The manager gave a very _____ presentation about the new project.",options:["A. inform","B. information","C. informative","D. informedly"],answer:2,explanation:"Sau very và trước danh từ presentation cần tính từ. Informative có nghĩa là cung cấp nhiều thông tin."},
 {part:"Part 5 · Ngữ pháp",prompt:"Neither the director nor the employees _____ available for the meeting yesterday.",options:["A. is","B. are","C. was","D. were"],answer:3,explanation:"Với neither…nor, động từ thường hòa hợp với chủ ngữ gần nhất (employees – số nhiều). Yesterday dùng quá khứ were."},
 {part:"Part 6 · Ngữ cảnh",prompt:"Due to unexpected maintenance, the main entrance will remain closed _____ further notice.",options:["A. until","B. across","C. among","D. beside"],answer:0,explanation:"Until further notice là cụm cố định, nghĩa là cho đến khi có thông báo mới."},
 {part:"Part 5 · Từ vựng",prompt:"All applicants must provide a valid form of _____ before the interview.",options:["A. identify","B. identity","C. identification","D. identifiable"],answer:2,explanation:"Sau form of cần danh từ. Identification nghĩa là giấy tờ hoặc hành động xác minh danh tính."}
 ],
 listening:[
 {part:"Part 2 · Hỏi đáp ngắn",prompt:"When will the quarterly meeting begin?",options:["A. In the main conference room.","B. At 2:30 this afternoon.","C. The quarterly report."],answer:1,explanation:"When hỏi thời gian. “At 2:30 this afternoon” là câu trả lời phù hợp. Bài mẫu hiện dùng câu chữ thay cho audio ghi âm."},
 {part:"Part 2 · Hỏi đáp ngắn",prompt:"“Where should I leave these documents?”",options:["A. On Ms. Lee’s desk.","B. They were documented.","C. At three o’clock."],answer:0,explanation:"Where hỏi địa điểm. “On Ms. Lee’s desk” trả lời đúng vị trí."},
 {part:"Part 2 · Hỏi đáp ngắn",prompt:"“Has the client confirmed the appointment?”",options:["A. The appointment book is blue.","B. Yes, she called this morning.","C. At the client’s office."],answer:1,explanation:"Câu hỏi Has…confirmed? hỏi việc đã được xác nhận chưa. Đáp án B trả lời Yes và bổ sung thời điểm."},
 {part:"Part 2 · Hỏi đáp ngắn",prompt:"“Who is responsible for preparing the sales report?”",options:["A. The sales department is.","B. It was sold yesterday.","C. About twenty pages."],answer:0,explanation:"Who hỏi người hoặc bộ phận chịu trách nhiệm. The sales department là chủ thể phù hợp."},
 {part:"Part 2 · Hỏi đáp ngắn",prompt:"“Why was the delivery delayed?”",options:["A. By express courier.","B. Because of bad weather.","C. Tomorrow morning."],answer:1,explanation:"Why hỏi lý do. Because of bad weather nêu nguyên nhân giao hàng chậm."}
 ]
};
const DEFAULT_WORDS=[];
const KEY="toeicStudy_v1";
let data=loadData(),currentQuestions=[],currentIndex=0,selected=null,answered=false,sessionStart=0,sessionCorrect=0,currentType="reading";
function loadData(){try{return JSON.parse(localStorage.getItem(KEY))||{minutes:0,questions:0,correct:0,words:DEFAULT_WORDS,sessions:[]}}catch{return {minutes:0,questions:0,correct:0,words:DEFAULT_WORDS,sessions:[]}}}
function save(){localStorage.setItem(KEY,JSON.stringify(data));renderStats();if(window.TOEIC_CLOUD_SAVE){window.TOEIC_CLOUD_SAVE(data)}}
function setText(id,value){const el=document.getElementById(id);if(el)el.textContent=value}
function renderStats(){
 const accuracy=data.questions?Math.round(data.correct/data.questions*100)+"%":"—",today=new Date().toLocaleDateString("vi-VN");
 setText("minutes-stat",data.minutes+" phút");setText("questions-stat",data.questions);setText("accuracy-stat",accuracy);setText("words-stat",data.words.length);
 const todayMinutes=data.sessions.filter(s=>s.date===today).reduce((n,s)=>n+s.minutes,0);setText("daily-minutes",todayMinutes);
 const circle=document.querySelector(".goal-circle");if(circle)circle.style.background="conic-gradient(var(--purple) "+Math.min(360,todayMinutes/30*360)+"deg,#eceaf8 0deg)";
 setText("progress-total",data.questions);setText("progress-correct",data.correct);setText("progress-rate",accuracy);setText("progress-sessions",data.sessions.length);renderWords();renderHistory();
}
function setView(name){
 document.querySelectorAll(".view").forEach(e=>e.classList.remove("active-view"));const el=document.getElementById("view-"+name);if(el)el.classList.add("active-view");
 document.querySelectorAll(".nav-link").forEach(e=>e.classList.toggle("active",e.dataset.view===name));
 const titles={overview:["Chào bạn! Sẵn sàng học TOEIC chưa?","Mỗi ngày một chút, tiến bộ từng bước."],practice:["Luyện tập TOEIC","Chọn phần luyện nghe hoặc đọc phù hợp với bạn."],vocabulary:["Sổ từ vựng của bạn","Lưu từ mới và ôn tập bất cứ lúc nào."],progress:["Tiến độ học tập","Nhìn lại những nỗ lực bạn đã tích lũy."]};
 setText("page-title",titles[name][0]);setText("page-subtitle",titles[name][1]);window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>setView(b.dataset.view)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>setView(b.dataset.go)));
document.querySelectorAll("[data-start]").forEach(b=>b.addEventListener("click",()=>{const t=b.dataset.start;if(t==="vocabulary"){setView("vocabulary");return}setView("practice");startQuiz(t)}));
function startQuiz(type){currentType=type;currentQuestions=QUESTIONS[type].map(q=>({...q}));currentIndex=0;selected=null;answered=false;sessionStart=Date.now();sessionCorrect=0;document.getElementById("quiz").classList.remove("hidden");renderQuestion();document.getElementById("quiz").scrollIntoView({behavior:"smooth",block:"start"})}
function renderQuestion(){
 const q=currentQuestions[currentIndex],box=document.getElementById("quiz");box.innerHTML="";
 const meta=document.createElement("div");meta.className="quiz-meta";meta.innerHTML="<span>"+q.part+"</span><span>Câu "+(currentIndex+1)+" / "+currentQuestions.length+"</span>";box.append(meta);
 const heading=document.createElement("h3");heading.textContent=q.prompt;box.append(heading);if(currentType==="listening"){const play=document.createElement("button");play.className="outline-btn";play.textContent="▶ Nghe câu hỏi tiếng Anh";play.addEventListener("click",()=>{if(!("speechSynthesis" in window)){alert("Trình duyệt này chưa hỗ trợ đọc văn bản.");return}window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(q.prompt);utterance.lang="en-US";utterance.rate=0.88;window.speechSynthesis.speak(utterance)});box.append(play)}
 const answers=document.createElement("div");answers.className="answers";
 q.options.forEach((a,i)=>{const btn=document.createElement("button");btn.className="answer";btn.textContent=a;if(selected===i)btn.classList.add("selected");if(answered&&i===q.answer)btn.classList.add("correct");if(answered&&selected===i&&i!==q.answer)btn.classList.add("wrong");btn.disabled=answered;btn.addEventListener("click",()=>{selected=i;renderQuestion()});answers.append(btn)});box.append(answers);
 if(answered){const feedback=document.createElement("div");feedback.className="quiz-feedback";feedback.style.background=selected===q.answer?"#f0faf5":"#fff5f5";feedback.textContent=(selected===q.answer?"Chính xác! ":"Chưa đúng. Đáp án là "+q.options[q.answer]+". ")+q.explanation;box.append(feedback)}
 const controls=document.createElement("div");controls.className="quiz-controls";const count=document.createElement("small");count.className="muted";count.textContent=answered?"Đã ghi nhận câu trả lời":"Chọn một đáp án để tiếp tục";
 const btn=document.createElement("button");btn.className="primary-btn";btn.textContent=!answered?"Kiểm tra đáp án":currentIndex===currentQuestions.length-1?"Hoàn thành":"Câu tiếp theo";btn.disabled=!answered&&selected===null;btn.style.opacity=btn.disabled?".45":"1";
 btn.addEventListener("click",()=>{if(!answered){answered=true;data.questions++;if(selected===q.answer){data.correct++;sessionCorrect++}save();renderQuestion()}else if(currentIndex<currentQuestions.length-1){currentIndex++;selected=null;answered=false;renderQuestion()}else finishQuiz()});controls.append(count,btn);box.append(controls);
}
function finishQuiz(){
 const elapsed=Math.max(1,Math.round((Date.now()-sessionStart)/60000));data.minutes+=elapsed;data.sessions.unshift({date:new Date().toLocaleDateString("vi-VN"),minutes:elapsed,correct:sessionCorrect,total:currentQuestions.length});data.sessions=data.sessions.slice(0,30);save();
 const box=document.getElementById("quiz");box.innerHTML="<div class='quiz-meta'><span>HOÀN THÀNH BÀI LUYỆN</span><span>✦</span></div><h3>Bạn đã hoàn thành bài luyện tập!</h3><div class='quiz-prompt'><b>"+sessionCorrect+" / "+currentQuestions.length+" câu đúng</b><br>Hãy xem lại phần giải thích để ghi nhớ kiến thức lâu hơn.</div><button class='primary-btn' id='again'>Luyện lại bài đọc →</button>";document.getElementById("again").addEventListener("click",()=>startQuiz(currentType));
}
document.getElementById("word-form").addEventListener("submit",e=>{e.preventDefault();const en=document.getElementById("word-en").value.trim(),vi=document.getElementById("word-vi").value.trim();if(!en||!vi)return;data.words.unshift({en,vi});save();e.target.reset()});
function renderWords(){const list=document.getElementById("word-list");if(!list)return;list.innerHTML="";if(!data.words.length){list.innerHTML="<p class='muted'>Chưa có từ vựng. Hãy thêm từ đầu tiên nhé.</p>";return}data.words.forEach((w,i)=>{const row=document.createElement("div");row.className="word-card";const en=document.createElement("strong");en.textContent=w.en;const vi=document.createElement("span");vi.textContent=w.vi;const del=document.createElement("button");del.textContent="×";del.title="Xóa từ";del.addEventListener("click",()=>{data.words.splice(i,1);save()});row.append(en,vi,del);list.append(row)})}
function renderHistory(){const list=document.getElementById("history-list");if(!list)return;list.innerHTML="";if(!data.sessions.length){list.innerHTML="<p class='muted'>Bạn chưa hoàn thành phiên luyện tập nào.</p>";return}data.sessions.forEach(s=>{const row=document.createElement("div");row.className="history-row";const left=document.createElement("span");left.textContent=s.date+" · "+s.minutes+" phút";const right=document.createElement("b");right.textContent=s.correct+"/"+s.total+" câu đúng";row.append(left,right);list.append(row)})}
document.getElementById("reset-demo").addEventListener("click",()=>{if(confirm("Bạn có chắc muốn xóa toàn bộ tiến độ và từ vựng trên thiết bị này?")){localStorage.removeItem(KEY);data=loadData();save()}});
setText("today-label",new Date().toLocaleDateString("vi-VN",{weekday:"long",day:"numeric",month:"long"}));
if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}))}
renderStats();

window.ToeicStudy={getData:()=>data,setData:(next)=>{data=next;localStorage.setItem(KEY,JSON.stringify(data));renderStats()}};
