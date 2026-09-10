"use client";

import { useEffect, useRef, useState } from "react";
import { decodePolyline } from "@/lib/polyline";

let loaderPromise = null;

function loadGoogleMaps() {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY;
  if (!key) return Promise.reject(new Error("NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY가 설정되지 않았습니다."));
  if (window.google?.maps) return Promise.resolve(window.google);
  if (loaderPromise) return loaderPromise;

  loaderPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&v=weekly`;
    script.async = true;
    script.onerror = () => reject(new Error("Google Maps 스크립트를 불러오지 못했습니다."));
    script.onload = () => resolve(window.google);
    document.head.appendChild(script);
  });
  return loaderPromise;
}

// points: [{lat, lng, name, color?}]
// polyline: encoded polyline string (선택)
export default function GoogleMapView({
  points = [],
  polyline,
  height = 260,
  fallbackCenter = { lat: 35.6895, lng: 139.6917 }, // 도쿄역 근방
  className,
}) {
  const containerRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    let map;
    let markers = [];
    let line;

    loadGoogleMaps()
      .then((google) => {
        if (cancelled || !containerRef.current) return;
        const center = points[0] ? { lat: points[0].lat, lng: points[0].lng } : fallbackCenter;
        map = new google.maps.Map(containerRef.current, {
          center,
          zoom: points.length ? 13 : 11,
          disableDefaultUI: true,
          zoomControl: true,
        });

        const bounds = new google.maps.LatLngBounds();

        markers = points.map((p, i) => {
          const marker = new google.maps.Marker({
            position: { lat: p.lat, lng: p.lng },
            map,
            label: {
              text: String(i + 1),
              color: "#fff",
              fontSize: "12px",
              fontWeight: "700",
            },
            title: p.name || "",
          });
          bounds.extend(marker.getPosition());
          return marker;
        });

        if (polyline) {
          const path = decodePolyline(polyline);
          if (path.length) {
            line = new google.maps.Polyline({
              path,
              strokeColor: "#2f6fed",
              strokeOpacity: 0.9,
              strokeWeight: 4,
              map,
            });
            path.forEach((p) => bounds.extend(p));
          }
        }

        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, 48);
        }
      })
      .catch((e) => setError(e.message));

    return () => {
      cancelled = true;
      markers.forEach((m) => m.setMap(null));
      if (line) line.setMap(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(points), polyline]);

  if (error) {
    return (
      <div
        className={className}
        style={{
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#eef2fb",
          color: "var(--text-muted)",
          fontSize: 13,
          textAlign: "center",
          padding: 20,
        }}
      >
        지도를 불러올 수 없어요.
        <br />
        {error}
      </div>
    );
  }

  return <div ref={containerRef} className={className} style={{ height, width: "100%" }} />;
}
