import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const revalidate = 3600
import { medusaServerClient } from '@/lib/medusa-client'
import Image from 'next/image'
import Link from 'next/link'
import {
  Truck,
  RotateCcw,
  Shield,
  ChevronRight,
  Star,
  CheckCircle,
  Zap,
  Award,
  Package,
} from 'lucide-react'
import ProductActions from '@/components/product/product-actions'
import ProductAccordion from '@/components/product/product-accordion'
import { ProductViewTracker } from '@/components/product/product-view-tracker'
import { getProductPlaceholder } from '@/lib/utils/placeholder-images'
import { type VariantExtension } from '@/components/product/product-price'
import ProductBundleOffer from '@/components/product/product-bundle-offer'

async function getProduct(handle: string) {
  try {
    const regionsResponse = await medusaServerClient.store.region.list()
    const regionId = regionsResponse.regions[0]?.id
    if (!regionId) throw new Error('No region found')

    const response = await medusaServerClient.store.product.list({
      handle,
      region_id: regionId,
      fields: '*variants.calculated_price',
    })
    return response.products?.[0] || null
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

async function getVariantExtensions(productId: string): Promise<Record<string, VariantExtension>> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
    const storeId = process.env.NEXT_PUBLIC_STORE_ID
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
    const headers: Record<string, string> = {}
    if (storeId) headers['X-Store-Environment-ID'] = storeId
    if (publishableKey) headers['x-publishable-api-key'] = publishableKey

    const res = await fetch(
      `${baseUrl}/store/product-extensions/products/${productId}/variants`,
      { headers, next: { revalidate: 30 } },
    )
    if (!res.ok) return {}

    const data = await res.json()
    const map: Record<string, VariantExtension> = {}
    for (const v of data.variants || []) {
      map[v.id] = {
        compare_at_price: v.compare_at_price,
        allow_backorder: v.allow_backorder ?? false,
        inventory_quantity: v.inventory_quantity,
      }
    }
    return map
  } catch {
    return {}
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  const { handle } = await params
  const product = await getProduct(handle)
  if (!product) return { title: 'Product Not Found' }
  return {
    title: product.title,
    description: product.description || `Shop ${product.title}`,
    openGraph: {
      title: product.title,
      description: product.description || `Shop ${product.title}`,
      ...(product.thumbnail ? { images: [{ url: product.thumbnail }] } : {}),
    },
  }
}

const trustPoints = [
  { icon: CheckCircle, text: 'USAPA approved for tournament play' },
  { icon: Award, text: 'Tested by 4.0–5.0 rated players' },
  { icon: Shield, text: '30-day satisfaction guarantee' },
  { icon: Package, text: 'Discreet, secure packaging' },
]

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const product = await getProduct(handle)

  if (!product) notFound()

  const variantExtensions = await getVariantExtensions(product.id)

  const allImages = [
    ...(product.thumbnail ? [{ url: product.thumbnail }] : []),
    ...(product.images || []).filter((img: { url: string }) => img.url !== product.thumbnail),
  ]
  const displayImages = allImages.length > 0
    ? allImages
    : [{ url: getProductPlaceholder(product.id) }]

  // Inventory for urgency
  const firstVariantId = product.variants?.[0]?.id
  const firstExt = firstVariantId ? variantExtensions[firstVariantId] : null
  const totalStock = Object.values(variantExtensions).reduce(
    (acc, ext) => acc + (ext.inventory_quantity ?? 0), 0
  )
  const showUrgency = totalStock > 0 && totalStock <= 20

  return (
    <>
      {/* Breadcrumbs */}
      <div className="border-b bg-muted/30">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/products" className="hover:text-foreground transition-colors">Shop</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">

          {/* ── Images ─────────────────────────────────────────── */}
          <div className="space-y-3">
            <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-sm">
              <Image
                src={displayImages[0].url}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {/* Court-style badge */}
              <div className="absolute top-4 left-4 bg-[#8dc63f] text-[#1a2744] px-3 py-1 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Zap className="h-3 w-3" fill="currentColor" />
                Player&apos;s Pick
              </div>
            </div>

            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {displayImages.slice(1, 5).map((image: { url: string }, idx: number) => (
                  <div key={idx} className="relative aspect-[3/4] overflow-hidden bg-muted rounded-sm border-2 border-transparent hover:border-[#8dc63f] transition-colors">
                    <Image
                      src={image.url}
                      alt={`${product.title} ${idx + 2}`}
                      fill
                      sizes="12vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ───────────────────────────────────── */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-5">

            {/* Subtitle / category label */}
            {product.subtitle && (
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8dc63f]">
                {product.subtitle}
              </p>
            )}

            {/* Title */}
            <h1 className="font-heading font-bold text-[#1a2744] leading-tight" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
              {product.title}
            </h1>

            {/* Star rating social proof */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-[#8dc63f]" fill="currentColor" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">4.9 (148 verified players)</span>
            </div>

            <ProductViewTracker
              productId={product.id}
              productTitle={product.title}
              variantId={firstVariantId ?? null}
              currency={product.variants?.[0]?.calculated_price?.currency_code || 'usd'}
              value={product.variants?.[0]?.calculated_price?.calculated_amount ?? null}
            />

            {/* ── Urgency bar ─────────────────────────────────── */}
            {showUrgency && (
              <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded px-4 py-3">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse flex-shrink-0" />
                <p className="text-sm text-orange-800 font-semibold">
                  Only {totalStock} left in stock — order soon
                </p>
              </div>
            )}

            {/* ── Variant Selector + Price + Cart ─────────────── */}
            <ProductActions product={product} variantExtensions={variantExtensions} />

            {/* ── Bundle Offer ────────────────────────────────── */}
            <ProductBundleOffer product={product} variantExtensions={variantExtensions} />

            {/* ── Trust signals grid ──────────────────────────── */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {trustPoints.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-2.5 bg-muted/50 rounded px-3 py-2.5">
                  <Icon className="h-4 w-4 text-[#8dc63f] flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-muted-foreground leading-snug">{text}</span>
                </div>
              ))}
            </div>

            {/* ── Shipping / returns mini strip ───────────────── */}
            <div className="grid grid-cols-3 gap-4 py-5 border-t border-b">
              <div className="text-center">
                <Truck className="h-5 w-5 mx-auto mb-1.5 text-[#1a2744]" strokeWidth={1.5} />
                <p className="text-xs font-semibold text-[#1a2744]">Free Shipping</p>
                <p className="text-[10px] text-muted-foreground">Orders over $75</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-5 w-5 mx-auto mb-1.5 text-[#1a2744]" strokeWidth={1.5} />
                <p className="text-xs font-semibold text-[#1a2744]">30-Day Returns</p>
                <p className="text-[10px] text-muted-foreground">Hassle-free</p>
              </div>
              <div className="text-center">
                <Shield className="h-5 w-5 mx-auto mb-1.5 text-[#1a2744]" strokeWidth={1.5} />
                <p className="text-xs font-semibold text-[#1a2744]">Secure Pay</p>
                <p className="text-[10px] text-muted-foreground">SSL encrypted</p>
              </div>
            </div>

            {/* ── Description + details accordion ─────────────── */}
            <ProductAccordion
              description={product.description}
              details={product.metadata as Record<string, string> | undefined}
            />
          </div>
        </div>
      </div>
    </>
  )
}
