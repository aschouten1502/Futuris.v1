import { getAllDirections } from '@/lib/data'
import { DirectionsPageClient } from '@/components/admin/DirectionsPageClient'

export default async function AdminDirectionsPage() {
  const directions = await getAllDirections()

  return <DirectionsPageClient directions={directions} />
}
