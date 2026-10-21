const CATS=["Cozinha","Utensílios domésticos","Organização","Limpeza","Mesa e decoração","Cama, mesa e banho","Eletroportáteis"];
const $=id=>document.getElementById(id),msg=$("msg");
let convidados=[];
$("gcat").innerHTML=CATS.map(c=>`<option>${esc(c)}</option>`).join("");
const fmt=d=>new Date(d).toLocaleString("pt-BR");
async function entrar(){
  const {data:{session}}=await sb.auth.getSession();
  if(!session){$("login").classList.remove("oculto");$("painel").classList.add("oculto");return}
  const {data:ok}=await sb.rpc("is_admin");
  if(!ok){await sb.auth.signOut();return showMsg(msg,"err","Este usuário não tem permissão de administrador.")}
  $("login").classList.add("oculto");$("painel").classList.remove("oculto");msg.className="msg";
  carregarG();carregarP();
}
$("login").addEventListener("submit",async e=>{
  e.preventDefault();
  const {error}=await sb.auth.signInWithPassword({email:$("em").value,password:$("pw").value});
  if(error)return showMsg(msg,"err","E-mail ou senha incorretos.");
  $("pw").value="";entrar();
});
$("sair").onclick=async()=>{await sb.auth.signOut();entrar()};
$("tG").onclick=()=>{$("vG").classList.remove("oculto");$("vP").classList.add("oculto")};
$("tP").onclick=()=>{$("vP").classList.remove("oculto");$("vG").classList.add("oculto")};
async function carregarG(){
  const {data,error}=await sb.from("guest_confirmations").select("*");
  if(error)return showMsg(msg,"err","Erro ao carregar convidados.");
  convidados=data;renderG();
}
function renderG(){
  const q=$("q").value.toLowerCase().trim();
  const l=convidados.filter(g=>g.full_name.toLowerCase().includes(q)).sort($("ord").value==="nome"?(a,b)=>a.full_name.localeCompare(b.full_name,"pt-BR"):(a,b)=>new Date(b.created_at)-new Date(a.created_at));
  $("total").textContent=convidados.length;
  $("tbG").innerHTML=l.length?l.map(g=>`<tr><td>${esc(g.full_name)}</td><td>${fmt(g.created_at)}</td><td><button class="btn sm sec" data-del="${g.id}">EXCLUIR</button></td></tr>`).join(""):'<tr><td colspan="3">Nenhuma confirmação encontrada.</td></tr>';
  renderG.l=l;
}
$("q").oninput=renderG;$("ord").onchange=renderG;
$("tbG").addEventListener("click",async e=>{const id=e.target.dataset.del;if(!id||!confirm("Excluir esta confirmação?"))return;await sb.from("guest_confirmations").delete().eq("id",id);carregarG()});
$("csv").onclick=()=>{
  const linhas=[["Nome","Confirmado em"],...(renderG.l||[]).map(g=>[g.full_name,fmt(g.created_at)])];
  const csv="\uFEFF"+linhas.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(";")).join("\n");
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));a.download="convidados.csv";a.click();
};
let presentes=[];
async function carregarP(){
  const {data,error}=await sb.from("gifts").select("*").order("category").order("name");
  if(error)return showMsg(msg,"err","Erro ao carregar presentes.");
  const {data:reservas,error:errorReservas}=await sb.rpc("admin_list_gift_reservations");
  if(errorReservas)return showMsg(msg,"err","Erro ao carregar reservas.");
  const porPresente=new Map((reservas||[]).map(r=>[r.gift_id,r]));
  presentes=data;
  $("tbP").innerHTML=data.map(g=>{const r=porPresente.get(g.id);return `<tr><td>${esc(g.name)}${g.is_active?"":" (oculto)"}</td><td>${esc(g.category)}</td><td>${r?"Reservado por "+esc(r.guest_name):"Disponível"}</td><td>
<button class="btn sm sec" data-ed="${g.id}">EDITAR</button> <button class="btn sm sec" data-at="${g.id}">${g.is_active?"DESATIVAR":"ATIVAR"}</button>
${r?`<button class="btn sm sec" data-cr="${r.id}">CANCELAR RESERVA</button>`:""} <button class="btn sm sec" data-rm="${g.id}">EXCLUIR</button></td></tr>`}).join("");
}
$("tbP").addEventListener("click",async e=>{
  const d=e.target.dataset;
  if(d.ed){const g=presentes.find(x=>x.id===d.ed);$("gid").value=g.id;$("gname").value=g.name;$("gcat").value=g.category;$("gdesc").value=g.description||"";$("gimg").value=g.image_url||"";$("gname").focus();return}
  if(d.at){const g=presentes.find(x=>x.id===d.at);await sb.from("gifts").update({is_active:!g.is_active}).eq("id",g.id)}
  else if(d.cr){if(!confirm("Cancelar esta reserva?"))return;await sb.from("gift_reservations").delete().eq("id",d.cr)}
  else if(d.rm){if(!confirm("Excluir o presente (e sua reserva)?"))return;await sb.from("gifts").delete().eq("id",d.rm)}
  else return;
  carregarP();
});
$("gform").addEventListener("submit",async e=>{
  e.preventDefault();
  const row={name:$("gname").value.trim(),category:$("gcat").value,description:$("gdesc").value.trim()||null,image_url:$("gimg").value.trim()||null};
  const id=$("gid").value;
  const {error}=id?await sb.from("gifts").update(row).eq("id",id):await sb.from("gifts").insert(row);
  if(error)return showMsg(msg,"err","Erro ao salvar o presente.");
  $("gform").reset();$("gid").value="";msg.className="msg";carregarP();
});
$("gclear").onclick=()=>{$("gform").reset();$("gid").value=""};
entrar();
