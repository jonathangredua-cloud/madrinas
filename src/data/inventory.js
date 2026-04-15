// Madrinas inventory master and order data
// Mirrors SAP B1 item master + Produmex WMS stock levels

export const INV = {
  "7052-WB":     { name: "Single Origin Sumatra",             w: 1.2,  stock: 340,  pre: false },
  "7199-BX":     { name: "Halo Collector's Box (Drop #1)",    w: 2.8,  stock: 45,   pre: false },
  "7161-PB":     { name: "Irish Creme",                       w: 1.0,  stock: 997,  pre: false },
  "7243-P25":    { name: "Water of Life",                     w: 1.0,  stock: 998,  pre: false },
  "7146-PB":     { name: "Chocolate Peanut Butter",           w: 1.0,  stock: 1000, pre: false },
  "7141-PB":     { name: "Ice Cream Sandwich",                w: 1.0,  stock: 1000, pre: false },
  "7153-PB":     { name: "Irish Creme (12ct)",                w: 1.0,  stock: 1000, pre: false },
  "7140-PB":     { name: "Brownie Batter",                    w: 1.0,  stock: 997,  pre: false },
  "7232-P25":    { name: "Blackberry Moji Dragonfruit",       w: 1.0,  stock: 999,  pre: false },
  "7220-P25":    { name: "Cherry Limeade",                    w: 1.0,  stock: 983,  pre: false },
  "7245-P25":    { name: "NT Fruit Punch",                    w: 1.0,  stock: 999,  pre: false },
  "7240-P25":    { name: "Booberry Lemonade",                 w: 1.0,  stock: 993,  pre: false },
  "7217-P25":    { name: "Peachy Lychee",                     w: 1.0,  stock: 1089, pre: true  },
  "7163-PB":     { name: "Irish Creme (PB)",                  w: 1.0,  stock: 983,  pre: false },
  "MASS-BUNDLE": { name: "Mass Effect Bundle",                w: 3.2,  stock: 12,   pre: false },
  "7221-P25":    { name: "Sour Watermelon",                   w: 1.0,  stock: 999,  pre: false },
  "7224-P25":    { name: "Raspberry Lemonade",                w: 1.0,  stock: 1000, pre: false },
  "7234-P25":    { name: "Sour White Cherry",                 w: 1.0,  stock: 1000, pre: false },
  "7204-P25":    { name: "Raspberry Lemonade (25ct)",         w: 1.0,  stock: 1000, pre: false },
  "7232-PB":     { name: "Blackberry Moji Dragonfruit (PB)",  w: 1.0,  stock: 0,    pre: false },
  "7142-PB":     { name: "Triple Chocolate Cake",             w: 1.0,  stock: 0,    pre: false },
  "7407-PB":     { name: "Elderberry Lemonade",               w: 1.0,  stock: 998,  pre: false },
  "7419-PB":     { name: "Depress Chocolate Espresso",        w: 1.0,  stock: 999,  pre: false },
  "7157-PB":     { name: "Cinnamon Chocolate Churro",         w: 1.0,  stock: 999,  pre: false },
  "7154-PB":     { name: "Classic Mocha",                     w: 1.0,  stock: 1000, pre: false },
  "7149-PB":     { name: "Brownie Batter (12ct PB)",          w: 1.0,  stock: 993,  pre: false },
  "7177-PB":     { name: "Gourmet French Toast",              w: 1.0,  stock: 1000, pre: false },
  "7192-PB":     { name: "Vanilla Bean Chappaccino",          w: 1.0,  stock: 999,  pre: false },
  "7141-PB2":    { name: "Dark Chocolate Salted Caramel",     w: 1.0,  stock: 993,  pre: false },
  "BOBAPEARLSHP":{ name: "HONEY POPPING BOBA",                w: 20.0, stock: 2,    pre: true  },
};

const CUSTOMERS = [
  { code: "C10000", name: "Gerardo Moreno",            addr: "3100 Creek Wood Dr, Brownsville TX 78526",    ref: "21242943" },
  { code: "C10000", name: "Zachry Brinker",            addr: "3153 Kenney Drive, Falls Church VA 22042",    ref: "21242957" },
  { code: "C10000", name: "Michael Polinder",          addr: "PO Box 675, Cosmopolis WA 98537",             ref: "21242964" },
  { code: "C10000", name: "Ondrej Băncov",             addr: "Dolné Srnie 101, SLOVAKIA",                   ref: "21242973" },
  { code: "C10000", name: "Christopher Boykin",        addr: "629 Krent Avenue, Cary IL 60013",             ref: "21242972" },
  { code: "C10000", name: "Gerardo Machorro Castillo", addr: "465 Westbury Ave, Carle Place NY 11514",      ref: "DO-NOT-FULFILL-1053" },
  { code: "C10000", name: "Sam Ealy",                  addr: "Wayne VLG Apt 160, Waynesborg PA 15370",      ref: "21242971" },
  { code: "C10000", name: "KEVIN KILMER",              addr: "3368 15th Street, Wyandotte MI 48192",        ref: "21242974" },
  { code: "C10000", name: "Danielle Haydon",           addr: "9206 W Timberline Dr, Newport MI 48166",      ref: "21242975" },
  { code: "C10000", name: "Alexander DeWall",          addr: "163 Norwood Pl, East Alton IL 62024",         ref: "21242977" },
  { code: "C10000", name: "chloe whitefld",            addr: "25 Fyne Lane, Bladford EC09 3SB, UK",         ref: "21242978" },
  { code: "C10000", name: "Andrea McGregor",           addr: "4110 John Hart Pl, Eau Claire WI 54703",      ref: "21242979" },
  { code: "C10000", name: "Marco Krautter",            addr: "1002 Stonebridge Dr, Anderson IN 46013",      ref: "21242980" },
  { code: "C10000", name: "Scott Coughlan",            addr: "4 Bentley Grove, Birmingham B29 5LR, UK",     ref: "21242981" },
  { code: "C00001", name: "Redwood Retail Group",      addr: "W Madison St 455, Chicago IL 60661",          ref: "WHOLESALE-001" },
  { code: "C10000", name: "Jake Martinez",             addr: "812 Maple St, Portland OR 97201",             ref: "21242982" },
  { code: "C10000", name: "Tanya Wilkins",             addr: "5501 Bayview Dr, Tampa FL 33611",             ref: "21242983" },
  { code: "C10000", name: "Priya Nair",                addr: "2200 Oak Blvd, Austin TX 78704",              ref: "21242984" },
  { code: "C10000", name: "Derek Foster",              addr: "901 Pine Ridge Rd, Charlotte NC 28210",       ref: "21242985" },
  { code: "C10000", name: "Megan O'Brien",             addr: "33 Harbor View, Boston MA 02110",             ref: "21242986" },
  { code: "C10000", name: "Luis Pacheco",              addr: "7744 Sunset Blvd, Los Angeles CA 90046",      ref: "21242987" },
  { code: "C10000", name: "Hannah Kim",                addr: "4120 Lakewood Dr, Seattle WA 98103",          ref: "21242988" },
  { code: "C10000", name: "Chris Nguyen",              addr: "555 Michigan Ave, Chicago IL 60611",          ref: "21242989" },
  { code: "C10000", name: "Sarah Kowalski",            addr: "1800 Elm St, Denver CO 80202",                ref: "21242990" },
  { code: "C10000", name: "Marcus Thompson",           addr: "260 Peachtree St, Atlanta GA 30303",          ref: "21242991" },
];

const ORDER_ITEMS = [
  [["7052-WB",2],["7161-PB",1],["7146-PB",1]],
  [["7199-BX",1],["7140-PB",3]],
  [["7243-P25",1]],
  [["7146-PB",1],["7141-PB",1],["7153-PB",2],["7140-PB",1]],
  [["7232-P25",2],["7220-P25",1],["7245-P25",1],["7240-P25",3]],
  [["7217-P25",4],["7163-PB",1]],
  [["7163-PB",2]],
  [["7220-P25",1],["MASS-BUNDLE",8]],
  [["7221-P25",1],["7224-P25",1],["7234-P25",1],["7204-P25",1]],
  [["7232-PB",3],["7142-PB",2]],
  [["7407-PB",1],["7419-PB",2]],
  [["7407-PB",1],["7157-PB",1],["7154-PB",3]],
  [["7157-PB",1],["7154-PB",2],["7149-PB",1],["7177-PB",1],["7192-PB",1]],
  [["7141-PB2",1],["BOBAPEARLSHP",5]],
  [["BOBAPEARLSHP",3],["7052-WB",2],["7199-BX",1]],
  [["7146-PB",1],["7232-P25",1]],
  [["7240-P25",2],["7221-P25",1],["7407-PB",1]],
  [["7154-PB",1],["7177-PB",1]],
  [["7419-PB",1],["7157-PB",2],["7149-PB",1]],
  [["7192-PB",1],["7141-PB2",1],["7052-WB",2]],
  [["MASS-BUNDLE",6],["7220-P25",1]],
  [["7243-P25",1],["7245-P25",1]],
  [["7153-PB",2],["7163-PB",1],["7140-PB",1]],
  [["7224-P25",1],["7234-P25",1],["7204-P25",1],["7052-WB",1]],
  [["7142-PB",2],["7232-PB",3],["7217-P25",1]],
];

export function buildOrders() {
  return CUSTOMERS.map((cust, i) => {
    const lines = (ORDER_ITEMS[i] ?? [["7146-PB", 1]]).map(([itemCode, qty]) => ({
      itemCode,
      qty,
    }));
    const totalWeight = Math.round(
      lines.reduce((s, l) => s + (INV[l.itemCode]?.w ?? 0) * l.qty, 0) * 100
    ) / 100;
    return {
      id: `SO-${286 + i}`,
      docEntry: 286 + i,
      cust,
      lines,
      totalWeight,
      shipDate: "03/17/26",
      wh: "MFG",
    };
  });
}
