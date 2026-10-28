/* ---------- Carrinho e pedidos ---------- */
const groups=()=>{const g={};S.cart.forEach(i=>{const p=pr(i.pid);if(p)(g[p.store]=g[p.store]||[]).push(i)});return Object.entries(g).map(([sid,items])=>({s:st(sid),items}))};
const itemsTotal=items=>items.reduce((a,i)=>a+ep(pr(i.pid))*i.qty,0);
const shipOf=s=>S.ship[s.id]==='entrega'&&ent(s)?'entrega':'retirada';
const feeOf=s=>shipOf(s)==='entrega'?ent(s):0;
function storeHead(s){const f=ent(s);return `<div class="cshead">${logo(s,'sm')}<div><b>${esc(s.name)}</b><span class="dist">${ic('pin',14)}${km(s.dist)}</span></div></div>
 <div class="avail"><span>Disponível para:</span><span class="ok">${ic('check',16)}Retirada na loja</span>${f?`<span class="ok">${ic('check',16)}Entrega local</span>`:''}</div>`}
function shipBox(s){
  const sh=shipOf(s),f=ent(s),[rua,bairro]=s.addr.split(' – ');
  return `<div class="field"><span class="lb">Como você quer receber?</span><div class="hopts" role="radiogroup">
   <button type="button" class="hopt ${sh==='retirada'?'on':''}" data-act="ship" data-s="${s.id}" data-v="retirada" role="radio" aria-checked="${sh==='retirada'}"><i class="rdot"></i><span><b>Retirar na loja</b><small>Grátis</small></span></button>
   <button type="button" class="hopt ${sh==='entrega'?'on':''}" ${f?'':'disabled'} data-act="ship" data-s="${s.id}" data-v="entrega" role="radio" aria-checked="${sh==='entrega'}"><i class="rdot"></i><span><b>Receber em casa</b><small>${f?`Entrega ${brl(f)} · ${etaOf(s)}`:'Esta loja ainda não faz entrega'}</small></span></button></div></div>
  ${sh==='retirada'?`<div class="shipinfo">${ic('store',20)}<div><b>${esc(s.name)}</b><span>${esc(rua)}</span>${bairro?`<span>${esc(bairro)}</span>`:''}<span>São Sebastião do Paraíso - MG</span><span class="hr">${ic('clock',15)}${hojeAte(s)}</span><p class="muted">A loja confirmará quando o pedido estiver pronto para retirada.</p></div></div>`
  :`<div class="shipinfo">${ic('home',20)}<div><b>Entregar em</b><span>${esc(S.addr.rua)}${S.addr.comp?' ('+esc(S.addr.comp)+')':''}</span><span>${esc(S.addr.bairro)}</span><button type="button" class="link" data-act="addr" style="align-self:flex-start;padding:6px 0">Alterar endereço</button><div class="shipfee"><span>Taxa de entrega: <b>${brl(f)}</b></span><span>Estimativa: <b>${etaOf(s)}</b></span></div></div></div>`}`;
}
function sumBox(s,items){const sub=itemsTotal(items),f=feeOf(s);return `<div class="sumbox"><div><span>Subtotal dos produtos</span><span>${brl(sub)}</span></div><div><span>Entrega</span><span>${f?brl(f):'Grátis'}</span></div><div class="tot"><span>Total</span><span>${brl(sub+f)}</span></div></div>`}
function cartItem(i){const p=pr(i.pid);return `<div class="citem">${pimg(p)}<div class="ci-b"><b>${esc(p.name)}</b>${varTxt(i)?`<small>${varTxt(i)}</small>`:''}<span class="ci-p">${brl(ep(p))}</span>
  <div class="ci-q"><span class="muted">Quantidade:</span><div class="stepper"><button data-act="cq" data-k="${esc(i.key)}" data-d="-1" aria-label="Diminuir">−</button><span>${i.qty}</span><button data-act="cq" data-k="${esc(i.key)}" data-d="1" aria-label="Aumentar">+</button></div></div>
  <div class="ci-s"><span>Subtotal: <b>${brl(ep(p)*i.qty)}</b></span><button class="link rm" data-act="crm" data-k="${esc(i.key)}">Remover</button></div></div></div>`}
V.carrinho=()=>{
  const g=groups(),n=cartCount();
  if(!g.length)return `<div class="wrap homec"><div class="phead" style="padding-top:0"><h1>Seu carrinho</h1></div><div class="empty"><div class="eic">${ic('cart',28)}</div><h3>Seu carrinho está vazio</h3><p>Encontre produtos nas lojas perto de você e toque em “Adicionar”.</p><button class="btn primary lg" data-go="busca">Buscar produtos</button></div></div>`;
  return `<div class="wrap homec"><div class="phead" style="padding-top:0"><h1>Seu carrinho</h1><p>${n} ${n===1?'produto':'produtos'} de ${g.length} ${g.length===1?'loja':'lojas'}</p></div>
  ${g.length>1?`<div class="note multi">${ic('info',20)}<div><b>Cada loja é um pedido separado.</b><span>Você finaliza, recebe e paga cada loja separadamente.</span><ul>${g.map(({s,items},i)=>`<li><span>Pedido ${i+1} · ${esc(s.name)}</span><b>${brl(itemsTotal(items)+feeOf(s))}</b></li>`).join('')}</ul></div></div>`:''}
  <div class="stack">${g.map(({s,items},i)=>`<section class="card cstore">${g.length>1?`<span class="ordn">Pedido ${i+1} de ${g.length}</span>`:''}${storeHead(s)}
   <div class="citems">${items.map(cartItem).join('')}</div>${shipBox(s)}${sumBox(s,items)}
   <button class="btn primary lg block" data-go="checkout:${s.id}">Finalizar pedido nesta loja</button></section>`).join('')}</div></div>`;
};
function saveCo(){if($('#co-nome'))S.co={name:$('#co-nome').value,tel:$('#co-tel').value,mail:$('#co-mail').value}}
V.checkout=()=>{
  const s=st(S.params.id),items=s?S.cart.filter(i=>pr(i.pid)?.store===s.id):[];
  if(!items.length)return V.carrinho();
  const sh=shipOf(s),pay=S.pay[s.id]||'loja',co=S.co||{name:S.user?.name||'',tel:'',mail:''};
  const pays=[['loja',sh==='entrega'?'Pagar na entrega':'Pagar na retirada','Dinheiro, Pix ou cartão, direto com a loja'],['pix','Pix','O código aparece depois que a loja confirmar'],['cartao','Cartão','Crédito ou débito']];
  const row=i=>{const p=pr(i.pid);return `<div class="coitem">${pimg(p)}<div><b>${esc(p.name)}</b><small>${[varTxt(i),i.qty+(i.qty===1?' unidade':' unidades')].filter(Boolean).join(' · ')}</small></div><span>${brl(ep(p)*i.qty)}</span></div>`};
  return `<div class="wrap homec"><div class="phead" style="padding-top:0"><nav class="crumbs"><a href="#" class="cback" data-go="carrinho">${ic('back',16)}Voltar ao carrinho</a></nav><h1>Finalizar pedido</h1></div>
  <form id="cof" class="stack" novalidate data-s="${s.id}">
   <section class="card"><h3 class="ctit">Loja</h3>${storeHead(s)}</section>
   <section class="card"><h3 class="ctit">Produtos</h3><div class="colist">${items.map(row).join('')}</div></section>
   <section class="card"><h3 class="ctit">Entrega</h3>${shipBox(s)}</section>
   <section class="card form"><h3 class="ctit">Seus dados</h3>
    <div class="field big"><label for="co-nome">Nome</label><input id="co-nome" autocomplete="name" value="${esc(co.name)}" placeholder="Seu nome completo"><span class="err">Informe seu nome.</span></div>
    <div class="field big"><label for="co-tel">Telefone (WhatsApp)</label><input id="co-tel" inputmode="tel" data-mask="tel" autocomplete="tel" value="${esc(co.tel)}" placeholder="(35) 99999-9999"><span class="hint">A loja usa este número para falar sobre o pedido.</span><span class="err">Informe o telefone com DDD.</span></div>
    <div class="field big"><label for="co-mail">E-mail <small class="muted">(opcional)</small></label><input id="co-mail" type="email" autocomplete="email" value="${esc(co.mail)}" placeholder="voce@email.com"></div></section>
   <section class="card"><h3 class="ctit">Pagamento</h3><div class="hopts" role="radiogroup">${pays.map(([k,t,d])=>`<button type="button" class="hopt ${pay===k?'on':''}" data-act="pay" data-s="${s.id}" data-v="${k}" role="radio" aria-checked="${pay===k}"><i class="rdot"></i><span><b>${t}</b><small>${d}</small></span></button>`).join('')}</div>
    <div class="note" style="margin-top:12px">${ic('info',18)}<span>Pagamento simulado no protótipo. Nenhum valor é cobrado.</span></div></section>
   <section class="card">${sumBox(s,items)}<button class="btn primary lg block" style="margin-top:16px">${ic('check',20)}Confirmar pedido</button></section>
  </form></div>`;
};
V.pedidos=()=>{
  const mine=S.orders.filter(o=>o.mine);
  return `<div class="wrap homec"><div class="phead" style="padding-top:0"><nav class="crumbs"><a href="#" class="cback" data-go="perfil">${ic('back',16)}Perfil</a></nav><h1>Meus pedidos</h1></div>${mine.length?`<div class="stack">${mine.map(o=>{const s=st(o.store);return `<div class="card ocard"><div class="oc-h"><b>Pedido #${o.id}</b><span class="pill ${stCls(o.st)}">${o.st}</span></div><div class="oc-b">${logo(s,'sm')}<div><b>${esc(s.name)}</b><small>${oCount(o)} ${oCount(o)===1?'produto':'produtos'} · ${shipTxt(o)} · ${o.date}</small></div><span class="oc-t">${brl(oTotal(o))}</span></div><button class="btn outline block" data-go="pedido:${o.id}">Ver pedido</button></div>`}).join('')}</div>`
   :`<div class="empty"><div class="eic">${ic('receipt',28)}</div><h3>Você ainda não fez pedidos</h3><p>Quando você finalizar uma compra, ela aparece aqui.</p><button class="btn primary lg" data-go="busca">Buscar produtos</button></div>`}</div>`;
};
V.pedido=()=>{
  const o=S.orders.find(x=>x.id===S.params.id);if(!o)return V.pedidos();
  const s=st(o.store),fl=FLOW[o.ship],ix=fl.indexOf(o.st),novo=S.params.novo;
  const row=i=>{const p=pr(i.pid);return `<div class="coitem">${pimg(p)}<div><b>${esc(p.name)}</b><small>${[varTxt(i),i.qty+(i.qty===1?' unidade':' unidades')].filter(Boolean).join(' · ')}</small></div><span>${brl(i.price*i.qty)}</span></div>`};
  return `<div class="wrap homec">${novo?`<div class="success" style="padding:8px 0 20px"><div class="ok">${ic('check',38)}</div><h1 style="font-size:30px">Pedido realizado!</h1><p class="obsub">A ${esc(s.name)} vai confirmar seu pedido. Você acompanha tudo em Meus pedidos.</p></div>`:`<div class="phead" style="padding-top:0"><nav class="crumbs"><a href="#" class="cback" data-go="pedidos">${ic('back',16)}Meus pedidos</a></nav><h1>Pedido #${o.id}</h1></div>`}
  <div class="stack">
   <section class="card"><div class="okv"><div><span>Pedido</span><b>#${o.id}</b></div><div><span>Loja</span><b>${esc(s.name)}</b></div><div><span>Total</span><b class="big">${brl(oTotal(o))}</b></div><div><span>Forma</span><b>${shipTxt(o)}</b></div><div><span>Pagamento</span><b>${payTxt(o)}</b></div><div><span>Status</span><span class="pill ${stCls(o.st)}">${o.st==='Aguardando confirmação'?'Aguardando confirmação da loja':o.st}</span></div></div></section>
   ${o.st!=='Cancelado'?`<section class="card"><h3 class="ctit">Andamento</h3><ol class="tline">${fl.map((t,i)=>`<li class="${i<ix?'done':i===ix?'cur':''}"><i>${i<ix?ic('check',14):''}</i><span>${t}</span></li>`).join('')}</ol></section>`:''}
   <section class="card"><h3 class="ctit">Produtos</h3><div class="colist">${o.items.map(row).join('')}</div>
    <div class="sumbox" style="margin-top:14px"><div><span>Subtotal</span><span>${brl(oTotal(o)-o.fee)}</span></div><div><span>Entrega</span><span>${o.fee?brl(o.fee):'Grátis'}</span></div><div class="tot"><span>Total</span><span>${brl(oTotal(o))}</span></div></div></section>
   <section class="card"><h3 class="ctit">${o.ship==='entrega'?'Entrega':'Retirada'}</h3><div class="shipinfo">${ic(o.ship==='entrega'?'home':'store',20)}<div>${o.ship==='entrega'?`<b>Entregar em</b><span>${esc(o.addr)}</span><span>Estimativa: ${etaOf(s)}</span>`:`<b>${esc(s.name)}</b><span>${esc(s.addr)}</span><span>São Sebastião do Paraíso - MG</span><span class="hr">${ic('clock',15)}${hojeAte(s)}</span>`}</div></div></section>
   <section class="card"><h3 class="ctit">Contato da loja</h3><p style="margin-bottom:12px"><b>${esc(s.name)}</b> · WhatsApp <span class="num">${s.wa}</span></p><button class="btn wa lg block" data-act="waorder" data-id="${o.id}">${ic('wa',20)}Chamar loja no WhatsApp</button></section>
   ${novo?`<div class="obnav col"><button class="btn primary lg block" data-go="pedidos">Ver meus pedidos</button><button class="btn outline lg block" data-go="home">Continuar comprando</button></div>`:''}
  </div></div>`;
};

