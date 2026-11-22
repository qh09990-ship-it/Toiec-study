(() => {
 const status=document.getElementById("account-status");
 const message=document.getElementById("account-message");
 const email=document.getElementById("account-email");
 const password=document.getElementById("account-password");
 const login=document.getElementById("account-login");
 const register=document.getElementById("account-register");
 const logout=document.getElementById("account-logout");
 const cfg=window.TOEIC_SUPABASE_CONFIG||{};
 const say=(title,detail)=>{if(status)status.textContent=title;if(message)message.textContent=detail};
 const signedIn=(yes)=>{login.classList.toggle("hidden",yes);register.classList.toggle("hidden",yes);logout.classList.toggle("hidden",!yes);email.classList.toggle("hidden",yes);password.classList.toggle("hidden",yes)};
 if(!cfg.url||!cfg.anonKey||!window.supabase){
   [email,password,login,register,logout].forEach(el=>{if(el)el.disabled=true});
   say("Chưa kết nối tài khoản","Tiến độ đang lưu trên trình duyệt này. Sau khi cấu hình Supabase Free, phần đăng nhập và đồng bộ sẽ hoạt động.");
   return;
 }
 const client=window.supabase.createClient(cfg.url,cfg.anonKey);
 let writeTimer=null;
 window.TOEIC_CLOUD_SAVE=(payload)=>{
   if(writeTimer)clearTimeout(writeTimer);
   writeTimer=setTimeout(async()=>{
     const {data:{user}}=await client.auth.getUser();
     if(!user)return;
     const {error}=await client.from("learning_data").upsert({user_id:user.id,payload,updated_at:new Date().toISOString()},{onConflict:"user_id"});
     if(error)say("Chưa đồng bộ được",error.message);
     else say("Đã đồng bộ tài khoản", "Tiến độ học của bạn đã được lưu trên tài khoản.");
   },900);
 };
 async function loadUser(user){
   if(!user){signedIn(false);say("Chưa đăng nhập","Tiến độ đang lưu trên thiết bị này. Đăng nhập để đồng bộ khi đã cấu hình Supabase.");return}
   signedIn(true);say("Đang tải dữ liệu…",user.email||"Tài khoản đã đăng nhập");
   const {data:row,error}=await client.from("learning_data").select("payload").eq("user_id",user.id).maybeSingle();
   if(error){say("Lỗi tải dữ liệu",error.message);return}
   if(row&&row.payload){window.ToeicStudy.setData(row.payload);say("Đã đồng bộ tài khoản","Tiến độ và sổ từ vựng đã được tải về thiết bị này.")}
   else {window.TOEIC_CLOUD_SAVE(window.ToeicStudy.getData());say("Đã tạo dữ liệu học","Dữ liệu trên thiết bị này được lưu vào tài khoản.")}
 }
 login.addEventListener("click",async()=>{
   const e=email.value.trim(),p=password.value;
   if(!e||!p){say("Thiếu thông tin","Hãy nhập email và mật khẩu.");return}
   say("Đang đăng nhập…","Đang xác minh tài khoản.");
   const {data,error}=await client.auth.signInWithPassword({email:e,password:p});
   if(error){say("Đăng nhập chưa thành công",error.message);return}
   await loadUser(data.user);
 });
 register.addEventListener("click",async()=>{
   const e=email.value.trim(),p=password.value;
   if(!e||p.length<6){say("Kiểm tra thông tin","Nhập email hợp lệ và mật khẩu tối thiểu 6 ký tự.");return}
   say("Đang tạo tài khoản…","Kiểm tra email nếu Supabase yêu cầu xác nhận.");
   const {data,error}=await client.auth.signUp({email:e,password:p});
   if(error){say("Không tạo được tài khoản",error.message);return}
   if(data.session)await loadUser(data.user);
   else say("Hãy xác nhận email","Mở hộp thư của bạn và bấm liên kết xác nhận, sau đó quay lại đăng nhập.");
 });
 logout.addEventListener("click",async()=>{await client.auth.signOut();signedIn(false);say("Đã đăng xuất","Bạn có thể tiếp tục học; tiến độ cục bộ vẫn còn trên thiết bị này.")});
 client.auth.onAuthStateChange((_event,session)=>{if(session?.user)loadUser(session.user);else signedIn(false)});
 client.auth.getSession().then(({data})=>{if(data.session?.user)loadUser(data.session.user);else signedIn(false)});
})();