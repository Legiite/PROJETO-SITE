import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Data from './Data';
import Header from './components/Header';
import SocialLinks from './components/SocialLinks';
import Portfolio from './components/Portfolio';
import Editor from './components/Editor';

const PROFILE_KEY='ghostfolio.react.profile', WORKS_KEY='ghostfolio.react.works';
function readJson(key,fallback){try{return JSON.parse(localStorage.getItem(key))||fallback}catch{return fallback}}
function normalizeWork(work){return {...work,category:work.category||work.cat||'Trabalhos',text:(work.text||'').replace(/<br\s*\/?\s*>/gi,'\n')}}

export default function App(){
  const [profile,setProfile]=useState(()=>{
    const saved=readJson(PROFILE_KEY,null)||readJson('ghostfolio.profile',{});
    const migrated={...saved};
    for(const key of ['name','handle','role','bio']){
      const legacy=localStorage.getItem(`ghostfolio.in${key[0].toUpperCase()}${key.slice(1)}`);
      if(!migrated[key]&&legacy)migrated[key]=legacy;
    }
    return {...Data,...migrated,socials:{...Data.socials,...(migrated.socials||{})},socialNames:{...Data.socialNames,...(migrated.socialNames||{})}};
  });
  const [works,setWorks]=useState(()=>{
    const previous=readJson('ghostfolio.works',null);
    return (readJson(WORKS_KEY,previous||Data.works)).map(normalizeWork);
  });
  const [filter,setFilter]=useState('Todos');
  const [editorOpen,setEditorOpen]=useState(false);
  const [selected,setSelected]=useState(null);
  const [editingWork,setEditingWork]=useState(false);
  const avatarInput=useRef(null);

  useEffect(()=>{document.title=profile.name?`Ghostfolio — ${profile.name}`:Data.WebsiteTitle;localStorage.setItem(PROFILE_KEY,JSON.stringify(profile))},[profile]);
  useEffect(()=>{try{localStorage.setItem(WORKS_KEY,JSON.stringify(works))}catch{console.warn('O limite de armazenamento local foi atingido.')}},[works]);
  useEffect(()=>{const keydown=event=>{if(event.key==='Escape')setSelected(null);if(selected&&event.key==='ArrowRight')nextArt(1);if(selected&&event.key==='ArrowLeft')nextArt(-1)};window.addEventListener('keydown',keydown);return()=>window.removeEventListener('keydown',keydown)},[selected,works]);

  function nextArt(direction){const index=works.findIndex(work=>work.id===selected?.id);if(index<0)return;setEditingWork(false);setSelected(works[(index+direction+works.length)%works.length])}
  async function addFiles(event){
    const additions=[];
    for(const file of event.target.files){
      if(!file.type.startsWith('image/'))continue;
      if(file.size>3*1024*1024){alert(`${file.name}: limite local de 3 MB nesta demonstração.`);continue}
      const data=await new Promise(resolve=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.readAsDataURL(file)});
      additions.push({id:`upload-${Date.now()}-${Math.random()}`,title:file.name,category:'Meus trabalhos',style:'uploaded',data,text:'',emoji:''});
    }
    setWorks(current=>[...current,...additions]);event.target.value='';
  }
  async function setAvatar(event){
    const file=event.target.files?.[0];if(!file)return;
    if(!file.type.startsWith('image/')){alert('Escolha um arquivo de imagem.');event.target.value='';return}
    if(file.size>1024*1024){alert('A foto de perfil deve ter até 1 MB nesta demonstração.');event.target.value='';return}
    const data=await new Promise(resolve=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.readAsDataURL(file)});
    setProfile(current=>({...current,avatar:data}));event.target.value='';
  }
  function updateSelected(patch){
    setWorks(current=>current.map(work=>work.id===selected.id?{...work,...patch}:work));
    setSelected(current=>({...current,...patch}));
  }
  async function replaceSelected(event){
    const file=event.target.files?.[0];if(!file)return;
    if(!file.type.startsWith('image/')){alert('Escolha um arquivo de imagem.');event.target.value='';return}
    if(file.size>3*1024*1024){alert('A imagem deve ter até 3 MB nesta demonstração.');event.target.value='';return}
    const data=await new Promise(resolve=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.readAsDataURL(file)});
    updateSelected({data,style:'uploaded',text:'',emoji:''});event.target.value='';
  }
  function deleteSelected(){if(!confirm(`Excluir “${selected.title}” da galeria?`))return;setWorks(current=>current.filter(work=>work.id!==selected.id));setSelected(null);setEditingWork(false)}
  function reset(){if(!confirm('Restaurar a demonstração e apagar as alterações salvas neste navegador?'))return;localStorage.removeItem(PROFILE_KEY);localStorage.removeItem(WORKS_KEY);localStorage.removeItem('ghostfolio.profile');localStorage.removeItem('ghostfolio.works');location.reload()}

  return <div className="App">
    <Header onEdit={()=>setEditorOpen(true)} brand={Data.HeaderTitle}/>
    <main>
      <section className="hero" id="profile">
        <button className="avatar" type="button" onClick={()=>avatarInput.current?.click()} aria-label="Adicionar ou trocar foto de perfil" title="Clique para trocar a foto">
          {profile.avatar?<img src={profile.avatar} alt="Foto de perfil"/>:<><span>👻<i>♫</i></span><small>Adicionar foto</small></>}
          {profile.avatar&&<small>Trocar foto</small>}
        </button>
        <input ref={avatarInput} className="visually-hidden" type="file" accept="image/png,image/jpeg,image/webp" onChange={setAvatar}/>
        <h1>{profile.name}</h1><a className="handle">@{(profile.handle||'').replace(/^@/,'')}</a>
        <p className="role">{profile.role}</p><p className="bio">{profile.bio}</p>
        <SocialLinks socials={profile.socials} socialNames={profile.socialNames}/>
        <p className="open"><i/> {profile.commissionText}</p>
        <a className={`quote ${profile.socials.email?'':'disabled'}`} href={profile.socials.email?`mailto:${profile.socials.email.replace(/^mailto:/,'')}?subject=Or%C3%A7amento%20Ghostfolio`:undefined}>✎　Solicitar orçamento</a>
      </section>
      <Portfolio works={works} filter={filter} onFilter={setFilter} onOpen={work=>{setSelected(work);setEditingWork(false)}} onAdd={addFiles}/>
    </main>
    <footer>© 2026 {profile.name} · <b>{Data.FooterText}</b></footer>
    <AnimatePresence>{selected&&<motion.div className="modal show" role="dialog" aria-modal="true" aria-label={selected.title} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={event=>event.target===event.currentTarget&&setSelected(null)}>
      <button className="close" aria-label="Fechar" onClick={()=>setSelected(null)}>×</button>
      <button className="prev" aria-label="Arte anterior" onClick={()=>nextArt(-1)}>‹</button>
      <div className={`modal-art art ${selected.style||'uploaded'} ${selected.data?'has-upload':''}`} style={selected.data?{backgroundImage:`url("${selected.data}")`}:undefined}>
        {selected.data?<img src={selected.data} alt={selected.title}/>:<><span className="emoji">{selected.emoji}</span>{selected.text&&<span className="arttext">{selected.text.split('\n').map(line=><span key={line}>{line}</span>)}</span>}</>}
      </div>
      <div className="art-modal-caption"><p>{selected.title}</p><button onClick={()=>setEditingWork(current=>!current)}>{editingWork?'Fechar edição':'✎ Editar arte'}</button></div>
      {editingWork&&<div className="work-editor">
        <label>Título<input value={selected.title} onChange={event=>updateSelected({title:event.target.value})}/></label>
        <label>Categoria<input value={selected.category||''} onChange={event=>updateSelected({category:event.target.value||'Trabalhos'})}/></label>
        <label className="replace-image">Substituir imagem<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={replaceSelected}/></label>
        <button className="delete-work" onClick={deleteSelected}>Excluir arte</button>
      </div>}
      <button className="next" aria-label="Próxima arte" onClick={()=>nextArt(1)}>›</button>
    </motion.div>}</AnimatePresence>
    <Editor open={editorOpen} onClose={()=>setEditorOpen(false)} profile={profile} setProfile={setProfile} onFiles={addFiles} onAvatar={setAvatar} onReset={reset}/>
  </div>;
}
