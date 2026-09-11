"use client";

// 일정을 이미지(PNG)나 PDF로 저장하는 기능입니다. 해외에서 데이터/와이파이가
// 불안정할 때도 미리 저장해둔 파일로 일정을 볼 수 있게 하기 위한 용도입니다.
//
// html2canvas / jsPDF 둘 다 화면에 실제로 렌더링된 DOM을 그대로 캡처하는
// 방식이라, 한국어 폰트를 PDF에 별도로 임베드하는 복잡한 작업 없이도 화면에
// 보이는 그대로(Pretendard 폰트 포함) 저장할 수 있습니다. 두 라이브러리 모두
// 이 함수가 실제로 호출될 때만 불러오도록(동적 import) 해서, 이 화면을
// 쓰지 않는 다른 페이지의 초기 로딩 속도에는 영향이 없게 했습니다.
async function captureElement(el) {
  const { default: html2canvas } = await import("html2canvas");
  // 웹폰트(Pretendard)가 아직 로드되기 전에 캡처하면 기본 폰트로 찍혀버릴 수
  // 있어서, 폰트 로딩이 끝난 뒤에 캡처합니다.
  if (typeof document !== "undefined" && document.fonts?.ready) {
    await document.fonts.ready;
  }
  return html2canvas(el, {
    scale: 2, // 저장했을 때 글자가 흐릿하지 않도록 2배 해상도로 캡처
    backgroundColor: "#ffffff",
    useCORS: true,
  });
}

// data: URL 대신 Blob + URL.createObjectURL을 씁니다. data: URL로 다운로드를
// 트리거하면 브라우저에 따라 <a download="..."> 에 지정한 파일명이 무시되고
// "download"처럼 아무 의미 없는 이름으로 저장되는 경우가 있는데(용량이 큰
// data URL일수록 더 그렇습니다), Blob URL 방식은 파일명이 안정적으로 적용됩니다.
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // 다운로드가 실제로 시작될 시간을 준 뒤에 정리합니다.
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("이미지를 만들지 못했어요."));
    }, "image/png");
  });
}

// 파일명을 일부러 ASCII(영문/숫자)로만 만듭니다. 한글 등 비ASCII 문자를
// <a download="..."> 속성에 그대로 넣으면, 크롬(Chromium)이 파일명을 무시하고
// 그냥 "download"라는 이름으로 저장해버리는 경우가 있다는 걸 실제로
// 확인했습니다(제목이 전부 한글인 이 앱에서는 사실상 항상 발생합니다).
// 일정 제목은 어차피 이미지/PDF 내용 안에 그대로 들어있으니, 파일명은
// 안전하게 날짜를 포함한 영문 이름으로 만들어서 저장 자체가 항상
// 제대로 되도록 했습니다.
function safeFilename(title) {
  const asciiPart = (title || "")
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/[\\/:*?"<>|]/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .slice(0, 40);
  const stamp = new Date().toISOString().slice(0, 10);
  return asciiPart ? `PATH_${asciiPart}_${stamp}` : `PATH_itinerary_${stamp}`;
}

export async function exportItineraryAsImage(el, title) {
  const canvas = await captureElement(el);
  const blob = await canvasToBlob(canvas);
  downloadBlob(blob, `${safeFilename(title)}.png`);
}

export async function exportItineraryAsPdf(el, title) {
  const canvas = await captureElement(el);
  const { jsPDF } = await import("jspdf");

  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // 일정이 길어서 한 페이지에 다 안 들어가면 여러 페이지로 나눕니다. 처음에는
  // 캡처한 큰 이미지 하나를 페이지마다 y좌표만 다르게 해서 반복해서 넣었더니,
  // 페이지마다 이미지 전체가 통째로 다시 저장되면서 파일 용량이 10MB를
  // 훌쩍 넘어버렸습니다. 그래서 페이지에 실제로 보일 부분만 잘라서(캔버스
  // crop) 페이지 수만큼만 이미지를 만들고, PNG 대신 JPEG로 압축해서 용량을
  // 크게 줄였습니다.
  const pxPerPt = canvas.width / pageWidth;
  const pageHeightPx = Math.floor(pageHeight * pxPerPt);

  let renderedPx = 0;
  let isFirstPage = true;
  while (renderedPx < canvas.height) {
    const sliceHeightPx = Math.min(pageHeightPx, canvas.height - renderedPx);

    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = canvas.width;
    pageCanvas.height = sliceHeightPx;
    pageCanvas.getContext("2d").drawImage(
      canvas,
      0, renderedPx, canvas.width, sliceHeightPx, // source rect (원본에서 이번 페이지 분량만)
      0, 0, canvas.width, sliceHeightPx // destination rect
    );

    const sliceImgHeightPt = sliceHeightPx / pxPerPt;
    if (!isFirstPage) pdf.addPage();
    pdf.addImage(pageCanvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, pageWidth, sliceImgHeightPt);

    isFirstPage = false;
    renderedPx += sliceHeightPx;
  }

  downloadBlob(pdf.output("blob"), `${safeFilename(title)}.pdf`);
}
