import type { Product } from '../../types/product'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: Product[]
  onAdd: (product: Product) => void
}

/** 1 column on phones, 2 from 481px, 3 from 768px, 4 from 1025px. key = the stable product id. */
export default function ProductGrid({ products, onAdd }: ProductGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3 desktop:grid-cols-4">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} onAdd={onAdd} />
        </li>
      ))}
    </ul>
  )
}
