import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitch, faInstagram, faTiktok, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import ImageEditControl from './ImageEditControl';

const services=[['twitch','Twitch',faTwitch],['instagram','Instagram',faInstagram],['tiktok','TikTok',faTiktok],['discord','Discord',faDiscord],['email','E-mail',faEnvelope]];

export default function SocialLinks({socials,socialNames,socialIcons={},visibleServices,onIconChange,editMode=false,editingSocial='',onEditSocial,onSocialChange}) {
  const orderedServices=services.filter(([key])=>!visibleServices||visibleServices.includes(key));
  return <div className={`socials${editMode?' editing-socials':''}`} aria-label="Redes sociais e contato">
    {orderedServices.map(([key,label,icon])=>{
      const value=(socials[key]||'').trim(),href=key==='email'?(value?(value.startsWith('mailto:')?value:`mailto:${value}`):''):value;
      const valid=key==='email'?Boolean(href):/^https:\/\//i.test(href),editing=editMode&&editingSocial===key;
      return <div className={`social-card${editing?' is-editing':''}`} key={key}>
        {editing?<div className="social-inline-card">
          <div className="social-inline-heading"><strong>{label}</strong><button type="button" aria-label="Concluir edição do contato" onClick={()=>onEditSocial?.('')}>✓</button></div>
          <label>Link ou e-mail<input autoFocus value={socials[key]||''} onChange={event=>onSocialChange?.(key,'link',event.target.value)}/></label>
          <label>Nome visível<input value={socialNames[key]||''} onChange={event=>onSocialChange?.(key,'name',event.target.value)}/></label>
          {onIconChange&&<ImageEditControl className="social-form-icon" label={`Trocar ícone de ${label}`} onChange={event=>onIconChange(key,event)}/>}
        </div>:<>
          <a className={`social-link ${!valid?'not-configured':''}`} href={editMode?undefined:valid?href:undefined} onClick={editMode?event=>{event.preventDefault();onEditSocial?.(key)}:undefined}
            target={valid&&key!=='email'&&!editMode?'_blank':undefined} rel={valid&&key!=='email'&&!editMode?'noopener noreferrer':undefined}
            aria-disabled={!valid&&!editMode} title={editMode?`Editar ${label}`:valid?label:`Adicione seu link de ${label} no editor`}>
            {socialIcons[key]?.url?<img className="social-custom-icon" src={socialIcons[key].url} alt=""/>:<FontAwesomeIcon icon={icon} aria-hidden="true"/>}<span>{label}</span><small>{socialNames[key]||''}</small>
          </a>
          {editMode&&<button type="button" className="social-edit-contact" onClick={()=>onEditSocial?.(key)} aria-label={`Editar link e nome de ${label}`}>✎ Editar contato</button>}
          {editMode&&onIconChange&&<ImageEditControl className="social-icon-edit" label={`Trocar ícone de ${label}`} onChange={event=>onIconChange(key,event)}/>}
        </>}
      </div>;
    })}
  </div>;
}

