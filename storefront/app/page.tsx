'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import {
  ArrowRight,
  Truck,
  Shield,
  RotateCcw,
  Star,
  Zap,
  Target,
  Award,
  CheckCircle,
  ChevronRight,
} from 'lucide-react'
import CollectionSection from '@/components/marketing/collection-section'
import { useCollections } from '@/hooks/use-collections'
import { trackMetaEvent } from '@/lib/meta-pixel'

const HERO_IMG = 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&q=80'
const LIFESTYLE_IMG = 'https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?w=1200&q=80'
const SPORT_ACTION_IMG = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1200&q=80'

const categories = [
  { label: 'Paddles', icon: Zap, href: '/products?category=paddles', desc: 'Pro-grade carbon & fiberglass' },
  { label: 'Footwear', icon: Target, href: '/products?category=footwear', desc: 'Court-specific grip & support' },
  { label: 'Bags', icon: Award, href: '/products?category=bags', desc: 'Tournament-ready carry' },
  { label: 'Training', icon: CheckCircle, href: '/products?category=training', desc: 'Drills, tools & upgrades' },
]

const stats = [
  { value: '12K+', label: 'Players Served' },
  { value: '4.9', label: 'Average Rating' },
  { value: '48hrs', label: 'Ship Time' },
  { value: '30-Day', label: 'Free Returns' },
]

export default function HomePage() {
  const { data: collections, isLoading } = useCollections()
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [stockCount] = useState(7)
  const [timeLeft, setTimeLeft] = useState({ h: 3, m: 47, s: 22 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 }
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 }
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 }
        return prev
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail.trim()) return
    trackMetaEvent('Lead', { content_name: 'newsletter_signup', status: 'submitted' })
  }

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative bg-[#1a2744] overflow-hidden">
        {/* court grid overlay */}
        <div className="absolute inset-0 court-grid opacity-60 pointer-events-none" />

        <div className="container-custom relative z-10 grid lg:grid-cols-2 gap-0 items-stretch min-h-[620px]">
          {/* Left: text */}
          <div className="flex flex-col justify-center py-16 lg:py-20 space-y-7 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-[#8dc63f]/15 border border-[#8dc63f]/30 rounded-full px-3 py-1.5 w-fit">
              <Zap className="h-3.5 w-3.5 text-[#8dc63f]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#8dc63f]">Pro-Curated Gear</span>
            </div>

            <h1 className="font-heading font-bold text-white leading-none text-balance" style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', lineHeight: 1.0, letterSpacing: '-0.01em' }}>
              Play Like<br />
              <span className="text-[#8dc63f]">You Mean It.</span>
            </h1>

            <p className="text-white/65 text-lg max-w-md leading-relaxed">
              The courtside shop built for players who take their game seriously. Curated paddles, performance footwear, and specialist gear — all in one place.
            </p>

            {/* Urgency */}
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded px-4 py-3 w-fit">
              <div className="w-2 h-2 rounded-full bg-[#8dc63f] animate-pulse" />
              <span className="text-white/80 text-sm font-medium">
                Flash sale ends in &nbsp;
                <span className="font-bold text-white font-heading tabular-nums">
                  {pad(timeLeft.h)}:{pad(timeLeft.m)}:{pad(timeLeft.s)}
                </span>
              </span>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-[#8dc63f] text-[#1a2744] px-8 py-3.5 text-sm font-bold uppercase tracking-wide hover:bg-[#9ed64f] transition-colors"
                prefetch={true}
              >
                Shop the Collection
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 border border-white/25 text-white px-8 py-3.5 text-sm font-semibold uppercase tracking-wide hover:bg-white/10 transition-colors"
                prefetch={true}
              >
                Our Story
              </Link>
            </div>

            {/* Mini stats */}
            <div className="flex items-center gap-5 pt-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 text-[#8dc63f]" fill="currentColor" />
                ))}
              </div>
              <span className="text-white/50 text-xs">4.9 from 2,400+ verified players</span>
            </div>
          </div>

          {/* Right: hero image */}
          <div className="relative min-h-[340px] lg:min-h-0 overflow-hidden">
            <Image
              src={HERO_IMG}
              alt="Pickleball court action"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
              priority
            />
            {/* dark gradient blending with navy */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a2744] via-transparent to-transparent lg:via-[#1a2744]/10" />
            {/* Stock badge */}
            <div className="absolute bottom-6 left-6 bg-[#1a2744]/90 backdrop-blur-sm border border-white/10 rounded px-4 py-3">
              <p className="text-[#8dc63f] text-xs font-bold uppercase tracking-widest mb-0.5">Top Seller</p>
              <p className="text-white text-sm font-semibold">Only {stockCount} paddle sets left</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ───────────────────────────────────────── */}
      <section className="bg-[#8dc63f]">
        <div className="container-custom py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-heading font-bold text-[#1a2744] text-2xl">{s.value}</p>
                <p className="text-[#1a2744]/70 text-xs font-semibold uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORY GRID ───────────────────────────────────── */}
      <section className="py-section bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8dc63f] mb-3">Browse by Category</p>
            <h2 className="font-heading font-bold text-[#1a2744]" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Every Tool in Your Arsenal
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="group relative bg-[#1a2744] rounded-sm p-6 hover:bg-[#243258] transition-all duration-300 overflow-hidden"
                  prefetch={true}
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#8dc63f]/8 rounded-bl-full" />
                  <Icon className="h-8 w-8 text-[#8dc63f] mb-4" strokeWidth={1.5} />
                  <h3 className="font-heading font-bold text-white text-xl uppercase">{cat.label}</h3>
                  <p className="text-white/50 text-xs mt-1">{cat.desc}</p>
                  <div className="flex items-center gap-1 mt-4 text-[#8dc63f] text-xs font-bold uppercase tracking-wide">
                    <span>Shop</span>
                    <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── COLLECTIONS (dynamic) ───────────────────────────── */}
      {isLoading ? (
        <section className="py-section">
          <div className="container-custom">
            <div className="animate-pulse space-y-4 text-center">
              <div className="h-3 w-20 bg-muted rounded mx-auto" />
              <div className="h-8 w-64 bg-muted rounded mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[3/4] bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        </section>
      ) : collections && collections.length > 0 ? (
        <>
          {collections.map((collection: { id: string; handle: string; title: string; metadata?: Record<string, unknown> }, index: number) => (
            <CollectionSection
              key={collection.id}
              collection={collection}
              alternate={index % 2 === 1}
            />
          ))}
        </>
      ) : null}

      {/* ─── EDITORIAL / BRAND ───────────────────────────────── */}
      <section className="py-section bg-[#1a2744] relative overflow-hidden">
        <div className="absolute inset-0 court-grid opacity-40 pointer-events-none" />
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <div className="aspect-[4/5] rounded-sm overflow-hidden relative order-2 lg:order-1">
              <Image
                src={LIFESTYLE_IMG}
                alt="Serious pickleball player"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a2744]/60 to-transparent" />
              {/* quote */}
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white font-heading font-semibold text-lg leading-snug">
                  &ldquo;Finally a shop that gets what competitive pickleball actually needs.&rdquo;
                </p>
                <p className="text-[#8dc63f] text-xs font-bold mt-2 uppercase tracking-wider">— Pro-Level Player, Austin TX</p>
              </div>
            </div>

            {/* Text */}
            <div className="space-y-6 order-1 lg:order-2">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8dc63f]">Our Philosophy</p>
              <h2 className="font-heading font-bold text-white leading-tight" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                Built by Players.<br />Curated for Players.
              </h2>
              <p className="text-white/65 leading-relaxed">
                Courtside isn&apos;t a generic sports retailer. We&apos;re players first — obsessed with the game and frustrated by stores that don&apos;t know a carbon-fiber face from a fiberglass one. Every product here passed our court-side test.
              </p>
              <ul className="space-y-3">
                {[
                  'Gear tested by 4.0–5.0 rated players',
                  'No filler — every product earns its place',
                  'Expert customer support who actually play',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#8dc63f] flex-shrink-0 mt-0.5" />
                    <span className="text-white/75 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-[#8dc63f] text-sm font-bold uppercase tracking-wide hover:gap-3 transition-all"
                prefetch={true}
              >
                Learn More About Us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURED LIFESTYLE SPLIT ────────────────────────── */}
      <section className="py-section bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Text */}
            <div className="space-y-6">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8dc63f]">Performance Gear</p>
              <h2 className="font-heading font-bold text-[#1a2744] leading-tight" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}>
                The Right Paddle Changes Everything
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Spin control, dink precision, power drives — the difference between winning at the net and watching the ball sail past you often comes down to your equipment. We&apos;ve done the testing so you don&apos;t have to.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-[#1a2744] text-white px-7 py-3.5 text-sm font-bold uppercase tracking-wide hover:bg-[#243258] transition-colors"
                prefetch={true}
              >
                Shop Paddles
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {/* Image */}
            <div className="aspect-[16/10] rounded-sm overflow-hidden relative">
              <Image
                src={SPORT_ACTION_IMG}
                alt="Pickleball paddle performance"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRUST BAR ───────────────────────────────────────── */}
      <section className="py-section-sm bg-muted/40 border-y">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            <div className="flex items-center gap-4 justify-center text-center md:text-left md:justify-start">
              <div className="w-10 h-10 rounded-full bg-[#8dc63f]/15 flex items-center justify-center flex-shrink-0">
                <Truck className="h-5 w-5 text-[#8dc63f]" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1a2744]">Free US Shipping</p>
                <p className="text-xs text-muted-foreground">On orders over $75</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <div className="w-10 h-10 rounded-full bg-[#8dc63f]/15 flex items-center justify-center flex-shrink-0">
                <RotateCcw className="h-5 w-5 text-[#8dc63f]" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1a2744]">30-Day Returns</p>
                <p className="text-xs text-muted-foreground">No questions asked</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center md:justify-end text-center md:text-right">
              <div className="w-10 h-10 rounded-full bg-[#8dc63f]/15 flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-[#8dc63f]" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1a2744]">Secure Checkout</p>
                <p className="text-xs text-muted-foreground">256-bit SSL encryption</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ──────────────────────────────────────── */}
      <section className="py-section bg-[#1a2744] relative overflow-hidden">
        <div className="absolute inset-0 court-grid opacity-30 pointer-events-none" />
        <div className="container-custom relative z-10 max-w-2xl text-center">
          <div className="w-12 h-12 rounded-full bg-[#8dc63f]/15 flex items-center justify-center mx-auto mb-6">
            <Zap className="h-6 w-6 text-[#8dc63f]" />
          </div>
          <h2 className="font-heading font-bold text-white" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
            Stay Ahead of the Baseline
          </h2>
          <p className="mt-3 text-white/60 max-w-md mx-auto">
            New gear drops, exclusive discounts, and tips from competitive players — delivered to your inbox.
          </p>
          <form className="mt-8 flex gap-0 max-w-sm mx-auto" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-white/40 px-4 py-3 text-sm focus:outline-none focus:border-[#8dc63f] transition-colors"
            />
            <button
              type="submit"
              className="bg-[#8dc63f] text-[#1a2744] px-6 py-3 text-sm font-bold uppercase tracking-wide hover:bg-[#9ed64f] transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-3 text-white/30 text-xs">No spam. Unsubscribe any time.</p>
        </div>
      </section>
    </>
  )
}
