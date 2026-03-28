const GEMINI_KEY = process.env.GEMINI_API_KEY;
const AMAZON_TAG = 'marinaveauv04-20';
const ADSENSE_ID = 'ca-pub-9764757165289980';
const SITE_NAME = 'IA Finanzas Personales';
const SITE_COLOR = '#2ecc71';
const LANG = 'es';
const fs = require('fs');
const path = require('path');

const TOPICS = [
  "Las Mejores Apps de IA para Controlar tu Presupuesto en 2026",
  "Cómo Usar IA para Invertir de Forma Inteligente: Guía para Principiantes",
  "Herramientas de IA para Ahorrar Dinero Automáticamente",
  "IA para Declaración de Impuestos: Las Mejores Opciones",
  "Cómo Planificar tu Jubilación con Inteligencia Artificial",
  "Robo-Advisors en Español: Comparativa Completa 2026",
  "Apps de IA para Eliminar Deudas: Estrategias que Funcionan",
  "Cómo la IA Puede Ayudarte a Crear un Fondo de Emergencia",
  "Herramientas de IA para Rastrear y Optimizar tus Gastos",
  "IA para Inversiones en Criptomonedas: Riesgos y Herramientas",
  "Las Mejores Herramientas de IA para Freelancers y Autónomos",
  "Cómo Usar ChatGPT para Mejorar tus Finanzas Personales",
  "Apps de IA para Comparar Seguros y Ahorrar",
  "IA para Gestión de Patrimonio: Herramientas Accesibles",
  "Cómo Crear un Plan Financiero Personal con Asistencia de IA"
];

async function generateArticle(topic) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `Eres un experto en finanzas personales y tecnología que escribe en español (España/Latinoamérica). Escribe un artículo de 2000-3000 palabras sobre: ${topic}. Incluye comparaciones prácticas, precios, ventajas y desventajas. Incluye 2-3 enlaces de afiliado de Amazon: https://www.amazon.com/dp/{ASIN}?tag=${AMAZON_TAG}. Usa estos ASINs: 0593418484 (Hábitos Atómicos), 006299817X (Psychology of Money), 0062960067 (AI Superpowers). Solo HTML (H2,H3,tablas,listas,p). Sin etiquetas html/head/body. Responde en JSON: {"title":"...","slug":"...","excerpt":"...","content":"..."}. El slug debe estar en español con guiones. Todo el contenido DEBE estar en español.` }] }],
      generationConfig: { temperature: 0.8, maxOutputTokens: 8192, responseMimeType: 'application/json', responseSchema: { type: 'object', properties: { title: { type: 'string' }, slug: { type: 'string' }, excerpt: { type: 'string' }, content: { type: 'string' } }, required: ['title','slug','excerpt','content'] } },
    }),
  });
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini empty');
  return JSON.parse(text);
}

function buildHTML(article) {
  return `<!DOCTYPE html><html lang="${LANG}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${article.title} — ${SITE_NAME}</title><meta name="description" content="${article.excerpt}"><meta name="google-adsense-account" content="${ADSENSE_ID}"><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}" crossorigin="anonymous"></script><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',sans-serif;background:#0f0f1a;color:#d0d0d0;line-height:1.8}.container{max-width:780px;margin:0 auto;padding:40px 20px}a{color:${SITE_COLOR}}h1{font-size:36px;font-weight:800;color:#fff;margin-bottom:16px;line-height:1.2}h2{font-size:24px;font-weight:700;color:#fff;margin:32px 0 12px;padding-top:16px;border-top:1px solid #222}h3{font-size:18px;font-weight:600;color:#e0e0e0;margin:20px 0 8px}p{margin-bottom:16px}ul,ol{margin:0 0 16px 24px}li{margin-bottom:6px}table{width:100%;border-collapse:collapse;margin:16px 0}th,td{padding:10px 14px;border:1px solid #222;text-align:left;font-size:14px}th{background:#1a1a2e;color:#fff;font-weight:600}td{background:#111122}.meta{color:#666;font-size:13px;margin-bottom:24px}.back{display:inline-block;color:${SITE_COLOR};text-decoration:none;font-size:14px;margin-bottom:20px}.affiliate-note{background:#1a1a2e;padding:12px 16px;border-radius:8px;font-size:12px;color:#666;margin-top:40px;border-left:3px solid ${SITE_COLOR}}footer{text-align:center;padding:40px 20px;color:#444;font-size:12px}</style></head><body><div class="container"><a href="../index.html" class="back">&larr; Volver a ${SITE_NAME}</a><h1>${article.title}</h1><div class="meta">Actualizado el ${new Date().toLocaleDateString('es-ES',{year:'numeric',month:'long',day:'numeric'})} • ${SITE_NAME}</div>${article.content}<div class="affiliate-note"><strong>Divulgación:</strong> Algunos enlaces son enlaces de afiliado. Podemos ganar una comisión sin costo adicional para ti.</div></div><footer>${SITE_NAME} &copy; 2026</footer></body></html>`;
}

function updateIndex(articles) {
  const indexPath = path.join(__dirname,'..','index.html');
  let idx = fs.readFileSync(indexPath,'utf8');
  const cards = articles.map(a => `<div class="article-card"><span class="tag">Reseña</span><h3><a href="articles/${a.slug}.html">${a.title}</a></h3><p>${a.excerpt}</p><div class="meta">${new Date().toLocaleDateString('es-ES',{day:'numeric',month:'short',year:'numeric'})}</div></div>`).join('\n');
  idx = idx.replace(/<div class="article-grid" id="article-grid">[\s\S]*?<\/div>\s*<\/section>/,`<div class="article-grid" id="article-grid">\n${cards}\n</div>\n</section>`);
  fs.writeFileSync(indexPath, idx);
}

(async () => {
  const count = parseInt(process.env.ARTICLE_COUNT || '3');
  const articlesDir = path.join(__dirname,'..','articles');
  if (!fs.existsSync(articlesDir)) fs.mkdirSync(articlesDir,{recursive:true});
  const existing = fs.readdirSync(articlesDir).filter(f=>f.endsWith('.html')).map(f=>f.replace('.html',''));
  const available = TOPICS.filter(t => !existing.some(e => t.toLowerCase().includes(e.replace(/-/g,' ').substring(0,20))));
  const published = [];
  for (let i = 0; i < Math.min(count, available.length); i++) {
    console.log(`[${i+1}/${count}] ${available[i]}`);
    try {
      const article = await generateArticle(available[i]);
      fs.writeFileSync(path.join(articlesDir, article.slug + '.html'), buildHTML(article));
      console.log('  OK: ' + article.slug);
      published.push(article);
    } catch (err) { console.error('  ERROR: ' + err.message); }
    if (i < count - 1) await new Promise(r => setTimeout(r, 3000));
  }
  const all = fs.readdirSync(articlesDir).filter(f=>f.endsWith('.html')).map(f => {
    const c = fs.readFileSync(path.join(articlesDir,f),'utf8');
    const t = c.match(/<title>(.*?) —/); const d = c.match(/content="(.*?)">/);
    return t ? { title: t[1], slug: f.replace('.html',''), excerpt: d?d[1]:'' } : null;
  }).filter(Boolean);
  if (all.length) updateIndex(all);
  console.log(published.length + '/' + count + ' published. Total: ' + all.length);
})();
