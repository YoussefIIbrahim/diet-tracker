(()=>{'use strict';
const KEY='form.tracker.v2';
const file=location.pathname.split('/').pop()||'index.html';
const page=file.startsWith('nutrition')?'nutrition':file.startsWith('training')?'training':'today';
let state={};try{state=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch{}
document.body.classList.add(state.profile?'has-app-shell':'setup-mode','page-'+page);
if(!state.profile)return;
const icon={
 today:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11.5 12 5l8 6.5"/><path d="M6.5 10v9h11v-9M9.5 19v-5h5v5"/></svg>',
 nutrition:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v7M4.5 4v4.5A2.5 2.5 0 0 0 7 11v9M9.5 4v4.5A2.5 2.5 0 0 1 7 11M16 4c2.3 1.1 3.5 3.2 3.5 6 0 2.3-1.2 3.9-3.5 4.5V20M16 4v10.5"/></svg>',
 training:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8v8M3.5 9.5v5M18 8v8M20.5 9.5v5M6 12h12"/></svg>'
};
const links=[['today','index.html','Today'],['nutrition','nutrition.html','Nutrition'],['training','training.html','Training']];
const nav=links.map(([id,href,label])=>'<a href="'+href+'" class="'+(page===id?'active':'')+'" '+(page===id?'aria-current="page"':'')+'>'+icon[id]+'<span>'+label+'</span></a>').join('');
const name=state.profile.profile?.displayName||'Athlete',initial=name.trim().charAt(0).toUpperCase()||'A';
const header=document.createElement('header');header.className='app-header';header.innerHTML='<div class="app-header-inner"><a class="app-wordmark" href="index.html" aria-label="Form home"><span>F</span>FORM</a><nav class="app-nav" aria-label="Primary">'+nav+'</nav><a class="profile-chip" href="index.html#settings" aria-label="Profile and backup"><span>'+initial+'</span><b>'+escapeHtml(name)+'</b></a></div>';
const mobile=document.createElement('nav');mobile.className='app-mobile-nav';mobile.setAttribute('aria-label','Primary');mobile.innerHTML=nav;
document.body.prepend(header);document.body.append(mobile);
document.querySelectorAll('nav.nav,.top>.brand,.top>.status').forEach(x=>x.remove());
function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
})();