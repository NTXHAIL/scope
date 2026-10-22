export const MEDIA_TABS = [
  { id: "panels", label: "Panels" },
  { id: "vehicle", label: "Vehicle" },
  { id: "interior", label: "Interior" },
  { id: "wheel", label: "Wheel" },
  { id: "misc", label: "Misc" },
];

const PANEL_TILES = [
  { id: "lff", label: "LT Fender", panel: "LFF" },
  { id: "hood", label: "Hood", panel: "HOOD" },
  { id: "rff", label: "RT Fender", panel: "RFF" },
  { id: "lfd", label: "LT Front Door", panel: "LFD" },
  { id: "rfd", label: "RT Front Door", panel: "RFD" },
  { id: "lrd", label: "LT Rear Door", panel: "LRD" },
  { id: "rrd", label: "RT Rear Door", panel: "RRD" },
  { id: "lrail", label: "LT Rail", panel: "LRAIL" },
  { id: "roof", label: "Roof", panel: "ROOF" },
  { id: "rrail", label: "RT Rail", panel: "RRAIL" },
  { id: "lq", label: "LT Quarter", panel: "LQ" },
  { id: "trunk", label: "Trunk/Deck Lid", panel: "TRUNK" },
  { id: "rq", label: "RT Quarter", panel: "RQ" },
  { id: "lt-cab", label: "LT Cab Corner", panel: "LT_CAB" },
  { id: "rt-cab", label: "RT Cab Corner", panel: "RT_CAB" },
  { id: "lt-bed", label: "LT Bed Side", panel: "LT_BED" },
  { id: "rt-bed", label: "RT Bed Side", panel: "RT_BED" },
  { id: "tailgate", label: "Tailgate", panel: "TAILGATE" },
  { id: "pillars", label: "Pillars", panel: "PILLARS" },
  { id: "other", label: "Other", panel: "OTHER" },
];

const VEHICLE_TILES = [
  { id: "lt-front", label: "LT Front", row: 1, col: 1 },
  { id: "front", label: "Front", row: 1, col: 2 },
  { id: "rt-front", label: "RT Front", row: 1, col: 3 },
  { id: "lt-side", label: "LT Side", row: 2, col: 1 },
  { id: "rt-side", label: "RT Side", row: 2, col: 3 },
  { id: "lt-rear", label: "LT Rear", row: 3, col: 1 },
  { id: "rt-rear", label: "RT Rear", row: 3, col: 3 },
  { id: "video-1", label: "Video 1", row: 4, col: 1, video: true },
  { id: "rear", label: "Rear", row: 4, col: 2 },
  { id: "video-2", label: "Video 2", row: 4, col: 3, video: true },
  { id: "vin", label: "VIN", row: 5, col: 1 },
  { id: "video-3", label: "Video 3", row: 5, col: 2, video: true },
  { id: "odometer", label: "Odometer", row: 5, col: 3 },
  { id: "license", label: "License", row: 6, col: 1 },
  { id: "other", label: "Other", row: 6, col: 2 },
];

const INTERIOR_TILES = [
  { id: "steering", label: "Steering Wheel" },
  { id: "dash", label: "Dashboard" },
  { id: "console", label: "Center Console" },
  { id: "driver-seat", label: "Driver Seat" },
  { id: "pass-seat", label: "Pass Seat" },
  { id: "lfd-panel", label: "LFD Panel" },
  { id: "rfd-panel", label: "RFD Panel" },
  { id: "lrd-panel", label: "LRD Panel" },
  { id: "row2", label: "2nd Row Seat" },
  { id: "rrd-panel", label: "RRD Panel" },
  { id: "lt-quarter", label: "LT Quarter" },
  { id: "row3", label: "3rd Row Seat" },
  { id: "rt-quarter", label: "RT Quarter" },
  { id: "other", label: "Other" },
];

const WHEEL_TILES = [
  { id: "lf", label: "LF", row: 1, col: 1 },
  { id: "rf", label: "RF", row: 1, col: 3 },
  { id: "lr", label: "LR", row: 2, col: 1 },
  { id: "rr", label: "RR", row: 2, col: 3 },
  { id: "spare", label: "Spare", row: 4, col: 2 },
];

const CAR_CELLS = new Set(["2,2", "3,2"]);

export function layoutTiles(tiles) {
  let row = 1;
  let col = 1;
  return tiles.map((tile) => {
    if (tile.row && tile.col) return { ...tile };
    while (CAR_CELLS.has(`${row},${col}`)) {
      col += 1;
      if (col > 3) {
        col = 1;
        row += 1;
      }
    }
    const placed = { ...tile, row, col };
    col += 1;
    if (col > 3) {
      col = 1;
      row += 1;
    }
    return placed;
  });
}

export function layoutCells(count) {
  const cells = [];
  let row = 1;
  let col = 1;
  for (let index = 0; index < count; index += 1) {
    while (CAR_CELLS.has(`${row},${col}`)) {
      col += 1;
      if (col > 3) {
        col = 1;
        row += 1;
      }
    }
    cells.push({ row, col });
    col += 1;
    if (col > 3) {
      col = 1;
      row += 1;
    }
  }
  return cells;
}

export function tilesForTab(tabId) {
  if (tabId === "panels") return layoutTiles(PANEL_TILES);
  if (tabId === "vehicle") return layoutTiles(VEHICLE_TILES);
  if (tabId === "interior") return layoutTiles(INTERIOR_TILES);
  if (tabId === "wheel") return layoutTiles(WHEEL_TILES);
  return [];
}

export function tabLabel(tabId) {
  return MEDIA_TABS.find((tab) => tab.id === tabId)?.label || "Misc";
}
