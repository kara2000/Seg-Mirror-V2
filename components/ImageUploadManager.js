import React, { useState, useRef } from "react";

function App() {
  const [images, setImages] = useState([]); // Danh sách ảnh hiện tại
  const [history, setHistory] = useState([]); // Lịch sử thay đổi/phiên bản
  const fileInputRef = useRef();

  // Hàm tải lên hoặc cập nhật ảnh
  const handleUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => ({
      id: URL.createObjectURL(file), // Dùng tạm URL cho preview, production nên dùng ID thực tế từ server
      file,
      preview: URL.createObjectURL(file),
      uploadedAt: new Date(),
      versions: []
    }));
    // Lưu lịch sử
    setHistory(prev => [...prev, ...images]);
    setImages(newImages);
  };

  // Hàm xóa ảnh
  const handleDelete = (imgId) => {
    setImages(prev => prev.filter(img => img.id !== imgId));
    // Cập nhật lịch sử
    setHistory(prev => [...prev, images.find(img => img.id === imgId)]);
  };

  // Hàm xem trước/hình thu nhỏ
  const renderThumbnails = () =>
    images.map(img => (
      <div key={img.id} style={{ display: "inline-block", margin: 5 }}>
        <img
          src={img.preview}
          alt="Ảnh xem trước"
          width={100}
          height={100}
          style={{ objectFit: "cover", border: "1px solid #ccc" }}
        />
        <button onClick={() => handleDelete(img.id)}>Xóa</button>
      </div>
    ));

  // Hàm hiển thị lịch sử thay đổi/phiên bản
  const renderHistory = () =>
    history.map((img, idx) => (
      <div key={idx} style={{ margin: 5 }}>
        <span>Ảnh phiên bản trước: </span>
        <img src={img.preview} alt="Lịch sử" width={60} height={60} />
      </div>
    ));

  // Khi đóng tab/quay lại sẽ xóa ảnh tạm thời
  React.useEffect(() => {
    const handleUnload = () => {
      images.forEach(img => URL.revokeObjectURL(img.preview));
      setImages([]);
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [images]);

  return (
    <div>
      <h2>Quản lý ảnh</h2>
      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        onChange={handleUpload}
      />
      <div>
        <h3>Ảnh đã tải lên</h3>
        {renderThumbnails()}
      </div>
      <div>
        <h3>Lịch sử thay đổi/phiên bản</h3>
        {renderHistory()}
      </div>
    </div>
  );
}

export default App;
