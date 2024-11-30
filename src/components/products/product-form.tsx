import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Product, Shop, shopApi } from "@/lib/api"
import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

// Form validation schema
const productFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().refine(
    (value) => !isNaN(Number(value)) && Number(value) > 0,
    "Price must be a positive number"
  ),
  stockLevel: z.string().refine(
    (value) => !isNaN(Number(value)) && Number(value) >= 0,
    "Stock level must be a non-negative number"
  ),
  image: z.string().url("Must be a valid URL"),
  shopId: z.string().min(1, "Please select a shop"),
})

type ProductFormValues = z.infer<typeof productFormSchema>

interface ProductFormProps {
  shops: Shop[]
  initialData?: Product
  onSubmit: (data: Omit<Product, 'id'>) => void
  onCancel: () => void
  isLoading?: boolean
}

export function ProductForm({ 
//   shops, 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading 
}: ProductFormProps) {
  const [imagePreview, setImagePreview] = useState(initialData?.image || "")
    const [isLoadingShops, setIsLoadingShops] = useState(true)
  const { toast } = useToast()
  const [shops, setShops] = useState<Shop[]>([])

  useEffect(() => {
    loadShops()
  }, [])

  const loadShops = async () => {
    try {
      setIsLoadingShops(true)
      const response = await shopApi.getAll()
      setShops(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load shops",
        variant: "destructive",
      })
    } finally {
      setIsLoadingShops(false)
    }
  }


  // Initialize form with default values
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price?.toString() || "",
      stockLevel: initialData?.stockLevel?.toString() || "",
      image: initialData?.image || "",
      shopId: initialData?.shopId?.toString() || "",
    },
  })

  // Handle form submission
  const handleSubmit = (values: ProductFormValues) => {
    // Ensure all number fields are properly converted
    const formattedData = {
      name: values.name,
      description: values.description,
      price: parseFloat(values.price), // Use parseFloat for decimal numbers
      stockLevel: parseInt(values.stockLevel), // Use parseInt for whole numbers
      image: values.image,
      shopId: parseInt(values.shopId),
    }

    // Add some basic validation
    if (isNaN(formattedData.price) || isNaN(formattedData.stockLevel) || isNaN(formattedData.shopId)) {
      toast({
        title: "Error",
        description: "Please ensure all numeric fields are valid",
        variant: "destructive",
      })
      return
    }

    onSubmit(formattedData)
  }

  // Handle image URL changes
  const handleImageChange = (url: string) => {
    setImagePreview(url)
    form.setValue("image", url)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Form Fields */}
          <div className="space-y-4">
          <FormField
              control={form.control}
              name="shopId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shop</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingShops}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingShops ? "Loading shops..." : "Select a shop"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {shops.length > 0 ? (
                        shops.map((shop) => (
                          <SelectItem 
                            key={shop.id} 
                            value={shop.id!.toString()}
                          >
                            {shop.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem disabled value="no-shops">
                          {isLoadingShops ? "Loading..." : "No shops available"}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stockLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Level</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter product description"
                      className="resize-none"
                      {...field} 
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Right Column - Image Preview */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter image URL"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        handleImageChange(e.target.value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className={cn(
              "aspect-square relative rounded-lg border-2 border-dashed",
              "border-gray-200 dark:border-gray-800",
              "transition-all duration-150",
              "hover:border-gray-300 dark:hover:border-gray-700"
            )}>
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover rounded-lg"
                  onError={() => setImagePreview("")}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-muted-foreground">
                    Image preview
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : initialData ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  )
}