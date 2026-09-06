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
const header=document.createElement('header');header.className='app-header';header.innerHTML='<div class="app-header-inner"><a class="app-wordmark" href="index.html" aria-label="Form home"><span>F</span><b>FORM</b></a><nav class="app-nav" aria-label="Primary">'+nav+'</nav><a class="profile-chip" href="index.html#settings" aria-label="Profile and backup"><span>'+initial+'</span><b>'+escapeHtml(name)+'</b></a></div>';
const mobile=document.createElement('nav');mobile.className='app-mobile-nav';mobile.setAttribute('aria-label','Primary');mobile.innerHTML='<div class="nav-glider" aria-hidden="true"></div>'+nav;
document.body.prepend(header);document.body.append(mobile);
const veil=document.createElement('div');veil.className='page-veil';veil.setAttribute('aria-hidden','true');document.body.append(veil);
document.addEventListener('click',e=>{const link=e.target.closest('.app-nav a,.app-mobile-nav a');if(!link||reduced?.matches||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();const r=link.getBoundingClientRect();veil.style.setProperty('--veil-x',r.left+r.width/2+'px');veil.style.setProperty('--veil-y',r.top+r.height/2+'px');document.body.classList.add('page-leaving');setTimeout(()=>location.href=link.href,390)});
document.querySelectorAll('nav.nav,.top>.brand,.top>.status').forEach(x=>x.remove());
requestAnimationFrame(()=>{const active=mobile.querySelector('a.active');if(active){const box=active.getBoundingClientRect(),parent=mobile.getBoundingClientRect();mobile.style.setProperty('--active-x',box.left-parent.left+'px');mobile.style.setProperty('--active-w',box.width+'px')}});
const reveal=[...document.querySelectorAll('main header:not(.app-header),.daily-spark,.overview-grid>*,.tabs,.layout>*,.training-layout>*,.progress-grid>*,.view.active>*,.settings-panel,.card,.panel')].filter((x,i,a)=>a.indexOf(x)===i);
reveal.forEach((el,i)=>{el.dataset.motionItem='';el.style.setProperty('--motion-delay',Math.min(i,7)*38+'ms')});
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
if('IntersectionObserver'in window&&!reduced.matches){const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target)}}),{threshold:.08,rootMargin:'0px 0px -4%'});reveal.forEach(el=>io.observe(el))}else reveal.forEach(el=>el.classList.add('is-visible'));
requestAnimationFrame(()=>document.body.classList.add('motion-ready'));
if(matchMedia('(hover:hover) and (pointer:fine)').matches){document.addEventListener('pointermove',e=>{document.body.style.setProperty('--pointer-x',e.clientX+'px');document.body.style.setProperty('--pointer-y',e.clientY+'px');const card=e.target.closest('.card,.panel');if(card){const r=card.getBoundingClientRect();card.style.setProperty('--spot-x',e.clientX-r.left+'px');card.style.setProperty('--spot-y',e.clientY-r.top+'px')}})}
let lastY=scrollY;addEventListener('scroll',()=>{const y=scrollY;header.classList.toggle('is-scrolled',y>20);document.body.classList.toggle('scrolling-down',y>lastY&&y>100);lastY=y},{passive:true});
document.addEventListener('pointerdown',e=>{const target=e.target.closest('button,.btn,.food,[data-food],.app-mobile-nav a,.app-nav a');if(!target||reduced.matches)return;const rect=target.getBoundingClientRect(),wave=document.createElement('i');wave.className='tap-wave';wave.style.left=e.clientX-rect.left+'px';wave.style.top=e.clientY-rect.top+'px';target.append(wave);wave.addEventListener('animationend',()=>wave.remove())});
const observer=new MutationObserver(records=>{if(reduced.matches)return;for(const record of records){for(const node of record.addedNodes){if(!(node instanceof HTMLElement))continue;if(node.matches('.exercise,.ingredient,.meal-row,.session,.set'))node.animate([{opacity:0,transform:'translateY(10px) scale(.97)'},{opacity:1,transform:'none'}],{duration:320,easing:'cubic-bezier(.16,1,.3,1)'})}}});
observer.observe(document.body,{childList:true,subtree:true});
enhancePage();
syncMode();
const modeObserver=new MutationObserver(syncMode);modeObserver.observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});
function syncMode(){document.body.classList.toggle('session-live',!!document.querySelector('#activeWorkout:not(.hidden)'));document.body.classList.toggle('meal-composing',!!document.querySelector('#builderView.active'))}
function enhancePage(){
 if(page==='today'){
  const hero=document.querySelector('.hero-panel'),energy=hero?.querySelector('.energy-readout'),macros=hero?.querySelector('#todayMacros');
  if(hero&&energy&&macros){hero.classList.add('day-instrument');const orbit=document.createElement('div');orbit.className='day-orbit';orbit.innerHTML='<i class="orbit-a"></i><i class="orbit-b"></i><i class="orbit-c"></i><span class="orbit-glint"></span><div class="orbit-core"></div>';orbit.querySelector('.orbit-core').append(energy);hero.insertBefore(orbit,macros);const value=parseFloat(energy.querySelector('strong')?.textContent)||0,max=state.profile?.nutritionPlan?.targets?.calories?.max||1;orbit.style.setProperty('--day-angle',(Math.min(1,value/max)*360)+'deg');}
 }
 if(page==='food'){
  const stage=document.querySelector('.daily-overview'),energy=stage?.querySelector('.day-energy'),macros=stage?.querySelector('#macroProgress');
  if(stage&&energy&&macros){stage.classList.add('fuel-stage');const orbit=document.createElement('div');orbit.className='fuel-orbit';orbit.innerHTML='<div class="fuel-rings"><i></i><i></i><i></i><span class="fuel-spark"></span><div class="fuel-core"></div></div>';orbit.querySelector('.fuel-core').append(energy);stage.insertBefore(orbit,macros);const value=parseFloat(energy.textContent.replace(/,/g,''))||0,max=state.profile?.nutritionPlan?.targets?.calories?.max||1;orbit.style.setProperty('--fuel-angle',(Math.min(1,value/max)*360)+'deg');}
  document.querySelector('#builderView')?.classList.add('meal-studio');document.querySelector('#mealSlots')?.classList.add('fuel-timeline');
 }
 if(page==='train'){
  const stage=document.querySelector('#startPanel');if(stage){stage.classList.add('training-chamber');const orb=document.createElement('div');orb.className='readiness-orb';orb.innerHTML='<i></i><i></i><i></i><span>READY</span>';stage.prepend(orb)}
  document.querySelector('#activeWorkout')?.classList.add('live-chamber');
 }
 if(page==='progress'){
  const main=document.querySelector('main.shell'),head=document.querySelector('.progress-head'),scores=document.querySelector('.score-grid');
  if(main&&head&&scores){const stage=document.createElement('section');stage.className='trajectory-stage';stage.innerHTML='<div class="trajectory-field"><i></i><i></i><i></i><span class="trajectory-dot"></span></div>';main.insertBefore(stage,head);stage.prepend(head);stage.append(scores)}
  document.querySelectorAll('.chart-card').forEach((x,i)=>x.style.setProperty('--chapter',i));document.querySelectorAll('.bar-day').forEach((x,i)=>x.style.setProperty('--i',i));
 }
}
animateMetrics();
function animateMetrics(){if(reduced.matches)return;document.querySelectorAll('.energy-readout strong,.quick-metrics strong,.summary-value').forEach(el=>{const match=el.textContent.trim().match(/^(\d+(?:\.\d+)?)(.*)$/);if(!match)return;const end=Number(match[1]),suffix=match[2],start=performance.now(),duration=620;function frame(now){const p=Math.min(1,(now-start)/duration),v=end*(1-Math.pow(1-p,3));el.textContent=(Number.isInteger(end)?Math.round(v):v.toFixed(1))+suffix;if(p<1)requestAnimationFrame(frame)}requestAnimationFrame(frame)})}
function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
})();