const channels={email:'E-mail',discord:'Discord',twitch:'Twitch',instagram:'Instagram',tiktok:'TikTok'};
export default function Editor({open,onClose,profile,setProfile,onFiles,onAvatar,onMusic,onClearMusic,onReset}) {
  const update=(key,value)=>setProfile(current=>({...current,[key]:value}));
  const updateDesign=(key,value)=>setProfile(current=>({...current,design:{...current.design,[key]:value}}));
  const updateSocial=(key,value)=>setProfile(current=>({...current,socials:{...current.socials,[key]:value},socialNames:key==='email'?{...current.socialNames,email:value}:current.socialNames}));
  const updateSocialName=(key,value)=>setProfile(current=>({...current,socialNames:{...current.socialNames,[key]:value}}));
  const design=profile.design||{};
  return <>
    {open&&<button className="editor-backdrop" aria-label="Fechar editor" onClick={onClose}/>}
    <aside className={`editor ${open?'open':''}`} aria-hidden={!open}>
      <button className="closeEditor" aria-label="Fechar editor" onClick={onClose}>×</button>
      <h2>✦ Seu portfólio</h2><p className="hint">Edite as informações e veja o resultado na página. Os dados ficam salvos neste navegador.</p>
      <label>Nome artístico<input value={profile.name} onChange={event=>update('name',event.target.value)}/></label>
      <label>Foto de perfil<input type="file" accept="image/png,image/jpeg,image/webp" onChange={onAvatar}/></label>
      <label>Usuário<input value={profile.handle} onChange={event=>update('handle',event.target.value)}/></label>
      <label>Especialidade<input value={profile.role} onChange={event=>update('role',event.target.value)}/></label>
      <label>Descrição<textarea value={profile.bio} onChange={event=>update('bio',event.target.value)}/></label>
      <h3>Visual do site</h3><p className="hint">Personalize as cores, a fonte e o formato da galeria.</p>
      <div className="design-grid"><label>Fundo<input type="color" value={design.background||'#0b0710'} onChange={event=>updateDesign('background',event.target.value)}/></label><label>Cartões<input type="color" value={design.surface||'#150d1e'} onChange={event=>updateDesign('surface',event.target.value)}/></label><label>Cor de destaque<input type="color" value={design.accent||'#c041ff'} onChange={event=>updateDesign('accent',event.target.value)}/></label><label>Texto<input type="color" value={design.text||'#f8f3fa'} onChange={event=>updateDesign('text',event.target.value)}/></label></div>
      <label>Fonte<select value={design.font||'system'} onChange={event=>updateDesign('font',event.target.value)}><option value="system">Moderna</option><option value="serif">Clássica</option><option value="mono">Monoespaçada</option></select></label>
      <label>Colunas da galeria<select value={design.columns||3} onChange={event=>updateDesign('columns',Number(event.target.value))}><option value="2">2 colunas</option><option value="3">3 colunas</option><option value="4">4 colunas</option></select></label>
      <label>Cantos dos cartões: {design.radius??22}px<input type="range" min="0" max="40" value={design.radius??22} onChange={event=>updateDesign('radius',Number(event.target.value))}/></label>
      <h3>Redes e contato</h3><p className="hint">Os nomes aparecem abaixo dos ícones. Cole os endereços dos seus perfis.</p>
      {['twitch','instagram','tiktok','discord'].map(key=><div key={key}><label>{key==='discord'?'Convite do Discord':`Link do ${channels[key]}`}<input type="url" placeholder={`https://${key==='discord'?'discord.gg/seuconvite':`${key}.com/seuusuario`}`} value={profile.socials[key]} onChange={event=>updateSocial(key,event.target.value)}/></label><label>Nome mostrado<input placeholder="@seuusuario" value={profile.socialNames[key]} onChange={event=>updateSocialName(key,event.target.value)}/></label></div>)}
      <label>E-mail<input type="email" placeholder="voce@exemplo.com" value={profile.socials.email} onChange={event=>updateSocial('email',event.target.value)}/></label>
      <label>Para onde vai o botão “Solicitar orçamento”?<select value={profile.quoteChannel||'email'} onChange={event=>update('quoteChannel',event.target.value)}>{Object.entries(channels).map(([key,name])=><option key={key} value={key}>{name}</option>)}</select></label>
      <p className="hint">A página informa esse destino logo abaixo do botão para a pessoa saber onde vai chegar.</p>
      <h3>Música de fundo</h3><p className="hint">A pessoa escolhe quando tocar. Os navegadores bloqueiam música automática.</p>
      {profile.musicName&&<div className="music-settings"><span>♫ {profile.musicName}</span><button type="button" onClick={onClearMusic}>Remover música</button></div>}
      <label>Adicionar música (MP3, WAV, OGG — até 30 MB)<input type="file" accept="audio/*" onChange={onMusic}/></label>
      <h3>Galeria</h3><label>Adicionar imagens ou vídeos (vídeo MP4/WebM até 100 MB)<input type="file" accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm" multiple onChange={onFiles}/></label>
      <div className="editor-actions"><button onClick={onReset}>Restaurar demonstração</button><button id="done" onClick={onClose}>Concluir</button></div>
      <p className="hint">Esta demonstração salva no navegador. Para publicar suas alterações, ainda é necessário configurar armazenamento online.</p>
    </aside>
  </>;
}

