// Google의 인코딩된 폴리라인(Encoded Polyline Algorithm Format)을 좌표 배열로 디코딩합니다.
// 참고: https://developers.google.com/maps/documentation/utilities/polylinealgorithm
export function decodePolyline(encoded) {
  if (!encoded) return [];
  let index = 0;
  let lat = 0;
  let lng = 0;
  const coordinates = [];

  while (index < encoded.length) {
    let result = 1;
    let shift = 0;
    let b;
    do {
      b = encoded.charCodeAt(index++) - 63 - 1;
      result += b << shift;
      shift += 5;
    } while (b >= 0x1f);
    lat += result & 1 ? ~(result >> 1) : result >> 1;

    result = 1;
    shift = 0;
    do {
      b = encoded.charCodeAt(index++) - 63 - 1;
      result += b << shift;
      shift += 5;
    } while (b >= 0x1f);
    lng += result & 1 ? ~(result >> 1) : result >> 1;

    coordinates.push({ lat: lat * 1e-5, lng: lng * 1e-5 });
  }
  return coordinates;
}
