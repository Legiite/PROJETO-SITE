export default function Editor({open,onClose,profile,setProfile,onFiles,onReset}) {
  const update=(key,value)=>setProfile(current=>({...current,[key]:value}));
  const updateSocial=(key,value)=>setProfile(current=>({...current,socials:{...current.socials,[key]:value}}));
  return <>
    {open&&<button className="editor-backdrop" aria-label="Fechar editor" onClick={onClose}/>}
    <aside className={`editor ${open?'open':''}`} aria-hidden={!open}>
      <button className="closeEditor" aria-label="Fechar editor" onClick={onClose}>×</button>
      <h2>✦ Seu portfólio</h2><p className="hint">Edite as informações e veja o resultado na página. Os dados ficam salvos neste navegador.</p>
      <label>Nome artístico<input value={profile.name} onChange={event=>update('name',event.target.value)}/></label>
      <label>Usuário<input value={profile.handle} onChange={event=>update('handle',event.target.value)}/></label>
      <label>Especialidade<input value={profile.role} onChange={event=>update('role',event.target.value)}/></label>
      <label>Descrição<textarea value={profile.bio} onChange={event=>update('bio',event.target.value)}/></label>
      <h3>Redes e contato</h3><p className="hint">Os nomes aparecem abaixo dos ícones. Cole os endereços dos seus perfis.</p>
      <label>Link da Twitch<input type="url" placeholder="https://twitch.tv/seuusuario" value={profile.socials.twitch} onChange={event=>updateSocial('twitch',event.target.value)}/></label>
      <label>Link do Instagram<input type="url" placeholder="https://instagram.com/seuusuario" value={profile.socials.instagram} onChange={event=>updateSocial('instagram',event.target.value)}/></label>
      <label>Link do TikTok<input type="url" placeholder="https://tiktok.com/@seuusuario" value={profile.socials.tiktok} onChange={event=>updateSocial('tiktok',event.target.value)}/></label>
      <label>Convite do Discord<input type="url" placeholder="https://discord.gg/seuconvite" value={profile.socials.discord} onChange={event=>updateSocial('discord',event.target.value)}/></label>
      <label>E-mail<input type="text" placeholder="voce@exemplo.com" value={profile.socials.email} onChange={event=>updateSocial('email',event.target.value)}/></label>
      <label>Adicionar artes<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple onChange={onFiles}/></label>
      <div className="editor-actions"><button onClick={onReset}>Restaurar demonstração</button><button id="done" onClick={onClose}>Concluir</button></div>
      <p className="hint">Esta demonstração salva no navegador. Para publicar suas alterações, ainda é necessário configurar armazenamento online.</p>
    </aside>
  </>;
}
