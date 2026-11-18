import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitch, faInstagram, faTiktok, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const services = [
  ['twitch','Twitch',faTwitch],['instagram','Instagram',faInstagram],['tiktok','TikTok',faTiktok],
  ['discord','Discord',faDiscord],['email','E-mail',faEnvelope]
];

export default function SocialLinks({socials,socialNames}) {
  return <div className="socials" aria-label="Redes sociais e contato">
    {services.map(([key,label,icon])=>{
      const value=(socials[key]||'').trim();
      const href=key==='email' ? (value ? (value.startsWith('mailto:') ? value : `mailto:${value}`) : '') : value;
      const valid=key==='email' ? Boolean(href) : /^https:\/\//i.test(href);
      return <a key={key} className={!valid?'not-configured':''} href={valid?href:undefined}
        target={valid&&key!=='email'?'_blank':undefined} rel={valid&&key!=='email'?'noopener noreferrer':undefined}
        aria-disabled={!valid} title={valid?label:`Adicione seu link de ${label} no editor`}>
        <FontAwesomeIcon icon={icon} aria-hidden="true"/><span>{label}</span><small>{socialNames[key]||''}</small>
      </a>;
    })}
  </div>;
}
