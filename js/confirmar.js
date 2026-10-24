const form=document.getElementById("form"),btn=document.getElementById("btn"),msg=document.getElementById("msg");
let enviando=false;
form.addEventListener("submit",async e=>{
  e.preventDefault(); if(enviando) return;
  if(!sb) return showMsg(msg,"err","A confirmação estará disponível assim que o convite for conectado ao banco de dados.");
  const nome=document.getElementById("nome").value.replace(/\s+/g," ").trim();
  if(!/^\p{L}[\p{L}'’.-]*(\s+\p{L}[\p{L}'’.-]*)+$/u.test(nome)||nome.length<5) return showMsg(msg,"err","Informe nome e sobrenome.");
  enviando=true; btn.disabled=true; btn.textContent="ENVIANDO…";
  try{
    const {data,error}=await sb.rpc("confirm_presence",{p_name:nome});
    if(error||data!=="ok") throw error||new Error(data);
    form.reset(); showMsg(msg,"ok","Presença confirmada! Ficamos muito felizes em compartilhar esse momento com você!");
    window.setTimeout(()=>{ window.location.href="confirmacao.html?nome="+encodeURIComponent(nome); },700);
  }catch(err){ showMsg(msg,"err","Não foi possível registrar sua confirmação. Verifique a conexão e tente novamente."); }
  finally{ enviando=false; btn.disabled=false; btn.textContent="CONFIRMAR PRESENÇA"; }
});
