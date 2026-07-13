#!/bin/bash

# Đổi về thư mục của script
cd "$(dirname "$0")"

echo "🚀 Đang khởi động Sunext Website..."
echo ""

# Dừng server cũ nếu đang chạy
pkill -f "http.server 4173" 2>/dev/null
sleep 1

# Khởi động server cho website
python3 -m http.server 4173 --directory "site" &
echo "✅ Sunext Website:   http://localhost:4173"
echo ""
echo "👉 Mở trình duyệt và truy cập: http://localhost:4173"
echo "   Giữ cửa sổ này mở để server tiếp tục chạy."
echo "   Nhấn Ctrl+C để dừng."
echo ""

# Mở trình duyệt tự động
sleep 1
open "http://localhost:4173"

# Chờ cho đến khi bị dừng
wait
