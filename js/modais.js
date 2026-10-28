/* ---------- Modais ---------- */
function openModal(html,cls=''){const m=$('#modal');m.className='modal on '+cls;m.innerHTML=`<div class="mbox">${html}</div>`;$('#overlay').classList.add('on');setTimeout(()=>m.querySelector('input,textarea,button:not([data-act=closeModal])')?.focus(),60)}
function closeModal(){const m=$('#modal');if(!m.classList.contains('on'))return;m.className='modal';m.innerHTML='';if(!$('#filters.show'))$('#overlay').classList.remove('on')}
function closeFilters(){$('#filters')?.classList.remove('show');if(!$('#modal.on'))$('#overlay').classList.remove('on')}
const mhead=t=>`<div class="mhead"><h2>${t}</h2><button class="iconbtn" data-act="closeModal" aria-label="Fechar">${ic('x')}</button></div>`;

function reserveModal(p){
  const s=st(p.store);
  openModal(mhead('Reservar produto')+`<div class="mbody">
   <div class="mprod">${pimg(p)}<div><b>${esc(p.name)}</b><small>${brl(ep(p))} · ${s.name} · ${km(s.dist)}</small></div></div>
   <form class="form" id="resf" novalidate>
    <div class="field"><label for="r-nome">Nome</label><input id="r-nome" autocomplete="name" value="${esc(S.user?.name||'')}" placeholder="Seu nome"><span class="err">Informe seu nome.</span></div>
    <div class="field"><label for="r-tel">Telefone (WhatsApp)</label><input id="r-tel" inputmode="tel" data-mask="tel" placeholder="(35) 99999-9999"><span class="err">Informe um telefone com DDD.</span></div>
    <div class="row2"><div class="field"><label for="r-size">Tamanho</label><select id="r-size">${p.sizes.length?p.sizes.map(z=>`<option ${z===S.sel.size?'selected':''}>${z}</option>`).join(''):'<option>Único</option>'}</select></div>
     <div class="field"><span class="lb">Quantidade</span><div class="stepper"><button type="button" data-act="qty" data-d="-1" aria-label="Diminuir">−</button><span id="r-qty">1</span><button type="button" data-act="qty" data-d="1" aria-label="Aumentar">+</button></div></div></div>
    <div class="field"><label for="r-msg">Mensagem (opcional)</label><textarea id="r-msg" rows="2" placeholder="Ex.: Passo para retirar amanhã à tarde."></textarea></div>
    <div class="note">${ic('info',18)}<span>Esta reserva não realiza pagamento. A loja confirmará a disponibilidade pelo WhatsApp.</span></div>
    <button class="btn primary lg block">Solicitar reserva</button></form></div>`);
  S.rq={p,max:Math.max(1,Math.min(p.qty,5))};
}
function reserveDone(r){
  const p=pr(r.pid),s=st(p.store);
  $('#modal .mbox').innerHTML=`<div class="success"><div class="ok">${ic('check',38)}</div><h2>Reserva solicitada!</h2><p>A loja entrará em contato para confirmar.</p>
   <div class="sum"><div><span>Produto</span><b>${esc(p.name)}</b></div><div><span>Tamanho · Qtd.</span><b>${r.size} · ${r.qty}</b></div><div><span>Loja</span><b>${s.name} · ${km(s.dist)}</b></div><div><span>Retirada</span><b>${s.hours.split(' · ')[0]}</b></div></div>
   <div class="acts"><button class="btn wa lg" data-act="wa">${ic('wa',18)}Falar com a loja agora</button><button class="btn outline lg" data-act="route">${ic('nav',17)}Como chegar</button><button class="btn ghost" data-act="closeModal">Continuar explorando</button></div></div>`;
}
function openChat({s,msg,reply,cta,title,sub}){
  openModal(`<div class="chat-h"><button class="iconbtn" data-act="closeModal" aria-label="Fechar conversa">${ic('back')}</button>${s?logo(s,'sm'):`<div class="av" style="width:40px;height:40px">${esc(title[0])}</div>`}<div><b>${esc(title||s.name)}</b><small>${sub||'online · '+s.wa}</small></div></div>
   <div class="chat-b" id="chatb"><div class="chat-note">Simulação do WhatsApp. Na versão final, este botão abre a conversa direto no WhatsApp ${s?'da loja':'do cliente'}, com a mensagem já escrita.</div></div>
   <form class="chat-f" id="chatf"><textarea id="chatmsg" rows="2" aria-label="Mensagem">${esc(msg)}</textarea><button class="send" aria-label="Enviar">${ic('send',20)}</button></form>`,'m-chat');
  const b=$('#chatb');
  const bub=(t,c)=>{b.insertAdjacentHTML('beforeend',`<div class="bub ${c}">${esc(t)}<small>${now()}${c==='out'?' ✓✓':''}</small></div>`);b.scrollTop=b.scrollHeight};
  $('#chatf').onsubmit=e=>{e.preventDefault();const t=$('#chatmsg').value.trim();if(!t)return;bub(t,'out');$('#chatmsg').value='';
    if(reply){setTimeout(()=>{if(!$('#chatb'))return;b.insertAdjacentHTML('beforeend','<div class="typing" id="typ"><i></i><i></i><i></i></div>');b.scrollTop=b.scrollHeight},700);
      setTimeout(()=>{if(!$('#chatb'))return;$('#typ')?.remove();bub(reply,'in');if(cta){b.insertAdjacentHTML('beforeend',`<div class="chat-cta">${cta}</div>`);b.scrollTop=b.scrollHeight}},2200);reply=null}};
}
function waProduct(p){
  const s=st(p.store),sz=S.sel.pid===p.id&&S.sel.size?` tamanho ${S.sel.size}`:'';
  openChat({s,msg:`Olá! Vi o ${p.name} por ${brl(ep(p)).replace(/\s/,'')} na Easy Vendas. Ainda está disponível?`,
    reply:`Oi! Tudo bem? 😊 Temos sim o ${p.name}${sz}. Quer que eu separe um pra você retirar hoje? Estamos na ${s.addr.split(' – ')[0]}.`,
    cta:`<button class="btn primary sm" data-act="addcur">Adicionar ao carrinho</button><button class="btn outline sm" data-act="route">Como chegar</button>`});
}
function routeModal(s){
  const maps='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(s.addr+', '+CITY);
  const walk=Math.max(3,Math.round(s.dist/80)),car=Math.max(2,Math.round(s.dist/400));
  openModal(mhead('Como chegar')+`<div class="mbody">
   <div class="map">${mapSVG(330,58,true)}</div>
   <div class="route"><div><b>${km(s.dist)}</b><small>distância</small></div><div><b>${walk} min</b><small>a pé</small></div><div><b>${car} min</b><small>de carro</small></div></div>
   <div class="irow" style="margin-bottom:16px">${ic('pin',18)}<div><b>${s.name}</b><br><span class="muted">${s.addr}, ${CITY}</span><br><span class="${s.open?'open':'closed'}">${s.open?'Aberta agora':'Fechada agora'}</span> <span class="muted">· ${s.hours}</span></div></div>
   <a class="btn primary lg block" href="${maps}" target="_blank" rel="noopener">${ic('map',18)}Abrir no Google Maps</a></div>`);
}
function mapSVG(px,py,route){
  return (`<svg viewBox="0 0 420 220" role="img" aria-label="Mapa ilustrativo"><rect width="420" height="220" fill="var(--map)"/>
   ${[[20,20,90,60],[130,20,110,60],[280,20,120,30],[20,100,70,100],[110,100,90,45],[220,100,80,45],[320,80,80,60],[110,165,190,40],[320,160,80,45]].map(([x,y,w,h])=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="var(--block)"/>`).join('')}
   <path d="M0 90h420M0 155h420M100 0v220M210 0v220M310 0v220" stroke="var(--street)" stroke-width="10"/>
   <rect x="225" y="112" width="60" height="26" rx="6" fill="#bfe3c7" opacity=".7"/>
   ${route?`<path d="M70 175 V155 H210 V90 H${px}" fill="none" stroke="var(--blue)" stroke-width="4" stroke-dasharray="1 0" stroke-linecap="round" stroke-linejoin="round"/><circle cx="70" cy="178" r="12" fill="var(--blue)" opacity=".2"/><circle cx="70" cy="178" r="6" fill="var(--blue)" stroke="#fff" stroke-width="2"/><text x="84" y="196" font-size="11" font-weight="700" fill="var(--fg)" font-family="Inter,sans-serif">Você</text>`:''}
   <g transform="translate(${px-14} ${py-34})"><path d="M14 34S2 23 2 14a12 12 0 0 1 24 0c0 9-12 20-12 20Z" fill="var(--red)"/><circle cx="14" cy="14" r="4.5" fill="#fff"/></g></svg>`).replace(/(fill|stroke)="(var\([^)]+\))"/g,'style="$1:$2"');
}
function locModal(){
  openModal(mhead('Sua localização')+`<div class="mbody"><p class="muted" style="margin-bottom:14px">Mostramos lojas e distâncias a partir desta cidade.</p><div class="form">
   ${[[CITY,'10 lojas · 1.670 produtos',true],['Passos, MG','Em breve'],['Guaxupé, MG','Em breve'],['Franca, SP','Em breve']].map(([c,d,on])=>`<button class="sellcard" style="margin:0;text-align:left;${on?'border-color:var(--blue)':'opacity:.7'}" ${on?'data-act="closeModal"':'data-act="soon"'}>${ic('pin',20)}<div class="si"><b style="font-size:15px">${c}</b><small>${d}</small></div>${on?ic('check',20):''}</button>`).join('')}
   <div class="note">${ic('info',18)}<span>Na versão final, a distância é calculada a partir da sua localização atual ou do seu bairro.</span></div></div></div>`);
}

