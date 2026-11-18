export default function ImageEditControl({onChange,label='Alterar imagem',className=''}) {
  return <label className={`image-edit-control ${className}`} title={label} onClick={event=>event.stopPropagation()}>
    <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" aria-label={label} onChange={onChange}/>
    <span className="image-edit-symbol" aria-hidden="true">✎</span><span className="image-edit-label">{label}</span>
  </label>;
}

