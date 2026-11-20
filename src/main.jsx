import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import products from './catalogue.json';
import About from './About.jsx';
import Boutique from './Boutique.jsx';
import './style.css';
import './react.css';
import './footer.css';

const asset = (slug, kind) => `/assets/${slug}-${kind}`;
const navigation = [['Accueil', '/'], ['À propos', '/a-propos/'], ['Boutique', '/boutique/'], ['Contact', '/contact/']];
const heroCopy = {
  'bois-noble': { title: 'Le caractère,', emphasis: 'à l’état pur.', text: 'Bois sculpté, verre fumé. L’élégance prend du relief.' },
  'rose-velours': { title: 'La douceur,', emphasis: 'sans compromis.', text: 'Rose profonde, lumière délicate. Toute la force du contraste.' },
  'ambre-soyeux': { title: 'Laissez une', emphasis: 'empreinte lumineuse.', text: 'L’ambre et ses reflets dorés, dans une mise en scène chaleureuse.' },
  'eclat-d-agrumes': { title: 'Réveillez', emphasis: 'vos sens.', text: 'Vert tendre, verre lumineux. Une échappée au grand air.' },
  'musc-de-soie': { title: 'L’élégance,', emphasis: 'tout en douceur.', text: 'Soie ivoire et courbes douces. La beauté dans le détail.' },
  'nuit-epicee': { title: 'Révélez', emphasis: 'votre intensité.', text: 'Des facettes sombres, un éclat cuivré. La nuit prend une autre allure.' },
};
const materialStories = {
  'bois-noble': { title: 'Le bois,', emphasis: 'tout en relief.', text: 'Le grain du noyer dialogue avec le verre fumé. Une rencontre de textures brutes et de lignes précises.', detail: 'Explorer Bois Noble' },
  'rose-velours': { title: 'La rose,', emphasis: 'en clair-obscur.', text: 'Le rouge des pétales répond au verre rosé. La lumière révèle la délicatesse de chaque détail.', detail: 'Explorer Rose Velours' },
  'ambre-soyeux': { title: 'La lumière,', emphasis: 'comme matière.', text: 'Des éclats d’ambre, des transparences dorées. Les reflets dessinent un décor chaleureux autour du flacon.', detail: 'Explorer Ambre Soyeux' },
  'eclat-d-agrumes': { title: 'Le végétal,', emphasis: 'en pleine lumière.', text: 'Le feuillage et les agrumes composent un décor vivant. Le verre capte les ombres et la lumière du jour.', detail: 'Explorer Éclat d’Agrumes' },
  'musc-de-soie': { title: 'La soie,', emphasis: 'au fil des courbes.', text: 'Des plis ivoire, un bouchon doré, une silhouette opaline. Les matières composent un même mouvement.', detail: 'Explorer Musc de Soie' },
  'nuit-epicee': { title: 'La nuit,', emphasis: 'en facettes.', text: 'La pierre sombre et les reflets cuivrés soulignent la géométrie du verre. Un jeu d’ombre et d’éclat.', detail: 'Explorer Nuit Épicée' },
};

function useMedia(query) {
  const [matches, setMatches] = useState(() => matchMedia(query).matches);
  useEffect(() => {
    const media = matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);
  return matches;
}

function useLocation() {
  const [location, setLocation] = useState(() => window.location.pathname + window.location.search);
  useEffect(() => {
    const update = () => setLocation(window.location.pathname + window.location.search);
    const onClick = event => {
      const anchor = event.target.closest('a');
      if (!anchor || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || anchor.target || anchor.hasAttribute('download')) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.hash) return;
      event.preventDefault();
      if (url.pathname + url.search === window.location.pathname + window.location.search) return;
      history.pushState(null, '', url.pathname + url.search);
      update();
    };
    window.addEventListener('popstate', update);
    document.addEventListener('click', onClick);
    return () => { window.removeEventListener('popstate', update); document.removeEventListener('click', onClick); };
  }, []);
  return location;
}

function Header({ active, location }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { setOpen(false); }, [location]);
  useEffect(() => {
    let frame;
    const scroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        const current = Math.max(0, window.scrollY);
        setScrolled(wasScrolled => current > (wasScrolled ? 12 : 40));
      });
    };
    window.addEventListener('scroll', scroll, { passive: true });
    scroll();
    return () => { window.removeEventListener('scroll', scroll); cancelAnimationFrame(frame); };
  }, []);
  const menu = useRef(null);
  useEffect(() => {
    const escape = event => { if (event.key === 'Escape' && open) { setOpen(false); menu.current?.focus(); } };
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [open]);
  return <header className={`site-header${active === 'Accueil' ? ' is-home' : ''}${scrolled ? ' is-scrolled' : ''}`}>
    <div className="wordmark"><img src="/assets/hafs-logo-officiel-transparent.svg" alt="HAFS" width="130" height="64" /></div>
    <button ref={menu} className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={open} aria-controls="navigation">Menu <span aria-hidden="true">{open ? '×' : '☰'}</span></button>
    <nav id="navigation" className={open ? 'is-open' : ''} aria-label="Navigation principale">{navigation.map(([name, url]) => <a key={url} href={url} aria-current={active === name ? 'page' : undefined}>{name}</a>)}</nav>
  </header>;
}

function ContactIcon({ type }) {
  return <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{type === 'email' ? <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></> : type === 'phone' ? <path d="M21 16.5v3a1.5 1.5 0 0 1-1.7 1.5A18.5 18.5 0 0 1 3 4.7 1.5 1.5 0 0 1 4.5 3h3L9 7.5 7 9a14 14 0 0 0 8 8l1.5-2Z" /> : <><path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>}</svg>;
}

function Footer() {
  return <footer className="site-footer">
    <div className="footer-content">
      <div className="footer-brand-block"><img src="/assets/hafs-logo-officiel-transparent.svg" alt="HAFS" width="150" height="74" loading="lazy" /><p>HAFS est une marque de parfums qui se dévoile à travers des univers singuliers.</p></div>
      <address className="footer-contact-list"><a className="contact-row" href="mailto:serviceclient@hafs.com"><ContactIcon type="email" /><span>serviceclient@hafs.com</span></a><div className="contact-row"><ContactIcon type="phone" /><span>Téléphone <span className="contact-pending">À venir</span></span></div><div className="contact-row"><ContactIcon type="location" /><span>Localisation <span className="contact-pending">À venir</span></span></div></address>
    </div>
    <div className="footer-bottom-row"><nav className="footer-links" aria-label="Navigation de pied de page">{navigation.map(([name, url]) => <a key={url} href={url}>{name}</a>)}</nav><small>© {new Date().getFullYear()} HAFS. Tous droits réservés.</small></div>
  </footer>;
}

function AmbientVideo({ src, poster, className = '', children }) {
  const video = useRef(null);
  const container = useRef(null);
  const [visible, setVisible] = useState(false);
  const [tabActive, setTabActive] = useState(!document.hidden);
  const [ready, setReady] = useState(false);
  const reduced = useMedia('(prefers-reduced-motion: reduce)');
  const enabled = visible && tabActive && !reduced && !navigator.connection?.saveData;
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .2 });
    observer.observe(container.current);
    const update = () => setTabActive(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);
  useEffect(() => {
    const element = video.current;
    setReady(false);
    if (!element || !enabled) { element?.pause(); return; }
    element.play().catch(() => {});
    const resume = () => element.play().catch(() => {});
    document.addEventListener('pointerdown', resume, { once: true, passive: true });
    return () => { element.pause(); document.removeEventListener('pointerdown', resume); };
  }, [enabled, src]);
  return <span ref={container} className={`ambient-media ${className}`}>
    {children}
    <video ref={video} src={enabled ? src : undefined} poster={poster} className={ready ? 'is-playing' : ''} autoPlay muted loop playsInline preload="none" aria-hidden="true" onPlaying={() => setReady(true)} onError={() => setReady(false)} />
  </span>;
}

function ProductCard({ product, catalogue = false }) {
  return <article className="product">
    <a className="product-picture" href={product.url}>
      <AmbientVideo src={asset(product.slug, 'portrait.mp4')} poster={asset(product.slug, 'portrait.webp')}>
        <img src={asset(product.slug, 'portrait.webp')} alt={`Flacon HAFS ${product.name}`} width="941" height="1672" loading="lazy" />
      </AmbientVideo>{!catalogue && <span className="picture-action">Découvrir</span>}
    </a>
    <div className="product-copy"><h3><a href={product.url}>{product.name}</a></h3><p>{product.accent}</p>{catalogue && <a className="boutique-card-link" href={product.url}>Découvrir le parfum</a>}</div>
  </article>;
}

function CollectionCarousel() {
  const mobile = useMedia('(max-width: 700px)');
  const [slide, setSlide] = useState(0);
  const [resetting, setResetting] = useState(false);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tabActive, setTabActive] = useState(!document.hidden);
  const reduced = useMedia('(prefers-reduced-motion: reduce)');
  const rail = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .15 });
    observer.observe(rail.current);
    const update = () => setTabActive(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);
  useEffect(() => {
    if (mobile || paused || !visible || !tabActive || reduced || resetting || slide >= products.length) return;
    const timer = setTimeout(() => setSlide(value => value + 1), 5200);
    return () => clearTimeout(timer);
  }, [slide, paused, visible, tabActive, reduced, resetting, mobile]);
  useEffect(() => {
    if (!resetting) return;
    let second;
    const first = requestAnimationFrame(() => { second = requestAnimationFrame(() => setResetting(false)); });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); };
  }, [resetting]);
  const reset = event => {
    if (event.target !== event.currentTarget || slide < products.length) return;
    setResetting(true); setSlide(0);
  };
  return <div ref={rail} className={`collection-carousel${reduced || mobile ? ' is-static' : ''}`} aria-label="Découvrir les parfums" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={event => { setPaused(true); const card = event.target.closest('article.product'); const cards = [...event.currentTarget.querySelectorAll('.collection-track > article.product')]; const index = cards.indexOf(card); if (!mobile && !reduced && index >= 0) setSlide(Math.min(index, products.length - 3)); }} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
    <div className={`collection-track${resetting ? ' is-resetting' : ''}`} style={{ '--slide': slide }} onTransitionEnd={reset}>
      {(mobile ? products.slice(0, 3) : products).map(p => <ProductCard key={p.slug} product={p} />)}
      {!reduced && !mobile && products.slice(0, 3).map(p => <div key={`copy-${p.slug}`} className="carousel-copy" aria-hidden="true" inert><ProductCard product={p} /></div>)}
    </div>
  </div>;
}

function Hero() {
  const mobile = useMedia('(max-width: 700px)');
  const reduced = useMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(navigator.connection?.saveData);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(true);
  const [tabActive, setTabActive] = useState(!document.hidden);
  const video = useRef(null);
  const section = useRef(null);
  const timer = useRef(null);
  const product = products[index];
  const copy = heroCopy[product.slug];
  const animate = !reduced && !saveData;
  const src = asset(product.slug, `${mobile ? 'portrait' : 'landscape'}.mp4`);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .15 });
    observer.observe(section.current);
    const onVisibility = () => setTabActive(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', onVisibility); clearTimeout(timer.current); };
  }, []);
  useEffect(() => { setPlaying(false); clearTimeout(timer.current); }, [src, animate]);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    if (!animate || !visible || !tabActive) { element.pause(); clearTimeout(timer.current); return; }
    if (element.ended) {
      timer.current = setTimeout(() => setIndex(value => (value + 1) % products.length), 1000);
    } else element.play().catch(() => {});
    const resume = () => element.play().catch(() => {});
    document.addEventListener('pointerdown', resume, { once: true, passive: true });
    return () => { clearTimeout(timer.current); document.removeEventListener('pointerdown', resume); };
  }, [src, animate, visible, tabActive]);
  const onEnded = () => {
    if (visible && tabActive) timer.current = setTimeout(() => setIndex(value => (value + 1) % products.length), 700);
  };
  return <section ref={section} className="hero" aria-labelledby="hero-title">
    <picture className="hero-poster"><source media="(max-width: 700px)" srcSet={asset(product.slug, 'portrait.webp')} /><img src={asset(product.slug, 'paysage.webp')} alt={`Flacon HAFS ${product.name}`} width="1672" height="941" fetchPriority="high" /></picture>
    {animate && <video ref={video} key={src} src={src} className={`hero-video${playing ? ' is-playing' : ''}`} autoPlay muted playsInline preload="metadata" aria-hidden="true" onPlaying={() => setPlaying(true)} onEnded={onEnded} onError={() => { setPlaying(false); if (visible && tabActive) timer.current = setTimeout(() => setIndex(value => (value + 1) % products.length), 8000); }} />}
    <div className="hero-shade" /><div key={product.slug} className="hero-content"><h1 id="hero-title">{copy.title}<br /><em>{copy.emphasis}</em></h1><p className="hero-intro">{copy.text}</p></div><a className="button hero-cta" href="/boutique/">Explorer la collection</a>
  </section>;
}

function FragranceShowcase() {
  const [paused, setPaused] = useState(false);
  const [index, setIndex] = useState(4);
  const [visible, setVisible] = useState(false);
  const [tabActive, setTabActive] = useState(!document.hidden);
  const reduced = useMedia('(prefers-reduced-motion: reduce)');
  const section = useRef(null);
  const product = products[index];
  const story = materialStories[product.slug];
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .25 });
    observer.observe(section.current);
    const update = () => setTabActive(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);
  useEffect(() => {
    if (paused || !visible || !tabActive || reduced || navigator.connection?.saveData) return;
    const timer = setTimeout(() => setIndex(value => (value + 1) % products.length), 6500);
    return () => clearTimeout(timer);
  }, [index, visible, tabActive, reduced, paused]);
  return <section ref={section} className="fragrance-showcase" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }} aria-label="Les univers HAFS en images">
    <picture key={product.slug} className="showcase-picture"><source media="(max-width: 700px)" srcSet={asset(product.slug, 'portrait.webp')} /><img src={asset(product.slug, 'paysage.webp')} alt={`L’univers de ${product.name}`} width="1672" height="941" loading="lazy" /></picture>
    <div className="showcase-shade" /><div key={`story-${product.slug}`} className="showcase-copy"><h2>{story.title}<br /><em>{story.emphasis}</em></h2><p className="showcase-accent">{story.text}</p><a className="text-link" href={product.url}>{story.detail}</a></div>
  </section>;
}

function Home() {
  return <><Hero />
    <section id="collection" className="collection section-wrap"><div className="section-heading"><h2>La collection,<br className="mobile-break" /> en <em>perspective.</em></h2></div><CollectionCarousel /><div className="collection-actions"><a className="button collection-cta" href="/boutique/">Voir toute la collection</a></div></section>
    <FragranceShowcase />
    <section className="home-contact section-wrap"><div><h2>Une préférence ?<br /><em>Parlons-en.</em></h2><p>Un flacon, une couleur, une ambiance vous attire ? Partagez vos envies pour commencer l’échange.</p></div><a className="button button-dark" href="/contact/">Préparer mon message</a></section>
  </>;
}

function Contact({ search }) {
  const selected = products.find(p => p.slug === new URLSearchParams(search).get('parfum'));
  const [prepared, setPrepared] = useState('');
  const [status, setStatus] = useState('');
  const result = useRef(null);
  useEffect(() => { if (prepared) result.current?.focus(); }, [prepared]);
  const submit = event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') || '').trim();
    setPrepared(`Bonjour HAFS,\n\nJe souhaite des renseignements sur : ${data.get('perfume')}.\n\n${String(data.get('message')).trim()}${name ? `\n\n${name}` : ''}`);
    setStatus('Votre message est prêt. Il n’a pas été envoyé.');
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(prepared); setStatus('Message copié. Aucun envoi n’a été effectué.'); }
    catch { result.current.focus(); result.current.select(); setStatus('Copiez le texte sélectionné avec Ctrl+C ou le menu Copier.'); }
  };
  return <><section className="page-intro section-wrap"><p className="eyebrow">Une question, une envie</p><h1>Parlons de<br />votre <em>signature.</em></h1><p>Un parfum vous intrigue ? Préparez votre demande de renseignements.</p></section><section className="contact-layout section-wrap"><div><h2>À votre <em>écoute.</em></h2><p>Précisez le parfum qui vous intéresse et les informations souhaitées : disponibilité, formats ou prix.</p><p className="contact-status">Le formulaire prépare un message à copier et à envoyer à serviceclient@hafs.com. Vous pouvez aussi utiliser le lien e-mail en pied de page.</p></div><form onSubmit={submit}><label htmlFor="name">Votre nom <span>facultatif</span></label><input id="name" name="name" autoComplete="name" maxLength="100" /><label htmlFor="perfume">Le parfum qui vous intéresse</label><select id="perfume" name="perfume" defaultValue={selected?.name || 'La collection'}><option value="La collection">Toute la collection</option>{products.map(p => <option key={p.slug} value={p.name}>{p.name}</option>)}</select><label htmlFor="message">Votre demande</label><textarea id="message" name="message" rows="5" required minLength="5" maxLength="2000" placeholder="J’aimerais connaître les formats et la disponibilité…" /><button className="button button-dark" type="submit">Préparer ma demande </button><p id="form-status" role="status">{status}</p>{prepared && <div id="prepared-message"><label htmlFor="message-result">Votre message prêt à copier</label><textarea ref={result} id="message-result" value={prepared} readOnly rows="6" /><button className="text-link" type="button" onClick={copy}>Copier le message</button></div>}</form></section></>;
}

function ProductDetail({ product }) {
  const mobile = useMedia('(max-width: 700px)');
  return <><section className="product-detail section-wrap"><div className="detail-photo"><img src={asset(product.slug, 'portrait.webp')} alt={`Flacon ${product.name}`} width="941" height="1672" fetchPriority="high" /></div><div className="detail-copy"><a className="back-link" href="/boutique/">La collection</a><p className="eyebrow">HAFS · Univers {product.family.toLowerCase()}</p><h1>{product.name}</h1><p className="detail-accent">{product.accent}</p><p>{product.text}</p><a className="button button-dark" href={`/contact/?parfum=${product.slug}`}>Demander des renseignements</a><p className="detail-note">Disponibilité, formats et prix sur demande.</p><details><summary>Découvrir son univers</summary><p>{product.text}</p></details></div></section><section className="product-film section-wrap"><div className="section-heading"><div><p className="eyebrow">Le parfum en mouvement</p><h2>Entrez dans <em>son univers.</em></h2></div></div><AmbientVideo src={asset(product.slug, `${mobile ? 'portrait' : 'landscape'}.mp4`)} poster={asset(product.slug, `${mobile ? 'portrait' : 'paysage'}.webp`)} className={mobile ? 'portrait-film' : ''}><img src={asset(product.slug, `${mobile ? 'portrait' : 'paysage'}.webp`)} alt={`${product.name} en mouvement`} loading="lazy" /></AmbientVideo></section></>;
}

function Faq() {
  return <><section className="page-intro section-wrap"><p className="eyebrow">Informations</p><h1>Quelques <em>réponses.</em></h1></section><section className="faq section-wrap"><details><summary>Comment choisir mon parfum ?</summary><p>Explorez les univers dans la boutique et demandez des renseignements sur les parfums qui vous attirent.</p></details><details><summary>Où consulter les prix et la disponibilité ?</summary><p>Préparez une demande de renseignements depuis la fiche du parfum. Les conditions commerciales restent à confirmer auprès de HAFS.</p></details><details><summary>Comment commander ou connaître les conditions de livraison ?</summary><p>Le site présente actuellement le catalogue. Les modalités de commande, de livraison et de retour seront précisées avant l’ouverture des ventes.</p></details></section></>;
}

function App() {
  const location = useLocation();
  const [rawPath, search = ''] = location.split('?');
  const path = rawPath.endsWith('/') ? rawPath : `${rawPath}/`;
  const product = products.find(p => p.url === path);
  const active = path === '/' ? 'Accueil' : path === '/a-propos/' ? 'À propos' : path === '/contact/' ? 'Contact' : path === '/boutique/' || product ? 'Boutique' : '';
  const main = useRef(null);
  const first = useRef(true);
  useEffect(() => {
    document.title = `${product?.name || active || (path === '/faq/' ? 'Questions fréquentes' : 'Page introuvable')} — HAFS`;
    if (first.current) first.current = false;
    else { window.scrollTo({ top: 0, behavior: 'instant' }); main.current?.focus({ preventScroll: true }); }
  }, [location, product, active, path]);
  let content;
  if (path === '/') content = <Home />;
  else if (path === '/boutique/') content = <Boutique products={products} ProductCard={ProductCard} />;
  else if (path === '/a-propos/') content = <About />;
  else if (path === '/contact/') content = <Contact key={location} search={search} />;
  else if (path === '/faq/') content = <Faq />;
  else if (product) content = <ProductDetail key={product.slug} product={product} />;
  else content = <section className="page-intro section-wrap"><p className="eyebrow">Page introuvable</p><h1>Revenons à<br /><em>l’essentiel.</em></h1><a className="text-link" href="/">Retour à l’accueil</a></section>;
  return <><a className="skip" href="#contenu">Aller au contenu</a><Header active={active} location={location} /><main key={location} className={`page-enter${path === '/' ? ' home-page' : ''}`} id="contenu" tabIndex="-1" ref={main}>{content}</main><Footer /></>;
}

createRoot(document.getElementById('root')).render(<App />);
