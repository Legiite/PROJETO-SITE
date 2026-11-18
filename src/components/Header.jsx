import { useState } from 'react';

export default function Header({onEdit, brand, editMode=false,sections={portfolio:true}}) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <header className="site-header" id="top">
    <a className="brand" href="#top" aria-label="Ghostfolio início"><span className="logo">👻</span><b>{brand.slice(0,5)}<span>{brand.slice(5)}</span></b></a>
    <nav className={menuOpen ? 'nav-open' : ''}>
      {sections.portfolio&&<a href="#portfolio" onClick={()=>setMenuOpen(false)}>Portfólio</a>}
      <a href="#profile" onClick={()=>setMenuOpen(false)}>Sobre</a>
      <button className="navbutton" onClick={()=>{onEdit();setMenuOpen(false)}}>{editMode?'✓　Concluir edição':'✎　Editar portfólio'}</button>
    </nav>
    <button id="menu" className="menu-toggle" aria-label="Abrir menu" aria-expanded={menuOpen} onClick={()=>setMenuOpen(!menuOpen)}>☰</button>
  </header>;
}

