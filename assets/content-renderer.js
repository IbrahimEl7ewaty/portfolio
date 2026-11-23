(()=>{'use strict';
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k),get=(o,p)=>p.split('.').reduce((v,k)=>v&&own(v,k)?v[k]:'',o);
const local=p=>typeof p==='string'&&/^(?:assets|content\/images|certificates)\/[A-Za-z0-9_./-]+$/.test(p)&&!p.includes('..');
const link=p=>typeof p==='string'&&(/^(?:https:\/\/|mailto:|tel:|#)/i.test(p)||/^[A-Za-z0-9_./-]+$/.test(p)&&!p.includes('..'))&&!/[\u0000-\u001f]/.test(p);
function render(t,d){
 if(!d||d.enabled===false)return document.createDocumentFragment();
 const wrap=document.createElement('template');wrap.innerHTML=t.html;
 const walker=document.createTreeWalker(wrap.content,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_COMMENT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 for(const n of nodes){
  if(n.nodeType===Node.COMMENT_NODE){
   if(n.data.startsWith('list:')){const name=n.data.slice(5),frag=document.createDocumentFragment();for(const item of (d[name]||[])){const variants=t.lists[name],index=Number(item._template||0);if(!variants||!Number.isInteger(index)||index<0||index>=variants.length)throw Error('Invalid item template');frag.append(render(variants[index],item));}n.replaceWith(frag);}
   else if(n.data.startsWith('icon:')){const [,key,builtin]=n.data.split(':');const icon=d[key];if(icon?.image){if(!local(icon.image))throw Error('Invalid image path');const img=document.createElement('img');img.src=icon.image;img.alt=icon.alt||'';img.width=40;img.height=42;img.loading='lazy';n.replaceWith(img);}else{const svg=document.createElement('template');svg.innerHTML=window.PORTFOLIO_ICONS[builtin]||'';n.replaceWith(svg.content);}}
  }else n.textContent=n.textContent.replace(/\{\{([^}]+)\}\}/g,(_,p)=>String(get(d,p)??''));
 }
 for(const el of wrap.content.querySelectorAll('*'))for(const attr of [...el.attributes])if(attr.value.includes('{{')){
  const value=attr.value.replace(/\{\{([^}]+)\}\}/g,(_,p)=>String(get(d,p)??''));
  if(attr.name==='href'&&!link(value))throw Error('Invalid link');
  if(attr.name==='src'&&!local(value))throw Error('Invalid image');
  if(attr.name==='srcset'&&value&&!value.split(',').every(x=>local(x.trim().split(/\s+/)[0])))throw Error('Invalid responsive image');
  if(value||!['srcset','sizes'].includes(attr.name))el.setAttribute(attr.name,value);else el.removeAttribute(attr.name);
 }
 return wrap.content;
}
async function start(){
 try{
  const response=await fetch('content/site.json',{cache:'no-cache'});if(!response.ok)throw Error('Content unavailable');const c=await response.json();
  if(c.schemaVersion!==1||!c.sections||!Array.isArray(c.sectionOrder))throw Error('Unsupported content');
  const templates=window.PORTFOLIO_TEMPLATES,frag=document.createDocumentFragment();
  const skip=document.createElement('a');skip.className='skip';skip.href='#about';skip.textContent='Skip to content';frag.append(skip);const bar=document.createElement('div');bar.id='sprog';frag.append(bar);
  frag.append(render(templates.header,c.sections.header));const main=document.createElement('main');for(const name of c.sectionOrder){if(!own(templates,name)||['header','footer'].includes(name))throw Error('Invalid section');main.append(render(templates[name],c.sections[name]));}frag.append(main,render(templates.footer,c.sections.footer));
  document.title=c.meta.title;document.querySelector('meta[name=description]').content=c.meta.description;
  document.body.prepend(frag);window.PORTFOLIO_CONTENT=c;document.documentElement.dataset.contentReady='true';const script=document.createElement('script');script.src='assets/site.js';document.body.append(script);
 }catch(error){const p=document.createElement('p');p.style.cssText='padding:40px;color:white';p.textContent='The portfolio could not load. Please refresh or open the resume PDF. ';const a=document.createElement('a');a.href='Ibrahim-ElHewaty-CV.pdf';a.textContent='Resume PDF';p.append(a);document.body.prepend(p);console.error('Portfolio content error:',error.message);}
}
start();})();
