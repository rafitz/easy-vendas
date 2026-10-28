/* ---------- Toasts e carrinho ---------- */
function toast(t,i='check',undo){const el=document.createElement('div');el.className='toast';el.innerHTML=ic(i,18)+`<span>${t}</span>`+(undo?'<button class="tundo">Desfazer</button>':'');if(undo)el.querySelector('.tundo').onclick=()=>{el.remove();undo()};$('#toasts').appendChild(el);setTimeout(()=>{el.classList.add('out');setTimeout(()=>el.remove(),260)},5000)}
const cartCount=()=>S.cart.reduce((a,i)=>a+i.qty,0);
function updCartCount(){const n=cartCount();document.querySelectorAll('[data-cartcount]').forEach(b=>b.textContent=n||'')}
function addToCart(p,size,color,qty){
  const key=[p.id,size,color].join('|'),it=S.cart.find(i=>i.key===key);
  if(it)it.qty=Math.min(p.qty,it.qty+qty);else S.cart.push({key,pid:p.id,size,color,qty:Math.min(p.qty,qty)});
  updCartCount();addedSheet(p,size,color);
}
function addedSheet(p,size,color){
  closeSheet();const el=document.createElement('div');el.className='addsheet';el.id='addsheet';el.setAttribute('role','status');
  el.innerHTML=`<div class="as-top">${pimg(p)}<div><b>${ic('check',18)}Produto adicionado ao carrinho</b><small>${esc(p.name)}${size?' · Tam. '+esc(size):''}${color?' · '+esc(color):''}</small></div></div><div class="as-acts"><button class="btn outline lg" data-act="sheetclose">Continuar comprando</button><button class="btn primary lg" data-go="carrinho">${ic('cart',18)}Ver carrinho</button></div>`;
  document.body.appendChild(el);clearTimeout(S.sheetT);S.sheetT=setTimeout(closeSheet,9000);
}
function closeSheet(){$('#addsheet')?.remove()}

/* ---------- Ações ---------- */
const curP=()=>pr(S.params.id)||(S.rq&&S.rq.p)||pr('p1');
const curS=el=>st(el?.dataset.id)||st(curP().store);
const ACT={
  back:()=>back(),
  q:el=>go('busca',{q:el.dataset.q}),
  cat:el=>go('busca',{cat:el.dataset.cat}),
  loc:()=>locModal(),
  soon:()=>toast('Disponível em breve nesta região.','info'),
  closeModal:()=>closeModal(),
  openFilters:()=>{$('#filters').classList.add('show');$('#overlay').classList.add('on')},
  closeFilters:()=>closeFilters(),
  clearF:()=>{const s=S.f.sort;resetF();S.f.sort=s;$('#filters').innerHTML=filtersHTML(search(S.params.q||''));renderResults()},
  img:el=>{const i=+el.dataset.i,p=curP();document.querySelectorAll('.thumbs button').forEach((b,j)=>b.classList.toggle('on',j===i));$('#gmain .pimg').outerHTML=pimg(p,i)},
  size:el=>{el.closest('.vgroup').classList.remove('bad');S.sel.size=el.dataset.v;el.parentNode.querySelectorAll('.vopt').forEach(b=>b.classList.toggle('on',b===el));$('#vsize').textContent=el.dataset.v},
  color:el=>{el.closest('.vgroup').classList.remove('bad');S.sel.color=el.dataset.v;el.parentNode.querySelectorAll('.vopt').forEach(b=>b.classList.toggle('on',b===el));$('#vcolor').textContent=el.dataset.v},
  reserve:()=>reserveModal(curP()),
  wa:()=>waProduct(curP()),
  route:el=>routeModal(curS(el)),
  wastore:el=>{const s=st(el.dataset.id);openChat({s,msg:`Olá! Encontrei a ${s.name} na Easy Vendas e gostaria de mais informações.`,reply:`Olá! Seja bem-vindo(a) à ${s.name} 😊 Como posso te ajudar?`})},
  qty:el=>{const q=$('#r-qty'),v=Math.min(S.rq.max,Math.max(1,+q.textContent+ +el.dataset.d));q.textContent=v;if(v===S.rq.max&&+el.dataset.d>0)toast(`Máximo de ${v} por reserva nesta loja.`,'info')},
  ltab:el=>{S.ltab.t=el.dataset.t;document.querySelectorAll('.tabs .chip').forEach(b=>b.classList.toggle('on',b===el));$('#lgrid').innerHTML=lojaGrid()},
  pcat:el=>{S.pcat=el.dataset.c;render()},
  pcatmore:()=>{S.pmoreCats=!S.pmoreCats;render()},
  lmode:()=>{S.lmode=S.lmode==='criar'?'entrar':'criar';render()},psort:el=>{S.psort=el.dataset.s;render()},
  ftab:el=>{S.ftab=el.dataset.t;render()},scat:el=>{S.scat=el.dataset.c;render()},
  ltype:el=>{S.ltype=el.dataset.t;render()},
  logout:()=>{S.user=null;toast('Você saiu da sua conta.','logout');go('home')},
  newp:()=>{S.draft=newDraft();go('painel',{id:'novo'})},
  editp:el=>{const p=pr(el.dataset.id);S.draft={id:p.id,photos:p.photo?[p.photo]:[],name:p.name,d:p.d,cat:p.cat,sub:p.sub,brand:p.brand,price:p.price,promo:p.promo||0,pe:p.pe,qty:p.qty||1,av:p.qty>0,colors:[...p.colors],sizes:[...p.sizes],e:p.e,hue:p.hue,views:p.views};go('painel',{id:'novo'})},
  dupp:el=>{ACT.editp(el);delete S.draft.id;S.draft.name+=' (cópia)';S.draft.views=0;render();toast('Cópia criada. Mude só o que for diferente, como a cor, e publique.','info')},
  nvar:el=>{$('#varbox').hidden=!el.checked;updPreview()},
  dchip:el=>{const a=S.draft[el.dataset.k],v=el.dataset.v,i=a.indexOf(v);i<0?a.push(v):a.splice(i,1);el.classList.toggle('on',i<0);updPreview()},
  ptoggle:el=>{const p=pr(el.dataset.id);p.active=el.checked;toast(el.checked?`${p.name} voltou a aparecer nas buscas.`:`${p.name} foi pausado e não aparece para clientes.`,el.checked?'play':'pause')},
  rf:el=>{S.rf=el.dataset.t;render()},
  onext:el=>{const o=S.orders.find(x=>x.id===el.dataset.id),fl=FLOW[o.ship],prev=o.st;o.st=fl[fl.indexOf(o.st)+1];render();toast(`Pedido #${o.id}: ${o.st.toLowerCase()}.`,'check',()=>{o.st=prev;render()})},
  of:el=>{S.of=el.dataset.t;render()},
  odet:el=>{const o=S.orders.find(x=>x.id===el.dataset.id);openModal(mhead('Pedido #'+o.id)+`<div class="mbody"><div class="okv">
    <div><span>Cliente</span><b>${esc(o.cli.name)}</b></div><div><span>Telefone</span><b class="num">${esc(o.cli.tel)}</b></div>
    <div><span>Recebimento</span><b>${shipTxt(o)}</b></div>${o.ship==='entrega'?`<div><span>Endereço</span><b style="text-align:right">${esc(o.addr)}</b></div>`:''}
    <div><span>Pagamento</span><b>${payTxt(o)}</b></div><div><span>Total</span><b class="big">${brl(oTotal(o))}</b></div></div>
    <div class="colist" style="margin:16px 0">${o.items.map(i=>{const p=pr(i.pid);return `<div class="coitem">${pimg(p)}<div><b>${esc(p.name)}</b><small>${[varTxt(i),i.qty+(i.qty===1?' unidade':' unidades')].filter(Boolean).join(' · ')}</small></div><span>${brl(i.price*i.qty)}</span></div>`}).join('')}</div>
    <div class="field"><span class="lb">Situação do pedido</span><div class="stsel">${[...FLOW[o.ship],'Cancelado'].map(x=>`<button class="${o.st===x?'on':''}" data-act="oset" data-id="${o.id}" data-v="${x}">${x}</button>`).join('')}</div></div>
    <button class="btn wa lg block" style="margin-top:16px" data-act="ocli" data-id="${o.id}">${ic('wa',20)}Chamar cliente no WhatsApp</button></div>`)},
  oset:el=>{const o=S.orders.find(x=>x.id===el.dataset.id);o.st=el.dataset.v;render();ACT.odet(el);toast(`Pedido #${o.id}: ${o.st.toLowerCase()}.`)},
  ocli:el=>{const o=S.orders.find(x=>x.id===el.dataset.id),s=st(o.store);openChat({title:o.cli.name,sub:o.cli.tel,msg:`Olá, ${o.cli.name.split(' ')[0]}! Aqui é da ${s.name}. Seu pedido #${o.id} está: ${o.st.toLowerCase()}.`,reply:'Perfeito, obrigado(a)! 🙌'})},
  endpromo:el=>{const p=pr(el.dataset.id);delete p.promo;toast(`Promoção de ${p.name} encerrada.`);render()},
  pin:(el,e)=>{const svg=el.querySelector('svg'),r=svg.getBoundingClientRect();S.pin={x:Math.round((e.clientX-r.left)/r.width*420),y:Math.round((e.clientY-r.top)/r.height*220)};el.innerHTML=mapSVG(S.pin.x,S.pin.y,false)},
  bigtext:()=>{S.big=!S.big;try{localStorage.setItem('ev-big',S.big?'1':'0')}catch(e){}render();toast(S.big?'Texto maior ativado.':'Texto no tamanho normal.','info')},
  qf:el=>{const k=el.dataset.k,f=S.f;if(k==='d1')f.dist=f.dist===1000?0:1000;if(k==='av')f.avail=!f.avail;if(k==='pr')f.promo=!f.promo;$('#filters').innerHTML=filtersHTML(search(S.params.q||''));renderResults()},
  help:()=>openChat({title:'Suporte Easy Vendas',sub:'Seg a sáb, das 8h às 18h',msg:S.view==='cadastro'?'Olá! Estou cadastrando minha loja e preciso de ajuda.':'Olá! Preciso de ajuda com o painel da minha loja.',reply:'Oi! Aqui é a Ana, do suporte da Easy Vendas 😊 Me conta onde você travou que eu te ajudo. Se preferir, eu te ligo ou passo na sua loja.'}),
  pmore:()=>openModal(mhead('Mais opções')+`<div class="mbody"><div class="form">${[['promos','tag','Promoções'],['stats','chart','Estatísticas'],['config','gear','Configurações']].map(([k,i,l])=>`<button class="sellcard" style="margin:0;text-align:left" data-go="painel:${k}">${ic(i,22)}<div class="si"><b>${l}</b></div>${ic('chev',18)}</button>`).join('')}<button class="sellcard" style="margin:0;text-align:left" data-go="home">${ic('back',22)}<div class="si"><b>Ver como cliente</b></div></button></div></div>`),
  plow:()=>{S.plow=true;go('painel',{id:'produtos'})},
  plowt:()=>{S.plow=!S.plow;render()},
  navail:el=>{S.draft.av=el.dataset.v==='1';el.parentNode.querySelectorAll('.hopt').forEach(b=>{b.classList.toggle('on',b===el);b.setAttribute('aria-checked',b===el)});$('#qtyf').hidden=!S.draft.av;updPreview()},
  nqty:el=>{const q=$('#n-qty');q.textContent=Math.max(1,Math.min(999,+q.textContent+ +el.dataset.d));updPreview()},
  spre:el=>{readDraft();S.draft.sizes=el.dataset.v?el.dataset.v.split(','):[];S.draft.open=true;render()},
  obtype:el=>{saveOb();S.ob.type=el.dataset.v;el.parentNode.querySelectorAll('.tile').forEach(b=>{b.classList.toggle('on',b===el);b.setAttribute('aria-checked',b===el)});el.closest('.field').classList.remove('bad')},
  obhours:el=>{saveOb();S.ob.hours=el.dataset.v;render()},
  obhas:el=>{S.ob.p.has=el.dataset.v==='1';el.parentNode.querySelectorAll('.hopt').forEach(b=>{b.classList.toggle('on',b===el);b.setAttribute('aria-checked',b===el)})},
  obback:()=>{saveOb();S.ob.step--;render();window.scrollTo(0,0)},
  obskip:()=>{saveOb();obFinish(false);render();window.scrollTo(0,0)},
  obstep4:()=>{S.ob.step=4;render();window.scrollTo(0,0)},
  obcep:()=>{saveOb();const d=S.ob.cep.replace(/\D/g,'');if(bad('ob-cep',d.length!==8))return;S.ob.addr=d.startsWith('3795')?'Rua Pimenta de Pádua – Centro':'Rua Coronel Diogo – Centro';render();toast('Endereço encontrado. Confira e coloque o número.','pin');setTimeout(()=>$('#ob-num')?.focus(),50)},
  howto:()=>openModal(mhead('Como funciona para lojistas')+`<div class="mbody"><div class="howto">${[['store','Cadastre a loja','Nome, endereço, horário e WhatsApp. Leva uns 5 minutos.'],['box','Coloque seus produtos','Foto, nome e preço. Dá para fazer pelo celular.'],['wa','Receba clientes no WhatsApp','O cliente chega com a mensagem pronta, citando o produto e o preço.']].map(([i,t,d])=>`<div><span class="ti">${ic(i,22)}</span><span><b>${t}</b><p>${d}</p></span></div>`).join('')}<p class="muted" style="font-size:15px">Sem comissão por venda. A venda acontece na sua loja, do seu jeito.</p><button class="btn primary lg block" data-go="login:lojista">Cadastrar minha loja</button></div></div>`),
  qadd:el=>{const p=pr(el.dataset.id);if(!p)return;if(hasVar(p)){toast('Escolha o tamanho ou a cor antes de adicionar.','info');go('produto',{id:p.id});return}addToCart(p,p.sizes[0]||'',p.colors[0]||'',1)},
  addcur:()=>{closeModal();const p=curP(),x=S.sel;let miss='';
    if(p.sizes.length>1&&!x.size)miss='size';else if(p.colors.length>1&&!x.color)miss='color';
    if(miss){const g=$('#vg-'+miss);if(g){g.classList.add('bad');g.scrollIntoView({behavior:'smooth',block:'center'})}toast(miss==='size'?'Escolha o tamanho antes de adicionar.':'Escolha a cor antes de adicionar.','info');return}
    addToCart(p,x.size||p.sizes[0]||'',x.color||p.colors[0]||'',x.qty||1)},
  pqty:el=>{const p=curP(),q=Math.max(1,Math.min(p.qty,(S.sel.qty||1)+ +el.dataset.d));S.sel.qty=q;$('#pqty').textContent=q;if(q===p.qty&&+el.dataset.d>0)toast(`A loja tem ${p.qty} em estoque.`,'info')},
  cq:el=>{const it=S.cart.find(i=>i.key===el.dataset.k);if(!it)return;const p=pr(it.pid),n=it.qty+ +el.dataset.d;if(n<1){ACT.crm(el);return}if(n>p.qty){toast(`A loja tem ${p.qty} em estoque.`,'info');return}it.qty=n;updCartCount();render()},
  crm:el=>{const i=S.cart.findIndex(x=>x.key===el.dataset.k);if(i<0)return;const [it]=S.cart.splice(i,1);updCartCount();render();toast('Produto removido do carrinho.','cart',()=>{S.cart.splice(i,0,it);updCartCount();render()})},
  ship:el=>{saveCo();S.ship[el.dataset.s]=el.dataset.v;render()},
  pay:el=>{saveCo();S.pay[el.dataset.s]=el.dataset.v;render()},
  addr:()=>{saveCo();openModal(mhead('Endereço de entrega')+`<div class="mbody"><form id="addrf" class="form" novalidate><div class="field big"><label for="ad-rua">Rua e número</label><input id="ad-rua" autocomplete="address-line1" value="${esc(S.addr.rua)}"><span class="err">Informe a rua e o número.</span></div><div class="field big"><label for="ad-bairro">Bairro</label><input id="ad-bairro" value="${esc(S.addr.bairro)}"><span class="err">Informe o bairro.</span></div><div class="field big"><label for="ad-comp">Complemento <small class="muted">(opcional)</small></label><input id="ad-comp" value="${esc(S.addr.comp)}" placeholder="Ex.: casa 2, fundos"></div><p class="muted">${CITY}</p><button class="btn primary lg block">Salvar endereço</button></form></div>`)},
  sheetclose:()=>closeSheet(),
  waorder:el=>{const o=S.orders.find(x=>x.id===el.dataset.id),s=st(o.store);openChat({s,msg:`Olá! Fiz o pedido #${o.id} na Easy Vendas (${brl(oTotal(o)).replace(/\s/,'')}). Está tudo certo?`,reply:'Oi! Recebemos seu pedido 😊 Já estamos separando e te avisamos quando estiver pronto.'})},
  savecfg:()=>{const f=$('#cfg-fee');if(f)DELIV[ME]=$('#cfg-ent').checked?money(f.value):0;toast('Configurações salvas.')}
};

/* ---------- Eventos ---------- */
document.addEventListener('click',e=>{
  if(!e.target.closest('form[data-search]'))document.querySelectorAll('.sugg').forEach(x=>x.remove());
  const a=e.target.closest('[data-act]');if(a&&ACT[a.dataset.act]){if(a.tagName==='A'||a.tagName==='BUTTON')e.preventDefault();if(a.type==='checkbox'){return}ACT[a.dataset.act](a,e);return}
  const g=e.target.closest('[data-go]');if(g){e.preventDefault();const[v,id]=g.dataset.go.split(':');go(v,id?{id}:{})}
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closeModal();closeFilters();document.querySelectorAll('.sugg').forEach(x=>x.remove())}
  if(e.key==='Enter'&&e.target.matches('article[data-go]')){e.target.click()}
});
$('#overlay').addEventListener('click',()=>{closeModal();closeFilters()});
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.closest('#filters')&&t.type!=='number'){readF();renderResults()}
  if(t.id==='f-sort'){S.f.sort=t.value;renderResults()}
  if(t.id==='p-sort'){S.psort=t.value;render()}
  if(t.dataset.act==='ptoggle'||t.dataset.act==='nvar')ACT[t.dataset.act](t);
  if(t.dataset.act==='bigtoggle')ACT.bigtext();
  if(t.id==='pr-prod'){S.promoSel=t.value;render()}
  if(t.id==='n-cat'||t.id==='n-av')updPreview();
  if(t.dataset.up){const files=[...t.files].slice(0,6);files.forEach(fl=>{const rd=new FileReader();rd.onload=()=>{
    if(t.dataset.up==='photos'){readDraft();S.draft.photos.push(rd.result);$('#uthumbs').innerHTML=S.draft.photos.map(u=>`<div style="background-image:url('${u}')"></div>`).join('');updPreview()}
    else if(t.dataset.up==='obphoto'){saveOb();S.ob.p.photo=rd.result;render()}
    else{if(t.dataset.up==='logo')S.logoImg=rd.result;else S.banImg=rd.result;render();toast('Imagem atualizada. Salve para publicar.','upload')}};rd.readAsDataURL(fl)})}
});
let deb;
document.addEventListener('input',e=>{
  const t=e.target;
  if(t.dataset.mask==='tel'){let d=t.value.replace(/\D/g,'').slice(0,11);t.value=d.length>6?`(${d.slice(0,2)}) ${d.slice(2,d.length-4)}-${d.slice(-4)}`:d.length>2?`(${d.slice(0,2)}) ${d.slice(2)}`:d}
  if(t.dataset.mask==='cep'){const d=t.value.replace(/\D/g,'').slice(0,8);t.value=d.length>5?d.slice(0,5)+'-'+d.slice(5):d}
  if(t.dataset.mask==='money'){const d=t.value.replace(/\D/g,'').replace(/^0+/,'').slice(0,9);t.value=d?(+d/100).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}):''}
  if(t.name==='q'&&t.form&&t.form.hasAttribute('data-search'))suggest(t);
  if(t.id==='f-min'||t.id==='f-max'){clearTimeout(deb);deb=setTimeout(()=>{readF();renderResults()},300)}
  if(t.closest('#pform'))updPreview();
  if(t.id==='pr-val')updDisc();
  if(t.id==='pq'){S.pq=t.value;const pos=t.selectionStart;render();const n=$('#pq');n.focus();n.setSelectionRange(pos,pos)}
  t.closest('.field')?.classList.remove('bad');
});
const bad=(id,cond)=>{const f=$('#'+id).closest('.field');f.classList.toggle('bad',!!cond);return !!cond};
document.addEventListener('submit',e=>{
  const f=e.target;e.preventDefault();
  if(f.hasAttribute('data-search')){const q=f.q.value.trim();go('busca',{q});return}
  if(f.id==='cof'){
    saveCo();const s=st(f.dataset.s),b=[bad('co-nome',S.co.name.trim().length<2),bad('co-tel',S.co.tel.replace(/\D/g,'').length<10)];
    if(b.some(Boolean)){toast('Falta preencher um campo. Ele está marcado em vermelho.','info');document.querySelector('.field.bad input')?.focus();return}
    const items=S.cart.filter(i=>pr(i.pid).store===s.id),sh=shipOf(s);
    const o={id:'EV'+(S.nextOrder++),store:s.id,cli:{...S.co},items:items.map(i=>({pid:i.pid,size:i.size,color:i.color,qty:i.qty,price:ep(pr(i.pid))})),ship:sh,fee:feeOf(s),addr:sh==='entrega'?`${S.addr.rua}${S.addr.comp?' ('+S.addr.comp+')':''} – ${S.addr.bairro}`:'',pay:S.pay[s.id]||'loja',date:'Hoje, '+now(),st:'Aguardando confirmação',mine:true};
    S.orders.unshift(o);S.cart=S.cart.filter(i=>pr(i.pid).store!==s.id);updCartCount();go('pedido',{id:o.id,novo:'1'});return}
  if(f.id==='addrf'){
    const b=[bad('ad-rua',$('#ad-rua').value.trim().length<4),bad('ad-bairro',$('#ad-bairro').value.trim().length<2)];if(b.some(Boolean))return;
    S.addr={rua:$('#ad-rua').value.trim(),bairro:$('#ad-bairro').value.trim(),comp:$('#ad-comp').value.trim()};closeModal();render();toast('Endereço atualizado.','home');return}
  if(f.id==='obf'){
    saveOb();const o=S.ob,n=o.step;let b=[];
    if(n===1)b=[bad('ob-name',o.name.trim().length<2),bad('ob-type',!o.type)];
    if(n===2)b=[bad('ob-addr',o.addr.trim().length<3),bad('ob-num',!o.num.trim())];
    if(n===3)b=[bad('ob-wa',o.wa.replace(/\D/g,'').length<10),o.hours==='outro'&&bad('ob-ht',!o.hoursTxt.trim())];
    if(n===4)b=[bad('ob-pname',o.p.name.trim().length<2),bad('ob-pprice',!(money(o.p.price)>0))];
    if(b.some(Boolean)){toast('Falta preencher um campo. Ele está marcado em vermelho.','info');document.querySelector('.field.bad input,.field.bad button')?.focus();return}
    if(n===4)obFinish(true);else o.step++;
    render();window.scrollTo(0,0);return}
  if(f.id==='resf'){
    const tel=$('#r-tel').value.replace(/\D/g,'');
    const b1=bad('r-nome',$('#r-nome').value.trim().length<2),b2=bad('r-tel',tel.length<10);if(b1||b2)return;
    const p=S.rq.p,r={id:'r'+Date.now(),cli:$('#r-nome').value.trim(),pid:p.id,size:$('#r-size').value,qty:+$('#r-qty').textContent,tel:$('#r-tel').value,date:'Hoje, '+now(),st:'Nova',msg:$('#r-msg').value.trim(),mine:true};
    S.reservas.unshift(r);reserveDone(r);return}
  if(f.id==='authf'){
    const l=S.ltype==='lojista',hasN=!!$('#a-nome');const b=[hasN&&bad('a-nome',$('#a-nome').value.trim().length<2),bad('a-mail',!/^\S+@\S+\.\S+$/.test($('#a-mail').value))];
    if(l){b.push(bad('a-tel',$('#a-tel').value.replace(/\D/g,'').length<10))}else b.push(bad('a-pass',$('#a-pass').value.length<6));
    if(b.some(Boolean)){toast('Falta preencher um campo. Ele está marcado em vermelho.','info');return}
    const nm=hasN?$('#a-nome').value.trim():$('#a-mail').value.split('@')[0].replace(/[._-]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
    S.user={name:nm,type:S.ltype};
    if(l){S.ob=newOb({name:S.user.name,tel:$('#a-tel').value});go('cadastro')}else{toast(`Bem-vindo(a), ${S.user.name.split(' ')[0]}!`,'user');go('perfil')}return}
  if(f.id==='pform'){
    const d=readDraft();const b1=bad('n-nome',d.name.trim().length<3),b2=bad('n-price',!(d.price>0)),b3=bad('n-promo',d.promo>0&&d.promo>=d.price);if(b3)$('details.more').open=true;if(b1||b2||b3){toast('Falta preencher um campo. Ele está marcado em vermelho.','info');return}
    const np=draftProduct();if(d.id){Object.assign(pr(d.id),np,{id:d.id})}else{np.id='n'+Date.now();np.views=0;PRODUCTS.unshift(np)}
    toast(d.id?'Alterações salvas.':'Produto publicado! Já aparece nas buscas perto de você.');go('painel',{id:'produtos'});return}
  if(f.id==='promof'){
    const p=pr($('#pr-prod').value),v=money($('#pr-val').value);if(bad('pr-val',!(v>0&&v<p.price)))return;
    const fim=new Date($('#pr-fim').value+'T12:00'),days=Math.round((fim-new Date())/864e5);
    p.promo=v;p.pe=days<=0?'Termina hoje':days===1?'Termina amanhã':`Termina em ${days} dias`;
    toast(`Promoção criada: ${p.name} com ${off(p)}% OFF.`,'tag');render();return}
  if(f.id==='lojaf'){const s=st(ME);s.name=$('#l-nome').value||s.name;s.desc=$('#l-desc').value;s.cat=$('#l-cat').value;s.addr=$('#l-addr').value;s.wa=$('#l-wa').value;s.ig=$('#l-ig').value;s.hours=$('#l-hr').value;toast('Loja atualizada. Os clientes já veem as mudanças.');render();return}
});

/* ---------- Início ---------- */
(function boot(){
  let h='';try{h=location.hash.slice(1)}catch(e){}
  const [v,id]=h.split('-');
  if(v&&(V[v]||v==='painel')){S.view=v;S.params=id?{id}:{}}
  try{S.big=localStorage.getItem('ev-big')==='1'}catch(e){}
  render();
})();
