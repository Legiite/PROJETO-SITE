import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Data from './Data';
import Header from './components/Header';
import SocialLinks from './components/SocialLinks';
import Portfolio from './components/Portfolio';
import Editor from './components/Editor';
import { clearMedia, deleteMedia, getMedia, saveMedia } from './mediaStore';

const PROFILE_KEY='ghostfolio.react.profile', WORKS_KEY='ghostfolio.react.works';
function readJson(key,fallback){try{return JSON.parse(localStorage.getItem(key))||fallback}catch{return fallback}}
function normalizeWork(work){return {...work,category:work.category||work.cat||'Trabalhos',text:(work.text||'').replace(/<br\s*\/?\s*>/gi,'\n'),kind:work.kind||'image'}}
function fileUrl(file){return URL.createObjectURL(file)}

export default function App(){
  const [profile,setProfile]=useState(()=>{
    const saved=readJson(PROFILE_KEY,null)||readJson('ghostfolio.profile',{}),migrated={...saved};
    for(const key of ['name','handle','role','bio']){const legacy=localStorage.getItem(`ghostfolio.in${key[0].toUpperCase()}${key.slice(1)}`);if(!migrated[key]&&legacy)migrated[key]=legacy}
    return {...Data,...migrated,socials:{...Data.socials,...(migrated.socials||{})},socialNames:{...Data.socialNames,...(migrated.socialNames||{})},design:{...Data.design,...(migrated.design||{})}};
  });
  const [works,setWorks]=useState(()=>{
    const previous=readJson('ghostfolio.works',null);
    return (readJson(WORKS_KEY,previous||Data.works)).map(normalizeWork);
  });
  const [filter,setFilter]=useState('Todos'),[editorOpen,setEditorOpen]=useState(false),[selected,setSelected]=useState(null),[editingWork,setEditingWork]=useState(false),[musicPlaying,setMusicPlaying]=useState(false);
  const avatarInput=useRef(null),audioRef=useRef(null),musicInput=useRef(null);

  useEffect(()=>{
    document.title=profile.name?`Ghostfolio — ${profile.name}`:Data.WebsiteTitle;
    const {avatarUrl,musicUrl,works:unusedWorks,...saved}=profile;
    try{localStorage.setItem(PROFILE_KEY,JSON.stringify(saved))}catch{console.warn('O limite de dados locais do perfil foi atingido.')}
  },[profile]);
  useEffect(()=>{try{localStorage.setItem(WORKS_KEY,JSON.stringify(works.map(({mediaUrl,...work})=>work)))}catch{console.warn('Os dados das artes não couberam no armazenamento do navegador.')}} ,[works]);
  useEffect(()=>{
    let alive=true;const urls=[];
    (async()=>{
      const hydrated=await Promise.all(works.map(async work=>{
        if(!work.mediaId)return work;
        const item=await getMedia(work.mediaId);if(!item?.blob)return work;
        const url=fileUrl(item.blob);urls.push(url);
        return {...work,mediaUrl:url,kind:item.type?.startsWith('video/')?'video':'image'};
      }));
      let avatarUrl='',musicUrl='';
      if(profile.avatarMediaId){const item=await getMedia(profile.avatarMediaId);if(item?.blob){avatarUrl=fileUrl(item.blob);urls.push(avatarUrl)}}
      if(profile.musicMediaId){const item=await getMedia(profile.musicMediaId);if(item?.blob){musicUrl=fileUrl(item.blob);urls.push(musicUrl)}}
      if(alive){setWorks(hydrated);if(avatarUrl||musicUrl)setProfile(current=>({...current,avatarUrl:avatarUrl||current.avatarUrl,musicUrl:musicUrl||current.musicUrl}))}
    })().catch(error=>console.warn('Não foi possível recuperar as mídias locais.',error));
    return ()=>{alive=false;urls.forEach(url=>URL.revokeObjectURL(url))};
  },[]);
  useEffect(()=>{
    const design=profile.design||Data.design,root=document.documentElement;
    root.style.setProperty('--site-bg',design.background);root.style.setProperty('--site-surface',design.surface);root.style.setProperty('--site-accent',design.accent);root.style.setProperty('--site-text',design.text);
    root.style.setProperty('--site-font',design.font==='serif'?'Georgia,serif':design.font==='mono'?'ui-monospace,monospace':'Inter,system-ui,sans-serif');
    root.style.setProperty('--gallery-columns',String(design.columns));root.style.setProperty('--card-radius',`${design.radius}px`);
  },[profile.design]);
  useEffect(()=>{
    const keydown=event=>{if(event.key==='Escape')setSelected(null);if(selected&&event.key==='ArrowRight')nextArt(1);if(selected&&event.key==='ArrowLeft')nextArt(-1)};
    window.addEventListener('keydown',keydown);return()=>window.removeEventListener('keydown',keydown);
  },[selected,works]);
  useEffect(()=>{if(audioRef.current){audioRef.current.pause();audioRef.current.currentTime=0;setMusicPlaying(false)}},[profile.musicUrl]);

  function nextArt(direction){const index=works.findIndex(work=>work.id===selected?.id);if(index<0)return;setEditingWork(false);setSelected(works[(index+direction+works.length)%works.length])}
  async function addFiles(event){
    const additions=[];
    for(const file of Array.from(event.target.files||[])){
      const isImage=file.type.startsWith('image/'),isVideo=['video/mp4','video/webm'].includes(file.type);
      if(!isImage&&!isVideo)continue;
      const max=isVideo?100:25;
      if(file.size>max*1024*1024){alert(`${file.name}: o limite é ${max} MB por arquivo.`);continue}
      try{
        const mediaId=await saveMedia(file),mediaUrl=fileUrl(file);
        additions.push({id:`upload-${Date.now()}-${Math.random()}`,title:file.name,category:'Meus trabalhos',style:'uploaded',mediaId,mediaUrl,kind:isVideo?'video':'image',text:'',emoji:''});
      }catch{alert(`Não foi possível guardar ${file.name} neste navegador.`)}
    }
    if(additions.length){setWorks(current=>[...current,...additions]);setFilter('Todos')}
    event.target.value='';
  }
  async function setAvatar(event){
    const file=event.target.files?.[0];if(!file)return;
    if(!file.type.startsWith('image/')){alert('Escolha um arquivo de imagem.');event.target.value='';return}
    if(file.size>5*1024*1024){alert('A foto de perfil deve ter até 5 MB.');event.target.value='';return}
    try{
      const mediaId=await saveMedia(file),avatarUrl=fileUrl(file),oldId=profile.avatarMediaId;
      setProfile(current=>({...current,avatar:'',avatarMediaId:mediaId,avatarUrl}));
      if(oldId)await deleteMedia(oldId);
    }catch{alert('Não foi possível guardar a foto neste navegador.')}
    event.target.value='';
  }
  async function setMusic(event){
    const file=event.target.files?.[0];if(!file)return;
    if(!file.type.startsWith('audio/')){alert('Escolha um arquivo de áudio.');event.target.value='';return}
    if(file.size>30*1024*1024){alert('A música deve ter até 30 MB.');event.target.value='';return}
    try{
      const mediaId=await saveMedia(file),musicUrl=fileUrl(file),oldId=profile.musicMediaId;
      setProfile(current=>({...current,musicMediaId:mediaId,musicName:file.name,musicUrl}));
      if(oldId)await deleteMedia(oldId);
    }catch{alert('Não foi possível guardar a música neste navegador.')}
    event.target.value='';
  }
  async function clearMusic(){if(profile.musicMediaId)await deleteMedia(profile.musicMediaId);setProfile(current=>({...current,musicMediaId:'',musicName:'',musicUrl:''}));setMusicPlaying(false)}
  async function updateSelected(patch){
    setWorks(current=>current.map(work=>work.id===selected.id?{...work,...patch}:work));
    setSelected(current=>({...current,...patch}));
  }
  async function replaceSelected(event){
    const file=event.target.files?.[0];if(!file)return;
    if(!file.type.startsWith('image/')&&!['video/mp4','video/webm'].includes(file.type)){alert('Escolha uma imagem ou vídeo MP4/WebM.');event.target.value='';return}
    if(file.size>100*1024*1024){alert('A mídia deve ter até 100 MB.');event.target.value='';return}
    try{
      const mediaId=await saveMedia(file),mediaUrl=fileUrl(file),oldId=selected.mediaId;
      await updateSelected({mediaId,mediaUrl,kind:file.type.startsWith('video/')?'video':'image',style:'uploaded',data:'',text:'',emoji:''});
      if(oldId)await deleteMedia(oldId);
    }catch{alert('Não foi possível guardar a mídia neste navegador.')}
    event.target.value='';
  }
  async function deleteSelected(){
    if(!confirm(`Excluir “${selected.title}” da galeria?`))return;
    if(selected.mediaId)await deleteMedia(selected.mediaId);
    setWorks(current=>current.filter(work=>work.id!==selected.id));setSelected(null);setEditingWork(false);
  }
  async function reset(){
    if(!confirm('Restaurar a demonstração e apagar as alterações e mídias salvas neste navegador?'))return;
    await clearMedia();localStorage.removeItem(PROFILE_KEY);localStorage.removeItem(WORKS_KEY);localStorage.removeItem('ghostfolio.profile');localStorage.removeItem('ghostfolio.works');location.reload();
  }
  async function toggleMusic(){
    if(!audioRef.current)return;
    if(audioRef.current.paused){try{await audioRef.current.play();setMusicPlaying(true)}catch{alert('O navegador não conseguiu iniciar a música. Clique novamente para tentar.')}}
    else{audioRef.current.pause();setMusicPlaying(false)}
  }
  const design=profile.design||Data.design;
  const designStyle={'--site-bg':design.background,'--site-surface':design.surface,'--site-accent':design.accent,'--site-text':design.text,'--site-font':design.font==='serif'?'Georgia,serif':design.font==='mono'?'ui-monospace,monospace':'Inter,system-ui,sans-serif','--gallery-columns':String(design.columns),'--card-radius':`${design.radius}px`};

  return <div className="App" style={designStyle}>
    <Header onEdit={()=>setEditorOpen(true)} brand={Data.HeaderTitle}/>
    <main>
      <section className="hero" id="profile">
        <button className="avatar" type="button" onClick={()=>avatarInput.current?.click()} aria-label="Adicionar ou trocar foto de perfil">
          {profile.avatarUrl||profile.avatar?<img src={profile.avatarUrl||profile.avatar} alt="Foto de perfil"/>:<span className="avatar-placeholder">👻<i>♫</i></span>}
          <span className="avatar-edit" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm17.71-10.04a1 1 0 0 0 0-1.42l-2.5-2.5a1 1 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 2-1.66Z"/></svg></span>
        </button>
        <input ref={avatarInput} className="visually-hidden" type="file" accept="image/png,image/jpeg,image/webp" onChange={setAvatar}/>
        <h1>{profile.name}</h1><a className="handle">@{(profile.handle||'').replace(/^@/,'')}</a>
        <p className="role">{profile.role}</p><p className="bio">{profile.bio}</p>
        <SocialLinks socials={profile.socials} socialNames={profile.socialNames}/>
        {profile.musicUrl&&<div className="music-player">
          <audio ref={audioRef} src={profile.musicUrl} loop preload="none" onEnded={()=>setMusicPlaying(false)}/>
          <button onClick={toggleMusic} aria-label={musicPlaying?'Pausar música':'Tocar música'}>{musicPlaying?'Ⅱ':'▶'} <span>{musicPlaying?'Pausar música':'Ouvir música'}</span></button>
          <span className="music-title">♫ {profile.musicName}</span>
        </div>}
        <p className="open"><i/> {profile.commissionText}</p>
        {(()=>{const channel=profile.quoteChannel||'email',destination=profile.socials[channel]||'',label=channel==='email'?profile.socialNames.email||destination:profile.socialNames[channel]||destination;const href=channel==='email'?(destination?`mailto:${destination.replace(/^mailto:/,'')}?subject=Or%C3%A7amento%20Ghostfolio`:undefined):destination||undefined;const names={email:'e-mail',discord:'Discord',twitch:'Twitch',instagram:'Instagram',tiktok:'TikTok'};return <><a className={`quote ${destination?'':'disabled'}`} href={href} target={channel==='email'?undefined:'_blank'} rel={channel==='email'?undefined:'noreferrer'}>✎　Solicitar orçamento</a><p className="quote-destination">{destination?<>Você será direcionado para <strong>{names[channel]}</strong>: <span>{label}</span></>:<>Configure o destino do botão no editor para receber solicitações.</>}</p></>})()}
      </section>
      <Portfolio works={works} filter={filter} onFilter={setFilter} onOpen={work=>{setSelected(work);setEditingWork(false)}} onAdd={addFiles}/>
    </main>
    <footer>© 2026 {profile.name} · <b>{Data.FooterText}</b></footer>
    <AnimatePresence>{selected&&<motion.div className="modal show" role="dialog" aria-modal="true" aria-label={selected.title} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={event=>event.target===event.currentTarget&&setSelected(null)}>
      <button className="close" aria-label="Fechar" onClick={()=>setSelected(null)}>×</button>
      <button className="prev" aria-label="Arte anterior" onClick={()=>nextArt(-1)}>‹</button>
      <div className={`modal-art art ${selected.style||'uploaded'} ${selected.data||selected.mediaUrl?'has-upload':''}`} style={selected.kind!=='video'&&(selected.mediaUrl||selected.data)?{backgroundImage:`url("${selected.mediaUrl||selected.data}")`}:undefined}>
        {selected.kind==='video'&&selected.mediaUrl?<video src={selected.mediaUrl} controls playsInline preload="metadata"/>:(selected.mediaUrl||selected.data)?<img src={selected.mediaUrl||selected.data} alt={selected.title}/>:<><span className="emoji">{selected.emoji}</span>{selected.text&&<span className="arttext">{selected.text.split('\n').map(line=><span key={line}>{line}</span>)}</span>}</>}
      </div>
      <div className="art-modal-caption"><p>{selected.title}</p><button onClick={()=>setEditingWork(current=>!current)}>{editingWork?'Fechar edição':'✎ Editar arte'}</button></div>
      {editingWork&&<div className="work-editor">
        <label>Título<input value={selected.title} onChange={event=>updateSelected({title:event.target.value})}/></label>
        <label>Categoria<input value={selected.category||''} onChange={event=>updateSelected({category:event.target.value||'Trabalhos'})}/></label>
        <label className="replace-image">Substituir imagem ou vídeo<input type="file" accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm" onChange={replaceSelected}/></label>
        <button className="delete-work" onClick={deleteSelected}>Excluir arte</button>
      </div>}
      <button className="next" aria-label="Próxima arte" onClick={()=>nextArt(1)}>›</button>
    </motion.div>}</AnimatePresence>
    <Editor open={editorOpen} onClose={()=>setEditorOpen(false)} profile={profile} setProfile={setProfile} onFiles={addFiles} onAvatar={setAvatar} onMusic={setMusic} onClearMusic={clearMusic} onReset={reset}/>
  </div>;
}

