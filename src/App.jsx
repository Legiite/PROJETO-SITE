import { useEffect, useState } from 'react';
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
    return {...Data,...migrated,socials:{...Data.socials,...(migrated.socials||{})}};
  });
  const [works,setWorks]=useState(()=>{
    const previous=readJson('ghostfolio.works',null);
    return (readJson(WORKS_KEY,previous||Data.works)).map(normalizeWork);
  });
  const [filter,setFilter]=useState('Todos');
  const [editorOpen,setEditorOpen]=useState(false);
  const [selected,setSelected]=useState(null);

  useEffect(()=>{document.title=profile.name?`Ghostfolio — ${profile.name}`:Data.WebsiteTitle;localStorage.setItem(PROFILE_KEY,JSON.stringify(profile))},[profile]);
  useEffect(()=>{try{localStorage.setItem(WORKS_KEY,JSON.stringify(works))}catch{console.warn('O limite de armazenamento local foi atingido.')}},[works]);
  useEffect(()=>{const keydown=event=>{if(event.key==='Escape')setSelected(null);if(selected&&event.key==='ArrowRight')nextArt(1);if(selected&&event.key==='ArrowLeft')nextArt(-1)};window.addEventListener('keydown',keydown);return()=>window.removeEventListener('keydown',keydown)},[selected,works]);

  function nextArt(direction){const index=works.findIndex(work=>work.id===selected?.id);if(index<0)return;setSelected(works[(index+direction+works.length)%works.length])}
  async function addFiles(event){
    const additions=[];
    for(const file of event.target.files){
      if(!file.type.startsWith('image/'))continue;
      if(file.size>5*1024*1024){alert(`${file.name}: limite local de 5 MB.`);continue}
      const data=await new Promise(resolve=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.readAsDataURL(file)});
      additions.push({id:`upload-${Date.now()}-${Math.random()}`,title:file.name,category:'Meus trabalhos',style:'uploaded',data,text:'',emoji:''});
    }
    setWorks(current=>[...current,...additions]);event.target.value='';
  }
  function reset(){if(!confirm('Restaurar a demonstração e apagar as alterações salvas neste navegador?'))return;localStorage.removeItem(PROFILE_KEY);localStorage.removeItem(WORKS_KEY);localStorage.removeItem('ghostfolio.profile');localStorage.removeItem('ghostfolio.works');location.reload()}

  return <div className="App">
    <Header onEdit={()=>setEditorOpen(true)} brand={Data.HeaderTitle}/>
    <main>
      <section className="hero" id="profile">
        <div className="avatar">👻<i>♫</i></div>
        <h1>{profile.name}</h1><a className="handle">@{(profile.handle||'').replace(/^@/,'')}</a>
        <p className="role">{profile.role}</p><p className="bio">{profile.bio}</p>
        <SocialLinks socials={profile.socials}/>
        <p className="open"><i/> {profile.commissionText}</p>
        <a className={`quote ${profile.socials.email?'':'disabled'}`} href={profile.socials.email?`mailto:${profile.socials.email.replace(/^mailto:/,'')}?subject=Or%C3%A7amento%20Ghostfolio`:undefined}>✎　Solicitar orçamento</a>
      </section>
      <Portfolio works={works} filter={filter} onFilter={setFilter} onOpen={setSelected}/>
    </main>
    <footer>© 2026 {profile.name} · <b>{Data.FooterText}</b></footer>
    <AnimatePresence>{selected&&<motion.div className="modal show" role="dialog" aria-modal="true" aria-label={selected.title} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={event=>event.target===event.currentTarget&&setSelected(null)}>
      <button className="close" aria-label="Fechar" onClick={()=>setSelected(null)}>×</button>
      <button className="prev" aria-label="Arte anterior" onClick={()=>nextArt(-1)}>‹</button>
      <div className={`modal-art art ${selected.style||'uploaded'} ${selected.data?'has-upload':''}`} style={selected.data?{backgroundImage:`url("${selected.data}")`}:undefined}>
        {selected.data?<img src={selected.data} alt={selected.title}/>:<><span className="emoji">{selected.emoji}</span>{selected.text&&<span className="arttext">{selected.text.split('\n').map(line=><span key={line}>{line}</span>)}</span>}</>}
      </div>
      <p>{selected.title}</p><button className="next" aria-label="Próxima arte" onClick={()=>nextArt(1)}>›</button>
    </motion.div>}</AnimatePresence>
    <Editor open={editorOpen} onClose={()=>setEditorOpen(false)} profile={profile} setProfile={setProfile} onFiles={addFiles} onReset={reset}/>
  </div>;
}

