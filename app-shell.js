(()=>{'use strict';
const KEY='form.tracker.v2';
const file=location.pathname.split('/').pop()||'index.html';
const page=file.startsWith('nutrition')?'food':file.startsWith('training')?'train':file.startsWith('progress')?'progress':'today';
let state={};try{state=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch{}
document.body.classList.add(state.profile?'has-app-shell':'setup-mode','page-'+page);
if(!state.profile)return;
const icon={
 today:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11.5 12 5l8 6.5"/><path d="M6.5 10v9h11v-9M9.5 19v-5h5v5"/></svg>',
 food:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v7M4.5 4v4.5A2.5 2.5 0 0 0 7 11v9M9.5 4v4.5A2.5 2.5 0 0 1 7 11M16 4c2.3 1.1 3.5 3.2 3.5 6 0 2.3-1.2 3.9-3.5 4.5V20M16 4v10.5"/></svg>',
 train:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8v8M3.5 9.5v5M18 8v8M20.5 9.5v5M6 12h12"/></svg>',
 progress:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19V10M12 19V5M19 19v-7"/></svg>'
};
const links=[['today','index.html','Today'],['food','nutrition.html','Food'],['train','training.html','Train'],['progress','progress.html','Progress']];
const nav=links.map(([id,href,label])=>'<a href="'+href+'" class="'+(page===id?'active':'')+'" '+(page===id?'aria-current="page"':'')+'>'+icon[id]+'<span>'+label+'</span></a>').join('');
const name=state.profile.profile?.displayName||'Athlete',initial=name.trim().charAt(0).toUpperCase()||'A';
const header=document.createElement('header');header.className='app-header';header.innerHTML='<div class="app-header-inner"><a class="app-wordmark" href="index.html" aria-label="Form home"><span>F</span>FORM</a><nav class="app-nav" aria-label="Primary">'+nav+'</nav><a class="profile-chip" href="index.html#settings" aria-label="Profile and backup"><span>'+initial+'</span><b>'+escapeHtml(name)+'</b></a></div>';
const mobile=document.createElement('nav');mobile.className='app-mobile-nav';mobile.setAttribute('aria-label','Primary');mobile.innerHTML=nav;
document.body.prepend(header);document.body.append(mobile);
document.querySelectorAll('nav.nav,.top>.brand,.top>.status').forEach(x=>x.remove());

const motionItems=[...document.querySelectorAll('main header:not(.app-header),.daily-spark,.overview-grid>*,.tabs,.layout>*,.training-layout>*,.progress-grid>*,.view.active>*,.settings-panel')].filter((x,i,a)=>a.indexOf(x)===i).slice(0,10);
motionItems.forEach((el,i)=>{el.dataset.motionItem='';el.style.setProperty('--motion-delay',Math.min(i,6)*42+'ms')});
requestAnimationFrame(()=>requestAnimationFrame(()=>document.body.classList.add('motion-ready')));
document.addEventListener('pointerdown',e=>{const target=e.target.closest('button,.btn,.food,[data-food],.app-mobile-nav a');if(!target||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const rect=target.getBoundingClientRect(),wave=document.createElement('i');wave.className='tap-wave';wave.style.left=e.clientX-rect.left+'px';wave.style.top=e.clientY-rect.top+'px';target.append(wave);wave.addEventListener('animationend',()=>wave.remove())});
const observer=new MutationObserver(records=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;for(const record of records){for(const node of record.addedNodes){if(!(node instanceof HTMLElement))continue;if(node.matches('.exercise,.ingredient,.meal-row,.session,.set'))node.animate([{opacity:0,transform:'translateY(8px) scale(.97)'},{opacity:1,transform:'none'}],{duration:260,easing:'cubic-bezier(.16,1,.3,1)'});}}});
observer.observe(document.body,{childList:true,subtree:true});

function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
})();