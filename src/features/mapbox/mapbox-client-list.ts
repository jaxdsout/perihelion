import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRef, type RefObject } from "react";
import type { PublicList } from "../clientlist/types";
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string;

export function ClientListMapbox(listData: PublicList | null, mapRef: RefObject<HTMLDivElement | null>) {
  const map = useRef<mapboxgl.Map | null>(null);

  if (!listData || !mapRef.current || map.current) return;

  mapboxgl.accessToken = MAPBOX_TOKEN;

  map.current = new mapboxgl.Map({
    container: mapRef.current,
    style: "mapbox://styles/mapbox/dark-v11",
    center: [-73.985, 40.748],
    zoom: 11,
  });

  map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

  const bounds = new mapboxgl.LngLatBounds();

  listData.options.forEach((opt, idx) => {
    const { latitude, longitude, address } = opt;
    if (!latitude || !longitude) return;

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    const el = document.createElement("div");
    el.style.cssText = `
        width: 26px; height: 26px; background: #fff; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-weight: 700; font-size: 0.75rem; color: #111; cursor: pointer;
        border: 2px solid rgba(255,255,255,0.3);
      `;
    el.textContent = String(idx + 1);

    new mapboxgl.Marker(el)
      .setLngLat([lng, lat])
      .setPopup(
        new mapboxgl.Popup({ offset: 14, closeButton: false }).setHTML(`
            <div style="background:#1a1a1a;border:1px solid #333;border-radius:8px;padding:12px 16px;min-width:160px;">
              <strong style="color:#fff;font-size:0.85rem;">${address}</strong>
              ${opt.price ? `<p style="color:#4ade80;margin:4px 0 0;font-size:0.8rem;">$${opt.price}/mo</p>` : ""}
            </div>
          `)
      )
      .addTo(map.current!);

    bounds.extend([lng, lat]);
  });

  if (!bounds.isEmpty()) {
    map.current.fitBounds(bounds, { padding: 60, maxZoom: 14 });
  }

  return () => { map.current?.remove(); map.current = null; };
}