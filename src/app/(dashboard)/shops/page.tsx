/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ShopTable } from "@/components/shops/shop-table"
import { shopApi, Shop } from "@/lib/api"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ShopForm } from "@/components/shops/shop-form"
import { useToast } from "@/hooks/use-toast"

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingShop, setEditingShop] = useState<Shop | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadShops()
  }, [])

  const loadShops = async () => {
    try {
      const response = await shopApi.getAll()
      setShops(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load shops",
        variant: "destructive",
      })
    }
  }

  const handleCreateShop = async (data: Omit<Shop, 'id'>) => {
    try {
      await shopApi.create(data)
      setIsDialogOpen(false)
      loadShops()
      toast({
        title: "Success",
        description: "Shop created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create shop",
        variant: "destructive",
      })
    }
  }

  const handleUpdateShop = async (data: Partial<Shop>) => {
    try {
      await shopApi.update(editingShop!.id!, data)
      setIsDialogOpen(false)
      setEditingShop(null)
      loadShops()
      toast({
        title: "Success",
        description: "Shop updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update shop",
        variant: "destructive",
      })
    }
  }

  const handleDeleteShop = async (id: string) => {
    try {
      await shopApi.delete(id)
      loadShops()
      toast({
        title: "Success",
        description: "Shop deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete shop",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (shop: Shop) => {
    setEditingShop(shop)
    setIsDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingShop(null)
  }

  const filteredShops = shops.filter(shop =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Shops</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Shop
        </Button>
      </div>

      {/* <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search shops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div> */}

      <ShopTable
        shops={filteredShops}
        onDelete={handleDeleteShop}
        onEdit={handleEdit}
      />

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingShop ? 'Edit Shop' : 'Add New Shop'}
            </DialogTitle>
          </DialogHeader>
          <ShopForm
            initialData={editingShop || undefined}
            onSubmit={editingShop ? handleUpdateShop : handleCreateShop}
            onClose={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
} 