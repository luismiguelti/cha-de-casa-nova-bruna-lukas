const E = window.EVENTO || {};
const supabaseConfigurado = Boolean(
  window.supabase &&
  typeof E.supabaseUrl === "string" &&
  /^https:\/\/[^\s]+$/.test(E.supabaseUrl) &&
  typeof E.supabaseKey === "string" &&
  E.supabaseKey.length > 20 &&
  !E.supabaseKey.startsWith("COLE_AQUI")
);
const sb = supabaseConfigurado ? window.supabase.createClient(E.supabaseUrl, E.supabaseKey) : null;
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
document.documentElement.classList.add("js");
function iniciarAnimacoes(){
  const card=document.querySelector(".card");
  if(!card)return;
  [...card.children].filter(el=>!el.classList.contains("leaf")).forEach((el,i)=>{
    el.classList.add("motion-item");
    el.style.setProperty("--delay",`${Math.min(i*70,560)}ms`);
  });
  requestAnimationFrame(()=>document.body.classList.add("motion-ready"));
}
document.addEventListener("DOMContentLoaded", () => {
  try {
    document.title = document.querySelector(".classic-card")
      ? (E.nomes || "Bruna e Lukas")
      : `${E.titulo || "Chá de Casa Nova"} | ${E.nomes || "Bruna e Lukas"}`;
    document.querySelectorAll("[data-ev]").forEach(el => el.textContent = E[el.dataset.ev] ?? "");
    iniciarAnimacoes();
  } catch (error) {
    console.error("Não foi possível iniciar os dados e animações do convite:", error);
  } finally {
    // O conteúdo nunca deve ficar invisível por causa de uma falha de animação.
    document.body.classList.add("motion-ready");
  }
});
function showMsg(el, type, text){ el.className = "msg " + type; el.textContent = text; }
