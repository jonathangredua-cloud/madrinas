// Pure fulfillment calculation and depletion simulation functions
// Mirrors SAP B1 availability check logic for Produmex WMS

import { INV } from "../data/inventory.js";

/**
 * Calculate fulfillment for one order against a stock snapshot.
 *
 * @param {Object} order  - order from buildOrders()
 * @param {Object} snap   - map of itemCode → available qty
 * @returns {{ pct: number, status: "ready"|"preorder"|"shortage", ld: Array }}
 */
export function calcFulfill(order, snap) {
  let tQty = 0, fQty = 0, allOk = true, hasPre = false;

  const ld = order.lines.map((l) => {
    const inv = INV[l.itemCode];
    const stk = snap[l.itemCode] ?? 0;
    const can = Math.min(l.qty, stk);
    const pct = l.qty > 0 ? Math.round((can / l.qty) * 100) : 100;
    tQty += l.qty;
    fQty += can;
    if (can < l.qty) {
      if (inv?.pre) hasPre = true;
      else allOk = false;
    }
    return {
      itemCode: l.itemCode,
      name: inv?.name ?? "Unknown",
      w: inv?.w ?? 0,
      qty: l.qty,
      stock: stk,
      can,
      pct,
      pre: inv?.pre ?? false,
      ok: can >= l.qty,
    };
  });

  const pct = tQty > 0 ? Math.round((fQty / tQty) * 100) : 100;
  const status = allOk && !hasPre ? "ready" : allOk && hasPre ? "preorder" : "shortage";
  return { pct, status, ld };
}

/**
 * Build per-order stock snapshots reflecting inventory depletion
 * in the order they appear in selectedIds.
 *
 * Only orders in selectedIds get a snapshot; others see base stock.
 *
 * @param {Array}  orders      - full order list
 * @param {Set}    selectedIds - ordered Set of selected order IDs
 * @param {Object} baseSnap    - initial itemCode → qty map
 * @returns {Object} map of orderId → snapshot
 */
export function buildSnapshots(orders, selectedIds, baseSnap) {
  const pool = { ...baseSnap };
  const snaps = {};

  for (const order of orders) {
    if (!selectedIds.has(order.id)) continue;
    snaps[order.id] = { ...pool };
    for (const l of order.lines) {
      pool[l.itemCode] = Math.max(0, (pool[l.itemCode] ?? 0) - l.qty);
    }
  }

  return snaps;
}

/**
 * Aggregate order-level stats from analysis map.
 */
export function calcStats(orders, analysis) {
  let ready = 0, shortage = 0, preorder = 0;
  for (const o of orders) {
    const st = analysis[o.id]?.status;
    if (st === "ready") ready++;
    else if (st === "shortage") shortage++;
    else if (st === "preorder") preorder++;
  }
  return { total: orders.length, ready, shortage, preorder };
}

/**
 * Build initial stock snapshot from INV master.
 */
export function buildBaseSnap(inv) {
  const s = {};
  for (const [k, v] of Object.entries(inv)) s[k] = v.stock;
  return s;
}
