import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import * as turf from "@turf/turf";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import "./properties.css";
import { usePropertiesStore } from "./store";
import type { Property } from "./types";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string;

export default function Properties() {
  const { properties, polygonProps, loading, searchQuery, loadProperties, setPolygonProps, setSearchQuery } =
    usePropertiesStore();

  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const draw = useRef<MapboxDraw | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  const [selected, setSelected] = useState<Property | null>(null);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  useEffect(() => {
    if (!mapRef.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-73.985, 40.748],
      zoom: 11,
    });

    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: { line_string: true, trash: true },
    });

    map.current.addControl(draw.current);
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.current.on("draw.create", handleDraw);
    map.current.on("draw.update", handleDraw);
    map.current.on("draw.delete", () => setPolygonProps([]));

    return () => {
      map.current?.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update markers whenever properties change
  useEffect(() => {
    if (!map.current) return;

    markers.current.forEach((m) => m.remove());
    markers.current = [];

    const displayList = polygonProps.length > 0 ? polygonProps : properties;
    const filtered = searchQuery
      ? displayList.filter((p) =>
        p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.borough.toLowerCase().includes(searchQuery.toLowerCase())
      )
      : displayList;

    filtered.forEach((prop) => {
      if (!prop.latitude || !prop.longitude) return;

      const el = document.createElement("div");
      el.style.cssText =
        "width:12px;height:12px;background:#fff;border-radius:50%;border:2px solid rgba(255,255,255,0.4);cursor:pointer;";

      const popup = new mapboxgl.Popup({ offset: 12, closeButton: false })
        .setHTML(`
          <div class="propPopup">
            <h4>${prop.address}</h4>
            <p>${prop.borough}</p>
            ${prop.min_price ? `<p>From $${prop.min_price}/mo</p>` : ""}
          </div>
        `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([prop.longitude, prop.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      el.addEventListener("click", () => setSelected(prop));
      markers.current.push(marker);
    });
  }, [properties, polygonProps, searchQuery]);

  const handleDraw = () => {
    if (!draw.current) return;
    const data = draw.current.getAll();
    const features = data.features;
    if (!features.length) { setPolygonProps([]); return; }

    // Convert line strings to polygons via turf buffer
    type TurfPolygonFeature = GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
    const polygons: (TurfPolygonFeature | undefined)[] = features
      .filter((f: GeoJSON.Feature) => f.geometry.type === "LineString")
      .map((f: GeoJSON.Feature) => {
        const coords = (f.geometry as GeoJSON.LineString).coordinates;
        const line = turf.lineString(coords as [number, number][]);
        return turf.buffer(line, 0.05, { units: "kilometers" }) as TurfPolygonFeature | undefined;
      });

    const validPolygons = polygons.filter((p): p is TurfPolygonFeature => p !== undefined);
    if (!validPolygons.length) { setPolygonProps([]); return; }

    let union: TurfPolygonFeature | null = validPolygons[0];
    for (let i = 1; i < validPolygons.length; i++) {
      const next = validPolygons[i];
      const merged = turf.union(turf.featureCollection([union, next]));
      if (merged) union = merged as TurfPolygonFeature;
    }
    if (!union) { setPolygonProps([]); return; }

    const inside = properties.filter((p) => {
      if (!p.latitude || !p.longitude) return false;
      const pt = turf.point([p.longitude, p.latitude]);
      return turf.booleanPointInPolygon(pt, union as TurfPolygonFeature);
    });

    setPolygonProps(inside);
  };

  const displayList =
    polygonProps.length > 0
      ? polygonProps
      : searchQuery
        ? properties.filter(
          (p) =>
            p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.borough.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : properties;

  return (
    <div className="searchPage">
      {/* Sidebar */}
      <div className="searchSidebar">
        <div className="searchSidebarHeader">
          <h3>Properties</h3>
          <input
            className="searchInput"
            placeholder="Search address or borough..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {polygonProps.length > 0 && (
          <div className="searchHint">
            <i className="fa-solid fa-draw-polygon" /> Showing {polygonProps.length} properties in drawn area
          </div>
        )}

        <div className="propList">
          {loading && properties.length === 0 && <p className="emptyState">Loading...</p>}
          {!loading && displayList.length === 0 && <p className="emptyState">No properties found.</p>}
          {displayList.map((p) => (
            <div
              key={p.id}
              className={`propItem${selected?.id === p.id ? " active" : ""}`}
              onClick={() => {
                setSelected(p);
                if (p.latitude && p.longitude && map.current) {
                  map.current.flyTo({ center: [p.longitude, p.latitude], zoom: 15, duration: 800 });
                }
              }}
            >
              <div className="propItemAddress">{p.address}</div>
              <div className="propItemMeta">
                <span>{p.borough}</span>
                {p.min_price && <span>From ${p.min_price}/mo</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="searchMap">
        <div ref={mapRef} className="mapContainer" />
        {polygonProps.length > 0 && (
          <div className="polygonCount">
            <i className="fa-solid fa-location-dot" /> {polygonProps.length} in area
          </div>
        )}
        <div className="drawHint">
          Draw a line to filter by area · Use the trash icon to clear
        </div>
      </div>

      {/* Selected property detail panel */}
      {selected && (
        <div className="modalOverlay" onClick={() => setSelected(null)}>
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <h3>{selected.address}</h3>
            <div className="detailGrid">
              <div className="detailItem"><label>Borough</label><span>{selected.borough}</span></div>
              {selected.min_price && (
                <div className="detailItem"><label>Price Range</label><span>${selected.min_price} – ${selected.max_price}/mo</span></div>
              )}
            </div>
            {selected.description && (
              <div className="modalField">
                <label>Description</label>
                <p style={{ color: "#ccc", fontSize: "0.875rem", margin: 0 }}>{selected.description}</p>
              </div>
            )}
            <div className="modalActions">
              <button className="modalCancelBtn" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
