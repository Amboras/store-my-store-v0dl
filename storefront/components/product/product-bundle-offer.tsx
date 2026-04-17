'use client'

import { useState } from 'react'
import { useCart } from '@/hooks/use-cart'
import { toast } from 'sonner'
import { Tag, Loader2, Check, Package } from 'lucide-react'
import type { Product } from '@/types'
import { type VariantExtension } from './product-price'

interface ProductBundleOfferProps {
  product: Product
  variantExtensions?: Record<string, VariantExtension>
}

type BundleOption = {
  id: string
  label: string
  description: string
  qty: number
  discountPct: number
}

const BUNDLE_OPTIONS: BundleOption[] = [
  {
    id: 'single',
    label: '1 Item',
    description: 'Standard single purchase',
    qty: 1,
    discountPct: 0,
  },
  {
    id: 'double',
    label: '2 Items — Save 10%',
    description: 'Perfect for doubles partners',
    qty: 2,
    discountPct: 10,
  },
  {
    id: 'triple',
    label: '3 Items — Save 15%',
    description: 'Team / club best value',
    qty: 3,
    discountPct: 15,
  },
]

export default function ProductBundleOffer({ product, variantExtensions }: ProductBundleOfferProps) {
  const [selectedBundle, setSelectedBundle] = useState<string>('single')
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const { addItem } = useCart()

  const firstVariant = product.variants?.[0] as { id?: string; calculated_price?: { calculated_amount?: number } } | undefined
  const variantId = firstVariant?.id
  const basePrice = firstVariant?.calculated_price?.calculated_amount ?? 0

  if (!variantId || basePrice === 0) return null

  const bundle = BUNDLE_OPTIONS.find(b => b.id === selectedBundle) ?? BUNDLE_OPTIONS[0]
  const totalOriginal = basePrice * bundle.qty
  const savings = Math.round(totalOriginal * (bundle.discountPct / 100))
  const totalFinal = totalOriginal - savings

  const formatPrice = (cents: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'usd' }).format(cents / 100)

  const handleBundleAdd = async () => {
    if (!variantId || isAdding) return
    setIsAdding(true)

    addItem(
      { variantId, quantity: bundle.qty },
      {
        onSuccess: () => {
          setIsAdding(false)
          setJustAdded(true)
          toast.success(`${bundle.qty}x added to bag${bundle.discountPct > 0 ? ` — ${bundle.discountPct}% off applied at checkout` : ''}`)
          setTimeout(() => setJustAdded(false), 2500)
        },
        onError: (error: Error) => {
          setIsAdding(false)
          toast.error(error.message || 'Failed to add to bag')
        },
      }
    )
  }

  return (
    <div className="border border-[#8dc63f]/40 rounded-sm bg-[#8dc63f]/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 bg-[#8dc63f]/15 px-4 py-2.5 border-b border-[#8dc63f]/30">
        <Tag className="h-4 w-4 text-[#8dc63f]" />
        <span className="text-xs font-bold uppercase tracking-widest text-[#1a2744]">Bundle &amp; Save</span>
      </div>

      {/* Bundle selector */}
      <div className="p-4 space-y-2">
        {BUNDLE_OPTIONS.map((opt) => {
          const optTotal = basePrice * opt.qty
          const optSavings = Math.round(optTotal * (opt.discountPct / 100))
          const optFinal = optTotal - optSavings
          const isSelected = selectedBundle === opt.id

          return (
            <button
              key={opt.id}
              onClick={() => setSelectedBundle(opt.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded border text-left transition-all ${
                isSelected
                  ? 'border-[#8dc63f] bg-white shadow-sm'
                  : 'border-border bg-white/50 hover:border-[#8dc63f]/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${
                  isSelected ? 'border-[#8dc63f] bg-[#8dc63f]' : 'border-border'
                }`}>
                  {isSelected && <div className="w-full h-full rounded-full bg-white scale-[0.4]" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1a2744]">{opt.label}</p>
                  <p className="text-[11px] text-muted-foreground">{opt.description}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-3">
                <p className="text-sm font-bold text-[#1a2744]">{formatPrice(optFinal)}</p>
                {opt.discountPct > 0 && (
                  <p className="text-[11px] text-muted-foreground line-through">{formatPrice(optTotal)}</p>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* CTA */}
      <div className="px-4 pb-4 space-y-2">
        {bundle.discountPct > 0 && (
          <div className="flex items-center gap-2 text-xs text-[#1a2744]/70">
            <Package className="h-3.5 w-3.5 text-[#8dc63f]" />
            <span>You save {formatPrice(savings)} with this bundle</span>
          </div>
        )}

        <button
          onClick={handleBundleAdd}
          disabled={isAdding || justAdded}
          className={`w-full flex items-center justify-center gap-2 py-3.5 text-sm font-bold uppercase tracking-wide transition-all ${
            justAdded
              ? 'bg-green-700 text-white'
              : 'bg-[#1a2744] text-white hover:bg-[#243258]'
          }`}
        >
          {isAdding ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : justAdded ? (
            <>
              <Check className="h-4 w-4" />
              Added to Bag
            </>
          ) : (
            <>
              Add {bundle.qty > 1 ? `${bundle.qty}x` : ''} to Bag — {formatPrice(totalFinal)}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
