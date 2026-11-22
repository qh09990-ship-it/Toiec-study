# TOEIC Study – Góc học tập cá nhân

Website tự học TOEIC bằng tiếng Việt, hiển thị tốt trên máy tính và điện thoại.

## Chức năng đã tạo trong bản đầu
- Trang tổng quan học tập.
- Bài luyện Reading và Listening dạng trắc nghiệm mẫu.
- Nút phát câu hỏi tiếng Anh bằng giọng đọc của trình duyệt ở phần Listening.
- Hiển thị đáp án và giải thích tiếng Việt.
- Sổ từ vựng: thêm và xóa từ.
- Thống kê số câu, số câu đúng, độ chính xác, thời gian và lịch sử.
- Lưu tiến độ cục bộ bằng localStorage.
- Cấu hình PWA để có thể cài website như ứng dụng.

## Đưa website lên mạng miễn phí bằng Cloudflare Pages
1. Đăng nhập Cloudflare và mở Workers & Pages.
2. Chọn Create application → Pages → Connect to Git.
3. Kết nối GitHub và chọn kho `qh09990-ship-it/Toiec-study`.
4. Framework preset chọn None.
5. Build command để trống; Build output directory nhập `.`.
6. Chọn Deploy. Website sẽ có địa chỉ dạng `ten-du-an.pages.dev`.

## Bật đăng nhập và đồng bộ qua Supabase Free
1. Tạo tài khoản tại Supabase và tạo project mới. Chọn gói Free; không nhập thông tin thanh toán hoặc nâng cấp.
2. Trong project, mở SQL Editor, dán và chạy toàn bộ nội dung file `supabase/schema.sql`.
3. Trong Project Settings → API, lấy Project URL và anon/publishable key.
4. Mở file `config.js` trong GitHub, thay hai giá trị rỗng:
   - `url`: Project URL
   - `anonKey`: anon/publishable key
5. Lưu thay đổi. Cloudflare Pages sẽ tự triển khai lại sau khi GitHub có commit mới.
6. Mở website, tạo tài khoản bằng email và mật khẩu. Xác nhận email nếu Supabase yêu cầu, sau đó đăng nhập trên máy tính và điện thoại bằng cùng tài khoản.

**Bảo mật:** chỉ đưa Project URL và anon/publishable key vào `config.js`. Tuyệt đối không đưa `service_role` key, mật khẩu hoặc token bí mật vào mã nguồn. Bảng dữ liệu đã bật RLS để mỗi tài khoản chỉ đọc/ghi dữ liệu của chính mình.

## Giới hạn gói miễn phí
Cloudflare Pages Free có giới hạn số lần build và tài nguyên theo chính sách của Cloudflare. Supabase Free hiện gồm 500 MB cơ sở dữ liệu, 5 GB egress và 50.000 người dùng hoạt động hàng tháng; dự án có thể bị tạm dừng khi hoạt động cơ sở dữ liệu quá thấp trong 7 ngày. Phù hợp để bắt đầu dùng cá nhân, nhưng không phải cam kết hoạt động vĩnh viễn không gián đoạn.

## Lưu ý nội dung
Các câu hỏi hiện tại là câu hỏi mẫu tự biên soạn, chưa phải bộ đề thi TOEIC chính thức. Bài Listening hiện dùng tính năng đọc văn bản của trình duyệt, chưa phải bản ghi âm giọng người bản ngữ.
