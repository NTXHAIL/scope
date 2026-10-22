// Pricing, estimates, and the GoHighLevel lead payload.
// No API tokens live in this file.

export const ESTIMATE_DISCLAIMER =
  "This is a repair estimate only. It is not a promise to waive a deductible, pay a rebate, or cover any part of an insurance claim.";

export const GHL_SUMMARY_LIMIT = 1500;

export const CARRIERS = [
  { id: "state_farm",  label: "State Farm",  color: "#dc2626", badge: "SF"  },
  { id: "allstate",    label: "Allstate",    color: "#0066cc", badge: "AL"  },
  { id: "farmers",     label: "Farmers",     color: "#e07b00", badge: "FM"  },
  { id: "geico",       label: "GEICO",       color: "#00a651", badge: "GE"  },
  { id: "progressive", label: "Progressive", color: "#0066ff", badge: "PR"  },
  { id: "nationwide",  label: "Nationwide",  color: "#1a1a6e", badge: "NW"  },
  { id: "custom",      label: "Custom",      color: "#64748b", badge: "CX"  },
];

// Only State Farm has a filled matrix. Other carriers stay null until a real
// matrix is added. Null must not fall through to State Farm prices.
export const CARRIER_MATRICES = {
  state_farm: null,
  allstate: null,
  farmers: null,
  geico: null,
  progressive: null,
  nationwide: null,
  custom: null,
};

export const PRICING_MATRIX = {
  HOOD: [
    { range: "1 - 5", min: 1, max: 5, DIME: 80, NICKEL: 100, QUARTER: 125, HALF: 150 },
    { range: "6 - 15", min: 6, max: 15, DIME: 125, NICKEL: 175, QUARTER: 200, HALF: 250 },
    { range: "16 - 30", min: 16, max: 30, DIME: 200, NICKEL: 225, QUARTER: 275, HALF: 350 },
    { range: "31 - 50", min: 31, max: 50, DIME: 300, NICKEL: 350, QUARTER: 425, HALF: 500 },
    { range: "51 - 75", min: 51, max: 75, DIME: 375, NICKEL: 400, QUARTER: 500, HALF: 625 },
    { range: "76 - 100", min: 76, max: 100, DIME: 450, NICKEL: 550, QUARTER: 650, HALF: 750 },
    { range: "101 - 150", min: 101, max: 150, DIME: 550, NICKEL: 650, QUARTER: 0, HALF: 0 },
    { range: "151 - 200", min: 151, max: 200, DIME: 650, NICKEL: 800, QUARTER: 0, HALF: 0 },
    { range: "201 - 300", min: 201, max: 300, DIME: 725, NICKEL: 825, QUARTER: 0, HALF: 0 },
  ],
  ROOF: [
    { range: "1 - 5", min: 1, max: 5, DIME: 100, NICKEL: 125, QUARTER: 150, HALF: 200 },
    { range: "6 - 15", min: 6, max: 15, DIME: 175, NICKEL: 225, QUARTER: 250, HALF: 325 },
    { range: "16 - 30", min: 16, max: 30, DIME: 250, NICKEL: 300, QUARTER: 350, HALF: 425 },
    { range: "31 - 50", min: 31, max: 50, DIME: 375, NICKEL: 425, QUARTER: 525, HALF: 600 },
    { range: "51 - 75", min: 51, max: 75, DIME: 475, NICKEL: 550, QUARTER: 675, HALF: 800 },
    { range: "76 - 100", min: 76, max: 100, DIME: 575, NICKEL: 675, QUARTER: 800, HALF: 900 },
    { range: "101 - 150", min: 101, max: 150, DIME: 650, NICKEL: 750, QUARTER: 950, HALF: 1100 },
    { range: "151 - 200", min: 151, max: 200, DIME: 850, NICKEL: 950, QUARTER: 1150, HALF: 1450 },
    { range: "201 - 300", min: 201, max: 300, DIME: 950, NICKEL: 1150, QUARTER: 1350, HALF: 1550 },
  ],
  TRUNK: [
    { range: "1 - 5", min: 1, max: 5, DIME: 80, NICKEL: 100, QUARTER: 125, HALF: 150 },
    { range: "6 - 15", min: 6, max: 15, DIME: 125, NICKEL: 150, QUARTER: 200, HALF: 250 },
    { range: "16 - 30", min: 16, max: 30, DIME: 175, NICKEL: 225, QUARTER: 275, HALF: 300 },
    { range: "31 - 50", min: 31, max: 50, DIME: 275, NICKEL: 325, QUARTER: 400, HALF: 475 },
    { range: "51 - 75", min: 51, max: 75, DIME: 400, NICKEL: 450, QUARTER: 500, HALF: 600 },
    { range: "76 - 100", min: 76, max: 100, DIME: 450, NICKEL: 550, QUARTER: 650, HALF: 0 },
    { range: "101 - 150", min: 101, max: 150, DIME: 550, NICKEL: 650, QUARTER: 0, HALF: 0 },
    { range: "151 - 200", min: 151, max: 200, DIME: 650, NICKEL: 0, QUARTER: 0, HALF: 0 },
    { range: "201 - 300", min: 201, max: 300, DIME: 750, NICKEL: 0, QUARTER: 0, HALF: 0 },
  ],
  LFF: [
    { range: "1 - 5", min: 1, max: 5, DIME: 80, NICKEL: 100, QUARTER: 125, HALF: 150 },
    { range: "6 - 15", min: 6, max: 15, DIME: 125, NICKEL: 150, QUARTER: 175, HALF: 200 },
    { range: "16 - 30", min: 16, max: 30, DIME: 175, NICKEL: 225, QUARTER: 275, HALF: 300 },
    { range: "31 - 50", min: 31, max: 50, DIME: 275, NICKEL: 300, QUARTER: 350, HALF: 375 },
  ],
  LFD: [
    { range: "1 - 5", min: 1, max: 5, DIME: 80, NICKEL: 100, QUARTER: 125, HALF: 150 },
    { range: "6 - 15", min: 6, max: 15, DIME: 125, NICKEL: 150, QUARTER: 175, HALF: 200 },
    { range: "16 - 30", min: 16, max: 30, DIME: 175, NICKEL: 225, QUARTER: 250, HALF: 300 },
    { range: "31 - 50", min: 31, max: 50, DIME: 275, NICKEL: 300, QUARTER: 350, HALF: 0 },
  ],
  LRD: [
    { range: "1 - 5", min: 1, max: 5, DIME: 80, NICKEL: 100, QUARTER: 125, HALF: 150 },
    { range: "6 - 15", min: 6, max: 15, DIME: 125, NICKEL: 150, QUARTER: 175, HALF: 200 },
    { range: "16 - 30", min: 16, max: 30, DIME: 175, NICKEL: 225, QUARTER: 250, HALF: 300 },
    { range: "31 - 50", min: 31, max: 50, DIME: 275, NICKEL: 300, QUARTER: 350, HALF: 0 },
  ],
  LQ: [
    { range: "1 - 5", min: 1, max: 5, DIME: 80, NICKEL: 100, QUARTER: 125, HALF: 150 },
    { range: "6 - 15", min: 6, max: 15, DIME: 125, NICKEL: 150, QUARTER: 175, HALF: 200 },
    { range: "16 - 30", min: 16, max: 30, DIME: 175, NICKEL: 225, QUARTER: 250, HALF: 300 },
    { range: "31 - 50", min: 31, max: 50, DIME: 275, NICKEL: 325, QUARTER: 400, HALF: 475 },
  ],
  LRAIL: [
    { range: "1 - 5", min: 1, max: 5, DIME: 85, NICKEL: 100, QUARTER: 125, HALF: 150 },
    { range: "6 - 15", min: 6, max: 15, DIME: 125, NICKEL: 150, QUARTER: 175, HALF: 0 },
    { range: "16 - 30", min: 16, max: 30, DIME: 200, NICKEL: 250, QUARTER: 275, HALF: 0 },
    { range: "31 - 50", min: 31, max: 50, DIME: 300, NICKEL: 400, QUARTER: 0, HALF: 0 },
  ],
  RFF: [
    { range: "1 - 5", min: 1, max: 5, DIME: 80, NICKEL: 100, QUARTER: 125, HALF: 150 },
    { range: "6 - 15", min: 6, max: 15, DIME: 125, NICKEL: 150, QUARTER: 175, HALF: 200 },
    { range: "16 - 30", min: 16, max: 30, DIME: 175, NICKEL: 225, QUARTER: 275, HALF: 300 },
    { range: "31 - 50", min: 31, max: 50, DIME: 275, NICKEL: 300, QUARTER: 350, HALF: 375 },
  ],
  RFD: [
    { range: "1 - 5", min: 1, max: 5, DIME: 80, NICKEL: 100, QUARTER: 125, HALF: 150 },
    { range: "6 - 15", min: 6, max: 15, DIME: 125, NICKEL: 150, QUARTER: 175, HALF: 200 },
    { range: "16 - 30", min: 16, max: 30, DIME: 175, NICKEL: 225, QUARTER: 250, HALF: 300 },
    { range: "31 - 50", min: 31, max: 50, DIME: 275, NICKEL: 300, QUARTER: 350, HALF: 0 },
  ],
  RRD: [
    { range: "1 - 5", min: 1, max: 5, DIME: 80, NICKEL: 100, QUARTER: 125, HALF: 150 },
    { range: "6 - 15", min: 6, max: 15, DIME: 125, NICKEL: 150, QUARTER: 175, HALF: 200 },
    { range: "16 - 30", min: 16, max: 30, DIME: 175, NICKEL: 225, QUARTER: 250, HALF: 300 },
    { range: "31 - 50", min: 31, max: 50, DIME: 275, NICKEL: 300, QUARTER: 350, HALF: 0 },
  ],
  RQ: [
    { range: "1 - 5", min: 1, max: 5, DIME: 80, NICKEL: 100, QUARTER: 125, HALF: 150 },
    { range: "6 - 15", min: 6, max: 15, DIME: 125, NICKEL: 150, QUARTER: 175, HALF: 200 },
    { range: "16 - 30", min: 16, max: 30, DIME: 175, NICKEL: 225, QUARTER: 250, HALF: 300 },
    { range: "31 - 50", min: 31, max: 50, DIME: 275, NICKEL: 325, QUARTER: 400, HALF: 475 },
  ],
  RRAIL: [
    { range: "1 - 5", min: 1, max: 5, DIME: 85, NICKEL: 100, QUARTER: 125, HALF: 150 },
    { range: "6 - 15", min: 6, max: 15, DIME: 125, NICKEL: 150, QUARTER: 175, HALF: 0 },
    { range: "16 - 30", min: 16, max: 30, DIME: 200, NICKEL: 250, QUARTER: 275, HALF: 0 },
    { range: "31 - 50", min: 31, max: 50, DIME: 300, NICKEL: 400, QUARTER: 0, HALF: 0 },
  ],
};

export const ADDONS = [
  { name: "Oversized Dent", type: "dollar", value: 50 },
  { name: "Aluminum", type: "percent", value: 0.25 },
  { name: "HSS", type: "percent", value: 0.25 },
  { name: "Double Panel", type: "percent", value: 0.25 },
  { name: "Limited Access", type: "percent", value: 0.20 },
  { name: "Tall Vehicle", type: "percent", value: 0.25 },
  { name: "XL Panel", type: "percent", value: 0.25 },
  { name: "Double OS Dents", type: "dollar", value: 100 },
];

export const PANEL_LABELS = {
  HOOD: "Hood", ROOF: "Roof", TRUNK: "Trunk / Liftgate / Tailgate",
  LFF: "Left Front Fender", LFD: "Left Front Door", LRD: "Left Rear Door",
  LQ: "Left Quarter", LRAIL: "Left Rail",
  RFF: "Right Front Fender", RFD: "Right Front Door", RRD: "Right Rear Door",
  RQ: "Right Quarter", RRAIL: "Right Rail",
  LT_CAB: "LT Cab Corner", RT_CAB: "RT Cab Corner",
  LT_BED: "LT Bed Side", RT_BED: "RT Bed Side",
  TAILGATE: "Tailgate", PILLARS: "Pillars", OTHER: "Other Panel",
};

export const RI_OPERATIONS = {
  HOOD: [
    { id: "front_bumper", name: "Front Bumper", time: 1.0 },
    { id: "hood", name: "Hood", time: 1.2 },
    { id: "insulator", name: "Insulator", time: 0.3 },
    { id: "trim", name: "Trim", time: 0.3 },
  ],
  LFF: [
    { id: "liner", name: "Liner", time: 0.2 },
    { id: "headlamp", name: "Headlamp", time: 0.3 },
    { id: "trim", name: "Trim", time: 0.3 },
  ],
  RFF: [
    { id: "liner", name: "Liner", time: 0.2 },
    { id: "headlamp", name: "Headlamp", time: 0.3 },
    { id: "trim", name: "Trim", time: 0.3 },
  ],
  ROOF: [
    { id: "headliner", name: "Headliner", time: 3.0 },
    { id: "sunroof_frame", name: "Sunroof Frame", time: 1.5 },
    { id: "rack", name: "Rack", time: 1.0 },
    { id: "left_molding", name: "Left Molding", time: 0.3, rrOption: true },
    { id: "right_molding", name: "Right Molding", time: 0.3, rrOption: true },
    { id: "antenna", name: "Antenna", time: 0.3 },
    { id: "backglass", name: "Backglass", time: 1.0 },
    { id: "trim", name: "Trim", time: 0.3 },
  ],
  LFD: [
    { id: "mirror", name: "Mirror", time: 0.3, rrOption: true },
    { id: "belt", name: "Belt", time: 0.3, rrOption: true },
    { id: "upper", name: "Upper", time: 0.3, rrOption: true },
    { id: "trim", name: "Trim", time: 0.4 },
    { id: "glass", name: "Glass", time: 0.4 },
    { id: "handle", name: "Handle", time: 0.2 },
    { id: "door", name: "Door", time: 1.2 },
  ],
  RFD: [
    { id: "mirror", name: "Mirror", time: 0.3, rrOption: true },
    { id: "belt", name: "Belt", time: 0.3, rrOption: true },
    { id: "upper", name: "Upper", time: 0.3, rrOption: true },
    { id: "trim", name: "Trim", time: 0.4 },
    { id: "glass", name: "Glass", time: 0.4 },
    { id: "handle", name: "Handle", time: 0.2 },
    { id: "door", name: "Door", time: 1.2 },
  ],
  LRD: [
    { id: "mirror", name: "Mirror", time: 0.3, rrOption: true },
    { id: "belt", name: "Belt", time: 0.3, rrOption: true },
    { id: "upper", name: "Upper", time: 0.3, rrOption: true },
    { id: "trim", name: "Trim", time: 0.4 },
    { id: "glass", name: "Glass", time: 0.4 },
    { id: "handle", name: "Handle", time: 0.2 },
    { id: "door", name: "Door", time: 1.2 },
  ],
  RRD: [
    { id: "mirror", name: "Mirror", time: 0.3, rrOption: true },
    { id: "belt", name: "Belt", time: 0.3, rrOption: true },
    { id: "upper", name: "Upper", time: 0.3, rrOption: true },
    { id: "trim", name: "Trim", time: 0.4 },
    { id: "glass", name: "Glass", time: 0.4 },
    { id: "handle", name: "Handle", time: 0.2 },
    { id: "door", name: "Door", time: 1.2 },
  ],
  LQ: [
    { id: "trim", name: "Trim", time: 0.3 },
    { id: "taillamp", name: "Taillamp", time: 0.3 },
    { id: "qtr_glass", name: "Qtr Glass", time: 0.5, rrOption: true },
  ],
  RQ: [
    { id: "trim", name: "Trim", time: 0.3 },
    { id: "taillamp", name: "Taillamp", time: 0.3 },
    { id: "qtr_glass", name: "Qtr Glass", time: 0.5, rrOption: true },
  ],
  TRUNK: [
    { id: "trunk", name: "Trunk / Liftgate / Tailgate", time: 1.0 },
    { id: "trim", name: "Trim", time: 0.3 },
  ],
  LRAIL: [],
  RRAIL: [],
};

export const DEFAULT_LABOR_RATE = 60;
export const DENT_SIZES = ["DIME", "NICKEL", "QUARTER", "HALF"];
export const DENT_SIZE_LABELS = { DIME: "Dime", NICKEL: "Nickel", QUARTER: "Quarter", HALF: "Half Dollar" };

export const VEHICLE_YEARS = Array.from({ length: 17 }, (_, i) => String(2026 - i));
export const VEHICLE_DATA = {
  "Acura":["ILX","Integra","MDX","RDX","TLX"],"Alfa Romeo":["Giulia","Stelvio","Tonale"],
  "Audi":["A3","A4","A5","A6","A7","A8","e-tron","Q3","Q4","Q5","Q7","Q8","RS5","RS7","S4","S5","TT"],
  "BMW":["2 Series","3 Series","4 Series","5 Series","7 Series","8 Series","i4","i5","i7","iX","X1","X2","X3","X4","X5","X6","X7","Z4"],
  "Buick":["Enclave","Encore","Encore GX","Envision","Envista"],
  "Cadillac":["CT4","CT5","Escalade","Escalade ESV","LYRIQ","XT4","XT5","XT6"],
  "Chevrolet":["Blazer","Bolt EUV","Bolt EV","Camaro","Colorado","Corvette","Equinox","Express","Malibu","Silverado 1500","Silverado 2500HD","Silverado 3500HD","Suburban","Tahoe","Trailblazer","Traverse","Trax"],
  "Chrysler":["300","Pacifica","Voyager"],"Dodge":["Challenger","Charger","Durango","Hornet"],
  "Ford":["Bronco","Bronco Sport","E-Transit","Edge","Escape","Expedition","Explorer","F-150","F-150 Lightning","F-250","F-350","Maverick","Mustang","Mustang Mach-E","Ranger","Transit"],
  "Genesis":["Electrified G80","Electrified GV70","G70","G80","G90","GV60","GV70","GV80"],
  "GMC":["Acadia","Canyon","Hummer EV","Sierra 1500","Sierra 2500HD","Sierra 3500HD","Terrain","Yukon","Yukon XL"],
  "Honda":["Accord","Civic","CR-V","HR-V","Odyssey","Passport","Pilot","Prologue","Ridgeline"],
  "Hyundai":["Elantra","Ioniq 5","Ioniq 6","Kona","Palisade","Santa Cruz","Santa Fe","Sonata","Tucson","Venue"],
  "Infiniti":["Q50","Q60","QX50","QX55","QX60","QX80"],"Jeep":["Cherokee","Compass","Gladiator","Grand Cherokee","Grand Cherokee L","Grand Wagoneer","Renegade","Wagoneer","Wrangler"],
  "Kia":["Carnival","EV6","EV9","Forte","K5","Niro","Rio","Seltos","Sorento","Soul","Sportage","Stinger","Telluride"],
  "Land Rover":["Defender","Discovery","Discovery Sport","Range Rover","Range Rover Evoque","Range Rover Sport","Range Rover Velar"],
  "Lexus":["ES","GX","IS","LC","LS","LX","NX","RC","RX","RZ","TX","UX"],
  "Lincoln":["Aviator","Corsair","Nautilus","Navigator"],
  "Mazda":["CX-30","CX-5","CX-50","CX-70","CX-90","Mazda3","MX-30","MX-5 Miata"],
  "Mercedes-Benz":["A-Class","AMG GT","C-Class","CLA","CLE","E-Class","EQB","EQE","EQS","G-Class","GLA","GLB","GLC","GLE","GLS","S-Class","SL"],
  "Mini":["Clubman","Convertible","Countryman","Hardtop"],"Mitsubishi":["Eclipse Cross","Mirage","Outlander","Outlander Sport"],
  "Nissan":["Altima","Armada","Frontier","KICKS","Leaf","Maxima","Murano","Pathfinder","Rogue","Sentra","Titan","Versa","Z"],
  "Porsche":["718 Boxster","718 Cayman","911","Cayenne","Macan","Panamera","Taycan"],
  "Ram":["1500","2500","3500","ProMaster"],"Rivian":["R1S","R1T"],
  "Subaru":["Ascent","BRZ","Crosstrek","Forester","Impreza","Legacy","Outback","Solterra","WRX"],
  "Tesla":["Model 3","Model S","Model X","Model Y","Cybertruck"],
  "Toyota":["4Runner","bZ4X","Camry","Corolla","Corolla Cross","Crown","GR86","GR Supra","Grand Highlander","Highlander","Land Cruiser","Prius","RAV4","Sequoia","Sienna","Tacoma","Tundra","Venza"],
  "Volkswagen":["Atlas","Atlas Cross Sport","Golf GTI","Golf R","ID.4","Jetta","Taos","Tiguan"],
  "Volvo":["C40 Recharge","S60","S90","V60","V90","XC40","XC60","XC90"],
};
export const VEHICLE_MAKES = Object.keys(VEHICLE_DATA).sort();

export const VIN_WMI_MAKES = { "1G1":"Chevrolet","1GC":"Chevrolet","1GT":"GMC","1G6":"Cadillac","1FA":"Ford","1FB":"Ford","1FC":"Ford","1FD":"Ford","1FM":"Ford","1FT":"Ford","1GK":"GMC","1HG":"Honda","1C3":"Chrysler","1C4":"Chrysler","1C6":"Ram","1D3":"Dodge","1D4":"Dodge","1D7":"Dodge","1J4":"Jeep","1J8":"Jeep","1LN":"Lincoln","1N4":"Nissan","1N6":"Nissan","1VW":"Volkswagen","1YV":"Mazda","2HG":"Honda","2HK":"Honda","2T1":"Toyota","2T2":"Lexus","3VW":"Volkswagen","4S3":"Subaru","4S4":"Subaru","4T1":"Toyota","4T3":"Toyota","4T4":"Toyota","5FN":"Honda","5J6":"Honda","5N1":"Nissan","5NP":"Hyundai","5NM":"Hyundai","5TD":"Toyota","5TF":"Toyota","5YJ":"Tesla","JA3":"Mitsubishi","JA4":"Mitsubishi","JF1":"Subaru","JF2":"Subaru","JH4":"Acura","JHM":"Honda","JM1":"Mazda","JM3":"Mazda","JN1":"Nissan","JN8":"Nissan","JT2":"Toyota","JT3":"Toyota","JTD":"Toyota","JTE":"Toyota","JTH":"Lexus","JTK":"Toyota","JTM":"Toyota","KM8":"Hyundai","KMH":"Hyundai","KNA":"Kia","KND":"Kia","WAU":"Audi","WA1":"Audi","WBA":"BMW","WBS":"BMW","WDB":"Mercedes-Benz","WDC":"Mercedes-Benz","WDD":"Mercedes-Benz","WMW":"Mini","WP0":"Porsche","WP1":"Porsche","WVW":"Volkswagen","YV1":"Volvo","YV4":"Volvo","ZAM":"Maserati","ZAR":"Alfa Romeo","19U":"Acura","19X":"Honda" };
export const VIN_YEAR_CODES = { "A":"2010","B":"2011","C":"2012","D":"2013","E":"2014","F":"2015","G":"2016","H":"2017","J":"2018","K":"2019","L":"2020","M":"2021","N":"2022","P":"2023","R":"2024","S":"2025","T":"2026" };


let stubMatrix;
function zeroedMatrix() {
  if (stubMatrix) return stubMatrix;
  const out = {};
  for (const [panel, rows] of Object.entries(PRICING_MATRIX)) {
    out[panel] = rows.map((row) => ({ ...row, DIME: 0, NICKEL: 0, QUARTER: 0, HALF: 0 }));
  }
  stubMatrix = out;
  return out;
}

export function carrierHasMatrix(carrierId) {
  if (carrierId === "state_farm") return true;
  return CARRIER_MATRICES[carrierId] != null;
}

export function getMatrix(carrierId) {
  if (!carrierId || carrierId === "state_farm") return PRICING_MATRIX;
  const custom = CARRIER_MATRICES[carrierId];
  if (custom) return custom;
  return zeroedMatrix();
}

export function lookupPrice(panel, count, size, carrierId = "state_farm") {
  if (!count || count <= 0) return 0;
  const rows = getMatrix(carrierId)[panel];
  if (!rows) return 0;
  for (const row of rows) {
    if (count >= row.min && count <= row.max) return row[size] || 0;
  }
  return 0;
}

export function getMaxCount(panel, carrierId = "state_farm") {
  const rows = getMatrix(carrierId)[panel];
  if (!rows || rows.length === 0) return 0;
  return rows[rows.length - 1].max;
}

export function roundMoney(n) {
  return Math.round(Number(n) * 100) / 100;
}

export function normalizeSizeCounts(value) {
  const counts = { DIME: 0, NICKEL: 0, QUARTER: 0, HALF: 0 };
  const source = value && typeof value === "object" ? value : {};
  for (const size of DENT_SIZES) {
    const n = Math.round(Number(source[size]) || 0);
    counts[size] = Math.max(0, Math.min(999, Number.isFinite(n) ? n : 0));
  }
  return counts;
}

export function totalSizeCount(counts) {
  return DENT_SIZES.reduce((sum, size) => sum + (Number(counts?.[size]) || 0), 0);
}

export function largestPricedSize(counts) {
  for (const size of ["HALF", "QUARTER", "NICKEL", "DIME"]) {
    if ((Number(counts?.[size]) || 0) > 0) return size;
  }
  return null;
}

export function hasExactCounts(data) {
  if (!data) return false;
  if (data.sizeCounts && DENT_SIZES.some((size) => Number(data.sizeCounts[size]) > 0)) return true;
  return Number(data.osDentCount) > 0 || Number(data.doubleOsCount) > 0;
}

export function formatSizeList(counts, os = 0, doubleOs = 0) {
  const parts = [];
  let total = 0;
  for (const size of DENT_SIZES) {
    const n = Math.max(0, Math.round(Number(counts?.[size]) || 0));
    if (n > 0) {
      parts.push(`${n} ${DENT_SIZE_LABELS[size]}`);
      total += n;
    }
  }
  const over = Math.max(0, Math.round(Number(os) || 0));
  const dbl = Math.max(0, Math.round(Number(doubleOs) || 0));
  if (over > 0) {
    parts.push(`${over} Oversize`);
    total += over;
  }
  if (dbl > 0) {
    parts.push(`${dbl} Double OS`);
    total += dbl;
  }
  return {
    parts,
    total,
    text: parts.length ? `${parts.join(", ")} — ${total} total` : "",
  };
}

export function formatPanelDamage(data) {
  const list = formatSizeList(data?.sizeCounts, data?.osDentCount, data?.doubleOsCount);
  if (list.text) {
    if (data?.rrEnabled) return `R&R — ${list.text}`;
    if (data?.convEnabled) return `Conventional — ${list.text}`;
    return list.text;
  }
  if (data?.rrEnabled) return "R&R";
  if (data?.convEnabled) return "Conventional";
  const size = (DENT_SIZE_LABELS[data?.size] || "").toLowerCase();
  return `${data?.selectedRange || data?.count || 0} ${size} dents`.trim();
}

export function formatPanelLine(key, data) {
  const name = PANEL_LABELS[key] || key;
  const price = `$${Number(data?.totalPrice || 0).toLocaleString("en-US")}`;
  if (!hasExactCounts(data)) {
    const how = data?.rrEnabled
      ? "R&R"
      : data?.convEnabled
        ? "Conventional"
        : `${data?.selectedRange || data?.count || 0} ${(DENT_SIZE_LABELS[data?.size] || "").toLowerCase()} dents`;
    return `${name}: ${how} — ${price}`;
  }
  return `${name}: ${formatPanelDamage(data)} — ${price}`;
}

export function vehicleSizeTotals(panelData) {
  const counts = { DIME: 0, NICKEL: 0, QUARTER: 0, HALF: 0 };
  let os = 0;
  let doubleOs = 0;
  let any = false;
  for (const data of Object.values(panelData || {})) {
    if (!data || typeof data !== "object" || !data.sizeCounts) continue;
    any = true;
    for (const size of DENT_SIZES) counts[size] += Number(data.sizeCounts[size]) || 0;
    os += Number(data.osDentCount) || 0;
    doubleOs += Number(data.doubleOsCount) || 0;
  }
  const list = formatSizeList(counts, os, doubleOs);
  return {
    counts,
    os,
    doubleOs,
    any,
    text: any && list.text ? `Vehicle dent totals: ${list.text}` : "",
  };
}

export function panelDentTotal(data) {
  if (!data) return 0;
  if (data.sizeCounts && typeof data.sizeCounts === "object") return totalSizeCount(data.sizeCounts);
  return Number(data.count) || 0;
}

export function quotePanel(input) {
  const panel = input.panel;
  const carrierId = input.carrierId || "state_farm";
  const rows = getMatrix(carrierId)[panel] || [];
  const sizeCounts = input.sizeCounts ? normalizeSizeCounts(input.sizeCounts) : null;
  const usingCounts = !!(sizeCounts && totalSizeCount(sizeCounts) > 0);
  let size;
  let selectedRow;
  let count;
  let selectedRange;
  if (usingCounts) {
    count = totalSizeCount(sizeCounts);
    size = largestPricedSize(sizeCounts) || "DIME";
    selectedRow = rows.find((row) => count >= row.min && count <= row.max) || null;
    selectedRange = selectedRow ? selectedRow.range : null;
  } else {
    selectedRow = input.selectedRange ? rows.find((row) => row.range === input.selectedRange) : null;
    size = input.size || "DIME";
    count = selectedRow ? selectedRow.max : 0;
    selectedRange = input.selectedRange || null;
  }
  const basePrice = selectedRow ? (selectedRow[size] || 0) : 0;
  const addons = input.addons || [];
  const osDentCount = input.osDentCount || 0;
  const doubleOsCount = input.doubleOsCount || 0;
  const addonBreakdown = addons.map((name) => {
    const addon = ADDONS.find((item) => item.name === name);
    if (!addon) return { name, amount: 0 };
    if (addon.type === "dollar") {
      if (name === "Oversized Dent") return { name, amount: addon.value * osDentCount };
      if (name === "Double OS Dents") return { name, amount: addon.value * doubleOsCount };
      return { name, amount: addon.value };
    }
    return { name, amount: Math.round(basePrice * addon.value) };
  });
  const addonTotal = addonBreakdown.reduce((sum, item) => sum + item.amount, 0);
  const nonPdr = !!(input.rrEnabled || input.convEnabled);
  const laborRate = Number(input.laborRate ?? DEFAULT_LABOR_RATE);
  const rrHours = Number(input.rrHours || 0);
  const convHours = Number(input.convHours || 0);
  const rrCost = input.rrEnabled ? roundMoney(rrHours * laborRate) : 0;
  const convCost = input.convEnabled ? roundMoney(convHours * laborRate) : 0;
  const ops = RI_OPERATIONS[panel] || [];
  const riTimes = input.riTimes || {};
  const riIncluded = input.riIncluded || {};
  const riTotalHours = input.riEnabled
    ? ops.reduce((sum, op) => sum + (riIncluded[op.id] ? (riTimes[op.id] ?? op.time ?? 0) : 0), 0)
    : 0;
  const riTotalCost = roundMoney(riTotalHours * laborRate);
  const pdrTotal = nonPdr ? 0 : basePrice + addonTotal;
  const totalPrice = roundMoney(pdrTotal + rrCost + convCost + riTotalCost);
  return {
    rows, selectedRow, basePrice, count, addonBreakdown, addonTotal, nonPdr,
    rrCost, convCost, riTotalHours, riTotalCost, pdrTotal, totalPrice, laborRate,
    size, selectedRange, sizeCounts: sizeCounts || normalizeSizeCounts(null),
  };
}

export function activePanels(panelData) {
  return Object.entries(panelData || {}).filter(([, data]) => data && (
    panelDentTotal(data) > 0
    || data.rrEnabled
    || data.convEnabled
    || Number(data.osDentCount) > 0
    || Number(data.doubleOsCount) > 0
  ));
}

export function grandTotalOf(panelData) {
  return activePanels(panelData).reduce((sum, [, data]) => sum + (Number(data.totalPrice) || 0), 0);
}

export function maxDentCount(panelData) {
  return activePanels(panelData).reduce((sum, [, data]) => sum + panelDentTotal(data), 0);
}

export function vehicleLine(vehicleInfo) {
  return [vehicleInfo?.year, vehicleInfo?.make, vehicleInfo?.model].filter(Boolean).join(" ");
}

export const DRAFT_STORAGE_KEY = "hailspec.draft.v1";
export const SAVED_STORAGE_KEY = "hailspec.saved.v1";
export const SAVED_ESTIMATE_LIMIT = 100;
export const MAX_PHOTOS = 80;

export function blankVehicle() {
  return { owner: "", year: "", make: "", model: "", vin: "", claim: "" };
}

export function estimateHasWork(estimate) {
  const vehicle = estimate?.vehicleInfo || {};
  const named = ["owner", "vin", "make", "year", "model", "claim"].some((key) => String(vehicle[key] || "").trim());
  const photos = Array.isArray(estimate?.photos) && estimate.photos.length > 0;
  return named || activePanels(estimate?.panelData).length > 0 || photos;
}

export function createEstimateId() {
  return `est_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function normalizeVehicle(value) {
  const blank = blankVehicle();
  const source = value && typeof value === "object" ? value : {};
  const next = { ...blank };
  for (const key of Object.keys(blank)) next[key] = String(source[key] ?? "");
  return next;
}

function normalizeLead(lead) {
  if (!lead || typeof lead !== "object") return null;
  return {
    name: String(lead.name || "").slice(0, 120),
    phone: String(lead.phone || "").slice(0, 40),
    email: String(lead.email || "").slice(0, 120),
    notes: String(lead.notes || "").slice(0, 1000),
  };
}

function normalizePhoto(photo, index) {
  if (!photo || typeof photo !== "object") return null;
  const url = typeof photo.url === "string" && (photo.url.startsWith("data:image/") || photo.url.startsWith("data:video/")) ? photo.url : "";
  const thumb = typeof photo.thumb === "string" && photo.thumb.startsWith("data:image/") ? photo.thumb : "";
  const hasBlob = typeof Blob !== "undefined" && photo.blob instanceof Blob;
  if (!url && !thumb && !hasBlob) return null;
  const tabs = ["panels", "vehicle", "interior", "wheel", "misc"];
  return {
    id: String(photo.id || `photo_${index}`),
    tab: tabs.includes(photo.tab) ? photo.tab : "misc",
    tileId: String(photo.tileId || "untagged").slice(0, 40),
    tileLabel: String(photo.tileLabel || "Photo").slice(0, 80),
    tabLabel: String(photo.tabLabel || "Misc").slice(0, 40),
    note: String(photo.note || "").slice(0, 500),
    kind: photo.kind === "video" ? "video" : "image",
    name: String(photo.name || "").slice(0, 120),
    createdAt: String(photo.createdAt || photo.date || ""),
    url,
    thumb,
    ...(hasBlob ? { blob: photo.blob } : {}),
  };
}

function normalizePanelData(panelData) {
  const out = {};
  if (!panelData || typeof panelData !== "object" || Array.isArray(panelData)) return out;
  for (const [key, data] of Object.entries(panelData)) {
    if (!data || typeof data !== "object" || Array.isArray(data)) continue;
    const next = { ...data };
    if (data.sizeCounts && typeof data.sizeCounts === "object") next.sizeCounts = normalizeSizeCounts(data.sizeCounts);
    out[key] = next;
  }
  return out;
}

export function normalizeEstimate(value) {
  const source = value && typeof value === "object" ? value : {};
  const photos = Array.isArray(source.photos)
    ? source.photos.map((photo, index) => normalizePhoto(photo, index)).filter(Boolean).slice(0, MAX_PHOTOS)
    : [];
  const syncStatus = ["local", "queued", "sent"].includes(source.syncStatus) ? source.syncStatus : "local";
  return {
    id: String(source.id || "") || createEstimateId(),
    updatedAt: String(source.updatedAt || "") || new Date().toISOString(),
    createdAt: String(source.createdAt || source.updatedAt || "") || new Date().toISOString(),
    vehicleInfo: normalizeVehicle(source.vehicleInfo),
    panelData: normalizePanelData(source.panelData),
    carrierId: CARRIERS.some((carrier) => carrier.id === source.carrierId) ? source.carrierId : "state_farm",
    photos,
    syncStatus,
    lead: normalizeLead(source.lead),
    queuedAt: String(source.queuedAt || ""),
    sentAt: String(source.sentAt || ""),
  };
}

export function parseDraft(raw) {
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    return normalizeEstimate(parsed);
  } catch (err) {
    return null;
  }
}

export function parseSavedEstimates(raw) {
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => normalizeEstimate(item)).filter(estimateHasWork).slice(0, SAVED_ESTIMATE_LIMIT);
  } catch (err) {
    return [];
  }
}

export function archiveEstimate(saved, current) {
  const list = Array.isArray(saved) ? saved.map((item) => normalizeEstimate(item)).filter(estimateHasWork) : [];
  if (!estimateHasWork(current)) return list.slice(0, SAVED_ESTIMATE_LIMIT);
  const snap = normalizeEstimate({ ...current, updatedAt: new Date().toISOString() });
  const slim = JSON.stringify(snap).length < 1500000 ? snap : { ...snap, photos: [] };
  return [slim, ...list.filter((item) => item.id !== slim.id)].slice(0, SAVED_ESTIMATE_LIMIT);
}

export function openSavedEstimate(saved, current, id) {
  const list = Array.isArray(saved) ? saved : [];
  const item = list.find((entry) => entry.id === id) || null;
  if (!item) return { saved: list, estimate: null };
  const archived = current && current.id !== id ? archiveEstimate(list, current) : list;
  return {
    saved: archived.filter((entry) => entry.id !== id).slice(0, SAVED_ESTIMATE_LIMIT),
    estimate: normalizeEstimate(item),
  };
}

export function estimateTitle(estimate) {
  return vehicleLine(estimate?.vehicleInfo) || String(estimate?.vehicleInfo?.owner || "").trim() || "Untitled estimate";
}

export function estimatePdfName(vehicleInfo) {
  const vehicle = [vehicleInfo?.year, vehicleInfo?.make, vehicleInfo?.model]
    .filter(Boolean)
    .join("_")
    .replace(/[^A-Za-z0-9._-]/g, "") || "Estimate";
  return `NTXHail_Estimate_${vehicle}.pdf`;
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildEstimateSummary({ vehicleInfo = {}, panelData = {}, carrierLabel = "State Farm", grandTotal = 0, photos = [] } = {}) {
  const lines = activePanels(panelData).map(([key, data]) => formatPanelLine(key, data));
  const vehicle = vehicleLine(vehicleInfo) || "Vehicle not set";
  const parts = [
    "HailSpec web estimate",
    `Carrier: ${carrierLabel}`,
    `Vehicle: ${vehicle}`,
  ];
  if (vehicleInfo.vin) parts.push(`VIN: ${vehicleInfo.vin}`);
  if (vehicleInfo.claim) parts.push(`Claim #: ${vehicleInfo.claim}`);
  if (vehicleInfo.owner) parts.push(`Owner on estimate: ${vehicleInfo.owner}`);
  const totals = vehicleSizeTotals(panelData);
  if (totals.text) parts.push(totals.text);
  const photoCount = Array.isArray(photos) ? photos.length : 0;
  if (photoCount > 0) parts.push(`Photos on phone: ${photoCount}. Share/Export sends the pictures. This form cannot attach them.`);
  parts.push("");
  parts.push(...(lines.length ? lines : ["No panels estimated."]));
  parts.push("");
  parts.push(`Grand total: $${Number(grandTotal || 0).toLocaleString("en-US")}`);
  parts.push(ESTIMATE_DISCLAIMER);
  return parts.join("\n");
}

export function decodeVIN(vin) {
  if (!vin || vin.length !== 17) return null;
  const v = vin.toUpperCase();
  const year = VIN_YEAR_CODES[v[9]] || null;
  const wmi3 = v.substring(0, 3);
  let make = VIN_WMI_MAKES[wmi3] || null;
  if (!make) {
    for (const [prefix, mapped] of Object.entries(VIN_WMI_MAKES)) {
      if (wmi3.startsWith(prefix)) { make = mapped; break; }
    }
  }
  return { year, make };
}

function panelRowsHtml(panelData) {
  let lineNum = 0;
  let totalPrice = 0;
  let totalLabor = 0;
  const rows = activePanels(panelData).map(([key, data]) => {
    const nonPdr = data.rrEnabled || data.convEnabled;
    const rate = data.laborRate || DEFAULT_LABOR_RATE;
    let html = `<tr class="${nonPdr && data.rrEnabled ? "section-row-rr" : "section-row"}"><td colspan="5">${escapeHtml(PANEL_LABELS[key])}${data.rrEnabled ? " — R&R" : data.convEnabled ? " — Conv." : ""}</td></tr>`;
    if (nonPdr) {
      const hours = data.rrEnabled ? (data.rrHours || 0) : (data.convHours || 0);
      const cost = data.rrEnabled ? (data.rrCost || 0) : (data.convCost || 0);
      lineNum += 1;
      totalLabor += cost;
      html += `<tr><td class="ln">${lineNum}</td><td>${data.rrEnabled ? "R&R — Remove & Replace" : "Conventional Repair"}</td><td>${Number(hours).toFixed(1)} hrs</td><td></td><td class="amt">$${Number(cost).toFixed(2)}</td></tr>`;
    } else {
      lineNum += 1;
      totalPrice += (data.basePrice || 0);
      const damage = hasExactCounts(data)
        ? formatPanelDamage(data)
        : `${data.selectedRange || data.count} ${(DENT_SIZE_LABELS[data.size] || "").toLowerCase()} dents`.trim();
      html += `<tr><td class="ln">${lineNum}</td><td>PDR — ${escapeHtml(damage)}</td><td>1</td><td class="amt">$${Number(data.basePrice || 0).toLocaleString("en-US")}</td><td></td></tr>`;
      (data.addons || []).forEach((name) => {
        const addon = ADDONS.find((item) => item.name === name);
        if (!addon) return;
        let addonAmt = 0;
        let qty = "";
        if (addon.type === "dollar") {
          if (name === "Oversized Dent") { qty = `${data.osDentCount || 0} × $${addon.value}`; addonAmt = addon.value * (data.osDentCount || 0); }
          else if (name === "Double OS Dents") { qty = `${data.doubleOsCount || 0} × $${addon.value}`; addonAmt = addon.value * (data.doubleOsCount || 0); }
          else { qty = "1"; addonAmt = addon.value; }
        } else {
          qty = `${addon.value * 100}% of $${Number(data.basePrice || 0).toLocaleString("en-US")}`;
          addonAmt = Math.round((data.basePrice || 0) * addon.value);
        }
        if (addonAmt > 0) {
          lineNum += 1;
          totalPrice += addonAmt;
          html += `<tr class="addon-row"><td class="ln">${lineNum}</td><td>Add-on: ${escapeHtml(name)}</td><td>${escapeHtml(qty)}</td><td class="amt">$${addonAmt.toLocaleString("en-US")}</td><td></td></tr>`;
        }
      });
    }
    if (data.riEnabled) {
      (RI_OPERATIONS[key] || []).filter((op) => data.riIncluded && data.riIncluded[op.id]).forEach((op) => {
        const time = (data.riTimes && data.riTimes[op.id] != null) ? data.riTimes[op.id] : op.time;
        const cost = roundMoney(time * rate);
        const isOpRr = data.riRr && data.riRr[op.id];
        lineNum += 1;
        totalLabor += cost;
        html += `<tr class="${isOpRr ? "rr-labor-row" : "labor-row"}"><td class="ln">${lineNum}</td><td>${isOpRr ? "R&R" : "R&I"}: ${escapeHtml(op.name)}</td><td>${Number(time).toFixed(1)} hrs @ $${Number(rate).toFixed(2)}</td><td></td><td class="amt">$${cost.toFixed(2)}</td></tr>`;
      });
    }
    return html;
  }).join("");
  return { rows, totalPrice, totalLabor };
}

function photoImageSrc(photo) {
  if (typeof photo?.url === "string" && photo.url.startsWith("data:image/")) return photo.url;
  if (typeof photo?.thumb === "string" && photo.thumb.startsWith("data:image/")) return photo.thumb;
  return "";
}

export function groupPhotosForReport(photos) {
  const groups = [];
  const index = new Map();
  for (const photo of photos || []) {
    if (!photo || typeof photo !== "object") continue;
    const src = photoImageSrc(photo);
    const video = photo.kind === "video";
    const hasBlob = typeof Blob !== "undefined" && photo.blob instanceof Blob;
    if (!src && !video && !hasBlob) continue;
    const tab = String(photo.tabLabel || "Photos");
    const tile = String(photo.tileLabel || "Photo");
    const key = `${tab}\n${tile}`;
    if (!index.has(key)) {
      const group = { tab, tile, photos: [] };
      index.set(key, group);
      groups.push(group);
    }
    index.get(key).photos.push(photo);
  }
  return groups;
}

function renderPhotoHtml(photos) {
  const groups = groupPhotosForReport(photos);
  if (!groups.length) return "";
  let html = `<h3 style="margin:16px 0 8px;font-size:14px">Photos</h3>`;
  let lastTab = "";
  for (const group of groups) {
    if (group.tab !== lastTab) {
      html += `<h4 style="margin:12px 0 6px;font-size:13px">${escapeHtml(group.tab)}</h4>`;
      lastTab = group.tab;
    }
    html += `<div style="font-weight:700;margin:6px 0">${escapeHtml(group.tile)} (${group.photos.length})</div><div class="photos">`;
    for (const photo of group.photos) {
      const src = photoImageSrc(photo);
      if (photo.kind === "video" || !src) html += `<p>Video: ${escapeHtml(photo.name || photo.tileLabel || "Video")}</p>`;
      else html += `<figure style="margin:0"><img src="${escapeHtml(src)}" alt=""/>${photo.note ? `<figcaption>${escapeHtml(photo.note)}</figcaption>` : ""}</figure>`;
    }
    html += `</div>`;
  }
  return html;
}

export function generateReportHTML(vehicleInfo, panelData, photos, grandTotal, carrierLabel) {
  const label = carrierLabel || "State Farm";
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const { rows, totalPrice, totalLabor } = panelRowsHtml(panelData);
  const info = vehicleInfo || {};
  const photoHtml = renderPhotoHtml(photos);
  const sizeTotals = vehicleSizeTotals(panelData).text;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>NTX Hail — Estimate</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',system-ui,sans-serif;color:#1e293b;padding:24px;max-width:800px;margin:0 auto;font-size:13px}.header{border-bottom:3px solid #0a1628;padding-bottom:20px;margin-bottom:24px}.brand-name{font-size:18px;font-weight:900;letter-spacing:1px;color:#0a1628}.brand-tag{font-size:11px;color:#2563eb;font-weight:700;letter-spacing:2px;text-transform:uppercase}.header p{color:#64748b;margin-top:4px;font-size:13px}.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px 24px;margin-bottom:24px;font-size:13px}.info-grid dt{color:#64748b;font-weight:500}.info-grid dd{font-weight:600;overflow-wrap:anywhere}table{width:100%;border-collapse:collapse;margin-bottom:20px}th{background:#0a1628;color:#f8fafc;padding:8px 10px;text-align:left;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:0.5px}td{padding:7px 10px;border-bottom:1px solid #e2e8f0;font-size:13px}.ln{width:36px;color:#94a3b8;font-weight:600;text-align:center;font-size:12px}.amt{text-align:right;font-weight:600;white-space:nowrap}.section-row td{background:#eff6ff;font-weight:800;font-size:13px;color:#1e3a5f;padding:8px 10px;border-bottom:2px solid #bfdbfe}.section-row-rr td{background:#fef2f2;font-weight:800;font-size:13px;color:#7f1d1d;padding:8px 10px;border-bottom:2px solid #fecaca}.addon-row td{color:#475569}.labor-row td{color:#1e293b}.rr-labor-row td{color:#dc2626}.subtotal-row td{border-top:2px solid #cbd5e1;font-weight:700;font-size:13px;padding:8px 10px}.total-row td{border-top:3px solid #0a1628;font-weight:800;font-size:15px;padding:10px}.total-row .amt{font-size:16px;color:#2563eb}.photos{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}.photos img{width:150px;max-width:100%;height:110px;object-fit:cover;border-radius:6px;border:1px solid #e2e8f0}.disclaimer{margin-top:16px;font-size:12px;color:#334155;line-height:1.5}.footer{margin-top:24px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8;text-align:center}@media print{body{padding:16px}}</style>
</head><body>
<div class="header"><div class="brand-name">NTX HAIL</div><div class="brand-tag">HailSpec Estimator</div><p>${escapeHtml(label)} Matrix Pricing — ${escapeHtml(date)}</p></div>
<dl class="info-grid"><dt>Owner</dt><dd>${escapeHtml(info.owner || "—")}</dd><dt>Vehicle</dt><dd>${escapeHtml(vehicleLine(info) || "—")}</dd><dt>VIN</dt><dd>${escapeHtml(info.vin || "—")}</dd><dt>Claim #</dt><dd>${escapeHtml(info.claim || "—")}</dd></dl>
<table><thead><tr><th style="width:36px">Line</th><th>Operation</th><th>Qty</th><th style="text-align:right">Price $</th><th style="text-align:right">Labor $</th></tr></thead>
<tbody>${rows}<tr class="subtotal-row"><td></td><td colspan="2">Subtotals</td><td class="amt">$${totalPrice.toLocaleString("en-US")}</td><td class="amt">$${totalLabor.toFixed(2)}</td></tr>
<tr class="total-row"><td></td><td colspan="2">GRAND TOTAL</td><td colspan="2" class="amt">$${Number(grandTotal || 0).toLocaleString("en-US")}</td></tr></tbody></table>
<p class="disclaimer">${escapeHtml(ESTIMATE_DISCLAIMER)}</p>
${sizeTotals ? `<p class="disclaimer">${escapeHtml(sizeTotals)}</p>` : ""}
${photoHtml}
<div class="footer">Generated by HailSpec — NTX Hail — ${escapeHtml(date)}</div>
</body></html>`;
}

export function reportDocument({ vehicleInfo = {}, panelData = {}, carrierLabel = "State Farm", grandTotal = 0 } = {}, now = new Date()) {
  const info = vehicleInfo || {};
  const panels = activePanels(panelData).map(([key, data]) => ({
    name: PANEL_LABELS[key] || key,
    detail: hasExactCounts(data)
      ? formatPanelDamage(data)
      : (data.rrEnabled
        ? "R&R"
        : data.convEnabled
          ? "Conventional"
          : `${data.selectedRange || data.count} ${(DENT_SIZE_LABELS[data.size] || "").toLowerCase()} dents`.trim()),
    amount: Number(data.totalPrice) || 0,
  }));
  return {
    date: now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    carrier: carrierLabel || "State Farm",
    owner: info.owner || "—",
    vehicle: vehicleLine(info) || "—",
    vin: info.vin || "—",
    claim: info.claim || "—",
    panels,
    sizeTotals: vehicleSizeTotals(panelData).text,
    grandTotal: Number(grandTotal) || 0,
    disclaimer: ESTIMATE_DISCLAIMER,
  };
}

function byteLength(text) {
  return new TextEncoder().encode(text).length;
}

function asciiPdf(value) {
  return String(value ?? "")
    .replace(/[—–]/g, "-")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/…/g, "...")
    .replace(/[^\x20-\x7E]/g, "");
}

function pdfEscape(value) {
  return asciiPdf(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrapPdfLines(text, width) {
  const clean = asciiPdf(text);
  if (!clean) return [""];
  const lines = [];
  let line = "";
  for (const word of clean.split(/\s+/)) {
    if (!word) continue;
    if (word.length > width) {
      if (line) lines.push(line);
      for (let index = 0; index < word.length; index += width) lines.push(word.slice(index, index + width));
      line = "";
      continue;
    }
    const next = line ? `${line} ${word}` : word;
    if (next.length > width) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

function assemblePdf(pageStreams) {
  const objects = new Map();
  objects.set(1, "<< /Type /Catalog /Pages 2 0 R >>");
  objects.set(3, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  objects.set(4, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  const kids = [];
  let nextId = 5;
  for (const stream of pageStreams) {
    const contentId = nextId;
    nextId += 1;
    const pageId = nextId;
    nextId += 1;
    kids.push(`${pageId} 0 R`);
    objects.set(contentId, { stream });
    objects.set(pageId, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents ${contentId} 0 R /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> >>`);
  }
  objects.set(2, `<< /Type /Pages /Kids [${kids.join(" ")}] /Count ${kids.length} >>`);
  const maxId = nextId - 1;
  let body = "%PDF-1.4\n";
  const offsets = [0];
  for (let id = 1; id <= maxId; id += 1) {
    offsets[id] = byteLength(body);
    const obj = objects.get(id);
    if (obj && Object.prototype.hasOwnProperty.call(obj, "stream")) {
      const stream = obj.stream.endsWith("\n") ? obj.stream : `${obj.stream}\n`;
      body += `${id} 0 obj\n<< /Length ${byteLength(stream)} >>\nstream\n${stream}endstream\nendobj\n`;
    } else {
      body += `${id} 0 obj\n${obj}\nendobj\n`;
    }
  }
  const xrefStart = byteLength(body);
  let xref = `xref\n0 ${maxId + 1}\n0000000000 65535 f \n`;
  for (let id = 1; id <= maxId; id += 1) xref += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
  body += `${xref}trailer\n<< /Size ${maxId + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
  return new TextEncoder().encode(body);
}

export function buildEstimatePdf(input, now = new Date()) {
  const doc = reportDocument(input, now);
  const blocks = [
    { font: "F2", size: 18, text: "NTX HAIL" },
    { font: "F1", size: 11, text: "HailSpec estimate" },
    { font: "F1", size: 11, text: `${doc.carrier} | ${doc.date}` },
    { font: "F1", size: 11, text: "" },
    { font: "F1", size: 11, text: `Owner: ${doc.owner}` },
    { font: "F1", size: 11, text: `Vehicle: ${doc.vehicle}` },
    { font: "F1", size: 11, text: `VIN: ${doc.vin}` },
    { font: "F1", size: 11, text: `Claim #: ${doc.claim}` },
    { font: "F1", size: 11, text: "" },
    ...(doc.sizeTotals ? [{ font: "F1", size: 11, text: doc.sizeTotals }, { font: "F1", size: 11, text: "" }] : []),
    { font: "F2", size: 12, text: "Panels" },
  ];
  if (!doc.panels.length) blocks.push({ font: "F1", size: 11, text: "No panels estimated." });
  for (const panel of doc.panels) {
    blocks.push({
      font: "F1",
      size: 11,
      text: `${panel.name}: ${panel.detail} - $${panel.amount.toLocaleString("en-US")}`,
    });
  }
  blocks.push({ font: "F1", size: 11, text: "" });
  blocks.push({ font: "F2", size: 13, text: `Grand total: $${doc.grandTotal.toLocaleString("en-US")}` });
  blocks.push({ font: "F1", size: 10, text: "" });
  for (const line of wrapPdfLines(doc.disclaimer, 90)) blocks.push({ font: "F1", size: 9, text: line });
  blocks.push({ font: "F1", size: 9, text: "Generated by HailSpec for NTX Hail. ntxhail.com" });

  const pages = [];
  let commands = [];
  let y = 740;
  const finish = () => pages.push(commands.join("\n"));
  const begin = () => { commands = []; y = 740; };
  begin();
  for (const block of blocks) {
    const lead = block.size + 6;
    for (const line of wrapPdfLines(block.text, block.size >= 16 ? 42 : 90)) {
      if (y < 64) {
        finish();
        begin();
        commands.push("BT /F1 9 Tf 54 750 Td (NTX HAIL estimate, continued) Tj ET");
        y = 728;
      }
      commands.push(`BT /${block.font} ${block.size} Tf 54 ${y} Td (${pdfEscape(line)}) Tj ET`);
      y -= lead;
    }
  }
  finish();
  return assemblePdf(pages.length ? pages : ["BT /F1 12 Tf 54 740 Td (NTX HAIL) Tj ET"]);
}

export function parseGhlForm(value) {
  const raw = String(value || "").trim();
  if (!raw) return { formId: "", embedUrl: "" };
  if (/^https?:\/\//i.test(raw)) {
    const match = raw.match(/\/form\/([A-Za-z0-9]+)/) || raw.match(/[?&](?:formId|id)=([A-Za-z0-9]+)/);
    const formId = match ? match[1] : "";
    const embedUrl = raw.split("?")[0];
    return { formId, embedUrl };
  }
  return {
    formId: raw,
    embedUrl: `https://api.leadconnectorhq.com/widget/form/${raw}`,
  };
}

export function fitSummaryForUrl(summary, limit = GHL_SUMMARY_LIMIT) {
  const text = String(summary || "").replace(/\r\n/g, "\n").trim();
  if (text.length <= limit) return text;
  const lines = text.split("\n");
  const isPanel = (line) => / — \$/.test(line);
  const header = [];
  const panels = [];
  const footer = [];
  let seenPanel = false;
  for (const line of lines) {
    if (isPanel(line)) {
      seenPanel = true;
      panels.push(line);
      continue;
    }
    if (!seenPanel) header.push(line);
    else if (line.startsWith("Grand total:") || line === ESTIMATE_DISCLAIMER) footer.push(line);
  }
  const assemble = (keptCount) => {
    const omitted = panels.length - keptCount;
    const body = [...header, ...panels.slice(0, keptCount)];
    if (omitted > 0) body.push(`… and ${omitted} more panel${omitted === 1 ? "" : "s"}`);
    if (footer.length) body.push("", ...footer);
    return body.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  };
  for (let count = panels.length; count >= 0; count -= 1) {
    const candidate = assemble(count);
    if (candidate.length <= limit) return candidate;
  }
  const hard = assemble(0);
  if (hard.length <= limit) return hard;
  return `${hard.slice(0, Math.max(0, limit - 1)).trimEnd()}…`;
}

export function buildGhlEmbedUrl({ formValue, lead = {}, summary = "", summaryFieldId = "" }) {
  const parsed = parseGhlForm(formValue);
  if (!parsed.embedUrl) return "";
  const url = new URL(parsed.embedUrl);
  const notes = String(lead.notes || "").trim();
  let text = String(summary || "").trim();
  if (notes) text = `Notes: ${notes}\n\n${text}`.trim();
  text = fitSummaryForUrl(text);
  const params = new URLSearchParams();
  const name = String(lead.name || "").trim();
  const phone = String(lead.phone || "").trim();
  const email = String(lead.email || "").trim();
  if (name) params.set("full_name", name);
  if (phone) params.set("phone", phone);
  if (email) params.set("email", email);
  if (text) {
    params.set("estimate_summary", text);
    if (summaryFieldId) params.set(summaryFieldId, text);
  }
  url.search = params.toString();
  return url.toString();
}

export function validateLead(lead) {
  const errors = {};
  if (!String(lead?.name || "").trim()) errors.name = "Enter your name.";
  const digits = String(lead?.phone || "").replace(/\D/g, "");
  if (digits.length < 10) errors.phone = "Enter a phone number with at least 10 digits.";
  const email = String(lead?.email || "").trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter an email address.";
  return errors;
}

export function syncStatusLabel(status) {
  if (status === "sent") return "Sent";
  if (status === "queued") return "Waiting for signal";
  return "Saved on phone";
}

export function queueForSync(scope, lead, now = new Date()) {
  const normalized = normalizeLead(lead) || { name: "", phone: "", email: "", notes: "" };
  return {
    ...scope,
    syncStatus: "queued",
    lead: normalized,
    queuedAt: now.toISOString(),
    sentAt: "",
  };
}

export function confirmScopeSent(scope, { frameLoaded = false } = {}, now = new Date()) {
  if (!scope || scope.syncStatus !== "queued" || !frameLoaded) return { ok: false, scope };
  return { ok: true, scope: { ...scope, syncStatus: "sent", sentAt: now.toISOString() } };
}

export function pruneScopes(list, currentId, limit = SAVED_ESTIMATE_LIMIT) {
  const pinned = [];
  const sent = [];
  const local = [];
  for (const scope of Array.isArray(list) ? list : []) {
    if (!scope) continue;
    if (scope.id === currentId || scope.syncStatus === "queued") pinned.push(scope);
    else if (scope.syncStatus === "sent") sent.push(scope);
    else local.push(scope);
  }
  const byNewest = (a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""));
  sent.sort(byNewest);
  local.sort(byNewest);
  const must = [...pinned, ...local];
  const room = Math.max(0, limit - must.length);
  return [...must, ...sent.slice(0, room)];
}

export function mediaExportPath(photo, index) {
  const safe = (value) => String(value || "file").replace(/[^a-zA-Z0-9._-]+/g, "_").replace(/^_+|_+$/g, "") || "file";
  const ext = photo?.kind === "video" ? "mp4" : "jpg";
  return `media/${safe(photo?.tabLabel)}/${safe(photo?.tileLabel)}/${String(index + 1).padStart(2, "0")}.${ext}`;
}

export function buildPacketHtml(input = {}, paths = {}) {
  const doc = reportDocument(input);
  const groups = groupPhotosForReport(input.photos || []);
  const rows = doc.panels.map((panel) => `<tr><td>${escapeHtml(panel.name)}</td><td>${escapeHtml(panel.detail)}</td><td class="amt">$${panel.amount.toLocaleString("en-US")}</td></tr>`).join("");
  let photos = "";
  let lastTab = "";
  for (const group of groups) {
    if (group.tab !== lastTab) {
      photos += `<h2>${escapeHtml(group.tab)}</h2>`;
      lastTab = group.tab;
    }
    photos += `<h3>${escapeHtml(group.tile)} (${group.photos.length})</h3><div class="photos">`;
    group.photos.forEach((photo) => {
      const path = paths[photo.id];
      const src = photoImageSrc(photo);
      if (path && photo.kind !== "video") photos += `<figure><img src="${escapeHtml(path)}" alt=""/>${photo.note ? `<figcaption>${escapeHtml(photo.note)}</figcaption>` : ""}</figure>`;
      else if (path) photos += `<p>Video file: ${escapeHtml(path)}${photo.note ? ` — ${escapeHtml(photo.note)}` : ""}</p>`;
      else if (src) photos += `<figure><img src="${escapeHtml(src)}" alt=""/>${photo.note ? `<figcaption>${escapeHtml(photo.note)}</figcaption>` : ""}</figure>`;
      else photos += `<p>Video: ${escapeHtml(photo.name || group.tile)}</p>`;
    });
    photos += `</div>`;
  }
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>HailSpec scope</title>
<style>body{font-family:system-ui,sans-serif;color:#1e293b;padding:24px;max-width:800px;margin:0 auto}h1{font-size:22px;margin:0}h2{font-size:16px;margin:18px 0 6px}h3{font-size:14px;margin:8px 0}table{width:100%;border-collapse:collapse}td{border-bottom:1px solid #e2e8f0;padding:8px;vertical-align:top}.amt{text-align:right;font-weight:700}.photos{display:flex;flex-wrap:wrap;gap:8px}.photos img{width:160px;height:120px;object-fit:cover}figcaption{font-size:12px;max-width:160px}</style></head><body>
<h1>NTX HAIL</h1><p>HailSpec scope · ${escapeHtml(doc.carrier)} · ${escapeHtml(doc.date)}</p>
<p>Owner: ${escapeHtml(doc.owner)}<br>Vehicle: ${escapeHtml(doc.vehicle)}<br>VIN: ${escapeHtml(doc.vin)}<br>Claim #: ${escapeHtml(doc.claim)}</p>
${doc.sizeTotals ? `<p><strong>${escapeHtml(doc.sizeTotals)}</strong></p>` : ""}
<table><tbody>${rows || `<tr><td colspan="3">No panels estimated.</td></tr>`}<tr><td colspan="2"><strong>Grand total</strong></td><td class="amt">$${doc.grandTotal.toLocaleString("en-US")}</td></tr></tbody></table>
<p>${escapeHtml(doc.disclaimer)}</p>
${photos}
</body></html>`;
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes) {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i += 1) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function concatBytes(parts) {
  const size = parts.reduce((sum, part) => sum + part.length, 0);
  const out = new Uint8Array(size);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

function u16(n) {
  const bytes = new Uint8Array(2);
  new DataView(bytes.buffer).setUint16(0, n & 0xffff, true);
  return bytes;
}

function u32(n) {
  const bytes = new Uint8Array(4);
  new DataView(bytes.buffer).setUint32(0, n >>> 0, true);
  return bytes;
}

export function buildZip(files, now = new Date()) {
  const date = now instanceof Date ? now : new Date();
  const time = ((date.getHours() & 31) << 11) | ((date.getMinutes() & 63) << 5) | (Math.floor(date.getSeconds() / 2) & 31);
  const day = (((date.getFullYear() - 1980) & 127) << 9) | (((date.getMonth() + 1) & 15) << 5) | (date.getDate() & 31);
  const locals = [];
  const centrals = [];
  let offset = 0;
  const list = Array.isArray(files) ? files : [];
  for (const file of list) {
    const nameBytes = new TextEncoder().encode(String(file?.name || "file").replace(/\\/g, "/"));
    const data = file?.data instanceof Uint8Array ? file.data : new TextEncoder().encode(String(file?.data ?? ""));
    const crc = crc32(data);
    const local = concatBytes([
      u32(0x04034b50), u16(20), u16(0x0800), u16(0), u16(time), u16(day),
      u32(crc), u32(data.length), u32(data.length), u16(nameBytes.length), u16(0), nameBytes, data,
    ]);
    locals.push(local);
    centrals.push(concatBytes([
      u32(0x02014b50), u16(20), u16(20), u16(0x0800), u16(0), u16(time), u16(day),
      u32(crc), u32(data.length), u32(data.length), u16(nameBytes.length), u16(0), u16(0), u16(0), u16(0),
      u32(0), u32(offset), nameBytes,
    ]));
    offset += local.length;
  }
  const centralBytes = concatBytes(centrals);
  const eocd = concatBytes([
    u32(0x06054b50), u16(0), u16(0), u16(list.length), u16(list.length),
    u32(centralBytes.length), u32(offset), u16(0),
  ]);
  return concatBytes([...locals, centralBytes, eocd]);
}
