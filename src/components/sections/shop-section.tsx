'use client'

import * as React from 'react'
import { ShoppingBag, ExternalLink, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useApp } from '@/lib/store'
import { AmazighBand } from '@/components/amazigh-pattern'

type Product = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  image: string
  category: string
}

// Decorative gradient + tifinagh glyph per product (since no real images)
const GLYPHS = ['ⵣ', 'ⵜ', 'ⴰ', 'ⵔ', 'ⵉ', 'ⵙ', 'ⵎ', 'ⵅ']

export function ShopSection() {
  const { setActiveTab } = useApp()
  const [products, setProducts] = React.useState<Product[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let alive = true
    fetch('/api/products')
      .then((r) => r.json())
      .then((d) => alive && setProducts(d.products ?? []))
      .catch(() => {})
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
          <ShoppingBag className="h-3.5 w-3.5" /> Shop
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Wear the Rif. Carry the language.
        </h2>
        <p className="max-w-2xl text-muted-foreground">
          Every purchase supports free Riffian lessons. Tees, pins, flashcards
          and posters — designed with Tifinagh and the symbols of Amazigh
          culture.
        </p>
      </div>

      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} glyph={GLYPHS[i % GLYPHS.length]} />
          ))}
        </div>
      )}

      {/* Supporting note */}
      <div className="mt-12 rounded-2xl border border-primary/25 bg-primary/[0.04] p-6 sm:p-8">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                100% of shop revenue funds free lessons
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                No ads, no paywalls. Your support keeps every video free for the
                next learner.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setActiveTab('support')}
            className="shrink-0"
          >
            Other ways to support
          </Button>
        </div>
      </div>

      <div className="mt-14 text-primary/40">
        <AmazighBand className="h-4 w-full" color="currentColor" />
      </div>
    </section>
  )
}

function ProductCard({ product, glyph }: { product: Product; glyph: string }) {
  return (
    <div className="lt-card-hover group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Decorative cover */}
      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-gradient-to-br from-primary/12 via-primary/5 to-primary/10">
        <div className="absolute inset-0 lt-dots opacity-50" />
        <span className="lt-tifinagh relative text-7xl font-bold text-primary/35 transition-transform duration-500 group-hover:scale-110">
          {glyph}
        </span>
        <span className="absolute left-2.5 top-2.5 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary backdrop-blur">
          {product.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-semibold leading-snug text-foreground">{product.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-extrabold text-foreground">
            €{product.price.toFixed(0)}
          </span>
          <Button
            asChild
            size="sm"
            className="h-8 gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <a
              href={`https://ko-fi.com/summary/06275ede-c500-4330-93ee-f52addb9eabb`}
              target="_blank"
              rel="noreferrer noopener"
            >
              Buy <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
