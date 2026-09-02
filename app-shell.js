(()=>{'use strict';
const KEY='form.tracker.v2',path=location.pathname.split('/').pop()||'index.html',page=path.startsWith('nutrition')?'nutrition':path.startsWith('training')?'training':'home';
let state={};try{state=JSON.parse(localStorage.getItem(KEY)||'{}')}catch{}
document.body.classList.add(state.profile?'has-app-shell':'setup-mode','page-'+page);
if(!state.profile)return;
const icons={
 home:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10M9.5 20v-6h5v6"/></svg>',
 nutrition:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v7M4.5 4v4.5A2.5 2.5 0 0 0 7 11v9M9.5 4v4.5A2.5 2.5 0 0 1 7 11M16 4c2.4 1.2 3.5 3.3 3.5 6.2 0 2.2-1.2 3.8-3.5 4.3V20M16 4v10.5"/></svg>',
 training:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8v8M3.5 9.5v5M18 8v8M20.5 9.5v5M6 12h12"/></svg>'
};
const links=[['home','index.html','Dashboard'],['nutrition','nutrition.html','Nutrition'],['training','training.html','Training']];
const nav=mobile=>links.map(([id,href,label])=>'<a href="'+href+'" class="'+(page===id?'active':'')+'" '+(page===id?'aria-current="page"':'')+'>'+icons[id]+'<span>'+label+'</span></a>').join('');
const name=state.profile.profile?.displayName||'Athlete',goal=state.profile.goals?.primary||'Personal program';
const top=document.createElement('header');top.className='app-topbar';top.innerHTML='<div class="app-topbar-inner"><a class="app-logo" href="index.html"><span class="app-logo-mark">F</span><span class="app-logo-copy"><b>FORM</b><span>ATHLETE OS</span></span></a><nav class="app-nav" aria-label="Primary">'+nav(false)+'</nav><div class="app-athlete"><span class="app-athlete-dot"></span><span class="app-athlete-copy"><b></b><span></span></span></div></div>';top.querySelector('.app-athlete-copy b').textContent=name;top.querySelector('.app-athlete-copy span').textContent=goal;document.body.prepend(top);
const mobile=document.createElement('nav');mobile.className='app-mobile-nav';mobile.setAttribute('aria-label','Mobile navigation');mobile.innerHTML=nav(true);document.body.append(mobile);
document.querySelectorAll('nav.nav').forEach(x=>x.remove());
if(page==='home'){
 const hero=document.querySelector('.hero'),nutrition=state.profile.nutritionPlan?.targets||{},training=state.profile.trainingPlan||{},goalData=state.profile.goals||{};
 if(hero){const strip=document.createElement('div');strip.className='athlete-strip';const items=[['Objective',goal],['Daily fuel',(nutrition.calories?.min??'—')+'-'+(nutrition.calories?.max??'—')+' kcal'],['Program',training.name||'Custom plan'],['Checkpoint',goalData.checkpointDate||'Ongoing']];for(const [label,value] of items){const item=document.createElement('div');item.className='athlete-strip-item';const s=document.createElement('span'),b=document.createElement('b');s.textContent=label;b.textContent=value;item.append(s,b);strip.append(item)}hero.append(strip)}
}
})();
