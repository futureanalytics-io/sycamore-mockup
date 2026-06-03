"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, ImageOverlay, Polygon, Marker, Tooltip, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { usePortalStore } from "@/lib/store";
import { ragPathOptions, RAG_COLORS, formatGbpFull, formatArea } from "@/lib/rag";
import { IMAGE_HEIGHT, IMAGE_WIDTH } from "@/lib/utils";
import type { RoofSection } from "@/lib/types";
import { Edit3, Plus, Download, RotateCcw, X, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CampusMapProps {
  height?: number;
  showEditorToggle?: boolean;
  fullWidth?: boolean;
  onSectionDoubleClick?: (sectionId: string) => void;
}

export function CampusMap({ height = 560, showEditorToggle = true, fullWidth = false, onSectionDoubleClick }: CampusMapProps) {
  const { buildings, selectedSectionId, selectSection, editMode, toggleEditMode } = usePortalStore();

  const bounds = useMemo<L.LatLngBoundsExpression>(
    () => [
      [0, 0],
      [IMAGE_HEIGHT, IMAGE_WIDTH],
    ],
    []
  );

  const allSections = useMemo(
    () => buildings.flatMap((b) => b.sections.map((s) => ({ section: s, buildingName: b.name }))),
    [buildings]
  );

  const [drawing, setDrawing] = useState(false);
  const [drawPoints, setDrawPoints] = useState<[number, number][]>([]);

  return (
    <div
      className={`relative rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-paper)] overflow-hidden shadow-[0_1px_2px_rgba(17,32,37,0.04)] ${
        drawing ? "draw-cursor" : ""
      }`}
    >
      {/* Map header */}
      <div className="absolute top-0 left-0 right-0 z-[400] flex items-center justify-between px-4 py-3 bg-gradient-to-b from-white/95 to-white/0 backdrop-blur-[2px] pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="font-display text-[13.5px] font-semibold text-[color:var(--color-ink-strong)]">
            University of Bradford — main campus
          </div>
          <span className="text-[11.5px] text-[color:var(--color-ink-muted)]">
            · {allSections.length} roof sections
          </span>
        </div>
        {showEditorToggle && (
          <div className="flex items-center gap-2 pointer-events-auto">
            {editMode && (
              <EditorControls
                drawing={drawing}
                setDrawing={setDrawing}
                drawPoints={drawPoints}
                setDrawPoints={setDrawPoints}
              />
            )}
            <Button
              size="sm"
              variant={editMode ? "default" : "outline"}
              onClick={() => {
                toggleEditMode();
                setDrawing(false);
                setDrawPoints([]);
              }}
            >
              <Edit3 className="h-3 w-3" />
              {editMode ? "Exit edit mode" : "Edit polygons"}
            </Button>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-[400] bg-[color:var(--color-paper)] border border-[color:var(--color-line)] rounded-xl px-3 py-2 flex items-center gap-3.5 shadow-[0_4px_14px_-4px_rgba(17,32,37,0.15)]">
        {(["red", "amber", "green"] as const).map((rag) => (
          <div key={rag} className="flex items-center gap-1.5 text-[11px] text-[color:var(--color-ink-soft)] font-medium">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{
                backgroundColor: RAG_COLORS[rag].fill,
                border: `1px solid ${RAG_COLORS[rag].stroke}`,
              }}
            />
            <span>{RAG_COLORS[rag].label}</span>
          </div>
        ))}
        <div className="h-3 w-px bg-[color:var(--color-line-strong)]" />
        <div className="text-[11px] text-[color:var(--color-ink-muted)] flex items-center gap-1">
          <span className="hidden sm:inline">Click section · hover for details</span>
        </div>
      </div>

      <MapContainer
        crs={L.CRS.Simple}
        bounds={bounds}
        maxBounds={bounds}
        maxBoundsViscosity={1}
        minZoom={-2}
        maxZoom={2}
        zoom={-1}
        zoomSnap={0.25}
        zoomDelta={0.25}
        attributionControl={false}
        style={{
          height: `${height}px`,
          width: fullWidth ? "100%" : "100%",
          background: "var(--color-cream-edge)",
        }}
      >
        <ImageOverlay url="/campus-map.jpg" bounds={bounds} />
        <SectionLayer
          sections={allSections.map((x) => x.section)}
          buildingNames={Object.fromEntries(
            buildings.map((b) => [b.code, b.name])
          )}
          selectedSectionId={selectedSectionId}
          onSelectSection={selectSection}
          onSectionDoubleClick={onSectionDoubleClick}
          editMode={editMode}
        />
        <FitToBoundsOnMount bounds={bounds} />
        {drawing && (
          <DrawHandler
            drawPoints={drawPoints}
            setDrawPoints={setDrawPoints}
            onComplete={(polygon) => {
              const id = window.prompt(
                'New section ID (e.g. "PSW/05"). Use existing building code to add to that building, or a new code to create a new building.'
              );
              if (!id || !id.includes("/")) {
                setDrawing(false);
                setDrawPoints([]);
                return;
              }
              const [code] = id.split("/");
              usePortalStore.getState().addPolygon(code.toUpperCase(), id.toUpperCase(), polygon);
              toast.success(`Added section ${id.toUpperCase()}`);
              setDrawing(false);
              setDrawPoints([]);
            }}
            onCancel={() => {
              setDrawing(false);
              setDrawPoints([]);
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}

interface SectionLayerProps {
  sections: RoofSection[];
  buildingNames: Record<string, string>;
  selectedSectionId: string | null;
  onSelectSection: (id: string | null) => void;
  onSectionDoubleClick?: (id: string) => void;
  editMode: boolean;
}

function SectionLayer({
  sections,
  buildingNames,
  selectedSectionId,
  onSelectSection,
  onSectionDoubleClick,
  editMode,
}: SectionLayerProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <>
      {sections.map((section) => {
        const isSelected = section.id === selectedSectionId;
        const isHovered = section.id === hoveredId;
        const pathOptions = ragPathOptions(section.rag, isSelected, isHovered);

        return (
          <Polygon
            key={`${section.id}-${section.rag}-${section.polygon.length}-${isSelected}-${isHovered}`}
            positions={section.polygon}
            pathOptions={pathOptions}
            eventHandlers={{
              click: () => onSelectSection(section.id),
              dblclick: () => {
                onSelectSection(section.id);
                onSectionDoubleClick?.(section.id);
              },
              mouseover: () => setHoveredId(section.id),
              mouseout: () =>
                setHoveredId((cur) => (cur === section.id ? null : cur)),
            }}
          >
            <Tooltip
              direction="top"
              offset={[0, -8]}
              className="hover-card"
              sticky
              opacity={1}
            >
              <HoverCardContent
                section={section}
                buildingName={buildingNames[section.buildingCode] || section.buildingCode}
              />
            </Tooltip>
          </Polygon>
        );
      })}
      {sections.map((section) => (
        <Marker
          key={`label-${section.id}`}
          position={section.labelPosition}
          icon={L.divIcon({
            className: "building-label-icon",
            html: `<div class="building-label-pill">${section.id}</div>`,
            iconSize: undefined as unknown as L.PointTuple,
            iconAnchor: [0, 0],
          })}
          interactive={false}
          keyboard={false}
        />
      ))}
      {editMode && <VertexHandles sections={sections} />}
    </>
  );
}

function HoverCardContent({
  section,
  buildingName,
}: {
  section: RoofSection;
  buildingName: string;
}) {
  const c = RAG_COLORS[section.rag];
  const eyebrow = { fontSize: 9.5, color: "#9aa3aa", textTransform: "uppercase" as const, letterSpacing: "0.12em", fontWeight: 600, fontFamily: "var(--font-display)" };
  const value = { fontSize: 12.5, color: "#1f1f1f", fontWeight: 500 };
  return (
    <div style={{ minWidth: 230 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: "#377587" }}>{section.id}</div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: c.text,
            background: c.bg,
            padding: "2px 8px",
            borderRadius: 999,
            fontFamily: "var(--font-display)",
          }}
        >
          {c.label}
        </div>
      </div>
      <div style={{ fontSize: 11, color: "#6b7680", marginBottom: 10 }}>{buildingName}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 11 }}>
        <div>
          <div style={eyebrow}>Area</div>
          <div style={value}>{formatArea(section.areaSqm)}</div>
        </div>
        <div>
          <div style={eyebrow}>Forecast</div>
          <div style={value}>{formatGbpFull(section.forecastCostGbp)}</div>
        </div>
        <div>
          <div style={eyebrow}>Type</div>
          <div style={value}>{section.roofType}</div>
        </div>
        <div>
          <div style={eyebrow}>Life left</div>
          <div style={value}>{section.lifeRemainingYears} yrs</div>
        </div>
      </div>
      <div style={{ marginTop: 10, fontSize: 10.5, color: "#9aa3aa", borderTop: "0.5px solid rgba(17,32,37,0.08)", paddingTop: 6 }}>
        Click section to edit or log an audit
      </div>
    </div>
  );
}

function FitToBoundsOnMount({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [10, 10] });
  }, [map, bounds]);
  return null;
}

function VertexHandles({ sections }: { sections: RoofSection[] }) {
  const map = useMap();
  const updatePolygon = usePortalStore((s) => s.updatePolygon);
  const handleRefs = useRef<Map<string, L.CircleMarker[]>>(new Map());

  useEffect(() => {
    const layer = L.layerGroup().addTo(map);

    sections.forEach((section) => {
      const markers: L.CircleMarker[] = [];
      section.polygon.forEach((pt, idx) => {
        const marker = L.circleMarker(pt, {
          radius: 5,
          color: "#1a7a8c",
          fillColor: "#ffffff",
          fillOpacity: 1,
          weight: 2,
          interactive: true,
        }).addTo(layer);

        let dragging = false;

        marker.on("mousedown", () => {
          dragging = true;
          map.dragging.disable();
          map.on("mousemove", onMove);
          map.on("mouseup", onUp);
        });

        const onMove = (e: L.LeafletMouseEvent) => {
          if (!dragging) return;
          marker.setLatLng(e.latlng);
        };

        const onUp = () => {
          if (!dragging) return;
          dragging = false;
          map.dragging.enable();
          map.off("mousemove", onMove);
          map.off("mouseup", onUp);
          const latest = handleRefs.current.get(section.id);
          if (latest) {
            const newPoly: [number, number][] = latest.map((m) => {
              const ll = m.getLatLng();
              return [ll.lat, ll.lng];
            });
            updatePolygon(section.id, newPoly);
          }
        };

        markers.push(marker);
        void idx;
      });
      handleRefs.current.set(section.id, markers);
    });

    return () => {
      handleRefs.current.clear();
      layer.remove();
    };
  }, [map, sections, updatePolygon]);

  return null;
}

interface DrawHandlerProps {
  drawPoints: [number, number][];
  setDrawPoints: (pts: [number, number][]) => void;
  onComplete: (polygon: [number, number][]) => void;
  onCancel: () => void;
}

function DrawHandler({ drawPoints, setDrawPoints, onComplete, onCancel }: DrawHandlerProps) {
  const map = useMap();

  useMapEvents({
    click(e) {
      setDrawPoints([...drawPoints, [e.latlng.lat, e.latlng.lng]]);
    },
    dblclick() {
      if (drawPoints.length >= 3) {
        onComplete(drawPoints);
      }
    },
  });

  useEffect(() => {
    map.doubleClickZoom.disable();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter" && drawPoints.length >= 3) onComplete(drawPoints);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      map.doubleClickZoom.enable();
      window.removeEventListener("keydown", onKey);
    };
  }, [map, onCancel, onComplete, drawPoints]);

  if (drawPoints.length === 0) return null;

  return (
    <>
      <Polygon
        positions={drawPoints}
        pathOptions={{
          color: "#1a7a8c",
          weight: 2,
          fillColor: "#1a7a8c",
          fillOpacity: 0.15,
          dashArray: "6 4",
        }}
      />
      {drawPoints.map((pt, i) => (
        <Tooltip
          key={i}
          position={pt}
          permanent
          direction="center"
          className="building-label"
          opacity={1}
        >
          {i + 1}
        </Tooltip>
      ))}
    </>
  );
}

interface EditorControlsProps {
  drawing: boolean;
  setDrawing: (v: boolean) => void;
  drawPoints: [number, number][];
  setDrawPoints: (pts: [number, number][]) => void;
}

function EditorControls({ drawing, setDrawing, drawPoints, setDrawPoints }: EditorControlsProps) {
  const { resetSeed, exportSeed } = usePortalStore();
  const [copying, setCopying] = useState(false);

  if (drawing) {
    return (
      <div className="flex items-center gap-1.5 bg-white border border-[color:var(--color-border)] rounded-md px-2 py-1 shadow-sm">
        <span className="text-[11px] text-[color:var(--color-muted)]">
          {drawPoints.length} vertices · click to add, double-click or Enter to finish
        </span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setDrawing(false);
            setDrawPoints([]);
          }}
        >
          <X className="h-3 w-3" /> Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <Button size="sm" variant="outline" onClick={() => setDrawing(true)}>
        <Plus className="h-3 w-3" /> Draw section
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={async () => {
          setCopying(true);
          try {
            const json = exportSeed();
            await navigator.clipboard.writeText(json);
            toast.success("Polygons copied to clipboard as JSON");
          } catch {
            toast.error("Could not copy to clipboard");
          } finally {
            setCopying(false);
          }
        }}
      >
        {copying ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
        Export JSON
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          if (window.confirm("Reset all polygons to the original seed?")) {
            resetSeed();
            toast.success("Polygons reset to seed");
          }
        }}
      >
        <RotateCcw className="h-3 w-3" /> Reset
      </Button>
      <span className="hidden">
        <Check className="h-3 w-3" />
      </span>
    </div>
  );
}
