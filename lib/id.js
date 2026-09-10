import { customAlphabet } from "nanoid";

// cuid 스타일의 짧고 URL-safe한 id 생성기
const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
const gen = customAlphabet(alphabet, 20);

export function createId(prefix = "") {
  return `${prefix}${gen()}`;
}
