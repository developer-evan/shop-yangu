import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, ArrowUpDown } from "lucide-react"
import { Product, Shop } from "@/lib/api"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Pagination } from "@/components/ui/pagination"

interface ProductTableProps {
  products: Product[]
  shops: Shop[]
  onDelete: (id: number) => void
  onEdit: (product: Product) => void
}

type SortField = 'name' | 'price' | 'stockLevel' | 'shop'
type SortOrder = 'asc' | 'desc'

export function ProductTable({ products, shops, onDelete, onEdit }: ProductTableProps) {
  // Sorting state
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Filter state
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedShop, setSelectedShop] = useState<string>("")
  const [stockFilter, setStockFilter] = useState<string>("")

  const getShopName = (shopId: number) => {
    return shops?.find(shop => shop.id === shopId)?.name || 'Unknown Shop'
  }

  const getStockStatus = (level: number) => {
    if (level === 0) return <Badge variant="destructive">Out of Stock</Badge>
    if (level <= 5) return <Badge variant="outline">Low Stock</Badge>
    return <Badge variant="default">In Stock</Badge>
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  // Filter and sort products
  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchesShop = selectedShop ? product.shopId === Number(selectedShop) : true
      const matchesStock = () => {
        switch (stockFilter) {
          case 'out': return product.stockLevel === 0
          case 'low': return product.stockLevel <= 5 && product.stockLevel > 0
          case 'in': return product.stockLevel > 5
          default: return true
        }
      }
      return matchesSearch && matchesShop && matchesStock()
    })
    .sort((a, b) => {
      let compareA: string | number
      let compareB: string | number

      switch (sortField) {
        case 'name':
          compareA = a.name.toLowerCase()
          compareB = b.name.toLowerCase()
          break
        case 'price':
          compareA = a.price
          compareB = b.price
          break
        case 'stockLevel':
          compareA = a.stockLevel
          compareB = b.stockLevel
          break
        case 'shop':
          compareA = getShopName(Number(a.shopId)).toLowerCase()
          compareB = getShopName(Number(b.shopId)).toLowerCase()
          break
        default:
          return 0
      }

      return sortOrder === 'asc' 
        ? compareA > compareB ? 1 : -1
        : compareA < compareB ? 1 : -1
    })

  // Paginate products
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const SortableHeader = ({ field, children }: { field: SortField, children: React.ReactNode }) => (
    <TableHead className="cursor-pointer" onClick={() => handleSort(field)}>
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown className="h-4 w-4" />
      </div>
    </TableHead>
  )

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Select
          value={selectedShop}
          onValueChange={setSelectedShop}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by shop" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Shops</SelectItem>
            {shops?.map((shop) => (
              <SelectItem 
                key={shop.id} 
                value={shop.id!.toString()}
              >
                {shop.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={stockFilter}
          onValueChange={setStockFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stock Levels</SelectItem>
            <SelectItem value="out">Out of Stock</SelectItem>
            <SelectItem value="low">Low Stock</SelectItem>
            <SelectItem value="in">In Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <SortableHeader field="name">Product Name</SortableHeader>
              <SortableHeader field="shop">Shop</SortableHeader>
              <SortableHeader field="price">Price</SortableHeader>
              <SortableHeader field="stockLevel">Stock Level</SortableHeader>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="relative h-10 w-10">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{getShopName(product.shopId)}</TableCell>
                <TableCell>${product.price?.toFixed(2)}</TableCell>
                <TableCell>{product.stockLevel}</TableCell>
                <TableCell>{getStockStatus(product.stockLevel)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => onDelete(product.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {paginatedProducts.length === 0 && (
              <TableRow>
                <TableCell 
                  colSpan={7} 
                  className="text-center py-6 text-muted-foreground"
                >
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredAndSortedProducts.length}
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