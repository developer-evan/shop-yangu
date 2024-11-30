/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ShopForm } from "@/components/shops/shop-form"
import { shopApi, Shop } from "@/lib/api"
// import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ShopDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [shop, setShop] = useState<Shop | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadShop()
  }, [params.id])

  const loadShop = async () => {
    try {
      const response = await shopApi.getById(Number(params.id))
      setShop(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load shop details",
        variant: "destructive",
      })
    }
  }

  const handleUpdate = async (data: Omit<Shop, 'id'>) => {
    setIsLoading(true)
    try {
      await shopApi.update(Number(params.id), data)
      toast({
        title: "Success",
        description: "Shop updated successfully",
      })
      router.push('/shops')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update shop",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Edit Shop</h1>
        {shop && (
          <ShopForm
            initialData={shop}
            onSubmit={handleUpdate}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  )
} 