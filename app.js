const demo = [
  {id:1,title:'Stream Offline — Ghost',cat:'Layouts',style:'ghost',text:'STREAM<br>OFFLINE',emoji:'👻'},
  {id:2,title:'Stream começando — Bee',cat:'Layouts',style:'bee',text:'STREAM<br>INICIANDO',emoji:'🐝'},
  {id:3,title:'Stream Offline — Horror',cat:'Layouts',style:'horror',text:'STREAM<br>OFFLINE',emoji:'💀'},
  {id:4,title:'Pack de emotes',cat:'Emotes',style:'emotes',text:'',emoji:''},
  {id:5,title:'Stream iniciando — Cyber',cat:'Layouts',style:'cyber',text:'STREAM<br>INICIANDO',emoji:'🎧'},
  {id:6,title:'Identidade Ghost Studio',cat:'Logotipos',style:'logo',text:'GHOST<br>STUDIO',emoji:'👻'}
];
const baseProfile = window.GHOSTFOLIO_PROFILE || {};
const profile = {...baseProfile, socials:{...(baseProfile.socials || {})}};
const savedProfile = JSON.parse(localStorage.getItem('ghostfolio.profile') || 'null');
if (savedProfile) Object.assign(profile, savedProfile, {socials:{...profile.socials,...(savedProfile.socials || {})}});
let works = JSON.parse(localStorage.getItem('ghostfolio.works') || 'null') || demo;
let filter = 'Todos', active = 0;
const filters = document.querySelector('#filters'), gallery = document.querySelector('#gallery');
const modal = document.querySelector('#modal'), editor = document.querySelector('#editor');
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function persistProfile(){localStorage.setItem('ghostfolio.profile', JSON.stringify(profile));}
function updateProfile(){
  document.querySelector('#name').textContent = profile.name;
  document.querySelector('#handle').textContent = profile.handle ? '@' + profile.handle.replace(/^@/, '') : '';
  document.querySelector('#role').textContent = profile.role;
  document.querySelector('#bio').textContent = profile.bio;
  document.querySelector('#footerName').textContent = profile.name;
  const email = profile.socials.email.trim();
  const emailHref = email ? (email.startsWith('mailto:') ? email : `mailto:${email}`) : '';
  const quote = document.querySelector('#quote');
  quote.href = emailHref ? `${emailHref}?subject=Or%C3%A7amento%20Ghostfolio` : '#';
  quote.classList.toggle('disabled', !emailHref);
  for (const id of ['twitch','instagram','tiktok','discord','email']) {
    const link = document.querySelector(`[data-social="${id}"]`);
    const value = (profile.socials[id] || '').trim();
    const href = id === 'email' ? (value ? (value.startsWith('mailto:') ? value : `mailto:${value}`) : '') : value;
    const safe = id === 'email' ? href : (/^https:\/\//i.test(href) ? href : '');
    if (safe) {
      link.href = safe;
      link.classList.remove('not-configured');
      link.removeAttribute('aria-disabled');
      link.removeAttribute('title');
    } else {
      link.removeAttribute('href');
      link.classList.add('not-configured');
      link.setAttribute('aria-disabled','true');
      link.title = 'Adicione seu link no editor do portfólio';
    }
  }
}
function renderFilters(){
  const categories = ['Todos', ...new Set(works.map(item => item.cat))];
  filters.innerHTML = categories.map(cat => `<button class="${filter===cat?'active':''}" data-cat="${escapeHtml(cat)}">${escapeHtml(cat)}</button>`).join('');
  filters.querySelectorAll('button').forEach(button => button.onclick = () => {filter=button.dataset.cat;renderFilters();renderGallery()});
}
function renderGallery(){
  const items = works.filter(item => filter==='Todos' || item.cat===filter);
  gallery.innerHTML = items.map(item => `<article class="art ${item.style||'uploaded'} ${item.data?'uploaded':''}" data-id="${item.id}" ${item.data?`style="background-image:url('${item.data}')"`:''}><span class="emoji">${item.data?'':item.style==='emotes'?'<span class="emote-row"><span>👻</span><span>🥰</span><span>😠</span></span>':item.emoji||''}</span>${item.text?`<span class="arttext">${item.text}</span>`:''}<small>${escapeHtml(item.title)}</small></article>`).join('');
  gallery.querySelectorAll('.art').forEach((element,index) => element.onclick = () => openModal(items[index]));
}
function render(){renderFilters();renderGallery()}
function openModal(item){active=works.findIndex(work=>work.id===item.id);showModal()}
function showModal(){
  const item=works[active]; if(!item)return;
  const image=modal.querySelector('img');
  if(item.data){image.src=item.data;image.style.display='block'}else{image.removeAttribute('src');image.style.display='none'}
  modal.querySelector('p').textContent=item.title;modal.classList.add('show');
}
function step(direction){active=(active+direction+works.length)%works.length;showModal()}
modal.querySelector('.close').onclick=()=>modal.classList.remove('show');
modal.querySelector('.prev').onclick=()=>step(-1);modal.querySelector('.next').onclick=()=>step(1);
modal.onclick=event=>{if(event.target===modal)modal.classList.remove('show')};
document.onkeydown=event=>{if(event.key==='Escape')modal.classList.remove('show');if(event.key==='ArrowLeft'&&modal.classList.contains('show'))step(-1);if(event.key==='ArrowRight'&&modal.classList.contains('show'))step(1)};
function bindText(inputId, key){
  const input=document.getElementById(inputId);input.value=profile[key]||'';
  input.addEventListener('input',()=>{profile[key]=input.value;persistProfile();updateProfile()});
}
function bindSocial(inputId, key){
  const input=document.getElementById(inputId);input.value=profile.socials[key]||'';
  input.addEventListener('input',()=>{profile.socials[key]=input.value;persistProfile();updateProfile()});
}
for(const [input,key] of [['inName','name'],['inHandle','handle'],['inRole','role'],['inBio','bio']])bindText(input,key);
for(const [input,key] of [['inTwitch','twitch'],['inInstagram','instagram'],['inTikTok','tiktok'],['inDiscord','discord'],['inEmail','email']])bindSocial(input,key);
updateProfile();render();
document.querySelector('#editBtn').onclick=()=>editor.classList.add('open');
document.querySelector('#menu').onclick=()=>editor.classList.add('open');
document.querySelector('.closeEditor').onclick=()=>editor.classList.remove('open');
document.querySelector('#done').onclick=()=>editor.classList.remove('open');
document.querySelector('#files').onchange=async event=>{
  for(const file of event.target.files){
    if(!file.type.startsWith('image/'))continue;
    if(file.size>5*1024*1024){alert(`${file.name}: limite local de 5 MB.`);continue}
    const data=await new Promise(resolve=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.readAsDataURL(file)});
    works.push({id:Date.now()+Math.random(),title:file.name,cat:'Meus trabalhos',style:'uploaded',data});
  }
  try{localStorage.setItem('ghostfolio.works',JSON.stringify(works));render()}catch{alert('Armazenamento local cheio. Use imagens menores.')}
  event.target.value='';
};
document.querySelector('#reset').onclick=()=>{
  if(!confirm('Restaurar dados da demonstração e apagar suas alterações locais?'))return;
  localStorage.removeItem('ghostfolio.works');localStorage.removeItem('ghostfolio.profile');location.reload();
};
