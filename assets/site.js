const menu=document.querySelector('.menu');const nav=document.querySelector('#navigation');if(menu&&nav){menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open)});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open')}));document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open')}});}const bar=document.querySelector('#sprog');function progress(){const total=document.documentElement.scrollHeight-innerHeight;bar.style.width=(total>0?100*scrollY/total:0)+'%'}addEventListener('scroll',progress,{passive:true});progress();

const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');if(!reduceMotion.matches&&'IntersectionObserver' in window){document.documentElement.classList.add('motion-ready');const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}})},{threshold:.08});document.querySelectorAll('[data-reveal]').forEach(el=>observer.observe(el));reduceMotion.addEventListener('change',e=>{if(e.matches){document.documentElement.classList.remove('motion-ready');observer.disconnect()}})}
(()=>{const canvas=document.querySelector('.hero-network');if(!canvas)return;const ctx=canvas.getContext('2d');if(!ctx)return;const hero=canvas.closest('.hero');const reduced=matchMedia('(prefers-reduced-motion: reduce)');const lightweight=innerWidth<700||(navigator.hardwareConcurrency||8)<=4||navigator.connection?.saveData;let w=0,h=0,points=[],frame=0,last=0,visible=true;function size(){w=hero.clientWidth;h=hero.clientHeight;const d=Math.min(devicePixelRatio||1,1.5);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);const count=w<700?10:28;points=Array.from({length:count},(_,i)=>({x:((i*173+31)%997)/997*w,y:((i*239+97)%991)/991*h,vx:Math.sin(i*2.3)*.18,vy:Math.cos(i*1.7)*.18}));draw(false)}function draw(move){ctx.clearRect(0,0,w,h);for(let i=0;i<points.length;i++){const p=points[i];if(move){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1}for(let j=i+1;j<points.length;j++){const q=points[j],dist=Math.hypot(p.x-q.x,p.y-q.y),range=w<700?135:180;if(dist<range){ctx.strokeStyle=`rgba(185,211,201,${.18*(1-dist/range)})`;ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke()}}ctx.fillStyle='rgba(196,215,207,.42)';ctx.beginPath();ctx.arc(p.x,p.y,1.8,0,Math.PI*2);ctx.fill()}}function tick(t){frame=0;if(reduced.matches||lightweight||!visible||document.hidden)return;if(t-last>66){draw(true);last=t}frame=requestAnimationFrame(tick)}function sync(){if(frame)cancelAnimationFrame(frame);frame=0;if(reduced.matches||lightweight)draw(false);else if(visible&&!document.hidden)frame=requestAnimationFrame(tick)}new ResizeObserver(size).observe(hero);new IntersectionObserver(e=>{visible=e[0].isIntersecting;sync()}).observe(hero);document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);size();sync()})();


(()=>{
 const form=document.querySelector('.contact-form');
 const status=document.querySelector('#form-status');
 if(!form||!status)return;
 const button=form.querySelector('button[type="submit"]');
 let pending=false;button.disabled=false;button.textContent='Send message ↗';
 function notice(state,text){status.dataset.state=state;status.textContent=text;}
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(pending||!form.reportValidity())return;
  const data=new FormData(form);
  if(String(data.get('botcheck')||'').trim()){
   notice('error','Your message could not be sent. Please use the email link below.');return;
  }
  const name=String(data.get('name')||'').trim();
  const email=String(data.get('email')||'').trim();
  const message=String(data.get('message')||'').trim();
  if(!name||!email||!message){notice('error','Please enter your name, email and message.');return;}
  const id=Date.now().toString(36)+'-'+(crypto.randomUUID?crypto.randomUUID().slice(0,8):Math.random().toString(36).slice(2,10));
  const payload={access_key:data.get('access_key'),name,email,message,replyto:email,subject:'Portfolio message from '+name.replace(/[\r\n]/g,' ').slice(0,70)+' ['+id+']',from_name:'Ibrahim El-Hewaty | Portfolio',submission_id:id,botcheck:''};
  pending=true;button.disabled=true;button.textContent='Sending...';form.setAttribute('aria-busy','true');notice('pending','Sending your message securely...');
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),20000);
  try{
   const response=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(payload),signal:controller.signal});
   const result=await response.json();
   if(!response.ok||result.success!==true)throw new Error('not-accepted');
   form.reset();notice('success','Thank you. Your message has been accepted. Reference: '+id+'.');
  }catch(error){
   notice('error',error.name==='AbortError'?'The request timed out, so delivery is unconfirmed. Your message is still here. Please email me directly to avoid a duplicate.':'Your message could not be confirmed. Your text is still here. Please try again later or email me directly.');
  }finally{
   clearTimeout(timer);pending=false;button.disabled=false;button.textContent='Send message ↗';form.removeAttribute('aria-busy');
  }
 });
})();

(()=>{const state=window.PORTFOLIO_STATUS==='employed'?'employed':'open';document.querySelectorAll('[data-availability]').forEach(b=>{b.textContent=state==='employed'?'Currently employed':'Open to work';b.dataset.state=state})})();
