/* ---------- Painel do lojista ---------- */
const ME='s1';
const PT=[['visao','Visão geral','home'],['produtos','Produtos','box'],['pedidos','Pedidos','receipt'],['promos','Promoções','tag'],['loja','Minha loja','store'],['stats','Estatísticas','chart'],['config','Configurações','gear']];
const VIEWS7=[['Qua',142],['Qui',168],['Sex',190],['Sáb',232],['Dom',155],['Seg',176],['Ter',185]];
function renderPainel(){
  const tab=S.params.id||'visao',s=st(ME),nov=myO().filter(o=>o.st==='Aguardando confirmação').length;
  const nav=PT.map(([k,l,i],j)=>`${j===5?'<div class="ptag" style="margin:18px 8px 6px">Mais opções</div>':''}<button class="${tab===k||(k==='produtos'&&tab==='novo')?'on':''}" data-go="painel:${k}">${ic(i,19)}<span>${l}</span>${k==='pedidos'&&nov?`<i class="cnt">${nov}</i>`:''}</button>`).join('');
  const pb=[['visao','home','Início'],['produtos','box','Produtos'],['pedidos','receipt','Pedidos'],['loja','store','Minha loja']];
  return `<div class="pn"><aside class="pside"><a class="logo" href="#" data-go="home">${LOGO}</a><div class="ptag">Painel do lojista</div><nav>${nav}</nav>
    <div class="pside-foot"><div class="plan"><b>Plano Lançamento</b><span class="muted">Grátis até 31/12 · produtos ilimitados</span></div><button class="btn ghost block" style="justify-content:flex-start" data-go="home">${ic('back',18)}Ver como cliente</button></div></aside>
   <div style="min-width:0"><header class="ptop"><a class="logo only-pm" href="#" data-go="home" aria-label="Easy Vendas — início">${LOGO.replace('<span>','<span class="hide-m">')}</a>
     <button class="btn outline sm hide-pm" data-go="loja:${ME}">${ic('eye',16)}Ver minha loja</button>
     <div class="who"><button class="iconbtn" data-go="painel:pedidos" aria-label="Pedidos novos">${ic('bell')}<i class="badge">${nov||''}</i></button>${logo(s,'sm')}<div><b>${esc(s.name)}</b><small>Lojista</small></div></div></header>
    <main class="pcontent view">${(P[tab]||P.visao)()}</main></div>
   <nav class="pbnav" aria-label="Painel">${pb.map(([k,i,l])=>`<button data-go="painel:${k}" class="${tab===k||(k==='produtos'&&tab==='novo')?'on':''}">${ic(i,22)}${l}${k==='pedidos'&&nov?`<i class="badge">${nov}</i>`:''}</button>`).join('')}<button data-act="pmore" class="${['promos','stats','config'].includes(tab)?'on':''}">${ic('more',22)}Mais</button></nav>
   <button class="helpfab" data-act="help">${ic('wa',20)}<span>Ajuda</span></button></div>`;
}
function afterPainel(){const tab=S.params.id;if(tab==='novo')updPreview();if(tab==='promos')updDisc()}
const myP=()=>PRODUCTS.filter(p=>p.store===ME);
const myO=()=>S.orders.filter(o=>o.store===ME);
function barChart(data,{h=240,hiLast=true,step=50}={}){
  const W=640,H=h,pl=36,pb=28,pt=22,max=Math.ceil(Math.max(...data.map(d=>d[1]))/step)*step;
  const cw=(W-pl)/data.length,bw=Math.min(46,cw*.56),y=v=>pt+(H-pt-pb)*(1-v/max);
  let g='';for(let v=0;v<=max;v+=step)g+=`<line class="gl" x1="${pl}" x2="${W}" y1="${y(v)}" y2="${y(v)}"/><text class="ax" x="${pl-8}" y="${y(v)+4}" text-anchor="end">${v}</text>`;
  const bars=data.map(([l,v],i)=>{const x=pl+cw*i+(cw-bw)/2;return `<rect class="bar ${hiLast&&i===data.length-1?'hi':''}" x="${x}" y="${y(v)}" width="${bw}" height="${H-pb-y(v)}" rx="6"><title>${l}: ${v}</title></rect><text class="vl" x="${x+bw/2}" y="${y(v)-7}" text-anchor="middle">${v}</text><text class="ax" x="${x+bw/2}" y="${H-8}" text-anchor="middle">${l}</text>`}).join('');
  return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Gráfico de barras">${g}${bars}</svg></div>`;
}
const P={};
const newDraft=()=>({photos:[],name:'',d:'',cat:'Calçados',brand:'',price:0,promo:0,qty:1,av:true,colors:[],sizes:[]});
P.visao=()=>{
  const s=st(ME),top=myP().sort((a,b)=>b.views-a.views).slice(0,5),mx=top[0].views;
  const nov=myO().filter(o=>o.st==='Aguardando confirmação').length,low=myP().filter(p=>p.qty<=3);
  return `<div class="ph"><div><h1>Olá, ${esc(s.name)} 👋</h1><p>Veja o que precisa da sua atenção hoje.</p></div></div>
  <div class="todo"><h2>O que fazer hoje</h2>
   ${nov?`<button class="todoi" data-go="painel:pedidos"><span class="ti b">${ic('bell',22)}</span><span class="tt"><b>${nov} ${nov===1?'pedido esperando':'pedidos esperando'} confirmação</b><small>Confirme para o cliente saber que pode contar com você</small></span><span class="btn primary sm">Ver pedidos</span></button>`:`<div class="todoi"><span class="ti g">${ic('check',22)}</span><span class="tt"><b>Nenhum pedido esperando</b><small>Você já respondeu todos os clientes</small></span></div>`}
   ${low.length?`<button class="todoi" data-act="plow"><span class="ti a">${ic('box',22)}</span><span class="tt"><b>${low.length} ${low.length===1?'produto está acabando':'produtos estão acabando'}</b><small>${low.slice(0,2).map(p=>esc(p.name)).join(', ')}${low.length>2?'…':''}</small></span><span class="btn outline sm">Atualizar estoque</span></button>`:''}
   <button class="todoi" data-act="newp"><span class="ti b">${ic('plus',22)}</span><span class="tt"><b>Adicionar produto</b><small>Foto, nome e preço. Leva 1 minuto.</small></span><span class="btn outline sm">Adicionar</span></button></div>
  <h2 class="subh">Como foi sua semana</h2>
  <div class="kpis k3">${[['eye','Pessoas que viram seus produtos','1.248','+18%',''],['wa','Chamaram no WhatsApp','86','+11%','g'],['receipt','Pedidos recebidos',String(28+myO().length),'+9%','a']].map(([i,t,v,d,c])=>`<div class="kpi"><div class="kt"><span>${t}</span><span class="ki ${c}">${ic(i,18)}</span></div><b>${v}</b><span class="delta">${d} <span>em relação à semana passada</span></span></div>`).join('')}</div>
  <div class="dgrid"><div class="card"><div class="ch"><div><h3>Pessoas que viram seus produtos</h3><p>Por dia, nos últimos 7 dias</p></div><span class="tg blue">Melhor dia: sábado</span></div>${barChart(VIEWS7)}</div>
   <div class="card"><div class="ch"><h3>Produtos mais procurados</h3><a class="link" href="#" data-go="painel:produtos">Ver todos</a></div><div class="toplist">${top.map(p=>`<div class="tl">${pimg(p)}<div style="min-width:0"><b>${esc(p.name)}</b><div class="tb"><i style="width:${p.views/mx*100}%"></i></div></div><div class="tv">${p.views}<small>pessoas</small></div></div>`).join('')}</div></div></div>
`;
};
P.produtos=()=>{
  const q=norm(S.pq||''),lowN=myP().filter(p=>p.qty<=3).length,list=myP().filter(p=>(!q||norm(p.name+p.sub+p.brand).includes(q))&&(!S.plow||p.qty<=3));
  const sw=p=>`<label class="switch"><input type="checkbox" data-act="ptoggle" data-id="${p.id}" ${p.active===false?'':'checked'} aria-label="Mostrar ${esc(p.name)} para clientes"><span></span></label>`;
  const acts=p=>`<button class="btn outline sm" data-act="editp" data-id="${p.id}">${ic('edit',16)}Editar</button><button class="btn ghost sm" data-act="dupp" data-id="${p.id}">Duplicar</button>`;
  const total=121+myP().length;
  return `<div class="ph"><div><h1>Produtos</h1><p>Mude preço e estoque, ou pause o que não quer mostrar.</p></div><button class="btn primary" data-act="newp">${ic('plus',18)}Adicionar produto</button></div>
  <div class="toolbar"><div class="sbar">${ic('search',18)}<input id="pq" value="${esc(S.pq||'')}" placeholder="Procurar produto pelo nome" aria-label="Procurar produto" autocomplete="off"></div>${lowN?`<button class="chip ${S.plow?'on':''}" data-act="plowt" aria-pressed="${!!S.plow}">${ic('box',16)}Acabando (${lowN})</button>`:''}</div>
  ${list.length?'':`<div class="empty"><p>Nenhum produto encontrado.</p></div>`}
  <div class="tblwrap hide-pm" ${list.length?'':'hidden'}><table><thead><tr><th>Produto</th><th>Categoria</th><th>Preço</th><th>Estoque</th><th>Pessoas que viram</th><th>Aparece para clientes</th><th><span class="muted">Ações</span></th></tr></thead><tbody>${list.map(p=>{const[k]=stockOf(p);return `<tr>
    <td><div class="tprod">${pimg(p)}<div><b>${esc(p.name)}</b><small>${esc(p.brand)}</small></div></div></td><td>${p.cat}<br><small class="muted">${p.sub}</small></td>
    <td>${p.promo?`<b>${brl(p.promo)}</b><br><small class="muted"><s>${brl(p.price)}</s></small>`:`<b>${brl(p.price)}</b>`}</td>
    <td><span class="pill ${k}">${p.qty} un.</span></td><td>${p.views}</td><td>${sw(p)}</td><td><div class="tacts">${acts(p)}</div></td></tr>`}).join('')}</tbody></table>
   <div class="tfoot"><span>Mostrando ${list.length} de ${total} produtos</span><span>Atualizado agora</span></div></div>
  <div class="plist only-pm">${list.map(p=>{const[k]=stockOf(p);return `<div class="pitem">${pimg(p)}<div class="pi"><b>${esc(p.name)}</b><span class="price">${brl(ep(p))}${p.promo?`<s>${brl(p.price)}</s>`:''}</span><span><span class="pill ${k}">${p.qty} em estoque</span></span></div>
    <div class="pia"><div class="togl">${sw(p)}<span>Aparece para clientes</span></div>${acts(p)}</div></div>`}).join('')}${list.length?`<p class="muted" style="text-align:center">Mostrando ${list.length} de ${total} produtos</p>`:''}</div>`;
};
const SIZEP=[['Calçado 34 a 44',['34','35','36','37','38','39','40','41','42','43','44']],['Calçado feminino 34 a 39',['34','35','36','37','38','39']],['Roupa P ao GG',['P','M','G','GG']]];
const ALLSZ=['PP','P','M','G','GG','34','35','36','37','38','39','40','41','42','43','44'];
P.novo=()=>{
  if(!S.draft)S.draft=newDraft();
  const d=S.draft,e=d.id;
  return `<div class="ph"><div><div class="crumbs" style="margin-bottom:6px"><a href="#" data-go="painel:produtos">Produtos</a>${ic('chev',12)}<span>${e?'Editar':'Novo produto'}</span></div><h1>${e?'Editar produto':'Adicionar produto'}</h1><p>Foto, nome e preço já bastam para publicar.</p></div></div>
  <form id="pform" class="fgrid" novalidate><div class="fcol">
   <div class="card form">
    <div class="field"><span class="lb">1. Foto do produto</span><label class="upl">${ic('upload',28)}<b>Tirar foto ou escolher da galeria</b><span>Pode colocar até 6 fotos</span><input type="file" accept="image/*" multiple data-up="photos" aria-label="Enviar fotos"></label><div class="uthumbs" id="uthumbs">${d.photos.map(u=>`<div style="background-image:url('${u}')"></div>`).join('')}</div></div>
    <div class="field big"><label for="n-nome">2. Nome do produto</label><input id="n-nome" value="${esc(d.name)}" placeholder="Ex.: Tênis Nike Revolution 7 preto"><span class="err">Escreva o nome do produto.</span></div>
    <div class="field big"><label for="n-price">3. Preço</label><div class="money"><span>R$</span><input id="n-price" inputmode="numeric" data-mask="money" value="${fmtMoney(d.price)}" placeholder="0,00" autocomplete="off"></div><span class="hint">Digite só os números. Ex.: 27990 vira R$ 279,90</span><span class="err">Informe o preço.</span></div>
    <div class="field"><span class="lb">4. Tem na loja agora?</span><div class="yn" role="radiogroup">${ynBtns('navail',d.av)}</div></div>
    <div class="field" id="qtyf" ${d.av?'':'hidden'}><span class="lb">Quantas unidades você tem?</span><div class="stepper big"><button type="button" data-act="nqty" data-d="-1" aria-label="Diminuir">−</button><span id="n-qty">${d.qty||1}</span><button type="button" data-act="nqty" data-d="1" aria-label="Aumentar">+</button></div></div>
   </div>
   <details class="card more" ${d.open?'open':''}><summary><span>Adicionar mais detalhes <small class="muted">(opcional)</small></span></summary><div class="form" style="margin-top:14px">
    <div class="field"><label for="n-desc">Descrição</label><textarea id="n-desc" rows="3" placeholder="Material, conforto, para quem é indicado…">${esc(d.d)}</textarea></div>
    <div class="row2"><div class="field"><label for="n-cat">Categoria</label><select id="n-cat">${CATS.slice(0,9).map(([c])=>`<option ${c===d.cat?'selected':''}>${c}</option>`).join('')}</select></div><div class="field"><label for="n-brand">Marca</label><input id="n-brand" value="${esc(d.brand)}" placeholder="Ex.: Nike"></div></div>
    <div class="field"><label for="n-promo">Preço em promoção <small class="muted">(se estiver em oferta)</small></label><div class="money"><span>R$</span><input id="n-promo" inputmode="numeric" data-mask="money" value="${fmtMoney(d.promo)}" placeholder="0,00" autocomplete="off"></div><span class="hint" id="n-off"></span><span class="err">O preço da promoção precisa ser menor que o preço normal.</span></div>
    <div class="field"><span class="lb">Tamanhos</span><div class="chips">${SIZEP.map(([l,a])=>`<button type="button" class="chip" data-act="spre" data-v="${a.join(',')}">${ic('plus',14)}${l}</button>`).join('')}<button type="button" class="chip" data-act="spre" data-v="">Sem tamanho</button></div><div class="chips" style="margin-top:6px">${ALLSZ.map(z=>`<button type="button" class="chip ${d.sizes.includes(z)?'on':''}" data-act="dchip" data-k="sizes" data-v="${z}">${z}</button>`).join('')}</div></div>
    <div class="field"><span class="lb">Cores</span><div class="chips">${Object.keys(C).map(c=>`<button type="button" class="chip ${d.colors.includes(c)?'on':''}" data-act="dchip" data-k="colors" data-v="${c}"><i style="width:14px;height:14px;border-radius:50%;background:${C[c]};border:1px solid rgb(0 0 0/.15)"></i>${c}</button>`).join('')}</div></div>
   </div></details>
  </div><div class="fcol stick">
   <div class="card"><h3 style="margin-bottom:12px">Assim o cliente vai ver</h3><div class="preview-card" id="pprev"></div></div>
   <button class="btn primary lg block">${ic('check',18)}${e?'Salvar alterações':'Publicar produto'}</button><button type="button" class="btn ghost block" data-go="painel:produtos">Cancelar</button>
  </div></form>`;
};
function readDraft(){const d=S.draft;if(!$('#pform'))return d;d.name=$('#n-nome').value;d.price=money($('#n-price').value);d.qty=+$('#n-qty').textContent||1;d.d=$('#n-desc').value;d.cat=$('#n-cat').value;d.brand=$('#n-brand').value;d.promo=money($('#n-promo').value);d.open=$('details.more').open;return d}
const catEmoji={Moda:'👕',Calçados:'👟',Eletrônicos:'📱',Casa:'🏠',Beleza:'🧴',Esportes:'⚽',Presentes:'🎁',Acessórios:'👜',Infantil:'🧸'};
function draftProduct(){const d=readDraft(),price=d.price||0,promo=d.promo||0;return {id:d.id||'new',name:d.name||'Nome do produto',brand:d.brand||st(ME).name,cat:d.cat,sub:d.sub||d.cat,store:ME,price,promo:promo&&promo<price?promo:undefined,pe:d.pe||'Por tempo limitado',qty:d.av?Math.max(1,d.qty||1):0,e:d.e||catEmoji[d.cat]||'🛍️',hue:d.hue??214,views:d.views||0,sizes:d.sizes,colors:d.colors,tags:norm([d.name,d.cat,d.brand].join(' ')),d:d.d||'Produto da '+st(ME).name+'.',photo:d.photos[0],active:true}}
function updPreview(){const el=$('#pprev');if(!el)return;const p=draftProduct();el.innerHTML=pcard(p).replace(/data-go="[^"]*"/,'').replace(/data-act="qadd"/,'');const o=$('#n-off');if(o)o.textContent=p.promo?`Desconto de ${off(p)}%`:''}
P.pedidos=()=>{
  S.of=S.of||'Abertos';const all=myO(),open=o=>!['Concluído','Cancelado'].includes(o.st);
  const tabs=[['Abertos',all.filter(open)],['Aguardando',all.filter(o=>o.st==='Aguardando confirmação')],['Concluídos',all.filter(o=>o.st==='Concluído')],['Cancelados',all.filter(o=>o.st==='Cancelado')],['Todos',all]];
  const list=(tabs.find(t=>t[0]===S.of)||tabs[0])[1];
  return `<div class="ph"><div><h1>Pedidos</h1><p>Confirme, prepare e avise o cliente. Cada mudança aparece para ele no app.</p></div></div>
  <div class="tabs">${tabs.map(([t,l])=>`<button class="chip ${S.of===t?'on':''}" data-act="of" data-t="${t}">${t}<span class="n">${l.length}</span></button>`).join('')}</div>
  ${list.length?`<div class="rgrid">${list.map(o=>{const nx=nextAct(o),p=pr(o.items[0].pid);return `<div class="rcard ${o.st==='Aguardando confirmação'?'new':''}">
   <div class="rh"><div class="av">${esc(o.cli.name[0])}</div><div><b>#${o.id} · ${esc(o.cli.name)}</b><small>${o.date}</small></div></div>
   <div class="ost"><span class="pill ${stCls(o.st)}">${o.st}</span><span class="pill ${o.ship==='entrega'?'blue':'out'}">${o.ship==='entrega'?'Entrega':'Retirada'}</span></div>
   <div class="rp">${pimg(p)}<div><b>${esc(p.name)}${o.items.length>1?` + ${o.items.length-1} ${o.items.length===2?'produto':'produtos'}`:''}</b><small>${oCount(o)} ${oCount(o)===1?'unidade':'unidades'} · Total ${brl(oTotal(o))}</small></div></div>
   ${nx?`<button class="btn ${o.st==='Aguardando confirmação'?'primary':'outline'} lg block" data-act="onext" data-id="${o.id}">${ic('check',20)}${nx}</button>`:''}
   <button class="btn ghost block" data-act="odet" data-id="${o.id}">Ver detalhes</button></div>`}).join('')}</div>`
   :`<div class="empty"><div class="eic">${ic('receipt',28)}</div><h3>Nenhum pedido aqui</h3><p>Quando um cliente comprar pela Easy Vendas, o pedido aparece nesta lista.</p></div>`}`;
};
const nextAct=o=>{const i=FLOW[o.ship].indexOf(o.st);if(i<0||i>=4)return '';return ['Confirmar pedido','Começar a preparar',o.ship==='entrega'?'Saiu para entrega':'Avisar que está pronto','Marcar como concluído'][i]};
P.promos=()=>{
  const ps=myP(),act=ps.filter(p=>p.promo),sel=pr(S.promoSel)||pr('p3');
  const t=new Date(),iso=d=>d.toISOString().slice(0,10),end=new Date(t.getTime()+7*864e5);
  return `<div class="ph"><div><h1>Promoções</h1><p>Promoções aparecem em destaque em “Ofertas perto de você”.</p></div></div>
  <div class="fgrid"><form class="card form" id="promof" novalidate><h3>Criar promoção</h3>
   <div class="field"><label for="pr-prod">Produto</label><select id="pr-prod">${ps.map(p=>`<option value="${p.id}" ${p.id===sel.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select></div>
   <div class="row2"><div class="field"><label for="pr-norm">Preço normal</label><input id="pr-norm" value="${brl(sel.price)}" readonly style="background:var(--surface-2)"></div>
    <div class="field"><label for="pr-val">Preço da promoção</label><div class="money"><span>R$</span><input id="pr-val" inputmode="numeric" data-mask="money" autocomplete="off" value="${fmtMoney(sel.promo||Math.round(sel.price*80)/100)}"></div><span class="err">O preço promocional precisa ser menor que o normal.</span></div></div>
   <div class="discbig"><div><span class="muted" style="font-size:13px">Desconto calculado</span><div id="pr-sv" class="muted" style="font-size:13px"></div></div><b id="pr-off">0%</b></div>
   <div class="row2"><div class="field"><label for="pr-ini">Data de início</label><input id="pr-ini" type="date" value="${iso(t)}"></div><div class="field"><label for="pr-fim">Data final</label><input id="pr-fim" type="date" value="${iso(end)}"></div></div>
   <button class="btn primary lg">${ic('tag',18)}Criar promoção</button></form>
   <div class="card"><div class="ch"><h3>Promoções ativas</h3><span class="tg blue">${act.length}</span></div>${act.length?`<div class="toplist">${act.map(p=>`<div class="tl">${pimg(p)}<div style="min-width:0"><b>${esc(p.name)}</b><small class="muted">${brl(p.promo)} · <s>${brl(p.price)}</s> · ${p.pe}</small></div><div style="display:flex;gap:6px;align-items:center"><span class="tg off">${off(p)}%</span><button class="iconbtn" data-act="endpromo" data-id="${p.id}" aria-label="Encerrar promoção" title="Encerrar">${ic('x',16)}</button></div></div>`).join('')}</div>`:'<p class="muted">Nenhuma promoção ativa.</p>'}</div></div>`;
};
function updDisc(){const p=pr($('#pr-prod')?.value);if(!p)return;const v=money($('#pr-val').value),o=v>0&&v<p.price?Math.round((1-v/p.price)*100):0;$('#pr-off').textContent=o+'%';$('#pr-sv').textContent=o?`Cliente economiza ${brl(p.price-v)}`:'Informe um valor menor que o normal'}
P.loja=()=>{
  const s=st(ME);
  const f=(id,l,v,ph='')=>`<div class="field"><label for="${id}">${l}</label><input id="${id}" value="${esc(v)}" placeholder="${ph}"></div>`;
  return `<div class="ph"><div><h1>Minha loja</h1><p>Essas informações aparecem na página da sua loja.</p></div><button class="btn outline" data-go="loja:${ME}">${ic('eye',17)}Ver como cliente</button></div>
  <form class="fgrid" id="lojaf" novalidate><div class="fcol"><div class="card form"><h3>Identidade</h3>
   <div class="row2"><div class="field"><span class="lb">Logo</span><label class="upl" style="padding:16px">${S.logoImg?`<div class="slogo lg" style="background:url('${S.logoImg}') center/cover"></div>`:logo(s,'lg')}<span>Trocar logo</span><input type="file" accept="image/*" data-up="logo" aria-label="Enviar logo"></label></div>
    <div class="field"><span class="lb">Banner</span><label class="upl" style="padding:16px;min-height:100%">${S.banImg?`<div style="width:100%;height:70px;border-radius:10px;background:url('${S.banImg}') center/cover"></div>`:`<div class="sban" style="--h:${s.hue};width:100%;border-radius:10px"></div>`}<span>Trocar banner · 1600×400</span><input type="file" accept="image/*" data-up="banner" aria-label="Enviar banner"></label></div></div>
   ${f('l-nome','Nome',s.name)}<div class="field"><label for="l-desc">Descrição</label><textarea id="l-desc" rows="3">${esc(s.desc)}</textarea></div>
   <div class="field"><label for="l-cat">Categoria</label><select id="l-cat">${['Esportes','Moda','Moda feminina','Calçados','Eletrônicos','Casa e decoração','Beleza','Infantil','Presentes','Acessórios'].map(c=>`<option ${c===s.cat?'selected':''}>${c}</option>`).join('')}</select></div></div>
   <div class="card form"><h3>Contato e horário</h3>${f('l-addr','Endereço',s.addr)}<div class="row2">${f('l-tel','Telefone','(35) 3531-2040')}${f('l-wa','WhatsApp',s.wa)}</div>${f('l-ig','Instagram',s.ig)}${f('l-hr','Horário de funcionamento',s.hours)}</div></div>
   <div class="fcol"><div class="card form"><h3>Localização no mapa</h3><p class="muted" style="font-size:13px">Toque no mapa para ajustar o ponto da loja. É daqui que calculamos a distância até o cliente.</p>
    <div class="map" data-act="pin" style="cursor:crosshair" id="pinmap">${mapSVG(S.pin.x,S.pin.y,false)}</div><small class="muted">${s.addr}, ${CITY}</small></div>
    <button class="btn primary lg block">${ic('check',18)}Salvar alterações</button></div></form>`;
};
P.stats=()=>{
  const hrs=[['9h',38],['10h',61],['11h',74],['12h',92],['13h',58],['14h',49],['15h',63],['16h',71],['17h',88],['18h',104],['19h',82],['20h',47]];
  return `<div class="ph"><div><h1>Estatísticas</h1><p>Como os clientes da cidade chegam até a Sport Center.</p></div><div class="seg"><button class="on">7 dias</button><button data-act="soon">30 dias</button><button data-act="soon">90 dias</button></div></div>
  <div class="dgrid"><div class="card"><div class="ch"><div><h3>Do interesse à loja</h3><p>Últimos 7 dias</p></div></div><div class="funnel">${[['Visualizações',1248],['Cliques em “Como chegar”',212],['Contatos pelo WhatsApp',86],['Pedidos',34],['Pedidos concluídos',27]].map(([l,v])=>`<div class="fn"><span>${l}</span><div class="fb"><i style="width:${Math.max(3,v/1248*100)}%"></i></div><span class="fv">${v.toLocaleString('pt-BR')}</span></div>`).join('')}</div>
    <p class="muted" style="font-size:13px;margin-top:14px">6,9% de quem viu um produto chamou a loja no WhatsApp. 79% dos pedidos foram concluídos.</p></div>
   <div class="card"><div class="ch"><div><h3>Distância dos seus clientes</h3><p>Onde estava quem viu seus produtos</p></div></div><div class="funnel">${[['Até 1 km',48],['1 a 3 km',33],['3 a 5 km',13],['Mais de 5 km',6]].map(([l,v])=>`<div class="fn"><span>${l}</span><div class="fb"><i style="width:${v*2}%"></i></div><span class="fv">${v}%</span></div>`).join('')}</div></div></div>
  <div class="dgrid"><div class="card"><div class="ch"><div><h3>Horário de maior interesse</h3><p>Visualizações por hora · média diária</p></div><span class="tg blue">Pico às 18h</span></div>${barChart(hrs,{hiLast:false,step:20,h:220}).replace(/class="bar "([^>]*)><title>18h/,'class="bar hi"$1><title>18h')}</div>
   <div class="card"><div class="ch"><h3>Buscas que trouxeram clientes</h3></div><div class="qlist">${[['tênis masculino',212],['tênis nike',154],['adidas runfalcon',88],['camiseta dry fit',61],['bola de futebol',37],['garrafa térmica',22]].map(([q,v])=>`<div><b style="font-weight:500">“${q}”</b><span>${v} buscas</span></div>`).join('')}</div></div></div>`;
};
P.config=()=>`<div class="ph"><div><h1>Configurações</h1><p>Notificações, pedidos e entrega da sua loja.</p></div></div>
  <div class="fgrid"><div class="card"><div class="togrow"><div><b>Aumentar texto</b><small>Deixa textos e botões do painel maiores</small></div><label class="switch"><input type="checkbox" ${S.big?'checked':''} data-act="bigtoggle" aria-label="Aumentar texto"><span></span></label></div>${[['Aceitar pedidos','Clientes podem comprar pela Easy Vendas',true],['Avisar novo pedido no WhatsApp','Mensagem automática para (35) 99876-1020',true],['Mostrar quantidade exata em estoque','Se desligado, mostramos só “Disponível” ou “Últimas unidades”',false],['Resumo semanal por e-mail','Toda segunda-feira, com visualizações e contatos',true],['Loja aberta no feriado','Aparece como aberta nos feriados municipais',false]].map(([t,d,on],i)=>`<div class="togrow"><div><b>${t}</b><small>${d}</small></div><label class="switch"><input type="checkbox" id="cfg${i}" ${on?'checked':''}><span></span></label></div>`).join('')}</div>
  <div class="card form"><h3>Entrega local</h3><div class="togrow" style="border-top:0;padding-top:0"><div><b>Fazer entregas</b><small>Clientes podem escolher “Receber em casa”</small></div><label class="switch"><input type="checkbox" id="cfg-ent" ${ent(st(ME))?'checked':''} aria-label="Fazer entregas"><span></span></label></div>
   <div class="row2"><div class="field"><label for="cfg-fee">Taxa de entrega</label><div class="money"><span>R$</span><input id="cfg-fee" inputmode="numeric" data-mask="money" value="${fmtMoney(DELIV[ME]||7)}"></div></div><div class="field"><label for="cfg-eta">Prazo estimado</label><select id="cfg-eta"><option>30 a 60 minutos</option><option>1 a 2 horas</option><option>No mesmo dia</option></select></div></div>
   <div class="field"><label for="cfg-msg">Mensagem automática de confirmação</label><textarea id="cfg-msg" rows="3">Olá! Seu pedido na Sport Center foi confirmado. Avisamos assim que estiver pronto.</textarea></div>
   <button class="btn primary" data-act="savecfg">Salvar configurações</button></div></div>`;

