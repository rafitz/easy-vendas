/* ---------- Cadastro do lojista em 4 passos ---------- */
const OB_STEPS=['Sua loja','Endereço','Contato e horário','Primeiro produto'];
const HOURS=[['padrao','Comércio padrão','Seg a Sex 8h–18h · Sáb 8h–12h'],['estendido','Segunda a sábado','Seg a Sáb 9h–19h'],['outro','Outro horário','Eu escrevo o meu horário']];
const newOb=(u={})=>({step:1,owner:u.name||'',name:'',type:'',cep:'',addr:'',num:'',comp:'',wa:u.tel||'',ig:'',hours:'padrao',hoursTxt:'',p:{photo:null,name:'',price:'',has:true}});
function obTop(){return `<header class="hdr"><div class="wrap hrow"><button class="btn ghost sm hleft" data-go="home">${ic('back',18)}Sair</button><a class="logo" href="#" data-go="home" aria-label="Easy Vendas — início">${LOGO}</a><div class="hright"><button class="btn ghost sm" data-act="help" aria-label="Ajuda">${ic('wa',18)}<span class="hide-m">Ajuda</span></button></div></div></header>`}
const OB={
1:o=>`<h1>Qual é o nome da sua loja?</h1><p class="obsub">É assim que os clientes vão encontrar você.</p>
 <div class="field big"><label for="ob-name">Nome da loja</label><input id="ob-name" value="${esc(o.name)}" placeholder="Ex.: Calçados Paraíso" autocomplete="organization"><span class="err">Escreva o nome da loja.</span></div>
 <div class="field"><span class="lb">O que você vende? <small class="muted">Toque em uma opção</small></span><div class="tiles" id="ob-type" role="radiogroup">${CATS.map(([c,i])=>`<button type="button" class="tile ${o.type===c?'on':''}" data-act="obtype" data-v="${c}" role="radio" aria-checked="${o.type===c}">${ic(i,30)}<span>${c}</span></button>`).join('')}</div><span class="err">Escolha o que sua loja vende.</span></div>`,
2:o=>`<h1>Onde fica sua loja?</h1><p class="obsub">Digite o CEP e a gente preenche o endereço para você.</p>
 <div class="field big"><label for="ob-cep">CEP</label><div class="cep"><input id="ob-cep" inputmode="numeric" data-mask="cep" value="${esc(o.cep)}" placeholder="37950-000" autocomplete="postal-code"><button type="button" class="btn soft lg" data-act="obcep">${ic('search',18)}Buscar</button></div><span class="hint">Não sabe o CEP? Escreva o endereço abaixo.</span><span class="err">Digite os 8 números do CEP.</span></div>
 <div class="field big"><label for="ob-addr">Rua e bairro</label><input id="ob-addr" value="${esc(o.addr)}" placeholder="Ex.: Rua Pimenta de Pádua – Centro"><span class="hint">${CITY}</span><span class="err">Informe a rua da loja.</span></div>
 <div class="row2"><div class="field big"><label for="ob-num">Número</label><input id="ob-num" inputmode="numeric" value="${esc(o.num)}" placeholder="Ex.: 245"><span class="err">Informe o número.</span></div><div class="field big"><label for="ob-comp">Complemento <small class="muted">(opcional)</small></label><input id="ob-comp" value="${esc(o.comp)}" placeholder="Ex.: Loja 2"></div></div>
 ${o.addr?`<div class="field"><span class="lb">É aqui? <small class="muted">Se não for, toque no lugar certo do mapa</small></span><div class="map" data-act="pin" style="cursor:crosshair">${mapSVG(S.pin.x,S.pin.y,false)}</div></div>`:''}`,
3:o=>`<h1>Como os clientes falam com você?</h1><p class="obsub">Os pedidos chegam no seu painel e no seu WhatsApp.</p>
 <div class="field big"><label for="ob-wa">WhatsApp da loja</label><input id="ob-wa" inputmode="tel" data-mask="tel" value="${esc(o.wa)}" placeholder="(35) 99999-9999"><span class="hint">Já colocamos o número do seu cadastro. Pode trocar se quiser.</span><span class="err">Informe o WhatsApp com DDD.</span></div>
 <div class="field"><span class="lb">Qual o horário da loja?</span><div class="hopts" role="radiogroup">${HOURS.map(([k,t,d])=>`<button type="button" class="hopt ${o.hours===k?'on':''}" data-act="obhours" data-v="${k}" role="radio" aria-checked="${o.hours===k}"><i class="rdot"></i><span><b>${t}</b><small>${d}</small></span></button>`).join('')}</div></div>
 ${o.hours==='outro'?`<div class="field big"><label for="ob-ht">Escreva seu horário</label><input id="ob-ht" value="${esc(o.hoursTxt)}" placeholder="Ex.: Seg a Sex 7h–17h · Sáb 7h–11h"><span class="err">Escreva o horário.</span></div>`:''}
 <div class="field big"><label for="ob-ig">Instagram <small class="muted">(opcional)</small></label><input id="ob-ig" value="${esc(o.ig)}" placeholder="@sualoja"></div>`,
4:o=>`<h1>Cadastre seu primeiro produto</h1><p class="obsub">Só 3 coisas: foto, nome e preço. Se preferir, pule e faça depois.</p>
 <div class="field"><span class="lb">Foto do produto</span><label class="upl big">${o.p.photo?`<div class="uprev" style="background-image:url('${o.p.photo}')"></div><b>Trocar foto</b>`:`${ic('upload',32)}<b>Tirar foto ou escolher da galeria</b><span>Uma foto de frente, com boa luz, já basta</span>`}<input type="file" accept="image/*" data-up="obphoto" aria-label="Foto do produto"></label></div>
 <div class="field big"><label for="ob-pname">Nome do produto</label><input id="ob-pname" value="${esc(o.p.name)}" placeholder="Ex.: Tênis Olympikus preto"><span class="err">Escreva o nome do produto.</span></div>
 <div class="field big"><label for="ob-pprice">Preço</label><div class="money"><span>R$</span><input id="ob-pprice" inputmode="numeric" data-mask="money" value="${esc(o.p.price)}" placeholder="0,00" autocomplete="off"></div><span class="hint">Digite só os números. Ex.: 27990 vira R$ 279,90</span><span class="err">Informe o preço.</span></div>
 <div class="field"><span class="lb">Tem na loja agora?</span><div class="yn" role="radiogroup">${ynBtns('obhas',o.p.has)}</div></div>`
};
V.cadastro=()=>{
  const o=S.ob||(S.ob=newOb()),n=o.step;
  if(n>4)return obDone();
  return `<div class="ob"><div class="obprog"><div class="obbar" role="progressbar" aria-valuemin="1" aria-valuemax="4" aria-valuenow="${n}" aria-label="Progresso do cadastro"><i style="width:${n/4*100}%"></i></div>
   <div class="obsteps">${OB_STEPS.map((t,i)=>`<span class="${i+1<n?'done':i+1===n?'on':''}"><b>${i+1<n?ic('check',14):i+1}</b><em>${t}</em></span>`).join('')}</div></div>
   <p class="obstep">Passo ${n} de 4 · ${OB_STEPS[n-1]}</p>
   <form id="obf" class="form obform" novalidate>${OB[n](o)}
    <div class="obnav">${n>1?`<button type="button" class="btn outline lg" data-act="obback">${ic('back',18)}Voltar</button>`:''}<button class="btn primary lg">${n===4?ic('check',18)+'Publicar minha loja':'Continuar'+ic('arrow',18)}</button></div>
    ${n===4?`<button type="button" class="btn ghost lg block" data-act="obskip">Pular e cadastrar produtos depois</button>`:''}
   </form></div>`;
};
function obDone(){
  const s=st(S.newStore),p=PRODUCTS.find(x=>x.store===s.id);
  return `<div class="ob"><div class="success" style="padding-inline:0"><div class="ok">${ic('check',38)}</div><h1>Sua loja está no ar!</h1><p class="obsub">Clientes de ${CITY.split(',')[0]} já podem encontrar a ${esc(s.name)} na Easy Vendas.</p></div>
   <div class="obdone">${scard(s)}${p?pcard(p):`<div class="empty" style="padding:24px"><p>Sua loja ainda não tem produtos.</p><button class="btn soft" data-act="obstep4">${ic('plus',18)}Cadastrar o primeiro</button></div>`}</div>
   <div class="obnav col"><button class="btn primary lg block" data-go="loja:${s.id}">${ic('eye',18)}Ver minha loja como o cliente vê</button><button class="btn outline lg block" data-go="painel">Conhecer o painel do lojista</button></div>
   <p class="muted" style="text-align:center;margin-top:12px;font-size:15px">O painel mostra uma loja de exemplo com movimento, para você ver como acompanhar seus clientes.</p></div>`;
}
function saveOb(){
  const o=S.ob,v=id=>$('#'+id)?.value??'';if(!o)return;
  if($('#ob-name'))o.name=v('ob-name');
  if($('#ob-cep')){o.cep=v('ob-cep');o.addr=v('ob-addr');o.num=v('ob-num');o.comp=v('ob-comp')}
  if($('#ob-wa')){o.wa=v('ob-wa');o.ig=v('ob-ig');if($('#ob-ht'))o.hoursTxt=v('ob-ht')}
  if($('#ob-pname')){o.p.name=v('ob-pname');o.p.price=v('ob-pprice')}
}
function obFinish(withProd){
  const o=S.ob;let s=st(S.newStore);
  if(!s){const [r,b]=o.addr.split(' – '),hours=o.hours==='outro'?o.hoursTxt:HOURS.find(h=>h[0]===o.hours)[2];
    s={id:'s'+(STORES.length+1),name:o.name.trim(),cat:o.type,ini:o.name.trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase(),hue:140,dist:600,rating:0,reviews:0,addr:`${r}, ${o.num.trim()}${o.comp.trim()?' ('+o.comp.trim()+')':''}${b?' – '+b:''}`,hours,open:true,wa:o.wa,ig:o.ig||'Não informado',count:0,desc:`${o.type} em ${CITY.split(',')[0]}. Loja nova na Easy Vendas.`};
    STORES.push(s);S.newStore=s.id}
  if(withProd){const cat=o.type==='Outros'?'Presentes':o.type;PRODUCTS.unshift({id:'n'+Date.now(),name:o.p.name.trim(),brand:s.name,cat,sub:cat,store:s.id,price:money(o.p.price),qty:o.p.has?5:0,e:catEmoji[cat]||'🛍️',hue:140,views:0,sizes:[],colors:[],tags:norm(o.p.name+' '+cat),d:`Produto da ${s.name}. Fale com a loja pelo WhatsApp para mais detalhes.`,photo:o.p.photo});s.count++}
  o.step=5;
}

