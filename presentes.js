const CATS=["Cozinha","Utensílios domésticos","Organização","Limpeza","Mesa e decoração","Cama, mesa e banho","Eletroportáteis"];
const grade=document.getElementById("grade"),busca=document.getElementById("busca"),cat=document.getElementById("cat"),msg=document.getElementById("msg"),dlg=document.getElementById("dlg");
let gifts=[],atual=null,enviando=false;
cat.insertAdjacentHTML("beforeend",CATS.map(c=>`<option>${esc(c)}</option>`).join(""));
const webImages={
  "Kit Lixeira Inox 3L e Escova Sanitária Inox para Banheiro":"https://images.tcdn.com.br/img/img_prod/1180967/kit_lixeira_3l_escova_sanitaria_p_banheiro_inox_22917_vencedor_33278_2_31369b3442aa634e7ca548a8d64b1baa.jpg",
  "Cesto de Bambu Roupa Suja Natural com Tampa e Alças de Corda":"https://cdn.leroymerlin.com.br/products/cesto_de_roupas_multiuso_roupeiro_bambu_retangular_artiko_pra_1571780145_51bc_600x600.jpg",
  "Churrasqueira Elétrica Britânia Menos Fumaça Preta":"https://dverr7iyvl0k.cloudfront.net/Custom/Content/Products/14/96/14961_110v-churrasqueira-eletrica-britania-bcq40-223120_z4_638965770116379786.webp",
  "Conjunto Aparelho Fondue Grande Queijo Chocolate 6 Pessoas Preto":"https://product-hub-prd.madeiramadeira.com.br/3151838/images/dd2a136c-fefc-4cf6-b291-19c84d87746523728282fondueservicomediocombasegiratoria22pecas6pessoassku256541841600x600.jpg",
  "Kit Jogo de Lençol 4 Peças 600 Fios Egípcios Casal Queen King Micropercal":"https://images.tcdn.com.br/img/img_prod/615256/jogo_de_lenol_casal_padro_premium_soft_600_fios_mi_2_20260226142822_aa27d902811e.jpg",
  "Jogo Lençol Queen 3 Peças 400 Fios 100% Algodão Premium Cinza":"https://images.yampi.me/assets/stores/am-bordados/uploads/images/jogo-de-cama-queen-elegance-percal-400-fios-3-pecas-cinza-nobre-689b74838e242-large.png",
  "Kit Cozinha Descascador Amassador de Batatas Espremedor Limão Alho Aço Inox":"https://a-static.mlcdn.com.br/800x800/kit-amassador-de-batata-descascador-legumes-esmagador-e-ralador-4-faces-para-cozinha-aco-inox-sq/rytweb2/kit-alho-batata-descasca-ralador/87cfe5992dfe3434d98fefc65472ab58.jpeg",
  "Kit 12 Utensílios de Cozinha em Silicone Cabo Madeira":"https://down-br.img.susercontent.com/file/br-11134207-7r98o-m775mjn6ruq2ec",
  "Jogo de Copos Nadir Aruba 465ml 6 Peças Transparente":"https://cdn.awsli.com.br/800x800/2512/2512579/produto/1842142780c7fe1347f.jpg",
  "Escorredor de Louça 13 Pratos 2 Andares com Porta-Talheres e Copos":"https://a-static.mlcdn.com.br/420x420/escorredor-de-louca-preto-fosco-2-andares-alta-capacidade-com-bandeja-coletora-e-portatalheres-westing-by-bsmix/bsmix/wte-905/17a694d6235e641c0751e9fd04ab2b54.jpeg",
  "Kit 60 Pregadores de Madeira Roupa Águia Branca":"https://down-br.img.susercontent.com/file/sg-11134201-22110-ofqbc2l6nqjv51",
  "Escorredor de Massas e Macarrão em Aço Inox":"https://images.tcdn.com.br/img/img_prod/1110727/escorredor_de_macarrao_inox_yangzi_yar1403_14866_1896_2_7c4c7aa2e1c28a6bc055a89b54392217.png",
  "Kit de 3 Potes Herméticos Muug Vidro 1000ml com Tampa de Bambu":"https://product-hub-prd.madeiramadeira.com.br/615587866/images/58a6675c-476d-4beb-9b5b-66ed5fabbbc9c6659819be7ae769d607e32748.jpg",
  "Jogo de Toalhas de Banho Gigantes 4 Peças Branco e Fendi":"https://casanovatoalhas.cdn.magazord.com.br/img/2025/09/produto/2938/jogo-de-toalhas-banhao-4-pecas-karsten-magna-branco-e-lunar.jpg",
  "Liquidificador Mondial Turbo Power L-99 550W":"https://lojamondial.vtexassets.com/arquivos/ids/161548/L-99-FB---Foto-02.jpg?v=638875936802000000",
  "Espremedor de Frutas Electrolux Efficient para Laranjas e Limão":"https://a-static.mlcdn.com.br/1500x1500/espremedor-de-frutas-electrolux-ecp10-preto-e-prata-30w-800ml/magazineluiza/236784000/5dab3f70dfcc137f4fe974bef572c57b.jpg",
  "Sanduicheira Grill Oliver Home 3 em 1 Brunch Time Antiaderente":"https://lojamondial.vtexassets.com/arquivos/ids/167753-800-450?aspect=true&height=450&v=639099517108170000&width=800",
  "Kit 5 Panos de Prato Xadrez Branco com Dourado Algodão Laune Haus":"https://product-hub-prd.madeiramadeira.com.br/241253755/images/194e3d35-193e-48c0-ab29-010c5024031boucapiacozinhatoalhashow18.jpg",
  "Porta Utensílios de Cozinha de Madeira e Plástico":"https://http2.mlstatic.com/D_NQ_NP_988109-MLB90355581063_082025-O-organizador-porta-utensilios-talheres-cozinha-alca-ou-cores.webp",
  "Kit 126 Ferramentas Profissionais com Maleta Alicates Chaves Martelo Trena Nível":"https://americanas.vtexassets.com/arquivos/ids/13476109/7512448475_4_xlarge.jpg?v=638754404810400000",
  "Kit 3 Tapetes de Banheiro Microfibra Antiderrapantes Sortidos":"https://media.s-bol.com/gqBzZWRymA7j/YENp2NK/550x550.jpg",
  "Mini Processador de Alimentos Manual Triturador de Alho 500ml com 3 Lâminas de Aço Inox":"https://down-br.img.susercontent.com/file/br-11134207-7r98o-mcupcim0rt4ifd"
};
Object.assign(webImages,{
  "Cesto de Bambu Roupa Suja Natural com Tampa e Alças de Corda":"https://pictureserver.net/pic_storage/pic/68/21/undef_src_sa_picid_849116_x_3500_type_whitesh_image.jpg?ver=8",
  "Kit 126 Ferramentas Profissionais com Maleta Alicates Chaves Martelo Trena Nível":"https://a-static.mlcdn.com.br/%7Bw%7Dx%7Bh%7D/kit-de-ferramentas-com-126-pecas-bom-3907-bomvink-bomder/new1983/001c3eda655b11efb6844201ac18501b/0d0ed1926b10e43c0c649ad728c8e2ae.jpeg",
  "Porta Utensílios de Cozinha de Madeira e Plástico":"https://dilka.xcdn.nl/dilka/images/catalog/product/44110125_2.jpg?f=rs%3Afit%3A1200%3A1200%2Fg%3Ace&s=2d2d",
  "Liquidificador Mondial Turbo Power L-99 550W":"https://lojamondial.vtexassets.com/arquivos/ids/161548/L-99-FB---Foto-02.jpg?v=638875936802000000",
  "Sanduicheira Grill Oliver Home 3 em 1 Brunch Time Antiaderente":"https://media.falabella.com/falabellaPE/146160653_01/w%3D1500%2Ch%3D1500%2Cfit%3Dcover",
  "Kit 60 Pregadores de Madeira Roupa Águia Branca":"https://down-br.img.susercontent.com/file/sg-11134201-22110-ofqbc2l6nqjv51",
  "Kit Lixeira Inox 3L e Escova Sanitária Inox para Banheiro":"https://images.tcdn.com.br/img/img_prod/475237/kit_lixeira_3_litros_inox_escova_sanitaria_inox_para_limpeza_banheiro_cesto_de_lixo_balde_removivel__10003229_1_6fd53d9ebdfa928d5dfe95b67044fa65.jpg",
  "Kit Cozinha Descascador Amassador de Batatas Espremedor Limão Alho Aço Inox":"https://elislusheglow.com.br/cdn/shop/files/IMG-6502.jpg?v=1774223124",
  "Jogo de panelas":"https://www.silampos.pt/fotos/produtos/pop_632122WR0550_1.jpg"
  ,"Liquidificador":"https://lojamondial.vtexassets.com/arquivos/ids/161548/L-99-FB---Foto-02.jpg?v=638875936802000000"
  ,"Cafeteira elétrica":"https://friopecas.vtexassets.com/arquivos/ids/226402/CP30.jpg?format=auto&height=350&quality=80&width=350"
  ,"Mini Processador de Alimentos Manual Triturador de Alho 500ml com 3 Lâminas de Aço Inox":"img/foto-mini-processador.png"
  ,"Churrasqueira Elétrica Britânia Menos Fumaça Preta":"img/foto-churrasqueira.png"
  ,"Escorredor de Louça 13 Pratos 2 Andares com Porta-Talheres e Copos":"img/foto-escorredor-louca.png"
  ,"Liquidificador Mondial Turbo Power L-99 550W":"img/foto-liquidificador-mondial.png"
});
const imgHtml=g=>{const src=webImages[g.name]||g.image_url;if(!src)return "🎁";return src.startsWith("emoji:")?esc(src.slice(6)):`<img src="${esc(src)}" alt="${esc(g.name)}" loading="lazy" onerror="this.onerror=null;this.src='img/gift-default.svg'">`};
function render(){
  const q=busca.value.toLowerCase().trim(),c=cat.value;
  const l=gifts.filter(g=>(!c||g.category===c)&&(!q||(g.name+" "+(g.description||"")).toLowerCase().includes(q)));
  if(!l.length){grade.innerHTML='<p>Nenhum presente encontrado. Tente outra busca ou categoria.</p>';return}
  grade.innerHTML=l.map((g,i)=>`<article class="gift ${g.reserved?"reservado":""}" style="--i:${Math.min(i,9)}"><div class="img" aria-hidden="true">${imgHtml(g)}</div><small>${esc(g.category)}</small><h3>${esc(g.name)}</h3>${g.description?`<p>${esc(g.description)}</p>`:""}<span class="status">${g.reserved?"PRESENTE RESERVADO":"DISPONÍVEL"}</span><button class="btn sm" data-id="${g.id}" ${g.reserved?"disabled":""}>${g.reserved?"RESERVADO":"RESERVAR PRESENTE"}</button></article>`).join("");
}
async function carregar(){
  if(!sb){grade.innerHTML="";return showMsg(msg,"err","As sugestões de presente estarão disponíveis em breve.")}
  const {data,error}=await sb.rpc("list_gifts");
  if(error){grade.innerHTML="";return showMsg(msg,"err","Não foi possível carregar os presentes. Tente novamente.")}
  gifts=data; render();
}
grade.addEventListener("click",e=>{const b=e.target.closest("button[data-id]");if(!b)return;atual=gifts.find(g=>g.id===b.dataset.id);document.getElementById("ritem").textContent=atual.name;dlg.showModal();document.getElementById("rnome").focus()});
document.getElementById("rcancel").onclick=()=>dlg.close();
document.getElementById("rform").addEventListener("submit",async e=>{
  e.preventDefault(); if(enviando)return;
  const nome=document.getElementById("rnome").value.replace(/\s+/g," ").trim();
  if(nome.split(" ").length<2||nome.length<5)return alert("Informe nome e sobrenome.");
  enviando=true;const ok=document.getElementById("rok");ok.disabled=true;
  const {data,error}=await sb.rpc("reserve_gift",{p_gift_id:atual.id,p_name:nome});
  enviando=false;ok.disabled=false;dlg.close();document.getElementById("rform").reset();
  if(error)showMsg(msg,"err","Não foi possível reservar agora. Tente novamente.");
  else if(data==="ok")showMsg(msg,"ok","Presente reservado com sucesso! Obrigado!");
  else if(data==="already_reserved")showMsg(msg,"err","Esse presente acabou de ser reservado por outra pessoa. Escolha outro item.");
  else showMsg(msg,"err","Dados inválidos. Confira o nome informado.");
  carregar();
});
busca.oninput=render;cat.onchange=render;carregar();
