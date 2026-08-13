
import { json, requireAdmin } from "../../_lib.js";
export async function onRequestGet(context) {
  const s = await requireAdmin(context);
  if (!s) return json({ error: "Unauthorized" }, 401);
  if (!context.env.DB) return json({ error: "D1 binding DB is missing." }, 503);
  const settingsRows = await context.env.DB.prepare("SELECT key, value FROM settings ORDER BY key").all();
  const products = await context.env.DB.prepare("SELECT * FROM products ORDER BY sort_order, id").all();
  const settings = {};
  for (const r of settingsRows.results || []) settings[r.key] = r.value;
  return json({ settings, products: products.results || [] });
}
