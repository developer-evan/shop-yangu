import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye } from "lucide-react"
import { Shop } from "@/lib/api"
import Image from "next/image"
import { Pagination } from "@/components/ui/pagination"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ShopTableProps {
  shops: Shop[]
  onDelete: (id: string) => void
  onEdit: (shop: Shop) => void
  onView?: (shop: Shop) => void
}

export function ShopTable({ 
  shops, 
  onDelete, 
  onEdit,
  onView 
}: ShopTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")

  // Filter shops based on search
  const filteredShops = shops.filter(shop => 
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate paginated data
  const startIndex = (currentPage - 1) * pageSize
  const paginatedShops = filteredShops.slice(startIndex, startIndex + pageSize)

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search shops..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1) // Reset to first page on search
          }}
          className="max-w-xs"
        />
      </div>

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
                      onError={(e) => {
                        // Fallback for broken images
                        (e.target as HTMLImageElement).src = '/placeholder.png'
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{shop.name}</TableCell>
                <TableCell className="max-w-md">
                  <p className="truncate" title={shop.description}>
                    {shop.description}
                  </p>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {shop.products?.length || 0} products
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <span className="sr-only">Open menu</span>
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                          />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onView && (
                        <DropdownMenuItem onClick={() => onView(shop)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onEdit(shop)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onDelete(shop.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredShops.length === 0 && (
              <TableRow>
                <TableCell 
                  colSpan={5} 
                  className="text-center py-6 text-muted-foreground"
                >
                  {searchTerm ? "No shops found matching your search" : "No shops found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={filteredShops.length}
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