import { useMemo, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const reveal={hidden:{opacity:0,y:28},visible:{opacity:1,y:0,transition:{duration:.35,ease:[.22,1,.36,1]}}};
const GRID_COLUMNS=12,ROW_HEIGHT=28,ROW_GAP=12;

function getLayout(work,index,columns){
  const span=Math.max(1,Math.min(GRID_COLUMNS,Math.round(work.layout?.span||GRID_COLUMNS/columns)));
  return {column:Math.max(0,Math.min(GRID_COLUMNS-span,Math.round(work.layout?.column??(index%columns)*span))),row:Math.max(0,Math.round(work.layout?.row??Math.floor(index/columns)*6)),span,rowSpan:Math.max(1,Math.round(work.layout?.rowSpan||5))};
}

function Artwork({work,onOpen,index,editable,layout,onMoveStart,onMove,onMoveEnd}) {
  const reduceMotion=useReducedMotion(),imageUrl=work.mediaUrl||work.data||work.remoteUrl;
  const textLines=(work.text||'').split('\n'),maxLineLength=Math.max(1,...textLines.map(line=>line.length));
  return <motion.article custom={index} variants={reveal} initial={reduceMotion?'visible':'hidden'} whileInView="visible" whileHover={!editable&&!reduceMotion?{y:-9,scale:1.018,transition:{duration:.22,ease:'easeOut'}}:undefined} viewport={{once:true,amount:.16}}
    className={`art ${work.style||'uploaded'} ${imageUrl?'has-upload':''} ${editable?'lego-art':''}`} style={{...(imageUrl&&work.kind!=='video'?{backgroundImage:`url("${imageUrl}")`}:{}),...(editable?{gridColumn:`${layout.column+1} / span ${layout.span}`,gridRow:`${layout.row+1} / span ${layout.rowSpan}`}: {})}}
    onPointerDown={event=>{if(!editable||event.button!==0)return;event.preventDefault();event.stopPropagation();event.currentTarget.setPointerCapture(event.pointerId);onMoveStart(work.id,event,layout)}}
    onPointerMove={event=>{if(editable&&event.currentTarget.hasPointerCapture(event.pointerId))onMove(work.id,event)}}
    onPointerUp={event=>{if(editable&&event.currentTarget.hasPointerCapture(event.pointerId)){event.currentTarget.releasePointerCapture(event.pointerId);onMoveEnd(work.id,event)}}}
    onPointerCancel={event=>onMoveEnd(work.id,event)}
    onClick={event=>{if(event.currentTarget.dataset.suppressClick){event.preventDefault();event.stopPropagation();delete event.currentTarget.dataset.suppressClick;return}onOpen(work)}} onKeyDown={event=>event.key==='Enter'&&onOpen(work)} role="button" tabIndex="0" aria-label={`${editable?'Segure e arraste para organizar ou clique para ampliar':'Ampliar'} ${work.title}`}>
    {work.kind==='video'&&work.mediaUrl ? <><video className="gallery-video" src={work.mediaUrl} muted playsInline preload="metadata"/><span className="video-badge">▶ Vídeo</span></> : <>{!work.data && !work.mediaUrl && (work.style==='emotes' ? <span className="emote-row"><span>👻</span><span>🥰</span><span>😠</span><span>😴</span></span> : <span className="emoji">{work.emoji||''}</span>)}{work.text && <span className="arttext" style={{'--art-max-chars':maxLineLength,'--art-line-count':textLines.length}}>{textLines.map((line,index)=><span key={index}>{line}</span>)}</span>}</>}
    <small>{work.title}</small>
  </motion.article>;
}

export default function Portfolio({works,filter,onFilter,onOpen,onAdd,onMoveWorks,editable=false}) {
  const drag=useRef(null);
  const categories=useMemo(()=>['Todos',...new Set(works.map(work=>work.category||'Trabalhos'))],[works]);
  const visible=filter==='Todos'?works:works.filter(work=>(work.category||'Trabalhos')===filter);
  const galleryRef=useRef(null);
  const columns=Math.max(1,Math.min(4,Number(getComputedStyle(document.documentElement).getPropertyValue('--gallery-columns'))||3));
  const layouts=new Map(works.map((work,index)=>[work.id,getLayout(work,index,columns)]));
  function startMove(id,event,layout){
    const rect=galleryRef.current?.getBoundingClientRect();if(!rect)return;
    drag.current={id,pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,rect,origin:{...layout},current:{...layout},moved:false};
  }
  function move(id,event){
    const state=drag.current;if(!state||state.id!==id)return;
    const dx=event.clientX-state.startX,dy=event.clientY-state.startY;
    if(Math.abs(dx)+Math.abs(dy)>4)state.moved=true;
    const cellWidth=(state.rect.width-(GRID_COLUMNS-1)*ROW_GAP)/GRID_COLUMNS,cellHeight=ROW_HEIGHT+ROW_GAP;
    const column=Math.max(0,Math.min(GRID_COLUMNS-state.origin.span,state.origin.column+Math.round(dx/(cellWidth+ROW_GAP))));
    const row=Math.max(0,state.origin.row+Math.round(dy/cellHeight));
    state.current={...state.origin,column,row};
    event.currentTarget.style.gridColumn=`${column+1} / span ${state.current.span}`;event.currentTarget.style.gridRow=`${row+1} / span ${state.current.rowSpan}`;
  }
  function endMove(id,event){
    const state=drag.current;if(!state||state.id!==id)return;
    if(state.moved){
      event.currentTarget.dataset.suppressClick='true';suppressNextClick(event.currentTarget);
      const target=works.find(work=>work.id!==id&&(()=>{const p=layouts.get(work.id);return state.current.column<p.column+p.span&&state.current.column+state.current.span>p.column&&state.current.row<p.row+p.rowSpan&&state.current.row+state.current.rowSpan>p.row})());
      const targetLayout=target?layouts.get(target.id):null;
      onMoveWorks?.(id,state.current,target?.id,targetLayout?state.origin:null);
    }
    drag.current=null;
  }
  function suppressNextClick(element){element.dataset.suppressClick='true';window.setTimeout(()=>{delete element.dataset.suppressClick},350)}
  return <section id="portfolio" className={`portfolio-section${editable?' portfolio-editing':''}`}>
    <div className="divider" />
    <div className="filters" role="tablist" aria-label="Categorias de arte">
      {categories.map(category=><button key={category} className={filter===category?'active':''} role="tab" aria-selected={filter===category} onClick={()=>onFilter(category)}>{category}</button>)}
    </div>
    <motion.div ref={galleryRef} className={`gallery${editable?' lego-gallery':''}`} layout={!editable}>
      {visible.map((work,index)=><Artwork key={work.id} work={work} index={index} onOpen={onOpen} editable={editable} layout={layouts.get(work.id)} onMoveStart={startMove} onMove={move} onMoveEnd={endMove}/>) }
      <label className="art add-art" style={editable?{gridColumn:'1 / -1',gridRow:`${Math.max(1,...[...layouts.values()].map(layout=>layout.row+layout.rowSpan))+1} / span 5`}:undefined}><input type="file" accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm" multiple onChange={onAdd}/><span className="add-art-icon">＋</span><strong>Adicionar imagens ou vídeos</strong><small>PNG, JPG, WebP, GIF, MP4 ou WebM</small></label>
    </motion.div>
  </section>;
}
