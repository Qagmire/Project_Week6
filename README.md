# ATELIER — Website bán quần áo, cổng thanh toán HD Wallet

Dự án bám theo **Bai_Tap_Thuc_Hanh_Blockchain_Dynamic_Address.pdf**. Tài liệu **Designing a Payment Gateway for Online Merchants.pdf** được dùng cho luồng cửa hàng, MetaMask, QR và kiểm tra số dư. Khi hai tài liệu có cấu hình khác nhau, ưu tiên đề bài: Express **5000**, React **3000**, thư viện **hdkey**.


## Đối chiếu yêu cầu đề bài

| Yêu cầu | Mã nguồn / hành vi |
|---|---|
| Node.js / Express, `app.js`, cổng 5000 | `app.js`, `npm run backend` |
| express, cors, bip39, hdkey, ethereumjs-util | `package.json`, `wallet.js`, `app.js` |
| CORS cho React cổng 3000 | Cho phép `http://localhost:3000` và `http://127.0.0.1:3000` |
| Mnemonic mẫu 12 từ → seed nhị phân | `bip39.mnemonicToSeedSync` |
| Khóa gốc từ seed | `HDKey.fromMasterSeed` |
| GET `/api/getMAddress` | Response chỉ có `{ "MAddress": "0x..." }` |
| `m/44'/60'/0'/0/` + pathid | `root.derive(path)` trong `wallet.js` |
| privateToPublic → publicToAddress → toChecksumAddress | Tính địa chỉ thật, không hardcode kết quả |
| pathid = 0; tăng; reset khi >= 100 | Lần 1 chỉ số 0, lần 100 chỉ số 99, lần 101 chỉ số 0 |
| Frontend React | Vite phục vụ ở 3000 với strictPort |
| Ganache, Web3.js, MetaMask từ lý thuyết | Chain 1337/RPC 8545; Web3 đọc số dư; MetaMask ký giao dịch |
| QR, countdown, polling | QR Ethereum, phiên 15 phút, kiểm tra 3 giây |

Route đơn hàng dùng chung bộ sinh ví với `/api/getMAddress`; mỗi lần tạo phiên thanh toán lấy một địa chỉ qua cùng logic. API bán hàng tính giá/số tiền ở server, không tin giá frontend gửi lên. Đơn lưu trong `data/orders.json`; danh sách ID đơn của khách lưu trên trình duyệt. Số dư trước khi tạo đơn được ghi lại để số tiền có sẵn trên địa chỉ tái sử dụng không làm đơn mới tự thành PAID. Một địa chỉ không được cấp cho hai đơn đang chờ còn hạn.


## Kiểm tra và nộp bài

```powershell
npm test
npm run build
Invoke-RestMethod http://localhost:5000/api/getMAddress
```

Để kiểm tra hai địa chỉ đầu, khởi động backend mới và gọi API trước khi tạo đơn. Chỉ số nằm trong bộ nhớ và reset khi khởi động backend, đúng skeleton đề. Ganache CLI đi kèm lưu blockchain trong `data/ganache` qua các lần khởi động.

Kiểm thử tự động dùng Ganache riêng ở cổng ngẫu nhiên, gửi ETH thật trên chain đó, kiểm tra trạng thái PENDING khi chưa đủ, PAID khi đủ, giá tính ở server, CORS, lưu/đọc lại đơn, 100 địa chỉ và wrap. Nó không thao tác extension MetaMask của người dùng; phần ký trong popup cần kiểm tra thủ công theo các bước ở trên.

Giao diện gồm tìm kiếm/lọc sản phẩm, size, giỏ hàng, checkout, QR, sao chép địa chỉ, MetaMask, countdown và lịch sử đơn. Ảnh Unsplash và font Google cần Internet; API/blockchain chạy cục bộ. Thư viện HD Wallet/Ganache theo đề có dependencies cũ; bản này là bài thực hành, chưa phải cổng thanh toán thương mại. Quy tắc tái dùng địa chỉ sau 100 lần không bảo đảm quyền riêng tư và đối soát lâu dài cho hệ thống production.

Website được chạy cục bộ để giữ đúng Express 5000, React 3000, Ganache 8545 và tương tác extension MetaMask với mạng trên máy. Chưa triển khai online.
