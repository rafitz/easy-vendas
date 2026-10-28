/* ---------- Telas do consumidor ---------- */
const V={},AFTER={};
V.home=()=>`<div class="wrap homec">
  <section class="hstart"><h1>O que você procura?</h1>
   <form class="bigsearch" data-search role="search">${ic('search',22)}<input name="q" placeholder="Buscar produtos ou lojas" aria-label="Buscar produtos ou lojas" autocomplete="off"><button class="btn primary">Buscar</button></form>
   <button class="locmini" data-act="loc" aria-label="Cidade: ${esc(S.loc)}. Alterar">${ic('pin',15)}${esc(S.loc.split(',')[0])}</button></section>
  <section class="hsec"><h2>Categorias</h2>
   <div class="cat4">${CATS.slice(0,4).map(([c,i])=>`<button class="catpill" data-act="cat" data-cat="${c}">${ic(i,24)}<span>${c}</span></button>`).join('')}</div>
   <button class="link allcats" data-go="categorias">Ver todas as categorias ${ic('chev',16)}</button></section>
  <section class="hsec"><h2>Perto de você</h2><p class="muted">Produtos disponíveis em lojas próximas</p>
   <div class="grid two" id="nearGrid">${skel(2)}</div></section>
</div>`;
AFTER.home=()=>{const near=live().filter(p=>p.qty>0).sort((a,b)=>dist(a)-dist(b)||b.views-a.views).slice(0,2);fillLater('#nearGrid',near.map(pcard).join(''),450)};

V.busca=()=>{
  const q=S.params.q||'';
  const title=q?`Resultados para “${esc(q)}”`:S.f.cats.length===1?esc(S.f.cats[0]):'Produtos perto de você';
  return `<div class="wrap"><div class="phead">
    <form class="sbar" data-search role="search">${ic('search',20)}<input name="q" value="${esc(q)}" placeholder="Buscar produtos ou lojas" aria-label="Buscar" autocomplete="off"><button class="btn primary sm">Buscar</button></form>
    <h1 style="margin-top:22px">${title}</h1><p id="rcount">&nbsp;</p></div>
   <div id="storestrip"></div>
   <div class="rbar"><button class="btn outline" data-act="openFilters">${ic('filter',18)}Filtros<i class="ncount" id="fcount"></i></button>
    <span class="sortbtn"><select id="f-sort" aria-label="Ordenar resultados">${[['proximos','Mais próximos'],['menor','Menor preço'],['maior','Maior preço'],['relevantes','Mais procurados']].map(([v,l])=>`<option value="${v}" ${S.f.sort===v?'selected':''}>${l}</option>`).join('')}</select>${ic('down',16)}</span></div>
   <aside class="filters" id="filters" aria-label="Filtros">${filtersHTML(search(q))}</aside>
   <div class="grid" id="results">${skel(8)}</div></div>`;
};
AFTER.busca=()=>{
  const q=S.params.q||'',t=tokens(q);
  if(t.length){const ms=STORES.filter(s=>t.some(x=>norm(s.name+' '+s.cat).includes(x.replace(/s$/,''))));
    if(ms.length)$('#storestrip').innerHTML=`<div class="storestrip">${ms.map(s=>`<div class="storepill" data-go="loja:${s.id}">${logo(s,'sm')}<div><b>${s.name}</b><small>${s.cat} · ${km(s.dist)}</small></div></div>`).join('')}</div>`}
  setTimeout(()=>{if(S.view==='busca')renderResults()},450);
};
function filtersHTML(base){
  const f=S.f,brands=[...new Set(base.map(p=>p.brand))].sort(),cats=[...new Set(base.map(p=>p.cat))].sort();
  const cnt=(k,v)=>base.filter(p=>p[k]===v).length;
  return `<div class="fhead"><h3>Filtros</h3><div style="display:flex;gap:4px;align-items:center"><button class="link" data-act="clearF">Limpar</button><button class="iconbtn" data-act="closeFilters" aria-label="Fechar filtros">${ic('x')}</button></div></div>
  <fieldset><legend>Distância</legend>${[[0,'Qualquer distância'],[1000,'Até 1 km'],[3000,'Até 3 km'],[5000,'Até 5 km'],[10000,'Até 10 km']].map(([v,l])=>`<label class="opt"><input type="radio" name="dist" value="${v}" ${f.dist==v?'checked':''}><span>${l}</span></label>`).join('')}</fieldset>
  <fieldset><legend>Disponibilidade</legend><label class="opt"><input type="checkbox" name="avail" ${f.avail?'checked':''}><span>Disponível agora</span></label><label class="opt"><input type="checkbox" name="promo" ${f.promo?'checked':''}><span>Em promoção</span></label></fieldset>
  <fieldset><legend>Preço</legend><div class="prow"><input id="f-min" type="number" min="0" inputmode="decimal" placeholder="R$ mín." value="${f.min}" aria-label="Preço mínimo"><span class="muted">–</span><input id="f-max" type="number" min="0" inputmode="decimal" placeholder="R$ máx." value="${f.max}" aria-label="Preço máximo"></div></fieldset>
  <details class="fdet" ${f.cats.length?'open':''}><summary>Categoria</summary>${cats.map(c=>`<label class="opt"><input type="checkbox" name="cat" value="${c}" ${f.cats.includes(c)?'checked':''}><span>${c}</span><span class="n">${cnt('cat',c)}</span></label>`).join('')||'<p class="muted">—</p>'}</details>
  <details class="fdet" ${f.brands.length?'open':''}><summary>Marca</summary>${brands.map(b=>`<label class="opt"><input type="checkbox" name="brand" value="${esc(b)}" ${f.brands.includes(b)?'checked':''}><span>${esc(b)}</span><span class="n">${cnt('brand',b)}</span></label>`).join('')}</details>
  <button class="btn primary lg block" data-act="closeFilters" style="margin-top:12px" id="fapply">Ver resultados</button>`;
}
function readF(){
  const b=$('#filters');if(!b)return;const f=S.f;
  f.dist=+(b.querySelector('[name=dist]:checked')?.value||0);
  f.min=$('#f-min').value;f.max=$('#f-max').value;
  f.avail=b.querySelector('[name=avail]').checked;f.promo=b.querySelector('[name=promo]').checked;
  f.cats=[...b.querySelectorAll('[name=cat]:checked')].map(x=>x.value);
  f.brands=[...b.querySelectorAll('[name=brand]:checked')].map(x=>x.value);
}
function renderResults(){
  const q=S.params.q||'',r=applyF(search(q)),el=$('#results');if(!el)return;
  $('#rcount').innerHTML=r.length?`<b class="num">${r.length}</b> ${r.length===1?'produto encontrado':'produtos encontrados'}`:'Nenhum produto encontrado com esses filtros.';
  const a=activeF();$('#fcount').textContent=a||'';
  const fa=$('#fapply');if(fa)fa.textContent=`Ver ${r.length} resultados`;
  el.innerHTML=r.length?r.map(pcard).join(''):`<div class="empty" style="grid-column:1/-1"><div class="eic">${ic('search',28)}</div><h3>Não encontramos “${esc(q||'esse produto')}” por perto</h3><p>Tente outro termo, aumente a distância ou limpe os filtros.</p><div class="pop" style="justify-content:center">${activeF()?`<button class="btn primary sm" data-act="clearF">Limpar filtros</button>`:''}${['Tênis','Perfume','Presente','Celular'].map(t=>`<button class="chip" data-act="q" data-q="${t}">${t}</button>`).join('')}</div></div>`;
}

V.produto=()=>{
  const p=pr(S.params.id)||PRODUCTS[0],s=st(p.store),[k,l]=stockOf(p);
  S.sel={img:0,size:p.sizes.length===1?p.sizes[0]:'',color:p.colors.length===1?p.colors[0]:'',qty:1,pid:p.id};
  const others=live().filter(x=>x.id!==p.id&&x.sub===p.sub&&x.cat===p.cat).sort((a,b)=>ep(a)-ep(b)).slice(0,3);
  const minP=Math.min(ep(p),...others.map(ep)),f=ent(s);
  return `<div class="wrap"><div class="phead" style="padding-bottom:20px"><nav class="crumbs" aria-label="Você está em"><a href="#" class="cback" data-act="back">${ic('back',16)}Voltar</a><span class="csep"></span><a href="#" data-go="home">Início</a>${ic('chev',14)}<a href="#" data-act="cat" data-cat="${p.cat}">${p.cat}</a>${ic('chev',14)}<span class="cur">${esc(p.name)}</span></nav></div>
  <div class="prod">
   <div class="gal"><div class="thumbs">${[0,1,2,3].map(i=>`<button class="${i===0?'on':''}" data-act="img" data-i="${i}" aria-label="Foto ${i+1}">${pimg(p,i)}</button>`).join('')}</div>
    <div class="gmain" id="gmain">${pimg(p,0)}${p.promo?`<span class="disc" style="font-size:14px">-${off(p)}%</span>`:''}</div></div>
   <div class="pinfo">
    <span class="brand">${esc(p.brand)} · ${p.sub}</span>
    <h1>${esc(p.name)}</h1>
    <div class="price">${brl(ep(p))}</div>
    ${p.promo?`<div class="was big"><s>${brl(p.price)}</s><span class="offt">${off(p)}% OFF</span><span>${p.pe||''}</span></div>`:''}
    <div class="quick"><span class="dist">${ic('pin',18)}${km(s.dist)}</span><span class="muted">${ic('walk',18)}${Math.max(3,Math.round(s.dist/80))} min a pé</span><span class="stock ${k}">${l}</span></div>
    ${p.sizes.length?`<div class="vgroup" id="vg-size"><div class="vl">Tamanho: <span id="vsize">${S.sel.size||'escolha abaixo'}</span></div><div class="vopts">${p.sizes.map(z=>`<button class="vopt ${z===S.sel.size?'on':''}" data-act="size" data-v="${z}">${z}</button>`).join('')}</div><p class="verr">Escolha um tamanho.</p></div>`:''}
    ${p.colors.length?`<div class="vgroup" id="vg-color"><div class="vl">Cor: <span id="vcolor">${S.sel.color||'escolha abaixo'}</span></div><div class="vopts">${p.colors.map(c=>`<button class="vopt ${c===S.sel.color?'on':''}" data-act="color" data-v="${c}"><i class="sw" style="background:${C[c]||'#ccc'}"></i>${c}</button>`).join('')}</div><p class="verr">Escolha uma cor.</p></div>`:''}
    ${p.qty>0?`<div class="vgroup"><div class="vl">Quantidade</div><div class="stepper big"><button data-act="pqty" data-d="-1" aria-label="Diminuir">−</button><span id="pqty">1</span><button data-act="pqty" data-d="1" aria-label="Aumentar">+</button></div></div>`:''}
    <button class="btn primary lg block addcta" data-act="addcur" ${p.qty<=0?'disabled':''}>${ic('cart',20)}${p.qty<=0?'Esgotado nesta loja':'Adicionar ao carrinho'}</button>
    <div class="ctarow"><button class="btn wa lg" data-act="wa">${ic('wa',20)}WhatsApp</button><button class="btn outline lg" data-act="route">${ic('nav',19)}Como chegar</button></div>
    <div class="nopay">${ic('truck',16)}<span>${f?`Retire grátis na loja ou receba em casa por ${brl(f)}.`:'Disponível para retirada na loja.'}</span></div>
    <div class="sellcard">${logo(s)}<div class="si"><small>Vendido por</small><b>${s.name}</b>
      <div class="srow"><span class="rate">${ic('star',14)}${rt(s)}</span><span class="muted">(${s.reviews})</span><span class="${s.open?'open':'closed'}">${s.open?'Aberto agora':'Fechado agora'}</span><span class="dist">${ic('pin',14)}${km(s.dist)}</span></div>
      <small>${s.addr}</small></div><button class="btn outline sm" data-go="loja:${s.id}">Ver loja</button></div>
    <details class="desc"><summary>Ver detalhes do produto</summary><p>${p.d}</p><p class="muted">Marca: ${esc(p.brand)} · Categoria: ${p.cat}</p></details>
   </div></div>
  ${others.length?`<section class="sec"><div class="sec-h"><div><h2>Compare perto de você</h2><p>${p.sub} em outras lojas da cidade, do menor para o maior preço.</p></div></div>
   <div class="cmp">${[p,...others].sort((a,b)=>ep(a)-ep(b)).map(x=>{const xs=st(x.store);return `<div class="cmprow" data-go="produto:${x.id}" ${x.id===p.id?'style="background:var(--blue-50)"':''}>${pimg(x)}<div class="ci"><b>${esc(x.name)}${x.id===p.id?' <span class="tg blue">Você está vendo</span>':''}</b><small>${xs.name} · <span class="dist">${ic('pin',12)}${km(xs.dist)}</span></small></div><div class="cp">${ep(x)===minP?'<span class="best">Menor preço</span>':''}${brl(ep(x))}</div>${ic('chev',16)}</div>`}).join('')}</div></section>`:''}
  </div>`;
};

V.loja=()=>{
  const s=st(S.params.id)||STORES[0],ps=live().filter(p=>p.store===s.id);
  const subs=[...new Set(ps.map(p=>p.sub))];
  S.ltab=S.ltab&&S.ltab.s===s.id?S.ltab:{s:s.id,t:'Todos'};
  const maps='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(s.addr+', '+CITY);
  return `<div class="wrap"><div class="sbanner" style="--h:${s.hue}"></div>
   <div class="shead">${logo(s,'lg')}<div class="si"><p class="muted" style="font-size:15px;margin-bottom:2px">${s.cat}</p><h1>${s.name}</h1>
    <div class="srow" style="font-size:14px"><span class="rate">${ic('star',15)}${rt(s)}</span><span class="muted">${s.reviews} avaliações</span><span class="${s.open?'open':'closed'}">${s.open?'Aberta agora':'Fechada agora'}</span><span class="dist">${ic('pin',14)}${km(s.dist)} de você</span></div></div>
    <div class="acts"><button class="btn wa" data-act="wastore" data-id="${s.id}">${ic('wa',18)}WhatsApp</button><button class="btn outline" data-act="route" data-id="${s.id}">${ic('nav',17)}Como chegar</button></div></div>
   <div class="sgrid"><section>
     <p style="color:var(--muted);margin-bottom:20px;max-width:640px">${s.desc}</p>
     <div class="tabs" role="tablist">${['Todos',...subs,'Promoções'].map(t=>`<button class="chip ${S.ltab.t===t?'on':''}" data-act="ltab" data-t="${t}">${t}<span class="n">${t==='Todos'?ps.length:t==='Promoções'?ps.filter(p=>p.promo).length:ps.filter(p=>p.sub===t).length}</span></button>`).join('')}</div>
     <div class="grid g3" id="lgrid">${skel(3)}</div></section>
    <aside class="infocard">
     <div class="irow">${ic('pin',18)}<div><small>Endereço</small>${s.addr}<br>${CITY}</div></div>
     <div class="irow">${ic('clock',18)}<div><small>Horário</small>${s.hours}</div></div>
     <div class="irow">${ic('wa',18)}<div><small>WhatsApp</small><span class="num">${s.wa}</span></div></div>
     <div class="irow">${ic('insta',18)}<div><small>Instagram</small>${s.ig}</div></div>
     <div class="irow">${ic('map',18)}<div><small>Google Maps</small><a class="link" href="${maps}" target="_blank" rel="noopener">Abrir no mapa ${ic('arrow',14)}</a></div></div>
    </aside></div></div>`;
};
function lojaGrid(){const s=S.ltab.s,t=S.ltab.t;const ps=live().filter(p=>p.store===s&&(t==='Todos'||(t==='Promoções'?p.promo:p.sub===t)));return ps.length?ps.map(pcard).join(''):`<div class="empty" style="grid-column:1/-1"><p>Nenhum produto nesta seção.</p></div>`}
AFTER.loja=()=>fillLater('#lgrid',lojaGrid(),400);

V.promocoes=()=>{
  S.pcat=S.pcat||'Todas';S.psort=S.psort||'desconto';
  const all=live().filter(p=>p.promo),cnt=c=>all.filter(p=>p.cat===c).length;
  const cats=['Todas',...[...new Set(all.map(p=>p.cat))].sort((a,b)=>cnt(b)-cnt(a))];
  let shown=S.pmoreCats?cats:cats.slice(0,4);
  if(!shown.includes(S.pcat))shown=[...shown,S.pcat];
  const list=all.filter(p=>S.pcat==='Todas'||p.cat===S.pcat).sort(S.psort==='desconto'?(a,b)=>off(b)-off(a):(a,b)=>dist(a)-dist(b));
  return `<div class="wrap"><div class="phead"><h1>Ofertas perto de você</h1><p>${all.length} ofertas disponíveis perto de você.</p></div>
   <div class="otop"><div class="tabs">${shown.map(c=>`<button class="chip ${S.pcat===c?'on':''}" data-act="pcat" data-c="${c}">${c}</button>`).join('')}${cats.length>4?`<button class="chip" data-act="pcatmore" aria-expanded="${!!S.pmoreCats}">${S.pmoreCats?'Menos':'Mais'} ${ic(S.pmoreCats?'back':'down',14)}</button>`:''}</div>
    <span class="sortbtn"><select id="p-sort" aria-label="Ordenar ofertas"><option value="desconto" ${S.psort==='desconto'?'selected':''}>Ordenar: Maior desconto</option><option value="perto" ${S.psort==='perto'?'selected':''}>Ordenar: Mais perto</option></select>${ic('down',16)}</span></div>
   <div class="pgrid">${list.map(promoCard).join('')}</div></div>`;
};
V.lojas=()=>{
  S.scat=S.scat||'Todas';const cats=['Todas',...new Set(STORES.map(s=>s.cat))];
  const list=STORES.filter(s=>S.scat==='Todas'||s.cat===S.scat).sort((a,b)=>a.dist-b.dist);
  return `<div class="wrap"><div class="phead"><h1>Explorar lojas</h1><p>${STORES.length} lojas em ${CITY}, da mais próxima para a mais distante.</p></div>
   <div class="tabs">${cats.map(c=>`<button class="chip ${S.scat===c?'on':''}" data-act="scat" data-c="${c}">${c}</button>`).join('')}</div>
   <div class="stores">${list.map(scard).join('')}</div></div>`;
};
V.categorias=()=>`<div class="wrap"><div class="phead"><h1>Categorias</h1><p>Escolha uma categoria e veja o que as lojas perto de você têm.</p></div>
  <div class="stores">${CATS.map(([c,i])=>{const n=live().filter(p=>p.cat===c).length;const sn=new Set(live().filter(p=>p.cat===c).map(p=>p.store)).size;return `<button class="card" style="text-align:left;display:flex;flex-direction:column;gap:12px;cursor:pointer" ${n?`data-act="cat" data-cat="${c}"`:'data-act="soon"'}><span class="cbub" style="width:52px;height:52px;border-radius:14px;background:var(--blue-50);color:var(--blue);display:grid;place-items:center">${ic(i,24)}</span><span><b style="font-size:16px;display:block">${c}</b><span class="muted" style="font-size:13px">${n?`${n} produtos · ${sn} ${sn===1?'loja':'lojas'}`:'Em breve'}</span></span></button>`}).join('')}</div></div>`;

V.login=()=>{
  const m=S.params.id;
  if(m==='lojista')S.ltype='lojista';else if(m==='criar'||m==='entrar'){S.ltype='consumidor';S.lmode=m}
  S.ltype=S.ltype||'consumidor';S.lmode=S.lmode||'entrar';S.params.id=null;
  const l=S.ltype==='lojista',cr=S.lmode==='criar';
  const nome=`<div class="field"><label for="a-nome">Nome</label><input id="a-nome" autocomplete="name" placeholder="Seu nome completo"><span class="err">Informe seu nome.</span></div>`;
  return `<div class="wrap"><div class="auth">
   <h1>${l?'Cadastre sua loja':cr?'Criar conta':'Entrar'}</h1><p class="muted">${l?'Em poucos minutos seus produtos aparecem para quem procura perto de você.':'Para acompanhar seus pedidos.'}</p>
   <div class="seg" role="tablist"><button class="${!l?'on':''}" data-act="ltype" data-t="consumidor">${ic('user',16)}Sou consumidor</button><button class="${l?'on':''}" data-act="ltype" data-t="lojista">${ic('store',16)}Sou lojista</button></div>
   <form class="form" id="authf" novalidate>
    ${l||cr?nome:''}
    <div class="field"><label for="a-mail">E-mail</label><input id="a-mail" type="email" autocomplete="email" placeholder="voce@email.com"><span class="err">Informe um e-mail válido.</span></div>
    ${l?`<div class="field"><label for="a-tel">Telefone / WhatsApp</label><input id="a-tel" inputmode="tel" data-mask="tel" placeholder="(35) 99999-9999"><span class="hint">É por este número que os clientes vão falar com você.</span><span class="err">Informe o telefone com DDD.</span></div>`
     :`<div class="field"><label for="a-pass">Senha</label><input id="a-pass" type="password" autocomplete="${cr?'new-password':'current-password'}" placeholder="${cr?'Mínimo de 6 caracteres':'Sua senha'}"><span class="err">A senha precisa ter pelo menos 6 caracteres.</span></div>`}
    <button class="btn primary lg block">${l?'Começar cadastro da loja':cr?'Criar conta':'Entrar'}</button>
    ${l?'':`<p class="swap">${cr?'Já tem conta?':'Ainda não tem conta?'} <button type="button" class="link" data-act="lmode">${cr?'Entrar':'Criar conta'}</button></p>`}
    <p class="muted" style="font-size:13.5px;text-align:center">${l?'São 4 passos simples, cerca de 5 minutos. ':''}Protótipo: nenhum dado é enviado.</p>
   </form></div></div>`;
};
V.perfil=()=>{
  const u=S.user,no=S.orders.filter(o=>o.mine).length;
  return `<div class="wrap homec"><div class="phead" style="padding-top:0">${u?`<div style="display:flex;align-items:center;gap:16px"><div class="av" style="width:60px;height:60px;font-size:22px">${esc(u.name[0].toUpperCase())}</div><div><h1>Olá, ${esc(u.name.split(' ')[0])}</h1><p>${esc(S.loc)}</p></div></div>`:'<h1>Perfil</h1>'}</div>
  <div class="stack">
   ${u?'':`<div class="card pcta"><div><b>Entre na sua conta</b><p class="muted">Para acompanhar seus pedidos.</p></div><div class="pcta-a"><button class="btn primary lg" data-go="login:entrar">Entrar</button><button class="link" style="padding:8px" data-go="login:criar">Criar conta</button></div></div>`}
   <section><h2 class="ptitle">Para você</h2>
    <div class="card plinks"><button data-go="pedidos">${ic('receipt',20)}<span>Meus pedidos${no?` <small class="muted">(${no})</small>`:''}</span>${ic('chev',18)}</button></div></section>
   <section><h2 class="ptitle">Configurações</h2><div class="card">
    <div class="togrow" style="border-top:0;padding-top:0"><div><b>Aumentar texto</b><small>Deixa textos e botões maiores em todo o site</small></div><label class="switch"><input type="checkbox" ${S.big?'checked':''} data-act="bigtoggle" aria-label="Aumentar texto"><span></span></label></div>
    <button class="togrow linkrow" data-act="loc"><div><b>Sua cidade</b><small>${esc(S.loc)}</small><small>Usada para mostrar lojas próximas</small></div>${ic('chev',18)}</button></div></section>
   <section><h2 class="ptitle">Para lojistas</h2><div class="card mcard"><span class="ti">${ic('store',22)}</span><div class="tt"><b>Tem uma loja na cidade?</b><p class="muted">Cadastre grátis e receba clientes pelo WhatsApp.</p>
    <div class="mc-acts"><button class="btn outline" data-go="login:lojista">Cadastrar minha loja</button><button class="link" data-go="painel">Painel do lojista</button></div></div></div></section>
   ${u?`<button class="btn ghost lg block danger-t" data-act="logout">${ic('logout',20)}Sair da conta</button>`:''}
  </div></div>`;
};
V.paralojistas=()=>`<div class="wrap"><div class="phead"><div class="crumbs"><a href="#" data-go="home">Início</a>${ic('chev',12)}<span>Para lojistas</span></div><h1>Seu estoque aparece para quem está procurando, perto da sua loja.</h1><p style="max-width:640px">A Easy Vendas é o shopping virtual da cidade. O cliente pesquisa, encontra seu produto, fala com você pelo WhatsApp e vai até a loja. Sem comissão por venda, sem logística.</p></div>
  <div class="steps" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">${[['store','Crie sua loja','Nome, endereço, horário e WhatsApp. Leva menos de 5 minutos.'],['box','Cadastre produtos','Foto, preço e estoque. Edite quando quiser pelo celular.'],['wa','Receba contatos','Clientes chegam com a mensagem pronta citando o produto e o preço.'],['chart','Acompanhe o interesse','Veja quantas pessoas viram, chamaram e reservaram.']].map(([i,t,d])=>`<div class="step"><div class="sn"><i>${ic(i,16)}</i></div><b>${t}</b><p>${d}</p></div>`).join('')}</div>
  <section class="mband"><div class="mband-in"><div><h2>Comece grátis</h2><p>No período de lançamento, lojas de ${CITY.split(',')[0]} anunciam sem custo.</p><div class="acts"><button class="btn white lg" data-go="login:lojista">Cadastrar minha loja</button><button class="btn line-w lg" data-go="painel">Painel do lojista</button></div></div>
  <div class="mstats"><div class="mstat"><b>5 min</b><span>para publicar a loja</span></div><div class="mstat"><b>R$ 0</b><span>de comissão</span></div><div class="mstat"><b>WhatsApp</b><span>como canal de venda</span></div><div class="mstat"><b>Local</b><span>clientes a poucos km</span></div></div></div></section></div>`;

