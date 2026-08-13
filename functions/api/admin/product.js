
import { json, requireAdmin, safeText } from "../../_lib.js";

export async function onRequestPost(context) {
  const s = await requireAdmin(context);
  if (!s) return json({ error: "Unauthorized" }, 401);
  if (!context.env.DB) return json({ error: "D1 binding DB is missing." }, 503);
  let b;
  try { b = await context.request.json(); } catch { return json({ error: "Invalid JSON." }, 400); }
  const id = Number(b.id || 0);
  const name = safeText(b.name, 160);
  const category = safeText(b.category, 100);
  const price = safeText(b.price, 50);
  const image = safeText(b.image, 300);
  const featured = b.featured ? 1 : 0;
  const active = b.active === false ? 0 : 1;
  const sortOrder = Number.isFinite(Number(b.sort_order)) ? Number(b.sort_order) : 100;
  if (!name) return json({ error: "Product name is required." }, 400);

  if (id) {
    await context.env.DB.prepare(`
      UPDATE products SET name=?,category=?,price=?,image=?,featured=?,active=?,sort_order=?,updated_at=CURRENT_TIMESTAMP
      WHERE id=?
    `).bind(name,category,price,image,featured,active,sortOrder,id).run();
    return json({ ok: true, id });
  } else {
    const r = await context.env.DB.prepare(`
      INSERT INTO products(name,category,price,image,featured,active,sort_order)
      VALUES(?,?,?,?,?,?,?)
    `).bind(name,category,price,image,featured,active,sortOrder).run();
    return json({ ok: true, id: r.meta?.last_row_id });
  }
}

export async function onRequestDelete(context) {
  const s = await requireAdmin(context);
  if (!s) return json({ error: "Unauthorized" }, 401);
  if (!context.env.DB) return json({ error: "D1 binding DB is missing." }, 503);
  const url = new URL(context.request.url);
  const id = Number(url.searchParams.get("id") || 0);
  if (!id) return json({ error: "Missing id." }, 400);
  await context.env.DB.prepare("DELETE FROM products WHERE id=?").bind(id).run();
  return json({ ok: true });
}
