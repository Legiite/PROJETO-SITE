import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitch, faInstagram, faTiktok, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import ImageEditControl from './ImageEditControl';

const services = [
  ['twitch','Twitch',faTwitch],['instagram','Instagram',faInstagram],['tiktok','TikTok',faTiktok],
  ['discord','Discord',faDiscord],['email','E-mail',faEnvelope]
];

export default function SocialLinks({socials,socialNames,socialIcons={},onIconChange,editMode=false,onEditSocial}) {
  return <div className="socials" aria-label="Redes sociais e contato">
    {services.map(([key,label,icon])=>{
      const value=(socials[key]||'').trim();
      const href=key==='email' ? (value ? (value.startsWith('mailto:') ? value : `mailto:${value}`) : '') : value;
      const valid=key==='email' ? Boolean(href) : /^https:\/\//i.test(href);
      return <div className={`social-card${editMode?' is-editing':''}`} key={key}><a className={`social-link ${!valid?'not-configured':''}`} href={editMode?undefined:valid?href:undefined} onClick={editMode?event=>{event.preventDefault();onEditSocial?.(key)}:undefined}
        target={valid&&key!=='email'?'_blank':undefined} rel={valid&&key!=='email'?'noopener noreferrer':undefined}
        aria-disabled={!valid} title={valid?label:`Adicione seu link de ${label} no editor`}>
        {socialIcons[key]?.url?<img className="social-custom-icon" src={socialIcons[key].url} alt=""/>:<FontAwesomeIcon icon={icon} aria-hidden="true"/>}<span>{label}</span><small>{socialNames[key]||''}</small>
      </a>{editMode&&onIconChange&&<ImageEditControl className="social-icon-edit" label={`Trocar ícone de ${label}`} onChange={event=>onIconChange(key,event)}/>}</div>;
    })}
  </div>;
}

