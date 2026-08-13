
import { json } from "../_lib.js";
export async function onRequestPost() {
  return json({ ok: true }, 200, {
    "set-cookie": "tfs_admin=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0"
  });
}
