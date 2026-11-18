import { useMemo, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const reveal={hidden:{opacity:0,y:38,scale:.97},visible:index=>({opacity:1,y:0,scale:1,transition:{duration:.65,delay:(index%3)*.12,ease:[.22,1,.36,1]}})};

function Artwork({work,onOpen,onReorder,index,editable,draggedWork}) {
  const reduceMotion=useReducedMotion(),imageUrl=work.mediaUrl||work.data||work.remoteUrl,suppressClick=useRef(false);
  const textLines=(work.text||'').split('\n'),maxLineLength=Math.max(1,...textLines.map(line=>line.length));
  return <motion.article custom={index} variants={reveal} initial={reduceMotion?'visible':'hidden'} whileInView="visible" whileHover={reduceMotion?undefined:{y:-9,scale:1.018,transition:{duration:.22,ease:'easeOut'}}} viewport={{once:true,amount:.16}}
    className={`art ${work.style||'uploaded'} ${imageUrl?'has-upload':''}`} style={imageUrl&&work.kind!=='video'?{backgroundImage:`url("${imageUrl}")`}:undefined}
    onDragOver={event=>{if(editable){event.preventDefault();event.dataTransfer.dropEffect='move'}}} onDrop={event=>{if(editable){event.preventDefault();event.stopPropagation();const source=draggedWork.current;if(source&&source!==work.id){onReorder?.(source,work.id);draggedWork.current='';}}}}
    onClick={()=>{if(suppressClick.current){suppressClick.current=false;return}onOpen(work)}} onKeyDown={event=>event.key==='Enter'&&onOpen(work)} role="button" tabIndex="0" aria-label={`Ampliar ${work.title}`}>
    {editable&&<button type="button" className="art-reorder-handle" draggable title="Segure e arraste para reorganizar as artes" aria-label={`Arrastar ${work.title}`} onClick={event=>event.stopPropagation()} onDragStart={event=>{event.stopPropagation();suppressClick.current=true;draggedWork.current=work.id;event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',work.id)}} onDragEnd={()=>{setTimeout(()=>{draggedWork.current='';suppressClick.current=false},250)}}>⠿</button>}
    {work.kind==='video'&&work.mediaUrl ? <><video className="gallery-video" src={work.mediaUrl} muted playsInline preload="metadata"/><span className="video-badge">▶ Vídeo</span></> : <>{!work.data && !work.mediaUrl && (work.style==='emotes' ? <span className="emote-row"><span>👻</span><span>🥰</span><span>😠</span><span>😴</span></span> : <span className="emoji">{work.emoji||''}</span>)}{work.text && <span className="arttext" style={{'--art-max-chars':maxLineLength,'--art-line-count':textLines.length}}>{textLines.map((line,index)=><span key={index}>{line}</span>)}</span>}</>}
    {editable&&<button className="art-edit" aria-label={`Editar ${work.title}`} title="Editar trabalho" onClick={event=>{event.stopPropagation();onOpen(work,true)}}><span className="edit-symbol">✎</span><span className="edit-label">Editar este trabalho</span></button>}
    <small>{work.title}</small>
  </motion.article>;
}

export default function Portfolio({works,filter,onFilter,onOpen,onAdd,onReorder,editable=false}) {
  const draggedWork=useRef('');
  const categories=useMemo(()=>['Todos',...new Set(works.map(work=>work.category||'Trabalhos'))],[works]);
  const visible=filter==='Todos'?works:works.filter(work=>(work.category||'Trabalhos')===filter);
  return <section id="portfolio" className="portfolio-section">
    <div className="divider" />
    <div className="filters" role="tablist" aria-label="Categorias de arte">
      {categories.map(category=><button key={category} className={filter===category?'active':''} role="tab" aria-selected={filter===category} onClick={()=>onFilter(category)}>{category}</button>)}
    </div>
    <motion.div className="gallery" layout>{visible.map((work,index)=><Artwork key={work.id} work={work} index={index} editable={editable} onOpen={onOpen} onReorder={onReorder} draggedWork={draggedWork}/>)}
      <label className="art add-art"><input type="file" accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm" multiple onChange={onAdd}/><span className="add-art-icon">＋</span><strong>Adicionar imagens ou vídeos</strong><small>PNG, JPG, WebP, GIF, MP4 ou WebM</small></label>
    </motion.div>
  </section>;
}

