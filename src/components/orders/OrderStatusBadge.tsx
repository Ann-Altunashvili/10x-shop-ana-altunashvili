import type { OrderStatus } from '../../types/order'
import Badge, { type BadgeTone } from '../ui/Badge'

const tones: Record<OrderStatus, BadgeTone> = {
  Processing: 'neutral',
  Shipped: 'info',
  Delivered: 'success',
}

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge tone={tones[status]}>{status}</Badge>
}
