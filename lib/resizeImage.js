"use client";

// 사진(메뉴판/표지판) 첨부 기능에서 씁니다. 휴대폰 카메라 원본은 보통
// 3~10MB라, base64로 그대로 보내면 요청이 느려지고 서버 바디 크기 제한에
// 걸릴 수 있습니다. <canvas>로 긴 변 기준 maxSize까지만 줄이고 JPEG로
// 압축해서, 번역에 필요한 글자 판독성은 유지하면서 용량만 크게 줄입니다.
export function resizeImageFile(file, { maxSize = 1280, quality = 0.82 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file.type || !file.type.startsWith("image/")) {
      reject(new Error("이미지 파일만 첨부할 수 있어요."));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("사진을 읽는 중 오류가 발생했어요."));
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error("사진을 불러오지 못했어요."));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          const scale = maxSize / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
