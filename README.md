# ATELIER — Website bán quần áo, cổng thanh toán HD Wallet

Dự án bám theo **Bai_Tap_Thuc_Hanh_Blockchain_Dynamic_Address.pdf**. Tài liệu **Designing a Payment Gateway for Online Merchants.pdf** được dùng cho luồng cửa hàng, MetaMask, QR và kiểm tra số dư. Khi hai tài liệu có cấu hình khác nhau, ưu tiên đề bài: Express **5000**, React **3000**, thư viện **hdkey**.

## Chạy trên Windows

**Chạy bằng một lần bấm:** bấm đúp file **`CHAY-WEBSITE.cmd`** trong thư mục dự án. File tự bật Ganache, Express và React, đợi cả ba sẵn sàng rồi mở website trong trình duyệt mặc định. Nếu dịch vụ đã chạy, sẽ dùng lại. Giữ cửa sổ khởi chạy mở; nhấn `Ctrl+C` để dừng các dịch vụ được cửa sổ đó khởi động. Chọn trình duyệt có MetaMask làm trình duyệt mặc định để thanh toán.

Đã cài dependencies trong thư mục dự án. Khi chép sang máy khác, chạy `npm install` trước. Cần Node.js và npm.

Terminal 1:

```powershell
cd 'D:\BLCK 6'
npm run chain
```

Terminal 2:

```powershell
cd 'D:\BLCK 6'
npm start
```

Mở **http://localhost:3000** bằng Chrome hoặc Edge có extension MetaMask. Backend là **http://localhost:5000**; Ganache JSON-RPC là **http://127.0.0.1:8545**, chain ID **1337**.

Nếu dùng Ganache GUI thay Ganache đi kèm, cấu hình RPC port 8545 và chain ID 1337, rồi bỏ bước `npm run chain`. Không chạy hai Ganache cùng cổng. Không dùng mnemonic thương nhân để tạo tài khoản khách hàng: điều đó sẽ cấp sẵn số dư vào các địa chỉ nhận tiền.

## Tương tác MetaMask thật

1. Nhấn **Kết nối MetaMask** trên đầu trang và duyệt kết nối trong extension. Khi kết nối thành công, nút hiển thị địa chỉ rút gọn; nhấn nút để xem/sao chép địa chỉ đầy đủ và kiểm tra mạng. Có thể dùng tài khoản MetaMask hiện có. Không cần nhập seed phrase hoặc khóa riêng vào website. Nếu đang ở mạng khác, nhấn **Chuyển sang Ganache** trong bảng thông tin ví.
2. Thêm mạng **Ganache Local**, RPC **http://127.0.0.1:8545**, chain ID **1337**, currency **ETH**. Nút thanh toán cũng yêu cầu MetaMask thêm/chuyển mạng này khi cần; bạn duyệt yêu cầu trong extension.
3. Sao chép **địa chỉ công khai** tài khoản MetaMask. Trong terminal thứ ba, cấp ETH thử nghiệm:

   ```powershell
   npm run fund -- 0xDIA_CHI_CONG_KHAI_CUA_BAN
   ```

   Thay toàn bộ `0xDIA_CHI_CONG_KHAI_CUA_BAN` bằng địa chỉ ví thật của bạn. Lệnh gửi 10 ETH thử nghiệm từ tài khoản Ganache đã mở khóa đến tài khoản đó, chỉ trên chain 1337.
4. Chọn size, nhấn dấu `+` trên sản phẩm → Giỏ hàng → Thanh toán bằng ETH.
5. Nhấn **Thanh toán với MetaMask**. Duyệt kết nối tài khoản và xác nhận giao dịch trong popup MetaMask.
6. Backend đọc số dư bằng Web3.js. Sau khi đủ ETH, giao diện cập nhật **Thanh toán thành công** trong lần kiểm tra tiếp theo (mỗi 3 giây).

Đây là extension MetaMask thật ký giao dịch thật trên blockchain Ganache cục bộ, dùng ETH thử nghiệm. Không sử dụng Ethereum mainnet hoặc ETH có giá trị thực cho bài tập. QR chứa URI Ethereum với địa chỉ, chain 1337 và số tiền Wei. Ví ngoài cũng phải truy cập được cùng Ganache; `127.0.0.1` trên điện thoại không trỏ đến máy tính.

Hướng dẫn chính thức: [thêm mạng MetaMask](https://support.metamask.io/configure/networks/how-to-add-a-custom-network-rpc), [Ethereum wallet provider API](https://eips.ethereum.org/EIPS/eip-1193).

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

## Sai lệch địa chỉ minh họa trong đề

Với đúng mnemonic `share confirm story grocery check soon cool priority doctor cruise subway provide` và đúng đường dẫn đề bài, kết quả thực tế là:

| Đường dẫn | Địa chỉ thực tế |
|---|---|
| `m/44'/60'/0'/0/0` | `0x38979A730badBdcE4bD6eFD3AfC12CA24C73d01C` |
| `m/44'/60'/0'/0/1` | `0x315074C434eca2B79878f4a1A2323d12eE413fdb` |

Hai địa chỉ mẫu trong PDF (`0x3897B0FA54F0CD211e4fFDd1A48805F04336c285`, `0x3150247FE43C651DC59A41eEf5ee9bCEdA6E72EB`) không khớp đầu vào. Kiểm thử đối chiếu kết quả `bip39`/`hdkey`/`ethereumjs-util` với bộ sinh tài khoản độc lập của Ganache và cho kết quả giống nhau. Không sửa thuật toán hoặc gán cứng địa chỉ để khớp ví dụ sai.

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
