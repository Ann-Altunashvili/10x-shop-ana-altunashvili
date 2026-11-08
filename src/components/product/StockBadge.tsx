import Badge from '../ui/Badge'

/** In stock (green), "Only N left!" for 1-5 (orange) and Out of stock (red). */
export default function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <Badge tone="danger">Out of stock</Badge>
  if (stock <= 5) return <Badge tone="warning">Only {stock} left!</Badge>
  return <Badge tone="success">In stock</Badge>
}
