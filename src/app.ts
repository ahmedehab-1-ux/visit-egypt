// @ts-nocheck -- legacy prototype code, lifted as-is. Remove this line once the module is typed (see README "Typing plan").
// App logic: DOM helpers, app state, cart/checkout, the search/results/detail
// page renderers, the map, the AI concierge NLU, and the hash router.
// This is still one large module on purpose: it is a faithful, verified-
// working lift of the original prototype script, not a redesign. Splitting it
// further (router.ts, pages/*.ts, state.ts, ui.ts, api/*.ts) is the natural next
// step once real API integrations start landing — see README.md.
/* eslint-disable */
import {
  S,
  KEYS,
  L,
  T,
  NK,
  NL,
  WORD,
  t,
  tx,
  CUR,
  fmt,
  esc,
  EGP,
  I,
  DEST,
  PHOTOS,
  PALIAS,
  ph,
  NILEPTS,
  VISA,
  visaFor,
  FAQ,
  EMERG,
  CLIMATE,
  MON,
  proj,
  OUT,
  NILE,
  LAKE,
  pts,
  smooth,
  hx,
  mix,
  rgb,
  cairoMinutes,
  fmtClock,
  STOPS,
  ERAS,
  EVENTS,
  HG,
  toGlyphs,
  countryOpts,
  NX,
  ic,
  VORDER,
  SHORT,
  GROUPS,
  VINFO,
  EGA,
  ORIG,
  AIRL,
  LOWCOST,
  DOM,
  apName,
  apCity,
  AP_OPTS,
  EG_AP_OPTS,
  DKEYS,
  DEST_OPTS,
  dn,
  HOTELS,
  GAL,
  CROUTES,
  CRUISES,
  LANG8,
  TOURS,
  ZONES,
  VEHS,
  CARS,
  ESIMS,
  DEVICES,
  NOESIM,
  TK,
  SITES,
  RESTS,
  RAIL,
  STATIONS,
  STN_D,
  INS,
  INSROWS,
  EXTRAS,
  PKGS,
  INC_LAB,
  TIERS,
} from './catalog';

const $=(s,r)=>(r||document).querySelector(s),$$=(s,r)=>[...(r||document).querySelectorAll(s)];
const app=$('#app');
const pad=n=>String(n).padStart(2,'0');
const iso=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const pd=s=>{const a=String(s).split('-').map(Number);return new Date(a[0],a[1]-1,a[2]);};
const TODAY=iso(new Date());
const addD=(s,n)=>{const d=pd(s);d.setDate(d.getDate()+n);return iso(d);};
const diffD=(a,b)=>Math.round((pd(b)-pd(a))/864e5);
const DW=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],MO=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const fD=(s,y)=>{if(!s)return '';const d=pd(s);return DW[d.getDay()]+' '+d.getDate()+' '+MO[d.getMonth()]+(y?' '+d.getFullYear():'');};
const hm=m=>{m=((Math.round(m)%1440)+1440)%1440;return pad(Math.floor(m/60))+':'+pad(m%60);};
const toMin=s=>{const a=String(s||'0:0').split(':').map(Number);return a[0]*60+(a[1]||0);};
const durS=m=>Math.floor(m/60)+'h'+(m%60?' '+pad(m%60)+'m':'');
const r2=n=>Math.round(n*100)/100;
const pl=(n,w,p)=>n+' '+(n===1?w:(p||w+'s'));
const uniq=a=>[...new Set(a)];
function rng(str){let h=1779033703^str.length;for(let i=0;i<str.length;i++){h=Math.imul(h^str.charCodeAt(i),3432918353);h=h<<13|h>>>19;}let a=h>>>0;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}

const KEY='visitegypt2';
Object.assign(S,{ctx:{start:addD(TODAY,42),nights:9,ad:2,ch:0,from:'LHR'},q:{},f:{},sort:{},cart:[],bookings:[],cache:{},sel:null,co:null,chat:[],cc:[],plan:null,planSpec:null,tab:'flights'});
(function(){try{
  const o=JSON.parse(localStorage.getItem('visitegypt')||'null');if(o){S.lang=o.lang||S.lang;S.cur=o.cur||S.cur;}
  const s=JSON.parse(localStorage.getItem(KEY)||'null');
  if(s){S.lang=s.lang||S.lang;S.cur=s.cur||S.cur;if(Array.isArray(s.cart))S.cart=s.cart;if(Array.isArray(s.bookings))S.bookings=s.bookings;if(s.ctx&&s.ctx.start>=TODAY)Object.assign(S.ctx,s.ctx);}
  else if(o&&Array.isArray(o.trip))S.cart=o.trip.map((i,x)=>({id:'m'+x,v:VORDER.includes(i.v)?i.v:'tours',ref:'',title:String(i.n||'Saved item'),sub:String(i.s||''),date:'',lines:[['Saved from the earlier prototype',+i.p||0,'']],total:+i.p||0,mode:i.status==='on request'?'request':'instant',refundable:true,policy:'Carried over from the earlier prototype. Open the listing again to set dates.',need:{}}));
}catch(e){}
if(!CUR[S.cur])S.cur='USD';if(!T[S.lang])S.lang='en';})();
function save(){try{localStorage.setItem(KEY,JSON.stringify({lang:S.lang,cur:S.cur,cart:S.cart,bookings:S.bookings,ctx:S.ctx}));}catch(e){}}

/* ---------- small UI helpers ---------- */
const pimg=(key,alt)=>PHOTOS[key]?`<img class="ph" src="${PHOTOS[key].src}" alt="${esc(alt||'')}" loading="lazy" decoding="async" onerror="this.remove()">`:'';
function plate(key,alt,o){o=o||{};const d=o.d&&DEST[o.d];const bg=d?` style="background:linear-gradient(150deg,${d.c[0]},${d.c[1]})"`:'';
  return `<div class="plate ${o.cls||''}"${bg}>${PHOTOS[key]?pimg(key,alt):(o.ico?`<div style="position:absolute;inset:0;display:grid;place-items:center;color:rgba(255,255,255,.85)"><svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" stroke-width="1.300" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[o.ico]}</svg></div>`:'')}${o.inner||''}</div>`;}
const starS=n=>`<span class="star" aria-label="${n} stars">${'★'.repeat(n)}</span>`;
const rateW=r=>r>=4.7?'Exceptional':r>=4.4?'Excellent':r>=4?'Very good':'Good';
const score=r=>`<span class="score"><b class="num">${r.toFixed(1)}</b>${rateW(r)}</span>`;
const modeBdg=k=>VINFO[k].mode==='request'?'<span class="bdg req">On request</span>':'<span class="bdg ok">Instant confirmation</span>';
const paxSum=q=>pl(q.ad,'adult')+(q.ch?', '+pl(q.ch,'child','children'):'')+(q.inf?', '+pl(q.inf,'infant'):'');
const LN=(label,amt,kind)=>[label,r2(amt),kind||''];
function mk(v,o){o.v=v;o.total=r2(o.lines.reduce((s,l)=>s+l[1],0));o.mode=o.mode||VINFO[v].mode;o.need=o.need||{};return o;}
function toast(m,href,lab){const e=$('#toast');e.innerHTML=`<span>${esc(m)}</span>${href?`<a href="${href}">${esc(lab)}</a>`:''}`;e.classList.add('show');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('show'),3200);}
function updCount(){$('#tripcount').textContent=S.cart.length;$('#tripcount').classList.toggle('hide',!S.cart.length);}
let UID=0;
function addCart(ci,btn,quiet){const c=JSON.parse(JSON.stringify(ci));c.id='c'+Date.now().toString(36)+(UID++);S.cart.push(c);save();updCount();
  if(!quiet)toast('Added to your trip: '+c.title,'#trips','View trip');
  if(btn){btn.classList.add('done');btn.innerHTML=ic('check','s')+' Added';}
  return c;}
function openModal(html,wide){const m=$('#modal');m.innerHTML=`<div class="box${wide?' wide':''}" role="dialog" aria-modal="true"><button class="xbtn" data-act="closemodal" aria-label="Close">✕</button>${html}</div>`;m.classList.add('open');$('#scrim').classList.add('open');}
function closeModal(){$('#modal').classList.remove('open');$('#scrim').classList.remove('open');const f=$('#filters');if(f)f.classList.remove('open');}
const linesHtml=(Q,open)=>`<div class="lines">${Q.lines.map(l=>`<div class="${l[2]==='t'?'t':''}"><span>${esc(l[0])}</span><span>${fmt(l[1])}</span></div>`).join('')}<div class="tot"><span>Total</span><span>${fmt(Q.total)}</span></div></div>`;
const polHtml=Q=>`<div class="pol"><span class="${Q.refundable?'':'warn'}">${ic(Q.refundable?'check':'info','s')}${esc(Q.policy||'')}</span>${Q.mode==='request'?`<span class="warn">${ic('info','s')}On request: in production our team confirms this within 24 hours and you are charged only once it is confirmed.</span>`:''}</div>`;

/* ---------- form kit ---------- */
function stepper(key,val,min,max,attr){return `<span class="stepper" ${attr||'data-step'}="${key}" data-min="${min}" data-max="${max}"><button type="button" data-d="-1" aria-label="Fewer"${val<=min?' disabled':''}>−</button><output>${val}</output><button type="button" data-d="1" aria-label="More"${val>=max?' disabled':''}>+</button></span>`;}
function fld(f,q,pre){const id=pre+'-'+f.id,v=q[f.id];let c='';
  if(f.type==='place'){const o=f.opts.find(o=>o[0]===v&&!o[2]);c=`<input type="text" id="${id}" data-combo="${f.id}" value="${esc(o?o[1]:'')}" placeholder="${esc(f.ph||'City or airport')}" autocomplete="off" role="combobox" aria-expanded="false" aria-autocomplete="list"><ul class="pop" hidden role="listbox"></ul>`;}
  else if(f.type==='select')c=`<select id="${id}" data-f="${f.id}">${f.opts.map(o=>{const a=Array.isArray(o)?o:[o,o];return `<option value="${esc(a[0])}"${String(a[0])===String(v)?' selected':''}>${esc(a[1])}</option>`;}).join('')}</select>`;
  else if(f.type==='date')c=`<input type="date" id="${id}" data-f="${f.id}" value="${esc(v||'')}" min="${f.min||TODAY}">`;
  else if(f.type==='pax')c=`<button type="button" class="paxbtn" id="${id}" data-pax="${f.id}" aria-haspopup="dialog" aria-expanded="false" aria-labelledby="${id}-l ${id}"><span>${esc(f.sum(q))}</span>${ic('chev','s')}</button><div class="pop paxpop" hidden>${f.rows.map(r=>`<div class="prow"><div><b>${r[1]}</b><small>${r[2]||''}</small></div>${stepper(r[0],q[r[0]],r[3],r[4])}</div>`).join('')}<button type="button" class="btn sm block" data-paxdone style="margin-top:10px">Done</button></div>`;
  else if(f.type==='seg')return `<div class="seg" role="group" aria-label="${esc(f.label)}">${f.opts.map(o=>`<button type="button" data-seg="${f.id}" data-v="${o[0]}" class="${o[0]===v?'on':''}" aria-pressed="${o[0]===v}">${esc(o[1])}</button>`).join('')}</div>`;
  else if(f.type==='gap')return `<div class="fld w${f.w} hide-m"></div>`;
  else c=`<input type="text" id="${id}" data-f="${f.id}" value="${esc(v||'')}" placeholder="${esc(f.ph||'')}">`;
  return `<div class="fld${f.w?' w'+f.w:''}" data-fld="${f.id}"${f.top?` style="width:${f.top}px;max-width:100%"`:''}>${f.type==='pax'?`<span class="lab" id="${id}-l">${esc(f.label)}</span>`:`<label for="${id}">${esc(f.label)}</label>`}${c}<span class="msg" hidden></span></div>`;}
function formHtml(specs,q,pre,extra){const top=specs.filter(f=>f.top||f.type==='seg'),main=specs.filter(f=>!(f.top||f.type==='seg'));
  return `<form class="sformwrap" novalidate>${top.length?`<div class="stop-row">${top.map(f=>fld(f,q,pre)).join('')}</div>`:''}<div class="sform">${main.map(f=>fld(f,q,pre)).join('')}<button class="btn go" type="submit">${ic('search','s')}${esc(tx('search'))}</button></div>${extra||''}</form>`;}
function showErrs(form,errs){$$('.fld',form).forEach(f=>{const m=errs[f.dataset.fld];f.classList.toggle('err',!!m);const s=$('.msg',f);if(s){s.hidden=!m;s.textContent=m||'';}});const first=$('.fld.err input,.fld.err select,.fld.err button',form);if(first)first.focus();return !Object.keys(errs).length;}
function closePops(root){$$('.paxpop',root||document).forEach(p=>{p.hidden=true;const b=p.previousElementSibling;if(b)b.setAttribute('aria-expanded','false');});}
/* mount a search form for vertical k into host; redraws itself when the field set changes */
function mountForm(host,k,onSubmit,pre){const X=VX[k],q=S.q[k]||(S.q[k]=X.q0());const specs=X.form(q);
  host.innerHTML=formHtml(specs,q,pre||'s',X.formExtra?X.formExtra(q):'');const form=host.firstElementChild;
  const changed=(id,redraw)=>{if(X.onField)X.onField(q,id);if(redraw||(X.redrawOn&&X.redrawOn.includes(id)))mountForm(host,k,onSubmit,pre);};
  form.addEventListener('change',e=>{const el=e.target.closest('[data-f]');if(el){q[el.dataset.f]=el.value;changed(el.dataset.f);}});
  form.addEventListener('click',e=>{
    const pb=e.target.closest('[data-pax]');if(pb){const pop=pb.nextElementSibling,op=pop.hidden;closePops();pop.hidden=!op;pb.setAttribute('aria-expanded',String(op));return;}
    const st=e.target.closest('.stepper button');if(st){const sp=st.parentElement,key=sp.dataset.step;const v=Math.max(+sp.dataset.min,Math.min(+sp.dataset.max,(+q[key]||0)+(+st.dataset.d)));q[key]=v;$('output',sp).textContent=v;sp.children[0].disabled=v<=+sp.dataset.min;sp.children[2].disabled=v>=+sp.dataset.max;const fl=st.closest('.fld'),f=specs.find(s=>s.id===fl.dataset.fld);if(f)$('.paxbtn span',fl).textContent=f.sum(q);return;}
    if(e.target.closest('[data-paxdone]')){closePops();return;}
    const sg=e.target.closest('[data-seg]');if(sg){q[sg.dataset.seg]=sg.dataset.v;changed(sg.dataset.seg,true);return;}
    const fa=e.target.closest('[data-fact]');if(fa&&X.formAct){X.formAct(q,fa.dataset.fact);mountForm(host,k,onSubmit,pre);}
  });
  $$('[data-combo]',form).forEach(inp=>{const f=specs.find(s=>s.id===inp.dataset.combo),pop=inp.nextElementSibling;let act=-1;
    const label=()=>{const o=f.opts.find(o=>o[0]===q[f.id]&&!o[2]);return o?o[1]:'';};
    const close=()=>{pop.hidden=true;inp.setAttribute('aria-expanded','false');};
    const draw=txt=>{const s=(txt||'').trim().toLowerCase();let rows=f.opts.filter(o=>o[2]||!s||o[1].toLowerCase().includes(s)||String(o[3]||'').toLowerCase().includes(s));rows=rows.filter((o,i)=>!o[2]||(rows[i+1]&&!rows[i+1][2]));act=-1;
      pop.innerHTML=rows.some(o=>!o[2])?rows.map(o=>o[2]?`<li class="grp">${esc(o[1])}</li>`:`<li role="option" data-v="${esc(o[0])}"><span>${esc(o[1])}</span>${o[3]?`<small>${esc(o[3])}</small>`:''}</li>`).join(''):'<li class="none">No match. Try a city name or airport code.</li>';pop.hidden=false;inp.setAttribute('aria-expanded','true');};
    const pick=v=>{q[f.id]=v;inp.value=label();close();changed(f.id);};
    inp.addEventListener('focus',()=>{inp.select();draw('');});
    inp.addEventListener('input',()=>draw(inp.value));
    inp.addEventListener('keydown',e=>{const lis=$$('li[data-v]',pop);
      if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(pop.hidden){draw('');return;}if(!lis.length)return;act=(act+(e.key==='ArrowDown'?1:-1)+lis.length)%lis.length;lis.forEach((l,i)=>l.classList.toggle('act',i===act));lis[act].scrollIntoView({block:'nearest'});}
      else if(e.key==='Enter'){if(!pop.hidden&&lis.length){e.preventDefault();pick(lis[Math.max(0,act)].dataset.v);}}
      else if(e.key==='Escape')close();});
    inp.addEventListener('blur',()=>setTimeout(()=>{close();inp.value=label();},150));
    pop.addEventListener('mousedown',e=>{const li=e.target.closest('li[data-v]');if(li){e.preventDefault();pick(li.dataset.v);inp.blur();}});
  });
  form.addEventListener('submit',e=>{e.preventDefault();closePops();const errs=X.validate?X.validate(q):{};if(showErrs(form,errs)){if(X.onSearch)X.onSearch(q);onSubmit&&onSubmit();}});
  return form;}
document.addEventListener('click',e=>{if(!e.target.closest('.fld'))closePops();});

/* ---------- map (geometry preserved from v1, palette redrawn for the light system) ---------- */
function mapSVG(o){o=o||{};const sel=o.sel,route=o.route;
  const lbl=(x,y,s,txt,rot,fill)=>{const p=proj(x,y);return `<text x="${p[0]}" y="${p[1]}" font-family="Instrument Serif, serif" font-style="italic" font-size="${s}" fill="${fill}" ${rot?`transform="rotate(${rot} ${p[0]} ${p[1]})"`:''} text-anchor="middle">${txt}</text>`;};
  let r='';if(route&&route.length>1){r=`<polyline class="route" points="${route.map(p=>p.map(n=>n.toFixed(1)).join(',')).join(' ')}"/>`+route.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="${i===0?6:4.500}" fill="${i===0?'#1034A6':'#fff'}" stroke="#1034A6" stroke-width="2"/>`).join('');}
  const keys=o.pins===false?[]:Array.isArray(o.pins)?o.pins:Object.keys(DEST);
  return `<svg viewBox="0 0 630 510" role="img" aria-label="Map of Egypt">
  <defs><linearGradient id="land" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FBF6EA"/><stop offset="1" stop-color="#EBDDBF"/></linearGradient></defs>
  ${lbl(28.200,31.700,21,'Mediterranean Sea',0,'rgba(56,98,128,.6)')}${lbl(35.700,25.400,21,'Red Sea',-58,'rgba(56,98,128,.6)')}
  <polygon points="${pts(OUT)}" fill="url(#land)" stroke="#C9B78E" stroke-width="1.200"/>
  <polygon points="${pts([[31.230,30.040],[30.250,31.400],[31.000,31.580],[31.900,31.450]])}" fill="#9CC08F" opacity=".55"/>
  <path d="${smooth(LAKE)}" stroke="#3A9DB8" stroke-width="7" fill="none" stroke-linecap="round" opacity=".85"/>
  <path d="${smooth(NILE)}" stroke="#3A9DB8" stroke-width="3.200" fill="none" stroke-linecap="round"/>
  <path d="${smooth([[31.230,30.040],[31.000,30.500],[30.600,31.000],[30.400,31.450]])}" stroke="#3A9DB8" stroke-width="2" fill="none"/>
  <path d="${smooth([[31.230,30.040],[31.400,30.600],[31.600,31.000],[31.820,31.420]])}" stroke="#3A9DB8" stroke-width="2" fill="none"/>
  <path d="${smooth([[32.300,31.270],[32.330,30.600],[32.560,29.950]])}" stroke="#3A9DB8" stroke-width="1.200" fill="none" stroke-dasharray="3 2"/>
  ${lbl(27.400,26.200,25,'Western Desert',0,'rgba(120,92,50,.45)')}${lbl(33.850,29.250,19,'Sinai',0,'rgba(120,92,50,.55)')}${lbl(32.000,23.250,13,'Lake Nasser',-48,'rgba(20,90,110,.85)')}${lbl(32.300,27.100,13,'Nile',-62,'rgba(20,90,110,.85)')}
  ${r}
  ${keys.map(k=>{const d=DEST[k];const [x,y]=proj(d.lon,d.lat);const dim=S.mood&&o.moods&&!d.mood.includes(S.mood);return `<g class="pin ${k===sel?'on':''} ${dim?'dim':''}" data-pin="${k}" tabindex="0" role="button" aria-label="${d.name}"><circle class="ring" cx="${x}" cy="${y}" r="7"/><circle class="dot" cx="${x}" cy="${y}" r="${k===sel?7.500:5.500}"/><text x="${x+d.lab[0]}" y="${y+d.lab[1]}" text-anchor="${d.lab[2]}">${d.name}</text></g>`;}).join('')}
  </svg>`;}
function bindPins(root,fn){$$('[data-pin]',root).forEach(p=>{const go=()=>fn(p.dataset.pin);p.onclick=go;p.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}};});}
const destPt=k=>proj(DEST[k].lon,DEST[k].lat);

/* ---------- generic list page ---------- */
function vertHead(k){const V=VINFO[k];const cls=k==='cruises'?' cruise':k==='packages'?' pkg':'';
  return `<section class="vh${cls}"><div class="wrap">
    <nav class="crumb"><a href="#home">Home</a><span>${esc(tx(k))}</span></nav>
    <div class="row between wrapx" style="align-items:end;margin-top:10px"><div><div class="eye">${esc(tx(GROUPS.find(g=>g[1].includes(k))[0]))}</div><h1>${esc(V.h)}</h1><p class="sub">${esc(V.d)}</p></div>${modeBdg(k)}</div>
    <button class="sedit" data-act="sedit" aria-controls="shost"><span id="ssum"></span><b>Edit search</b></button><div class="spanel" id="shost"></div></div>
    ${k==='cruises'?'<svg class="river" viewBox="0 0 1200 70" preserveAspectRatio="none" aria-hidden="true"><path d="M0,40 C150,5 300,70 450,38 S750,5 900,40 S1100,66 1200,30" fill="none" stroke="#7FD6C7" stroke-width="2" stroke-dasharray="2 10"/></svg>':''}
  </section>`;}
function fstate(k){return S.f[k]||(S.f[k]={m:{},b:{},max:null});}
function passes(k,it,q){const X=VX[k],f=fstate(k);for(const fc of X.facets){
  if(fc.type==='multi'){const s=f.m[fc.id];if(s&&s.length){const v=fc.vals(it,q),arr=Array.isArray(v)?v:[v];if(!s.some(x=>arr.includes(x)))return false;}}
  else if(fc.type==='bool'){if(f.b[fc.id]&&!fc.test(it,q))return false;}
  else if(fc.type==='max'){if(f.max!=null&&X.price(it,q)>f.max)return false;}}return true;}
function nActive(k){const f=fstate(k);return Object.values(f.m).reduce((s,a)=>s+a.length,0)+Object.values(f.b).filter(Boolean).length+(f.max!=null?1:0);}
function filtersHtml(k,all,q){const X=VX[k],f=fstate(k);if(!all.length)return '';
  return `<div class="fhead"><h3>Filters</h3><div class="row"><button class="link small" data-act="clearf">Clear all</button><button class="btn sm quiet fclose" data-act="closef">Done</button></div></div>`+X.facets.map(fc=>{
    if(fc.type==='multi'){const cnt={};all.forEach(it=>{const v=fc.vals(it,q);(Array.isArray(v)?v:[v]).forEach(x=>{cnt[x]=(cnt[x]||0)+1;});});let keys=Object.keys(cnt);if(fc.order)keys.sort((a,b)=>fc.order.indexOf(a)-fc.order.indexOf(b));else keys.sort((a,b)=>cnt[b]-cnt[a]||a.localeCompare(b));if(keys.length<2)return '';
      return `<div class="facet"><h4>${esc(fc.label)}</h4>${keys.map(v=>`<label class="fopt"><input type="checkbox" data-fm="${fc.id}" value="${esc(v)}"${(f.m[fc.id]||[]).includes(v)?' checked':''}><span>${esc(v)}</span><small>${cnt[v]}</small></label>`).join('')}</div>`;}
    if(fc.type==='bool'){const n=all.filter(it=>fc.test(it,q)).length;if(!n||n===all.length)return '';return `<div class="facet"><label class="fopt"><input type="checkbox" data-fb="${fc.id}"${f.b[fc.id]?' checked':''}><span><b>${esc(fc.label)}</b></span><small>${n}</small></label></div>`;}
    if(fc.type==='max'){const ps=all.map(it=>X.price(it,q)),lo=Math.floor(Math.min(...ps)),hi=Math.ceil(Math.max(...ps));if(hi-lo<2)return '';const v=f.max==null?hi:Math.min(hi,Math.max(lo,f.max));
      return `<div class="facet"><h4><span>${esc(fc.label||'Maximum price')}</span><span class="num" id="fmaxv" style="color:var(--ink);letter-spacing:0;text-transform:none">${fmt(v)}</span></h4><input type="range" id="fmax" aria-label="${esc(fc.label||'Maximum price')}" min="${lo}" max="${hi}" step="${hi-lo>400?10:1}" value="${v}" data-hi="${hi}"></div>`;}
    return '';}).join('');}
function pageList(k){const X=VX[k];const q=S.q[k]||(S.q[k]=X.q0());S.sort[k]=S.sort[k]||X.sorts[0][0];
  app.innerHTML=vertHead(k)+`<div class="wrap layout"><aside class="filters" id="filters" aria-label="Filters"></aside><section id="results" aria-live="polite"></section></div>`;
  mountForm($('#shost'),k,()=>runSearch(k,true));
  const fl=$('#filters');
  fl.addEventListener('change',e=>{const f=fstate(k),el=e.target;if(el.dataset.fm){const a=f.m[el.dataset.fm]||(f.m[el.dataset.fm]=[]);if(el.checked)a.push(el.value);else a.splice(a.indexOf(el.value),1);}else if(el.dataset.fb)f.b[el.dataset.fb]=el.checked;else return;drawResults(k);});
  fl.addEventListener('input',e=>{if(e.target.id==='fmax'){const f=fstate(k),v=+e.target.value;f.max=v>=+e.target.dataset.hi?null:v;$('#fmaxv').textContent=fmt(v);drawResults(k);}});
  runSearch(k,false);}
function runSearch(k,skel){const X=VX[k],q=S.q[k],res=$('#results');if(!res)return;
  const errs=X.validate?X.validate(q):{};
  if(Object.keys(errs).length){const v0=$('.vh');if(v0)v0.classList.add('editing');S.cache[k]=[];$('#filters').innerHTML='';res.innerHTML=`<div class="empty">${ic('info')}<h3>Check your search</h3><p>${esc(Object.values(errs)[0])}</p></div>`;return;}
  const vh=$('.vh');if(vh&&skel)vh.classList.remove('editing');const all=S.cache[k]=X.list(q);S.f[k]={m:{},b:{},max:null};$('#filters').innerHTML=filtersHtml(k,all,q);
  if(skel){res.innerHTML=`<div class="rlist">${[0,1,2].map(()=>`<div class="sk"><div class="shim" style="width:38%"></div><div class="shim" style="width:72%"></div><div class="shim" style="width:55%"></div></div>`).join('')}</div>`;clearTimeout(runSearch._t);runSearch._t=setTimeout(()=>{if($('#results')===res)drawResults(k);},420);}
  else drawResults(k);}
function drawResults(k){const X=VX[k],q=S.q[k],res=$('#results');if(!res)return;const all=S.cache[k]||[];const ss=$('#ssum');if(ss&&X.summary)ss.textContent=X.summary(q);
  let items=all.filter(it=>passes(k,it,q));const srt=X.sorts.find(s=>s[0]===S.sort[k])||X.sorts[0];items=items.slice().sort((a,b)=>srt[2](a,b,q));
  const na=nActive(k);
  const head=`<div class="rhead"><div><b class="num">${items.length}</b> ${items.length===1?'result':tx('results')}${X.summary?` <span class="muted">· ${esc(X.summary(q))}</span>`:''}</div><div class="row"><button class="btn sm ghost fbtn" data-act="openf">${ic('filter','s')}Filters${na?` (${na})`:''}</button><label class="row small muted" for="sortsel">${tx('sort')}<select id="sortsel">${X.sorts.map(s=>`<option value="${s[0]}"${s[0]===srt[0]?' selected':''}>${esc(s[1])}</option>`).join('')}</select></label></div></div>`;
  const note=`<div class="demo-note">${ic('info','s')}<span>Demo inventory. These are sample listings and prices for this prototype, not live availability. In production this page is supplied by: ${esc(VINFO[k].src)}.</span></div>`;
  let body;
  if(!all.length)body=`<div class="empty">${ic('search')}<h3>Nothing for this search</h3><p>${esc(X.none?X.none(q):'Try different dates or another destination.')}</p></div>`;
  else if(!items.length)body=`<div class="empty">${ic('filter')}<h3>No matches with these filters</h3><p>${all.length} ${all.length===1?'option is':'options are'} hidden by your filters.</p><button class="btn sm" data-act="clearf">Clear all filters</button></div>`;
  else body=(X.pre?X.pre(items,q):'')+(X.table?X.table(items,q):`<div class="${X.grid?'grid3':'rlist'} fade">${items.map(it=>X.card(it,q)).join('')}</div>`);
  res.innerHTML=head+note+body;
  $('#sortsel').onchange=e=>{S.sort[k]=e.target.value;drawResults(k);};}

/* ---------- generic detail page ---------- */
function gallery(keys,title,cap){keys=uniq(keys.filter(k=>PHOTOS[k])).slice(0,5);if(!keys.length)return '';S.gal=keys;
  return `<div class="gal n${Math.min(keys.length,5)}">${keys.map((k,i)=>`<button class="plate zoom" data-act="lightbox" data-i="${i}" aria-label="Open photo ${i+1} of ${keys.length}">${pimg(k,title)}</button>`).join('')}<span class="cap">${esc(cap||'Destination photography')}</span></div>`;}
function lightbox(i){const k=S.gal[i];openModal(`<div class="lb">${pimg(k,'')}</div><div class="lbnav"><button data-act="lightbox" data-i="${(i-1+S.gal.length)%S.gal.length}">‹ Previous</button><span>${i+1} / ${S.gal.length} · ${esc((PHOTOS[k].credit||'').replace('Photo: ',''))}</span><button data-act="lightbox" data-i="${(i+1)%S.gal.length}">Next ›</button></div>`,true);}
function ctl(c,sel){
  if(c.t==='date')return `<div class="ctl"><label class="lab" for="b-${c.id}">${esc(c.label)}</label><input type="date" id="b-${c.id}" data-s="${c.id}" value="${esc(sel[c.id]||'')}" min="${TODAY}"></div>`;
  if(c.t==='dates')return `<div class="ctl"><div class="two"><div class="ctl"><label class="lab" for="b-${c.a}">${esc(c.la)}</label><input type="date" id="b-${c.a}" data-s="${c.a}" value="${esc(sel[c.a]||'')}" min="${TODAY}"></div><div class="ctl"><label class="lab" for="b-${c.b}">${esc(c.lb)}</label><input type="date" id="b-${c.b}" data-s="${c.b}" value="${esc(sel[c.b]||'')}" min="${TODAY}"></div></div></div>`;
  if(c.t==='chips')return `<div class="ctl"><span class="lab">${esc(c.label)}</span><div class="slots">${c.opts.map(o=>`<button type="button" class="chip ${String(sel[c.id])===String(o[0])?'on':''}" data-sc="${c.id}" data-v="${esc(o[0])}"${o[2]?' disabled title="Sold out in this demo"':''}>${esc(o[1])}</button>`).join('')}</div>${c.hint?`<span class="tiny muted">${esc(c.hint)}</span>`:''}</div>`;
  if(c.t==='radio')return `<div class="ctl"><span class="lab">${esc(c.label)}</span><div class="optl">${c.opts.map(o=>`<label class="opt ${String(sel[c.id])===String(o[0])?'on':''}"><input type="radio" name="b-${c.id}" data-s="${c.id}" value="${esc(o[0])}"${String(sel[c.id])===String(o[0])?' checked':''}><span><b>${esc(o[1])}</b>${o[2]?`<small>${esc(o[2])}</small>`:''}</span><span class="pr">${o[3]||''}</span></label>`).join('')}</div></div>`;
  if(c.t==='step')return `<div class="prow" style="padding:2px 0;border:0"><div><b>${esc(c.label)}</b><small>${esc(c.sub||'')}</small></div>${stepper(c.id,sel[c.id],c.min,c.max,'data-ss')}</div>`;
  if(c.t==='check')return `<label class="opt ${sel[c.id]?'on':''}"><input type="checkbox" data-sb="${c.id}"${sel[c.id]?' checked':''}><span><b>${esc(c.label)}</b>${c.sub?`<small>${esc(c.sub)}</small>`:''}</span><span class="pr">${c.pr||''}</span></label>`;
  if(c.t==='select')return `<div class="ctl"><label class="lab" for="b-${c.id}">${esc(c.label)}</label><select id="b-${c.id}" data-s="${c.id}">${c.opts.map(o=>`<option${o===sel[c.id]?' selected':''}>${esc(o)}</option>`).join('')}</select></div>`;
  if(c.t==='text')return `<div class="ctl"><label class="lab" for="b-${c.id}">${esc(c.label)}</label><input type="text" id="b-${c.id}" data-st="${c.id}" value="${esc(sel[c.id]||'')}" placeholder="${esc(c.ph||'')}" maxlength="120"></div>`;
  if(c.t==='head')return `<span class="lab" style="font-size:11.500px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)">${esc(c.label)}</span>`;
  return `<div class="small muted">${c.html||''}</div>`;}
function pageDetail(k,id){const X=VX[k];const q=S.q[k]||(S.q[k]=X.q0());const it=X.detail?X.get(id,q):null;
  if(!it){app.innerHTML=`<div class="wrap dwrap"><div class="empty">${ic('search')}<h3>We could not find that listing</h3><p>It may have been renamed in this prototype.</p><a class="btn" href="#${k}">Browse ${esc(tx(k))}</a></div></div>`;return;}
  S.sel=X.sel0(it,q);S.selCtx={k,id};const D=X.detail(it,q);document.body.classList.add('hasbar');
  app.innerHTML=`<div class="wrap dwrap fade">
    <nav class="crumb"><a href="#home">Home</a><span><a href="#${k}">${esc(tx(k))}</a></span><span>${esc(D.title)}</span></nav>
    <div class="dh"><div>${D.kicker?`<div class="eye">${D.kicker}</div>`:''}<h1>${esc(D.title)}</h1><div class="dmeta">${D.meta||''}</div></div><span class="bdg demo">Demo listing · sample prices</span></div>
    ${gallery(D.photos||[],D.title,D.cap)}
    <div class="dgrid"><div>${D.body}</div><aside><div class="bbox" id="bbox"></div></aside></div></div>
    <div class="mbar"><div class="price num" id="mbarp"></div><button class="btn" data-act="tobox">Choose and book</button></div>`;
  const box=$('#bbox');const redraw=()=>drawBox(k,it,q);
  box.addEventListener('change',e=>{const el=e.target;if(el.dataset.s){S.sel[el.dataset.s]=el.type==='radio'&&/^\d+$/.test(el.value)?+el.value:el.value;redraw();}else if(el.dataset.sb){S.sel[el.dataset.sb]=el.checked;redraw();}});
  box.addEventListener('input',e=>{if(e.target.dataset.st)S.sel[e.target.dataset.st]=e.target.value;});
  box.addEventListener('click',e=>{const c=e.target.closest('[data-sc]');if(c&&!c.disabled){S.sel[c.dataset.sc]=c.dataset.v;redraw();return;}
    const st=e.target.closest('.stepper button');if(st){const sp=st.parentElement,key=sp.dataset.ss;S.sel[key]=Math.max(+sp.dataset.min,Math.min(+sp.dataset.max,(+S.sel[key]||0)+(+st.dataset.d)));redraw();return;}
    const b=e.target.closest('[data-book]');if(b){const Q=X.quote(it,q,S.sel);if(Q.err)return;addCart(Q,b.dataset.book==='add'?b:null,b.dataset.book==='now');if(b.dataset.book==='now')location.hash='checkout';}});
  redraw();if(X.after)X.after(it,q);}
function drawBox(k,it,q){const X=VX[k],sel=S.sel,Q=X.quote(it,q,sel);const C=X.conf(it,q,sel);
  $('#bbox').innerHTML=`<div class="from"><div class="price num">${fmt(Q.err?X.price(it,q):Q.total)}<small>${Q.err?esc(X.unit(it,q)):'total for your selection'}</small></div>${modeBdg(k)}</div>${C.map(c=>ctl(c,sel)).join('')}
    ${Q.err?`<div class="alert">${ic('info','s')}<span>${esc(Q.err)}</span></div>`:linesHtml(Q)+polHtml(Q)}
    <div class="col" style="gap:8px"><button class="btn lg block" data-book="add"${Q.err?' disabled':''}>${esc(tx('add'))}</button><button class="btn ghost block" data-book="now"${Q.err?' disabled':''}>Book now</button></div>
    <p class="tiny muted" style="text-align:center">Nothing is charged in this prototype.</p>`;
  const mp=$('#mbarp');if(mp)mp.innerHTML=`${fmt(Q.err?X.price(it,q):Q.total)}<small>${Q.err?esc(X.unit(it,q)):'total'}</small>`;}
/* ===== booking verticals 1–6: flights, hotels, cruises, tours, transfers, cars ===== */
const VX={};
const PAXF=(w,label)=>({id:'pax',label:label||'Travellers',type:'pax',w:w||2,rows:[['ad','Adults','12 and over',1,9],['ch','Children','2 to 11',0,6]],sum:paxSum});
const byId=(arr,id)=>arr.find(x=>x.id===id);
const dsec=(h,html)=>`<section class="dsec"><h2>${h}</h2>${html}</section>`;
const ckl=(a,no)=>`<ul class="ck${no?' no':''}">${a.map(x=>`<li>${x}</li>`).join('')}</ul>`;
const destLink=d=>`<a class="link" href="#dest-${d}">${ic('pin','s')}${DEST[d].name}</a>`;
const BANDS=['Morning (05:00–12:00)','Afternoon (12:00–18:00)','Evening (18:00–24:00)','Night (00:00–05:00)'];
const band=m=>{m=m%1440;return m<300?BANDS[3]:m<720?BANDS[0]:m<1080?BANDS[1]:BANDS[2];};
const kv=a=>`<div class="kv">${a.map(x=>`<div><small>${x[0]}</small><b>${x[1]}</b></div>`).join('')}</div>`;
function slotAvail(seed,slots){const R=rng(seed);const a=slots.map(s=>[s,s,slots.length>1&&R()<.220]);if(a.every(x=>x[2]))a[0][2]=false;return a;}
const firstFree=(a,want)=>{const free=a.filter(x=>!x[2]);if(!free.length)return '';if(want){const w=toMin(want);return free.slice().sort((x,y)=>Math.abs(toMin(x[0])-w)-Math.abs(toMin(y[0])-w))[0][0];}return free[0][0];};
const demoRatings=it=>{const R=rng(it.id+'r');return ['Location','Cleanliness','Service','Value'].map(n=>[n,Math.max(3.600,Math.min(5,it.r+(R()-.5)*.500))]);};

/* ---------- 1. flights ---------- */
function flightSpecs(a,b){const out=[],eA=!!EGA[a],eB=!!EGA[b];
  if(eA&&eB){
    if(a==='ABS'||b==='ABS'){const o=a==='ABS'?b:a;if(o==='ASW')out.push({car:['MS'],dur:45,base:95,stops:0});else if(o==='CAI')out.push({car:['MS'],dur:DOM.ASW[0]+45+70,base:DOM.ASW[1]+80,stops:1,via:'ASW',lay:70});}
    else if(a==='CAI'||b==='CAI'){const o=a==='CAI'?b:a;if(DOM[o])out.push({car:o==='HBE'?['MS']:['MS','SM','NP'],dur:DOM[o][0],base:DOM[o][1],stops:0});}
    else if(a==='SPX'||b==='SPX'){const o=a==='SPX'?b:a;if(DOM[o]&&o!=='HBE')out.push({car:['SM'],dur:DOM[o][0]+5,base:Math.round(DOM[o][1]*.920),stops:0});}
    else if(DOM[a]&&DOM[b])out.push({car:['MS'],dur:DOM[a][0]+DOM[b][0]+80,base:Math.round((DOM[a][1]+DOM[b][1])*.900),stops:1,via:'CAI',lay:80});
  }else if(eA||eB){const o=eA?b:a,e=eA?a:b,O=ORIG[o];if(!O)return out;
    if(e==='CAI'){out.push({car:O[4],dur:O[2],base:O[3],stops:0});if(O[5])out.push({car:[O[5][0]],dur:O[2]+O[5][2],base:Math.round(O[3]*.860),stops:1,via:O[5][1],lay:O[5][2]-25});}
    else if(e==='HRG'||e==='SSH'){if(O[6])out.push({car:[O[6]],dur:O[2]+25,base:Math.round(O[3]*.820),stops:0});out.push({car:['MS'],dur:O[2]+DOM[e][0]+95,base:O[3]+Math.round(DOM[e][1]*.600),stops:1,via:'CAI',lay:95});}
    else if(e==='SPX'){if(O[6])out.push({car:[O[6]],dur:O[2]+10,base:Math.round(O[3]*.800),stops:0});}
    else if(DOM[e])out.push({car:['MS'],dur:O[2]+DOM[e][0]+95,base:O[3]+Math.round(DOM[e][1]*.600),stops:1,via:'CAI',lay:95});}
  return out;}
function flightSearch(a,b,date,cabin){const legs=[];if(!a||!b||!date)return legs;const cm={Economy:1,'Premium economy':1.600,Business:3.100}[cabin]||1;const intl=!(EGA[a]&&EGA[b]);const dow=pd(date).getDay();
  const tz=intl?(EGA[b]?-ORIG[a][7]:ORIG[b][7]):0;
  flightSpecs(a,b).forEach((sp,si)=>sp.car.forEach(c=>{const R=rng([a,b,date,c,si].join('|'));const n=sp.stops?1+(R()>.5?1:0):(intl?2:3);const used=[];
    for(let i=0;i<n;i++){let dep=Math.round((320+R()*980)/5)*5;if(used.some(u=>Math.abs(u-dep)<90))dep=(dep+185)%1380;used.push(dep);
      const dur=sp.dur+Math.round((R()*20-8)/5)*5,arr=dep+dur+tz,no=c+' '+(100+Math.floor(R()*880));
      const p=Math.round((intl?sp.base*.540:sp.base)*cm*(.880+R()*.360)*(dow===5||dow===6?1.070:1)*(LOWCOST.includes(c)?.900:1));
      legs.push({id:no.replace(' ','')+'-'+a+b+'-'+date.replace(/-/g,'')+'-'+hm(dep).replace(':',''),car:c,no,from:a,to:b,date,dep,arr,plus:Math.floor(arr/1440),dur,stops:sp.stops,via:sp.via||'',lay:sp.lay||0,p});}}));
  return legs.sort((x,y)=>x.dep-y.dep);}
const FARES=[['Saver',1,c=>[LOWCOST.includes(c)?'Cabin bag only, 8 kg':'One 23 kg checked bag','Seat assigned at check-in','Changes for a fee, non-refundable']],['Classic',1.160,()=>['One 23 kg checked bag','Choose your seat','Changes for a fee, non-refundable']],['Flex',1.420,()=>['Two 23 kg checked bags','Choose your seat','Free changes','Refundable']]];
const legRow=l=>`<div class="leg"><div class="carrier"><span class="cd">${l.car}</span><span>${AIRL[l.car]}<small>${l.no} · ${fD(l.date)}</small></span></div>
  <div class="tline"><div class="t num">${hm(l.dep)}<small>${l.from}</small></div><div class="mid"><span>${durS(l.dur)}</span><i class="${l.stops?'s1':''}"></i><span>${l.stops?`<b>1 stop</b> · ${l.via}`:'Direct'}</span></div><div class="t e num">${hm(l.arr)}${l.plus?`<sup class="tiny"> +${l.plus}</sup>`:''}<small>${l.to}</small></div></div></div>`;
VX.flights={
  q0:()=>({trip:'round',from:S.ctx.from,to:'CAI',date:S.ctx.start,ret:addD(S.ctx.start,S.ctx.nights),ad:S.ctx.ad,ch:S.ctx.ch,inf:0,cabin:'Economy',nlegs:2,legIx:0,f0:S.ctx.from,t0:'CAI',d0:S.ctx.start,f1:'CAI',t1:'LXR',d1:addD(S.ctx.start,3),f2:'ASW',t2:'CAI',d2:addD(S.ctx.start,7)}),
  redrawOn:[],
  form(q){const AO=AP_OPTS();const top=[{id:'trip',label:'Trip type',type:'seg',opts:[['round','Round trip'],['one','One way'],['multi','Multi-city']]},{id:'pax',label:'Passengers',type:'pax',top:240,rows:[['ad','Adults','12 and over',1,9],['ch','Children','2 to 11',0,6],['inf','Infants','Under 2, on a lap',0,4]],sum:paxSum},{id:'cabin',label:'Cabin',type:'select',top:200,opts:['Economy','Premium economy','Business']}];
    if(q.trip==='multi'){const rows=[];for(let i=0;i<q.nlegs;i++){rows.push({id:'f'+i,label:'Flight '+(i+1)+' from',type:'place',opts:AO,w:4},{id:'t'+i,label:'To',type:'place',opts:AO,w:4},{id:'d'+i,label:'Date',type:'date',w:2});if(i<q.nlegs-1)rows.push({type:'gap',w:2,id:'g'+i});}return top.concat(rows);}
    const w=q.trip==='round'?3:4;return top.concat([{id:'from',label:'From',type:'place',opts:AO,w},{id:'to',label:'To',type:'place',opts:AO,w},{id:'date',label:'Depart',type:'date',w:2}],q.trip==='round'?[{id:'ret',label:'Return',type:'date',w:2}]:[]);},
  formExtra(q){return q.trip==='multi'?`<div class="row wrapx" style="margin-top:12px;gap:18px">${q.nlegs<3?'<button type="button" class="link small" data-fact="addleg">+ Add another flight</button>':''}${q.nlegs>2?'<button type="button" class="link small" data-fact="rmleg">Remove the last flight</button>':''}<span class="tiny muted">Each flight is priced and added to your trip separately.</span></div>`:'';},
  formAct(q,a){if(a==='addleg')q.nlegs=Math.min(3,q.nlegs+1);else q.nlegs=Math.max(2,q.nlegs-1);q.legIx=0;},
  validate(q){const e={};const chk=(f,t,d,fi,ti,di)=>{if(!f)e[fi]='Choose where you are flying from.';if(!t)e[ti]='Choose where you are flying to.';if(f&&t&&f===t)e[ti]='Departure and arrival are the same airport.';if(f&&t&&f!==t&&!EGA[f]&&!EGA[t])e[ti]='Choose an Egyptian airport for one end of the flight.';if(!d||d<TODAY)e[di]='Choose a date from today onwards.';};
    if(q.trip==='multi'){for(let i=0;i<q.nlegs;i++){chk(q['f'+i],q['t'+i],q['d'+i],'f'+i,'t'+i,'d'+i);if(i&&q['d'+i]<q['d'+(i-1)])e['d'+i]='Each flight must be on or after the one before it.';}}
    else{chk(q.from,q.to,q.date,'from','to','date');if(q.trip==='round'&&(!q.ret||q.ret<q.date))e.ret='Return must be on or after departure.';}
    if(q.inf>q.ad)e.pax='Each infant needs their own adult.';return e;},
  onSearch(q){if(q.trip!=='multi'){if(EGA[q.to]){S.ctx.start=q.date;if(q.trip==='round')S.ctx.nights=Math.max(1,diffD(q.date,q.ret));}if(!EGA[q.from])S.ctx.from=q.from;}S.ctx.ad=q.ad;S.ctx.ch=q.ch;q.legIx=0;save();},
  list(q){let offers=[];const mkO=legs=>({id:legs.map(l=>l.id).join('_'),legs,p:r2(legs.reduce((s,l)=>s+l.p,0)),car:legs[0].car,stops:Math.max(...legs.map(l=>l.stops)),dur:legs.reduce((s,l)=>s+l.dur,0),dep:legs[0].dep});
    if(q.trip==='multi'){const i=Math.min(q.legIx||0,q.nlegs-1);offers=flightSearch(q['f'+i],q['t'+i],q['d'+i],q.cabin).map(l=>mkO([l]));}
    else{const out=flightSearch(q.from,q.to,q.date,q.cabin);if(q.trip==='one')offers=out.map(l=>mkO([l]));else{const back=flightSearch(q.to,q.from,q.ret,q.cabin);out.forEach((o,i)=>{const same=back.filter(r=>r.car===o.car&&r.stops===o.stops);const pool=same.length?same:back;if(pool.length)offers.push(mkO([o,pool[i%pool.length]]));});}}
    return offers;},
  summary(q){return q.trip==='multi'?`Flight ${q.legIx+1} of ${q.nlegs}`:`${q.from} → ${q.to} · ${fD(q.date)}${q.trip==='round'?' to '+fD(q.ret):''} · ${q.cabin}`;},
  none(){return 'No sample itineraries on this route. Abu Simbel is reached from Aswan or Cairo, and Sphinx Airport takes selected international flights only.';},
  pre(items,q){return q.trip==='multi'?`<div class="seg" style="margin-bottom:14px">${Array.from({length:q.nlegs},(_,i)=>`<button data-act="fleg" data-i="${i}" class="${i===q.legIx?'on':''}">Flight ${i+1}: ${q['f'+i]} → ${q['t'+i]}</button>`).join('')}</div>`:'';},
  price:it=>it.p,unit:(it,q)=>q.trip==='round'?'per adult, return':'per adult, one way',
  facets:[{id:'stops',label:'Stops',type:'multi',vals:it=>it.stops?'1 stop':'Direct',order:['Direct','1 stop']},{id:'air',label:'Airlines',type:'multi',vals:it=>AIRL[it.car]},{id:'time',label:'Departure time',type:'multi',vals:it=>band(it.dep),order:BANDS},{id:'bag',label:'Checked bag included on every fare',type:'bool',test:it=>!LOWCOST.includes(it.car)},{id:'max',label:'Maximum price per adult',type:'max'}],
  sorts:[['best','Best',(a,b)=>(a.p+a.dur*.400)-(b.p+b.dur*.400)],['cheap','Cheapest',(a,b)=>a.p-b.p],['fast','Fastest',(a,b)=>a.dur-b.dur],['early','Earliest departure',(a,b)=>a.dep-b.dep]],
  card(it,q){return `<article class="fl" id="x-${it.id}"><div class="main"><div class="legs">${it.legs.map(legRow).join('')}</div>
    <div class="buy"><div><div class="price num">${fmt(it.p)}<small>${this.unit(it,q)}</small></div><div class="tiny muted">${LOWCOST.includes(it.car)?'Cabin bag only on Saver':'23 kg bag on every fare'}</div></div><button class="btn sm" data-act="expand" data-k="flights" data-id="${it.id}" aria-expanded="false">Select fare</button></div></div><div class="more" hidden></div></article>`;},
  expand(it,q){return `<div class="segs">${it.legs.map(l=>`<div><b>${fD(l.date)}</b><span>${apName(l.from)} ${hm(l.dep)} → ${apName(l.to)} ${hm(l.arr)}${l.plus?' (+'+l.plus+' day)':''} · ${AIRL[l.car]} ${l.no} · ${durS(l.dur)}${l.stops?` · connection in ${apCity(l.via)}, ${durS(l.lay)}`:''}</span></div>`).join('')}<span class="tiny muted">All times are local. Sample schedule and fares for this prototype.</span></div>
    <div class="fares">${FARES.map((f,i)=>{const Q=this.quote(it,q,{o:i});return `<div class="fare"><h3>${f[0]}</h3><ul>${f[2](it.car).map(x=>`<li>${x}</li>`).join('')}</ul><div class="price num">${fmt(Q.total)}<small>total for ${paxSum(q)}, taxes included</small></div><button class="btn sm" data-act="addopt" data-k="flights" data-id="${it.id}" data-o="${i}">${tx('add')}</button></div>`;}).join('')}</div>`;},
  quote(it,q,sel){const f=FARES[sel.o||0],fare=it.p*f[1]*(q.ad+q.ch*.750+(q.inf||0)*.100),l0=it.legs[0],rt=it.legs.length>1;
    return mk('flights',{ref:it.id,title:`${apCity(l0.from)} → ${apCity(l0.to)}${rt?' and back':''}`,sub:`${AIRL[it.car]} ${l0.no} · ${f[0]} · ${q.cabin} · ${paxSum(q)}`,date:l0.date,end:it.legs[it.legs.length-1].date,time:hm(l0.dep),city:EGA[l0.to]?EGA[l0.to][2]:EGA[l0.from]?EGA[l0.from][2]:'',
      lines:[LN(`${f[0]} fare, ${paxSum(q)}`,fare*.780),LN('Taxes and airport charges',fare*.220,'t'),LN(`Service fee, ${pl(q.ad+q.ch,'ticket')}`,12*(q.ad+q.ch),'t')],
      parts:it.legs.map(l=>({date:l.date,time:hm(l.dep),label:`${l.no} · ${l.from} ${hm(l.dep)} → ${l.to} ${hm(l.arr)}`,city:EGA[l.to]?EGA[l.to][2]:EGA[l.from]?EGA[l.from][2]:''})),
      refundable:sel.o===2,policy:sel.o===2?'Flex fare: free changes and refundable before departure.':'Changes for a fee. This fare is non-refundable.',need:{names:q.ad+q.ch+(q.inf||0)},pax:q.ad+q.ch,meta:{legs:it.legs.map(l=>({from:l.from,to:l.to,date:l.date,dep:l.dep,arr:l.arr,plus:l.plus,no:l.no}))}});}
};

/* ---------- 2. hotels ---------- */
function hotelRooms(it){const view=it.am.find(a=>/view/.test(a));const board=it.am.includes('All inclusive')?'All inclusive':it.am.includes('Full board')?'Full board':it.am.includes('Breakfast included')?'Breakfast included':'Room only';
  if(it.stars<=3)return [['Double room','One double or two single beds · sleeps 2',1,2,board],['Family room','One double and two single beds · sleeps 4',1.450,4,board]];
  return [['Classic room','King or twin beds · sleeps 2',1,2,board],[view?`Deluxe room, ${view.toLowerCase()}`:'Deluxe room','King bed and sitting area · sleeps 3',1.350,3,board],['Suite','Separate living room · sleeps 4',2.100,4,board==='Room only'?'Breakfast included':board]];}
VX.hotels={
  q0:()=>({d:'any',in:S.ctx.start,out:addD(S.ctx.start,3),ad:S.ctx.ad,ch:S.ctx.ch,rooms:1}),
  form(q){return [{id:'d',label:'Destination',type:'place',opts:DEST_OPTS(),w:4,ph:'City or region'},{id:'in',label:'Check-in',type:'date',w:2},{id:'out',label:'Check-out',type:'date',w:2},{id:'pax',label:'Guests and rooms',type:'pax',w:2,rows:[['ad','Adults','18 and over',1,12],['ch','Children','Under 18',0,8],['rooms','Rooms','',1,6]],sum:q=>`${pl(q.ad+q.ch,'guest')}, ${pl(q.rooms,'room')}`}];},
  validate(q){const e={};if(!q.in||q.in<TODAY)e.in='Choose a check-in date from today onwards.';if(!q.out||q.out<=q.in)e.out='Check-out must be after check-in.';if(q.rooms>q.ad)e.pax='Each room needs at least one adult.';return e;},
  onSearch(q){S.ctx.ad=q.ad;S.ctx.ch=q.ch;save();},
  list(q){return HOTELS.filter(h=>q.d==='any'||h.d===q.d);},
  get:id=>byId(HOTELS,id),
  summary(q){return `${dn(q.d)} · ${pl(diffD(q.in,q.out),'night')} from ${fD(q.in)}`;},
  price:it=>it.p,unit:()=>'per night, taxes included',
  facets:[{id:'stars',label:'Star rating',type:'multi',vals:it=>it.stars>=5?'5 stars':it.stars===4?'4 stars':'3 stars or fewer',order:['5 stars','4 stars','3 stars or fewer']},{id:'type',label:'Property type',type:'multi',vals:it=>it.type},{id:'am',label:'Amenities and views',type:'multi',vals:it=>it.am},{id:'top',label:'Rated 4.5 or higher',type:'bool',test:it=>it.r>=4.500},{id:'fc',label:'Free cancellation',type:'bool',test:it=>it.fc},{id:'max',label:'Maximum price per night',type:'max'}],
  sorts:[['rec','Recommended',(a,b)=>(b.r*20+b.stars*4-b.p/60)-(a.r*20+a.stars*4-a.p/60)],['plow','Price: low to high',(a,b)=>a.p-b.p],['phigh','Price: high to low',(a,b)=>b.p-a.p],['rating','Top rated',(a,b)=>b.r-a.r]],
  card(it,q){const n=Math.max(1,diffD(q.in,q.out));
    return `<article class="rc"><a href="#hotels-${it.id}" class="plate zoom" aria-label="${esc(it.n)}" style="display:block">${pimg(it.ph,it.n)}</a>
      <div class="body"><div class="row tiny" style="gap:8px">${starS(it.stars)}<span class="muted">${esc(it.type)}</span></div><h3><a href="#hotels-${it.id}">${esc(it.n)}</a></h3>
        <div class="specs"><span>${ic('pin','s')}${esc(it.area)}, ${DEST[it.d].name}</span>${it.gem?`<span>${ic('clock','s')}About ${it.gem} min to the Grand Egyptian Museum</span>`:''}</div>
        <div class="tags">${it.am.slice(0,4).map(a=>`<span class="bdg">${esc(a)}</span>`).join('')}</div>${it.fc?`<div class="okline">${ic('check','s')}Free cancellation until 3 days before</div>`:''}</div>
      <div class="buy"><div>${score(it.r)}</div><div><div class="price num">${fmt(it.p)}<small>per night, taxes included</small></div><div class="tiny muted num">${fmt(it.p*n*q.rooms)} for ${pl(n,'night')}${q.rooms>1?', '+q.rooms+' rooms':''}</div></div><a class="btn sm" href="#hotels-${it.id}">See rooms</a></div></article>`;},
  sel0:(it,q)=>({in:q.in,out:q.out,ad:q.ad,ch:q.ch,rooms:q.rooms,room:0,bb:false}),
  detail(it){const rs=hotelRooms(it),D=DEST[it.d];
    return {kicker:`${starS(it.stars)} &nbsp;${esc(it.type)}`,title:it.n,meta:`${score(it.r)}<span>${ic('pin','s')} ${esc(it.area)}</span>${destLink(it.d)}`,photos:[it.ph].concat(GAL[it.d]||[]),cap:'Destination photography. Property photos arrive with supplier content.',
      body:dsec('About this stay',`<p>${esc(it.blurb)}</p>${it.gem?`<p>About ${it.gem} minutes by car to the Grand Egyptian Museum.</p>`:''}`)
        +dsec('Amenities',`<div class="amen">${it.am.concat(['Free Wi-Fi','Air conditioning','24-hour front desk']).map(a=>`<span>${ic('check','s')}${esc(a)}</span>`).join('')}</div>`)
        +dsec('Rooms',`<div class="tbl"><table class="t"><thead><tr><th>Room</th><th>Sleeps</th><th>Board</th><th>Per night</th></tr></thead><tbody>${rs.map(r=>`<tr><td><b>${esc(r[0])}</b><div class="small muted">${esc(r[1])}</div></td><td>${r[3]}</td><td>${esc(r[4])}</td><td class="num"><b>${fmt(it.p*r[2])}</b></td></tr>`).join('')}</tbody></table></div><p class="small muted" style="margin-top:10px">Choose your room in the booking panel.</p>`)
        +dsec('Location',`<div class="split"><div class="mapbox">${mapSVG({sel:it.d,pins:[it.d]})}</div><div class="col"><p><b>${esc(it.area)}</b>, ${D.name}. ${esc(D.get)}.</p><h4>Nearby</h4><ul class="hl">${D.hl.slice(0,3).map(h=>`<li>${esc(h)}</li>`).join('')}</ul></div></div>`)
        +dsec('Guest ratings',`<div class="bars">${demoRatings(it).map(r=>`<div class="barrow"><span>${r[0]}</span><i><b style="width:${(r[1]/5*100).toFixed(0)}%"></b></i><span class="num">${r[1].toFixed(1)}</span></div>`).join('')}</div><p class="small muted" style="margin-top:10px">Sample rating data for this prototype. Verified guest reviews load from the supplier in production.</p>`)
        +dsec('Policies',kv([['Check-in','From 15:00'],['Check-out','Until 12:00'],['Children','Welcome at all ages'],['Payment','Pay now, or at the hotel on flexible rates']]))};},
  conf(it,q,sel){const rs=hotelRooms(it);const c=[{t:'dates',a:'in',b:'out',la:'Check-in',lb:'Check-out'},{t:'step',id:'ad',label:'Adults',min:1,max:12},{t:'step',id:'ch',label:'Children',sub:'Under 18',min:0,max:8},{t:'step',id:'rooms',label:'Rooms',min:1,max:6},
      {t:'radio',id:'room',label:'Room type',opts:rs.map((r,i)=>[i,r[0],r[1]+' · '+r[4],`${fmt(it.p*r[2])}<small>per night</small>`])}];
    if(rs[sel.room][4]==='Room only')c.push({t:'check',id:'bb',label:'Add breakfast',sub:'Buffet breakfast for every guest',pr:`+${fmt(18)}<small>per guest, per night</small>`});return c;},
  quote(it,q,sel){const n=diffD(sel.in,sel.out),r=hotelRooms(it)[sel.room],g=sel.ad+sel.ch;
    if(!sel.in||!sel.out||n<1)return {err:'Check-out must be after check-in.'};if(sel.in<TODAY)return {err:'Choose a check-in date from today onwards.'};
    if(g>r[3]*sel.rooms)return {err:`${r[0]} sleeps ${r[3]}. Add a room or choose a larger room for ${pl(g,'guest')}.`};if(sel.rooms>sel.ad)return {err:'Each room needs at least one adult.'};
    const tot=it.p*r[2]*n*sel.rooms,lines=[LN(`${r[0]}, ${pl(n,'night')}${sel.rooms>1?' × '+sel.rooms+' rooms':''}`,tot/1.290),LN('Taxes and service: 14% VAT, 12% service, 1% city tax',tot-tot/1.290,'t')];
    if(sel.bb&&r[4]==='Room only')lines.push(LN(`Breakfast, ${pl(g,'guest')} × ${pl(n,'night')}`,18*g*n));
    return mk('hotels',{ref:it.id,title:it.n,sub:`${r[0]} · ${sel.bb&&r[4]==='Room only'?'Breakfast included':r[4]} · ${pl(g,'guest')} · ${pl(n,'night')}`,date:sel.in,end:sel.out,time:'15:00',city:it.d,lines,
      parts:[{date:sel.in,time:'15:00',label:'Check in',city:it.d},{date:sel.out,time:'',show:'By 12:00',label:'Check out',city:it.d}],refundable:it.fc,policy:it.fc?'Free cancellation until 3 days before check-in.':'This rate is non-refundable.',pax:g,meta:{d:it.d,area:it.area}});}
};

/* ---------- 3. Nile cruises ---------- */
function sailings(it,from,n){const R=CROUTES[it.route],out=[];let d=from<TODAY?TODAY:from;for(let i=0;i<70&&out.length<(n||6);i++){if(R.dow.includes(pd(d).getDay()))out.push(d);d=addD(d,1);}return out;}
const cabinsOf=it=>it.cls==='Dahabiya'?[['Cabin','Double or twin, river-level windows',1],['Stern suite','Private terrace over the water',1.400]]:[['Main deck cabin','Panoramic window',1],['Upper deck cabin','Higher deck with French balcony',1.150],['Suite','Separate lounge and priority dining',1.700]];
VX.cruises={
  q0:()=>({route:'any',date:addD(S.ctx.start,3),ad:S.ctx.ad,ch:S.ctx.ch}),
  form(){return [{id:'route',label:'Route',type:'select',w:4,opts:[['any','Any route']].concat(Object.entries(CROUTES).map(([k,r])=>[k,`${r.n} · ${r.nights} nights`]))},{id:'date',label:'Sailing on or after',type:'date',w:3},PAXF(3,'Passengers')];},
  validate(q){const e={};if(!q.date||q.date<TODAY)e.date='Choose a date from today onwards.';return e;},
  list(q){return CRUISES.filter(c=>q.route==='any'||c.route===q.route);},
  get:id=>byId(CRUISES,id),
  summary(q){return `${q.route==='any'?'All routes':CROUTES[q.route].n} · from ${fD(q.date)}`;},
  price:it=>it.p,unit:()=>'per person, two sharing',
  facets:[{id:'route',label:'Route',type:'multi',vals:it=>CROUTES[it.route].n},{id:'cls',label:'Ship class',type:'multi',vals:it=>it.cls,order:['Luxury','Deluxe','Standard','Dahabiya']},{id:'n',label:'Length',type:'multi',vals:it=>CROUTES[it.route].nights+' nights'},{id:'max',label:'Maximum price per person',type:'max'}],
  sorts:[['rec','Recommended',(a,b)=>b.r-a.r],['plow','Price: low to high',(a,b)=>a.p-b.p],['phigh','Price: high to low',(a,b)=>b.p-a.p],['n','Shortest first',(a,b)=>CROUTES[a.route].nights-CROUTES[b.route].nights]],
  card(it,q){const R=CROUTES[it.route];
    return `<article class="rc"><a href="#cruises-${it.id}" class="plate zoom" style="display:block" aria-label="${esc(it.n)}">${pimg(it.ph,it.n)}</a>
      <div class="body"><div class="row" style="gap:8px"><span class="bdg blue">${it.cls}</span><span class="tiny muted">${it.cabins} cabins</span></div><h3><a href="#cruises-${it.id}">${esc(it.n)}</a></h3>
        <div class="routeline">${R.stops.map((s,i)=>(i?'<i></i>':'')+`<b>${s}</b>`).join('')}</div>
        <div class="specs"><span>${ic('clock','s')}${R.nights} nights</span><span>${ic('cal','s')}Next: ${sailings(it,q.date,3).map(d=>fD(d)).join(' · ')}</span></div>
        <div class="okline">${ic('check','s')}${esc(it.inc[0])} · ${esc(it.inc[1])}</div></div>
      <div class="buy"><div>${score(it.r)}</div><div class="price num">${fmt(it.p)}<small>per person, two sharing</small></div><a class="btn sm" href="#cruises-${it.id}">View sailing</a></div></article>`;},
  sel0(it,q){return {date:sailings(it,q.date,1)[0],cabin:0,ad:q.ad,ch:q.ch};},
  detail(it){const R=CROUTES[it.route];
    return {kicker:`${it.cls} · ${R.nights} nights`,title:it.n,meta:`${score(it.r)}<span class="routeline">${R.stops.map((s,i)=>(i?'<i></i>':'')+`<b>${s}</b>`).join('')}</span>`,photos:[it.ph].concat(R.days.map(d=>d[2])),cap:'Photography of the route',
      body:dsec('The ship',`<p>${esc(it.blurb)}</p>`+kv([['Cabins',it.cabins],['Class',it.cls],['Embark',DEST[R.from].name],['Disembark',DEST[R.to].name],['Sails',R.dow.map(d=>DW[d]).join(', ')]]))
        +dsec('Day by day',`<div class="days">${R.days.map((d,i)=>`<div class="dayrow"><div class="n">${i+1}<small>Day</small></div><div><h3>${esc(d[0])}</h3><p>${esc(d[1])}</p></div></div>`).join('')}</div>`)
        +dsec('What is included',ckl(it.inc.map(esc))+'<div style="height:14px"></div>'+ckl(['Drinks, unless stated','Crew and guide gratuities','Optional excursions such as Abu Simbel or a balloon flight'],1))
        +dsec('Cabins',`<div class="tbl"><table class="t"><thead><tr><th>Cabin</th><th>Per person</th></tr></thead><tbody>${cabinsOf(it).map(c=>`<tr><td><b>${c[0]}</b><div class="small muted">${c[1]}</div></td><td class="num"><b>${fmt(it.p*c[2])}</b></td></tr>`).join('')}</tbody></table></div>`)};},
  conf(it,q,sel){return [{t:'chips',id:'date',label:'Departure date',opts:uniq(sailings(it,q.date,6).concat(sel.date?[sel.date]:[])).sort().map(d=>[d,fD(d)]),hint:`Sails ${CROUTES[it.route].dow.map(d=>DW[d]).join(', ')}. Sample departures.`},{t:'radio',id:'cabin',label:'Cabin',opts:cabinsOf(it).map((c,i)=>[i,c[0],c[1],`${fmt(it.p*c[2])}<small>per person</small>`])},{t:'step',id:'ad',label:'Adults',min:1,max:8},{t:'step',id:'ch',label:'Children',sub:'2 to 11, 30% off',min:0,max:4}];},
  quote(it,q,sel){const R=CROUTES[it.route],c=cabinsOf(it)[sel.cabin]||cabinsOf(it)[0];if(!sel.date)return {err:'Choose a departure date.'};
    const per=it.p*c[2],solo=sel.ad===1&&!sel.ch,base=per*(sel.ad+sel.ch*.700),lines=[LN(`${c[0]}, ${paxSum(sel)}`,base*.920),LN('Port taxes and service',base*.080,'t')];if(solo)lines.push(LN('Single occupancy supplement',per*.600));
    return mk('cruises',{ref:it.id,title:it.n,sub:`${R.n} · ${R.nights} nights · ${c[0]} · ${paxSum(sel)}`,date:sel.date,end:addD(sel.date,R.nights),time:'12:00',city:R.from,lines,
      parts:[{date:sel.date,time:'12:00',label:`Embark in ${DEST[R.from].name}`,city:R.from},{date:addD(sel.date,R.nights),time:'',show:'By 08:00',label:`Disembark in ${DEST[R.to].name}`,city:R.to}],refundable:true,policy:'Free cancellation until 30 days before sailing.',pax:sel.ad+sel.ch,meta:{route:it.route,from:R.from,to:R.to}});}
};

/* ---------- 4. tours & activities ---------- */
const hrsL=h=>h>=24?'2 days, 1 night':h+' hours';
const durB=h=>h<=4?'Up to 4 hours':h<=8?'4 to 8 hours':h<24?'Full day':'Multi-day';
VX.tours={
  q0:()=>({d:'any',date:addD(S.ctx.start,1),ad:S.ctx.ad,ch:S.ctx.ch,cat:'any'}),
  form(){return [{id:'d',label:'Destination',type:'place',opts:DEST_OPTS(),w:3,ph:'City or region'},{id:'date',label:'Date',type:'date',w:2},PAXF(3),{id:'cat',label:'Activity type',type:'select',w:2,opts:[['any','Any type']].concat(uniq(TOURS.map(t=>t.cat)).map(c=>[c,c]))}];},
  validate(q){const e={};if(!q.date||q.date<TODAY)e.date='Choose a date from today onwards.';return e;},
  list(q){return TOURS.filter(t=>(q.d==='any'||t.d===q.d||t.also===q.d)&&(q.cat==='any'||t.cat===q.cat));},
  get:id=>byId(TOURS,id),
  summary(q){return `${dn(q.d)} · ${fD(q.date)}`;},
  price:it=>it.p,unit:()=>'per adult',grid:true,
  facets:[{id:'cat',label:'Category',type:'multi',vals:it=>it.cat},{id:'dur',label:'Duration',type:'multi',vals:it=>durB(it.hrs),order:['Up to 4 hours','4 to 8 hours','Full day','Multi-day']},{id:'grp',label:'Group size',type:'multi',vals:it=>it.grp},{id:'lang',label:'Guide language',type:'multi',vals:it=>it.langs,order:LANG8},{id:'top',label:'Rated 4.7 or higher',type:'bool',test:it=>it.r>=4.700},{id:'max',label:'Maximum price per adult',type:'max'}],
  sorts:[['rec','Recommended',(a,b)=>b.r-a.r],['plow','Price: low to high',(a,b)=>a.p-b.p],['phigh','Price: high to low',(a,b)=>b.p-a.p],['dur','Shortest first',(a,b)=>a.hrs-b.hrs]],
  card(it){return `<a class="tc" href="#tours-${it.id}"><div class="plate zoom">${pimg(it.ph,it.n)}<span class="bdg">${esc(it.cat)}</span></div><div class="body"><div class="tiny muted">${DEST[it.d].name} · ${hrsL(it.hrs)} · ${esc(it.grp)}</div><h3>${esc(it.n)}</h3><div class="foot"><span class="score"><b class="num">${it.r.toFixed(1)}</b></span><div class="price num" style="text-align:end">${fmt(it.p)}<small>per adult</small></div></div></div></a>`;},
  sel0(it,q){return {date:q.date,slot:firstFree(slotAvail(it.id+q.date,it.slots)),ad:q.ad,ch:q.ch,lang:'English',priv:false};},
  detail(it){return {kicker:esc(it.cat),title:it.n,meta:`${score(it.r)}<span>${ic('clock','s')} ${hrsL(it.hrs)}</span><span>${ic('user','s')} ${esc(it.grp)}</span>${destLink(it.d)}`,photos:[it.ph].concat(GAL[it.also||it.d]||[]),cap:'Destination photography',
      body:dsec('The experience',`<p>${esc(it.blurb)}</p>`)+dsec('Highlights',`<ul class="hl">${it.hl.map(h=>`<li>${esc(h)}</li>`).join('')}</ul>`)
        +dsec('What is included',ckl(it.inc.map(esc))+'<div style="height:14px"></div>'+ckl(['Site entry tickets, unless listed above. Add them under <a class="link" href="#tickets">Site tickets</a>','Gratuities'],1))
        +dsec('Good to know',kv([['Duration',hrsL(it.hrs)],['Group',it.grp],['Languages',it.langs.join(', ')],['Meeting point','Pickup from your hotel or ship'],['Cancellation','Free up to 24 hours before']]))};},
  conf(it,q,sel){const c=[{t:'date',id:'date',label:'Date'},{t:'chips',id:'slot',label:'Start time',opts:slotAvail(it.id+sel.date,it.slots)},{t:'step',id:'ad',label:'Adults',min:1,max:12},{t:'step',id:'ch',label:'Children',sub:'2 to 11, half price',min:0,max:8},{t:'select',id:'lang',label:'Guide language',opts:it.langs}];
    if(it.grp!=='Private')c.push({t:'check',id:'priv',label:'Make it private',sub:'Your own guide and vehicle',pr:'+60%'});return c;},
  quote(it,q,sel){if(!sel.date||sel.date<TODAY)return {err:'Choose a date from today onwards.'};const av=slotAvail(it.id+sel.date,it.slots);if(!sel.slot||av.find(a=>a[0]===sel.slot&&a[2]))return {err:'That start time is sold out on this date. Choose another time.'};
    const base=it.p*(sel.ad+sel.ch*.500),lines=[LN(`${paxSum(sel)}`,base)];if(sel.priv&&it.grp!=='Private')lines.push(LN('Private upgrade',base*.600));
    return mk('tours',{ref:it.id,title:it.n,sub:`${hrsL(it.hrs)} · ${sel.priv?'Private':it.grp} · ${sel.lang} guide · ${paxSum(sel)}`,date:sel.date,end:it.hrs>=24?addD(sel.date,1):sel.date,time:sel.slot,city:it.d,lines,refundable:true,policy:'Free cancellation up to 24 hours before the start time.',pax:sel.ad+sel.ch});}
};

/* ---------- 5. airport transfers ---------- */
const zoneOf=(ap,z)=>(ZONES[ap]||[]).find(x=>x[0]===z)||(ZONES[ap]||[])[0];
VX.transfers={
  q0:()=>({dir:'from',trip:'one',ap:'CAI',zone:'giza',date:S.ctx.start,time:'14:00',ad:S.ctx.ad,ch:S.ctx.ch,bags:2}),
  redrawOn:['ap'],
  onField(q,id){if(id==='ap')q.zone=ZONES[q.ap][0][0];},
  form(q){const from=q.dir==='from';return [{id:'dir',label:'Direction',type:'seg',opts:[['from','From the airport'],['to','To the airport']]},{id:'trip',label:'Trip',type:'seg',opts:[['one','One way'],['ret','Return']]},
    {id:'pax',label:'Passengers and bags',type:'pax',top:250,rows:[['ad','Adults','12 and over',1,14],['ch','Children','Child seats on request',0,8],['bags','Suitcases','',0,14]],sum:q=>`${pl(q.ad+q.ch,'passenger')}, ${pl(q.bags,'bag')}`},
    {id:'ap',label:from?'Pick-up airport':'Drop-off airport',type:'place',opts:EG_AP_OPTS(),w:3},{id:'zone',label:from?'Drop-off area':'Pick-up area',type:'select',w:3,opts:ZONES[q.ap].map(z=>[z[0],z[1]])},{id:'date',label:'Date',type:'date',w:2},{id:'time',label:from?'Flight lands at':'Pick-up time',type:'select',w:2,opts:Array.from({length:48},(_,i)=>hm(i*30))}];},
  validate(q){const e={};if(!q.date||q.date<TODAY)e.date='Choose a date from today onwards.';return e;},
  list(q){const z=zoneOf(q.ap,q.zone),n=q.ad+q.ch;return VEHS.map(v=>Object.assign({},v,{z,price:Math.round(z[3]*v.m)*(q.trip==='ret'?1.900:1),fits:n<=v.pax&&q.bags<=v.bags}));},
  summary(q){const z=zoneOf(q.ap,q.zone);return `${q.ap} ${q.dir==='from'?'→':'←'} ${z[1]} · about ${z[2]} min · ${fD(q.date)} ${q.time}`;},
  price:it=>it.price,unit:(it,q)=>q.trip==='ret'?'per vehicle, return':'per vehicle, one way',
  facets:[{id:'cls',label:'Vehicle class',type:'multi',vals:it=>it.m>=3?'Premium':it.pax>4?'Group':'Standard',order:['Standard','Group','Premium']},{id:'fits',label:'Fits all passengers and bags',type:'bool',test:it=>it.fits},{id:'max',label:'Maximum price',type:'max'}],
  sorts:[['plow','Price: low to high',(a,b)=>a.price-b.price],['cap','Largest first',(a,b)=>b.pax-a.pax]],
  card(it,q){const n=q.ad+q.ch;
    return `<article class="rc noimg"><div class="body"><div class="row" style="gap:12px;align-items:flex-start"><span class="ic" style="width:46px;height:46px;border-radius:12px;background:var(--blue-t);color:var(--blue);display:grid;place-items:center;flex:none">${ic(it.pax>4?'trains':'transfers')}</span><div class="col" style="gap:6px"><h3>${esc(it.n)}</h3><div class="small muted">${esc(it.model)}</div>
        <div class="specs"><span>${ic('user','s')}Up to ${it.pax} passengers</span><span>${ic('bag','s')}${it.bags} suitcases</span><span>${ic('clock','s')}About ${it.z[2]} min</span></div>
        <div class="specs">${it.inc.map(x=>`<span style="color:var(--faience)">${ic('check','s')}${esc(x)}</span>`).join('')}</div></div></div></div>
      <div class="buy"><div class="price num">${fmt(it.price)}<small>${this.unit(it,q)}</small></div>${it.fits?`<button class="btn sm" data-act="addopt" data-k="transfers" data-id="${it.id}">${tx('add')}</button>`:`<span class="bdg bad">Too small for ${pl(n,'passenger')} and ${pl(q.bags,'bag')}</span>`}<span class="tiny muted">60 min free waiting · flight tracked</span></div></article>`;},
  quote(it,q){const z=it.z||zoneOf(q.ap,q.zone),one=Math.round(z[3]*it.m),from=q.dir==='from',A=`${apCity(q.ap)} Airport`,lines=[LN(`${it.n}, ${from?A+' to '+z[1]:z[1]+' to '+A}`,one)];if(q.trip==='ret')lines.push(LN('Return journey, 10% off',one*.900));
    return mk('transfers',{ref:it.id,title:from?`${A} → ${z[1]}`:`${z[1]} → ${A}`,sub:`${it.n} · ${pl(q.ad+q.ch,'passenger')}, ${pl(q.bags,'bag')}${q.trip==='ret'?' · return':''}`,date:q.date,time:q.time,city:z[4],lines,refundable:true,policy:'Free cancellation up to 24 hours before pick-up. Driver waits 60 minutes after landing.',need:{flight:true},pax:q.ad+q.ch,meta:{ap:q.ap,zone:z[0],dir:q.dir}});}
};

/* ---------- 6. car rental ---------- */
VX.cars={
  q0:()=>({ap:'CAI',same:'same',drop:'HRG',pu:S.ctx.start,ret:addD(S.ctx.start,Math.min(7,S.ctx.nights)),type:'any',age:'25 to 69'}),
  form(q){const AO=EG_AP_OPTS();return [{id:'same',label:'Drop-off',type:'seg',opts:[['same','Return to the same place'],['diff','Different drop-off']]},{id:'type',label:'Vehicle type',type:'select',top:210,opts:[['any','Any vehicle'],['self','Self-drive'],['driver','With a driver']]},{id:'age',label:'Driver age',type:'select',top:170,opts:['21 to 24','25 to 69','70 or over']},
    {id:'ap',label:'Pick-up location',type:'place',opts:AO,w:q.same==='same'?6:3}].concat(q.same==='diff'?[{id:'drop',label:'Drop-off location',type:'place',opts:AO,w:3}]:[],[{id:'pu',label:'Pick-up date',type:'date',w:2},{id:'ret',label:'Return date',type:'date',w:2}]);},
  validate(q){const e={};if(!q.pu||q.pu<TODAY)e.pu='Choose a pick-up date from today onwards.';if(!q.ret||q.ret<=q.pu)e.ret='Return must be after pick-up.';if(q.same==='diff'&&q.drop===q.ap)e.drop='Choose a different drop-off, or switch to same-place return.';return e;},
  list(q){return CARS.filter(c=>c.at.includes(q.ap)&&(q.type==='any'||(q.type==='self')===(c.drv==='Self-drive')));},
  get:id=>byId(CARS,id),
  summary(q){return `${apCity(q.ap)}${q.same==='diff'?' → '+apCity(q.drop):''} · ${pl(Math.max(1,diffD(q.pu,q.ret)),'day')} from ${fD(q.pu)}`;},
  none(q){return `No sample vehicles of this type at ${apCity(q.ap)}. Try Cairo, Hurghada or Sharm El Sheikh.`;},
  price:it=>it.p,unit:()=>'per day',
  facets:[{id:'cat',label:'Category',type:'multi',vals:it=>it.cat},{id:'trans',label:'Transmission',type:'multi',vals:it=>it.trans==='Driver'?'Driver provided':it.trans},{id:'drv',label:'Driving',type:'multi',vals:it=>it.drv},{id:'unl',label:'Unlimited mileage',type:'bool',test:it=>it.km==='Unlimited'},{id:'seven',label:'7 seats or more',type:'bool',test:it=>it.seats>=7},{id:'max',label:'Maximum price per day',type:'max'}],
  sorts:[['plow','Price: low to high',(a,b)=>a.p-b.p],['phigh','Price: high to low',(a,b)=>b.p-a.p],['seats','Most seats',(a,b)=>b.seats-a.seats]],
  card(it,q){const d=Math.max(1,diffD(q.pu,q.ret));
    return `<article class="rc noimg"><div class="body"><div class="row" style="gap:12px;align-items:flex-start"><span style="width:46px;height:46px;border-radius:12px;background:var(--blue-t);color:var(--blue);display:grid;place-items:center;flex:none">${ic('cars')}</span><div class="col" style="gap:6px"><div><span class="bdg">${esc(it.cat)}</span></div><h3><a href="#cars-${it.id}">${esc(it.n)}</a> <span class="small muted" style="font-weight:500">${it.drv==='Self-drive'?'or similar':''}</span></h3>
      <div class="specs"><span>${ic('user','s')}${it.seats} seats</span><span>${ic('bag','s')}${pl(it.bags,'large bag')}</span><span>${ic('cars','s')}${it.trans==='Driver'?'Driver and fuel included':it.trans}</span><span>${ic('map','s')}${esc(it.km)}</span><span>${ic('check','s')}Air conditioning</span></div>
      <div class="okline">${ic('check','s')}Free cancellation up to 48 hours before pick-up</div></div></div></div>
      <div class="buy"><div><div class="price num">${fmt(it.p)}<small>per day</small></div><div class="tiny muted num">${fmt(it.p*d)} for ${pl(d,'day')}</div></div><a class="btn sm" href="#cars-${it.id}">View deal</a></div></article>`;},
  sel0:(it,q)=>({pu:q.pu,ret:q.ret,ins:0,seat:false,add:false}),
  detail(it,q){const self=it.drv==='Self-drive';
    return {kicker:esc(it.cat),title:it.n+(self?' or similar':''),meta:`<span>${ic('pin','s')} Pick up at ${apName(q.ap)}</span><span>${ic('user','s')} ${it.seats} seats</span><span>${ic('cars','s')} ${it.trans==='Driver'?'Driver provided':it.trans}</span>`,photos:[],
      body:dsec('The vehicle',kv([['Seats',it.seats],['Large bags',it.bags],['Transmission',it.trans==='Driver'?'Driver provided':it.trans],['Mileage',it.km],['Fuel',self?'Full to full':'Included'],['Air conditioning','Yes']]))
        +dsec('What is included',ckl(self?['Collision damage waiver with a $600 excess','Theft protection','Third-party liability','Airport surcharge and local taxes','24-hour roadside assistance']:['Professional English-speaking driver','Fuel, tolls and parking','Driver’s meals and accommodation on overnight trips','Local taxes']))
        +(self?dsec('Driver requirements',ckl(['Aged 25 to 69. Drivers aged 21 to 24 pay a young-driver fee','Licence held for at least one year','International Driving Permit carried with your home licence','Credit card in the main driver’s name for the security deposit','Passport']))+dsec('Good to know',`<p>Driving in Cairo is demanding and signage outside cities can be sparse. For desert and intercity routes many travellers prefer a car with a driver.</p><p>Security deposit of about ${fmt(350)} is held on the driver’s card at pick-up and released on return.</p>`):dsec('How it works',`<ol class="stepsl"><li><span><b>Tell us your plan</b>Add your route or hotel list at checkout.</span></li><li><span><b>Your driver meets you</b>At the pick-up point with a name sign.</span></li><li><span><b>Up to ${it.km.toLowerCase()}</b>Extra hours are charged at the same hourly rate.</span></li></ol>`))};},
  conf(it,q,sel){const self=it.drv==='Self-drive';const c=[{t:'dates',a:'pu',b:'ret',la:'Pick-up',lb:'Return'}];
    if(self)c.push({t:'radio',id:'ins',label:'Protection',opts:[[0,'Basic cover','Included. $600 excess applies','Included'],[1,'Full cover','Zero excess, tyres and glass covered',`+${fmt(9)}<small>per day</small>`]]},{t:'head',label:'Extras'},{t:'check',id:'add',label:'Additional driver',pr:`+${fmt(5)}<small>per day</small>`});
    c.push({t:'check',id:'seat',label:'Child seat',sub:'Fitted before pick-up',pr:`+${fmt(4)}<small>per day</small>`});return c;},
  quote(it,q,sel){const d=diffD(sel.pu,sel.ret),self=it.drv==='Self-drive';if(!sel.pu||!sel.ret||d<1)return {err:'Return must be at least one day after pick-up.'};if(sel.pu<TODAY)return {err:'Choose a pick-up date from today onwards.'};
    if(self&&q.age==='70 or over')return {err:'Self-drive rental is available to drivers aged 21 to 69. Choose a car with a driver instead.'};
    const lines=[LN(`${it.n}, ${pl(d,'day')}`,it.p*d*.860),LN('Taxes and airport surcharge',it.p*d*.140,'t')];
    if(self&&sel.ins==1)lines.push(LN('Full cover',9*d));if(self&&sel.add)lines.push(LN('Additional driver',5*d));if(sel.seat)lines.push(LN('Child seat',4*d));
    if(self&&q.age==='21 to 24')lines.push(LN('Young driver fee',8*d,'t'));if(q.same==='diff')lines.push(LN(`One-way fee, return to ${apCity(q.drop)}`,40,'t'));
    const dropAp=q.same==='diff'?q.drop:q.ap;
    return mk('cars',{ref:it.id,title:it.n+(self?' or similar':''),sub:`${it.cat} · ${pl(d,'day')} · ${self?(sel.ins==1?'Full cover':'Basic cover'):'Driver and fuel included'}`,date:sel.pu,end:sel.ret,time:'10:00',city:EGA[q.ap][2],lines,
      parts:[{date:sel.pu,time:'10:00',label:`Pick up at ${apName(q.ap)}`,city:EGA[q.ap][2]},{date:sel.ret,time:'10:00',label:`Return to ${apName(dropAp)}`,city:EGA[dropAp][2]}],refundable:true,policy:'Free cancellation up to 48 hours before pick-up.',need:{driver:self},meta:{ap:q.ap}});}
};
/* ===== booking verticals 7–13: eSIM, site tickets, restaurants, trains & buses, insurance, extras, packages ===== */

/* ---------- 7. eSIM ---------- */
const gbL=e=>e.gb?e.gb+' GB':'Unlimited';
function esimBest(list,q){const need={any:0,light:3,standard:10,heavy:20}[q.use]||0;const ok=list.filter(e=>e.days>=+q.days&&(e.gb===0||e.gb>=need)&&e.type==='Data only');return ok.sort((a,b)=>a.p-b.p)[0]||null;}
VX.esim={
  q0:()=>({cov:'eg',days:S.ctx.nights+1<=7?'7':S.ctx.nights+1<=15?'15':'30',use:'standard'}),
  form(){return [{id:'cov',label:'Coverage',type:'select',w:4,opts:[['eg','Egypt only'],['me','Egypt and the Middle East']]},{id:'days',label:'Trip length',type:'select',w:3,opts:[['7','Up to 7 days'],['15','8 to 15 days'],['30','16 to 30 days']]},{id:'use',label:'How much data',type:'select',w:3,opts:[['light','Light: maps and messages'],['standard','Standard: social and video calls'],['heavy','Heavy: streaming and hotspot'],['any','Show me everything']]}];},
  list(q){return ESIMS.filter(e=>q.cov==='me'||e.cov==='Egypt');},
  get:id=>byId(ESIMS,id),
  summary(q){return `${q.cov==='eg'?'Egypt':'Egypt and the Middle East'} · up to ${q.days} days`;},
  price:it=>it.p,unit:()=>'one-time, per eSIM',grid:true,
  facets:[{id:'gb',label:'Data',type:'multi',vals:it=>it.gb===0?'Unlimited':it.gb<=5?'Up to 5 GB':'10 to 20 GB',order:['Up to 5 GB','10 to 20 GB','Unlimited']},{id:'days',label:'Validity',type:'multi',vals:it=>it.days+' days',order:['7 days','15 days','30 days']},{id:'type',label:'Plan type',type:'multi',vals:it=>it.type},{id:'hot',label:'Hotspot allowed',type:'bool',test:it=>it.hot},{id:'max',label:'Maximum price',type:'max'}],
  sorts:[['rec','Best match first',(a,b,q)=>{const best=esimBest(ESIMS.filter(e=>q.cov==='me'||e.cov==='Egypt'),q);return (b===best)-(a===best)||a.p-b.p;}],['plow','Price: low to high',(a,b)=>a.p-b.p],['data','Most data',(a,b)=>(b.gb||999)-(a.gb||999)]],
  card(it,q){const best=esimBest(this.list(q),q)===it;
    return `<a class="pl${best?' best':''}" href="#esim-${it.id}">${best?`<span class="bdg blue flag">Best match for up to ${q.days} days</span>`:''}<div class="tiny muted">${esc(it.cov)}</div><div class="gb">${it.gb||'∞'} <small>${it.gb?'GB':'Unlimited'}</small></div>
      <div class="specs"><span>${ic('cal','s')}${it.days} days</span><span>${ic('phone','s')}${esc(it.type)}</span></div><div class="specs"><span>${ic('check','s')}4G and 5G</span><span>${ic(it.hot?'check':'x','s')}${it.hot?'Hotspot allowed':'No hotspot'}</span></div>
      <div class="row between" style="margin-top:4px"><div class="price num">${fmt(it.p)}<small>one-time</small></div><span class="btn sm">Choose</span></div></a>`;},
  sel0:()=>({qty:1,date:S.ctx.start}),
  detail(it){return {kicker:'eSIM · '+esc(it.cov),title:`${gbL(it)} for ${it.days} days`,meta:`<span>${ic('phone','s')} ${esc(it.type)}</span><span>${ic('check','s')} 4G and 5G on Egypt’s main networks</span>`,photos:[],
      body:dsec('This plan',kv([['Data',gbL(it)],['Valid for',it.days+' days from activation'],['Coverage',it.cov],['Hotspot',it.hot?'Allowed':'Not allowed'],['Top-up','Available in your trip dashboard'],['Delivery','QR code by email']])+(it.gb===0?'<p class="small muted" style="margin-top:10px">Unlimited plans slow down after 3 GB a day under the network’s fair-use policy.</p>':''))
        +dsec('Check your phone',`<p>eSIMs work on most phones made since 2019. Your phone must also be unlocked from your home network.</p><div class="fgrid2" style="margin-top:14px;max-width:520px"><div class="fld"><label for="dv-b">Brand</label><select id="dv-b">${Object.keys(DEVICES).map(b=>`<option>${b}</option>`).join('')}</select></div><div class="fld"><label for="dv-m">Model</label><select id="dv-m"></select></div></div><div id="dv-r" style="margin-top:12px;max-width:520px"></div>`)
        +dsec('How activation works',`<ol class="stepsl"><li><span><b>Buy before you fly</b>Your QR code arrives by email and in your trip dashboard.</span></li><li><span><b>Install on Wi-Fi</b>Scan the code in your phone’s mobile settings. It takes about two minutes.</span></li><li><span><b>Switch it on when you land</b>Turn on the eSIM line and data roaming for it. The ${it.days} days start then.</span></li><li><span><b>Keep your own number</b>Your home SIM stays active for calls and texts if you want it to.</span></li></ol>`)};},
  after(){const b=$('#dv-b'),m=$('#dv-m'),r=$('#dv-r');if(!b)return;const fill=()=>{m.innerHTML=DEVICES[b.value].map(x=>`<option>${esc(x)}</option>`).join('');res();};
    const res=()=>{const no=NOESIM.includes(m.value);r.innerHTML=no?`<div class="alert">${ic('x','s')}<span>${m.value==='My phone is not listed'?'We cannot confirm this phone. Look for “Add eSIM” in your mobile network settings before you buy.':'This model does not support eSIM. A physical tourist SIM is sold at the airport arrivals hall.'}</span></div>`:`<div class="alert ok">${ic('check','s')}<span>This phone supports eSIM. Check that it is unlocked from your home network.</span></div>`;};
    b.onchange=fill;m.onchange=res;fill();},
  conf(){return [{t:'step',id:'qty',label:'Number of eSIMs',sub:'One per phone or tablet',min:1,max:9},{t:'date',id:'date',label:'Arrival date'},{t:'note',html:'In production the QR code is emailed within minutes of payment.'}];},
  quote(it,q,sel){if(!sel.date||sel.date<TODAY)return {err:'Choose an arrival date from today onwards.'};
    return mk('esim',{ref:it.id,title:`eSIM: ${it.n}`,sub:`${pl(sel.qty,'eSIM')} · ${it.type}`,date:sel.date,time:'',city:'',lines:[LN(`${gbL(it)}, ${it.days} days × ${sel.qty}`,it.p*sel.qty)],refundable:true,policy:'Refundable until the eSIM is installed on a device.',meta:{days:it.days}});}
};

/* ---------- 8. site tickets ---------- */
const TSLOTS=['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00'];
VX.tickets={
  q0:()=>({d:'any',date:addD(S.ctx.start,1),n:S.ctx.ad}),
  form(){return [{id:'d',label:'Attraction or city',type:'place',w:5,ph:'Museum, site or city',opts:[['any','All sites in Egypt'],['','Cities',1]].concat(uniq(SITES.map(s=>s.d)).map(d=>[d,DEST[d].name]),[['','Attractions',1]],SITES.map(s=>['site:'+s.id,s.n,0,DEST[s.d].name]))},{id:'date',label:'Visit date',type:'date',w:3},{id:'pax',label:'Visitors',type:'pax',w:2,rows:[['n','Visitors','Ticket types are chosen next',1,20]],sum:q=>pl(q.n,'visitor')}];},
  validate(q){const e={};if(!q.date||q.date<TODAY)e.date='Choose a visit date from today onwards.';return e;},
  list(q){return SITES.filter(s=>q.d==='any'||s.d===q.d||q.d==='site:'+s.id);},
  get:id=>byId(SITES,id),
  summary(q){return `${q.d.startsWith('site:')?byId(SITES,q.d.slice(5)).n:dn(q.d)} · ${fD(q.date)}`;},
  price:it=>it.p,unit:()=>'per adult, booking fee included',
  facets:[{id:'city',label:'City',type:'multi',vals:it=>DEST[it.d].name},{id:'type',label:'Type of site',type:'multi',vals:it=>it.type},{id:'timed',label:'Timed entry',type:'bool',test:it=>it.timed},{id:'max',label:'Maximum adult price',type:'max'}],
  sorts:[['rec','Most visited first',()=>0],['plow','Price: low to high',(a,b)=>a.p-b.p],['az','Name, A to Z',(a,b)=>a.n.localeCompare(b.n)]],
  card(it){return `<article class="rc"><a href="#tickets-${it.id}" class="plate zoom" style="display:block${PHOTOS[it.ph]?'':`;background:linear-gradient(150deg,${DEST[it.d].c[0]},${DEST[it.d].c[1]})`}" aria-label="${esc(it.n)}">${PHOTOS[it.ph]?pimg(it.ph,it.n):`<span style="position:absolute;inset:0;display:grid;place-items:center;color:rgba(255,255,255,.85)"><svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" stroke-width="1.300" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I.tickets}</svg></span>`}</a>
      <div class="body"><div class="row wrapx" style="gap:6px"><span class="bdg blue">${esc(it.type)}</span>${it.timed?'<span class="bdg">Timed entry</span>':''}</div><h3><a href="#tickets-${it.id}">${esc(it.n)}</a></h3><p class="small ink2">${esc(it.blurb)}</p>
        <div class="specs"><span>${ic('pin','s')}${DEST[it.d].name}</span><span>${ic('clock','s')}${esc(it.hours)}</span></div></div>
      <div class="buy"><span class="bdg req">On request</span><div class="price num">${fmt(it.p)}<small>per adult, booking fee included</small></div><a class="btn sm" href="#tickets-${it.id}">Choose tickets</a></div></article>`;},
  sel0(it,q){const s={date:q.date,slot:it.timed?firstFree(slotAvail(it.id+q.date,TSLOTS)):''};it.tk.forEach((t,i)=>{s['t'+i]=i===0?q.n:0;});it.add.forEach((a,i)=>{s['a'+i]=false;});return s;},
  detail(it){return {kicker:esc(it.type),title:it.n,meta:`${destLink(it.d)}<span>${ic('clock','s')} ${esc(it.hours)}</span>${it.timed?'<span class="bdg">Timed entry</span>':''}`,photos:[it.ph].concat(GAL[it.d]||[]),cap:'Destination photography',
      body:dsec('About the site',`<p>${esc(it.blurb)}</p>`)
        +dsec('Tickets',`<div class="tbl"><table class="t"><thead><tr><th>Ticket</th><th>Price</th></tr></thead><tbody>${it.tk.map(t=>`<tr><td><b>${esc(t.n)}</b>${t.note?`<div class="small muted">${esc(t.note)}</div>`:''}</td><td class="num"><b>${fmt(t.p)}</b></td></tr>`).concat(it.add.map(a=>`<tr><td><b>Add-on: ${esc(a[0])}</b><div class="small muted">${esc(a[2])}</div></td><td class="num"><b>${fmt(a[1])}</b></td></tr>`)).join('')}</tbody></table></div><p class="small muted" style="margin-top:10px">Prices include a ${fmt(3)} booking fee per ticket. Official tariffs are set by the Ministry of Tourism and Antiquities and can change; the final price is confirmed with your booking.</p>`)
        +dsec('Before you go',ckl(['Carry the passport you booked with','Student tickets need a valid student card at the gate','Large bags and tripods are not allowed inside'].concat(it.timed?['Arrive 15 minutes before your time slot']:[])))
        +dsec('How ticket booking works here',`<div class="alert gold">${ic('info','s')}<span>Site tickets are on request in this prototype. The official e-ticketing systems have no public booking API yet, so in production our team buys the tickets for you and confirms within 24 hours. You are charged only once they are confirmed.</span></div>`)};},
  conf(it,q,sel){const c=[{t:'date',id:'date',label:'Visit date'}];if(it.timed)c.push({t:'chips',id:'slot',label:'Entry time',opts:slotAvail(it.id+sel.date,TSLOTS)});
    it.tk.forEach((t,i)=>c.push({t:'step',id:'t'+i,label:t.n,sub:fmt(t.p)+' each',min:0,max:20}));if(it.add.length)c.push({t:'head',label:'Add-ons, for every visitor'});it.add.forEach((a,i)=>c.push({t:'check',id:'a'+i,label:a[0],sub:a[2],pr:`+${fmt(a[1])}<small>each</small>`}));return c;},
  quote(it,q,sel){if(!sel.date||sel.date<TODAY)return {err:'Choose a visit date from today onwards.'};const n=it.tk.reduce((s,t,i)=>s+(+sel['t'+i]||0),0);if(!n)return {err:'Add at least one ticket.'};
    if(it.timed&&(!sel.slot||slotAvail(it.id+sel.date,TSLOTS).find(a=>a[0]===sel.slot&&a[2])))return {err:'That entry time is sold out on this date. Choose another time.'};
    const lines=[];it.tk.forEach((t,i)=>{const c=+sel['t'+i]||0;if(c)lines.push(LN(`${t.n} × ${c}`,(t.p-3)*c));});it.add.forEach((a,i)=>{if(sel['a'+i])lines.push(LN(`${a[0]} × ${n}`,a[1]*n));});lines.push(LN(`Booking fee, ${pl(n,'ticket')}`,3*n,'t'));
    return mk('tickets',{ref:it.id,title:it.n,sub:`${pl(n,'ticket')}${it.timed?' · entry '+sel.slot:''}`,date:sel.date,time:sel.slot||'09:00',city:it.d,lines,refundable:true,policy:'Free to cancel while on request. Tickets are non-refundable once issued.',need:{names:n},pax:n});}
};

/* ---------- 9. restaurants ---------- */
function dslots(it,date){const base={lunch:['12:30','13:00','13:30','14:00','14:30'],dinner:['18:30','19:00','19:30','20:00','20:30','21:00','21:30']};const R=rng(it.id+date);const a=it.meals.flatMap(m=>base[m]).map(s=>[s,s,R()<.250]);if(a.every(x=>x[2]))a[0][2]=false;return a;}
const prS=n=>'$'.repeat(n);
VX.dining={
  q0:()=>({d:'any',date:addD(S.ctx.start,1),time:'19:30',n:S.ctx.ad+S.ctx.ch}),
  form(){return [{id:'d',label:'Location',type:'place',opts:DEST_OPTS(),w:4,ph:'City'},{id:'date',label:'Date',type:'date',w:2},{id:'time',label:'Time',type:'select',w:2,opts:['12:30','13:00','13:30','14:00','14:30','18:30','19:00','19:30','20:00','20:30','21:00','21:30']},{id:'pax',label:'Party size',type:'pax',w:2,rows:[['n','Guests','',1,12]],sum:q=>pl(q.n,'guest')}];},
  validate(q){const e={};if(!q.date||q.date<TODAY)e.date='Choose a date from today onwards.';return e;},
  list(q){return RESTS.filter(r=>q.d==='any'||r.d===q.d);},
  get:id=>byId(RESTS,id),
  summary(q){return `${dn(q.d)} · ${fD(q.date)} at ${q.time} · ${pl(q.n,'guest')}`;},
  price:it=>it.p,unit:it=>it.model==='set'?'per person, set menu':'deposit per person, taken off your bill',
  facets:[{id:'cui',label:'Cuisine',type:'multi',vals:it=>it.cui},{id:'pr',label:'Price range',type:'multi',vals:it=>prS(it.pr),order:['$','$$','$$$','$$$$']},{id:'city',label:'City',type:'multi',vals:it=>DEST[it.d].name},{id:'feat',label:'Features',type:'multi',vals:it=>it.feat},{id:'open',label:'Has a table near my time',type:'bool',test:(it,q)=>!!nearSlots(it,q).length}],
  sorts:[['rec','Recommended',(a,b)=>b.r-a.r],['plow','Price range: low to high',(a,b)=>a.pr-b.pr],['phigh','Price range: high to low',(a,b)=>b.pr-a.pr]],
  card(it,q){const ns=nearSlots(it,q);
    return `<article class="rc"><a href="#dining-${it.id}" class="plate zoom" style="display:block${PHOTOS[it.ph]?'':`;background:linear-gradient(150deg,${DEST[it.d].c[0]},${DEST[it.d].c[1]})`}" aria-label="${esc(it.n)}">${PHOTOS[it.ph]?pimg(it.ph,it.n):`<span style="position:absolute;inset:0;display:grid;place-items:center;color:rgba(255,255,255,.85)"><svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" stroke-width="1.300" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I.dining}</svg></span>`}</a>
      <div class="body"><div class="tiny muted">${esc(it.cui)} · ${prS(it.pr)} · ${esc(it.area)}, ${DEST[it.d].name}</div><h3><a href="#dining-${it.id}">${esc(it.n)}</a></h3><p class="small ink2">${esc(it.blurb)}</p><div class="tags">${it.feat.map(f=>`<span class="bdg">${esc(f)}</span>`).join('')}</div>
        <div class="row wrapx" style="gap:6px;margin-top:2px">${ns.length?ns.map(s=>`<button class="chip" data-act="dslot" data-id="${it.id}" data-t="${s}">${s}</button>`).join(''):`<span class="small muted">No tables within an hour of ${q.time}. See other times.</span>`}</div></div>
      <div class="buy"><div>${score(it.r)}</div><div class="price num">${fmt(it.p)}<small>${this.unit(it)}</small></div><a class="btn sm" href="#dining-${it.id}">Reserve</a></div></article>`;},
  sel0(it,q){const sl=dslots(it,q.date);return {date:q.date,slot:S.pick&&!sl.find(a=>a[0]===S.pick&&a[2])&&sl.find(a=>a[0]===S.pick)?S.pick:firstFree(sl,q.time),n:q.n,req:''};},
  detail(it){return {kicker:`${esc(it.cui)} · ${prS(it.pr)}`,title:it.n,meta:`${score(it.r)}<span>${ic('pin','s')} ${esc(it.area)}</span>${destLink(it.d)}`,photos:[it.ph],cap:'Destination photography',
      body:dsec('About',`<p>${esc(it.blurb)}</p><div class="tags" style="margin-top:12px">${it.feat.map(f=>`<span class="bdg">${esc(f)}</span>`).join('')}</div>`)
        +dsec('From the menu',`<div class="menu">${it.menu.map(m=>`<div><b>${esc(m[0])}</b><span class="num">${m[2]?fmt(m[2]):'On the tasting menu'}</span>${m[1]?`<small>${esc(m[1])}</small>`:''}</div>`).join('')}</div><p class="small muted" style="margin-top:10px">Sample dishes and prices. Menus change with the season.</p>`)
        +dsec('Reservation',kv([['Serves',it.meals.map(m=>m[0].toUpperCase()+m.slice(1)).join(' and ')],['You pay now',it.model==='set'?'Set menu, per person':'Deposit, deducted from your bill'],['Cancellation','Free up to 24 hours before'],['Dress','Smart casual']]))};},
  conf(it,q,sel){return [{t:'date',id:'date',label:'Date'},{t:'chips',id:'slot',label:'Time',opts:dslots(it,sel.date)},{t:'step',id:'n',label:'Guests',min:1,max:12},{t:'text',id:'req',label:'Special requests (optional)',ph:'Allergies, an occasion, a window table'}];},
  quote(it,q,sel){if(!sel.date||sel.date<TODAY)return {err:'Choose a date from today onwards.'};if(!sel.slot||dslots(it,sel.date).find(a=>a[0]===sel.slot&&a[2]))return {err:'That time is fully booked. Choose another time.'};
    return mk('dining',{ref:it.id,title:it.n,sub:`Table for ${sel.n} · ${sel.slot} · ${it.area}`,date:sel.date,time:sel.slot,city:it.d,lines:[LN(it.model==='set'?`Set menu × ${sel.n}`:`Deposit × ${sel.n}, deducted from your bill`,it.p*sel.n)],refundable:true,policy:'Free cancellation up to 24 hours before your table.',pax:sel.n,meta:{req:sel.req||''}});}
};
function nearSlots(it,q){const w=toMin(q.time);return dslots(it,q.date).filter(a=>!a[2]&&Math.abs(toMin(a[0])-w)<=60).slice(0,4).map(a=>a[0]);}

/* ---------- 10. trains & buses ---------- */
VX.trains={
  q0:()=>({from:'Cairo',to:'Luxor',date:addD(S.ctx.start,3),n:S.ctx.ad+S.ctx.ch}),
  form(){const o=STATIONS.map(s=>[s,s]);return [{id:'from',label:'From',type:'place',opts:o,w:3,ph:'City'},{id:'to',label:'To',type:'place',opts:o,w:3,ph:'City'},{id:'date',label:'Date',type:'date',w:2},{id:'pax',label:'Passengers',type:'pax',w:2,rows:[['n','Passengers','',1,12]],sum:q=>pl(q.n,'passenger')}];},
  validate(q){const e={};if(q.from===q.to)e.to='Choose a different arrival city.';if(!q.date||q.date<TODAY)e.date='Choose a date from today onwards.';return e;},
  list(q){const out=[];RAIL.forEach(r=>{const fw=r.from===q.from&&r.to===q.to,bw=r.to===q.from&&r.from===q.to;if(!fw&&!bw)return;r.deps.forEach(d=>{const dep=(toMin(d)+(bw?35:0))%1440,arr=dep+r.min;out.push({id:r.i+'-'+hm(dep).replace(':','')+(bw?'b':''),r,from:q.from,to:q.to,dep,arr,plus:Math.floor(arr/1440),p:Math.min(...r.cls.map(c=>c[1]))});});});return out;},
  summary(q){return `${q.from} → ${q.to} · ${fD(q.date)}`;},
  none(q){return `There is no direct sample service between ${q.from} and ${q.to}. Most routes connect through Cairo, or search flights for long distances.`;},
  price:it=>it.p,unit:()=>'per passenger',
  facets:[{id:'mode',label:'Type',type:'multi',vals:it=>it.r.mode==='Sleeper'?'Sleeper train':it.r.mode,order:['Train','Sleeper train','Bus']},{id:'time',label:'Departure time',type:'multi',vals:it=>band(it.dep),order:BANDS},{id:'max',label:'Maximum price',type:'max'}],
  sorts:[['early','Earliest departure',(a,b)=>a.dep-b.dep],['cheap','Cheapest',(a,b)=>a.p-b.p],['fast','Fastest',(a,b)=>a.r.min-b.r.min]],
  card(it,q){return `<article class="fl" id="x-${it.id}"><div class="main"><div class="legs"><div class="leg"><div class="carrier"><span class="cd">${ic(it.r.mode==='Bus'?'transfers':'trains','s')}</span><span>${esc(it.r.svc)}<small>${esc(it.r.op)}</small></span></div>
      <div class="tline"><div class="t num">${hm(it.dep)}<small>${esc(it.from)}</small></div><div class="mid"><span>${durS(it.r.min)}</span><i></i><span>${it.r.mode==='Sleeper'?'Overnight, cabin and meals':'Direct'}</span></div><div class="t e num">${hm(it.arr)}${it.plus?'<sup class="tiny"> +1</sup>':''}<small>${esc(it.to)}</small></div></div></div></div>
      <div class="buy"><div><div class="price num">${fmt(it.p)}<small>per passenger, from</small></div><span class="bdg req">On request</span></div><button class="btn sm" data-act="expand" data-k="trains" data-id="${it.id}" aria-expanded="false">Choose class</button></div></div><div class="more" hidden></div></article>`;},
  expand(it,q){return `<div class="fares">${it.r.cls.map((c,i)=>{const Q=this.quote(it,q,{o:i});return `<div class="fare"><h3>${esc(c[0])}</h3><ul><li>${it.r.mode==='Sleeper'?'Dinner and breakfast served in your cabin':it.r.mode==='Bus'?'Air-conditioned coach, one rest stop':'Air-conditioned carriage, reserved seat'}</li><li>${fmt(c[1])} per passenger</li></ul><div class="price num">${fmt(Q.total)}<small>total for ${pl(q.n,'passenger')}, fee included</small></div><button class="btn sm" data-act="addopt" data-k="trains" data-id="${it.id}" data-o="${i}">${tx('request')}</button></div>`;}).join('')}</div><span class="tiny muted">Sample timetable. Rail and coach tickets are on request until operator agreements are in place.</span>`;},
  quote(it,q,sel){const c=it.r.cls[sel.o||0];
    return mk('trains',{ref:it.id,title:`${it.from} → ${it.to}`,sub:`${it.r.svc}, ${it.r.op} · ${c[0]} · ${pl(q.n,'passenger')}`,date:q.date,end:it.plus?addD(q.date,1):q.date,time:hm(it.dep),city:STN_D[it.to],lines:[LN(`${c[0]} × ${q.n}`,c[1]*q.n),LN('Booking fee',4,'t')],
      parts:[{date:q.date,time:hm(it.dep),label:`Depart ${it.from} ${hm(it.dep)}, arrive ${it.to} ${hm(it.arr)}${it.plus?' next day':''}`,city:STN_D[it.to]}],refundable:true,policy:'Free to cancel while on request. Operator rules apply once ticketed.',need:{names:q.n},pax:q.n});}
};

/* ---------- 11. travel insurance ---------- */
const COUNTRIES=()=>[...Object.keys(VISA.free),...VISA.voa,...VISA.evisa,...VISA.embassy].sort();
function insPrice(p,o){const d=Math.max(1,diffD(o.start,o.end)+1),per=Math.max(p.min,p.rate*d);return {d,per,total:r2(per*(o.ad+o.ch*.500+o.sen*1.600))};}
const insTrav=o=>[o.ad?pl(o.ad,'adult'):'',o.ch?pl(o.ch,'child','children'):'',o.sen?pl(o.sen,'senior'):''].filter(Boolean).join(', ');
VX.insurance={
  q0:()=>({res:'United Kingdom',start:S.ctx.start,end:addD(S.ctx.start,S.ctx.nights),ad:S.ctx.ad,ch:S.ctx.ch,sen:0}),
  form(){return [{id:'res',label:'Country of residence',type:'place',w:3,ph:'Country',opts:COUNTRIES().map(c=>[c,c])},{id:'start',label:'Trip starts',type:'date',w:2},{id:'end',label:'Trip ends',type:'date',w:2},{id:'pax',label:'Travellers',type:'pax',w:3,rows:[['ad','Adults','18 to 64',0,9],['ch','Children','Under 18',0,8],['sen','Seniors','65 to 79',0,6]],sum:insTrav}];},
  validate(q){const e={};if(!q.start||q.start<TODAY)e.start='Choose a start date from today onwards.';if(!q.end||q.end<q.start)e.end='The trip must end on or after it starts.';else if(diffD(q.start,q.end)>44)e.end='Single-trip cover is limited to 45 days.';if(q.ad+q.ch+q.sen<1)e.pax='Add at least one traveller.';else if(!q.ad&&!q.sen)e.pax='Children must be insured with an adult.';return e;},
  list(){return INS;},
  get:id=>byId(INS,id),
  summary(q){return `${pl(diffD(q.start,q.end)+1,'day')} in Egypt · ${insTrav(q)} · resident of ${q.res}`;},
  price:(it,q)=>insPrice(it,q).total,unit:()=>'total for all travellers',
  facets:[{id:'scuba',label:'Must cover scuba diving',type:'bool',test:it=>it.cov.scuba},{id:'cancel',label:'Must include trip cancellation',type:'bool',test:it=>!!it.cov.cancel}],
  sorts:[['plow','Price: low to high',(a,b,q)=>insPrice(a,q).total-insPrice(b,q).total],['phigh','Most cover first',(a,b,q)=>insPrice(b,q).total-insPrice(a,q).total]],
  cell(v){return v===true?'<span class="yes">Covered</span>':v===false||v==null?'<span class="no">Not covered</span>':esc(v);},
  table(items,q){return `<div class="cmpwrap fade"><table class="cmp"><thead><tr><th></th>${items.map(p=>`<th class="${p.id==='comprehensive'?'hi':''}">${p.id==='comprehensive'?'<span class="bdg blue">Most chosen</span>':''}<h3 style="margin-top:6px">${p.n}</h3><div class="small muted" style="font-weight:500;margin:4px 0 10px">${p.blurb}</div><div class="price num">${fmt(insPrice(p,q).total)}<small>total, ${pl(insPrice(p,q).d,'day')}</small></div><div class="row wrapx" style="margin-top:10px;gap:8px"><button class="btn sm" data-act="addopt" data-k="insurance" data-id="${p.id}">${tx('add')}</button><a class="link small" href="#insurance-${p.id}">Policy details</a></div></th>`).join('')}</tr></thead>
      <tbody>${INSROWS.map(r=>`<tr><th scope="row">${r[1]}</th>${items.map(p=>`<td class="${p.id==='comprehensive'?'hi':''}">${this.cell(p.cov[r[0]])}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="small muted" style="margin-top:12px">Illustrative cover summary for this prototype. The insurer’s policy wording applies in production.</p>`;},
  sel0:(it,q)=>({start:q.start,end:q.end,ad:q.ad,ch:q.ch,sen:q.sen}),
  detail(it){return {kicker:'Travel insurance',title:it.n+' cover',meta:`<span>${ic('insurance','s')} Single trip to Egypt</span><span>${ic('clock','s')} 24-hour assistance line</span>`,photos:[],
      body:dsec('Cover summary',`<p>${it.blurb}</p><div class="tbl" style="margin-top:14px"><table class="t"><tbody>${INSROWS.map(r=>`<tr><td>${r[1]}</td><td>${VX.insurance.cell(it.cov[r[0]])}</td></tr>`).join('')}</tbody></table></div>`)
        +dsec('What is not covered',ckl(['Pre-existing medical conditions that were not declared','Travel against your government’s advice','Incidents while under the influence of alcohol or drugs','Diving below 30 metres or without a certified guide','Unattended belongings'],1))
        +dsec('Who can buy',ckl(['Residents of the country you select','Travellers aged up to 79 on the start date','Bought before you leave your home country','Trips of up to 45 days']))
        +dsec('Making a claim',`<ol class="stepsl"><li><span><b>Call the assistance line</b>Before any hospital admission where possible. The number is on your certificate.</span></li><li><span><b>Keep the paperwork</b>Medical reports, receipts and police reports for theft.</span></li><li><span><b>Claim online</b>From your trip dashboard, within 30 days of returning home.</span></li></ol>`)};},
  conf(){return [{t:'dates',a:'start',b:'end',la:'Trip starts',lb:'Trip ends'},{t:'step',id:'ad',label:'Adults',sub:'18 to 64',min:0,max:9},{t:'step',id:'ch',label:'Children',sub:'Under 18, half price',min:0,max:8},{t:'step',id:'sen',label:'Seniors',sub:'65 to 79',min:0,max:6}];},
  quote(it,q,sel){const o=sel&&sel.start?sel:q;if(!o.start||!o.end||o.end<o.start)return {err:'The trip must end on or after it starts.'};if(o.start<TODAY)return {err:'Cover must start today or later.'};if(diffD(o.start,o.end)>44)return {err:'Single-trip cover is limited to 45 days.'};if(o.ad+o.ch+o.sen<1)return {err:'Add at least one traveller.'};if(!o.ad&&!o.sen)return {err:'Children must be insured with an adult.'};
    const P=insPrice(it,o),lines=[];if(o.ad)lines.push(LN(`${pl(o.ad,'adult')} × ${pl(P.d,'day')}`,P.per*o.ad));if(o.ch)lines.push(LN(pl(o.ch,'child','children'),P.per*.500*o.ch));if(o.sen)lines.push(LN(pl(o.sen,'senior'),P.per*1.600*o.sen));
    return mk('insurance',{ref:it.id,title:`${it.n} travel insurance`,sub:`${pl(P.d,'day')} · ${insTrav(o)}`,date:o.start,end:o.end,time:'',city:'',lines,refundable:true,policy:'Full refund within 14 days of purchase if you have not travelled or claimed.',need:{names:o.ad+o.ch+o.sen},pax:o.ad+o.ch+o.sen});}
};

/* ---------- 12. fast-track & extras ---------- */
VX.extras={
  q0:()=>({ap:'CAI',dir:'arr',date:S.ctx.start,n:S.ctx.ad+S.ctx.ch}),
  form(){return [{id:'ap',label:'Airport',type:'place',opts:EG_AP_OPTS(),w:4},{id:'dir',label:'Arriving or departing',type:'select',w:2,opts:[['arr','Arriving'],['dep','Departing']]},{id:'date',label:'Date',type:'date',w:2},{id:'pax',label:'Passengers',type:'pax',w:2,rows:[['n','Passengers','',1,14]],sum:q=>pl(q.n,'passenger')}];},
  validate(q){const e={};if(!q.date||q.date<TODAY)e.date='Choose a date from today onwards.';return e;},
  list(q){return EXTRAS.filter(x=>!x.aps.length||(x.aps.includes(q.ap)&&(x.dir==='both'||x.dir===q.dir)));},
  get:id=>byId(EXTRAS,id),
  summary(q){return `${apCity(q.ap)} Airport · ${q.dir==='arr'?'arriving':'departing'} ${fD(q.date)}`;},
  price:(it,q)=>it.unit==='per person'?it.p*q.n:it.p,unit:it=>it.unit,
  facets:[{id:'cat',label:'Service type',type:'multi',vals:it=>it.cat,order:['Fast-track','VIP & lounge','Baggage','On the ground','Special arrangements']},{id:'air',label:'Airport services only',type:'bool',test:it=>it.aps.length>0},{id:'max',label:'Maximum price',type:'max'}],
  sorts:[['rec','Recommended',()=>0],['plow','Price: low to high',(a,b)=>a.p-b.p],['phigh','Price: high to low',(a,b)=>b.p-a.p]],
  card(it,q){return `<article class="rc noimg"><div class="body"><div class="row" style="gap:12px;align-items:flex-start"><span style="width:46px;height:46px;border-radius:12px;background:var(--blue-t);color:var(--blue);display:grid;place-items:center;flex:none">${ic(it.ico)}</span><div class="col" style="gap:6px"><div><span class="bdg">${esc(it.cat)}</span></div><h3><a href="#extras-${it.id}">${esc(it.n)}</a></h3><p class="small ink2">${esc(it.blurb)}</p>
      <div class="specs">${it.aps.length?`<span>${ic('pin','s')}${apCity(q.ap)} Airport</span>`:`<span>${ic('pin','s')}Arranged anywhere on your trip</span>`}${it.flight?`<span>${ic('flights','s')}Flight number needed before travel</span>`:''}</div></div></div></div>
      <div class="buy"><div class="price num">${it.p?fmt(it.p):'Free'}<small>${esc(it.unit)}</small></div><a class="btn sm" href="#extras-${it.id}">View service</a></div></article>`;},
  sel0:(it,q)=>({date:q.date,n:q.n,flight:''}),
  detail(it,q){return {kicker:esc(it.cat),title:it.n,meta:it.aps.length?`<span>${ic('pin','s')} ${it.aps.map(apCity).join(', ')}</span>`:`<span>${ic('pin','s')} Arranged anywhere on your trip</span>`,photos:[],
      body:dsec('The service',`<p>${esc(it.blurb)}</p>`)+dsec('How it works',`<ol class="stepsl">${it.steps.map(s=>`<li><span>${esc(s)}</span></li>`).join('')}</ol>`)
        +dsec('What we need from you',ckl((it.flight?['Your flight number, at least 24 hours before travel']:[]).concat(['The lead traveller’s name as on the passport','A mobile number that works in Egypt, or WhatsApp'])))
        +(it.aps.length?dsec('Where it is available',`<div class="tags">${it.aps.map(a=>`<span class="chip" style="cursor:default">${apName(a)}</span>`).join('')}</div><p class="small muted" style="margin-top:10px">Booking for ${apName(q.ap)}. Change the airport from the search page.</p>`):'')};},
  conf(it){const c=[{t:'date',id:'date',label:'Date'}];if(it.unit==='per person')c.push({t:'step',id:'n',label:'People',min:1,max:14});if(it.flight)c.push({t:'text',id:'flight',label:'Flight number (optional for now)',ph:'For example MS 778'});return c;},
  quote(it,q,sel){if(!sel.date||sel.date<TODAY)return {err:'Choose a date from today onwards.'};const n=it.unit==='per person'?sel.n:1;
    return mk('extras',{ref:it.id,title:it.n+(it.aps.length?`, ${apCity(q.ap)} Airport`:''),sub:(it.unit==='per person'?pl(n,'person','people'):'One booking')+(sel.flight?' · flight '+sel.flight:''),date:sel.date,time:'',city:it.aps.length?EGA[q.ap][2]:'giza',lines:[LN(it.unit==='per person'?`${it.n} × ${n}`:it.n,it.p*n)],refundable:true,policy:'Free cancellation up to 24 hours before the service.',need:{flight:it.flight},pax:n,meta:{flight:sel.flight||'',ap:q.ap}});}
};

/* ---------- 13. packages ---------- */
const lenB=d=>d<=7?'Up to 7 days':d<=10?'8 to 10 days':'11 days or more';
const pkgIncl=p=>Object.keys(p.inc).map(k=>`<span>${ic(INC_LAB[k][0],'s')}${INC_LAB[k][1]}</span>`).join('');
VX.packages={
  q0:()=>({theme:'any',date:S.ctx.start,ad:S.ctx.ad,ch:S.ctx.ch,len:'any'}),
  form(){return [{id:'theme',label:'Holiday style',type:'select',w:3,opts:[['any','Any style']].concat(uniq(PKGS.flatMap(p=>p.themes)).map(t=>[t,t]))},{id:'date',label:'Start date',type:'date',w:2},PAXF(3),{id:'len',label:'Length',type:'select',w:2,opts:[['any','Any length'],'Up to 7 days','8 to 10 days','11 days or more']}];},
  validate(q){const e={};if(!q.date||q.date<TODAY)e.date='Choose a start date from today onwards.';return e;},
  list(q){return PKGS.filter(p=>(q.theme==='any'||p.themes.includes(q.theme))&&(q.len==='any'||lenB(p.days)===q.len));},
  get:id=>byId(PKGS,id),
  summary(q){return `${q.theme==='any'?'All styles':q.theme} · from ${fD(q.date)} · ${paxSum(q)}`;},
  price:it=>it.p,unit:()=>'per person, excluding international flights',
  facets:[{id:'theme',label:'Style',type:'multi',vals:it=>it.themes},{id:'len',label:'Length',type:'multi',vals:it=>lenB(it.days),order:['Up to 7 days','8 to 10 days','11 days or more']},{id:'dest',label:'Includes',type:'multi',vals:it=>it.route.map(d=>DEST[d].name)},{id:'max',label:'Maximum price per person',type:'max'}],
  sorts:[['rec','Recommended',()=>0],['plow','Price: low to high',(a,b)=>a.p-b.p],['phigh','Price: high to low',(a,b)=>b.p-a.p],['days','Shortest first',(a,b)=>a.days-b.days]],
  card(it){return `<a class="pk" href="#packages-${it.id}"><div class="plate zoom">${pimg(it.ph,it.n)}</div><div class="body"><div class="tags">${it.themes.map(t=>`<span class="bdg blue">${esc(t)}</span>`).join('')}<span class="bdg">${it.days} days</span></div><h3>${esc(it.n)}</h3>
      <div class="routeline">${it.route.map((d,i)=>(i?'<i></i>':'')+`<b>${DEST[d].name}</b>`).join('')}</div><p class="small ink2">${esc(it.blurb)}</p><div class="specs">${pkgIncl(it)}</div>
      <div class="row between" style="margin-top:6px;align-items:end"><div class="price num">${fmt(it.p)}<small>per person, excluding international flights</small></div><span class="btn sm">View itinerary</span></div></div></a>`;},
  sel0:(it,q)=>({date:q.date,ad:q.ad,ch:q.ch,tier:0,guide:false,sea:false,abu:false}),
  detail(it){return {kicker:`${it.days} days · ${it.themes.join(' · ')}`,title:it.n,meta:`<span class="routeline">${it.route.map((d,i)=>(i?'<i></i>':'')+`<b>${DEST[d].name}</b>`).join('')}</span>`,photos:[it.ph].concat(it.plan.map(d=>d[2])),cap:'Photography of the route',
      body:dsec('Overview',`<p>${esc(it.blurb)}</p>`)
        +dsec('What is included',`<div class="col" style="gap:14px">${Object.keys(it.inc).map(k=>`<div class="row" style="align-items:flex-start;gap:12px"><span style="width:38px;height:38px;border-radius:10px;background:var(--blue-t);color:var(--blue);display:grid;place-items:center;flex:none">${ic(INC_LAB[k][0])}</span><div><b>${INC_LAB[k][1]}</b><div class="small ink2">${esc(it.inc[k])}</div></div></div>`).join('')}</div>`)
        +dsec('Day by day',`<div class="days">${it.plan.map((d,i)=>`<div class="dayrow"><div class="n">${i+1}<small>Day</small></div><div><h3>${esc(d[0])}</h3><p>${esc(d[1])}</p></div></div>`).join('')}</div>`)
        +dsec('Not included',ckl(['International flights. <a class="link" href="#flights">Search flights</a>','Entry visa. <a class="link" href="#visa">Check your visa</a>','Travel insurance. <a class="link" href="#insurance">Compare cover</a>','Gratuities and personal spending'],1))
        +dsec('Make it yours',`<p>Every package is assembled from the same flights, stays, cruises and tours you can book separately. Ask the concierge to add nights, swap a hotel or change the pace.</p><a class="btn ghost" href="#concierge" data-act="askc" data-q="Customise the ${esc(it.n)} package for two people" style="margin-top:14px">${ic('spark','s')}Customise with the concierge</a>`)};},
  conf(it,q,sel){const c=[{t:'date',id:'date',label:'Start date'},{t:'step',id:'ad',label:'Adults',min:1,max:9},{t:'step',id:'ch',label:'Children',sub:'2 to 11, 40% off',min:0,max:6},{t:'radio',id:'tier',label:'Accommodation level',opts:TIERS.map((t,i)=>[i,t[1],t[2],`${fmt(it.p*t[3])}<small>per person</small>`])},{t:'head',label:'Add to this package'},{t:'check',id:'guide',label:'Private guide throughout',sub:'Your own Egyptologist on every visit',pr:`+${fmt(180)}<small>per person</small>`}];
    if(!it.route.some(d=>['hurghada','sharm','dahab','marsaalam'].includes(d)))c.push({t:'check',id:'sea',label:'Red Sea extension',sub:'Three nights all-inclusive in Hurghada, with flights',pr:`+${fmt(320)}<small>per person</small>`});
    if(it.route.includes('aswan'))c.push({t:'check',id:'abu',label:'Abu Simbel by air',sub:'Fly from Aswan instead of the road trip',pr:`+${fmt(240)}<small>per person</small>`});return c;},
  quote(it,q,sel){if(!sel.date||sel.date<TODAY)return {err:'Choose a start date from today onwards.'};const T=TIERS[sel.tier]||TIERS[0],px=sel.ad+sel.ch*.600,base=it.p*T[3]*px,sea=sel.sea&&!it.route.some(d=>['hurghada','sharm','dahab','marsaalam'].includes(d)),abu=sel.abu&&it.route.includes('aswan');
    const lines=[LN(`${T[1]} package, ${paxSum(sel)}`,base*.880),LN('Taxes and local fees',base*.120,'t')];if(sel.guide)lines.push(LN('Private guide throughout',180*px));if(sea)lines.push(LN('Red Sea extension, 3 nights',320*px));if(abu)lines.push(LN('Abu Simbel by air',240*px));
    const days=it.days+(sea?3:0),end=addD(sel.date,days-1);
    return mk('packages',{ref:it.id,title:it.n,sub:`${days} days · ${T[1]} · ${paxSum(sel)}`,date:sel.date,end,time:'',city:it.route[0],lines,
      parts:[{date:sel.date,time:'',label:'Package begins: '+it.plan[0][0],city:it.route[0]},{date:end,time:'',label:'Package ends',city:it.route[it.route.length-1]}],refundable:true,policy:'Free cancellation until 30 days before the start date.',need:{names:sel.ad+sel.ch},pax:sel.ad+sel.ch,meta:{covers:Object.keys(it.inc).map(k=>INC_LAB[k][0]).filter(k=>k!=='flights'&&k!=='dining')}});}
};
/* ===== pages 1: chrome, home, guide, destination, visa ===== */
const vname=v=>S.lang==='en'?SHORT[v]:tx(v);
const FROM=(()=>{const m=a=>Math.min(...a);return {flights:60,hotels:m(HOTELS.map(h=>h.p)),cruises:m(CRUISES.map(c=>c.p)),tours:m(TOURS.map(x=>x.p)),transfers:m(Object.values(ZONES).flat().map(z=>z[3])),cars:m(CARS.map(c=>c.p)),esim:m(ESIMS.map(e=>e.p)),tickets:m(SITES.map(s=>s.p)),dining:m(RESTS.map(r=>r.p)),trains:m(RAIL.flatMap(r=>r.cls.map(c=>c[1]))),insurance:INS[0].min,extras:m(EXTRAS.filter(e=>e.p).map(e=>e.p)),packages:m(PKGS.map(p=>p.p))};})();
const mi=v=>`<a class="mi" href="#${v}"><span class="ic">${ic(v)}</span><span><b>${esc(tx(v))}</b><small>${esc(VINFO[v].d)}</small></span></a>`;
function chrome(h){const head=h.split('-')[0],cur=VX[h]?h:VX[head]?head:'';
  $('#nav').innerHTML=`<button id="bookbtn" data-act="mega" aria-expanded="false" aria-controls="mega">${esc(tx('nav_book'))}${ic('chev','s')}</button><a href="#packages" class="${cur==='packages'?'on':''}">${esc(tx('packages'))}</a><a href="#destinations" class="${h==='destinations'||head==='dest'?'on':''}">${esc(tx('nav_dest'))}</a><a href="#concierge" class="${h==='concierge'?'on':''}">${ic('spark','s')}${esc(tx('concierge'))}</a><a href="#visa" class="${h==='visa'?'on':''}">${esc(tx('nav_visa'))}</a>`;
  const feat=PKGS[0];
  $('#megain').innerHTML=GROUPS.map(g=>`<div><h4>${esc(tx(g[0]))}</h4>${g[1].map(mi).join('')}</div>`).join('')+`<a class="mfeat zoom" href="#packages-${feat.id}">${pimg(feat.ph,feat.n)}<span class="txt"><span class="tiny" style="letter-spacing:.1em;text-transform:uppercase;font-weight:700;color:var(--gold-b)">Featured package</span><b style="display:block;font-family:var(--f-display);font-weight:400;font-size:24px;line-height:1.1;margin:4px 0 6px">${esc(feat.n)}</b><span class="small">${feat.days} days from ${fmt(feat.p)} per person</span></span></a>`;
  $('#msheet').innerHTML=`<div class="mtop"><a href="#packages">${esc(tx('packages'))}</a><a href="#destinations">${esc(tx('nav_dest'))}</a><a href="#concierge">${esc(tx('concierge'))}</a><a href="#visa">${esc(tx('nav_visa'))}</a><a href="#trips">${esc(tx('trip'))}</a></div><div class="mgrid">${GROUPS.map(g=>`<div><h4>${esc(tx(g[0]))}</h4>${g[1].map(mi).join('')}</div>`).join('')}</div><div class="row" style="margin-top:22px"><label class="small muted" for="cur2">Currency</label><select class="sel" id="cur2" style="border-color:var(--line2)">${Object.keys(CUR).map(c=>`<option ${c===S.cur?'selected':''}>${c}</option>`).join('')}</select></div>`;
  $('#cur2').onchange=e=>{S.cur=e.target.value;$('#cur').value=S.cur;save();route();};
  const cb=$('#catbar');cb.hidden=!cur;if(cur){$('#catin').innerHTML=VORDER.map(v=>`<a href="#${v}" class="${v===cur?'on':''}">${ic(v,'s')}${esc(vname(v))}</a>`).join('');const on=$('#catin a.on');if(on&&on.scrollIntoView)on.scrollIntoView({block:'nearest',inline:'center'});}
  $('#fcols').innerHTML=GROUPS.map(g=>`<div><h4>${esc(tx(g[0]))}</h4>${g[1].map(v=>`<a href="#${v}">${esc(tx(v))}</a>`).join('')}</div>`).join('');
  $$('[data-t]').forEach(e=>e.textContent=tx(e.dataset.t));
  $('#credits').textContent='Photography: '+uniq(Object.values(PHOTOS).map(p=>p.credit.replace('Photo: ',''))).join(' · ');
  document.body.classList.toggle('home',h==='home');document.body.classList.toggle('nofab',h==='concierge'||h==='checkout'||head==='booking');
  closeMenu();updCount();solidHeader();}
function closeMenu(){const hd=$('#hdr');hd.classList.remove('open');const b=$('#bookbtn');if(b)b.setAttribute('aria-expanded','false');$('#burger').setAttribute('aria-expanded','false');}
function solidHeader(){$('#hdr').classList.toggle('solid',window.scrollY>30);}
window.addEventListener('scroll',solidHeader,{passive:true});

/* ---------- home ---------- */
const JSTAGES=[['Before you fly',['flights','insurance','esim']],['When you land',['extras','transfers']],['Where you stay',['hotels','cruises']],['What you do',['tours','tickets','dining']],['How you move',['trains','cars']],['Or all at once',['packages']]];
const EXPR=[['tours','luxor-balloon'],['tickets','gem'],['tours','felucca-nubian'],['cruises','dahabiya-nour'],['tours','blue-hole'],['tours','white-desert'],['tours','cairo-food-walk'],['dining','khufus'],['tours','abu-simbel-day'],['tours','dolphin-house'],['tours','ras-mohammed-dive'],['dining','nubian-home-dinner']];
const ASKS=['Plan a 10-day Egypt holiday for two people','I want three nights in Cairo, a four-night Nile cruise and three nights in Hurghada','Find a five-star hotel near the GEM','Book me a transfer from Cairo Airport to my hotel','Find the best available tours for tomorrow'];
function drawTabs(){const k=S.tab;$('#ctabs').innerHTML=VORDER.map(v=>`<button class="ctab ${v===k?'on':''}" role="tab" aria-selected="${v===k}" data-act="ctab" data-k="${v}">${ic(v)}<span>${esc(vname(v))}</span></button>`).join('');mountForm($('#chost'),k,()=>{location.hash=k;},'h');}
function pageHome(){const fp=PKGS[0],ex=buildPlan({days:10,ad:2,ch:0,budget:'mid'});
  app.innerHTML=`
  <section class="hero"><img class="ph" src="${PHOTOS.hero.src}" alt="The Pyramids of Giza" fetchpriority="high" decoding="async" onerror="this.remove()">
    <div class="wrap"><div class="eye" style="color:var(--gold-b)"><bdi>13 services by H · one checkout · one itinerary</bdi></div>
      <h1 style="margin-top:14px">${t('hero2')}</h1><p class="lead">${esc(tx('hero2s'))}</p>
      <div class="meta"><span>Giza local time <b class="num">&nbsp;${fmtClock(cairoMinutes())}</b></span><span>Prices in ${Object.keys(CUR).length} currencies</span><span>8 languages, including Arabic</span></div></div>
  </section>
  <div class="wrap"><div class="console"><div class="ctabs" role="tablist" aria-label="What would you like to book?" id="ctabs"></div><div class="cform" id="chost"></div></div>
    <div class="trust"><div>${ic('wallet')}<span><b>One checkout</b><small>Pay for all 13 services together</small></span></div><div>${ic('trip')}<span><b>One itinerary</b><small>Every booking in a single timeline</small></span></div><div>${ic('insurance')}<span><b>Clear prices</b><small>Taxes and fees shown before you pay</small></span></div><div>${ic('spark')}<span><b>A concierge that plans</b><small>Describe the trip, get it built</small></span></div></div></div>

  <section class="blk"><div class="wrap">
    <div class="shead"><div><div class="eye">The whole journey</div><h2 style="margin-top:10px">Everything, in the order <em>you will need it</em></h2></div><p class="lede" style="margin:0">Thirteen services that normally mean thirteen websites. Here they share one basket, one payment and one timeline.</p></div>
    <div class="jr">${JSTAGES.map((s,i)=>`<div class="st${i===5?' last':''}"><div class="n">${i<5?'Step '+(i+1):'Shortcut'}</div><h3>${s[0]}</h3>${s[1].map(v=>`<a class="jl" href="#${v}">${ic(v,'s')}<b>${esc(vname(v))}</b><small>from ${fmt(FROM[v])}</small></a>`).join('')}</div>`).join('')}</div>
  </div></section>

  <section class="blk tight" style="padding-top:0"><div class="wrap">
    <div class="shead"><div><div class="eye">Packages</div><h2 style="margin-top:10px">Egypt, <em>already arranged</em></h2></div><a class="link" href="#packages">All ${PKGS.length} packages ${ic('arrow','s flip')}</a></div>
    <div class="pf"><a class="pfbig plate zoom" href="#packages-${fp.id}">${pimg(fp.ph,fp.n)}<div class="txt"><div class="tags" style="margin-bottom:10px"><span class="bdg" style="background:var(--gold-b);color:#231703">Most booked</span><span class="bdg" style="background:rgba(255,255,255,.18);color:#fff">${fp.days} days</span></div><h3>${esc(fp.n)}</h3><p class="small" style="max-width:52ch;margin-top:8px;opacity:.92">${esc(fp.blurb)}</p><div class="row between wrapx" style="margin-top:14px"><div class="price num" style="color:#fff">${fmt(fp.p)}<small style="color:rgba(255,255,255,.8)">per person, excluding international flights</small></div><span class="btn gold sm">View itinerary</span></div></div></a>
      <div>${PKGS.slice(1,6).map(p=>`<a class="pfrow" href="#packages-${p.id}"><div class="plate">${pimg(p.ph,p.n)}</div><div><h3>${esc(p.n)}</h3><div class="small muted">${p.days} days · ${p.route.map(d=>DEST[d].name).join(', ')}</div></div><div class="price num" style="text-align:end">${fmt(p.p)}<small>per person</small></div></a>`).join('')}</div></div>
  </div></section>

  <section class="blk" style="background:var(--stone)"><div class="wrap">
    <div class="shead"><div><div class="eye">12 destinations</div><h2 style="margin-top:10px">Where in <em>Egypt?</em></h2></div><a class="link" href="#destinations">Open the Egypt guide ${ic('arrow','s flip')}</a></div>
    <div class="mapgrid"><div class="mapbox" id="mapbox"></div><div class="dpanel" id="dpanel"></div></div>
  </div></section>

  <section class="blk nile dark"><div class="wrap">
    <div class="shead"><div><div class="eye">Luxor to Abu Simbel</div><h2 style="margin-top:10px">The Nile, <em>temple by temple</em></h2></div><a class="btn gold" href="#cruises">Browse Nile cruises</a></div>
    ${nileHtml()}
  </div></section>

  <section class="blk"><div class="wrap">
    <div class="shead"><div><div class="eye">Tours, tickets and tables</div><h2 style="margin-top:10px">Days you will <em>talk about</em></h2></div><div class="railnav"><button data-act="rail" data-d="-1" aria-label="Previous">‹</button><button data-act="rail" data-d="1" aria-label="Next">›</button></div></div>
    <div class="rail" id="xprail">${EXPR.map(([v,id])=>{const it=VX[v].get(id);return `<a class="xp plate zoom" href="#${v}-${id}">${pimg(it.ph,it.n)}<span class="tag">${DEST[it.d].name}</span><div class="txt"><div class="tiny" style="opacity:.85">${esc(vname(v))}</div><h3>${esc(it.n)}</h3><div class="small num">from <b>${fmt(it.p)}</b></div></div></a>`;}).join('')}</div>
  </div></section>

  <section class="blk dark"><div class="wrap cband">
    <div><div class="eye">${ic('spark','s')} AI travel concierge</div><h2 style="margin-top:10px">Say what you want. <em>Watch it get built.</em></h2><p class="muted" style="max-width:52ch;margin-top:14px">The concierge knows every service on this site and everything already in your trip. It plans whole itineraries, finds single items and tells you what is still missing.</p>
      <form class="ask" id="askf"><input id="askq" type="text" aria-label="Ask the concierge" placeholder="Plan a 10-day Egypt holiday for two people" autocomplete="off"><button class="btn gold" type="submit">Ask ${ic('arrow','s flip')}</button></form>
      <div class="sugg">${ASKS.slice(1).map(a=>`<a class="chip" href="#concierge" data-act="askc" data-q="${esc(a)}">${esc(a)}</a>`).join('')}</div></div>
    <div class="preview"><div class="row between"><div><div class="tiny muted" style="letter-spacing:.1em;text-transform:uppercase;font-weight:700">Example answer</div><div class="serif" style="font-size:26px;margin-top:2px">${esc(ex.title)}</div></div><div class="price num" style="text-align:end">${fmt(ex.total/2)}<small>per person, ${ex.items.length} bookable items</small></div></div>
      <div>${ex.days.filter(d=>d.title).slice(0,5).map(d=>`<div class="pvrow"><div class="d">${d.n}</div><div><b>${esc(d.title)}</b><div class="tiny muted">${esc(d.city||'')} · ${fD(d.date)}</div></div><span class="tiny muted">${pl(d.items.filter(i=>i.ci).length,'booking')}</span></div>`).join('')}</div>
      <a class="link" href="#concierge" data-act="askc" data-q="${esc(ASKS[0])}">Build this plan and edit it ${ic('arrow','s flip')}</a></div>
  </div></section>

  <section class="blk tight"><div class="wrap split">
    <div class="card pane"><div class="eye">Entry</div><h2>${t('visa_t')}</h2>
      <div class="fgrid2" style="grid-template-columns:1fr auto;align-items:end"><div class="fld"><label for="qv">Passport</label><select id="qv">${countryOpts()}</select></div><button class="btn" data-act="visago" style="height:48px;border-radius:var(--r-s)">Check</button></div>
      <p class="small muted">Visa on arrival US$30 · e-Visa from US$30 · Sinai coast stamp free for up to 15 days</p></div>
    <div class="card pane"><div class="eye">${esc(tx('ess_t'))}</div>
      <div class="ess" style="grid-template-columns:1fr 1fr;gap:18px">${[['126','Tourist Police'],['220V','Type C and F plugs'],['Oct–Apr','Best season'],['EGP','Egyptian pound']].map(([a,b])=>`<div><div class="big">${a}</div><div class="small muted">${b}</div></div>`).join('')}</div>
      <a class="link" href="#visa">All essentials and questions ${ic('arrow','s flip')}</a></div>
  </div></section>`;
  drawTabs();drawMap();initNile();
  $('#askf').onsubmit=e=>{e.preventDefault();S.pending=$('#askq').value.trim()||ASKS[0];location.hash='concierge';};}
function drawMap(){const mb=$('#mapbox');if(!mb)return;mb.innerHTML=mapSVG({sel:S.mapSel,moods:true});bindPins(mb,k=>{S.mapSel=k;drawMap();});drawPanel();}
function drawPanel(){const k=S.mapSel,d=DEST[k],el=$('#dpanel');if(!el)return;const inD=DKEYS.includes(k);
  el.innerHTML=`<div class="plate" style="background:linear-gradient(150deg,${d.c[0]},${d.c[1]})">${pimg(k,d.name)}</div><div class="in"><div><div class="eye">${d.mood.map(m=>MOODS.find(x=>x[0]===m)[1]).join(' · ')}</div><h2 style="font-size:clamp(34px,4vw,48px);margin-top:6px">${d.name}</h2><p class="ink2" style="margin-top:6px">${esc(d.tag)}</p></div>
    <div class="facts"><div><small>Stay</small>${d.days}</div><div><small>Best time</small>${d.best}</div><div><small>Getting there</small><span class="small" style="font-weight:500">${esc(d.get)}</span></div></div>
    <ul class="hl">${d.hl.slice(0,3).map(h=>`<li>${esc(h)}</li>`).join('')}</ul>
    <div class="row wrapx" style="margin-top:auto"><a class="btn sm" href="#dest-${k}">Explore ${d.name}</a>${inD?`<button class="btn ghost sm" data-act="vgo" data-k="hotels" data-q="${esc(JSON.stringify({d:k}))}">Hotels</button><button class="btn ghost sm" data-act="vgo" data-k="tours" data-q="${esc(JSON.stringify({d:k}))}">Tours</button>`:''}</div></div>`;}
const MOODS=[['ancient','Ancient wonders'],['nile','Life on the Nile'],['sea','The Red Sea'],['desert','Desert and oases'],['culture','Cairo and culture'],['adventure','Adventure']];
function nileHtml(){return `<div class="nilebox"><svg viewBox="0 0 1000 220" aria-hidden="true">
    <defs><linearGradient id="riv" x1="0" x2="1"><stop offset="0" stop-color="#2A9DA8"/><stop offset="1" stop-color="#7FD6C7"/></linearGradient></defs>
    <path d="M30,120 C150,40 260,200 380,120 S600,40 700,120 S880,200 970,110" fill="none" stroke="#1F6B5A" stroke-width="64" stroke-linecap="round" opacity=".28"/>
    <path id="river" d="M30,120 C150,40 260,200 380,120 S600,40 700,120 S880,200 970,110" fill="none" stroke="url(#riv)" stroke-width="24" stroke-linecap="round"/>
    <g id="stopdots"></g><g id="boat"><path d="M-16 4 H16 L11 11 H-11Z" fill="#F5F0E6"/><path d="M0 -26 C10 -14 12 -2 9 2 H-2Z" fill="#D9A441"/><path d="M0 -28 V4" stroke="#F5F0E6" stroke-width="1.500"/></g></svg></div>
    <div class="stops" id="stops">${STOPS.map((s,i)=>`<button class="stop ${i===0?'on':''}" data-stop="${i}"><small>${s[3]}</small>${s[0]}</button>`).join('')}</div><div class="stopinfo" id="stopinfo"></div>`;}
function initNile(){const path=$('#river');if(!path||!path.getTotalLength)return;const len=path.getTotalLength();let cur=0,anim=0;const SK=['luxor','esna','edfu','komombo','aswan','abusimbel'];
  $('#stopdots').innerHTML=STOPS.map((s,i)=>{const p=path.getPointAtLength(len*s[1]);return `<circle cx="${p.x}" cy="${p.y}" r="7" fill="#07343C" stroke="#F5F0E6" stroke-width="2"/><text x="${i===0?p.x-12:i===STOPS.length-1?p.x+14:p.x}" y="${p.y+(p.y>110?42:-24)}" text-anchor="${i===0?'start':i===STOPS.length-1?'end':'middle'}" font-family="Instrument Serif, serif" font-size="24" fill="#F5F0E6">${s[0]}</text>`;}).join('');
  const place=f=>{const p=path.getPointAtLength(len*f),q=path.getPointAtLength(Math.min(len,len*f+2));const a=Math.atan2(q.y-p.y,q.x-p.x)*57.300;const bt=$('#boat');if(bt)bt.setAttribute('transform',`translate(${p.x} ${p.y-6}) rotate(${Math.max(-25,Math.min(25,a))})`);};
  const info=i=>{const s=STOPS[i];$('#stopinfo').innerHTML=`<div class="plate">${pimg(SK[i],s[0])}</div><div><div class="eye">${s[3]}</div><h3>${s[0]}</h3><p class="muted" style="margin-top:6px;max-width:56ch">${esc(s[2])}</p></div><a class="btn ghost" href="#cruises">See sailings</a>`;};
  const go=i=>{const from=cur,to=STOPS[i][1],t0=performance.now();cancelAnimationFrame(anim);const still=matchMedia('(prefers-reduced-motion: reduce)').matches;const st=n=>{const k=still?1:Math.min(1,(n-t0)/1100),e=k<.500?2*k*k:1-Math.pow(-2*k+2,2)/2;cur=from+(to-from)*e;place(cur);if(k<1)anim=requestAnimationFrame(st);};anim=requestAnimationFrame(st);
    $$('[data-stop]').forEach(b=>b.classList.toggle('on',+b.dataset.stop===i));info(i);};
  $$('[data-stop]').forEach(b=>b.onclick=()=>go(+b.dataset.stop));place(0);info(0);}

/* ---------- Egypt guide ---------- */
function pageGuide(){
  app.innerHTML=`<section class="vh"><div class="wrap"><nav class="crumb"><a href="#home">Home</a><span>${esc(tx('nav_dest'))}</span></nav><div class="eye" style="margin-top:10px">The Egypt guide</div><h1>Twelve places, <em>one country</em></h1><p class="sub">Choose what you came for and the map narrows to match. Every destination links to its hotels, tours, tickets and tables.</p>
    <div class="moods" style="margin-top:18px" role="group" aria-label="Filter destinations by interest">${MOODS.map(([k,n])=>`<button class="chip ${S.mood===k?'on':''}" data-act="mood" data-k="${k}" aria-pressed="${S.mood===k}">${n}</button>`).join('')}</div></div></section>
  <section class="blk tight"><div class="wrap"><div class="mapgrid"><div class="mapbox" id="mapbox"></div><div class="dpanel" id="dpanel"></div></div>
    <div class="rail" style="margin-top:28px;grid-auto-columns:min(220px,60vw)">${Object.entries(DEST).map(([k,d])=>`<a class="xp plate zoom" href="#dest-${k}" style="aspect-ratio:4/5;background:linear-gradient(150deg,${d.c[0]},${d.c[1]})">${pimg(k,d.name)}<div class="txt"><h3 class="serif" style="font-size:24px;font-weight:400">${d.name}</h3><div class="tiny" style="opacity:.85">${d.days}</div></div></a>`).join('')}</div></div></section>
  <section class="blk" style="background:var(--stone)"><div class="wrap cartwrap">
    <div class="col" style="gap:16px"><div class="eye">A small souvenir</div><h2>Write your name in <em>hieroglyphs</em></h2><p class="ink2">Each sound has a sign. Type a name to see it inside a royal cartouche, the oval that framed a pharaoh’s name.</p>
      <label for="nm" class="small muted">Your name</label><input id="nm" class="nameinput" value="Nefertari" maxlength="14" autocomplete="off">
      <div class="row wrapx"><button class="btn ghost sm" data-act="glyphcopy">Copy hieroglyphs</button><a class="btn sm" href="#tickets-gem">See the real ones at the museum</a></div></div>
    <div class="cartouche" id="cart"></div></div></section>
  <section class="blk"><div class="wrap"><div class="shead"><div><div class="eye">History</div><h2 style="margin-top:10px">5,000 years in <em>one scroll</em></h2></div><p class="lede" style="margin:0">The moments that built the sites you will stand in.</p></div>
    <div class="tlx">${ERAS.map(e=>`<div class="era"><div class="yr">${e[0]}</div><div class="line"></div><h3>${esc(e[1])}</h3><p class="ink2 small">${esc(e[2])}</p></div>`).join('')}</div></div></section>
  <section class="blk tight" style="padding-top:0"><div class="wrap"><div class="shead"><div><div class="eye">Calendar</div><h2 style="margin-top:10px">Through the <em>year</em></h2></div></div>
    <div class="events">${EVENTS.map(e=>`<a class="ev" href="#dest-${e[4]}"><div class="mo">${e[0].toUpperCase()}<b>${e[1]}</b></div><div><h3>${esc(e[2])}</h3><p class="ink2 small" style="margin-top:4px">${esc(e[3])}</p></div></a>`).join('')}</div></div></section>`;
  drawMap();const nm=$('#nm');const rc=()=>{const g=toGlyphs(nm.value);$('#cart').innerHTML=g.length?g.map(([l,c])=>`<span class="glyph"><b>${c}</b><small>${l.toUpperCase()}</small></span>`).join(''):'<span class="muted">Type a name</span>';};nm.oninput=rc;rc();}

/* ---------- destination ---------- */
function pageDest(k){const d=DEST[k];if(!d)return pageGuide();const alias=k==='abusimbel'?'aswan':k==='whitedesert'?'cairo':k;
  const row=(v,it,sub)=>`<a class="pfrow" href="#${v}-${it.id}"><div class="plate"${PHOTOS[it.ph]?'':` style="background:linear-gradient(150deg,${d.c[0]},${d.c[1]})"`}>${pimg(it.ph,it.n)}</div><div><h3>${esc(it.n)}</h3><div class="small muted">${esc(sub)}</div></div><div class="price num" style="text-align:end">${fmt(it.p)}<small>${esc(VX[v].unit(it,S.q[v]||VX[v].q0()).split(',')[0])}</small></div></a>`;
  const grp=(v,title,list,sub)=>list.length?`<div><div class="row between" style="margin-bottom:6px"><h3 class="serif" style="font-size:26px;font-weight:400">${title}</h3>${DKEYS.includes(alias)?`<button class="link small" data-act="vgo" data-k="${v}" data-q="${esc(JSON.stringify({d:alias}))}">See all ${ic('arrow','s flip')}</button>`:''}</div>${list.slice(0,4).map(it=>row(v,it,sub(it))).join('')}</div>`:'';
  const match=it=>it.d===k||it.also===k||(k==='abusimbel'&&/Abu Simbel/.test(it.n));
  const blocks=[grp('hotels','Stay',HOTELS.filter(match),it=>`${it.type} · ${it.area}`),grp('tours','Do',TOURS.filter(match),it=>`${hrsL(it.hrs)} · ${it.grp}`),grp('tickets','See',SITES.filter(match),it=>`${it.type} · ${it.hours}`),grp('dining','Eat',RESTS.filter(match),it=>`${it.cui} · ${it.area}`)].filter(Boolean);
  app.innerHTML=`<section class="dhero" style="background:linear-gradient(150deg,${d.c[0]},${d.c[1]})">${pimg(k,d.name)}<div class="wrap"><nav class="crumb"><a href="#home">Home</a><span><a href="#destinations">${esc(tx('nav_dest'))}</a></span></nav><h1 style="margin-top:8px">${d.name}</h1><p style="font-size:20px;max-width:40ch;margin-top:8px">${esc(d.tag)}</p></div></section>
  <section class="blk tight"><div class="wrap split">
    <div class="col" style="gap:20px"><div class="facts"><div><small>Stay</small>${d.days}</div><div><small>Best time</small>${d.best}</div><div><small>Getting there</small><span class="small" style="font-weight:500">${esc(d.get)}</span></div></div>
      <div><h2 style="font-size:34px;margin-bottom:12px">Do not miss</h2><ul class="hl" style="font-size:17px">${d.hl.map(h=>`<li>${esc(h)}</li>`).join('')}</ul></div>
      <div class="row wrapx"><a class="btn" href="#concierge" data-act="askc" data-q="Plan a 7-day trip that includes ${esc(d.name)}">${ic('spark','s')}Plan a trip with ${d.name}</a><a class="btn ghost" href="#packages">Packages</a></div></div>
    <div class="mapbox" id="dmap">${mapSVG({sel:k})}</div></div></section>
  <section class="blk tight" style="padding-top:0"><div class="wrap"><div class="shead"><div><div class="eye">Book</div><h2 style="margin-top:10px">${d.name}, <em>ready to book</em></h2></div></div>
    ${blocks.length?`<div class="split" style="gap:36px 48px">${blocks.join('')}</div>`:`<div class="empty">${ic('map')}<h3>Reached on a tour</h3><p>${d.name} has no listings of its own in this prototype. It is visited on tours from nearby cities.</p><a class="btn" href="#tours">Browse tours</a></div>`}</div></section>`;
  bindPins($('#dmap'),p=>{location.hash='dest-'+p;});}

/* ---------- visa & essentials ---------- */
function pageVisa(){const c=S.visaPick||'United Kingdom';
  app.innerHTML=`<section class="vh"><div class="wrap"><nav class="crumb"><a href="#home">Home</a><span>${esc(tx('nav_visa'))}</span></nav><div class="eye" style="margin-top:10px">Before you go</div><h1>${t('visa_t')}</h1><p class="sub">${esc(tx('visa_s'))}</p></div></section>
  <div class="wrap" style="padding-top:28px;padding-bottom:72px">
    <div class="split"><div class="col" style="gap:14px"><div class="card" style="padding:18px"><div class="fld"><label for="vc">Passport</label><select id="vc">${countryOpts(c)}</select></div></div><div id="vres"></div></div>
      <div class="card tbl"><table class="t"><thead><tr><th>Option</th><th>Fee</th><th>Stay</th></tr></thead><tbody>
        <tr><td>e-Visa, single entry<div class="small muted">Apply online before you fly</div></td><td class="num">US$30</td><td>30 days</td></tr>
        <tr><td>e-Visa, multiple entry<div class="small muted">Valid 180 days</div></td><td class="num">US$65</td><td>30 days per stay</td></tr>
        <tr><td>Visa on arrival<div class="small muted">Cash at the bank kiosk before passport control, since 1 March 2026</div></td><td class="num">US$30</td><td>30 days</td></tr>
        <tr><td>Sinai coast stamp<div class="small muted">Sharm, Dahab, Nuweiba and Taba only</div></td><td class="num">Free</td><td>Up to 15 days</td></tr>
      </tbody></table><p class="small muted" style="padding:12px">Passport valid for six months or more. Checked November 2026. In production the rules are read live from IATA Timatic and visa2egypt.gov.eg. This site does not issue visas.</p></div></div>
    <div class="shead" style="margin-top:64px"><h2>${esc(tx('ess_t'))}</h2></div>
    <div class="ess">
      <div class="card"><div class="eye">Emergency</div>${EMERG.map(([a,b])=>`<div class="row between" style="border-bottom:1px solid var(--line);padding:6px 0"><span>${a}</span><strong class="num">${b}</strong></div>`).join('')}</div>
      <div class="card"><div class="eye">Money</div><div class="big">EGP</div><p class="ink2 small">Cards work in hotels and restaurants. Keep small notes for tips and markets. Demo rate: US$1 = EGP 48.5.</p></div>
      <div class="card"><div class="eye">Connected</div><div class="big">eSIM</div><p class="ink2 small">Buy before you land and you are online at the gate. 220V, Type C and F plugs.</p><a class="link small" href="#esim">Get an eSIM ${ic('arrow','s flip')}</a></div>
      <div class="card"><div class="eye">Dress</div><div class="big">Cover up</div><p class="ink2 small">Shoulders and knees covered in cities and religious sites, and a scarf for women in mosques. Swimwear at resorts.</p></div>
    </div>
    <div class="card" style="padding:20px;margin-top:14px"><div class="eye">Average daytime high, °C</div><div class="tbl" style="margin-top:10px"><table class="t num"><thead><tr><th></th>${MON.map(m=>`<th>${m}</th>`).join('')}</tr></thead><tbody>
      ${CLIMATE.map(([cn,a])=>`<tr><td><strong>${cn}</strong></td>${a.map(x=>{const f=(Math.min(42,Math.max(18,x))-18)/24;return `<td style="background:${rgb(mix([14,143,131],[217,120,60],f),.140+f*.300)}">${x}</td>`;}).join('')}</tr>`).join('')}
    </tbody></table></div><p class="small muted" style="margin-top:8px">Approximate long-term averages.</p></div>
    <div class="shead" style="margin-top:64px"><h2>${esc(tx('faq_t'))}</h2></div>
    <div>${FAQ.map(([q,a],i)=>`<details class="faq" ${i===0?'open':''}><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div></div>`;
  $('#vc').onchange=()=>{S.visaPick=$('#vc').value;showVisa();};showVisa();}
const VISA_M=c=>({free:['No visa needed',`Citizens of ${c} can enter visa-free for up to ${VISA.free[c]} days.${c==='Jordan'?' Conditions apply to some travellers.':''}`],
  voa:['Visa on arrival or e-Visa','Buy a 30-day visa at the airport for US$30 in cash, or get the e-Visa online first and skip the kiosk queue. For a coast-only holiday in Sharm, the free 15-day Sinai stamp may be enough.'],
  evisa:['Apply for the e-Visa before you fly','Apply online at least seven days before travel: US$30 single entry, US$65 multiple entry. Holders of a valid, used US, UK, Schengen, Japan, Canada, Australia or New Zealand visa may also qualify for visa on arrival.'],
  embassy:['Apply at an Egyptian embassy','Your visa must be issued before travel. Holders of a valid, used US, UK or Schengen visa may qualify for visa on arrival. Confirm with the embassy first.']});
function showVisa(){const c=S.visaPick||$('#vc').value,k=visaFor(c),M=VISA_M(c)[k];
  $('#vres').innerHTML=`<div class="card verdict ${k}"><div class="eye">${esc(c)}</div><h3 class="serif" style="font-size:32px;font-weight:400;margin-top:8px">${M[0]}</h3><p class="ink2" style="margin-top:8px">${M[1]}</p>${k!=='free'?`<div class="row wrapx" style="margin-top:14px"><a class="btn sm" href="https://visa2egypt.gov.eg" target="_blank" rel="noopener">Official e-Visa portal</a><a class="btn ghost sm" href="#extras-arrival-fast-track">Add arrival fast-track</a></div>`:''}</div>`;}
/* ===== pages 2: trip engine, My trip, checkout, confirmation ===== */

/* ---------- programmatic quotes: the planner and concierge price items through the same functions as the booking pages ---------- */
const PQ={
  hotelPick(d,tier){const l=HOTELS.filter(h=>h.d===d).sort((a,b)=>a.p-b.p);if(!l.length)return null;if(tier==='budget')return l[0];if(tier==='luxury')return l.filter(h=>h.stars>=5).sort((a,b)=>b.r-a.r||b.p-a.p)[0]||l[l.length-1];const mid=l.filter(h=>h.stars>=4);return (mid.length?mid:l).reduce((b,h)=>Math.abs(h.p-150)<Math.abs(b.p-150)?h:b);},
  hotelQ(it,inD,nights,ad,ch){const rs=hotelRooms(it),g=ad+ch;let room=rs.length-1,rooms=ad;for(let r=0;r<rs.length;r++){const n=Math.ceil(g/rs[r][3]);if(n<=ad){room=r;rooms=n;break;}}return VX.hotels.quote(it,{},{in:inD,out:addD(inD,nights),ad,ch,rooms,room,bb:false});},
  hotel(d,tier,inD,nights,ad,ch){const it=this.hotelPick(d,tier);return it?this.hotelQ(it,inD,nights,ad,ch):null;},
  leg(a,b,date,early){const legs=flightSearch(a,b,date,'Economy');if(!legs.length)return null;if(early==='late'||early==='pm'){const lo=early==='pm'?780:600,l2=legs.filter(l=>l.dep>=lo&&l.dep<=1140).sort((x,y)=>x.dep-y.dep);if(l2.length)return l2[0];}else if(early)return legs.slice().sort((x,y)=>(x.dep<300?x.dep+1440:x.dep)-(y.dep<300?y.dep+1440:y.dep))[0];const ok=legs.filter(l=>l.dep>=390&&l.dep<=840);return (ok.length?ok:legs).slice().sort((x,y)=>x.p-y.p)[0];},
  flight(a,b,date,ad,ch,early){const l=this.leg(a,b,date,early);return l?VX.flights.quote({id:l.id,legs:[l],p:l.p,car:l.car},{ad,ch,inf:0,cabin:'Economy',trip:'one'},{o:1}):null;},
  round(a,b,d1,d2,ad,ch){const o=this.leg(a,b,d1),r=this.leg(b,a,d2,'pm');return o&&r?VX.flights.quote({id:o.id+'_'+r.id,legs:[o,r],p:o.p+r.p,car:o.car},{ad,ch,inf:0,cabin:'Economy',trip:'round'},{o:1}):null;},
  transfer(ap,zone,dir,date,time,ad,ch,tier,veh){const n=ad+ch,id=veh||(tier==='luxury'&&n<=3?'executive':n<=3?'sedan':n<=4?'suv':n<=7?'minivan':'minibus'),v=byId(VEHS,id);if(!ZONES[ap])return null;
    return VX.transfers.quote(Object.assign({},v,{z:zoneOf(ap,zone)}),{dir,trip:'one',ap,zone,date,time,ad,ch,bags:Math.min(n,v.bags)});},
  cruise(route,tier,date,ad,ch){const l=CRUISES.filter(c=>c.route===route).sort((a,b)=>a.p-b.p);if(!l.length)return null;const it=tier==='luxury'?l[l.length-1]:tier==='budget'?l[0]:l[Math.min(1,l.length-1)];return VX.cruises.quote(it,{},{date,cabin:tier==='luxury'?1:0,ad,ch});},
  tour(id,date,ad,ch,time){const it=byId(TOURS,id);return VX.tours.quote(it,{},{date,slot:firstFree(slotAvail(id+date,it.slots),time),ad,ch,lang:'English',priv:false});},
  ticket(id,date,n,time){const it=byId(SITES,id),s={date,slot:it.timed?firstFree(slotAvail(id+date,TSLOTS),time||'09:00'):''};it.tk.forEach((t,i)=>{s['t'+i]=i===0?n:0;});return VX.tickets.quote(it,{},s);},
  dining(id,date,time,n){const it=byId(RESTS,id);return VX.dining.quote(it,{},{date,slot:firstFree(dslots(it,date),time),n,req:''});},
  esim(days,date,qty){const q={cov:'eg',days:days<=7?'7':days<=15?'15':'30',use:'standard'};const it=esimBest(ESIMS.filter(e=>e.cov==='Egypt'),q)||ESIMS[2];return VX.esim.quote(it,q,{qty:qty||1,date});},
  ins(start,end,ad,ch,tier){return VX.insurance.quote(INS[tier==='budget'?0:1],{},{start,end,ad,ch,sen:0});},
  extra(id,ap,date,n){return VX.extras.quote(byId(EXTRAS,id),{ap,n},{date,n,flight:''});},
  train(from,to,date,n){const l=VX.trains.list({from,to,date,n});if(!l.length)return null;const it=l.filter(x=>x.dep>=420).sort((a,b)=>a.dep-b.dep)[0]||l[0];return VX.trains.quote(it,{date,n},{o:0});}
};
const PLACE={giza:['CAI','giza'],cairo:['CAI','downtown'],luxor:['LXR','east'],aswan:['ASW','city'],hurghada:['HRG','hurghada'],sharm:['SSH','naama'],dahab:['SSH','dahab'],marsaalam:['RMF','abudabbab'],alexandria:['HBE','city'],abusimbel:['ABS','town']};
const PROG={
  giza:[[['tour','gem-pyramids-day','08:30'],['ticket','gem','09:00'],['ticket','giza-plateau']],[['tour','islamic-cairo','09:00'],['tour','cairo-food-walk','18:00']],[['tour','saqqara-dahshur','08:00'],['dining','nile-dinner-cruise','20:00']],[['tour','alexandria-day','07:00']]],
  luxor:[[['tour','valley-kings','07:00'],['ticket','karnak'],['dining','sofra','19:30']],[['tour','luxor-balloon','04:30'],['dining','al-sahaby-lane','19:30']]],
  aswan:[[['tour','philae-high-dam','08:00'],['tour','felucca-nubian','15:30'],['dining','nubian-home-dinner','19:30']],[['tour','abu-simbel-day','03:30']]],
  hurghada:[[['tour','giftun-snorkel','08:30']],[['dining','star-fish','19:30']]],sharm:[[['tour','ras-mohammed-dive','07:30']],[['dining','bedouin-dinner','19:00']]],
  dahab:[[['tour','blue-hole','09:00']]],marsaalam:[[['tour','dolphin-house','08:00']]],alexandria:[[['ticket','qaitbay'],['dining','fish-market','13:30']]],siwa:[[['tour','siwa-safari','13:00']]]};
PROG.cairo=PROG.giza;
const STN={cairo:'Cairo',giza:'Cairo',alexandria:'Alexandria',luxor:'Luxor',aswan:'Aswan',hurghada:'Hurghada',sharm:'Sharm El Sheikh',dahab:'Dahab',siwa:'Siwa'};
const RAILPAIRS=['alexandria-cairo','alexandria-giza','aswan-luxor','hurghada-luxor','dahab-sharm','cairo-siwa','giza-siwa'];
function defaultSegs(days,want){const n=Math.max(1,Math.min(20,days-1)),C=(p,k)=>({place:p,nights:k}),CR=()=>({place:'cruise',route:'lx-as',nights:4}),sea=(want||[]).includes('sea');
  if(n<=3)return [C('giza',n)];if(n===4)return sea?[C('giza',2),C('hurghada',2)]:[C('giza',2),C('luxor',2)];if(n===5)return sea?[C('giza',2),C('hurghada',3)]:[C('giza',3),C('luxor',2)];
  if(n===6)return sea?[C('giza',3),C('hurghada',3)]:[C('giza',2),CR()];if(n===7)return [C('giza',3),CR()];if(n===8)return [C('giza',3),CR(),C('cairo',1)];
  const s=Math.min(4,n-7),rest=n-7-s,out=[C('giza',3),CR(),C('hurghada',s)];if(rest>0)out.push(C('cairo',rest));return out;}
const segName=s=>s.place==='cruise'?(s.route==='dahabiya'?'dahabiya cruise':s.route==='nasser'?'Lake Nasser cruise':'Nile cruise'):DEST[s.place].name;
function buildPlan(sp){const ad=Math.max(1,sp.ad||2),ch=sp.ch||0,n=ad+ch,B=sp.budget||'mid',start=sp.start&&sp.start>=TODAY?sp.start:S.ctx.start;
  const segs=(sp.segs&&sp.segs.length?sp.segs:defaultSegs(sp.days||8,sp.want)).map(s=>{const o=Object.assign({},s);if(o.place==='cruise'){o.route=CROUTES[o.route]?o.route:'lx-as';o.nights=CROUTES[o.route].nights;}o.nights=Math.max(1,Math.min(14,o.nights||1));return o;}).filter(s=>s.place==='cruise'||DEST[s.place]);
  if(!segs.length)segs.push({place:'giza',nights:3});
  const nights=segs.reduce((s,x)=>s+x.nights,0),days=nights+1,end=addD(start,nights),D={},items=[],used={};
  const day=(date,city,title)=>{const d=D[date]||(D[date]={date,city:'',title:'',items:[]});if(city&&!d.city)d.city=city;if(title&&!d.title)d.title=title;return d;};
  const put=(date,time,ci,label,note,v)=>{if(ci&&ci.err)ci=null;if(!ci&&!label)return;const late=time==='late',t=late?'':ci&&ci.time?ci.time:(time&&time>'00:10'?time:'');day(date).items.push({time:t,k:late?'23:30':time||t||'12:00',label:label||ci.title,note:note||'',v:v||(ci?ci.v:''),ci:ci||null});if(ci)items.push(ci);};
  const from=s=>s.place==='cruise'?CROUTES[s.route].from:s.place,to=s=>s.place==='cruise'?CROUTES[s.route].to:s.place;
  const zoneFor=s=>s.place==='cruise'?(s.route==='dahabiya'?['LXR','esna']:[from(s)==='luxor'?'LXR':'ASW','docks']):(PLACE[s.place]||['CAI','giza']);
  const runProg=(list,dt,pm)=>list.forEach(x=>{if(x[0]==='tour'){const tr=byId(TOURS,x[1]);if(pm&&!tr.slots.some(s=>toMin(s)>=720))return;put(dt,'',PQ.tour(x[1],dt,ad,ch,pm?'14:00':x[2]));}else if(x[0]==='ticket')put(dt,'',PQ.ticket(x[1],dt,n,x[2]||(pm?'14:00':'10:00')));else put(dt,'',PQ.dining(x[1],dt,x[2],n));});
  const travel=(a,b,dt,zone,afterCruise)=>{if(a===b||(['cairo','giza'].includes(a)&&['cairo','giza'].includes(b)))return;
    if(RAILPAIRS.includes([a,b].sort().join('-'))){const ci=PQ.train(STN[a],STN[b],dt,n);if(ci){put(dt,'',ci);return;}}
    const A=(PLACE[a]||[])[0],Bp=zone[0];if(!A||!Bp||A===Bp){put(dt,'09:00',null,`Road transfer to ${DEST[b]?DEST[b].name:b}`,'Arranged with your hotel or through the concierge.','transfers');return;}
    const f=PQ.flight(A,Bp,dt,ad,ch,afterCruise?'late':zone[1]==='docks'||zone[1]==='esna');if(!f){put(dt,'09:00',null,`Travel to ${DEST[b].name}`,'No sample flight on this route. Ask the concierge for options.','flights');return;}
    put(dt,'',f);const arr=f.meta.legs[0].arr%1440;put(dt,'',PQ.transfer(Bp,zone[1],'from',dt,hm(Math.ceil((arr+20)/30)*30),ad,ch,B));};
  for(let i=0;i<=nights;i++)day(addD(start,i));
  let date=start;const z0=zoneFor(segs[0]);day(date,DEST[from(segs[0])].name,'Arrive in Egypt');
  if(B==='luxury'&&['CAI','HRG','SSH','LXR'].includes(z0[0]))put(date,'13:30',PQ.extra('arrival-fast-track',z0[0],date,n));
  put(date,'',PQ.transfer(z0[0],z0[1],'from',date,'14:00',ad,ch,B));put(date,'00:01',PQ.esim(days,date,ad));put(date,'00:02',PQ.ins(start,end,ad,ch,B));
  segs.forEach((s,i)=>{const c=from(s);if(i>0)travel(to(segs[i-1]),c,date,zoneFor(s),segs[i-1].place==='cruise');
    if(s.place==='cruise'){const R=CROUTES[s.route];put(date,'',PQ.cruise(s.route,B,date,ad,ch));R.days.forEach((dd,j)=>{if(j>s.nights)return;const dt=addD(date,j);day(dt,j===0?DEST[R.from].name:j===s.nights?DEST[R.to].name:'On the Nile',i===0&&j===0?'':dd[0]);put(dt,j===0?'15:00':'08:30',null,dd[0],dd[1],'cruises');});}
    else{const hc=HOTELS.some(h=>h.d===c)?c:'cairo';day(date,DEST[c].name,i===0?'':'To '+DEST[c].name);put(date,i>0?'late':'',PQ.hotel(hc,B,date,s.nights,ad,ch));
      const fam=c==='cairo'?'giza':c,prog=PROG[c]||[];let pi=used[fam]||0;
      if(i>0&&s.nights===1&&prog[pi]){runProg(prog[pi],date,true);pi++;}
      for(let j=1;j<s.nights;j++){const dt=addD(date,j);day(dt,DEST[c].name,'');if(prog[pi]){const tl=prog[pi].find(x=>x[0]==='tour');day(dt,'',tl?byId(TOURS,tl[1]).n.split(/[:,&]/)[0].trim():'');runProg(prog[pi],dt);pi++;}else{day(dt,'','At leisure');put(dt,'10:00',null,'At leisure','Beach, pool, or an optional excursion from the tours page.','tours');}}
      used[fam]=pi;}
    date=addD(date,s.nights);});
  const lc=to(segs[segs.length-1]);day(date,DEST[lc].name,'Departure');D[date].title='Departure';
  if(!['cairo','giza','hurghada','sharm'].includes(lc)&&PLACE[lc]){const f=PQ.flight(PLACE[lc][0],'CAI',date,ad,ch,segs[segs.length-1].place==='cruise'?'late':false);if(f)put(date,'',f,'','');put(date,'23:00',null,'Connect in Cairo for your flight home','Add your international flights from the Flights page.','flights');}
  else{const z=PLACE[lc]||PLACE.giza;put(date,'',PQ.transfer(z[0],z[1],'to',date,'09:00',ad,ch,B));if(B==='luxury'&&['CAI','HRG','SSH','LXR'].includes(z[0]))put(date,'10:30',PQ.extra('departure-fast-track',z[0],date,n));}
  const list=Object.values(D).sort((a,b)=>a.date<b.date?-1:1).map((d,i)=>{d.n=i+1;d.items.sort((x,y)=>x.k<y.k?-1:x.k>y.k?1:0);if(!d.title)d.title=d.items.find(x=>x.v==='tours'||x.v==='cruises')?d.items.find(x=>x.v==='tours'||x.v==='cruises').label:'At leisure';return d;});
  let lastCity='';list.forEach(d=>{if(!d.city)d.city=lastCity;lastCity=d.city;});
  const route=[];segs.forEach(s=>(s.place==='cruise'?[from(s),to(s)]:[s.place]).forEach(k=>{if(DEST[k]&&route[route.length-1]!==k)route.push(k);}));
  return {spec:{days,ad,ch,budget:B,start,segs},title:`${days} days: ${uniq(segs.map(segName)).join(', ')}`,days:list,items,total:r2(items.reduce((s,c)=>s+c.total,0)),route,start,end,ad,ch};}

/* ---------- unified trip model ---------- */
function tripItems(){const out=[];S.bookings.forEach(b=>b.items.forEach((i,x)=>out.push(Object.assign({},i,{state:i.cancelled?'cancelled':i.mode==='request'?'requested':'booked',bref:b.ref,bix:x}))));S.cart.forEach(i=>out.push(Object.assign({},i,{state:'cart'})));return out;}
const liveItems=()=>tripItems().filter(i=>i.state!=='cancelled');
function tripSpan(items){const d=items.filter(i=>i.date);if(!d.length)return null;return {start:d.map(i=>i.date).sort()[0],end:d.map(i=>i.end||i.date).sort().pop()};}
function cityOn(date){const hit=liveItems().find(i=>i.city&&i.date&&i.date<=date&&(i.end||i.date)>=date&&['hotels','cruises','packages'].includes(i.v));return hit?hit.city:'';}
function gapsList(){const items=liveItems();if(!items.length)return [];const G=[],pk=items.some(i=>i.v==='packages');
  const has=v=>items.some(i=>i.v===v||(i.meta&&i.meta.covers&&i.meta.covers.includes(v)));const sp=tripSpan(items);
  const legs=[];items.filter(i=>i.v==='flights').forEach(f=>((f.meta&&f.meta.legs)||[]).forEach(l=>legs.push(l)));
  if(!legs.some(l=>!EGA[l.from]||!EGA[l.to]))G.push({v:'flights',t:'No international flights yet',s:'Search flights into Cairo, Giza, Hurghada or Sharm El Sheikh.',q:sp?{trip:'round',date:sp.start,ret:sp.end>sp.start?sp.end:addD(sp.start,7)}:{}});
  legs.filter(l=>EGA[l.to]&&!EGA[l.from]).forEach(l=>{const d=addD(l.date,l.plus||0);if(!pk&&!items.some(i=>i.v==='transfers'&&i.meta&&i.meta.ap===l.to&&i.date===d))G.push({v:'transfers',t:`No transfer from ${apCity(l.to)} Airport on ${fD(d)}`,s:`${l.no} lands at ${hm(l.arr)}.`,q:{dir:'from',ap:l.to,zone:ZONES[l.to][0][0],date:d,time:hm(Math.min(1410,Math.ceil((l.arr%1440)/30)*30))}});});
  if(sp&&sp.end>sp.start){const cov={};items.forEach(i=>{if(['hotels','cruises','packages'].includes(i.v)&&i.date&&i.end)for(let d=i.date;d<i.end||(i.v==='packages'&&d<=i.end);d=addD(d,1))cov[d]=1;if(i.v==='trains'&&i.end&&i.end>i.date)cov[i.date]=1;});
    const miss=[];for(let d=sp.start;d<sp.end;d=addD(d,1))if(!cov[d])miss.push(d);
    if(miss.length){let run=1;while(run<miss.length&&miss[run]===addD(miss[0],run))run++;const c=cityOn(addD(miss[0],-1))||'';G.push({v:'hotels',t:`${pl(miss.length,'night')} without a place to stay`,s:`Starting ${fD(miss[0])}.`,q:Object.assign({in:miss[0],out:addD(miss[0],run)},DKEYS.includes(c)?{d:c}:{})});}}
  if(!has('esim'))G.push({v:'esim',t:'No mobile data yet',s:'An eSIM is active the moment you land.',q:{}});
  if(!has('insurance'))G.push({v:'insurance',t:'No travel insurance',s:'Suggested for every trip, and essential for diving or ballooning.',q:sp?{start:sp.start,end:sp.end}:{}});
  if(!pk&&items.some(i=>['giza','cairo'].includes(i.city))&&!items.some(i=>i.v==='tickets'&&i.ref==='gem'))G.push({v:'tickets',t:'No Grand Egyptian Museum tickets',s:'Entry is by timed ticket.',href:'#tickets-gem'});
  return G;}
function timeline(items){const ev=[];items.forEach(it=>{const parts=it.parts&&it.parts.length?it.parts:[{date:it.date,time:it.time,label:'',city:it.city}];parts.forEach((p,pi)=>ev.push({it,pi,date:p.date||'',time:p.time||'',show:p.show||'',label:p.label||'',city:p.city||it.city||''}));});
  return ev.sort((a,b)=>((a.date||'9999')+(a.time||'00:00')<(b.date||'9999')+(b.time||'00:00')?-1:1));}
function makeBooking(items,lead,sample){const ref='VE-'+Array.from({length:6},()=>'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random()*32)]).join('');
  return {ref,at:TODAY,lead,sample:!!sample,pay:'card',total:r2(items.reduce((s,i)=>s+i.total,0)),items:items.map((i,x)=>Object.assign(JSON.parse(JSON.stringify(i)),{voucher:ref+'-'+pad(x+1)}))};}
const stateBdg=s=>({cart:'<span class="bdg">In your basket</span>',booked:'<span class="bdg ok">Confirmed · demo</span>',requested:'<span class="bdg req">Requested · demo</span>',cancelled:'<span class="bdg bad">Cancelled</span>'}[s]);

/* ---------- My trip ---------- */
function pageTrips(){const all=tripItems(),items=all.filter(i=>i.state!=='cancelled');
  if(!all.length){app.innerHTML=`<section class="thero dark"><div class="wrap"><div class="eye">${esc(tx('trip'))}</div><h1 style="margin-top:8px">One trip. <em>Every booking.</em></h1><p class="muted" style="max-width:56ch;margin-top:12px">Whatever you add from any of the 13 services lands here, in date order, with what is booked and what still needs arranging.</p></div></section>
    <div class="wrap" style="padding:36px 20px 80px"><div class="empty">${ic('trip')}<h3>Your trip is empty</h3><p>Start with a flight or a hotel, ask the concierge to plan the whole thing, or load a sample trip to see how the dashboard works.</p><div class="row wrapx" style="justify-content:center"><a class="btn" href="#concierge">${ic('spark','s')}Plan with the concierge</a><a class="btn ghost" href="#flights">Search flights</a><button class="btn ghost" data-act="sample">Load a sample trip</button></div><span class="bdg demo">The sample uses demo data and can be cleared in one click</span></div></div>`;return;}
  const sp=tripSpan(items),ev=timeline(all),G=gapsList(),booked=items.filter(i=>i.state!=='cart'),cartT=r2(S.cart.reduce((s,i)=>s+i.total,0)),bookT=r2(booked.reduce((s,i)=>s+i.total,0));
  const cities=uniq(timeline(items).map(e=>e.city).filter(c=>DEST[c]));
  const byDate={};ev.forEach(e=>{(byDate[e.date]=byDate[e.date]||[]).push(e);});const dates=Object.keys(byDate).sort((a,b)=>(a||'9999')<(b||'9999')?-1:1);
  const done=VORDER.filter(v=>items.some(i=>i.v===v||(i.meta&&i.meta.covers&&i.meta.covers.includes(v)))).length;
  const row=e=>{const it=e.it,first=e.pi===0;return `<div class="titem ${it.state==='cart'?'':it.state==='cancelled'?'cancelled':'booked'}"><div class="tm">${e.show||e.time||'Any time'}</div><div class="ic">${ic(it.v)}</div>
      <div><h3>${esc(it.title)}</h3><div class="small muted">${esc(e.label||it.sub||'')}</div>${first&&e.label&&it.sub?`<div class="tiny muted">${esc(it.sub)}</div>`:''}
        ${first?`<div class="acts">${it.state==='cart'?`<button data-act="rm" data-id="${it.id}" class="danger">Remove</button>${it.ref&&VX[it.v].detail?`<a href="#${it.v}-${it.ref}">View listing</a>`:''}`:it.state==='cancelled'?`<span class="tiny muted">Refund ${fmt(it.refund||0)} · demo</span>`:`<button data-act="voucher" data-b="${it.bref}" data-i="${it.bix}">Voucher</button><button data-act="cancel" data-b="${it.bref}" data-i="${it.bix}" class="danger">Cancel</button>`}</div>`:''}</div>
      <div class="end">${first?`${stateBdg(it.state)}<b class="num">${fmt(it.total)}</b>`:'<span class="tiny muted">same booking</span>'}</div></div>`;};
  app.innerHTML=`<section class="thero dark"><div class="wrap"><div class="row between wrapx" style="align-items:end"><div><div class="eye">${esc(tx('trip'))}${S.bookings.some(b=>b.sample)?' · sample data':''}</div><h1 style="margin-top:8px">${sp?`${fD(sp.start)} to ${fD(sp.end,1)}`:'Your Egypt trip'}</h1>
      ${cities.length?`<div class="routeline" style="margin-top:12px;font-size:15px">${cities.map((c,i)=>(i?'<i></i>':'')+`<b>${DEST[c].name}</b>`).join('')}</div>`:''}</div>
      <div class="row wrapx">${S.cart.length?`<a class="btn gold" href="#checkout">Check out ${pl(S.cart.length,'item')} · ${fmt(cartT)}</a>`:''}<a class="btn ghost" href="#concierge" data-act="askc" data-q="What is still missing from my trip?">${ic('spark','s')}Ask the concierge</a></div></div>
    <div class="tstats"><div><small>Arranged</small><b>${done} of 13 services</b></div><div><small>Confirmed</small><b>${fmt(bookT)}</b></div><div><small>In your basket</small><b>${fmt(cartT)}</b></div>${sp?`<div><small>Length</small><b>${pl(diffD(sp.start,sp.end)+1,'day')}</b></div>`:''}</div></div></section>
  <div class="wrap tgrid"><div>
    ${G.length?`<div class="col" style="gap:8px;margin-bottom:32px"><h2 style="font-size:30px;margin-bottom:6px">Still to arrange</h2>${G.map(g=>`<div class="gap"><div class="ic">${ic(g.v)}</div><div><b>${esc(g.t)}</b><div class="small" style="color:#6B4A0E">${esc(g.s)}</div></div>${g.href?`<a class="btn sm" href="${g.href}">Add</a>`:`<button class="btn sm" data-act="vgo" data-k="${g.v}" data-q="${esc(JSON.stringify(g.q||{}))}">Add ${g.v==='esim'?'an eSIM':esc(vname(g.v)).toLowerCase()}</button>`}</div>`).join('')}</div>`:`<div class="alert ok" style="margin-bottom:28px">${ic('check','s')}<span>Nothing obvious is missing. Flights, a bed for every night, transfers, data and insurance are all arranged.</span></div>`}
    <div class="row between wrapx" style="margin-bottom:16px"><h2 style="font-size:30px">Itinerary</h2><span class="tiny muted">${ev.length} entries from ${pl(all.length,'booking')}</span></div>
    ${dates.map(d=>{const es=byDate[d],c=(es.map(e=>e.city).find(c=>DEST[c]));return `<div class="tday"><div class="when">${d&&sp?`<div class="n">${diffD(sp.start,d)+1}</div><small>${fD(d)}${c?'<br>'+DEST[c].name:''}</small>`:`<div class="n">–</div><small>No date yet</small>`}</div><div>${es.map(row).join('')}</div></div>`;}).join('')}
  </div>
  <aside class="col" style="gap:22px"><div><h4 style="margin-bottom:10px">The 13 services</h4><div class="cov">${VORDER.map(v=>{const b=items.filter(i=>i.v===v&&i.state!=='cart').length,c=items.filter(i=>i.v===v&&i.state==='cart').length,p=!b&&!c&&items.some(i=>i.meta&&i.meta.covers&&i.meta.covers.includes(v));return `<a href="#${v}" class="${b||c||p?'has':''}">${ic(b||c||p?'check':v,'s')}<span>${esc(vname(v))}</span><span class="tiny ${b||c||p?'':'muted'}">${b?b+' confirmed':''}${b&&c?', ':''}${c?c+' in basket':''}${p?'In your package':''}${!b&&!c&&!p?'Add':''}</span></a>`;}).join('')}</div></div>
    ${S.bookings.length?`<div><h4 style="margin-bottom:10px">Booking references</h4><div class="cov">${S.bookings.map(b=>`<a href="#booking-${b.ref}">${ic('tickets','s')}<span class="num">${b.ref}</span><span class="tiny muted">${pl(b.items.length,'item')} · ${fmt(b.total)}</span></a>`).join('')}</div></div>`:''}
    <button class="link small" data-act="cleartrip" style="color:var(--carn)">Clear this trip and start again</button><p class="tiny muted">Stored in this browser only. Demo bookings are not real reservations.</p></aside></div>`;}

/* ---------- checkout ---------- */
function coState(){return S.co||(S.co={step:1,lead:{name:'',email:'',phone:'',nat:'United Kingdom'},names:[],flight:'',driver:false,req:'',pay:'card',sim:'ok',agree:false,fail:false});}
function pageCheckout(){const C=coState(),cart=S.cart;
  if(!cart.length){app.innerHTML=`<div class="wrap dwrap"><div class="empty">${ic('wallet')}<h3>Nothing to check out</h3><p>Add something from any of the 13 services and it will appear here.</p><div class="row wrapx" style="justify-content:center"><a class="btn" href="#home">Start booking</a><a class="btn ghost" href="#trips">${esc(tx('trip'))}</a></div></div></div>`;return;}
  const total=r2(cart.reduce((s,i)=>s+i.total,0)),tax=r2(cart.reduce((s,i)=>s+i.lines.filter(l=>l[2]==='t').reduce((a,l)=>a+l[1],0),0));
  const nNames=Math.max(0,...cart.map(i=>(i.need&&i.need.names)||0)),needF=cart.some(i=>i.need&&i.need.flight),needD=cart.some(i=>i.need&&i.need.driver),req=cart.filter(i=>i.mode==='request').length;
  const steps=['Review','Details','Payment','Confirmation'];
  let body='';
  if(C.step===1)body=`<div class="cstep fade"><h2>Review your trip</h2><div>${cart.slice().sort((a,b)=>(a.date||'9')<(b.date||'9')?-1:1).map(i=>`<div class="ci"><div class="ic">${ic(i.v)}</div><div><div class="tiny muted">${esc(tx(i.v))}${i.date?' · '+fD(i.date)+(i.end&&i.end!==i.date?' to '+fD(i.end):'')+(i.time?' · '+i.time:''):''}</div><h3>${esc(i.title)}</h3><div class="small muted">${esc(i.sub||'')}</div>
        <details><summary>Price details and policy</summary>${linesHtml(i)}<div style="height:8px"></div>${polHtml(i)}</details></div>
        <div style="text-align:end"><b class="num">${fmt(i.total)}</b><div>${i.mode==='request'?'<span class="bdg req">On request</span>':''}</div><button class="x" data-act="rm" data-id="${i.id}">Remove</button></div></div>`).join('')}</div>
      <div class="row between wrapx"><a class="link" href="#trips">Back to my trip</a><button class="btn lg" data-act="costep" data-s="2">Continue to traveller details</button></div></div>`;
  else if(C.step===2)body=`<form class="cstep fade" id="cof" novalidate><h2>Traveller details</h2>
      <div><h4 style="margin-bottom:10px">Lead traveller</h4><div class="fgrid2">
        <div class="fld" data-fld="name"><label for="c-name">Full name, as on passport</label><input id="c-name" type="text" autocomplete="name" value="${esc(C.lead.name)}"><span class="msg" hidden></span></div>
        <div class="fld" data-fld="email"><label for="c-email">Email for confirmations</label><input id="c-email" type="email" autocomplete="email" value="${esc(C.lead.email)}" placeholder="you@example.com"><span class="msg" hidden></span></div>
        <div class="fld" data-fld="phone"><label for="c-phone">Mobile, with country code</label><input id="c-phone" type="tel" autocomplete="tel" value="${esc(C.lead.phone)}" placeholder="+44 7700 900123"><span class="msg" hidden></span></div>
        <div class="fld" data-fld="nat"><label for="c-nat">Nationality</label><select id="c-nat">${countryOpts(C.lead.nat)}</select></div></div></div>
      ${nNames>1?`<div><h4 style="margin-bottom:4px">Other travellers</h4><p class="small muted" style="margin-bottom:10px">Needed for ${uniq(cart.filter(i=>i.need&&i.need.names>1).map(i=>tx(i.v).toLowerCase())).join(', ')}. Names must match passports.</p><div class="fgrid2">${Array.from({length:nNames-1},(_,i)=>`<div class="fld" data-fld="n${i}"><label for="c-n${i}">Traveller ${i+2}</label><input id="c-n${i}" type="text" value="${esc(C.names[i]||'')}"><span class="msg" hidden></span></div>`).join('')}</div></div>`:''}
      ${needF?`<div><h4 style="margin-bottom:4px">Flight details</h4><p class="small muted" style="margin-bottom:10px">For your transfer or airport service. You can add this later, up to 24 hours before travel.</p><div class="fgrid2"><div class="fld" data-fld="flight"><label for="c-flight">Arrival flight number (optional)</label><input id="c-flight" type="text" value="${esc(C.flight)}" placeholder="For example MS 778"></div></div></div>`:''}
      ${needD?`<div class="fld" data-fld="driver"><label class="opt ${C.driver?'on':''}" style="grid-template-columns:20px 1fr"><input type="checkbox" id="c-driver"${C.driver?' checked':''}><span><b>The main driver meets the rental requirements</b><small>Aged 21 to 69, licence held for a year or more, International Driving Permit and a credit card in their name.</small></span></label><span class="msg" hidden></span></div>`:''}
      <div class="fld w12"><label for="c-req">Special requests (optional)</label><textarea id="c-req" placeholder="Dietary needs, accessibility, an occasion">${esc(C.req)}</textarea></div>
      <div class="row between wrapx"><button type="button" class="link" data-act="costep" data-s="1">Back to review</button><button class="btn lg" type="submit">Continue to payment</button></div></form>`;
  else if(C.step===3)body=`<div class="cstep fade"><h2>Payment</h2>
      ${C.fail?`<div class="alert" role="alert">${ic('info','s')}<span><b>Payment declined (simulated).</b> No booking was made and nothing was charged. Try again, or choose another payment method.</span></div>`:''}
      <div class="alert info">${ic('lock','s')}<span><b>Simulated payment.</b> This prototype never asks for real card details. A test card is filled in for you and no money moves.</span></div>
      <div class="pm" role="group" aria-label="Payment method">${[['card','Card','card'],['wallet','Apple Pay or Google Pay','phone'],['split','Four instalments','cal'],['egp','Pay in EGP','wallet']].map(m=>`<button data-act="pay" data-m="${m[0]}" class="${C.pay===m[0]?'on':''}" aria-pressed="${C.pay===m[0]}">${ic(m[2])}${m[1]}</button>`).join('')}</div>
      ${C.pay==='card'?`<div class="fgrid2"><div class="fld w12"><label for="pc-n">Card number</label><input id="pc-n" type="text" readonly value="4242 4242 4242 4242"></div><div class="fld"><label for="pc-e">Expiry</label><input id="pc-e" type="text" readonly value="12 / 29"></div><div class="fld"><label for="pc-c">Security code</label><input id="pc-c" type="text" readonly value="123"></div><div class="fld w12"><label for="pc-h">Name on card</label><input id="pc-h" type="text" readonly value="${esc(C.lead.name||'Test Cardholder')}"></div></div>`
       :C.pay==='wallet'?`<p class="ink2">In production your device’s wallet sheet opens here for a one-touch payment of <b class="num">${fmt(total)}</b>.</p>`
       :C.pay==='split'?`<div class="tbl"><table class="t"><thead><tr><th>Instalment</th><th>Due</th><th>Amount</th></tr></thead><tbody>${[0,1,2,3].map(i=>`<tr><td>${i+1} of 4</td><td>${i?fD(addD(TODAY,i*14),1):'Today'}</td><td class="num">${fmt(total/4)}</td></tr>`).join('')}</tbody></table></div><p class="small muted">No interest. The full balance must clear before your first travel date.</p>`
       :`<p class="ink2">Pay with an Egyptian card, Meeza or a mobile wallet. Total in Egyptian pounds: <b class="num">EGP ${Math.round(total*CUR.EGP[0]).toLocaleString('en-US')}</b> at the demo rate.</p>`}
      <div><h4 style="margin-bottom:8px">Demo control</h4><div class="seg"><button data-act="sim" data-v="ok" class="${C.sim==='ok'?'on':''}">Simulate an approved payment</button><button data-act="sim" data-v="no" class="${C.sim==='no'?'on':''}">Simulate a decline</button></div></div>
      <div class="fld" data-fld="agree" id="agreef"><label class="opt ${C.agree?'on':''}" style="grid-template-columns:20px 1fr"><input type="checkbox" id="c-agree"${C.agree?' checked':''}><span><b>I have read the booking and cancellation policies</b><small>Each item’s policy is listed in the review step and on your confirmation.</small></span></label><span class="msg" hidden></span></div>
      <div class="row between wrapx"><button class="link" data-act="costep" data-s="2">Back to details</button><button class="btn lg" data-act="payconfirm">${ic('lock','s')}Pay ${fmt(total)} and confirm</button></div></div>`;
  else body=`<div class="cstep fade" style="justify-items:center;text-align:center;padding:56px 24px"><div class="spin" role="status" aria-label="Processing"></div><h2>Confirming ${pl(cart.length,'booking')}</h2><p class="muted">In production each supplier is booked through its own system at this point.</p></div>`;
  app.innerHTML=`<section class="vh"><div class="wrap"><nav class="crumb"><a href="#home">Home</a><span><a href="#trips">${esc(tx('trip'))}</a></span><span>Checkout</span></nav><h1 style="margin-top:8px">Checkout</h1>
    <div class="stepsbar" aria-label="Checkout steps">${steps.map((s,i)=>`<div class="${Math.min(C.step,3)===i+1?'on':C.step>i+1?'was':''}">${i+1}. ${s}</div>`).join('')}</div></div></section>
  <div class="wrap cgrid"><div>${body}</div>
    <aside class="sum"><h3>Order summary</h3>${cart.map(i=>`<div class="li"><span>${esc(i.title)}</span><span class="num">${fmt(i.total)}</span></div>`).join('')}
      <div class="lines" style="padding-top:12px"><div class="t"><span>Taxes and fees, included above</span><span>${fmt(tax)}</span></div><div class="tot"><span>${esc(tx('total'))}</span><span>${fmt(total)}</span></div></div>
      ${req?`<div class="alert gold">${ic('info','s')}<span>${pl(req,'item is','items are')} on request. In production you are charged for those only once confirmed.</span></div>`:''}
      <div class="pol"><span>${ic('lock','s')}Simulated payment. Nothing is charged.</span><span>${ic('check','s')}One confirmation for every service</span><span>${ic('check','s')}Prices shown in ${S.cur}, charged in US dollars in production</span></div></aside></div>`;
  const f=$('#cof');if(f)f.onsubmit=e=>{e.preventDefault();C.lead={name:$('#c-name').value.trim(),email:$('#c-email').value.trim(),phone:$('#c-phone').value.trim(),nat:$('#c-nat').value};C.names=$$('[id^="c-n"]',f).filter(x=>/^c-n\d+$/.test(x.id)).map(x=>x.value.trim());if($('#c-flight'))C.flight=$('#c-flight').value.trim();if($('#c-driver'))C.driver=$('#c-driver').checked;C.req=$('#c-req').value.trim();
    const er={};if(C.lead.name.split(/\s+/).filter(Boolean).length<2)er.name='Enter first and last name as on the passport.';if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(C.lead.email))er.email='Enter a valid email address.';if(C.lead.phone.replace(/\D/g,'').length<7)er.phone='Enter a phone number with its country code.';
    C.names.forEach((n,i)=>{if(n.split(/\s+/).filter(Boolean).length<2)er['n'+i]='Enter this traveller’s first and last name.';});if(needD&&!C.driver)er.driver='Confirm the driver requirements to continue.';
    if(showErrs(f,er)){C.step=3;C.fail=false;pageCheckout();window.scrollTo(0,0);}};
  const ag=$('#c-agree');if(ag)ag.onchange=()=>{C.agree=ag.checked;ag.closest('.opt').classList.toggle('on',ag.checked);};
  const dr=$('#c-driver');if(dr)dr.onchange=()=>dr.closest('.opt').classList.toggle('on',dr.checked);}
function pageBooking(ref){const b=S.bookings.find(x=>x.ref===ref);
  if(!b){app.innerHTML=`<div class="wrap dwrap"><div class="empty">${ic('search')}<h3>We could not find that booking</h3><p>Demo bookings are stored in the browser where they were made.</p><a class="btn" href="#trips">${esc(tx('trip'))}</a></div></div>`;return;}
  const req=b.items.filter(i=>i.mode==='request').length;
  app.innerHTML=`<section class="vh"><div class="wrap"><div class="stepsbar" style="margin-top:0">${['Review','Details','Payment','Confirmation'].map((s,i)=>`<div class="${i===3?'on':'was'}">${i+1}. ${s}</div>`).join('')}</div></div></section>
  <div class="wrap cgrid fade"><div class="col" style="gap:20px">
    <div class="cstep"><div class="row" style="gap:16px;align-items:flex-start"><div class="okmark">${ic('check')}</div><div><span class="bdg demo">Demo confirmation · not a real reservation</span><h2 style="margin-top:8px">${b.sample?'Sample booking':'Thank you'}${b.lead&&b.lead.name?', '+esc(b.lead.name.split(' ')[0]):''}. ${pl(b.items.length-req,'booking is','bookings are')} confirmed${req?` and ${req} requested`:''}.</h2></div></div>
      <div><div class="tiny muted" style="letter-spacing:.1em;text-transform:uppercase;font-weight:700">Booking reference</div><div class="ref num">${b.ref}</div><p class="small muted">In production a confirmation with every voucher goes to ${esc((b.lead&&b.lead.email)||'your email')}.</p></div>
      <div>${b.items.map((i,x)=>`<div class="ci"><div class="ic">${ic(i.v)}</div><div><div class="tiny muted">${esc(tx(i.v))}${i.date?' · '+fD(i.date):''}${i.time?' · '+i.time:''}</div><h3>${esc(i.title)}</h3><div class="small muted">${esc(i.sub||'')}</div><div class="tiny muted num" style="margin-top:4px">Voucher ${i.voucher}</div></div><div style="text-align:end;display:grid;gap:6px;justify-items:end"><b class="num">${fmt(i.total)}</b>${stateBdg(i.cancelled?'cancelled':i.mode==='request'?'requested':'booked')}<button class="x" data-act="voucher" data-b="${b.ref}" data-i="${x}">View voucher</button></div></div>`).join('')}</div>
      <div class="row wrapx"><a class="btn lg" href="#trips">Open my trip</a><a class="btn ghost" href="#concierge" data-act="askc" data-q="What is still missing from my trip?">${ic('spark','s')}What is still missing?</a></div></div>
    <div class="cstep"><h2 style="font-size:26px">What happens next</h2><ol class="stepsl"><li><span><b>Vouchers</b>Each confirmed service has its own voucher in My trip. Show it on your phone.</span></li>${req?'<li><span><b>On-request items</b>Our team confirms these within 24 hours in production and you are charged for them only then.</span></li>':''}<li><span><b>Changes and cancellations</b>Manage every booking from My trip. Each item follows its own policy.</span></li><li><span><b>In this prototype</b>No supplier was contacted and no payment was taken.</span></li></ol></div></div>
    <aside class="sum"><h3>Paid · demo</h3>${b.items.map(i=>`<div class="li"><span>${esc(i.title)}</span><span class="num">${fmt(i.total)}</span></div>`).join('')}<div class="lines" style="padding-top:12px"><div class="tot"><span>${esc(tx('total'))}</span><span>${fmt(b.total)}</span></div></div><div class="pol"><span>${ic('card','s')}${{card:'Test card ending 4242',wallet:'Wallet payment',split:'Four instalments',egp:'Paid in EGP'}[b.pay]||'Test card'} · simulated</span></div></aside></div>`;}
/* ===== pages 3: AI concierge, actions, router ===== */
let SAMPLE=null;
(async()=>{try{if(typeof claude!=='undefined'&&claude&&claude.use){SAMPLE=await claude.use('sample');const e=$('#aistat');if(e)e.textContent=aiLabel();}}catch(e){SAMPLE=null;}})();
const aiLabel=()=>SAMPLE?'Open questions are answered by Claude':'Running on the built-in trip engine';

/* ---------- understanding ---------- */
const NUMW={a:1,an:1,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,twenty:20};
const NRE='(\\d{1,2}|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|twenty)';
const num=s=>{s=String(s||'').toLowerCase();return NUMW[s]||parseInt(s,10)||0;};
const PLACEW=[['lake nasser','nasser'],['dahabiya','dahabiya'],['nile cruise','cruise'],['cruise','cruise'],['giza','giza'],['pyramids','giza'],['cairo','cairo'],['luxor','luxor'],['aswan','aswan'],['abu simbel','aswan'],['el gouna','hurghada'],['gouna','hurghada'],['hurghada','hurghada'],['red sea','hurghada'],['sharm','sharm'],['dahab','dahab'],['marsa alam','marsaalam'],['alexandria','alexandria'],['siwa','siwa']];
const findPlace=s=>{s=s.toLowerCase();let best=null,pos=1e9;for(const [w,k] of PLACEW){const i=s.indexOf(w);if(i>=0&&i<pos){pos=i;best=k;}}return best;};
const APW=[['sphinx','SPX'],['borg','HBE'],['alexandria','HBE'],['hurghada','HRG'],['gouna','HRG'],['sharm','SSH'],['luxor','LXR'],['aswan','ASW'],['marsa alam','RMF'],['abu simbel','ABS'],['cairo','CAI']];
const toSeg=(p,n)=>['cruise','dahabiya','nasser'].includes(p)?{place:'cruise',route:p==='cruise'?(n===3?'as-lx':n>=7?'round':'lx-as'):p,nights:n}:{place:p,nights:n};
const VKEYS=[['transfers',/\b(transfer|pick[- ]?up|taxi|ride from|ride to|driver from)\b|(from|to) (the |cairo |hurghada |luxor |aswan |sharm )?airport/],['cars',/car rental|rent a car|rental car|hire a car|self[- ]drive|chauffeur/],['extras',/fast[- ]?track|lounge|\bvip\b|meet and assist|porter|wheelchair/],['insurance',/insurance|insured/],['esim',/e-?sim|sim card|mobile data|roaming|internet/],['packages',/package|ready[- ]made/],['cruises',/cruise|dahabiya/],['flights',/flight|\bfly\b|airfare|plane ticket/],['hotels',/hotel|resort|accommodation|place to stay|somewhere to stay|\broom\b|guesthouse|lodge/],['tickets',/ticket|admission|entry to/],['trains',/\btrain|\bbus\b|coach|sleeper/],['dining',/restaurant|dinner|lunch|\btable\b|where to eat|places to eat/],['tours',/tour|activit|excursion|things to do|experience|balloon|snorkel|\bdiv(e|ing)\b|safari|felucca/]];
function localNLU(text){const s=' '+text.toLowerCase().replace(/[’`]/g,"'").replace(/\s+/g,' ')+' ';const o={intent:'unknown',segs:[],want:[]};let m;
  const reN=new RegExp('\\b'+NRE+'[\\s-]+nights?\\b','g');while((m=reN.exec(s))){const tail=s.slice(m.index+m[0].length,m.index+m[0].length+36).split(/,|;|\.| and | then | followed /)[0];const p=findPlace(tail);if(p)o.segs.push(toSeg(p,num(m[1])));}
  if((m=s.match(new RegExp('\\b'+NRE+'[\\s-]*days?\\b'))))o.days=num(m[1]);else if(/\btwo weeks|a fortnight\b/.test(s))o.days=14;else if(/\b(a|one) week\b/.test(s))o.days=7;else if((m=s.match(new RegExp('\\b'+NRE+' weeks\\b'))))o.days=num(m[1])*7;
  if((m=s.match(new RegExp('family of '+NRE)))){o.ad=2;o.ch=Math.max(0,num(m[1])-2);}else if((m=s.match(new RegExp('\\bfor '+NRE+'( people| adults| persons| travell?ers| guests| of us|\\b)')))&&!/nights?|days?|weeks?/.test(s.slice(m.index+4+m[1].length,m.index+12+m[1].length)))o.ad=num(m[1]);
  else if(/\b(couple|honeymoon|my wife|my husband|my partner|the two of us)\b/.test(s))o.ad=2;else if(/\b(solo|alone|by myself|just me)\b/.test(s))o.ad=1;
  if((m=s.match(new RegExp(NRE+' (kids|children|child)\\b'))))o.ch=num(m[1]);
  if(/luxur|five[- ]star|5[- ]star|high[- ]end|premium|upgrade|best hotels/.test(s))o.budget='luxury';else if(/\bbudget\b|cheap|affordable|backpack|low[- ]cost|save money/.test(s))o.budget='budget';else if(/mid[- ]range|moderate|comfortable/.test(s))o.budget='mid';
  if(/beach|red sea|snorkel|\bdiv|resort/.test(s))o.want.push('sea');
  if(/\btomorrow\b/.test(s))o.when=addD(TODAY,1);else if(/\b(today|tonight)\b/.test(s))o.when=TODAY;else if((m=s.match(/\b(20\d\d-\d\d-\d\d)\b/)))o.when=m[1];
  if(/five[- ]star|5[- ]star/.test(s))o.stars=5;else if(/four[- ]star|4[- ]star/.test(s))o.stars=4;
  o.near=/\bgem\b|grand egyptian museum|near the museum/.test(s);o.dest=findPlace(s.replace(/nile cruise|cruise|dahabiya|lake nasser/g,''));if(['cruise','nasser','dahabiya'].includes(o.dest))o.dest=null;
  for(const [w,c] of APW)if(s.includes(w+' airport')||s.includes(w+' international')){o.ap=c;break;}
  o.dir=/\bto (the |[a-z]+ )?airport\b/.test(s)&&!/\bfrom (the |[a-z]+ )?airport\b/.test(s)?'to':'from';
  const ctry=COUNTRIES().find(c=>s.includes(c.toLowerCase()))||(/\b(uk|british|britain|england)\b/.test(s)?'United Kingdom':/\b(usa|american|u\.s\.|us passport|united states)\b/.test(s)?'United States':/\bgerman\b/.test(s)?'Germany':/\bfrench\b/.test(s)?'France':/\bsaudi\b/.test(s)?'Saudi Arabia':/\bemirati|uae\b/.test(s)?'United Arab Emirates':/\bchinese\b/.test(s)?'China':/\bindian\b/.test(s)?'India':/\brussian\b/.test(s)?'Russia':/\bitalian\b/.test(s)?'Italy':/\bspanish\b/.test(s)?'Spain':null);if(ctry)o.country=ctry;
  const pk=PKGS.find(p=>s.includes(p.n.toLowerCase().split(':')[0]));
  const vert=(VKEYS.find(v=>v[1].test(s))||[])[0];
  if(/\b(add|book|take) (everything|it all|all of it|the (whole |entire )?(plan|trip|itinerary))|add (them )?all\b/.test(s)&&S.plan)o.intent='addplan';
  else if(pk&&/customi[sz]e|tailor|adapt|change/.test(s)){o.intent='plan';o.pkg=pk.id;o.days=o.days||pk.days;if(pk.route.some(d=>['hurghada','sharm'].includes(d)))o.want.push('sea');}
  else if(o.segs.length>=2||(/\b(plan|itinerary|organi[sz]e|arrange|design|build|put together|suggest a trip)\b/.test(s)&&(o.days||o.segs.length||/trip|holiday|vacation|honeymoon|egypt|visit/.test(s)))||(o.days&&/holiday|vacation|\btrip\b|honeymoon|in egypt|egypt (trip|holiday)/.test(s)&&!vert))o.intent='plan';
  else if(S.planSpec&&((/\b(make it|switch|go |upgrade|downgrade|change (it|the plan)|instead)\b/.test(s)&&(o.budget||o.days||o.ad))||(/\b(remove|drop|skip|without)\b/.test(s)&&(o.dest||/cruise/.test(s)))||(/\badd\b/.test(s)&&o.segs.length)||/\b(shorter|longer|cheaper|more luxurious)\b/.test(s))){o.intent='replan';if(/cheaper/.test(s))o.budget='budget';if(/more luxurious/.test(s))o.budget='luxury';o.remove=/\b(remove|drop|skip|without)\b/.test(s);o.shorter=/shorter/.test(s);o.longer=/longer/.test(s);o.cruise=/cruise/.test(s);}
  else if(vert==='transfers')o.intent='transfer';
  else if(/what('s| is| am i)? ?(still )?(missing|left)|still (need|to arrange|to book)|what else|anything (else|missing)|have i forgotten|forgot/.test(s))o.intent='gaps';
  else if(/\b(my trip|my itinerary|what have i (booked|added)|my bookings|my basket|my cart|show my)\b/.test(s))o.intent='trip';
  else if(/check ?out|\bpay\b|payment|confirm (my|the) booking/.test(s))o.intent='checkout';
  else if(/\bvisa\b/.test(s))o.intent='visa';
  else if(vert){o.intent='search';o.vertical=vert;}
  else{const words=s.match(/[a-z]{4,}/g)||[];let bi=-1,bs=0;FAQ.forEach(([q,a],i)=>{const t=(q+' '+a).toLowerCase();const sc=words.filter(w=>!['what','when','does','have','with','that','this','your','egypt','need','best','from','they','there','about','should','would','could','many','much'].includes(w)&&q.toLowerCase().includes(w)).length*2+words.filter(w=>w.length>5&&t.includes(w)).length*.500;if(sc>bs){bs=sc;bi=i;}});
    if(bs>=2){o.intent='faq';o.faq=bi;}else if(/^ ?(hi|hello|hey|salam|good (morning|afternoon|evening))\b/.test(s))o.intent='greet';else if(/what can you do|help me|how does this work|who are you/.test(s))o.intent='greet';}
  if(vert==='transfers'&&o.ap){const z=ZONES[o.ap].find(z=>s.includes(z[1].toLowerCase().split(' and ')[0].split(',')[0])||s.includes(z[0]));if(z)o.zone=z[0];}
  return o;}
function nluPrompt(text){return `You are the intent parser for Visit Egypt, a travel booking website for trips to Egypt. Read the traveller's message and return ONLY a JSON object with these keys:
{"intent":"plan|replan|search|transfer|gaps|trip|checkout|visa|faq|greet|unknown","vertical":"flights|hotels|cruises|tours|transfers|cars|esim|tickets|dining|trains|insurance|extras|packages or null","days":number or null,"adults":number or null,"children":number or null,"budget":"budget|mid|luxury or null","segments":[{"place":"giza|cairo|luxor|aswan|hurghada|sharm|dahab|marsaalam|alexandria|siwa|cruise","nights":number}],"dest":"one of the place keys or null","near_gem":boolean,"stars":number or null,"when":"YYYY-MM-DD or null","airport":"CAI|SPX|HBE|HRG|SSH|LXR|ASW|RMF|ABS or null","country":"passport country or null","answer":"string or null"}
Rules: use "plan" when they want an itinerary built; "replan" when they want to change the current plan (a plan currently exists: ${!!S.planSpec}); "search" with a vertical when they want options in one category; "gaps" when they ask what is missing; "visa" for entry rules. Fill "answer" ONLY for intent "unknown" or "faq": a helpful, accurate reply about travelling in Egypt in at most 70 words of plain text, with no invented prices or bookings. Today is ${TODAY}.
Traveller's message: """${text.slice(0,600)}"""`;}
function mergeNLU(o,ai){if(!ai||typeof ai!=='object'||!ai.intent)return o;const ok=['plan','replan','search','transfer','gaps','trip','checkout','visa','faq','greet','unknown'];if(!ok.includes(ai.intent))return o;
  const r=Object.assign({},o,{intent:ai.intent});if(VX[ai.vertical])r.vertical=ai.vertical;if(+ai.days>0)r.days=Math.min(21,+ai.days);if(+ai.adults>0)r.ad=Math.min(9,+ai.adults);if(+ai.children>=0&&ai.children!=null)r.ch=Math.min(6,+ai.children);
  if(['budget','mid','luxury'].includes(ai.budget))r.budget=ai.budget;if(Array.isArray(ai.segments)&&ai.segments.length&&!o.segs.length)r.segs=ai.segments.filter(s=>s&&(s.place==='cruise'||DEST[s.place])&&+s.nights>0).map(s=>toSeg(s.place,+s.nights));
  if(DEST[ai.dest])r.dest=ai.dest;if(ai.near_gem)r.near=true;if(+ai.stars)r.stars=+ai.stars;if(/^\d{4}-\d\d-\d\d$/.test(ai.when||'')&&ai.when>=TODAY)r.when=ai.when;if(EGA[ai.airport])r.ap=ai.airport;if(typeof ai.country==='string'&&COUNTRIES().includes(ai.country))r.country=ai.country;
  if(typeof ai.answer==='string'&&ai.answer.trim())r.answer=ai.answer.trim().slice(0,700);if(r.intent==='search'&&!r.vertical)r.intent='unknown';if(r.intent==='faq'&&r.faq==null&&!r.answer)r.intent='unknown';return r;}

/* ---------- answering ---------- */
function cand(ci,o){if(!ci||ci.err)return null;S.cc.push(Object.assign({ci},o||{}));return S.cc.length-1;}
function stayDates(d,n){const pool=(S.plan?S.plan.items:[]).concat(liveItems());const h=pool.find(i=>i.v==='hotels'&&i.city===d&&i.date);if(h)return [h.date,Math.max(1,diffD(h.date,h.end))];const sp=tripSpan(liveItems());return [sp?sp.start:S.ctx.start,n||3];}
const pax=()=>{const p=S.planSpec||S.ctx;return [p.ad||2,p.ch||0];};
const NOTE='<p class="tiny muted">Adding puts it in your trip. Nothing is booked or charged until checkout, and this prototype only simulates payment.</p>';
function respond(o,text){const [ad,ch]=[o.ad||pax()[0],o.ch!=null?o.ch:(o.ad&&o.intent==='plan'?0:pax()[1])],n=ad+ch;
  if(o.intent==='plan'||o.intent==='replan'){let sp;
    if(o.intent==='replan'&&S.planSpec){sp=JSON.parse(JSON.stringify(S.planSpec));if(o.budget)sp.budget=o.budget;if(o.ad)sp.ad=o.ad;if(o.ch!=null)sp.ch=o.ch;
      if(o.remove){const before=sp.segs.length;sp.segs=sp.segs.filter(s=>!(o.cruise&&s.place==='cruise')&&!(o.dest&&s.place===o.dest&&!o.cruise));if(sp.segs.length===before||!sp.segs.length)return {html:'<p>I could not find that stop in the current plan. Tell me the place to remove, for example “remove Hurghada”.</p>'};}
      else if(o.segs.length)o.segs.forEach(s=>{const e=sp.segs.find(x=>x.place===s.place&&s.place!=='cruise');if(e)e.nights+=s.nights;else sp.segs.push(s);});
      else if(o.days&&o.days!==sp.days)sp.segs=defaultSegs(o.days,sp.segs.some(s=>['hurghada','sharm'].includes(s.place))?['sea']:[]);
      else if(o.shorter||o.longer){const s=sp.segs.slice().sort((a,b)=>b.nights-a.nights).find(x=>x.place!=='cruise');if(s)s.nights=Math.max(1,s.nights+(o.longer?1:-1));}}
    else sp={days:o.days||(o.segs.length?0:8),ad,ch,budget:o.budget||'mid',segs:o.segs,want:o.want,start:(tripSpan(liveItems())||{}).start||S.ctx.start};
    const P=buildPlan(sp);S.plan=P;S.planSpec=P.spec;S.planId=(S.planId||0)+1;S.ctx.ad=P.ad;S.ctx.ch=P.ch;
    const segT=P.spec.segs.map(s=>`${pl(s.nights,'night')} ${s.place==='cruise'?'on a '+segName(s):'in '+segName(s)}`).join(', ');
    return {plan:S.planId,html:`<p>${o.intent==='replan'?'Updated.':o.pkg?'I started from that package and rebuilt it from individual services so you can change anything.':'Here is a first plan.'} <b>${P.spec.days} days for ${paxSum(P)}</b>, ${{budget:'on a tight budget',mid:'mid-range',luxury:'at the luxury level'}[P.spec.budget]}: ${segT}.</p><p>It has ${P.items.length} bookable items for about <b>${fmt(P.total)}</b> (${fmt(P.total/(P.ad+P.ch))} per person), before international flights.${!o.days&&!o.segs.length&&o.intent==='plan'?' You did not give a length, so I assumed eight days.':''}</p>`,chips:[P.spec.budget==='luxury'?'Make it cheaper':'Make it luxury','Add 2 nights in Aswan','Make it longer','Add everything to my trip']};}
  if(o.intent==='addplan'){if(!S.plan)return {html:'<p>There is no plan yet. Ask me to plan a trip first.</p>',chips:[ASKS[0]]};const k=S.plan.items.length;S.plan.items.forEach(i=>addCart(i,null,true));S.plan.added=true;toast(`${k} items added to your trip`,'#trips','View trip');
    return {html:`<p>Done. ${k} items are in your trip, in date order. Nothing is booked or charged until you check out, and this prototype only simulates payment.</p>`,chips:['What is still missing?',{t:'Open my trip',href:'#trips'},{t:'Go to checkout',href:'#checkout'}]};}
  if(o.intent==='transfer'){const items=liveItems().concat(S.plan&&!S.plan.added?S.plan.items:[]);let leg=null;items.filter(i=>i.v==='flights').forEach(f=>((f.meta&&f.meta.legs)||[]).forEach(l=>{if(!leg&&((o.dir==='from'&&EGA[l.to]&&!EGA[l.from])||(o.dir==='to'&&EGA[l.from]&&!EGA[l.to]))&&(!o.ap||o.ap===(o.dir==='from'?l.to:l.from)))leg=l;}));
    const ap=o.ap||(leg?(o.dir==='from'?leg.to:leg.from):'CAI'),sp=tripSpan(items);
    const date=leg?addD(leg.date,o.dir==='from'?(leg.plus||0):0):(o.when||(sp?(o.dir==='from'?sp.start:sp.end):S.ctx.start));
    const time=leg?hm(o.dir==='from'?Math.min(1410,Math.ceil((leg.arr%1440)/30)*30):Math.max(0,Math.floor((leg.dep-180)/30)*30)):o.dir==='from'?'14:00':'09:00';
    const hotel=items.filter(i=>i.v==='hotels'&&ZONES[ap].some(z=>z[4]===i.city)).sort((a,b)=>Math.abs(diffD(date,a.date))-Math.abs(diffD(date,b.date)))[0];
    let zone=o.zone;if(!zone&&hotel){const z=ZONES[ap].filter(z=>z[4]===hotel.city);zone=(z.find(x=>hotel.meta&&hotel.meta.area&&x[1].toLowerCase().includes(hotel.meta.area.toLowerCase().split(',')[0]))||z[0])[0];}
    if(!zone)return {html:`<p>I can arrange that from ${apName(ap)}${leg?`, timed for ${leg.no} on ${fD(date)}`:''}. I do not see a hotel in your trip near this airport yet. Which area are you staying in?</p>`,chips:ZONES[ap].map(z=>`Transfer ${o.dir==='to'?'to':'from'} ${apCity(ap)} airport ${o.dir==='to'?'from':'to'} ${z[1]}`)};
    const z=zoneOf(ap,zone),c=[cand(PQ.transfer(ap,zone,o.dir,date,time,ad,ch,'mid')),cand(PQ.transfer(ap,zone,o.dir,date,time,ad,ch,'mid',n<=3?'executive':'minibus'))].filter(x=>x!=null);
    return {cards:c,html:`<p>${leg?`Your flight ${leg.no} ${o.dir==='from'?`lands at ${apCity(ap)} at ${hm(leg.arr)}`:`leaves ${apCity(ap)} at ${hm(leg.dep)}`} on ${fD(date)}.`:`I do not see a flight in your trip yet, so I used ${fD(date)} at ${time}. You can change it on the transfers page.`} ${hotel?`You are staying at <b>${esc(hotel.title)}</b>, in the ${z[1]} zone.`:`Going ${o.dir==='to'?'from':'to'} ${z[1]}.`} The drive takes about ${z[2]} minutes. Here are two options for ${pl(n,'passenger')}:</p>${NOTE}`,chips:[{t:'See all vehicles',href:'#transfers'}]};}
  if(o.intent==='gaps'){const G=gapsList();if(!liveItems().length)return {html:'<p>Your trip is empty, so everything is still to arrange. I can plan the whole thing if you tell me how long you have.</p>',chips:[ASKS[0],'Plan a week of pyramids and Red Sea for a family of four']};
    if(!G.length)return {html:'<p>Nothing obvious is missing. You have flights, a bed for every night, transfers, mobile data and insurance.</p>',chips:[{t:'Open my trip',href:'#trips'},'Find the best available tours for tomorrow']};
    return {html:`<p>${pl(G.length,'thing')} still to arrange:</p><ul>${G.map(g=>`<li><b>${esc(g.t)}.</b> ${esc(g.s)}</li>`).join('')}</ul>`,chips:G.slice(0,4).map(g=>({t:'Add '+(g.v==='esim'?'an eSIM':vname(g.v).toLowerCase()),href:g.href||'#'+g.v,act:g.href?null:{k:g.v,q:g.q||{}}}))};}
  if(o.intent==='trip'){const it=liveItems();if(!it.length)return {html:'<p>Your trip is empty. Add something from any page, or ask me to plan it.</p>',chips:[ASKS[0]]};const sp=tripSpan(it),b=it.filter(i=>i.state!=='cart');
    return {html:`<p>Your trip${sp?` runs ${fD(sp.start)} to ${fD(sp.end)}`:''}. ${b.length?pl(b.length,'item is','items are')+' confirmed in the demo and ':''}${pl(S.cart.length,'item is','items are')} in your basket, worth ${fmt(S.cart.reduce((s,i)=>s+i.total,0))}.</p>`,chips:[{t:'Open my trip',href:'#trips'},'What is still missing?']};}
  if(o.intent==='checkout'){if(!S.cart.length)return {html:'<p>There is nothing in your basket to pay for yet.</p>',chips:[ASKS[0]]};return {html:`<p>You have ${pl(S.cart.length,'item')} in your basket, ${fmt(S.cart.reduce((s,i)=>s+i.total,0))} in total. I cannot pay on your behalf. Checkout takes three steps and, in this prototype, the payment is simulated.</p>`,chips:[{t:'Go to checkout',href:'#checkout'}]};}
  if(o.intent==='visa'){if(!o.country)return {html:'<p>Entry rules depend on your passport. Which one do you travel on?</p>',chips:['United Kingdom','United States','Germany','Saudi Arabia','India','China'].map(c=>`Visa for a ${c} passport`)};const k=visaFor(o.country),M=VISA_M(o.country)[k];S.visaPick=o.country;
    return {html:`<p><b>${esc(o.country)}: ${M[0]}.</b> ${M[1]}</p><p class="tiny muted">Checked November 2026. Confirm with the official portal before you travel.</p>`,chips:[{t:'Visa and essentials',href:'#visa'},{t:'Add arrival fast-track',href:'#extras-arrival-fast-track'}]};}
  if(o.intent==='faq'){return {html:`<p>${esc(o.answer||FAQ[o.faq][1])}</p>`,chips:[{t:'More questions and answers',href:'#visa'}]};}
  if(o.intent==='search'){const v=o.vertical,d=o.dest&&DKEYS.includes(o.dest)?o.dest:null;let c=[],lead='',more={t:'See all '+vname(v).toLowerCase(),href:'#'+v};
    if(v==='hotels'){const dd=o.near?'giza':d;let l=HOTELS.filter(h=>(!dd||h.d===dd)&&(!o.stars||h.stars>=o.stars));if(o.budget==='budget')l=l.filter(h=>h.p<=100);if(o.budget==='luxury'&&!o.stars)l=l.filter(h=>h.stars>=5);
      l=l.slice().sort(o.near?(a,b)=>(a.gem||99)-(b.gem||99):o.budget==='budget'?(a,b)=>a.p-b.p:(a,b)=>b.r-a.r).slice(0,3);const [inD,nn]=stayDates(dd||'giza');
      c=l.map(h=>cand(PQ.hotelQ(h,inD,nn,ad,ch),{href:'#hotels-'+h.id,ph:h.ph,sub:`${'★'.repeat(h.stars)} · ${h.area}${o.near&&h.gem?` · about ${h.gem} min to the GEM`:''}`}));
      lead=l.length?`${o.stars?(o.stars>=5?'Five':'Four')+'-star hotels':o.budget==='budget'?'Good-value stays':'Top-rated stays'}${dd?' in '+DEST[dd].name:' across Egypt'}${o.near?', closest to the Grand Egyptian Museum first':''}. Prices are for ${pl(nn,'night')} from ${fD(inD)}, ${paxSum({ad,ch})}.`:'No hotels match that in the demo inventory.';more.act={k:'hotels',q:Object.assign({in:inD,out:addD(inD,nn)},dd?{d:dd}:{})};}
    else if(v==='tours'){const date=o.when||addD((tripSpan(liveItems())||{start:S.ctx.start}).start,1),city=d||cityOn(date)||(S.plan&&(S.plan.days.find(x=>x.date===date)||{}).city&&DKEYS.find(k=>DEST[k].name===(S.plan.days.find(x=>x.date===date)||{}).city))||null;
      const l=TOURS.filter(t=>!city||t.d===city||t.also===city||(city==='giza'&&t.d==='cairo')||(city==='cairo'&&t.d==='giza')).sort((a,b)=>b.r-a.r);
      c=l.map(t=>{const Q=PQ.tour(t.id,date,ad,ch);return Q.err?null:cand(Q,{href:'#tours-'+t.id,ph:t.ph,sub:`${hrsL(t.hrs)} · ${t.grp} · starts ${Q.time} · rated ${t.r.toFixed(1)}`});}).filter(x=>x!=null).slice(0,4);
      lead=`The best-rated tours with space on ${fD(date)}${city?' in '+DEST[city].name+(cityOn(date)===city?', where your trip has you that day':''):' across Egypt'}. Sold-out start times are already left out.`;more.act={k:'tours',q:Object.assign({date},city?{d:city}:{})};}
    else if(v==='cruises'){const date=addD((tripSpan(liveItems())||{start:S.ctx.start}).start,3);c=CRUISES.slice().sort((a,b)=>b.r-a.r).filter(x=>!o.budget||(o.budget==='luxury'?x.cls==='Luxury'||x.cls==='Dahabiya':x.p<800)).slice(0,3).map(x=>cand(VX.cruises.quote(x,{},{date:sailings(x,date,1)[0],cabin:0,ad,ch}),{href:'#cruises-'+x.id,ph:x.ph,sub:`${CROUTES[x.route].n} · ${CROUTES[x.route].nights} nights · sails ${fD(sailings(x,date,1)[0])}`}));lead=`Nile sailings on or after ${fD(date)}, priced for ${paxSum({ad,ch})}.`;}
    else if(v==='tickets'){const date=o.when||addD(S.ctx.start,1);const l=SITES.filter(s=>!d||s.d===d).slice(0,3);c=l.map(s=>cand(PQ.ticket(s.id,date,n),{href:'#tickets-'+s.id,ph:s.ph,sub:`${s.type} · ${DEST[s.d].name} · ${fD(date)}`}));lead=`Site tickets${d?' in '+DEST[d].name:''} for ${pl(n,'visitor')}. These are on request in the prototype.`;}
    else if(v==='dining'){const date=o.when||addD(S.ctx.start,1),city=d||cityOn(date);const l=RESTS.filter(r=>!city||r.d===city).sort((a,b)=>b.r-a.r).slice(0,3);c=l.map(r=>{const Q=PQ.dining(r.id,date,'19:30',n);return Q.err?null:cand(Q,{href:'#dining-'+r.id,ph:r.ph,sub:`${r.cui} · ${r.area} · table at ${Q.time}`});});lead=`Tables for ${n} on ${fD(date)}${city?' in '+DEST[city].name:''}, closest to 19:30.`;}
    else if(v==='esim'){const sp=tripSpan(liveItems()),days=sp?diffD(sp.start,sp.end)+1:S.ctx.nights+1;c=[cand(PQ.esim(days,sp?sp.start:S.ctx.start,1),{href:'#esim',sub:`Best match for a ${days}-day trip`}),cand(VX.esim.quote(byId(ESIMS,'eg-unl-15'),{},{qty:1,date:sp?sp.start:S.ctx.start}),{href:'#esim-eg-unl-15',sub:'If you stream or share a hotspot'})];lead='Two eSIM plans that fit your trip length. Each phone needs its own.';}
    else if(v==='insurance'){const sp=tripSpan(liveItems())||{start:S.ctx.start,end:addD(S.ctx.start,S.ctx.nights)};c=INS.map(p=>cand(VX.insurance.quote(p,{},{start:sp.start,end:sp.end,ad,ch,sen:0}),{href:'#insurance-'+p.id,sub:p.blurb}));lead=`Cover for ${paxSum({ad,ch})}, ${fD(sp.start)} to ${fD(sp.end)}.`;}
    else if(v==='extras'){const sp=tripSpan(liveItems()),date=sp?sp.start:S.ctx.start;c=['arrival-fast-track','vip-terminal','porter'].map(id=>cand(PQ.extra(id,'CAI',date,n),{href:'#extras-'+id,sub:byId(EXTRAS,id).blurb}));lead=`Arrival services at Cairo Airport on ${fD(date)} for ${pl(n,'passenger')}.`;}
    else if(v==='packages'){const l=PKGS.filter(p=>!o.budget||(o.budget==='luxury'?p.themes.includes('Luxury'):p.p<1300)).slice(0,3);c=l.map(p=>cand(VX.packages.quote(p,{},{date:S.ctx.start,ad,ch,tier:0}),{href:'#packages-'+p.id,ph:p.ph,sub:`${p.days} days · ${p.route.map(x=>DEST[x].name).join(', ')}`}));lead=`Ready-made holidays from ${fD(S.ctx.start)} for ${paxSum({ad,ch})}. I can also rebuild any of them piece by piece.`;}
    else{lead={flights:'Flight search needs your departure airport and dates, so it is quickest on the flights page. Your trip dates are filled in for you.',trains:'Rail and coach times depend on the route. The search page has every departure.',cars:'Car rental depends on where you collect the car. The search page shows every vehicle at each airport.'}[v];const sp=tripSpan(liveItems());more={t:'Open '+vname(v).toLowerCase()+' search',href:'#'+v,act:v==='flights'&&sp?{k:'flights',q:{date:sp.start,ret:sp.end>sp.start?sp.end:addD(sp.start,7)}}:null};}
    c=c.filter(x=>x!=null);return {cards:c,html:`<p>${lead}</p>${c.length?NOTE:''}`,chips:[more]};}
  if(o.answer)return {html:`<p>${esc(o.answer)}</p>`,chips:[ASKS[0],'What is still missing from my trip?']};
  return {html:`<p>${o.intent==='greet'?'Hello. ':'I did not catch a request I can act on. '}I can plan a whole trip, find one thing in any of the 13 services, sort out an airport transfer, check visa rules, or tell you what your trip still needs. Try one of these:</p>`,chips:ASKS};}

/* ---------- concierge page ---------- */
function msgHtml(m){if(m.r==='u')return `<div class="msg u"><div class="bub">${esc(m.text)}</div></div>`;
  const cards=(m.cards||[]).map(ix=>{const c=S.cc[ix],ci=c.ci;return `<div class="mcard">${c.ph&&PHOTOS[c.ph]?`<div class="plate">${pimg(c.ph,ci.title)}</div>`:`<div class="plate ico">${ic(ci.v)}</div>`}<div><h3>${esc(ci.title)}</h3><div class="tiny muted">${esc(c.sub||ci.sub||'')}</div></div><div class="end"><b class="num">${fmt(ci.total)}</b><div class="row" style="gap:6px">${c.href?`<a class="btn sm ghost" href="${c.href}">View</a>`:''}<button class="btn sm" data-act="cadd" data-i="${ix}">Add</button></div></div></div>`;}).join('');
  const P=S.plan,plan=m.plan?(m.plan===S.planId&&P?`<div class="plancard"><div class="top2 dark"><div class="tiny" style="letter-spacing:.1em;text-transform:uppercase;font-weight:700;color:var(--gold-b)">Your plan · ${fD(P.start)} to ${fD(P.end)}</div><h3>${esc(P.title)}</h3><div class="routeline" style="margin-top:8px">${P.route.map((d,i)=>(i?'<i></i>':'')+`<b>${DEST[d].name}</b>`).join('')}</div></div><div class="bot"><div class="price num">${fmt(P.total)}<small>${P.items.length} bookable items, ${paxSum(P)}</small></div><div class="row wrapx" style="gap:6px"><button class="btn sm ghost" data-act="cboard" data-v="1">See day by day</button><button class="btn sm${P.added?' done':''}" data-act="cchip" data-q="Add everything to my trip"${P.added?' disabled':''}>${P.added?'Added to your trip':'Add everything'}</button></div></div></div>`:'<div class="tiny muted">Replaced by a newer plan further down.</div>'):'';
  const chips=m.chips&&m.chips.length?`<div class="row wrapx" style="gap:6px">${m.chips.map(c=>typeof c==='string'?`<button class="chip" data-act="cchip" data-q="${esc(c)}">${esc(c)}</button>`:c.act?`<button class="chip" data-act="vgo" data-k="${c.act.k}" data-q="${esc(JSON.stringify(c.act.q))}">${esc(c.t)} ${ic('arrow','s flip')}</button>`:`<a class="chip" href="${c.href}">${esc(c.t)} ${ic('arrow','s flip')}</a>`).join('')}</div>`:'';
  return `<div class="msg a"><div class="bub">${m.html}</div>${plan}${cards}${chips}</div>`;}
function drawChat(){const el=$('#msgs');if(!el)return;el.innerHTML=S.chat.map(msgHtml).join('')+(S.busy?'<div class="typing" role="status" aria-label="The concierge is thinking"><i></i><i></i><i></i></div>':'');el.scrollTop=el.scrollHeight;}
function drawBoard(){const el=$('#board');if(!el)return;const P=S.plan;
  if(!P){const it=liveItems(),G=gapsList();el.innerHTML=`<div><div class="eye">Trip board</div><h2 style="margin-top:8px;font-size:34px">${it.length?'Your trip so far':'Your plan appears here'}</h2><p class="ink2" style="margin-top:8px;max-width:52ch">${it.length?`${pl(it.length,'item')} across ${pl(uniq(it.map(i=>i.v)).length,'service')}. Ask what is missing, or let me fill the gaps.`:'Describe the trip in your own words. The route is drawn on the map, each day is filled with bookable items, and the total updates as you change your mind.'}</p></div>
      <div class="mapbox">${mapSVG({pins:true})}</div>
      ${it.length?`<div class="cov">${it.slice(0,8).map(i=>`<a href="#trips">${ic(i.v,'s')}<span>${esc(i.title)}</span><span class="tiny muted num">${i.date?fD(i.date):''}</span></a>`).join('')}</div>${G.length?`<div class="alert gold">${ic('info','s')}<span>${pl(G.length,'thing')} still to arrange. Ask “What is still missing?”</span></div>`:''}`:`<div class="kv">${[['Plans','Whole itineraries from a sentence'],['Finds','Hotels, tours, tickets, tables'],['Connects','Transfers timed to your flights'],['Checks','What your trip still needs']].map(x=>`<div><small>${x[0]}</small><b>${x[1]}</b></div>`).join('')}</div>`}`;return;}
  el.innerHTML=`<div class="row between wrapx" style="align-items:end"><div><div class="eye">Trip board · ${fD(P.start)} to ${fD(P.end)}</div><h2 style="margin-top:8px;font-size:34px">${esc(P.title)}</h2></div><div class="price num" style="text-align:end;font-size:26px">${fmt(P.total)}<small>${fmt(P.total/(P.ad+P.ch))} per person · ${paxSum(P)}</small></div></div>
    <div class="mapbox">${mapSVG({pins:P.route,route:P.route.map(destPt)})}</div>
    <div class="row wrapx"><button class="btn${P.added?' done':''}" data-act="cchip" data-q="Add everything to my trip"${P.added?' disabled':''}>${P.added?ic('check','s')+'Added to your trip':'Add all '+P.items.length+' items to my trip'}</button><a class="btn ghost" href="#trips">${esc(tx('trip'))}</a><button class="link small" data-act="cnew">Start over</button></div>
    <div>${P.days.map(d=>`<div class="bday"><div class="n">${d.n}</div><div><div class="row between"><h3>${esc(d.title)}</h3><span class="tiny muted">${fD(d.date)} · ${esc(d.city)}</span></div>${d.items.map(i=>`<div class="bit${i.ci?'':' note'}"><span class="tm">${i.time||''}</span>${ic(i.v||'info','s')}<span>${esc(i.label)}${i.note?`<span class="tiny muted" style="display:block">${esc(i.note)}</span>`:i.ci&&i.ci.sub?`<span class="tiny muted" style="display:block">${esc(i.ci.sub)}</span>`:''}</span><span class="num small">${i.ci?fmt(i.ci.total):'<span class="tiny muted">included</span>'}</span></div>`).join('')}</div></div>`).join('')}</div>
    <p class="tiny muted">Built from the same demo inventory and prices as the booking pages. International flights are not included.</p>`;}
async function csend(text){text=String(text||'').trim();if(!text||S.busy)return;S.chat.push({r:'u',text});S.busy=true;drawChat();let o=localNLU(text);
  if(SAMPLE&&o.intent==='unknown'){try{const ai=await Promise.race([SAMPLE.json(nluPrompt(text),{modelTier:'quick',cache:false}),new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')),12000))]);o=mergeNLU(o,ai);}catch(e){}}
  else await new Promise(r=>setTimeout(r,480));
  let m;try{m=respond(o,text);}catch(e){m={html:'<p>Something went wrong while building that answer. Try rephrasing it, or use the search pages.</p>'};}
  S.chat.push(Object.assign({r:'a'},m));S.busy=false;save();updCount();drawChat();drawBoard();}
function pageConcierge(){if(!S.chat.length)S.chat.push({r:'a',html:`<p>I am the Visit Egypt concierge. I know all 13 services on this site and what is already in your trip${liveItems().length?` (${pl(liveItems().length,'item')} so far)`:''}.</p><p>Tell me what you want in your own words.</p>`,chips:ASKS});
  app.innerHTML=`<div class="ctabs2"><button data-act="cboard" data-v="0" class="on">Conversation</button><button data-act="cboard" data-v="1">Trip board</button></div>
  <div class="cg" id="cg"><section class="chat" aria-label="Concierge conversation"><div class="chead"><div><h1>${ic('spark')} ${esc(tx('concierge'))}</h1><div class="tiny muted" id="aistat">${aiLabel()}</div></div><span class="bdg demo">Demo inventory</span></div>
    <div class="msgs" id="msgs" aria-live="polite"></div>
    <div class="composer"><form id="cform"><input id="cin" type="text" aria-label="Message the concierge" placeholder="Plan, find, or ask about your trip" autocomplete="off" maxlength="600"><button class="btn sm" type="submit" aria-label="Send">${ic('send','s')}</button></form><div class="tiny muted">The concierge adds to your trip. It never books or charges without checkout.</div></div></section>
    <section class="board" id="board" aria-label="Trip board"></section></div>`;
  $('#cform').onsubmit=e=>{e.preventDefault();const i=$('#cin'),v=i.value;i.value='';csend(v);};
  drawChat();drawBoard();if(S.pending){const p=S.pending;S.pending=null;csend(p);}}

/* ---------- actions ---------- */
const ACT={
  mega(b){const h=$('#hdr'),o=!h.classList.contains('open');h.classList.toggle('open',o);b.setAttribute('aria-expanded',String(o));},
  ctab(b){S.tab=b.dataset.k;drawTabs();},
  expand(b){const k=b.dataset.k,it=(S.cache[k]||[]).find(x=>x.id===b.dataset.id),art=b.closest('.fl'),more=$('.more',art);if(!it)return;const open=more.hidden;if(open)more.innerHTML=VX[k].expand(it,S.q[k]);more.hidden=!open;art.classList.toggle('open',open);b.setAttribute('aria-expanded',String(open));b.textContent=open?'Hide':k==='flights'?'Select fare':'Choose class';},
  addopt(b){const k=b.dataset.k,q=S.q[k],it=(S.cache[k]||[]).find(x=>x.id===b.dataset.id);if(!it)return;const Q=VX[k].quote(it,q,{o:+b.dataset.o||0});if(Q.err){toast(Q.err);return;}addCart(Q,b);
    if(k==='flights'&&q.trip==='multi'&&q.legIx<q.nlegs-1){q.legIx++;setTimeout(()=>{if(location.hash==='#flights'){runSearch('flights',true);toast('Now choose flight '+(q.legIx+1));}},700);}},
  fleg(b){S.q.flights.legIx=+b.dataset.i;runSearch('flights',true);},
  clearf(){const k=location.hash.slice(1);if(!VX[k])return;S.f[k]={m:{},b:{},max:null};$('#filters').innerHTML=filtersHtml(k,S.cache[k]||[],S.q[k]);drawResults(k);},
  openf(){$('#filters').classList.add('open');$('#scrim').classList.add('open');},
  closef(){closeModal();},
  lightbox(b){lightbox(+b.dataset.i);},
  closemodal(){closeModal();},
  sedit(){const v=$('.vh');if(v)v.classList.add('editing');},
  tobox(){const b=$('#bbox');if(b)b.scrollIntoView({behavior:'smooth',block:'start'});},
  dslot(b){S.pick=b.dataset.t;location.hash='dining-'+b.dataset.id;},
  askc(b){S.pending=b.dataset.q;if(location.hash==='#concierge')pageConcierge();},
  vgo(b){const k=b.dataset.k;let q={};try{q=JSON.parse(b.dataset.q||'{}');}catch(e){}S.q[k]=Object.assign(VX[k].q0(),q);if(k==='transfers'&&q.ap&&!q.zone)S.q[k].zone=ZONES[q.ap][0][0];if(location.hash==='#'+k)route();else location.hash=k;},
  visago(){S.visaPick=$('#qv').value;location.hash='visa';},
  rail(b){$('#xprail').scrollBy({left:(document.documentElement.dir==='rtl'?-1:1)*(+b.dataset.d)*320,behavior:'smooth'});},
  mood(b){S.mood=S.mood===b.dataset.k?null:b.dataset.k;if(S.mood){const f=Object.keys(DEST).find(k=>DEST[k].mood.includes(S.mood));if(f)S.mapSel=f;}$$('[data-act="mood"]').forEach(x=>{const on=x.dataset.k===S.mood;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on);});drawMap();},
  async glyphcopy(){try{await navigator.clipboard.writeText(toGlyphs($('#nm').value).map(g=>g[1]).join(''));toast('Copied');}catch(e){toast('Copying is not available here. Select the signs and copy them.');}},
  rm(b){S.cart=S.cart.filter(i=>i.id!==b.dataset.id);save();updCount();route(true);},
  sample(){const P=buildPlan({days:9,ad:2,ch:0,budget:'mid',start:S.ctx.start}),fl=PQ.round(S.ctx.from||'LHR','CAI',P.start,P.end,2,0);const book=[fl].concat(P.items.filter(i=>['hotels','cruises'].includes(i.v))).filter(Boolean),rest=P.items.filter(i=>!book.includes(i)&&i.v!=='esim'&&i.v!=='insurance');
    S.bookings.push(makeBooking(book,{name:'Sample Traveller',email:'traveller@example.com'},true));rest.forEach(i=>addCart(i,null,true));save();route(true);toast('Sample trip loaded with demo data');},
  cleartrip(){openModal(`<h2 style="font-size:30px">Clear this trip?</h2><p class="ink2">This removes ${pl(S.cart.length,'basket item')} and ${pl(S.bookings.length,'demo booking')} from this browser. It cannot be undone.</p><div class="row wrapx" style="justify-content:flex-end"><button class="btn ghost" data-act="closemodal">Keep my trip</button><button class="btn" data-act="clearyes" style="background:var(--carn)">Clear everything</button></div>`);},
  clearyes(){S.cart=[];S.bookings=[];S.plan=null;S.planSpec=null;S.co=null;save();closeModal();route(true);toast('Trip cleared');},
  voucher(b){const bk=S.bookings.find(x=>x.ref===b.dataset.b),i=bk&&bk.items[+b.dataset.i];if(!i)return;
    openModal(`<span class="bdg demo" style="justify-self:start">Demo voucher · not valid for travel</span><h2 style="font-size:30px">${esc(i.title)}</h2><div class="voucher"><div class="row between"><div><div class="tiny muted">${esc(tx(i.v))}</div><b>${esc(i.sub||'')}</b></div>${stateBdg(i.cancelled?'cancelled':i.mode==='request'?'requested':'booked')}</div>${kv([['Date',i.date?fD(i.date,1):'Open'],['Time',i.time||'Any time'],['Lead traveller',esc((bk.lead&&bk.lead.name)||'Sample Traveller')],['Voucher',i.voucher]])}<div class="barcode" aria-hidden="true"></div><div class="tiny muted num" style="text-align:center;letter-spacing:.2em">${i.voucher}</div></div><p class="small muted">${esc(i.policy||'')}</p><div class="row" style="justify-content:flex-end"><button class="btn" data-act="closemodal">Done</button></div>`);},
  cancel(b){const bk=S.bookings.find(x=>x.ref===b.dataset.b),i=bk&&bk.items[+b.dataset.i];if(!i)return;const past=i.date&&i.date<=TODAY,ref=i.refundable&&!past?i.total:0;
    openModal(`<h2 style="font-size:30px">Cancel this booking?</h2><div class="ci" style="border:0;padding:0"><div class="ic">${ic(i.v)}</div><div><h3>${esc(i.title)}</h3><div class="small muted">${esc(i.sub||'')}</div></div><b class="num">${fmt(i.total)}</b></div><div class="alert ${ref?'ok':'gold'}">${ic('info','s')}<span>${esc(i.policy||'')} ${ref?`You would be refunded <b>${fmt(ref)}</b>.`:'This item is not refundable now, so no refund would be due.'} Demo only: no supplier is contacted.</span></div><div class="row wrapx" style="justify-content:flex-end"><button class="btn ghost" data-act="closemodal">Keep booking</button><button class="btn" style="background:var(--carn)" data-act="cancelyes" data-b="${bk.ref}" data-i="${b.dataset.i}" data-r="${ref}">Cancel booking</button></div>`);},
  cancelyes(b){const bk=S.bookings.find(x=>x.ref===b.dataset.b),i=bk&&bk.items[+b.dataset.i];if(!i)return;i.cancelled=true;i.refund=+b.dataset.r||0;save();closeModal();route(true);toast('Booking cancelled in the demo');},
  costep(b){const C=coState();C.step=+b.dataset.s;C.fail=false;pageCheckout();window.scrollTo(0,0);},
  pay(b){coState().pay=b.dataset.m;pageCheckout();},
  sim(b){coState().sim=b.dataset.v;pageCheckout();},
  payconfirm(){const C=coState();if(!C.agree){showErrs($('#agreef').parentElement,{agree:'Tick the box to confirm you have read the policies.'});return;}
    C.step=4;pageCheckout();window.scrollTo(0,0);setTimeout(()=>{if(C.sim==='no'){C.step=3;C.fail=true;if(location.hash==='#checkout'){pageCheckout();window.scrollTo(0,0);}return;}
      const bk=makeBooking(S.cart,C.lead,false);bk.pay=C.pay;bk.items.forEach(i=>{if(i.need&&i.need.flight&&C.flight){i.meta=i.meta||{};i.meta.flight=C.flight;}});S.bookings.push(bk);S.cart=[];S.co=null;if(S.plan)S.plan.added=true;save();updCount();location.hash='booking-'+bk.ref;},1500);},
  cchip(b){csend(b.dataset.q);},
  cadd(b){const c=S.cc[+b.dataset.i];if(c)addCart(c.ci,b);},
  cboard(b){const g=$('#cg');if(!g)return;const on=b.dataset.v==='1';g.classList.toggle('showboard',on);$$('.ctabs2 button').forEach(x=>x.classList.toggle('on',(x.dataset.v==='1')===on));if(on&&window.innerWidth>960){const bd=$('#board');if(bd)bd.scrollTop=0;}},
  cnew(){S.plan=null;S.planSpec=null;S.chat=[];S.cc=[];pageConcierge();}
};
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(b){const fn=ACT[b.dataset.act];if(fn)fn(b,e);}
  else if($('#hdr').classList.contains('open')&&!e.target.closest('#hdr'))closeMenu();
  if(e.target.closest('#msheet a,#megain a'))closeMenu();});
$('#scrim').addEventListener('click',closeModal);
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();closeMenu();closePops();}});
$('#burger').onclick=()=>{const h=$('#hdr'),o=!h.classList.contains('open');h.classList.toggle('open',o);$('#burger').setAttribute('aria-expanded',String(o));};

/* ---------- router ---------- */
function route(keep){let h=(location.hash||'#home').slice(1)||'home';if(h.startsWith('book-'))h=h.slice(5);if(h==='book')h='hotels';if(h==='planner')h='concierge';if(h==='experiences')h='tours';
  const y=window.scrollY,i=h.indexOf('-'),head=i>0?h.slice(0,i):h,tail=i>0?h.slice(i+1):'';
  document.body.classList.remove('hasbar');closeModal();
  if(VX[h])pageList(h);else if(VX[head]&&tail)pageDetail(head,tail);else if(h==='destinations')pageGuide();else if(head==='dest'&&tail)pageDest(tail);else if(h==='visa')pageVisa();else if(h==='trips')pageTrips();else if(h==='checkout')pageCheckout();else if(head==='booking'&&tail)pageBooking(tail);else if(h==='concierge')pageConcierge();else{h='home';pageHome();}
  S.pick=null;chrome(h);window.scrollTo(0,keep===true?y:0);}
function applyLang(){document.documentElement.lang=S.lang;document.documentElement.dir=S.lang==='ar'?'rtl':'ltr';}
$('#cur').innerHTML=Object.keys(CUR).map(c=>`<option ${c===S.cur?'selected':''}>${c}</option>`).join('');
$('#lang').value=S.lang;
$('#lang').onchange=e=>{S.lang=e.target.value;save();applyLang();route(true);};
$('#cur').onchange=e=>{S.cur=e.target.value;save();route(true);};
window.addEventListener('hashchange',()=>route());
applyLang();route();
