// Mock API layer — swap with real SAP B1 / Produmex WMS endpoints
// Base URL driven by VITE_API_BASE_URL env var.

import { buildOrders } from "../data/inventory.js";

// eslint-disable-next-line no-unused-vars
const BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

// In-memory session state
let _orders = buildOrders();
let _releaseHistory = [];

function delay(ms = 350) {
  return new Promise((res) => setTimeout(res, ms));
}

/**
 * GET /api/fulfillment/orders
 * Returns all open orders.
 */
export async function getOrders() {
  await delay();
  return {
    ok: true,
    data: _orders.map((o) => ({ ...o, lines: o.lines.map((l) => ({ ...l })) })),
  };
}

/**
 * POST /api/fulfillment/release-orders
 * Body: { docNums: string[], releasedBy: string, waveGroup: boolean }
 */
export async function releaseOrders({ docNums, releasedBy = "WH_SUPERVISOR", waveGroup = false }) {
  await delay(600);

  if (!Array.isArray(docNums) || docNums.length === 0) {
    return { ok: false, error: "No orders specified." };
  }
  if (docNums.length > 200) {
    return { ok: false, error: "Release cap is 200 orders per batch." };
  }

  const released = _orders
    .filter((o) => docNums.includes(o.id))
    .map((o) => o.id);

  if (released.length === 0) {
    return { ok: false, error: "No matching orders found." };
  }

  _orders = _orders.filter((o) => !released.includes(o.id));

  const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
  const label = `WAVE-${new Date().toISOString().slice(0, 10)}-${String(_releaseHistory.length + 1).padStart(2, "0")}`;

  const entry = {
    label,
    count: released.length,
    waveGroup,
    ts: timestamp,
    releasedBy,
    ids: released,
  };
  _releaseHistory.unshift(entry);

  return { ok: true, data: { released, batch: entry } };
}

/**
 * GET /api/fulfillment/release-history
 */
export async function getReleaseHistory() {
  await delay(200);
  return { ok: true, data: _releaseHistory };
}
