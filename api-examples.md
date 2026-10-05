# Test API nhanh bằng PowerShell

## 1. Lấy JWT

```powershell
$login = Invoke-RestMethod `
  -Method POST `
  -Uri "http://localhost:3000/api/auth/login" `
  -ContentType "application/json" `
  -Body '{"username":"admin","password":"admin123"}'

$token = $login.data.token
$token
```

## 2. Thêm tin

```powershell
$headers = @{ Authorization = "Bearer $token" }

Invoke-RestMethod `
  -Method POST `
  -Uri "http://localhost:3000/api/private/news" `
  -Headers $headers `
  -ContentType "application/json" `
  -Body '{"title":"Tin Node.js","content":"Nội dung tin","author":"Nhom 17","source":"VnExpress"}'
```

## 3. Xem danh sách + tìm kiếm + sắp xếp

```powershell
Invoke-RestMethod `
  -Method GET `
  -Uri "http://localhost:3000/api/private/news?keyword=node&page=0&size=10&sortBy=createdAt&order=desc" `
  -Headers $headers
```

## 4. Xem chi tiết

```powershell
Invoke-RestMethod `
  -Method GET `
  -Uri "http://localhost:3000/api/private/news/1" `
  -Headers $headers
```

## 5. Sửa tin

```powershell
Invoke-RestMethod `
  -Method PUT `
  -Uri "http://localhost:3000/api/private/news/1" `
  -Headers $headers `
  -ContentType "application/json" `
  -Body '{"title":"Tiêu đề đã sửa","content":"Nội dung đã sửa","author":"Nhom 17","source":"VnExpress"}'
```

## 6. Xóa tin

```powershell
Invoke-RestMethod `
  -Method DELETE `
  -Uri "http://localhost:3000/api/private/news/1" `
  -Headers $headers
```


## 7. Upload file

```powershell
$filePath = "C:\Users\Admin\Downloads\test.pdf"

curl.exe -X POST `
  "http://localhost:3000/api/private/files/upload" `
  -H "Authorization: Bearer $token" `
  -F "file=@$filePath"
```

Response trả về `data.fileName`. Lưu giá trị đó để xóa file.

## 8. Xóa file

```powershell
$fileName = "<fileName-tra-ve-tu-api-upload>"

Invoke-RestMethod `
  -Method DELETE `
  -Uri "http://localhost:3000/api/private/files/$fileName" `
  -Headers $headers
```
