/* ---------- Estado ---------- */
const S={view:'home',params:{},stack:[],user:null,loc:CITY,
  f:{dist:0,min:'',max:'',cats:[],brands:[],avail:false,promo:false,sort:'proximos'},
  cart:[],ship:{},pay:{},co:null,addr:{rua:'Rua das Flores, 120',bairro:'Centro',comp:''},sel:{},draft:null,pin:{x:210,y:110},
  orders:[
  {id:'EV1024',store:'s1',cli:{name:'Rafael Fogaça',tel:'(35) 99812-4471',mail:''},items:[{pid:'p1',size:'40',color:'Branco',qty:1,price:279.9}],ship:'retirada',fee:0,addr:'',pay:'loja',date:'Hoje, 10:42',st:'Aguardando confirmação'},
  {id:'EV1023',store:'s1',cli:{name:'Lucas Ferreira',tel:'(35) 99731-0258',mail:''},items:[{pid:'p3',size:'41',color:'Preto',qty:1,price:279.9},{pid:'p6',size:'',color:'Preto',qty:1,price:89.9}],ship:'entrega',fee:7,addr:'Rua Santos Dumont, 88 – Vila Mariana',pay:'pix',date:'Hoje, 09:15',st:'Aguardando confirmação'},
  {id:'EV1022',store:'s1',cli:{name:'Carla Mendes',tel:'(35) 98844-1390',mail:''},items:[{pid:'p4',size:'M',color:'Azul',qty:2,price:69.9}],ship:'retirada',fee:0,addr:'',pay:'loja',date:'Ontem, 17:20',st:'Preparando pedido'},
  {id:'EV1021',store:'s1',cli:{name:'João Pedro Silva',tel:'(35) 99120-7783',mail:''},items:[{pid:'p2',size:'42',color:'Preto',qty:1,price:399.9}],ship:'entrega',fee:7,addr:'Av. Oliveira Rezende, 1500 – Centro',pay:'cartao',date:'Ontem, 15:02',st:'Saiu para entrega'},
  {id:'EV1020',store:'s1',cli:{name:'Mariana Alves',tel:'(35) 99903-6614',mail:''},items:[{pid:'p1',size:'38',color:'Branco',qty:1,price:279.9}],ship:'retirada',fee:0,addr:'',pay:'loja',date:'25/10, 10:05',st:'Concluído'},
  {id:'EV1019',store:'s1',cli:{name:'Beatriz Rocha',tel:'(35) 99655-3021',mail:''},items:[{pid:'p5',size:'',color:'',qty:1,price:129.9}],ship:'retirada',fee:0,addr:'',pay:'loja',date:'24/10, 11:48',st:'Cancelado'}],
  nextOrder:1025
};

/* ---------- Utilidades ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const brl=v=>v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const km=m=>m<1000?`${m} m`:`${(m/1000).toFixed(1).replace('.',',')} km`;
const ep=p=>p.promo||p.price;
const DELIV={s1:7,s2:6,s3:8,s4:10,s5:7,s6:5,s7:8,s8:6,s10:9};
const ent=s=>DELIV[s.id]||0;
const etaOf=s=>s.id==='s4'?'1 a 2 horas':'30 a 60 minutos';
const hojeAte=s=>{const m=s.hours.match(/–(\d+h\d*)/);return m?'Hoje até '+m[1]:s.hours};
const FLOW={retirada:['Aguardando confirmação','Confirmado pela loja','Preparando pedido','Pronto para retirada','Concluído'],entrega:['Aguardando confirmação','Confirmado pela loja','Preparando pedido','Saiu para entrega','Concluído']};
const stCls=t=>({'Aguardando confirmação':'nova','Confirmado pela loja':'confirmada','Preparando pedido':'low','Pronto para retirada':'ok','Saiu para entrega':'ok','Concluído':'retirada','Cancelado':'cancelada'})[t]||'nova';
const oTotal=o=>o.items.reduce((a,i)=>a+i.price*i.qty,0)+o.fee;
const oCount=o=>o.items.reduce((a,i)=>a+i.qty,0);
const payTxt=o=>({loja:o.ship==='entrega'?'Pagar na entrega':'Pagar na retirada',pix:'Pix',cartao:'Cartão'})[o.pay];
const shipTxt=o=>o.ship==='entrega'?'Receber em casa':'Retirada na loja';
const varTxt=i=>[i.size&&'Tamanho '+i.size,i.color].filter(Boolean).join(' · ');
const off=p=>p.promo?Math.round((1-p.promo/p.price)*100):0;
const st=id=>STORES.find(s=>s.id===id);
const pr=id=>PRODUCTS.find(p=>p.id===id);
const norm=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const dist=p=>st(p.store).dist;
const live=()=>PRODUCTS.filter(p=>p.active!==false);
const stockOf=p=>p.qty<=0?['out','Esgotado']:p.qty<=3?['low','Últimas unidades']:['ok','Disponível'];
const now=()=>new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});

const rt=s=>s.rating?s.rating.toFixed(1).replace('.',','):'Nova';
const money=v=>+(String(v||'').replace(/\./g,'').replace(',','.'))||0;
const fmtMoney=n=>n?Number(n).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}):'';
const ynBtns=(act,on)=>`<button type="button" class="hopt ${on?'on':''}" data-act="${act}" data-v="1" role="radio" aria-checked="${!!on}"><i class="rdot"></i><b>Sim, tenho</b></button><button type="button" class="hopt ${!on?'on':''}" data-act="${act}" data-v="0" role="radio" aria-checked="${!on}"><i class="rdot"></i><b>Não, está em falta</b></button>`;
const qchips=()=>[['d1','Até 1 km',S.f.dist===1000],['av','Disponível agora',S.f.avail],['pr','Em promoção',S.f.promo]].map(([k,l,on])=>`<button class="chip ${on?'on':''}" data-act="qf" data-k="${k}" aria-pressed="${on}">${on?ic('check',16):''}${l}</button>`).join('');
function suggest(inp){
  const f=inp.form,q=inp.value.trim();let box=f.querySelector('.sugg');
  if(q.length<2){box?.remove();return}
  const t=tokens(q),ss=STORES.filter(s=>t.some(x=>norm(s.name).includes(x))).slice(0,2);
  const res=search(q).sort((a,b)=>b.views-a.views).slice(0,ss.length?3:5);
  if(!box){box=document.createElement('div');box.className='sugg';box.setAttribute('role','listbox');f.appendChild(box)}
  box.innerHTML=(ss.length||res.length)?ss.map(s=>`<button type="button" role="option" data-go="loja:${s.id}">${logo(s,'sm')}<span><b>${esc(s.name)}</b><small>Loja · ${s.cat} · ${km(s.dist)}</small></span></button>`).join('')+res.map(p=>`<button type="button" role="option" data-go="produto:${p.id}">${pimg(p)}<span><b>${esc(p.name)}</b><small>${brl(ep(p))} · ${esc(st(p.store).name)} · ${km(dist(p))}</small></span></button>`).join('')+`<button type="button" class="sall" data-act="q" data-q="${esc(q)}">${ic('search',18)}Ver todos os resultados para “${esc(q)}”</button>`
    :`<div class="snone">Nada encontrado para “${esc(q)}”. Tente outra palavra, como “tênis” ou “presente”.</div>`;
}

function pimg(p,v=0,cls=''){
  if(p.photo)return `<div class="pimg ${cls}" style="background-image:url('${p.photo}')"></div>`;
  const rot=[0,-8,8,0][v%4],sc=[1,1.15,.9,1.35][v%4],a=145;
  return `<div class="pimg ${cls}" style="--h:${p.hue};--a:${a}deg"><span style="transform:rotate(${rot}deg) scale(${sc})">${p.e}</span></div>`;
}
const logo=(s,c='')=>`<div class="slogo ${c}" style="--h:${s.hue}">${s.ini}</div>`;
const hasVar=p=>p.sizes.length>1||p.colors.length>1;
const addBtn=p=>p.qty>0?`<button class="qadd" data-act="qadd" data-id="${p.id}" aria-label="Adicionar ${esc(p.name)} ao carrinho">${ic('cart',17)}Adicionar</button>`:'';

function pcard(p){
  const s=st(p.store),[k,l]=stockOf(p);
  return `<article class="pcard" data-go="produto:${p.id}" tabindex="0" aria-label="${esc(p.name)}, ${brl(ep(p))}, ${esc(s.name)}, a ${km(s.dist)}, ${l}">
    <div class="pmedia">${pimg(p)}${p.promo?`<span class="disc">-${off(p)}%</span>`:''}${k!=='ok'?`<span class="sflag ${k}">${l}</span>`:''}${addBtn(p)}</div>
    <div class="pbody"><h3>${esc(p.name)}</h3>
      <div class="price">${brl(ep(p))}</div>
      ${p.promo?`<div class="was"><s>${brl(p.price)}</s><span class="offt">${off(p)}% OFF</span></div>`:''}
      <div class="pstore">${esc(s.name)}</div>
      <div class="pdist">${ic('pin',16)}${km(s.dist)}</div>
    </div></article>`;
}
function promoCard(p){
  const s=st(p.store),[k]=stockOf(p);
  return `<article class="promo" data-go="produto:${p.id}" tabindex="0" aria-label="${esc(p.name)}, de ${brl(p.price)} por ${brl(p.promo)}, ${esc(s.name)}, a ${km(s.dist)}">
    <div class="pmedia">${pimg(p,1)}</div>
    <div class="pb"><span class="tg off">${off(p)}% OFF</span>
      <h3>${esc(p.name)}</h3>
      <div class="to">${brl(p.promo)}</div>
      <div class="from"><s>${brl(p.price)}</s></div>
      <div class="when">${ic('clock',14)}${p.pe||'Por tempo limitado'}</div>${k==='low'?'<div class="lastu">Últimas unidades</div>':''}
      <div class="foot"><span>${esc(s.name)}</span><span class="dist">${ic('pin',14)}${km(s.dist)}</span></div>
      ${p.qty>0?`<button class="btn soft block" data-act="qadd" data-id="${p.id}">${ic('cart',18)}Adicionar</button>`:''}
    </div></article>`;
}
function scard(s){
  const n=live().filter(p=>p.store===s.id).length;
  return `<article class="scard" data-go="loja:${s.id}" tabindex="0">
    <div class="sban" style="--h:${s.hue}"></div>
    ${logo(s)}
    <div class="sb"><h3>${esc(s.name)}</h3><span class="sc">${s.cat}</span>
      <div class="srow"><span class="rate">${ic('star',14)}${rt(s)}</span><span class="dist">${ic('pin',14)}${km(s.dist)}</span></div>
      <div class="srow muted">${s.count} produtos · <span class="${s.open?'open':'closed'}">${s.open?'Aberta':'Fechada'}</span></div>
      <button class="btn outline sm block">Ver loja</button>
    </div></article>`;
}
const skel=n=>Array.from({length:n},()=>`<div class="sk"><i class="ski"></i><div class="skb"><i style="height:14px;width:90%"></i><i style="height:14px;width:60%"></i><i style="height:20px;width:45%"></i><i style="height:12px;width:70%"></i></div></div>`).join('');
function fillLater(sel,html,ms=450){const el=$(sel);if(!el)return;const t=S.view;setTimeout(()=>{const e=$(sel);if(e&&S.view===t)e.innerHTML=html},ms)}

/* ---------- Busca ---------- */
const STOP=new Set(['de','da','do','para','com','e','o','a','os','as','em','um','uma']);
function tokens(q){return norm(q).split(/\s+/).filter(t=>t&&!STOP.has(t))}
function hay(p){const s=st(p.store);return norm([p.name,p.brand,p.cat,p.sub,p.tags,s.name,s.cat].join(' '))}
function lev(a,b){if(Math.abs(a.length-b.length)>1)return 2;let p=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){const c=[i];for(let j=1;j<=b.length;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c}return p[b.length]}
const tm=(x,h,ws)=>h.includes(x)||h.includes(x.replace(/s$/,''))||(x.length>=4&&ws.some(w=>lev(w,x)<=1||(w.length>x.length&&lev(w.slice(0,x.length),x)<=1)));
function search(q){
  const t=tokens(q);if(!t.length)return live();
  return live().filter(p=>{const h=hay(p),ws=h.split(/\s+/);return t.every(x=>tm(x,h,ws))});
}
function applyF(list){
  const f=S.f;let r=list.filter(p=>(!f.dist||dist(p)<=f.dist)&&(!f.min||ep(p)>=+f.min)&&(!f.max||ep(p)<=+f.max)&&(!f.cats.length||f.cats.includes(p.cat))&&(!f.brands.length||f.brands.includes(p.brand))&&(!f.avail||p.qty>0)&&(!f.promo||p.promo));
  const by={proximos:(a,b)=>dist(a)-dist(b)||ep(a)-ep(b),menor:(a,b)=>ep(a)-ep(b),maior:(a,b)=>ep(b)-ep(a),relevantes:(a,b)=>b.views-a.views}[f.sort];
  return r.sort(by);
}
const resetF=()=>{S.f={dist:0,min:'',max:'',cats:[],brands:[],avail:false,promo:false,sort:'proximos'}};
const activeF=()=>{const f=S.f;return (f.dist?1:0)+(f.min||f.max?1:0)+f.cats.length+f.brands.length+(f.avail?1:0)+(f.promo?1:0)};

/* ---------- Navegação ---------- */
function go(view,params={},push=true){
  if(push)S.stack.push([S.view,S.params]);
  if(view==='busca'&&!params.keep){resetF();if(params.cat)S.f.cats=[params.cat]}
  S.view=view;S.params=params;closeModal();closeFilters();closeSheet();
  render();window.scrollTo({top:0,behavior:'instant'});
  try{const tok=view==='home'?'':view+(params.id?'-'+params.id:'');history.replaceState(null,'',tok?'#'+tok:location.pathname)}catch(e){}
}
function back(){const b=S.stack.pop();if(b){S.view=b[0];S.params=b[1];render();window.scrollTo(0,0)}else go('home',{},false)}

/* ---------- Layout do consumidor ---------- */
function header(){
  const n=cartCount(),v=S.view;
  return `<header class="hdr"><div class="wrap hrow">
   <a class="logo" href="#" data-go="home" aria-label="Easy Vendas — início">${LOGO}</a>
   <nav class="mainnav" aria-label="Principal">${[['home','Início'],['busca','Buscar'],['promocoes','Ofertas'],['lojas','Lojas'],['carrinho','Carrinho']].map(([g,l])=>`<a href="#" data-go="${g}" class="${v===g?'on':''}">${l}${g==='carrinho'?`<i class="ncount" data-cartcount>${n||''}</i>`:''}</a>`).join('')}</nav>
   <div class="hright hide-m">
     ${S.user?`<button class="userchip" data-go="perfil" aria-label="Meu perfil">${esc(S.user.name[0].toUpperCase())}</button>`:`<button class="btn ghost sm" data-go="perfil">Entrar</button>`}
     <a href="#" class="link" data-go="painel">Sou lojista</a>
   </div></div></header>`;
}
const aaBtn=()=>`<button class="aa ${S.big?'on':''}" data-act="bigtext" aria-pressed="${!!S.big}" title="Tamanho da letra"><b>A<small>${S.big?'−':'+'}</small></b><span class="hide-m">${S.big?'Letra normal':'Letra maior'}</span></button>`;
function bnav(){
  const n=cartCount(),v=S.view;
  const it=[['home','home','Início',v==='home'],['search','busca','Buscar',v==='busca'],['tag','promocoes','Ofertas',v==='promocoes'],['cart','carrinho','Carrinho',v==='carrinho'||v==='checkout'],['user','perfil','Perfil',v==='perfil'||v==='login']];
  return `<nav class="bnav" aria-label="Navegação">${it.map(([i,g,l,on])=>`<button data-go="${g}" class="${on?'on':''}">${ic(i,22)}${l}${g==='carrinho'?`<i class="badge" data-cartcount>${n||''}</i>`:''}</button>`).join('')}</nav>`;
}
function footer(){
  return `<footer class="foot"><div class="wrap foot-in">
   <div><div class="logo">${LOGO}</div><p>A loja da esquina no bolso de cada cliente.</p></div>
   <nav class="foot-links" aria-label="Rodapé"><a href="#" data-go="promocoes">Ofertas</a><a href="#" data-go="lojas">Lojas da cidade</a><a href="#" data-go="login:lojista">Cadastrar minha loja</a><a href="#" data-go="painel">Painel do lojista</a></nav></div></footer>`;
}
function render(){
  const app=$('#app');
  document.documentElement.classList.toggle('big',!!S.big);
  if(S.view==='painel'){app.className='';app.innerHTML=renderPainel();afterPainel();return}
  if(S.view==='cadastro'){app.className='';app.innerHTML=obTop()+`<main class="wrap view">${V.cadastro()}</main>`;return}
  app.className='has-bnav';
  const body=(V[S.view]||V.home)();
  app.innerHTML=header()+`<main class="view" id="main">${body}</main>`+footer()+(S.view==='produto'?actionBar():bnav());
  (AFTER[S.view]||(()=>{}))();
}
function actionBar(){
  const p=pr(S.params.id)||PRODUCTS[0];
  return `<div class="abar only-m"><div class="ap"><b>${brl(ep(p))}</b><small>${esc(st(p.store).name)} · ${km(dist(p))}</small></div>
   <button class="btn primary" data-act="addcur" ${p.qty<=0?'disabled':''}>${ic('cart',19)}${p.qty<=0?'Esgotado':'Adicionar ao carrinho'}</button></div>`;
}

