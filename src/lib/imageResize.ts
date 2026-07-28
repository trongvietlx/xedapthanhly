const MAX_DIMENSION = 1280;
const JPEG_QUALITY = 0.8;

/**
 * Nén & thu nhỏ ảnh (qua canvas) trước khi chuyển thành base64 data URL.
 * Ảnh gốc từ điện thoại/máy ảnh thường vài MB - nếu giữ nguyên và lưu
 * base64 vào localStorage sẽ dễ vượt quota (~5-10MB/origin) và làm
 * localStorage.setItem thất bại âm thầm. Resize về tối đa 1280px + nén
 * JPEG 80% giữ dung lượng mỗi ảnh chỉ còn vài trăm KB.
 */
export function resizeImageToDataUrl(
  blobUrl: string,
  maxDimension: number = MAX_DIMENSION,
  quality: number = JPEG_QUALITY
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Canvas 2D context không khả dụng"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };

    img.onerror = () => reject(new Error("Không thể tải ảnh để nén"));
    img.src = blobUrl;
  });
}
