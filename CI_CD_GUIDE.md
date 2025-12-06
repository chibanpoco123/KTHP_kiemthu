# Hướng Dẫn CI/CD Workflow

## 📋 Tổng Quan

Workflow `node.js.yml` sẽ tự động chạy khi bạn push code lên branch `main` hoặc `master`, hoặc khi có Pull Request.

## 🔄 Các Bước Workflow Thực Hiện

### 1. **Job Frontend** (Chạy song song với Backend)
- ✅ **Checkout code**: Lấy code từ repository
- ✅ **Setup Node.js**: Cài đặt Node.js với các phiên bản: 18.x, 20.x, 22.x (chạy song song)
- ✅ **Cache dependencies**: Sử dụng cache từ lần build trước để tăng tốc
- ✅ **Install dependencies**: Chạy `npm ci` (sử dụng `package-lock.json` để đảm bảo dependencies giống nhau)
- ✅ **Run tests**: Chạy test suite cho frontend
- ✅ **Build**: Build ứng dụng React để kiểm tra không có lỗi build

### 2. **Job Backend** (Chạy song song với Frontend)
- ✅ **Checkout code**: Lấy code từ repository
- ✅ **Setup Node.js**: Cài đặt Node.js với các phiên bản: 18.x, 20.x, 22.x (chạy song song)
- ✅ **Cache dependencies**: Sử dụng cache từ lần build trước để tăng tốc
- ✅ **Install dependencies**: Chạy `npm ci` (sử dụng `package-lock.json` để đảm bảo dependencies giống nhau)
- ✅ **Build**: Build backend code (sử dụng sucrase để transpile)

## 🚀 Cách Sử Dụng

### Kiểm tra workflow hoạt động:

1. **Push code lên GitHub:**
   ```bash
   git add .
   git commit -m "Update code"
   git push origin main
   ```

2. **Xem kết quả trên GitHub:**
   - Vào tab **Actions** trên repository
   - Click vào workflow run mới nhất
   - Xem logs của từng job để kiểm tra chi tiết

### Nếu workflow bị lỗi:

#### Lỗi: "Dependencies lock file is not found"
**Giải pháp:**
```bash
# Vào thư mục frontend
cd frontend
npm install  # Tạo package-lock.json nếu chưa có
cd ..

# Vào thư mục backend
cd backend
npm install  # Tạo package-lock.json nếu chưa có
cd ..

# Commit lock files
git add frontend/package-lock.json backend/package-lock.json
git commit -m "Add package-lock.json files"
git push
```

#### Lỗi: "Tests failed"
**Giải pháp:**
- Kiểm tra test logs trong GitHub Actions
- Chạy tests locally: `cd frontend && npm test`
- Sửa lỗi test và push lại

#### Lỗi: "Build failed"
**Giải pháp:**
- Kiểm tra build logs trong GitHub Actions
- Build local để kiểm tra:
  - Frontend: `cd frontend && npm run build`
  - Backend: `cd backend && npm run build`

## 📝 Lưu Ý Quan Trọng

1. ✅ **Lock files đã được commit** - Các file `package-lock.json` đã có trong git
2. ✅ **Workflow tự động chạy** - Không cần cài đặt thêm gì
3. ✅ **Test trên nhiều phiên bản Node.js** - Đảm bảo code hoạt động trên Node 18, 20, 22

## 🔍 Kiểm Tra Trạng Thái

Sau khi push code, workflow sẽ chạy tự động. Bạn có thể:
- Xem status badge trên README (nếu có)
- Kiểm tra tab Actions trên GitHub
- Nhận email thông báo nếu có lỗi (nếu đã bật)

## ✨ Lợi Ích

- ✅ **Tự động hóa testing** - Không cần chạy test thủ công
- ✅ **Phát hiện lỗi sớm** - Biết ngay nếu code có vấn đề
- ✅ **Đảm bảo chất lượng** - Code phải pass tests mới merge được
- ✅ **Hỗ trợ nhiều phiên bản Node.js** - Code hoạt động trên nhiều môi trường


