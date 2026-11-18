import { useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const reveal={hidden:{opacity:0,y:28},visible:{opacity:1,y:0,transition:{duration:.35,ease:[.22,1,.36,1]}}};

function Artwork({work,onOpen,index,editable,dragging,onPointerDown,onPointerMove,onPointerUp,onPointerCancel}) {
  const reduceMotion=useReducedMotion(),imageUrl=work.mediaUrl||work.data||work.remoteUrl;
  const textLines=(work.text||'').split('\n'),maxLineLength=Math.max(1,...textLines.map(line=>line.length));
  const isDragging=dragging?.id===work.id;
  return <motion.article custom={index} variants={reveal} initial={reduceMotion?'visible':'hidden'} whileInView="visible" whileHover={!editable&&!reduceMotion?{y:-9,scale:1.018,transition:{duration:.22,ease:'easeOut'}}:undefined} viewport={{once:true,amount:.16}}
    data-work-id={work.id} className={`art ${work.style||'uploaded'} ${imageUrl?'has-upload':''} ${editable?'lego-art':''}${isDragging?' is-dragging':''}`} style={{...(imageUrl&&work.kind!=='video'?{backgroundImage:`url("${imageUrl}")`}:{}),x:isDragging?dragging.dx:0,y:isDragging?dragging.dy:0}}
    onPointerDown={event=>onPointerDown(work.id,event)} onPointerMove={event=>onPointerMove(work.id,event)} onPointerUp={event=>onPointerUp(work.id,event)} onPointerCancel={onPointerCancel}
    onClick={event=>{if(event.currentTarget.dataset.suppressClick){event.preventDefault();event.stopPropagation();delete event.currentTarget.dataset.suppressClick;return}onOpen(work)}} onKeyDown={event=>event.key==='Enter'&&onOpen(work)} role="button" tabIndex="0" aria-label={`${editable?'Segure e arraste para mudar de posição':'Ampliar'} ${work.title}`}>
    {work.kind==='video'&&work.mediaUrl ? <><video className="gallery-video" src={work.mediaUrl} muted playsInline preload="metadata"/><span className="video-badge">▶ Vídeo</span></> : <>{!work.data && !work.mediaUrl && (work.style==='emotes' ? <span className="emote-row"><span>👻</span><span>🥰</span><span>😠</span><span>😴</span></span> : <span className="emoji">{work.emoji||''}</span>)}{work.text && <span className="arttext" style={{'--art-max-chars':maxLineLength,'--art-line-count':textLines.length}}>{textLines.map((line,index)=><span key={index}>{line}</span>)}</span>}</>}
    <small>{work.title}</small>
  </motion.article>;
}

export default function Portfolio({works,filter,onFilter,onOpen,onAdd,onReorder,editable=false}) {
  const drag=useRef(null),[dragging,setDragging]=useState(null),galleryRef=useRef(null);
  const categories=useMemo(()=>['Todos',...new Set(works.map(work=>work.category||'Trabalhos'))],[works]);
  const visible=filter==='Todos'?works:works.filter(work=>(work.category||'Trabalhos')===filter);
  function startMove(id,event){
    if(!editable||event.button!==0)return;
    event.preventDefault();event.stopPropagation();event.currentTarget.setPointerCapture(event.pointerId);
    drag.current={id,pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,dx:0,dy:0,moved:false};
  }
  function move(id,event){
    const state=drag.current;if(!state||state.id!==id)return;
    state.dx=event.clientX-state.startX;state.dy=event.clientY-state.startY;
    if(Math.abs(state.dx)+Math.abs(state.dy)>5)state.moved=true;
    setDragging({id,dx:state.dx,dy:state.dy});
  }
  function endMove(id,event){
    const state=drag.current;if(!state||state.id!==id)return;
    if(state.moved){
      event.currentTarget.dataset.suppressClick='true';
      window.setTimeout(()=>{delete event.currentTarget.dataset.suppressClick},350);
      const under=document.elementFromPoint(event.clientX,event.clientY)?.closest('.lego-art');
      let target=under?.dataset.workId;
      if(!target||target===id){
        const cards=[...galleryRef.current.querySelectorAll('.lego-art')].filter(card=>card.dataset.workId!==id);
        target=cards.sort((a,b)=>distanceToCard(event.clientX,event.clientY,a)-distanceToCard(event.clientX,event.clientY,b))[0]?.dataset.workId;
      }
      if(target&&target!==id)onReorder?.(id,target);
    }
    drag.current=null;setDragging(null);
  }
  function distanceToCard(x,y,card){const rect=card.getBoundingClientRect(),dx=x-(rect.left+rect.width/2),dy=y-(rect.top+rect.height/2);return dx*dx+dy*dy}
  function cancelMove(){drag.current=null;setDragging(null)}
  return <section id="portfolio" className={`portfolio-section${editable?' portfolio-editing':''}`}>
    <div className="divider" />
    <div className="filters" role="tablist" aria-label="Categorias de arte">
      {categories.map(category=><button key={category} className={filter===category?'active':''} role="tab" aria-selected={filter===category} onClick={()=>onFilter(category)}>{category}</button>)}
    </div>
    <motion.div ref={galleryRef} className={`gallery${editable?' lego-gallery':''}`} layout={!editable}>
      {visible.map((work,index)=><Artwork key={work.id} work={work} index={index} onOpen={onOpen} editable={editable} dragging={dragging} onPointerDown={startMove} onPointerMove={move} onPointerUp={endMove} onPointerCancel={cancelMove}/>)}
      <label className="art add-art"><input type="file" accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm" multiple onChange={onAdd}/><span className="add-art-icon">＋</span><strong>Adicionar imagens ou vídeos</strong><small>PNG, JPG, WebP, GIF, MP4 ou WebM</small></label>
    </motion.div>
  </section>;
}
