(() => {
  const $ = id => document.getElementById(id);
  const status = $("account-status"), message = $("account-message");
  const email = $("account-email"), password = $("account-password");
  const login = $("account-login"), register = $("account-register"), logout = $("account-logout");
  const cfg = window.TOEIC_SUPABASE_CONFIG || {};
  const say = (title, detail) => {
    if (status) status.textContent = title;
    if (message) message.textContent = detail || "";
  };
  const signedIn = yes => {
    [login, register].forEach(el => { if (el) el.classList.toggle("hide", yes); });
    [email, password].forEach(el => { if (el) el.classList.toggle("hide", yes); });
    if (logout) logout.classList.toggle("hide", !yes);
  };
  if (!cfg.url || !cfg.anonKey || !window.supabase || !login || !register || !logout) {
    say("Chưa kết nối được tài khoản", "Kiểm tra cấu hình Supabase và tải lại trang. Tiến độ hiện tại vẫn được lưu trên thiết bị.");
    return;
  }

  const client = window.supabase.createClient(cfg.url, cfg.anonKey);
  const META = "toeicStudy_sync_updated_at";
  const isStudyKey = key => key.startsWith("toeicStudy_") || key === "toeicStudy_v1";
  const readLocal = () => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && isStudyKey(key)) data[key] = localStorage.getItem(key);
    }
    return data;
  };
  const applyLocal = storage => {
    Object.keys(localStorage).forEach(key => { if (isStudyKey(key)) localStorage.removeItem(key); });
    Object.entries(storage || {}).forEach(([key, value]) => {
      if (isStudyKey(key) && typeof value === "string") localStorage.setItem(key, value);
    });
  };

  let timer = null, activeUser = null, loading = false;
  const saveNow = async (duringLoad = false) => {
    if (!activeUser || (loading && !duringLoad)) return;
    const updatedAt = new Date().toISOString();
    const payload = { storage: readLocal(), updatedAt };
    const { error } = await client.from("learning_data").upsert(
      { user_id: activeUser.id, payload, updated_at: updatedAt },
      { onConflict: "user_id" }
    );
    if (error) say("Chưa đồng bộ được", error.message);
    else {
      localStorage.setItem(META, updatedAt);
      say("Đã đồng bộ tài khoản", "Tiến độ học đã được lưu. Bạn có thể đăng nhập tài khoản này trên thiết bị khác.");
    }
  };
  window.TOEIC_CLOUD_SAVE = () => {
    localStorage.setItem(META, new Date().toISOString());
    if (!activeUser) return;
    clearTimeout(timer);
    timer = setTimeout(saveNow, 800);
  };

  async function loadUser(user) {
    if (!user) {
      activeUser = null; signedIn(false);
      say("Chưa đăng nhập", "Tiến độ vẫn lưu trên thiết bị này. Đăng nhập cùng tài khoản trên các thiết bị để đồng bộ.");
      return;
    }
    if (activeUser?.id === user.id && loading) return;
    activeUser = user; loading = true; signedIn(true);
    say("Đang đồng bộ dữ liệu…", user.email || "Tài khoản đã đăng nhập");
    try {
      const { data: row, error } = await client.from("learning_data")
        .select("payload,updated_at").eq("user_id", user.id).maybeSingle();
      if (error) throw error;
      const local = readLocal();
      const localTime = Date.parse(localStorage.getItem(META) || "1970-01-01T00:00:00Z");
      const remote = row?.payload?.storage;
      const remoteTime = Date.parse(row?.payload?.updatedAt || row?.updated_at || "1970-01-01T00:00:00Z");
      if (remote && remoteTime > localTime) {
        applyLocal(remote);
        localStorage.setItem(META, new Date(remoteTime).toISOString());
        say("Đã tải tiến độ từ tài khoản", "Dữ liệu học trên thiết bị này đã được cập nhật theo bản đồng bộ mới nhất.");
      } else if (Object.keys(local).length || remote) {
        await saveNow(true);
      } else {
        await saveNow();
      }
    } catch (error) {
      say("Lỗi đồng bộ", error.message || "Không thể tải dữ liệu tài khoản.");
    } finally {
      loading = false;
    }
  }

  login.addEventListener("click", async () => {
    const e = email.value.trim(), p = password.value;
    if (!e || !p) return say("Thiếu thông tin", "Hãy nhập email và mật khẩu.");
    say("Đang đăng nhập…", "Đang xác minh tài khoản.");
    const { data, error } = await client.auth.signInWithPassword({ email: e, password: p });
    if (error) return say("Đăng nhập chưa thành công", error.message);
    await loadUser(data.user);
  });
  register.addEventListener("click", async () => {
    const e = email.value.trim(), p = password.value;
    if (!e || p.length < 6) return say("Kiểm tra thông tin", "Nhập email hợp lệ và mật khẩu tối thiểu 6 ký tự.");
    say("Đang tạo tài khoản…", "Kiểm tra email nếu hệ thống yêu cầu xác nhận.");
    const { data, error } = await client.auth.signUp({ email: e, password: p });
    if (error) return say("Không tạo được tài khoản", error.message);
    if (data.session && data.user) await loadUser(data.user);
    else say("Hãy xác nhận email", "Mở hộp thư, bấm liên kết xác nhận rồi quay lại đăng nhập.");
  });
  logout.addEventListener("click", async () => {
    await client.auth.signOut();
    activeUser = null; signedIn(false);
    say("Đã đăng xuất", "Tiến độ cục bộ vẫn còn trên thiết bị này.");
  });
  client.auth.onAuthStateChange((_event, session) => {
    if (session?.user) loadUser(session.user);
    else { activeUser = null; signedIn(false); }
  });
  client.auth.getSession().then(({ data, error }) => {
    if (error) say("Không kiểm tra được phiên đăng nhập", error.message);
    else if (data.session?.user) loadUser(data.session.user);
    else { signedIn(false); say("Chưa đăng nhập", "Đăng nhập cùng tài khoản trên máy tính và điện thoại để đồng bộ."); }
  });
})();