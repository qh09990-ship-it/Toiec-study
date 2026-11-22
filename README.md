# TOEIC Study – Góc học tập cá nhân

Website tự học TOEIC bằng tiếng Việt, tương thích máy tính và điện thoại.

## Chức năng trong bản đầu
- Trang tổng quan học tập.
- Bài luyện Reading và Listening dạng trắc nghiệm mẫu.
- Đáp án và giải thích bằng tiếng Việt.
- Sổ từ vựng: thêm và xóa từ.
- Thống kê số câu, số câu đúng, độ chính xác, thời gian và lịch sử.
- Lưu tiến độ cục bộ bằng localStorage.
- Cấu hình PWA và cache giao diện cơ bản.

## Triển khai Cloudflare Pages miễn phí
1. Đăng nhập Cloudflare, mở Workers & Pages.
2. Chọn Create application → Pages → Connect to Git.
3. Kết nối GitHub và chọn kho mã nguồn Toiec-study.
4. Framework preset chọn None.
5. Build command để trống; Build output directory nhập /.
6. Deploy. Website sẽ có địa chỉ dạng pages.dev.

## Lưu trữ và đồng bộ
Bản hiện tại lưu tiến độ trong trình duyệt của thiết bị đang dùng. localStorage không tự đồng bộ giữa máy tính và điện thoại. Bước tiếp theo là kết nối Supabase Free để đăng nhập và đồng bộ tiến độ, từ vựng.

Không đưa khóa service_role hoặc mật khẩu vào mã nguồn. Chỉ dùng khóa anon/publishable ở frontend, kèm chính sách RLS phù hợp.

## Chi phí
Dự án hướng đến các gói miễn phí. Các gói miễn phí có giới hạn; Supabase có thể tạm dừng dự án nếu ít hoạt động trong 7 ngày.
