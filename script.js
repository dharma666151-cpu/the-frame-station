
// The Frame Station — static Cloudflare Pages site.
// To make the WhatsApp buttons open your business directly, add the full
// international number below without + or spaces, e.g. 9715XXXXXXXX.
const WHATSAPP_NUMBER = "";

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
}
document.querySelectorAll(".nav a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

document.getElementById("year").textContent = new Date().getFullYear();

function openWhatsApp(message) {
  const encoded = encodeURIComponent(message);
  const activeNumber = window.TFS_WHATSAPP || WHATSAPP_NUMBER;
  const url = activeNumber
    ? `https://wa.me/${activeNumber}?text=${encoded}`
    : `https://wa.me/?text=${encoded}`;
  window.open(url, "_blank", "noopener");
}

document.querySelectorAll(".order-link").forEach(btn => {
  btn.addEventListener("click", () => {
    openWhatsApp(`Hi The Frame Station, I am interested in: ${btn.dataset.product}. Please send me the price and available sizes.`);
  });
});

const contactWhatsApp = document.getElementById("contactWhatsApp");
contactWhatsApp.addEventListener("click", () => {
  openWhatsApp("Hi The Frame Station, I would like help choosing a frame.");
});

const photoUpload = document.getElementById("photoUpload");
const previewImage = document.getElementById("previewImage");
photoUpload.addEventListener("change", e => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => previewImage.src = reader.result;
  reader.readAsDataURL(file);
});

const frameStyle = document.getElementById("frameStyle");
const previewFrame = document.querySelector(".preview-frame");
const frameColors = {
  walnut: "#6b3f23",
  black: "#1a1a1a",
  gold: "#c6902f",
  teal: "#087f7f"
};
frameStyle.addEventListener("change", () => {
  previewFrame.style.borderColor = frameColors[frameStyle.value] || "#6b3f23";
});

document.getElementById("customOrder").addEventListener("click", () => {
  const size = document.getElementById("frameSize").value;
  const style = frameStyle.options[frameStyle.selectedIndex].text;
  openWhatsApp(`Hi The Frame Station, I want a custom frame. Size: ${size}. Style: ${style}. I will send my photo here.`);
});

// Build full gallery from uploaded products.
// Light visual grouping only; product metadata/prices can be added later.
const grid = document.getElementById("galleryGrid");
const products = window.PRODUCTS || [];
products.forEach((item, idx) => {
  const type = idx % 5 === 0 ? "gift" : (idx % 3 === 0 ? "modern" : "spiritual");
  const card = document.createElement("article");
  card.className = "gallery-item";
  card.dataset.type = type;
  card.innerHTML = `
    <img src="${item.src}" alt="${item.name}" loading="lazy">
    <button type="button" aria-label="Ask about ${item.name}">Ask →</button>
  `;
  card.querySelector("button").addEventListener("click", () => {
    openWhatsApp(`Hi The Frame Station, I am interested in ${item.name}. Please send me details, sizes and price.`);
  });
  grid.appendChild(card);
});

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    document.querySelectorAll(".gallery-item").forEach(item => {
      item.style.display = filter === "all" || item.dataset.type === filter ? "" : "none";
    });
  });
});


const floatingWhatsApp = document.getElementById("floatingWhatsApp");
if (floatingWhatsApp) {
  floatingWhatsApp.addEventListener("click", () => {
    openWhatsApp("Hi The Frame Station, I would like to order a frame. Please help me with available designs, sizes and price.");
  });
}


// ===== Cloudflare D1 dynamic site data =====
(async function loadCloudflareSiteData(){
  try{
    const r = await fetch('/api/site');
    if(!r.ok) return;
    const data = await r.json();
    const s = data.settings || {};
    const heroH = document.querySelector('.hero-copy h1');
    const heroP = document.querySelector('.hero-copy p');
    if(heroH && s.hero_title) heroH.textContent = s.hero_title;
    if(heroP && s.hero_text) heroP.textContent = s.hero_text;

    if(s.whatsapp){
      window.TFS_WHATSAPP = s.whatsapp.replace(/\D/g,'');
    }

    const dbProducts = Array.isArray(data.products) ? data.products : [];
    if(dbProducts.length){
      const gallery = document.getElementById('galleryGrid');
      if(gallery){
        gallery.innerHTML='';
        for(const item of dbProducts){
          const card=document.createElement('article');
          card.className='gallery-item';
          card.dataset.type=(item.category||'all').toLowerCase().includes('gift')?'gift':((item.category||'').toLowerCase().includes('modern')?'modern':'spiritual');
          card.innerHTML=`<img src="${item.image}" alt="${item.name}" loading="lazy"><button type="button">Ask →</button>`;
          card.querySelector('button').onclick=()=>openWhatsApp(`Hi The Frame Station, I am interested in ${item.name}${item.price?' ('+item.price+')':''}. Please send me details.`);
          gallery.appendChild(card);
        }
      }
      const featured=dbProducts.filter(p=>Number(p.featured)===1).slice(0,6);
      const grid=document.querySelector('.product-grid');
      if(grid && featured.length){
        grid.innerHTML='';
        for(const item of featured){
          const card=document.createElement('article');card.className='product-card';
          card.innerHTML=`<div class="product-image"><img src="${item.image}" alt="${item.name}" loading="lazy"></div><div class="product-info"><span>${item.category||'Featured'}</span><h3>${item.name}</h3>${item.price?`<strong style="margin-bottom:10px">${item.price}</strong>`:''}<button class="order-link">Ask Price / Order →</button></div>`;
          card.querySelector('button').onclick=()=>openWhatsApp(`Hi The Frame Station, I am interested in ${item.name}${item.price?' ('+item.price+')':''}. Please send me details.`);
          grid.appendChild(card);
        }
      }
    }
  }catch(e){ console.warn('Dynamic site data unavailable; using built-in content.', e); }
})();
