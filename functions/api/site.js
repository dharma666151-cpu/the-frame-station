
import { json } from "../_lib.js";

export async function onRequestGet(context) {
  const { env } = context;
  if (!env.DB) {
    return json({ settings: {}, products: [] });
  }
  try {
    const settingsRows = await env.DB.prepare("SELECT key, value FROM settings").all();
    const productRows = await env.DB.prepare(`
      SELECT id, name, category, price, image, featured, active, sort_order
      FROM products WHERE active = 1 ORDER BY sort_order ASC, id ASC
    `).all();
    const settings = {};
    for (const row of settingsRows.results || []) settings[row.key] = row.value;
    return json({ settings, products: productRows.results || [] }, 200, {
      "cache-control": "public, max-age=60"
    });
  } catch (e) {
    return json({ settings: {}, products: [], error: "Database not initialized." }, 200);
  }
}
