/* ── Portfolio Méline Castillo : scripts communs à toutes les pages ── */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── MENU ── */
(function(){
  const nav=$('.nav'),burger=$('.nav-burger');
  if(burger)burger.addEventListener('click',()=>{
    const open=document.body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded',String(open));
  });
  $$('.mmenu a').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('menu-open')));
  addEventListener('keydown',e=>{if(e.key==='Escape')document.body.classList.remove('menu-open')});
  // la barre se cache quand on descend, revient quand on remonte
  let last=scrollY;
  addEventListener('scroll',()=>{
    if(!nav||document.body.classList.contains('menu-open'))return;
    const y=scrollY;
    nav.classList.toggle('hide',y>last&&y>160);
    last=y;
  },{passive:true});
})();

/* ── CURSOR ── */
(function(){
  const dot=$('#cur-dot'),ring=$('#cur-ring');
  if(!dot||!ring||matchMedia('(hover:none)').matches)return;
  let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});
  document.addEventListener('mouseleave',()=>ring.classList.add('away'));
  document.addEventListener('mouseenter',()=>ring.classList.remove('away'));
  (function tick(){
    dot.style.left=mx+'px';dot.style.top=my+'px';
    rx+=(mx-rx)*.1;ry+=(my-ry)*.1;
    ring.style.left=rx+'px';ring.style.top=ry+'px';
    const el=document.elementFromPoint(mx,my);
    const onDark=!!(el&&el.closest('#projects,#passions,#contact-outer,.case-live,.mmenu'));
    dot.classList.toggle('on-dark',onDark);ring.classList.toggle('on-dark',onDark);
    requestAnimationFrame(tick);
  })();
  $$('a,button,.about-card,.proj-dark-card,.passion-card,.job-card,.vision-card,.skills-group,input,textarea').forEach(el=>{
    el.addEventListener('mouseenter',()=>ring.classList.add('big'));
    el.addEventListener('mouseleave',()=>ring.classList.remove('big'));
  });
})();

/* ── PROGRESS ── */
(function(){
  const prog=$('#prog');if(!prog)return;
  addEventListener('scroll',()=>{
    const h=document.documentElement.scrollHeight-innerHeight;
    prog.style.height=(h>0?scrollY/h*100:0)+'%';
  },{passive:true});
})();

/* ── TICKERS ── */
['#ticker-inner','#cticker'].forEach(s=>{const t=$(s);if(t)t.innerHTML+=t.innerHTML});

/* ── HERO ── */
setTimeout(()=>$$('.clip-i').forEach(el=>el.classList.add('up')),180);
(function(){
  const p=$('.hero-photo');if(!p)return;
  addEventListener('scroll',()=>{p.style.transform=`scale(1.1) translateY(${scrollY*.22}px)`},{passive:true});
})();

/* ── REVEALS ── */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),
  {threshold:.07,rootMargin:'0px 0px -30px 0px'});
$$('.r').forEach(el=>io.observe(el));

/* ── BARRES DE COMPÉTENCES ── */
const ioSkills=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  e.target.querySelectorAll('.skill-fill').forEach(b=>{b.style.width=b.dataset.width+'%'});
  ioSkills.unobserve(e.target);
}),{threshold:.3});
$$('.skills-group').forEach(g=>ioSkills.observe(g));

/* ── TITRES : MOTS QUI MONTENT ── */
function splitWords(root,wrapCls,innerCls){
  let n=0;
  const walk=node=>{[...node.childNodes].forEach(c=>{
    if(c.nodeType===3){
      const frag=document.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach(t=>{
        if(!t)return;
        if(/^\s+$/.test(t)){frag.appendChild(document.createTextNode(t));return}
        const i=document.createElement('span');i.className=innerCls;i.style.setProperty('--wi',n++);i.textContent=t;
        if(wrapCls){const w=document.createElement('span');w.className=wrapCls;w.appendChild(i);frag.appendChild(w)}else frag.appendChild(i);
      });
      c.replaceWith(frag);
    }else if(c.nodeType===1&&c.tagName!=='BR')walk(c);
  })};
  walk(root);
}
$$('.phrase,.contact-h').forEach(h=>splitWords(h,'w','wi'));
$$('.s-label').forEach(el=>io.observe(el));

/* ── COMPTEURS ── */
const ioCount=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;ioCount.unobserve(e.target);
  const el=e.target,end=+el.dataset.n;if(reduce){el.textContent=end;return}
  const t0=performance.now(),dur=1600;
  (function step(t){const k=Math.min((t-t0)/dur,1);el.textContent=Math.round(end*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(step)})(t0);
}),{threshold:.6});
$$('.gym-stat-n').forEach(el=>{const v=el.textContent.trim();if(/^\d+$/.test(v)){el.dataset.n=v;el.textContent='0';ioCount.observe(el)}});

/* ── ANIMATIONS AU DÉFILEMENT ── */
if(window.gsap&&window.ScrollTrigger&&!reduce){
  gsap.registerPlugin(ScrollTrigger);
  if(window.Lenis){
    const lenis=new Lenis({lerp:.085,wheelMultiplier:.9});
    lenis.on('scroll',ScrollTrigger.update);
    gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
      const id=a.getAttribute('href');const t=id.length>1?$(id):0;
      e.preventDefault();lenis.scrollTo(t||0,{offset:-90,duration:1.6});
    }));
  }
  const take=sel=>gsap.utils.toArray(sel).forEach(e=>{e.classList.remove('r');e.style.transition='none'});
  take('.about-card,.proj-dark-card,.skills-group,.travels,.gym-layout,.passion-card,.jobs-grid,.visions-grid,.abroad-frame,.voyages-intro-txt,.ambi-phrase-sub,#cform,.coords,.contact-sub,.cv-bar,.case-row,.case-visual');
  const has=s=>typeof s!=='string'||!!$(s);
  const scrub=(el,from,to,start='top 92%',end='top 45%')=>{if(!el||!has(el))return;
    gsap.fromTo(el,from,{...to,ease:'none',scrollTrigger:{trigger:el,start,end,scrub:1}})};

  if($('.hero'))gsap.timeline({scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}})
    .to('.hero-right',{clipPath:'inset(10% 8% 10% 8% round 28px)',ease:'none'},0)
    .to('.hero-left',{y:-140,opacity:0,ease:'none'},0);

  gsap.utils.toArray('.about-card').forEach((c,i)=>scrub(c,{y:90+i*30,opacity:0},{y:0,opacity:1},'top 98%','top 60%'));

  ['#projects','#passions','#contact-outer','.case-live'].forEach(sel=>{
    gsap.utils.toArray(sel).forEach(s=>gsap.fromTo(s,{clipPath:'inset(7% 5% 0% 5% round 48px)'},{clipPath:'inset(0% 0% 0% 0% round 0px)',ease:'none',
      scrollTrigger:{trigger:s,start:'top bottom',end:'top 20%',scrub:1}}));
  });

  gsap.utils.toArray('.proj-dark-card').forEach((c,i)=>{
    scrub(c,{y:160,opacity:0},{y:0,opacity:1},`top ${100+i*6}%`,'top 55%');
    scrub(c.querySelector('.proj-dark-img'),{clipPath:'inset(100% 0% 0% 0%)'},{clipPath:'inset(0% 0% 0% 0%)'},`top ${95+i*6}%`,'top 50%');
    gsap.fromTo(c.querySelector('img'),{scale:1.35},{scale:1,ease:'none',scrollTrigger:{trigger:c,start:'top bottom',end:'bottom top',scrub:1}});
  });

  gsap.utils.toArray('.skills-group').forEach((g,i)=>scrub(g,{x:i%2?140:-140,opacity:0},{x:0,opacity:1},'top 98%','top 60%'));

  const tr=$('.travels');
  if(tr){
    const line=document.createElement('div');line.className='travel-line';tr.prepend(line);
    gsap.to(line,{scaleY:1,ease:'none',scrollTrigger:{trigger:tr,start:'top 75%',end:'bottom 60%',scrub:1}});
    gsap.utils.toArray('.travel-item').forEach(it=>scrub(it,{x:-60,opacity:0},{x:0,opacity:1},'top 92%','top 70%'));
  }
  scrub('.voyages-intro-txt',{y:40,opacity:0},{y:0,opacity:1});

  gsap.utils.toArray('.gym-layout').forEach(l=>{
    scrub(l.querySelector('.gym-left'),{x:-80,opacity:0},{x:0,opacity:1},'top 90%','top 55%');
    l.querySelectorAll('.gym-body').forEach(p=>{
      splitWords(p,null,'fw');
      gsap.fromTo(p.querySelectorAll('.fw'),{opacity:.12},{opacity:1,stagger:.05,ease:'none',
        scrollTrigger:{trigger:p,start:'top 85%',end:'bottom 55%',scrub:1}});
    });
  });
  gsap.utils.toArray('.passion-card').forEach((c,i)=>scrub(c,{y:120+i*40,opacity:0},{y:0,opacity:1},'top 100%','top 60%'));

  ['.job-card','.vision-card'].forEach(sel=>gsap.utils.toArray(sel).forEach((c,i)=>
    scrub(c,{rotateX:-75,y:60,opacity:0,transformOrigin:'50% 0%'},{rotateX:0,y:0,opacity:1},`top ${100+i*5}%`,'top 60%')));
  scrub('.ambi-phrase-sub',{y:30,opacity:0},{y:0,opacity:1});
  const ab=$('.abroad-frame');
  if(ab){
    scrub(ab,{x:160,opacity:0},{x:0,opacity:1},'top 98%','top 55%');
    gsap.fromTo(ab,{'--p':-1},{'--p':1,ease:'none',scrollTrigger:{trigger:ab,start:'top bottom',end:'bottom top',scrub:1}});
  }

  scrub('.contact-sub',{y:40,opacity:0},{y:0,opacity:1},'top 95%','top 70%');
  scrub('.coords',{y:40,opacity:0},{y:0,opacity:1},'top 98%','top 75%');
  scrub('#cform',{x:100,opacity:0},{x:0,opacity:1},'top 95%','top 60%');
  scrub('.cv-bar',{y:60,opacity:0},{y:0,opacity:1},'top 100%','top 80%');

  // pages projet
  const cv=$('.case-visual');
  if(cv){gsap.fromTo(cv,{clipPath:'inset(100% 0% 0% 0%)'},{clipPath:'inset(0% 0% 0% 0%)',duration:1.4,ease:'expo.out',delay:.3});
    gsap.fromTo(cv.querySelector('img'),{scale:1.25},{scale:1,duration:1.8,ease:'expo.out',delay:.3})}
  gsap.utils.toArray('.case-row').forEach(r=>scrub(r,{y:70,opacity:0},{y:0,opacity:1},'top 98%','top 70%'));

  gsap.utils.toArray('.bg-word').forEach(w=>{const sp=parseFloat(w.dataset.speed);
    gsap.fromTo(w,{xPercent:sp>0?-30:0},{xPercent:sp>0?0:-30,ease:'none',scrollTrigger:{trigger:w.parentElement,start:'top bottom',end:'bottom top',scrub:1}})});

  addEventListener('load',()=>ScrollTrigger.refresh());
}

/* ── SHOWREEL ── */
(function(){
  const v=$('#reel-video'),b=$('#reel-sound');if(!v)return;
  new IntersectionObserver(es=>es.forEach(e=>{e.isIntersecting?v.play().catch(()=>{}):v.pause()}),{threshold:.4}).observe(v);
  if(b)b.addEventListener('click',()=>{v.muted=!v.muted;if(!v.muted)v.play().catch(()=>{});b.setAttribute('aria-pressed',String(!v.muted));b.textContent=v.muted?'Activer le son':'Couper le son'});
})();

/* ── FORMULAIRE DE CONTACT ── */
(function(){
  const f=$('#cform');if(!f)return;
  f.addEventListener('submit',async function(e){
    e.preventDefault();
    const n=$('#fn').value.trim(),em=$('#fe').value.trim(),m=$('#fm').value.trim(),key=$('#w3f-key').value;
    const okEl=$('#ok'),errEl=$('#err'),btn=$('#send-btn');
    if(!n||!em||!m)return;
    okEl.style.display=errEl.style.display='none';
    btn.textContent='…';btn.disabled=true;
    try{
      const res=await fetch('https://api.web3forms.com/submit',{
        method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},
        body:JSON.stringify({access_key:key,name:n,email:em,message:m,subject:'Message de '+n+' — Portfolio Méline Castillo'})
      });
      const data=await res.json();
      if(data.success){okEl.style.display='block';f.querySelectorAll('input,textarea').forEach(el=>{if(el.type!=='hidden')el.value=''})}
      else{errEl.textContent=data.message||'Une erreur est survenue, réessayez.';errEl.style.display='block'}
    }catch{errEl.textContent='Erreur réseau, réessayez.';errEl.style.display='block'}
    btn.textContent='Envoyer';btn.disabled=false;
  });
})();
