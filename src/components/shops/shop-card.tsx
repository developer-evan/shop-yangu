/* eslint-disable @next/next/no-img-element */
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import { Shop } from "@/lib/api"
import Link from "next/link"

interface ShopCardProps {
  shop: Shop
  onDelete: (id: number) => void
}

export function ShopCard({ shop, onDelete }: ShopCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <img
          src={shop.logo}
          alt={shop.name}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-xl font-bold">{shop.name}</h3>
        <p className="text-sm text-gray-500">{shop.description}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 p-4">
        <Link href={`/shops/${shop.id}`}>
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        </Link>
        <Button 
          variant="destructive" 
          size="icon"
          onClick={() => onDelete(shop.id!)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
} 