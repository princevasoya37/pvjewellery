import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories, fetchCollections } from '../store/productsSlice';
import { getImageUrl } from '../api/client';

const SOLITAIRE_SHAPES = [
  {
    id: 'round',
    name: 'Round Brilliant',
    slug: 'Round',
    tagline: '58 FACETS - MAXIMUM BRILLIANCE',
    carat: '2.12',
    colour: 'E',
    clarity: 'VVS1',
    origin: 'Botswana',
    price: '19,75,000',
    image: '/images/diamond_round.png',
    iconSvg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="8" />
      </svg>
    ),
    previewSvg: (
      <svg className="w-full h-full text-gold drop-shadow-[0_0_25px_rgba(212,175,55,0.6)]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="50" cy="50" r="32" />
        <circle cx="50" cy="50" r="22" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        <polygon points="50,18 68,50 50,82 32,50" strokeWidth="1" opacity="0.4" />
      </svg>
    )
  },
  {
    id: 'princess',
    name: 'Princess',
    slug: 'Princess',
    tagline: 'MODERN - SHARP GEOMETRY',
    carat: '1.82',
    colour: 'E',
    clarity: 'VS1',
    origin: 'Canada',
    price: '14,20,000',
    image: '/images/diamond_princess.png',
    iconSvg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" rx="1" />
      </svg>
    ),
    previewSvg: (
      <svg className="w-full h-full text-gold drop-shadow-[0_0_25px_rgba(212,175,55,0.6)]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
        <rect x="22" y="22" width="56" height="56" transform="rotate(45 50 50)" rx="2" />
        <rect x="32" y="32" width="36" height="36" transform="rotate(45 50 50)" strokeWidth="1" opacity="0.6" />
        <line x1="50" y1="10" x2="50" y2="90" strokeWidth="1" opacity="0.4" />
        <line x1="10" y1="50" x2="90" y2="50" strokeWidth="1" opacity="0.4" />
      </svg>
    )
  },
  {
    id: 'emerald',
    name: 'Emerald',
    slug: 'Emerald',
    tagline: 'STEP-CUT - HALL OF MIRRORS',
    carat: '2.50',
    colour: 'D',
    clarity: 'FL',
    origin: 'South Africa',
    price: '24,50,000',
    image: '/images/diamond_emerald.png',
    iconSvg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="7,3 17,3 21,7 21,17 17,21 7,21 3,17 3,7" />
      </svg>
    ),
    previewSvg: (
      <svg className="w-full h-full text-gold drop-shadow-[0_0_25px_rgba(212,175,55,0.6)]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polygon points="32,15 68,15 82,29 82,71 68,85 32,85 18,71 18,29" />
        <polygon points="36,22 64,22 74,32 74,68 64,78 36,78 26,68 26,32" strokeWidth="1" opacity="0.6" />
        <rect x="35" y="32" width="30" height="36" strokeWidth="1" opacity="0.4" />
      </svg>
    )
  },
  {
    id: 'pear',
    name: 'Pear',
    slug: 'Pear',
    tagline: 'TEARDROP - SOFT DRAMA',
    carat: '1.95',
    colour: 'F',
    clarity: 'VVS2',
    origin: 'Australia',
    price: '16,80,000',
    image: '/images/diamond_pear.png',
    iconSvg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 3 C12 3 19 12 19 16.5 C19 20.08 15.865 22 12 22 C8.135 22 5 20.08 5 16.5 C5 12 12 3 12 3 Z" />
      </svg>
    ),
    previewSvg: (
      <svg className="w-full h-full text-gold drop-shadow-[0_0_25px_rgba(212,175,55,0.6)]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M50,12 C50,12 80,48 80,68 C80,84 66,92 50,92 C34,92 20,84 20,68 C20,48 50,12 50,12 Z" />
        <path d="M50,22 C50,22 72,52 72,68 C72,80 62,85 50,85 C38,85 28,80 28,68 C28,52 50,22 50,22 Z" strokeWidth="1" opacity="0.6" />
      </svg>
    )
  },
  {
    id: 'oval',
    name: 'Oval',
    slug: 'Oval',
    tagline: 'ELONGATED - FLATTERING',
    carat: '2.15',
    colour: 'E',
    clarity: 'VVS1',
    origin: 'Botswana',
    price: '19,75,000',
    image: '/images/diamond_oval.png',
    iconSvg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="12" cy="12" rx="7" ry="10" />
      </svg>
    ),
    previewSvg: (
      <svg className="w-full h-full text-gold drop-shadow-[0_0_25px_rgba(212,175,55,0.6)]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
        <ellipse cx="50" cy="50" rx="28" ry="38" />
        <ellipse cx="50" cy="50" rx="20" ry="28" strokeWidth="1" opacity="0.6" />
        <polygon points="50,12 70,50 50,88 30,50" strokeWidth="1" opacity="0.4" />
      </svg>
    )
  }
];

const BUILD_STEPS = [
  { step: '01', title: 'Choose Your Setting', desc: 'Select from 18k Champagne Gold, Royal Platinum, or Rose Gold handcrafted settings.' },
  { step: '02', title: 'Select Flawless Diamond', desc: 'Filter through our curated vault of GIA certified, ethically flawless diamonds.' },
  { step: '03', title: 'Master Atelier Craft', desc: 'Our master artisans forge your bespoke piece with uncompromising precision.' },
];

const TESTIMONIALS = [
  { 
    quote: "The bespoke engagement ring we commissioned exceeded every expectation. The champagne gold setting and flawless diamond are a true work of art.", 
    author: "Lady Eleanor V.", 
    location: "London, UK" 
  },
  { 
    quote: "Ethically sourced diamonds with uncompromising clarity. PV Jewellery has been our family's trusted maison for three generations.", 
    author: "Arjun K. Singhania", 
    location: "Mumbai, India" 
  },
  { 
    quote: "From the private virtual consultation to the white-glove insured delivery, the entire experience was absolute perfection.", 
    author: "Sophia & Marcus L.", 
    location: "New York, USA" 
  },
];

const IG_GALLERY = [
  { id: 1, img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80", title: "Haute Joaillerie Gala" },
  { id: 2, img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80", title: "Flawless Engagement Series" },
  { id: 3, img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80", title: "Royal Sapphire Collection" },
  { id: 4, img: "https://images.unsplash.com/photo-1611591472159-2592d3057a62?w=800&q=80", title: "Bespoke Emerald Choker" },
];

const FEATURED_COLLECTIONS = [
  {
    name: "Haute Joaillerie",
    subtitle: "High Jewellery Masterpieces",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1000&q=80",
    slug: "high-jewellery"
  },
  {
    name: "Bridal & Solitaires",
    subtitle: "Timeless Expressions of Love",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1000&q=80",
    slug: "engagement"
  },
  {
    name: "Royal Gemstones",
    subtitle: "Emeralds, Sapphires & Rubies",
    image: "https://images.unsplash.com/photo-1611591472159-2592d3057a62?w=1000&q=80",
    slug: "gemstones"
  },
  {
    name: "Heritage Gold",
    subtitle: "Artisanal 18k & 24k Gold Creations",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1000&q=80",
    slug: "gold"
  }
];

const HERO_SLIDES = [
  {
    id: 1,
    badge: 'HAUTE JOAILLERIE',
    title: 'Timeless Elegance,',
    highlight: 'Crafted for Eternity',
    subtitle: 'A private maison of jewellers crafting heirlooms in 18-karat champagne gold and ethically sourced diamonds.',
    image: '/images/hero_landscape_1.png',
    primaryCta: { label: 'Explore Solitaires', link: '/products?type=engagement' },
    secondaryCta: { label: 'Discover Atelier', link: '/products?type=custom' }
  },
  {
    id: 2,
    badge: 'ROYAL EMERALD',
    title: 'Vivid Emeralds &',
    highlight: 'Flawless Solitaires',
    subtitle: 'Hand-selected Colombian emeralds paired with VVS brilliant-cut diamonds forged by master artisans.',
    image: '/images/hero_landscape_2.png',
    primaryCta: { label: 'View Royal Emeralds', link: '/products?type=high-jewellery' },
    secondaryCta: { label: 'Explore Collections', link: '/products' }
  },
  {
    id: 3,
    badge: 'CELESTIAL SAPPHIRE',
    title: 'Deep Royal Sapphires &',
    highlight: 'Diamond Halos',
    subtitle: 'Deep royal blue Ceylon sapphires encased in delicate brilliant diamond halos, reflecting cosmic radiance.',
    image: '/images/hero_landscape_3.png',
    primaryCta: { label: 'Explore Sapphires', link: '/products?type=gemstones' },
    secondaryCta: { label: 'Maison Journal', link: '/products?type=journal' }
  },
  {
    id: 4,
    badge: 'BRIDAL SOLITAIRES',
    title: 'Compose Your Eternal',
    highlight: 'Bridal Legacy',
    subtitle: 'GIA-certified, ethically flawless diamonds set in handcrafted royal platinum and champagne gold.',
    image: '/images/hero_landscape_4.png',
    primaryCta: { label: 'Book Consultation', link: '/account' },
    secondaryCta: { label: 'Solitaire Vault', link: '/products?type=engagement' }
  },
  {
    id: 5,
    badge: 'HERITAGE GOLD',
    title: 'Artisanal Heritage Gold &',
    highlight: 'Modern Romance',
    subtitle: 'Handcrafted 18k and 24k gold masterwork, echoing three generations of maison heritage.',
    image: '/images/hero_landscape_5.png',
    primaryCta: { label: 'Discover Heritage Gold', link: '/products?type=gold' },
    secondaryCta: { label: 'Explore Vaults', link: '/products' }
  }
];

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list } = useSelector((s) => s.products);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedShapeId, setSelectedShapeId] = useState('oval');
  const carouselRef = useRef(null);
  const selectedShape = SOLITAIRE_SHAPES.find(s => s.id === selectedShapeId) || SOLITAIRE_SHAPES[4];
  const themeMode = useSelector((s) => s.theme?.themeMode || 'light');
  const isDark = themeMode === 'dark';

  useEffect(() => {
    dispatch(fetchProducts({ limit: 12, sort: 'newest' }));
    dispatch(fetchCategories());
    dispatch(fetchCollections());
  }, [dispatch]);

  // Hero Auto-Carousel Timer (4.5 seconds per slide)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const bestSellers = list && list.length > 0 ? list : [
    { _id: '1', name: 'Solitaire Diamond Engagement Ring', price: 285000, slug: 'solitaire-ring', description: 'Flawless 1.5 carat round brilliant diamond in 18k champagne gold.', images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80'] },
    { _id: '2', name: 'Royal Emerald Choker Necklace', price: 950000, slug: 'emerald-choker', description: 'Bespoke Colombian emeralds accompanied by pear cut VVS diamonds.', images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80'] },
    { _id: '3', name: 'Celestial Sapphire Drop Earrings', price: 420000, slug: 'sapphire-earrings', description: 'Deep royal blue Ceylon sapphires encased in delicate diamond halos.', images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80'] },
    { _id: '4', name: 'Art Deco Diamond Tennis Bracelet', price: 680000, slug: 'tennis-bracelet', description: 'Impeccable line of identical D-color emerald cut diamonds.', images: ['https://images.unsplash.com/photo-1611591472159-2592d3057a62?w=800&q=80'] },
  ];

  return (
    <div className={`min-h-screen font-sans pb-24 overflow-hidden transition-colors duration-500 ${
      isDark ? 'bg-[#0D0A07] text-[#F9F6F0]' : 'bg-[#FBF9F6] text-[#111111]'
    }`}>
      
      {/* 1. Ultra-Luxury Hero Auto-Carousel Section */}
      <section 
        className="relative w-full min-h-[72vh] sm:min-h-[80vh] lg:min-h-[86vh] overflow-hidden flex items-center pt-16 bg-[#0D0A07]"
      >
        {/* Carousel Background Slides with Smooth Ken-Burns Zoom & HD Clarity */}
        {HERO_SLIDES.map((slide, index) => {
          const isCurrent = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isCurrent ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Ultra-HD Widescreen Landscape Background Image with Vibrant Brightness */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className={`w-full h-full object-cover object-center transform transition-transform duration-[7000ms] ease-out ${
                    isCurrent ? 'scale-105' : 'scale-100'
                  }`}
                  style={{ filter: 'brightness(1.08) contrast(1.05)', imageRendering: 'crisp-edges' }}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </div>

              {/* Light Subtle Gradient Overlays to keep background 100% bright & vibrant */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent z-10" />
            </div>
          );
        })}

        {/* Hero Content Container */}
        <div className="relative z-20 max-w-[1700px] mx-auto px-6 sm:px-12 lg:px-16 w-full text-white">
          <div className="max-w-3xl space-y-6 sm:space-y-8 animate-fadeIn text-left">
            
            {/* Category Pill Badge */}
            <div>
              <span className="inline-block px-3.5 py-1 bg-gold/20 border border-gold/40 text-gold text-[10px] sm:text-xs font-semibold uppercase tracking-[0.35em] shadow-sm backdrop-blur-sm">
                {HERO_SLIDES[currentSlide].badge}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif font-light text-4xl sm:text-6xl md:text-7xl lg:text-[80px] leading-[1.08] tracking-wide text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">
              {HERO_SLIDES[currentSlide].title}<br />
              <span className="italic font-light text-gold font-serif">
                {HERO_SLIDES[currentSlide].highlight}
              </span>
            </h1>

            {/* Short Descriptive Copy */}
            <p className="font-sans text-sm sm:text-base font-light text-gray-100 max-w-xl leading-relaxed tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              {HERO_SLIDES[currentSlide].subtitle}
            </p>

            {/* Dual CTAs (Primary + Secondary Buttons) */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
              <Link
                to={HERO_SLIDES[currentSlide].primaryCta.link}
                className="px-8 py-4 bg-gold hover:bg-gold-light text-black font-sans text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-300 shadow-luxury hover:-translate-y-0.5 text-center"
              >
                {HERO_SLIDES[currentSlide].primaryCta.label} →
              </Link>
              <Link
                to={HERO_SLIDES[currentSlide].secondaryCta.link}
                className="px-8 py-4 border border-white/70 hover:border-gold text-white hover:text-gold hover:bg-black/40 font-sans text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-300 backdrop-blur-xs text-center"
              >
                {HERO_SLIDES[currentSlide].secondaryCta.label}
              </Link>
            </div>

          </div>
        </div>

        {/* Automatic Carousel Progress Indicator Bar (Non-interactive, subtle line) */}
        <div className="absolute bottom-0 left-0 right-0 z-30 flex h-[3px] bg-black/40">
          {HERO_SLIDES.map((slide, idx) => (
            <div key={slide.id} className="flex-1 h-full relative overflow-hidden bg-white/15 border-r border-black/40 last:border-r-0">
              {idx === currentSlide && (
                <div 
                  key={`slide-bar-${currentSlide}`}
                  className="h-full bg-gold w-full origin-left transition-all duration-[4500ms] ease-linear"
                />
              )}
              {idx < currentSlide && (
                <div className="h-full w-full bg-gold/70" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 2. Infinite Marquee Announcement Band (Exactly replicating User Demo Screenshot) */}
      <section className="w-full bg-[#F5F2EB] py-5 border-y border-gold/20 overflow-hidden font-sans shadow-inner">
        <div className="flex w-max animate-marquee items-center text-xs uppercase tracking-[0.3em] font-medium text-[#1A1A1A]">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center">
              <span className="mx-8 sm:mx-12">LIFETIME WARRANTY ON EVERY PIECE</span>
              <span className="text-gold text-sm font-serif">✦</span>
              <span className="mx-8 sm:mx-12">HAND-FINISHED IN OUR MUMBAI ATELIER</span>
              <span className="text-gold text-sm font-serif">✦</span>
              <span className="mx-8 sm:mx-12">ETHICALLY SOURCED DIAMONDS</span>
              <span className="text-gold text-sm font-serif">✦</span>
              <span className="mx-8 sm:mx-12">COMPLIMENTARY INSURED WORLDWIDE SHIPPING</span>
              <span className="text-gold text-sm font-serif">✦</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Collections Section (Exactly replicating Screenshot Typography & Layout) */}
      <section className="section-shell pt-20 sm:pt-28 pb-16 sm:pb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-gold/20">
          <div>
            <span className="font-sans text-xs uppercase tracking-[0.35em] text-gold font-semibold block mb-4">
              FEATURED COLLECTIONS
            </span>
            <h2 className="font-serif font-light text-5xl sm:text-7xl lg:text-[80px] text-luxury-black tracking-tight leading-[1.05]">
              Curated for the<br />
              <span className="italic font-light text-gold font-serif">Singular Moment.</span>
            </h2>
          </div>
          <Link to="/products" className="text-xs uppercase tracking-[0.25em] font-semibold text-luxury-black hover:text-gold transition-colors mt-6 md:mt-0 flex items-center gap-3">
            <span>Discover All Vaults</span>
            <span className="text-lg leading-none font-light">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURED_COLLECTIONS.map((col) => (
            <Link
              key={col.slug}
              to={`/products?type=${col.slug}`}
              className="group relative h-[500px] bg-luxury-black overflow-hidden shadow-soft-lg flex flex-col justify-end border border-gold/20"
            >
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>

              <div className="relative z-10 p-8 border-t border-gold/30 bg-black/40 backdrop-blur-sm transition-all duration-300 group-hover:bg-luxury-black/80">
                <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold font-medium block mb-1">
                  {col.subtitle}
                </span>
                <h3 className="font-display text-2xl font-light text-white mb-3 tracking-wide">
                  {col.name}
                </h3>
                <span className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] font-semibold text-white group-hover:text-gold transition-colors">
                  <span>Explore Vault</span>
                  <span className="group-hover:translate-x-2 transition-transform duration-300 font-light">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Maison Story / Philosophy */}
      <section className="section-shell py-16 sm:py-24 border-t border-gold/20">
        <div className="max-w-4xl mx-auto text-center space-y-6 bg-white border border-gold/20 p-12 sm:p-20 shadow-soft-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
          <span className="section-eyebrow block">MAISON PHILOSOPHY</span>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-luxury-black leading-snug">
            Where Impeccable Heritage <br className="hidden sm:block" /> Meets Modern Architectural Romance
          </h2>
          <div className="w-16 h-[1px] bg-gold mx-auto my-6" />
          <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed max-w-3xl mx-auto font-sans">
            Every creation at PV Jewellery begins with an uncompromising dedication to perfection. Our master gemologists traverse the globe to secure only the top 0.1% of ethically sourced natural diamonds, handcrafting them into heirloom talismans meant to echo across eternity.
          </p>
        </div>
      </section>

      {/* 5. Best Sellers Carousel */}
      <section className="section-shell overflow-hidden py-16 sm:py-24 border-t border-gold/20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-4 border-b border-gold/30">
          <div>
            <span className="section-eyebrow block mb-2">MAISON FAVORITES</span>
            <h2 className="section-title">Best Sellers</h2>
          </div>
          
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <button
              type="button"
              onClick={() => scrollCarousel('left')}
              className="w-12 h-12 border border-gold/60 flex items-center justify-center hover:bg-gold hover:text-luxury-black transition-colors focus:outline-none"
              aria-label="Previous items"
            >
              <svg className="w-5 h-5 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollCarousel('right')}
              className="w-12 h-12 border border-gold/60 flex items-center justify-center hover:bg-gold hover:text-luxury-black transition-colors focus:outline-none"
              aria-label="Next items"
            >
              <svg className="w-5 h-5 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div 
          ref={carouselRef}
          className="flex gap-8 overflow-x-auto no-scrollbar scroll-smooth pb-8 pt-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {bestSellers.map((prod) => (
            <div 
              key={prod._id}
              className="w-[300px] sm:w-[350px] shrink-0 bg-white border border-gold/20 shadow-soft-lg group flex flex-col justify-between overflow-hidden"
            >
              <div className="relative aspect-square bg-[#F5F5F5] overflow-hidden">
                <Link to={`/products/${prod.slug}`} className="block w-full h-full">
                  {prod.images && prod.images[0] ? (
                    <img
                      src={getImageUrl(prod.images[0])}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-sans text-gray-400">Exquisite Masterpiece</div>
                  )}
                </Link>

                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 z-20">
                  <button
                    type="button"
                    onClick={() => setQuickViewProduct(prod)}
                    className="px-6 py-3 bg-luxury-black text-gold border border-gold font-sans text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-white hover:text-luxury-black transition-all shadow-lg"
                  >
                    Quick View
                  </button>
                </div>

                <span className="absolute top-4 left-4 pill-badge shadow-sm">
                  Maison Vault
                </span>
              </div>

              <div className="p-6 flex flex-col justify-between flex-1 border-t border-gold/10">
                <div>
                  <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-gold font-medium block mb-1">High Joaillerie</span>
                  <Link to={`/products/${prod.slug}`}>
                    <h4 className="font-display text-xl font-light text-luxury-black line-clamp-1 group-hover:text-gold transition-colors">{prod.name}</h4>
                  </Link>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-2 font-light">{prod.description}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                  <span className="font-sans text-sm font-semibold text-luxury-black tracking-wide">
                    ₹{Number(prod.price).toLocaleString('en-IN')}
                  </span>
                  <Link 
                    to={`/products/${prod.slug}`} 
                    className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-gold hover:text-luxury-black transition-colors"
                  >
                    Acquire →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Bespoke Custom Studio & Solitaire Configurator (Redesigned Quiet-Luxury Aesthetic) */}
      <section className={`py-24 sm:py-32 relative overflow-hidden font-sans transition-colors duration-500 border-t border-b ${
        isDark ? 'bg-[#111111] text-[#F9F6F0] border-white/5' : 'bg-[#FBF9F6] text-[#111111] border-black/5'
      }`}>
        <div className="max-w-[1550px] mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
          
          {/* Header Area: Title on the left with generous letter spacing and wide margins */}
          <div className="mb-16 sm:mb-20 max-w-4xl text-left">
            <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.4em] text-[#767676] font-medium block mb-4">
              Bespoke Studio
            </span>
            <h2 className={`text-5xl sm:text-7xl lg:text-[76px] font-serif font-light tracking-[0.02em] leading-[1.1] ${
              isDark ? 'text-white' : 'text-[#111111]'
            }`}>
              Compose your <br />
              <span className="italic font-light text-[#C5A880] font-serif">eternal solitaire.</span>
            </h2>
          </div>

          {/* Interactive Diamond Shape Selector: Clean borderless text tags with golden underline animations when selected */}
          <div className={`flex flex-wrap items-center gap-x-8 gap-y-4 border-b pb-6 mb-16 ${
            isDark ? 'border-white/10' : 'border-black/5'
          }`}>
            {SOLITAIRE_SHAPES.map((shape) => {
              const isSelected = shape.id === selectedShapeId;
              return (
                <button
                  key={shape.id}
                  onClick={() => setSelectedShapeId(shape.id)}
                  className={`group relative pb-4 text-xs sm:text-sm uppercase tracking-[0.3em] font-semibold transition-colors duration-300 ${
                    isSelected 
                      ? 'text-[#C5A880]' 
                      : isDark ? 'text-gray-500 hover:text-gray-200' : 'text-gray-400 hover:text-gray-800'
                  }`}
                >
                  {shape.name}
                  {/* Subtle golden underline animation */}
                  <span className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C5A880] transition-transform duration-300 origin-left ${
                    isSelected ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Configurator Area: 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Column 1: Live Preview (glassmorphism container with soft shadow, no target frames or corner brackets) */}
            <div className="lg:col-span-7 flex justify-center w-full">
              <div className={`relative w-full max-w-[540px] aspect-square rounded-2xl flex items-center justify-center p-8 transition-all duration-500 ${
                isDark 
                  ? 'bg-white/[0.02] backdrop-blur-xl border border-white/5 shadow-[0_24px_80px_rgba(0,0,0,0.5)]' 
                  : 'bg-white/[0.60] backdrop-blur-xl border border-[#C5A880]/10 shadow-[0_24px_80px_rgba(10,10,10,0.04)]'
              }`}>
                {/* Concentric subtle background circles (quiet aesthetics) */}
                <div className={`absolute w-[80%] aspect-square rounded-full border border-current/[0.02] pointer-events-none`} />
                <div className={`absolute w-[55%] aspect-square rounded-full border border-current/[0.03] pointer-events-none`} />
                
                {/* 3D Diamond Render Placeholder */}
                <img
                  src={selectedShape.image}
                  alt={`${selectedShape.name} Diamond Render`}
                  className="w-[72%] h-[72%] object-contain select-none pointer-events-none drop-shadow-[0_15px_45px_rgba(197,168,128,0.15)] animate-float z-10"
                />

                {/* Central Display Tag */}
                <div className="absolute bottom-6 left-6 font-sans text-[10px] uppercase tracking-[0.3em] text-[#767676] font-medium">
                  {selectedShape.slug} / Est. ₹{selectedShape.price}
                </div>
              </div>
            </div>

            {/* Column 2: Specifications & CTA */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-10 text-left">
              <div>
                <h3 className={`font-serif text-3xl font-light mb-8 ${
                  isDark ? 'text-white' : 'text-[#111111]'
                }`}>
                  Bespoke Specifications
                </h3>
                
                {/* Clean, transparent spec grid using thin light dividers */}
                <div className={`grid grid-cols-2 gap-x-8 gap-y-8 border-t border-b py-8 ${
                  isDark ? 'border-white/10' : 'border-black/5'
                }`}>
                  <div className="space-y-1.5">
                    <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#767676] block font-medium">
                      Carat Weight
                    </span>
                    <span className={`font-serif text-xl ${isDark ? 'text-[#F9F6F0]' : 'text-[#111111]'}`}>
                      {selectedShape.carat} ct
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#767676] block font-medium">
                      Colour Grade
                    </span>
                    <span className={`font-serif text-xl ${isDark ? 'text-[#F9F6F0]' : 'text-[#111111]'}`}>
                      {selectedShape.colour} Grade
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#767676] block font-medium">
                      Clarity Grade
                    </span>
                    <span className={`font-serif text-xl ${isDark ? 'text-[#F9F6F0]' : 'text-[#111111]'}`}>
                      {selectedShape.clarity} (GIA)
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#767676] block font-medium">
                      Ethical Origin
                    </span>
                    <span className={`font-serif text-xl ${isDark ? 'text-[#F9F6F0]' : 'text-[#111111]'}`}>
                      {selectedShape.origin}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button: Sleek, wide champagne-gold button with tracking-widest text */}
              <Link
                to={`/products?shape=${selectedShape.slug}`}
                className="w-full py-5 px-8 bg-[#C5A880] hover:bg-[#b59871] text-white font-sans text-xs uppercase tracking-[0.3em] font-semibold flex items-center justify-center gap-3 transition-colors duration-500 shadow-sm"
              >
                <span>RESERVE THIS STONE</span>
                <span className="text-sm font-light">→</span>
              </Link>

            </div>
            
          </div>

        </div>
      </section>

      {/* 3. Process Steps Section (Delicate, Minimalist 3-Column Grid) */}
      <section className={`py-24 sm:py-32 border-b transition-colors duration-500 ${
        isDark ? 'bg-[#0D0A07] border-white/5' : 'bg-[#FBF9F6] border-black/5'
      }`}>
        <div className="max-w-[1550px] mx-auto px-6 sm:px-12 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
            {BUILD_STEPS.map((step) => (
              <div key={step.step} className="space-y-6 flex flex-col items-start text-left">
                {/* Delicate, thin gold numbers */}
                <span className="font-serif text-4xl sm:text-5xl font-light text-[#C5A880] tracking-wider block">
                  {step.step}
                </span>
                
                {/* Elegant serif subheadings */}
                <h3 className={`font-serif text-2xl sm:text-3xl font-light tracking-wide ${
                  isDark ? 'text-[#F9F6F0]' : 'text-[#111111]'
                }`}>
                  {step.title}
                </h3>
                
                {/* Clean spacing with no background/border container */}
                <p className={`font-sans text-sm font-light leading-relaxed tracking-wide ${
                  isDark ? 'text-gray-400' : 'text-[#767676]'
                }`}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Premium Editorial Customer Testimonials (Words of Reverence) */}
      <section className={`py-28 sm:py-36 px-6 relative overflow-hidden transition-colors duration-500 border-b ${
        isDark ? 'bg-[#111111] text-[#F9F6F0] border-white/5' : 'bg-[#FBF9F6] text-[#111111] border-black/5'
      }`}>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.4em] text-[#767676] font-semibold block mb-4">
            Maison Client Experience
          </span>
          <h2 className={`font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-wide mb-16 ${
            isDark ? 'text-white' : 'text-[#111111]'
          }`}>
            Words of Reverence
          </h2>

          <div className="min-h-[220px] flex flex-col justify-center items-center px-4">
            {/* Subtle champagne gold quote mark accent */}
            <span className="text-7xl text-[#C5A880]/30 font-serif block leading-none mb-6">“</span>
            
            {/* Display quote in an italicized, elegant serif font */}
            <blockquote className={`text-xl sm:text-3xl lg:text-[34px] font-serif font-light italic leading-relaxed max-w-4xl mb-12 ${
              isDark ? 'text-gray-200' : 'text-gray-800'
            }`}>
              {TESTIMONIALS[testimonialIndex].quote}
            </blockquote>
            
            {/* Minimalist tracking-widest uppercase font for author and location */}
            <div className="font-sans text-[11px] uppercase tracking-[0.35em] space-y-2">
              <span className="text-[#C5A880] font-semibold block">
                {TESTIMONIALS[testimonialIndex].author}
              </span>
              <span className="text-[#767676] text-[10px] block">
                {TESTIMONIALS[testimonialIndex].location}
              </span>
            </div>
          </div>

          {/* Testimonial Slider Controls */}
          <div className="flex justify-center gap-4 mt-16">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setTestimonialIndex(i)}
                className={`w-10 h-[1.5px] transition-all duration-500 focus:outline-none ${
                  i === testimonialIndex ? 'bg-[#C5A880]' : isDark ? 'bg-white/10 hover:bg-white/30' : 'bg-black/10 hover:bg-black/30'
                }`}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 8. Instagram-Style Gallery */}
      <section className="section-shell py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-eyebrow block mb-2">INSTAGRAM ATELIER</span>
          <h2 className="section-title">Follow Our World</h2>
          <p className="text-sm text-gray-600 font-light mt-3 font-sans">
            Tag @PVJewelleryMaison to share your eternal moments and flawless high jewellery acquisitions with our global community.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {IG_GALLERY.map((item) => (
            <div key={item.id} className="group relative aspect-square bg-luxury-black overflow-hidden shadow-soft-lg border border-gold/20">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              
              <div className="absolute inset-0 bg-luxury-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-6 text-center z-10">
                <svg className="w-10 h-10 text-gold mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="font-display text-xl text-white font-light tracking-wide">{item.title}</span>
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-gold mt-2 font-semibold">@PVJewellery</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn" 
          onClick={() => setQuickViewProduct(null)}
        >
          <div 
            className="bg-white border border-gold max-w-2xl w-full p-8 sm:p-12 shadow-2xl relative flex flex-col md:flex-row gap-8" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              type="button" 
              onClick={() => setQuickViewProduct(null)} 
              className="absolute top-6 right-6 text-gray-400 hover:text-luxury-black transition-colors focus:outline-none z-10"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="md:w-1/2 aspect-square bg-[#F5F5F5] overflow-hidden border border-gold/20">
              {quickViewProduct.images && quickViewProduct.images[0] ? (
                <img
                  src={getImageUrl(quickViewProduct.images[0])}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-sans">Haute Creation</div>
              )}
            </div>

            <div className="md:w-1/2 flex flex-col justify-between">
              <div>
                <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold font-medium block mb-2">Maison Vault</span>
                <h3 className="font-display text-3xl font-light text-luxury-black leading-snug">{quickViewProduct.name}</h3>
                <span className="block font-sans text-xl font-semibold text-luxury-black mt-3">₹{Number(quickViewProduct.price).toLocaleString('en-IN')}</span>
                <p className="text-xs text-gray-600 font-light mt-4 leading-relaxed font-sans border-t border-gold/20 pt-4">
                  {quickViewProduct.description}
                </p>
              </div>

              <div className="space-y-4 pt-8">
                <button
                  type="button"
                  onClick={() => {
                    setQuickViewProduct(null);
                    navigate(`/products/${quickViewProduct.slug}`);
                  }}
                  className="w-full py-4 bg-luxury-black text-gold font-sans text-xs uppercase tracking-[0.2em] font-semibold hover:bg-gold hover:text-luxury-black transition-all shadow-luxury"
                >
                  Acquire Masterpiece
                </button>
                <button 
                  type="button" 
                  onClick={() => setQuickViewProduct(null)} 
                  className="w-full py-3 text-center font-sans text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-luxury-black transition-colors"
                >
                  Continue Exploring
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
