import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { Shop } from "@/lib/api"
import Image from "next/image"
import { Pagination } from "@/components/ui/pagination"
import { useState } from "react"

interface ShopTableProps {
  shops: Shop[]
  onDelete: (id: number) => void
  onEdit: (shop: Shop) => void
}

export function ShopTable({ shops, onDelete, onEdit }: ShopTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Calculate paginated data
  const startIndex = (currentPage - 1) * pageSize
  const paginatedShops = shops.slice(startIndex, startIndex + pageSize)

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Products</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedShops.map((shop) => (
              <TableRow key={shop.id}>
                <TableCell>
                  <div className="relative h-10 w-10">
                    <Image
                      src={shop.logo}
                      alt={shop.name}
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{shop.name}</TableCell>
                <TableCell className="max-w-md truncate">
                  {shop.description}
                </TableCell>
                <TableCell>{shop.products?.length || 0}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(shop)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => onDelete(shop.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {shops.length === 0 && (
              <TableRow>
                <TableCell 
                  colSpan={5} 
                  className="text-center py-6 text-muted-foreground"
                >
                  No shops found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={shops.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setCurrentPage(1)
        }}
      />
    </div>
  )
} 