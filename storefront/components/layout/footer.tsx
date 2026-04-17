'use client'

import Link from 'next/link'
import { clearConsent } from '@/lib/cookie-consent'
import { usePolicies } from '@/hooks/use-policies'
import { Zap, Camera, PlayCircle, MessageCircle } from 'lucide-react'

const footerLinks = {
  shop: [
    { label: 'All Gear', href: '/products' },
    { label: 'New Arrivals', href: '/products?sort=newest' },
    { label: 'Collections', href: '/collections' },
  ],
  help: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Shipping & Returns', href: '/shipping' },
    { label: 'Contact Us', href: '/contact' },
  ],
}

export default function Footer() {
  const { policies } = usePolicies()

  const companyLinks = [
    { label: 'About', href: '/about' },
  ]

  if (policies?.privacy_policy) {
    companyLinks.push({ label: 'Privacy Policy', href: '/privacy' })
  }
  if (policies?.terms_of_service) {
    companyLinks.push({ label: 'Terms of Service', href: '/terms' })
  }
  if (policies?.refund_policy) {
    companyLinks.push({ label: 'Refund Policy', href: '/refund-policy' })
  }
  if (policies?.cookie_policy) {
    companyLinks.push({ label: 'Cookie Policy', href: '/cookie-policy' })
  }

  return (
    <footer className="bg-[#1a2744] text-white">
      <div className="container-custom py-section-sm">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-full bg-[#8dc63f] flex items-center justify-center flex-shrink-0">
                <Zap className="h-4 w-4 text-[#1a2744]" fill="currentColor" />
              </div>
              <span className="font-heading text-2xl font-bold uppercase tracking-tight text-white">
                Courtside
              </span>
            </Link>
            <p className="mt-4 text-sm text-white/60 leading-relaxed max-w-xs">
              The specialist destination for serious pickleball players. Curated gear, expert picks, real player culture.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="#"
                className="p-2 rounded-full bg-white/10 hover:bg-[#8dc63f] hover:text-[#1a2744] transition-colors"
                aria-label="Instagram"
              >
                <Camera className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-white/10 hover:bg-[#8dc63f] hover:text-[#1a2744] transition-colors"
                aria-label="YouTube"
              >
                <PlayCircle className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-white/10 hover:bg-[#8dc63f] hover:text-[#1a2744] transition-colors"
                aria-label="Community"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-[#8dc63f]">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-[#8dc63f]">Help</h3>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-[#8dc63f]">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Courtside. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                clearConsent()
                window.dispatchEvent(new Event('manage-cookies'))
              }}
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              Manage Cookies
            </button>
            <span className="text-xs text-white/30">Powered by Amboras</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
