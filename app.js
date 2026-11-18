const demo=[
{id:1,title:'Stream Offline — Ghost',cat:'Layouts',style:'ghost',text:'STREAM<br>OFFLINE',emoji:'👻'},
{id:2,title:'Stream começando — Bee',cat:'Layouts',style:'bee',text:'STREAM<br>INICIANDO',emoji:'🐝'},
{id:3,title:'Stream Offline — Horror',cat:'Layouts',style:'horror',text:'STREAM<br>OFFLINE',emoji:'💀'},
{id:4,title:'Pack de emotes',cat:'Emotes',style:'emotes',text:'',emoji:''},
{id:5,title:'Stream iniciando — Cyber',cat:'Layouts',style:'cyber',text:'STREAM<br>INICIANDO',emoji:'🎧'},
{id:6,title:'Identidade Ghost Studio',cat:'Logotipos',style:'logo',text:'GHOST<br>STUDIO',emoji:'👻'}
];
let works=JSON.parse(localStorage.getItem('ghostfolio.works')||'null')||demo,filter='Todos',active=0;
const filters=document.querySelector('#filters'),gallery=document.querySelector('#gallery');
function escapeHtml(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function save(){localStorage.setItem('ghostfolio.works',JSON.stringify(works));}
function renderFilters(){const cats=['Todos',...new Set(works.map(x=>x.cat))];filters.innerHTML=cats.map(c=>`<button class="${filter===c?'active':''}" data-cat="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join('');filters.querySelectorAll('button').forEach(b=>b.onclick=()=>{filter=b.dataset.cat;renderFilters();renderGallery()})}
function renderGallery(){const items=works.filter(x=>filter==='Todos'||x.cat===filter);gallery.innerHTML=items.map(x=>`<article class="art ${x.style||'uploaded'} ${x.data?'uploaded':''}" data-id="${x.id}" ${x.data?`style="background-image:url('${x.data}')"`:''}><span class="emoji">${x.data?'':x.style==='emotes'?'<span class="emote-row"><span>👻</span><span>🥰</span><span>😠</span></span>':x.emoji||''}</span>${x.text?`<span class="arttext">${x.text}</span>`:''}<small>${escapeHtml(x.title)}</small></article>`).join('');gallery.querySelectorAll('.art').forEach((el,i)=>el.onclick=()=>openModal(items[i]));}
function render(){renderFilters();renderGallery()}render();
const modal=document.querySelector('#modal');function openModal(x){active=works.findIndex(y=>y.id===x.id);showModal()}
function showModal(){const x=works[active];if(!x)return;const img=modal.querySelector('img');if(x.data){img.src=x.data;img.style.display='block'}else{img.style.display='none'}modal.querySelector('p').textContent=x.title;modal.classList.add('show')}
function step(n){active=(active+n+works.length)%works.length;showModal()}
modal.querySelector('.close').onclick=()=>modal.classList.remove('show');modal.querySelector('.prev').onclick=()=>step(-1);modal.querySelector('.next').onclick=()=>step(1);modal.onclick=e=>{if(e.target===modal)modal.classList.remove('show')};document.onkeydown=e=>{if(e.key==='Escape')modal.classList.remove('show');if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1)};
const editor=document.querySelector('#editor');document.querySelector('#editBtn').onclick=()=>editor.classList.add('open');document.querySelector('#menu').onclick=()=>editor.classList.add('open');document.querySelector('.closeEditor').onclick=()=>editor.classList.remove('open');document.querySelector('#done').onclick=()=>editor.classList.remove('open');
const fields=[['inName','name'],['inHandle','handle'],['inRole','role'],['inBio','bio']];for(const [input,target] of fields){const el=document.getElementById(input),dest=document.getElementById(target);el.value=localStorage.getItem('ghostfolio.'+input)||el.value;dest.textContent=input==='inHandle'?'@'+el.value:el.value;el.addEventListener('input',()=>{dest.textContent=input==='inHandle'?'@'+el.value:el.value;localStorage.setItem('ghostfolio.'+input,el.value)})}
document.querySelector('#files').onchange=async e=>{for(const file of e.target.files){if(!file.type.startsWith('image/'))continue;if(file.size>5*1024*1024){alert(`${file.name}: limite local de 5 MB.`);continue}const data=await new Promise(resolve=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.readAsDataURL(file)});works.push({id:Date.now()+Math.random(),title:file.name,cat:'Meus trabalhos',style:'uploaded',data})}try{save();render()}catch{alert('Armazenamento local cheio. Use imagens menores.')}e.target.value=''};
document.querySelector('#reset').onclick=()=>{if(!confirm('Restaurar dados da demonstração e apagar suas alterações locais?'))return;localStorage.clear();location.reload()};
