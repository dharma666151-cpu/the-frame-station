
import { json, requireAdmin } from "../../_lib.js";

export async function onRequestPost(context) {
  const s = await requireAdmin(context);
  if (!s) return json({ error: "Unauthorized" }, 401);
  if (!context.env.IMAGES) return json({ error: "R2 binding IMAGES is not configured." }, 503);
  const form = await context.request.formData();
  const file = form.get("file");
  if (!file || typeof file.arrayBuffer !== "function") return json({ error: "Image file is required." }, 400);
  if (!String(file.type || "").startsWith("image/")) return json({ error: "Only images are allowed." }, 400);
  if (file.size > 8 * 1024 * 1024) return json({ error: "Image must be under 8 MB." }, 400);
  const ext = (file.name?.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g,"");
  const key = `products/${Date.now()}-${crypto.randomUUID()}.${ext}`;
  await context.env.IMAGES.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
  return json({ ok: true, key, url: `/api/image?key=${encodeURIComponent(key)}` });
}
