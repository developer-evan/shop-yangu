import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Shop, shopApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

const shopFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  logo: z.string().url("Must be a valid URL"),
})

type ShopFormValues = z.infer<typeof shopFormSchema>

interface ShopFormProps {
  initialData?: Shop
  onSubmit: (data: Shop) => void
  onCancel?: () => void
  isLoading?: boolean
}

export function ShopForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  isLoading 
}: ShopFormProps) {
  const { toast } = useToast()

  const form = useForm<ShopFormValues>({
    resolver: zodResolver(shopFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      logo: initialData?.logo || "",
    },
  })

  const handleSubmit = async (values: ShopFormValues) => {
    try {
      const shopData = {
        name: values.name.trim(),
        description: values.description.trim(),
        logo: values.logo.trim(),
        products: initialData?.products || []
      }
      
      let response;
      
      if (initialData?.id) {
        // Update existing shop
        response = await shopApi.update(initialData.id, {
          ...shopData,
          id: initialData.id // Preserve the original ID
        });
        toast({
          title: "Success",
          description: "Shop updated successfully",
        });
      } else {
        // Create new shop
        response = await shopApi.create({
          ...shopData,
          products: [] // New shops start with empty products array
        });
        toast({
          title: "Success",
          description: "Shop created successfully",
        });
      }
      
      onSubmit(response.data);
    } catch (error) {
      console.error('Error saving shop:', error);
      toast({
        title: "Error",
        description: "Failed to save shop. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shop Name</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  disabled={isLoading}
                  placeholder="Enter shop name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  disabled={isLoading}
                  placeholder="Enter shop description"
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo URL</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  disabled={isLoading}
                  placeholder="Enter logo URL"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : initialData ? "Update Shop" : "Create Shop"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 