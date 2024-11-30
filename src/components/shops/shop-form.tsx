import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { shopApi } from "@/lib/api"

const shopFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
 logo: z.string().url("Must be a valid URL"),
})

type ShopFormValues = z.infer<typeof shopFormSchema>

interface ShopFormProps {
  initialData?: ShopFormValues
  onSubmit: (data: ShopFormValues) => void
  isLoading?: boolean
}

export function ShopForm({ initialData, onSubmit, isLoading }: ShopFormProps) {
  const form = useForm<ShopFormValues>({
    resolver: zodResolver(shopFormSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      logo: "",
    },
  })

  const handleSubmit = async (values: ShopFormValues) => {
    try {
      const shopData = {
        name: values.name.trim(),
        description: values.description.trim(),
        logo: values.logo.trim(),
        products: []
      }
      
      await shopApi.create(shopData);
      onSubmit(shopData);
    } catch (error) {
      console.error(error)
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
                <Input {...field} />
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
                <Textarea {...field} />
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
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Shop"}
        </Button>
      </form>
    </Form>
  )
} 