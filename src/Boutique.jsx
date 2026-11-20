import React, { useState } from 'react';
import './boutique.css';

export default function Boutique({ products, ProductCard }) {
  const [filter, setFilter] = useState('Tous');
  const families = ['Tous', ...new Set(products.map(product => product.family))];
  const shown = products.filter(product => filter === 'Tous' || product.family === filter);
  return <div className="boutique-page">
    <section className="boutique-hero" aria-labelledby="boutique-title">
      <img className="boutique-cover" src="/assets/ambre-soyeux-paysage.webp" alt="Ambre Soyeux, flacon aux reflets dorés dans un décor vert profond" width="1672" height="941" fetchPriority="high" />
      <div className="boutique-hero-shade" />
      <div className="section-wrap boutique-hero-copy"><h1 id="boutique-title">À chacun<br />son <em>univers.</em></h1><p>Explorez les créations HAFS.<br />Un parfum vous intrigue ? Parlons-en.</p></div>
    </section>

    <section className="section-wrap boutique-catalogue" aria-labelledby="catalogue-title">
      <div className="boutique-heading"><h2 id="catalogue-title">{filter === 'Tous' ? <>Les <em>parfums.</em></> : <>L’univers <em>{filter.toLowerCase()}.</em></>}</h2><p className="boutique-count" role="status" aria-live="polite" aria-atomic="true">{shown.length} parfum{shown.length > 1 ? 's' : ''} à découvrir</p></div>
      <div className="boutique-toolbar"><div className="boutique-filters" role="group" aria-label="Filtrer par univers">{families.map(family => <button type="button" key={family} aria-pressed={filter === family} onClick={() => setFilter(family)}>{family === 'Tous' ? 'Tous les parfums' : family}</button>)}</div></div>
      <div className="product-grid boutique-grid">{shown.map(product => <ProductCard key={product.slug} product={product} catalogue />)}</div>
    </section>

    <section className="boutique-guidance section-wrap" aria-labelledby="guidance-title"><div><h2 id="guidance-title">Une envie, une <em>question ?</em></h2><p>Indiquez le parfum qui vous intéresse et ce que vous souhaitez savoir. Nous pourrons échanger sur vos préférences.</p></div><a className="button button-dark" href="/contact/">Demander des renseignements</a></section>
  </div>;
}
