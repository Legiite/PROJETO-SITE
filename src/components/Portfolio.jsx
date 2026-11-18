import { useMemo } from 'react';
import { motion } from 'framer-motion';

const reveal={hidden:{opacity:0,y:18,scale:.98},visible:{opacity:1,y:0,scale:1,transition:{duration:.45,ease:[.22,1,.36,1]}}};

function Artwork({work,onOpen}) {
  return <motion.article variants={reveal} initial="hidden" whileInView="visible" viewport={{once:false,amount:.1}}
    className={`art ${work.style||'uploaded'} ${work.data||work.mediaUrl?'has-upload':''}`} style={work.data?{backgroundImage:`url("${work.data}")`}:undefined}
    onClick={()=>onOpen(work)} onKeyDown={event=>event.key==='Enter'&&onOpen(work)} role="button" tabIndex="0" aria-label={`Ampliar ${work.title}`}>
    {work.kind==='video'&&work.mediaUrl ? <><video className="gallery-video" src={work.mediaUrl} muted playsInline preload="metadata"/><span className="video-badge">▶ Vídeo</span></> : <>{!work.data && !work.mediaUrl && (work.style==='emotes' ? <span className="emote-row"><span>👻</span><span>🥰</span><span>😠</span><span>😴</span></span> : <span className="emoji">{work.emoji||''}</span>)}{work.text && <span className="arttext">{work.text.split('\n').map((line,index)=><span key={index}>{line}</span>)}</span>}</>}
    <small>{work.title}</small>
  </motion.article>;
}

export default function Portfolio({works,filter,onFilter,onOpen,onAdd}) {
  const categories=useMemo(()=>['Todos',...new Set(works.map(work=>work.category||'Trabalhos'))],[works]);
  const visible=filter==='Todos'?works:works.filter(work=>(work.category||'Trabalhos')===filter);
  return <section id="portfolio" className="portfolio-section">
    <div className="divider" />
    <div className="filters" role="tablist" aria-label="Categorias de arte">
      {categories.map(category=><button key={category} className={filter===category?'active':''} role="tab" aria-selected={filter===category} onClick={()=>onFilter(category)}>{category}</button>)}
    </div>
    <motion.div className="gallery" layout>{visible.map(work=><Artwork key={work.id} work={work} onOpen={onOpen}/>)}
      <label className="art add-art"><input type="file" accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm" multiple onChange={onAdd}/><span className="add-art-icon">＋</span><strong>Adicionar imagens ou vídeos</strong><small>PNG, JPG, WebP, GIF, MP4 ou WebM</small></label>
    </motion.div>
  </section>;
}

