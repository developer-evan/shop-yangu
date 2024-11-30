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
  FormDescription,
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
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { Loader2 } from "lucide-react"

// Form validation schema
const productFormSchema = z.object({
  name: z.string()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name must be less than 100 characters"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  price: z.string()
    .refine(
      (value) => !isNaN(Number(value)) && Number(value) > 0,
      "Price must be a positive number"
    ),
  stockLevel: z.string()
    .refine(
      (value) => !isNaN(Number(value)) && Number(value) >= 0,
      "Stock level must be a non-negative number"
    ),
  image: z.string()
    .url("Please enter a valid image URL"),
  shopId: z.string()
    .min(1, "Please select a shop"),
})

type ProductFormValues = z.infer<typeof productFormSchema>

interface ProductFormProps {
  initialData?: Product
  onSubmit: (data: Omit<Product, 'id'>) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function ProductForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: ProductFormProps) {
  const [shops, setShops] = useState<Shop[]>([])
  const [isLoadingShops, setIsLoadingShops] = useState(true)
  const [imagePreview, setImagePreview] = useState(initialData?.image || "")
  const { toast } = useToast()

  // Initialize form
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

  // Load shops
  useEffect(() => {
    async function loadShops() {
      try {
        setIsLoadingShops(true)
        const response = await shopApi.getAll()
        setShops(response.data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load shops. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingShops(false)
      }
    }
    loadShops()
  }, [toast])

  // Handle form submission
  const handleSubmit = async (values: ProductFormValues) => {
    try {
      const productData = {
        name: values.name.trim(),
        description: values.description.trim(),
        price: Number(values.price),
        stockLevel: Number(values.stockLevel),
        image: values.image.trim(),
        shopId: values.shopId
      }

      // Add product to shop's products array
      await shopApi.addProduct(values.shopId, productData);
      
      toast({
        title: "Success",
        description: "Product added successfully",
      });
      
      onSubmit(productData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      })
    }
  }

  // Handle image preview
  const handleImageChange = (url: string) => {
    setImagePreview(url)
    form.setValue("image", url)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Main Details */}
          <div className="space-y-4">
            {/* Shop Selection */}
            <FormField
              control={form.control}
              name="shopId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shop *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingShops || isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={
                          isLoadingShops 
                            ? "Loading shops..." 
                            : "Select a shop"
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {shops.map((shop) => (
                        <SelectItem 
                          key={shop.id} 
                          value={shop.id!.toString()}
                        >
                          {shop.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Product Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter product name"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price and Stock Level */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter price in dollars
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stockLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Level *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      className="resize-none"
                      rows={4}
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Right Column - Image */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter image URL"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        handleImageChange(e.target.value)
                      }}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="aspect-square relative rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-800">
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
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || isLoadingShops}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {initialData ? "Updating..." : "Creating..."}
              </>
            ) : (
              initialData ? "Update Product" : "Create Product"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}