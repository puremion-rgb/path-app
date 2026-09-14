"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// 브라우저에 내장된 음성 인식(Web Speech API)을 쓰는 훅입니다. 서버에 별도
// API 키를 등록하거나 가입할 필요가 없습니다 — 크롬 등 브라우저가 자체적으로
// 음성을 텍스트로 바꿔서 돌려주는 기능이라, 이 앱 입장에서는 그냥
// `window.SpeechRecognition`이라는 브라우저 API를 호출하는 것뿐입니다.
// (다만 파이어폭스는 지원하지 않고, 사파리는 일부만 지원하는 등 브라우저마다
// 지원 범위가 달라서 supported 값으로 미지원 브라우저에서는 버튼 자체를
// 숨기거나 비활성화할 수 있게 했습니다.)
export function useSpeechRecognition({ onResult } = {}) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  useEffect(() => {
    const SpeechRecognitionCtor =
      typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SpeechRecognitionCtor) {
      setSupported(false);
      return;
    }
    setSupported(true);

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "ko-KR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript || "")
        .join(" ")
        .trim();
      if (transcript) onResultRef.current?.(transcript);
    };
    recognition.onerror = (event) => {
      // "no-speech"(말이 감지되지 않음)나 "aborted"(사용자가 직접 중지)는
      // 흔히 발생할 수 있는 상황이라 별도 오류 문구 없이 조용히 넘어갑니다.
      if (event.error === "no-speech" || event.error === "aborted") {
        setError("");
        return;
      }
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setError("마이크 사용을 허용해주세요.");
      } else {
        setError("음성 인식 중 문제가 발생했어요. 다시 시도해주세요.");
      }
    };
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      try {
        recognition.abort();
      } catch {
        // 이미 멈춰있는 경우 abort()가 예외를 던질 수 있어 무시합니다.
      }
      recognitionRef.current = null;
    };
  }, []);

  const start = useCallback(() => {
    if (!recognitionRef.current || listening) return;
    setError("");
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch {
      // 이미 시작된 상태에서 다시 start()를 부르면 예외가 나는데, 이 경우는
      // 무시해도 안전합니다(이미 듣고 있는 중이므로).
    }
  }, [listening]);

  const stop = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch {
      // no-op
    }
  }, []);

  const toggle = useCallback(() => {
    if (listening) stop();
    else start();
  }, [listening, start, stop]);

  return { supported, listening, error, start, stop, toggle };
}
