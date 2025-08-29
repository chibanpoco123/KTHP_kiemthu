# Hệ thống Checkout - Hướng dẫn sử dụng

## Tổng quan
Hệ thống checkout đã được tích hợp đầy đủ với các tính năng:
- Thu thập thông tin khách hàng (Họ tên, Email, SĐT, Địa chỉ)
- Hỗ trợ 2 phương thức thanh toán: COD và Razorpay
- Xử lý đơn hàng và cập nhật trạng thái
- Giao diện người dùng thân thiện
- **Hỗ trợ người dùng chưa đăng nhập**: Có thể thêm sản phẩm vào giỏ hàng và đăng nhập sau để checkout

## Luồng hoạt động mới

### Người dùng chưa đăng nhập:
1. **Xem sản phẩm** → Có thể thêm vào giỏ hàng bình thường
2. **Thêm vào giỏ hàng** → Hiển thị thông báo thành công + gợi ý đăng nhập
3. **Xem giỏ hàng** → Hiển thị sản phẩm + thông báo cần đăng nhập để checkout
4. **Đăng nhập** → Giỏ hàng được giữ nguyên
5. **Checkout** → Tiến hành thanh toán bình thường

### Người dùng đã đăng nhập:
1. **Xem sản phẩm** → Thêm vào giỏ hàng
2. **Checkout** → Điền thông tin và thanh toán

## Cài đặt và cấu hình

### Backend
1. Cài đặt dependencies:
```bash
cd backend
npm install razorpay
```

2. Tạo file `.env` trong thư mục `backend`:
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/your_database_name

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here

# Server Configuration
PORT=3001
NODE_ENV=development

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_secret_key_here

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

3. Cấu hình Razorpay:
   - Đăng ký tài khoản tại [Razorpay](https://razorpay.com/)
   - Lấy Key ID và Key Secret từ dashboard
   - Cập nhật vào file `.env`

### Frontend
1. Cài đặt dependencies (đã có sẵn):
```bash
cd frontend
npm install
```

2. Tạo file `.env` trong thư mục `frontend`:
```env
REACT_APP_BASE_ENDPOINT=http://localhost:3001
REACT_APP_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
```

## Cấu trúc hệ thống

### Backend Models
- **Order Model**: Lưu trữ thông tin đơn hàng, khách hàng, phương thức thanh toán
- **Validation**: Kiểm tra dữ liệu đầu vào với Joi
- **Controllers**: Xử lý logic tạo đơn hàng, tích hợp Razorpay

### Frontend Components
- **Checkout Page**: Form thu thập thông tin khách hàng và chọn phương thức thanh toán
- **Basket Page**: Hiển thị giỏ hàng với nút chuyển đến checkout
- **Orders Page**: Xem lịch sử đơn hàng
- **LoginPrompt Component**: Thông báo thân thiện khuyến khích đăng nhập
- **Card Component**: Hiển thị sản phẩm với nút thêm vào giỏ hàng

### API Endpoints
- `POST /order` - Tạo đơn hàng COD
- `POST /order/razorpay` - Tạo đơn hàng Razorpay
- `PUT /order/:orderId/payment-status` - Cập nhật trạng thái thanh toán
- `GET /order/my-orders` - Lấy đơn hàng của user
- `GET /order/:orderId` - Lấy chi tiết đơn hàng

## Tính năng chính

### Thu thập thông tin khách hàng
- Họ và tên (bắt buộc, 2-100 ký tự)
- Email (bắt buộc, định dạng email hợp lệ)
- Số điện thoại (bắt buộc, 10-15 ký tự)
- Địa chỉ giao hàng (bắt buộc, 10-500 ký tự)

### Phương thức thanh toán
- **COD (Cash on Delivery)**: Thanh toán khi nhận hàng
- **Razorpay**: Thanh toán online qua thẻ tín dụng/ghi nợ

### Quản lý đơn hàng
- Trạng thái đơn hàng: Pending, Processing, Shipped, Delivered, Cancelled
- Trạng thái thanh toán: Pending, Paid, Failed
- Lưu trữ Razorpay Order ID và Payment ID

### Trải nghiệm người dùng chưa đăng nhập
- **Thêm vào giỏ hàng**: Có thể thêm sản phẩm bình thường
- **Thông báo thân thiện**: Toast notifications với gợi ý đăng nhập
- **Tooltip hướng dẫn**: Giải thích rõ ràng về quy trình
- **Giữ nguyên giỏ hàng**: Sau khi đăng nhập, giỏ hàng không bị mất
- **Chuyển hướng thông minh**: Tự động chuyển đến trang đăng nhập khi cần

## Bảo mật

### Validation
- Kiểm tra dữ liệu đầu vào với Joi schema
- Xác thực JWT token cho các API protected
- Kiểm tra quyền truy cập đơn hàng

### Razorpay Integration
- Sử dụng webhook để xác thực thanh toán
- Lưu trữ Razorpay signature để verify
- Không lưu thông tin thẻ tín dụng

## Xử lý lỗi

### Frontend
- Hiển thị thông báo lỗi với toast notifications
- Validation form với Yup
- Loading states cho các thao tác async
- Thông báo thân thiện khi chưa đăng nhập

### Backend
- Error handling với Boom
- Logging lỗi
- Rollback transaction khi có lỗi

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Deployment

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Deploy thư mục build
```

## Troubleshooting

### Razorpay không hoạt động
1. Kiểm tra Key ID và Key Secret trong .env
2. Đảm bảo đang sử dụng test keys cho development
3. Kiểm tra console log để debug

### Database connection error
1. Kiểm tra MongoDB service
2. Kiểm tra connection string trong .env
3. Đảm bảo database đã được tạo

### CORS error
1. Kiểm tra CORS_ORIGIN trong .env
2. Đảm bảo frontend và backend ports khác nhau
3. Restart backend server sau khi thay đổi .env

### Giỏ hàng bị mất sau khi đăng nhập
1. Kiểm tra localStorage có được lưu đúng không
2. Đảm bảo BasketContext được wrap đúng trong App
3. Kiểm tra AuthContext có hoạt động đúng không

## Hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra console log
2. Kiểm tra network tab trong browser
3. Kiểm tra server logs
4. Tạo issue với thông tin chi tiết về lỗi
