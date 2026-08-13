
export async function onRequestGet(context) {
  if (!context.env.IMAGES) return new Response("R2 not configured", { status: 404 });
  const url = new URL(context.request.url);
  const key = url.searchParams.get("key");
  if (!key || !key.startsWith("products/")) return new Response("Invalid key", { status: 400 });
  const obj = await context.env.IMAGES.get(key);
  if (!obj) return new Response("Not found", { status: 404 });
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("etag", obj.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  return new Response(obj.body, { headers });
}
