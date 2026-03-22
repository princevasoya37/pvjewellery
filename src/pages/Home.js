import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories, fetchCollections } from '../store/productsSlice';
import { getImageUrl } from '../api/client';

const SHAPES = [
  { name: 'Round', slug: 'Round', icon: '◆' },
  { name: 'Princess', slug: 'Princess', icon: '◇' },
  { name: 'Emerald', slug: 'Emerald', icon: '▭' },
  { name: 'Pear', slug: 'Pear', icon: '▢' },
  { name: 'Oval', slug: 'Oval', icon: '⬭' },
];

const BUILD_STEPS = [
  { step: 1, title: 'Choose your Setting', options: ['Gold', 'Platinum', 'Rose Gold'] },
  { step: 2, title: 'Select your Diamond', options: ['Filter by Carat', 'Filter by Cut'] },
  { step: 3, title: 'Make it Yours', options: ['Personalise & Order'] },
];

const FOUR_CS = [
  { name: 'Cut', short: 'Brilliance', desc: 'The cut determines how light reflects. Ideal cut maximises sparkle.' },
  { name: 'Color', short: 'Purity', desc: 'From D (colourless) to Z. We offer D–J for exceptional clarity.' },
  { name: 'Clarity', short: 'Flawlessness', desc: 'Fewer inclusions mean a clearer stone. VVS to SI for most pieces.' },
  { name: 'Carat', short: 'Weight', desc: 'One carat equals 200mg. Size and presence for your moment.' },
];

const TESTIMONIALS = [
  { text: 'The quality exceeded my expectations. My engagement ring is stunning.', author: 'Sarah M.', rating: 5 },
  { text: 'Ethically sourced and beautifully crafted. Worth every penny.', author: 'James L.', rating: 5 },
  { text: 'From consultation to delivery, the experience was flawless.', author: 'Priya K.', rating: 5 },
];

const TRUST_ITEMS = [
  { label: 'Free Insured Shipping', icon: '📦' },
  { label: 'Lifetime Warranty', icon: '🛡️' },
  { label: '30-Day Returns', icon: '↩️' },
  { label: 'Personal Concierge', icon: '💎' },
];

export default function Home() {
  const dispatch = useDispatch();
  const { list } = useSelector((s) => s.products);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 8, sort: 'newest' }));
    dispatch(fetchCategories());
    dispatch(fetchCollections());
  }, [dispatch]);

  useEffect(() => {
    const t = setInterval(() => setTestimonialIndex((i) => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const editorsChoice = list[0];
  const newArrivals = list.slice(0, 6);

  return (
    <div className="min-h-screen space-y-20">
      {/* 1. Hero Cinematic */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden rounded-3xl border border-slate-800/50 bg-slate-950 shadow-[0_40px_120px_rgba(15,23,42,0.75)]">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-slate-900/20 to-slate-900/70 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 opacity-70"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&q=80)' }}
        />
        <div className="absolute -left-40 top-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute -right-32 bottom-10 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
        <div className="relative z-20 max-w-4xl mx-auto px-4 text-center text-white">
          <p className="section-eyebrow mb-3 text-primary-200">PV JEWELLERY</p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-4">
            Brilliance, <span className="text-accent">Designed</span> for Modern Love.
          </h1>
          <p className="text-lg md:text-xl text-slate-100/80 mb-10 max-w-2xl mx-auto">
            A refined digital boutique for engagement rings and fine jewellery with concierge-level guidance.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/products" className="btn-primary px-7 py-3 text-sm md:text-base">
              Browse Collection
            </Link>
            <Link
              to="/products"
              className="btn-secondary bg-white/0 text-slate-100 border-slate-400/60 hover:bg-slate-900/40 hover:border-white/80"
            >
              Book a virtual consult
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-xs md:text-sm text-slate-200/80">
            <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> Handcrafted in India</span>
            <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> Conflict‑free diamonds</span>
            <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> Lifetime care & sizing</span>
          </div>
        </div>
      </section>

      {/* 2. Shop by Shape */}
      <section className="py-10 bg-surface-muted/40 rounded-3xl border border-slate-100/60">
        <div className="section-shell px-0">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <p className="section-eyebrow">START WITH A SILHOUETTE</p>
              <h2 className="section-title mt-2">Shop by diamond shape</h2>
            </div>
            <Link to="/products" className="hidden md:inline-flex text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all designs →
            </Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 justify-center flex-wrap md:flex-nowrap">
            {SHAPES.map((s) => (
              <Link
                key={s.slug}
                to={`/products?shape=${encodeURIComponent(s.slug)}`}
                className="flex-shrink-0 w-36 h-36 md:w-44 md:h-44 rounded-2xl bg-gradient-to-br from-white to-surface-muted border border-slate-100 shadow-sm flex flex-col items-center justify-center hover:shadow-soft-lg hover:-translate-y-1 hover:border-primary-200 transition-all duration-200 group"
              >
                <span className="text-4xl md:text-5xl text-primary-500 group-hover:scale-110 transition-transform mb-2">{s.icon}</span>
                <span className="font-display text-sm font-medium text-slate-800 group-hover:text-primary-700">{s.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Build Your Own */}
      <section className="py-14 bg-surface rounded-3xl border border-slate-100 shadow-soft-lg">
        <div className="max-w-5xl mx-auto text-center px-4">
          <p className="section-eyebrow mb-2">CUSTOM STUDIO</p>
          <h2 className="section-title mb-3">Design a ring as unique as your story</h2>
          <p className="text-slate-600 mb-12 max-w-2xl mx-auto">A guided, three-step flow that keeps the craftsmanship serious and the experience effortless.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {BUILD_STEPS.map((b) => (
              <div key={b.step} className="relative">
                <div className="w-20 h-20 mx-auto rounded-full bg-primary-50 text-primary-600 font-display text-2xl font-semibold flex items-center justify-center mb-4 shadow-sm">
                  {b.step}
                </div>
                <h3 className="font-display text-lg font-semibold text-slate-900 mb-2">{b.title}</h3>
                <ul className="text-sm text-slate-600 space-y-1">
                  {b.options.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
                {b.step < 3 && <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-primary-100" />}
              </div>
            ))}
          </div>
          <Link to="/products" className="btn-primary px-8 py-3">
            Launch the ring builder
          </Link>
        </div>
      </section>

      {/* 4. Featured Collections */}
      <section className="py-16 bg-surface-muted/60 rounded-3xl border border-slate-100">
        <div className="section-shell px-0">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <span className="section-eyebrow text-accent-dark">CURATED FOR EVERY OCCASION</span>
              <h2 className="section-title mt-2">Featured collections</h2>
            </div>
            <Link to="/products" className="text-primary-600 hover:text-primary-700 font-medium text-sm">Browse all jewellery →</Link>
          </div>

          {list.length === 0 ? (
            <p className="text-gray-500 py-12 text-center">No products yet. Add some from the admin.</p>
          ) : (
            <>
              {/* Editor's Choice highlight */}
              {editorsChoice && (
                <Link
                  to={`/products/${editorsChoice.slug}`}
                  className="card overflow-hidden mb-10 group block md:flex md:flex-row"
                >
                  <div className="md:w-1/2 aspect-square md:aspect-auto md:min-h-[320px] bg-slate-900/5 relative overflow-hidden">
                    {editorsChoice.images?.[0] ? (
                      <img
                        src={getImageUrl(editorsChoice.images[0])}
                        alt={editorsChoice.name}
                        className="w-full h-full object-cover group-hover:scale-105 group-hover:rotate-[0.3deg] transition duration-500 ease-out-soft"
                        onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">No image</div>
                    )}
                    <span className="absolute top-4 left-4 pill-badge bg-slate-900/80 text-slate-50 border-slate-700">
                      Editor&apos;s choice
                    </span>
                  </div>
                  <div className="md:w-1/2 p-8 flex flex-col justify-center">
                    <h3 className="font-display text-2xl font-semibold text-slate-900 mb-2">{editorsChoice.name}</h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">{editorsChoice.description}</p>
                    <p className="text-primary-600 font-semibold text-lg">₹{Number(editorsChoice.price).toLocaleString('en-IN')}</p>
                    <span className="text-sm text-primary-600 mt-3 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      View collection
                      <span>→</span>
                    </span>
                  </div>
                </Link>
              )}

              {/* New Arrivals grid */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-xl font-semibold text-slate-900">New arrivals</h3>
                  <p className="text-xs text-slate-500">Updated as you publish new designs in admin</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {newArrivals.map((p) => (
                    <div key={p._id} className="card group hover:-translate-y-1 hover:shadow-soft-lg transition-all duration-200">
                      <div className="aspect-square bg-slate-100 overflow-hidden relative">
                        <Link to={`/products/${p.slug}`} className="block w-full h-full">
                          <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">No image</div>
                          {p.images?.[0] && (
                            <img
                              src={getImageUrl(p.images[0])}
                              alt={p.name}
                              className="relative z-10 w-full h-full object-cover group-hover:scale-105 transition duration-300 ease-out-soft"
                              onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                            />
                          )}
                        </Link>
                        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/25 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 z-20">
                          <button
                            type="button"
                            onClick={() => setQuickViewProduct(p)}
                            className="text-white text-xs font-medium bg-slate-900/70 hover:bg-slate-900/90 px-4 py-2 rounded-full"
                          >
                            Quick View
                          </button>
                        </div>
                      </div>
                      <Link to={`/products/${p.slug}`} className="block p-4">
                        <h4 className="font-medium text-slate-900 truncate">{p.name}</h4>
                        <p className="text-primary-600 font-semibold mt-1 text-sm">
                          ₹{typeof p.price === 'number' ? p.price.toLocaleString('en-IN') : p.price}
                        </p>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 5. Diamond Education */}
      <section className="py-16 bg-surface rounded-3xl border border-slate-100">
        <div className="section-shell px-0">
          <div className="text-center mb-12">
            <span className="section-eyebrow text-accent-dark">EXPERTISE</span>
            <h2 className="section-title mt-1">Diamond education</h2>
            <p className="text-slate-600 mt-2 max-w-2xl mx-auto">Understanding the 4 Cs helps you choose with confidence.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {FOUR_CS.map((c) => (
              <div key={c.name} className="p-6 rounded-xl border border-slate-100 bg-surface-muted/70 hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-200">
                <h3 className="font-display text-lg font-semibold text-slate-900">{c.name}</h3>
                <p className="text-xs text-accent-dark font-medium uppercase tracking-wider mt-1">{c.short}</p>
                <p className="text-sm text-slate-600 mt-2">{c.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600 mb-8">
            <span className="flex items-center gap-2"><span className="text-accent-dark">✓</span> Ethically sourced</span>
            <span className="flex items-center gap-2"><span className="text-accent-dark">✓</span> Conflict-free</span>
            <span className="flex items-center gap-2"><span className="text-accent-dark">✓</span> GIA & IGI certified</span>
          </div>
          <div className="text-center">
            <Link to="/products" className="btn-primary">Learn about diamond quality</Link>
          </div>
        </div>
      </section>

      {/* 6. Social Proof */}
      <section className="py-16 bg-surface-muted/50 rounded-3xl border border-slate-100">
        <div className="section-shell px-0">
          <h2 className="section-title text-center mb-4">Shop the look</h2>
          <p className="text-slate-600 text-center mb-10">Real moments from our community.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-2xl bg-slate-200 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-primary-100 to-accent-light flex items-center justify-center text-slate-500 text-sm">
                  @look{i}
                </div>
              </div>
            ))}
          </div>

          <h2 className="font-display text-2xl font-semibold text-slate-900 text-center mb-8">What our customers say</h2>
          <div className="max-w-2xl mx-auto text-center">
            <blockquote className="text-lg text-slate-700 italic">&ldquo;{TESTIMONIALS[testimonialIndex].text}&rdquo;</blockquote>
            <p className="mt-4 text-accent-dark font-medium">— {TESTIMONIALS[testimonialIndex].author}</p>
            <p className="text-sm text-slate-500">★★★★★</p>
            <div className="flex justify-center gap-2 mt-4">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTestimonialIndex(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === testimonialIndex ? 'bg-primary-600' : 'bg-gray-300'}`}
                  aria-label={`Review ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Concierge & Trust Bar */}
      <section className="py-12 bg-surface rounded-3xl border border-slate-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {TRUST_ITEMS.map((t) => (
              <div key={t.label} className="text-center">
                <span className="text-3xl block mb-2">{t.icon}</span>
                <span className="font-display text-sm font-semibold text-slate-900">{t.label}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-600 mt-6">
            Overwhelmed by choices? Our <strong>Personal Concierge</strong> is here to help. Contact us for a one-on-one with a diamond expert.
          </p>
        </div>
      </section>

      {/* Quick View modal (simple) */}
      {quickViewProduct && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4" onClick={() => setQuickViewProduct(null)}>
          <div className="glass-panel rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-xl font-semibold text-slate-900">{quickViewProduct.name}</h3>
            <p className="text-primary-600 font-medium mt-2">₹{Number(quickViewProduct.price).toLocaleString('en-IN')}</p>
            <Link to={`/products/${quickViewProduct.slug}`} className="btn-primary mt-4 inline-flex">
              View full details
            </Link>
            <button type="button" onClick={() => setQuickViewProduct(null)} className="block mt-3 text-slate-500 text-sm hover:text-slate-700">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

