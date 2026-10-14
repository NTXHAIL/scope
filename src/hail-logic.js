// Pricing, estimates, and the GoHighLevel lead payload.
// No API tokens live in this file.

export const ESTIMATE_DISCLAIMER =
  "This is a repair estimate only. It is not a promise to waive a deductible, pay a rebate, or cover any part of an insurance claim.";

export const GHL_SUBMIT_URL = "https://backend.leadconnectorhq.com/forms/submit";

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

export function quotePanel(input) {
  const panel = input.panel;
  const carrierId = input.carrierId || "state_farm";
  const rows = getMatrix(carrierId)[panel] || [];
  const selectedRow = input.selectedRange ? rows.find((r) => r.range === input.selectedRange) : null;
  const size = input.size || "DIME";
  const basePrice = selectedRow ? (selectedRow[size] || 0) : 0;
  const count = selectedRow ? selectedRow.max : 0;
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
  };
}

export function activePanels(panelData) {
  return Object.entries(panelData || {}).filter(([, data]) => data && (data.count > 0 || data.rrEnabled || data.convEnabled));
}

export function grandTotalOf(panelData) {
  return activePanels(panelData).reduce((sum, [, data]) => sum + (Number(data.totalPrice) || 0), 0);
}

export function maxDentCount(panelData) {
  return activePanels(panelData).reduce((sum, [, data]) => {
    if (data.rrEnabled || data.convEnabled) return sum;
    return sum + (Number(data.count) || 0);
  }, 0);
}

export function vehicleLine(vehicleInfo) {
  return [vehicleInfo?.year, vehicleInfo?.make, vehicleInfo?.model].filter(Boolean).join(" ");
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildEstimateSummary({ vehicleInfo = {}, panelData = {}, carrierLabel = "State Farm", grandTotal = 0 }) {
  const lines = activePanels(panelData).map(([key, data]) => {
    const how = data.rrEnabled
      ? "R&R"
      : data.convEnabled
        ? "Conventional"
        : `${data.selectedRange || data.count} ${(DENT_SIZE_LABELS[data.size] || "").toLowerCase()} dents`;
    const price = Number(data.totalPrice || 0).toLocaleString("en-US");
    return `${PANEL_LABELS[key]}: ${how} — $${price}`;
  });
  const vehicle = vehicleLine(vehicleInfo) || "Vehicle not set";
  const parts = [
    "HailSpec web estimate",
    `Carrier: ${carrierLabel}`,
    `Vehicle: ${vehicle}`,
  ];
  if (vehicleInfo.vin) parts.push(`VIN: ${vehicleInfo.vin}`);
  if (vehicleInfo.claim) parts.push(`Claim #: ${vehicleInfo.claim}`);
  if (vehicleInfo.owner) parts.push(`Owner on estimate: ${vehicleInfo.owner}`);
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
      const sizeLabel = (DENT_SIZE_LABELS[data.size] || "").toLowerCase();
      html += `<tr><td class="ln">${lineNum}</td><td>PDR — ${escapeHtml(data.selectedRange || data.count)} ${escapeHtml(sizeLabel)} dents</td><td>1</td><td class="amt">$${Number(data.basePrice || 0).toLocaleString("en-US")}</td><td></td></tr>`;
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

export function generateReportHTML(vehicleInfo, panelData, photos, grandTotal, carrierLabel) {
  const label = carrierLabel || "State Farm";
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const { rows, totalPrice, totalLabor } = panelRowsHtml(panelData);
  const info = vehicleInfo || {};
  const safePhotos = (photos || []).filter((photo) => typeof photo?.url === "string" && photo.url.startsWith("data:image/"));
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>NTX Hail — Estimate</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',system-ui,sans-serif;color:#1e293b;padding:24px;max-width:800px;margin:0 auto;font-size:13px}.header{border-bottom:3px solid #0a1628;padding-bottom:20px;margin-bottom:24px}.brand-name{font-size:18px;font-weight:900;letter-spacing:1px;color:#0a1628}.brand-tag{font-size:11px;color:#2563eb;font-weight:700;letter-spacing:2px;text-transform:uppercase}.header p{color:#64748b;margin-top:4px;font-size:13px}.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px 24px;margin-bottom:24px;font-size:13px}.info-grid dt{color:#64748b;font-weight:500}.info-grid dd{font-weight:600;overflow-wrap:anywhere}table{width:100%;border-collapse:collapse;margin-bottom:20px}th{background:#0a1628;color:#f8fafc;padding:8px 10px;text-align:left;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:0.5px}td{padding:7px 10px;border-bottom:1px solid #e2e8f0;font-size:13px}.ln{width:36px;color:#94a3b8;font-weight:600;text-align:center;font-size:12px}.amt{text-align:right;font-weight:600;white-space:nowrap}.section-row td{background:#eff6ff;font-weight:800;font-size:13px;color:#1e3a5f;padding:8px 10px;border-bottom:2px solid #bfdbfe}.section-row-rr td{background:#fef2f2;font-weight:800;font-size:13px;color:#7f1d1d;padding:8px 10px;border-bottom:2px solid #fecaca}.addon-row td{color:#475569}.labor-row td{color:#1e293b}.rr-labor-row td{color:#dc2626}.subtotal-row td{border-top:2px solid #cbd5e1;font-weight:700;font-size:13px;padding:8px 10px}.total-row td{border-top:3px solid #0a1628;font-weight:800;font-size:15px;padding:10px}.total-row .amt{font-size:16px;color:#2563eb}.photos{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}.photos img{width:150px;max-width:100%;height:110px;object-fit:cover;border-radius:6px;border:1px solid #e2e8f0}.disclaimer{margin-top:16px;font-size:12px;color:#334155;line-height:1.5}.footer{margin-top:24px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8;text-align:center}@media print{body{padding:16px}}</style>
</head><body>
<div class="header"><div class="brand-name">NTX HAIL</div><div class="brand-tag">HailSpec Estimator</div><p>${escapeHtml(label)} Matrix Pricing — ${escapeHtml(date)}</p></div>
<dl class="info-grid"><dt>Owner</dt><dd>${escapeHtml(info.owner || "—")}</dd><dt>Vehicle</dt><dd>${escapeHtml(vehicleLine(info) || "—")}</dd><dt>VIN</dt><dd>${escapeHtml(info.vin || "—")}</dd><dt>Claim #</dt><dd>${escapeHtml(info.claim || "—")}</dd></dl>
<table><thead><tr><th style="width:36px">Line</th><th>Operation</th><th>Qty</th><th style="text-align:right">Price $</th><th style="text-align:right">Labor $</th></tr></thead>
<tbody>${rows}<tr class="subtotal-row"><td></td><td colspan="2">Subtotals</td><td class="amt">$${totalPrice.toLocaleString("en-US")}</td><td class="amt">$${totalLabor.toFixed(2)}</td></tr>
<tr class="total-row"><td></td><td colspan="2">GRAND TOTAL</td><td colspan="2" class="amt">$${Number(grandTotal || 0).toLocaleString("en-US")}</td></tr></tbody></table>
<p class="disclaimer">${escapeHtml(ESTIMATE_DISCLAIMER)}</p>
${safePhotos.length > 0 ? `<h3 style="margin-bottom:12px;font-size:14px">Documentation Photos</h3><div class="photos">${safePhotos.map((photo) => `<img src="${escapeHtml(photo.url)}" alt=""/>`).join("")}</div>` : ""}
<div class="footer">Generated by HailSpec — NTX Hail — ${escapeHtml(date)}</div>
</body></html>`;
}

export function parseGhlForm(value) {
  const raw = String(value || "").trim();
  if (!raw) return { formId: "", embedUrl: "", submitUrl: GHL_SUBMIT_URL };
  if (/^https?:\/\//i.test(raw)) {
    const match = raw.match(/\/form\/([A-Za-z0-9]+)/) || raw.match(/[?&](?:formId|id)=([A-Za-z0-9]+)/);
    const formId = match ? match[1] : "";
    return { formId, embedUrl: raw, submitUrl: GHL_SUBMIT_URL };
  }
  return {
    formId: raw,
    embedUrl: `https://api.leadconnectorhq.com/widget/form/${raw}`,
    submitUrl: GHL_SUBMIT_URL,
  };
}

export function buildLeadFormData({ formValue, locationId, lead, summary, fieldMap }) {
  const parsed = parseGhlForm(formValue);
  const map = fieldMap || {};
  const info = lead.vehicleInfo || {};
  const values = {
    full_name: String(lead.name || "").trim(),
    email: String(lead.email || "").trim(),
    phone: String(lead.phone || "").trim(),
    notes: String(lead.notes || "").trim(),
    estimate_summary: summary || "",
    vehicle: vehicleLine(info),
    vin: info.vin || "",
    claim_number: info.claim || "",
    carrier: lead.carrierLabel || "",
    grand_total: String(lead.grandTotal ?? ""),
    panel_count: String(lead.panelCount ?? ""),
    opportunity_name: `Hail estimate — ${vehicleLine(info) || "vehicle"} — $${Number(lead.grandTotal || 0).toLocaleString("en-US")}`,
  };
  if (!map.notes && values.notes) {
    values.estimate_summary = `Notes: ${values.notes}\n\n${values.estimate_summary}`.trim();
  }
  const formData = {};
  if (parsed.formId) formData.formId = parsed.formId;
  if (locationId) {
    formData.locationId = locationId;
    formData.location_id = locationId;
  }
  for (const [logical, key] of Object.entries(map)) {
    if (!key) continue;
    const value = values[logical];
    if (value == null || value === "") continue;
    formData[key] = String(value);
  }
  return { ...parsed, formData };
}

export async function submitGhlLead(args, fetchImpl = globalThis.fetch) {
  const built = buildLeadFormData(args);
  if (!built.formId) return { ok: false, reason: "unconfigured" };
  const body = new FormData();
  body.set("formData", JSON.stringify(built.formData));
  const response = await fetchImpl(built.submitUrl, { method: "POST", body });
  let text = "";
  try { text = await response.text(); } catch (err) { text = ""; }
  return { ok: response.ok, status: response.status, body: String(text).slice(0, 500), formId: built.formId };
}

export function validateLead(lead) {
  const errors = {};
  if (!String(lead?.name || "").trim()) errors.name = "Enter your name.";
  const digits = String(lead?.phone || "").replace(/\D/g, "");
  if (digits.length < 10) errors.phone = "Enter a phone number with at least 10 digits.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(lead?.email || "").trim())) errors.email = "Enter an email address.";
  return errors;
}
