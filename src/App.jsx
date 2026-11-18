import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Data from './Data';
import Header from './components/Header';
import SocialLinks from './components/SocialLinks';
import Portfolio from './components/Portfolio';
import Editor from './components/Editor';
import ImageEditControl from './components/ImageEditControl';
import { clearMedia, deleteMedia, getMedia, saveMedia } from './mediaStore';

const PROFILE_KEY='ghostfolio.react.profile', WORKS_KEY='ghostfolio.react.works';
const DENSITY_KEY='ghostfolio.layout-density-v1';
const NOTICE_KEY='ghostfolio.optional-quote-notice-v1';
function readJson(key,fallback){try{return JSON.parse(localStorage.getItem(key))||fallback}catch{return fallback}}
function normalizeWork(work){return {...work,category:work.category||work.cat||'Trabalhos',text:(work.text||'').replace(/<br\s*\/?\s*>/gi,'\n'),kind:work.kind||'image'}}
function fileUrl(file){return URL.createObjectURL(file)}
function loadWorks(){
  const previous=readJson('ghostfolio.works',null),saved=readJson(WORKS_KEY,previous||Data.works),items=saved.map(normalizeWork);
  if(!localStorage.getItem('ghostfolio.demo-gif-seeded')){
    const demo=Data.works.find(work=>work.id==='ghost-gif-demo');
    if(demo&&!items.some(work=>work.id===demo.id))items.push(normalizeWork(demo));
    localStorage.setItem('ghostfolio.demo-gif-seeded','1');
  }
  return items;
}

export default function App(){
  const [profile,setProfile]=useState(()=>{
    const saved=readJson(PROFILE_KEY,null)||readJson('ghostfolio.profile',{}),migrated={...saved};
    for(const key of ['name','handle','role','bio']){const legacy=localStorage.getItem(`ghostfolio.in${key[0].toUpperCase()}${key.slice(1)}`);if(!migrated[key]&&legacy)migrated[key]=legacy}
    if(!localStorage.getItem(DENSITY_KEY)){if(migrated.design?.columns===3)migrated.design={...migrated.design,columns:4};localStorage.setItem(DENSITY_KEY,'1')}
    if(!localStorage.getItem(NOTICE_KEY)){if(migrated.quoteNotice==='Abre')migrated.quoteNotice='';localStorage.setItem(NOTICE_KEY,'1')}
    return {...Data,...migrated,socials:{...Data.socials,...(migrated.socials||{})},socialNames:{...Data.socialNames,...(migrated.socialNames||{})},socialIcons:{...(migrated.socialIcons||{})},design:{...Data.design,...(migrated.design||{})}};
  });
  const [works,setWorks]=useState(loadWorks);
  const [filter,setFilter]=useState('Todos'),[editorOpen,setEditorOpen]=useState(false),[editorSection,setEditorSection]=useState('music'),[editMode,setEditMode]=useState(false),[appearanceOpen,setAppearanceOpen]=useState(false),[editingSocial,setEditingSocial]=useState(''),[previewMode,setPreviewMode]=useState(false),[selected,setSelected]=useState(null),[editingWork,setEditingWork]=useState(false),[musicPlaying,setMusicPlaying]=useState(false);
  const audioRef=useRef(null);

  useEffect(()=>{
    document.title=profile.name?`Ghostfolio — ${profile.name}`:Data.WebsiteTitle;
    const {avatarUrl,backgroundUrl,musicUrl,works:unusedWorks,...saved}=profile;
    saved.socialIcons=Object.fromEntries(Object.entries(profile.socialIcons||{}).map(([key,item])=>[key,{mediaId:item?.mediaId||''}]));
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
      let avatarUrl='',backgroundUrl='',musicUrl='';
      if(profile.avatarMediaId){const item=await getMedia(profile.avatarMediaId);if(item?.blob){avatarUrl=fileUrl(item.blob);urls.push(avatarUrl)}}
      if(profile.backgroundMediaId){const item=await getMedia(profile.backgroundMediaId);if(item?.blob){backgroundUrl=fileUrl(item.blob);urls.push(backgroundUrl)}}
      if(profile.musicMediaId){const item=await getMedia(profile.musicMediaId);if(item?.blob){musicUrl=fileUrl(item.blob);urls.push(musicUrl)}}
      const socialIcons={};
      for(const [key,value] of Object.entries(profile.socialIcons||{})){if(value?.mediaId){const item=await getMedia(value.mediaId);if(item?.blob){const url=fileUrl(item.blob);urls.push(url);socialIcons[key]={...value,url}}}}
      if(alive){setWorks(hydrated);if(avatarUrl||backgroundUrl||musicUrl||Object.keys(socialIcons).length)setProfile(current=>({...current,avatarUrl:avatarUrl||current.avatarUrl,backgroundUrl:backgroundUrl||current.backgroundUrl,musicUrl:musicUrl||current.musicUrl,socialIcons:{...current.socialIcons,...socialIcons}}))}
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
  async function setBackground(event){
    const file=event.target.files?.[0];if(!file)return;
    if(!file.type.startsWith('image/')){alert('Escolha uma imagem ou GIF para o fundo.');event.target.value='';return}
    if(file.size>20*1024*1024){alert('A imagem de fundo deve ter até 20 MB.');event.target.value='';return}
    try{const mediaId=await saveMedia(file),backgroundUrl=fileUrl(file),oldId=profile.backgroundMediaId;setProfile(current=>({...current,backgroundMediaId:mediaId,backgroundUrl,backgroundRemoteUrl:''}));if(oldId)await deleteMedia(oldId)}catch{alert('Não foi possível guardar este fundo neste navegador.')}
    event.target.value='';
  }
  async function clearBackground(){if(profile.backgroundMediaId)await deleteMedia(profile.backgroundMediaId);setProfile(current=>({...current,backgroundMediaId:'',backgroundUrl:'',backgroundRemoteUrl:''}))}
  async function setSocialIcon(key,event){
    const file=event.target.files?.[0];if(!file)return;
    if(!file.type.startsWith('image/')){alert('Escolha uma imagem para o ícone.');event.target.value='';return}
    if(file.size>5*1024*1024){alert('O ícone deve ter até 5 MB.');event.target.value='';return}
    try{const mediaId=await saveMedia(file),url=fileUrl(file),oldId=profile.socialIcons?.[key]?.mediaId;setProfile(current=>({...current,socialIcons:{...current.socialIcons,[key]:{mediaId,url}}}));if(oldId)await deleteMedia(oldId)}catch{alert('Não foi possível guardar este ícone neste navegador.')}
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
    await clearMedia();localStorage.removeItem(PROFILE_KEY);localStorage.removeItem(WORKS_KEY);localStorage.removeItem('ghostfolio.profile');localStorage.removeItem('ghostfolio.works');localStorage.removeItem('ghostfolio.demo-gif-seeded');location.reload();
  }
  async function toggleMusic(){
    if(!audioRef.current)return;
    if(audioRef.current.paused){try{audioRef.current.muted=false;await audioRef.current.play();setMusicPlaying(true)}catch{alert('O navegador não conseguiu iniciar a música. Clique novamente para tentar.')}}
    else{audioRef.current.pause();audioRef.current.muted=true;setMusicPlaying(false)}
  }
  const design=profile.design||Data.design;
  function openEditor(section='music'){setEditMode(false);setEditorSection(section);setEditorOpen(true)}
  function toggleEditMode(){setEditorOpen(false);setEditingSocial('');setAppearanceOpen(false);setEditMode(current=>!current)}
  function updateSocial(key,field,value){setProfile(current=>field==='name'?({...current,socialNames:{...current.socialNames,[key]:value}}):({...current,socials:{...current.socials,[key]:value}}))}
  const backgroundImage=profile.backgroundUrl||profile.backgroundRemoteUrl;
  const designStyle={'--site-bg':design.background,'--site-surface':design.surface,'--site-accent':design.accent,'--site-text':design.text,'--site-font':design.font==='serif'?'Georgia,serif':design.font==='mono'?'ui-monospace,monospace':'Inter,system-ui,sans-serif','--gallery-columns':String(design.columns),'--card-radius':`${design.radius}px`,...(backgroundImage?{backgroundImage:`linear-gradient(#0b071080,#0b071080),url("${backgroundImage}")`,backgroundSize:'cover',backgroundPosition:'center',backgroundAttachment:'fixed'}:{})};

  return <div className={`App${previewMode?' preview-mode':''}${editMode?' direct-edit-mode':''}`} style={designStyle}>
    <Header onEdit={toggleEditMode} editMode={editMode} brand={Data.HeaderTitle}/>
    {editMode&&<div className="edit-mode-toolbar" role="toolbar" aria-label="Opções de edição do site">
      <div className="edit-toolbar-main">
        <div className="edit-toolbar-heading"><span className="edit-toolbar-mark">✎</span><div><strong>Seu site</strong><span>Edite os textos clicando neles.</span></div></div>
        <div className="edit-toolbar-actions">
          <button className={`toolbar-action ${appearanceOpen?'active':''}`} onClick={()=>setAppearanceOpen(open=>!open)} aria-expanded={appearanceOpen}>🎨 <span>Aparência</span><i>{appearanceOpen?'−':'+'}</i></button>
          <label className="toolbar-action upload-background">▧ <span>Fundo / GIF</span><input type="file" accept="image/*" onChange={setBackground}/></label>
          {backgroundImage&&<button type="button" className="clear-site-background" onClick={clearBackground} aria-label="Remover fundo">×</button>}
          <button className="finish-edit" onClick={toggleEditMode}>Concluir</button>
        </div>
      </div>
      {appearanceOpen&&<div className="appearance-panel">
        <div className="appearance-colors">
          <label><span>Fundo</span><input type="color" value={design.background} onChange={event=>setProfile(current=>({...current,design:{...current.design,background:event.target.value}}))}/></label>
          <label><span>Cartões</span><input type="color" value={design.surface} onChange={event=>setProfile(current=>({...current,design:{...current.design,surface:event.target.value}}))}/></label>
          <label><span>Destaque</span><input type="color" value={design.accent} onChange={event=>setProfile(current=>({...current,design:{...current.design,accent:event.target.value}}))}/></label>
          <label><span>Texto</span><input type="color" value={design.text} onChange={event=>setProfile(current=>({...current,design:{...current.design,text:event.target.value}}))}/></label>
        </div>
        <label className="appearance-select">Fonte<select value={design.font} onChange={event=>setProfile(current=>({...current,design:{...current.design,font:event.target.value}}))}><option value="system">Legível</option><option value="serif">Clássica</option><option value="mono">Monoespaçada</option></select></label>
        <label className="appearance-select">Galeria<select value={design.columns} onChange={event=>setProfile(current=>({...current,design:{...current.design,columns:Number(event.target.value)}}))}><option value="2">2 colunas</option><option value="3">3 colunas</option><option value="4">4 colunas</option></select></label>
        <label className="appearance-range">Cantos<input type="range" min="0" max="40" value={design.radius} onChange={event=>setProfile(current=>({...current,design:{...current.design,radius:Number(event.target.value)}}))}/></label>
      </div>}
    </div>}
    <main>
      <section className="hero" id="profile">
        <div className="avatar" aria-label="Foto de perfil">
          {profile.avatarUrl||profile.avatar?<img src={profile.avatarUrl||profile.avatar} alt="Foto de perfil"/>:<span className="avatar-placeholder">👻<i>♫</i></span>}
          {editMode&&<ImageEditControl className="avatar-image-edit" label="Trocar foto do perfil" onChange={setAvatar}/>}
        </div>
        <h1>{editMode?<input className="inline-profile-field inline-name" aria-label="Nome artístico" value={profile.name} onChange={event=>setProfile(current=>({...current,name:event.target.value}))}/>:profile.name}</h1>
        {editMode?<input className="inline-profile-field inline-handle" aria-label="Usuário" value={`@${(profile.handle||'').replace(/^@/,'')}`} onChange={event=>setProfile(current=>({...current,handle:event.target.value.replace(/^@/, '')}))}/>:<a className="handle">@{(profile.handle||'').replace(/^@/,'')}</a>}
        {editMode?<><input className="inline-profile-field inline-role" aria-label="Especialidade" value={profile.role} onChange={event=>setProfile(current=>({...current,role:event.target.value}))}/><textarea className="inline-profile-field inline-bio" aria-label="Descrição" value={profile.bio} onChange={event=>setProfile(current=>({...current,bio:event.target.value}))}/></>:<><p className="role">{profile.role}</p><p className="bio">{profile.bio}</p></>}
        <div className="creator-shortcuts" aria-label="Atalhos de edição"><button className="creator-main" onClick={toggleEditMode}>{editMode?'✓　Concluir edição':'✎　Editar no próprio site'}</button><button onClick={()=>openEditor('music')}>♫　Música</button><button onClick={()=>openEditor('works')}>🖼️　Trabalhos</button></div>
        <SocialLinks socials={profile.socials} socialNames={profile.socialNames} socialIcons={profile.socialIcons} onIconChange={setSocialIcon} editMode={editMode} onEditSocial={setEditingSocial}/>
        {editMode&&editingSocial&&<div className="inline-social-editor"><strong>Editar {editingSocial==='email'?'E-mail':editingSocial[0].toUpperCase()+editingSocial.slice(1)}</strong><label>Link ou endereço<input value={profile.socials[editingSocial]} onChange={event=>updateSocial(editingSocial,'link',event.target.value)}/></label><label>Nome visível<input value={profile.socialNames[editingSocial]} onChange={event=>updateSocial(editingSocial,'name',event.target.value)}/></label><button onClick={()=>setEditingSocial('')}>Pronto</button></div>}
        {profile.musicUrl&&<div className="music-player">
          <audio ref={audioRef} src={profile.musicUrl} loop preload="none" muted onEnded={()=>setMusicPlaying(false)}/>
          <button onClick={toggleMusic} aria-label={musicPlaying?'Pausar música':'Tocar música'}>{musicPlaying?'Ⅱ':'▶'} <span>{musicPlaying?'Pausar música':'Ouvir música'}</span></button>
          <span className="music-title">♫ {profile.musicName}</span>
        </div>}
        <p className="open"><i/> {profile.commissionText}</p>
        {(()=>{const channel=profile.quoteChannel||'email',destination=profile.socials[channel]||'',label=channel==='email'?profile.socialNames.email||destination:profile.socialNames[channel]||destination;const href=channel==='email'?(destination?`mailto:${destination.replace(/^mailto:/,'')}?subject=Or%C3%A7amento%20Ghostfolio`:undefined):destination||undefined;const names={email:'e-mail',discord:'Discord',twitch:'Twitch',instagram:'Instagram',tiktok:'TikTok'};return editMode?<><div className="quote quote-inline-edit"><span>✎</span><input aria-label="Texto do botão" value={profile.quoteButtonText||'Solicitar orçamento'} onChange={event=>setProfile(current=>({...current,quoteButtonText:event.target.value}))}/></div><div className="quote-destination quote-inline-destination"><span className="quote-destination-icon">↗</span><input aria-label="Texto opcional antes do destino" placeholder="Texto opcional" value={profile.quoteNotice||''} onChange={event=>setProfile(current=>({...current,quoteNotice:event.target.value}))}/><select aria-label="Destino do orçamento" value={channel} onChange={event=>setProfile(current=>({...current,quoteChannel:event.target.value}))}>{Object.entries(names).map(([key,name])=><option key={key} value={key}>{name}</option>)}</select><b>{label}</b></div></>:<><a className={`quote ${destination?'':'disabled'}`} href={href} target={channel==='email'?undefined:'_blank'} rel={channel==='email'?undefined:'noreferrer'}>✎　{profile.quoteButtonText||'Solicitar orçamento'}</a>{destination&&( <div className="quote-destination"><span className="quote-destination-icon">↗</span><span>{profile.quoteNotice?.trim()&&<strong>{profile.quoteNotice.trim()}</strong>}<b>{names[channel]}: {label}</b></span></div>)}</>})()}
      </section>
      <Portfolio works={works} filter={filter} onFilter={setFilter} onOpen={(work,edit=false)=>{setSelected(work);setEditingWork(edit)}} onAdd={addFiles} editable={editMode}/>
    </main>
    <footer>© 2026 {profile.name} · <b>{Data.FooterText}</b></footer>
    {previewMode&&<button className="preview-return" onClick={()=>{setPreviewMode(false);setEditMode(true)}}>✎ Voltar ao editor</button>}
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
    <Editor open={editorOpen} section={editorSection} onSection={setEditorSection} onClose={()=>setEditorOpen(false)} onPreview={()=>{setEditorOpen(false);setPreviewMode(true)}} profile={profile} setProfile={setProfile} onFiles={addFiles} onAvatar={setAvatar} onBackground={setBackground} onClearBackground={clearBackground} onMusic={setMusic} onClearMusic={clearMusic} onReset={reset}/>
  </div>;
}

