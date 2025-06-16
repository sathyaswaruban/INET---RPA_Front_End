// app/admin/navigation/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NavigationItemFormValues, navigationItemSchema } from "@/lib/validations/navigation";
import { getNavigationItems, createNavigationItem, updateNavigationItem, deleteNavigationItem } from "@/lib/api/navigation";
import toast from "react-hot-toast";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, RefreshCcw, Save, Trash2, X } from "lucide-react";

export default function NavigationManagementPage() {
  const [navigationItems, setNavigationItems] = useState<NavigationItemFormValues[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<NavigationItemFormValues>({
    resolver: zodResolver(navigationItemSchema),
    defaultValues: {
      title: "",
      href: "",
      description: "",
      type: "MAIN",
      parentId: null, // Initialize as null
      order: 0,
      isActive: true,
      isExternal: false,
      icon: "",
      roles: ["USER"],
    },
  });

  const fetchNavigationItems = async () => {
    setIsLoading(true);
    try {
      const data = await getNavigationItems();
      setNavigationItems(data.data);
    } catch (error) {
      toast.error("Failed to fetch navigation items");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch navigation items
  useEffect(() => {
    fetchNavigationItems();
  }, []);

  // Set form values when editing
  useEffect(() => {
    if (editingId) {
      const itemToEdit = navigationItems.find((item) => item.id === editingId);
      if (itemToEdit) {
        form.reset({
          ...itemToEdit,
          parentId: itemToEdit.parentId || null, // Ensure proper null handling
          roles: typeof itemToEdit.roles === "string" ? JSON.parse(itemToEdit.roles) : itemToEdit.roles,
        });
      }
    } else {
      form.reset({
        title: "",
        href: "",
        description: "",
        type: "MAIN",
        parentId: null,
        order: 0,
        isActive: true,
        isExternal: false,
        icon: "",
        roles: ["USER"],
      });
    }
  }, [editingId, navigationItems, form]);

  // Handle form submission - Updated version
  // Update your onSubmit function with these debug logs
  const onSubmit = async (values: NavigationItemFormValues) => {
    // console.log("Form submitted with values:", values);
    // console.log("Editing ID:", editingId);

    try {
      if (editingId) {
        // Prepare update data
        const updateData = {
          ...values,
          parentId: values.parentId || null,
          roles: Array.isArray(values.roles) ? values.roles : [values.roles],
        };

        // Make API call
        const updatedItem = await updateNavigationItem(editingId, updateData);
        // console.log("Updated local state:", updatedItem);

        // Update local state
        setNavigationItems((prevItems) => {
          const updatedItems = prevItems.map((item) => (item.id === editingId ? { ...item, ...updatedItem } : item));
          return updatedItems;
        });

        toast.success("Navigation item updated successfully");
      } else {
        // console.log("Creating new item...");
        const newItem = await createNavigationItem(values);
        // console.log("New item created:", newItem);
        setNavigationItems((prevItems) => [...prevItems, newItem]);
        toast.success("Navigation item created successfully");
      }

      setEditingId(null);
      form.reset();
      // console.log("Form reset completed");
    } catch (error) {
      console.error("Submission error:", error);
      if (axios.isAxiosError(error)) {
        console.error("API error response:", error.response);
        toast.error(error.response?.data?.message || "An error occurred");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      const deletedItem = await deleteNavigationItem(id);
      // console.log("deletedItem", deletedItem);
      toast.success("Navigation item deleted successfully");
      const data = await getNavigationItems();
      setNavigationItems(data.data);
    } catch (error) {
      toast.error("Failed to delete navigation item");
    }
  };

  const refreshData = () => {
    fetchNavigationItems();
  };
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Navigation Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Existing Navigation Items */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex justify-between w-full">
                <span>Existing Menu Items</span>
                <RefreshCcw onClick={refreshData} className={`h-4 w-4 cursor-pointer transition-transform duration-300 ${isLoading ? "animate-spin text-primary" : ""}`} />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : navigationItems.length === 0 ? (
              <p className="text-muted-foreground">No navigation items found</p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {navigationItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>{item.href}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.isActive ? "default" : "secondary"}>{item.isActive ? "Active" : "Inactive"}</Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setEditingId(item.id || null)}>
                                <span className="flex items-center">
                                  <Save className="mr-2 h-4 w-4" /> Edit
                                </span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(item.id || "")}>
                                <span className="flex items-center">
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Form */}
        <Card className={editingId ? "border-red-300" : ""}>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Menu Item" : "Create New Menu Item"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Menu title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="href"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL *</FormLabel>
                      <FormControl>
                        <Input placeholder="/path" {...field} />
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
                        <Textarea placeholder="Optional description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MAIN">Main</SelectItem>
                            <SelectItem value="DROPDOWN">Dropdown</SelectItem>
                            <SelectItem value="FOOTER">Footer</SelectItem>
                            <SelectItem value="SOCIAL">Social</SelectItem>
                            <SelectItem value="UTILITY">Utility</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="parentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent Menu</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""} disabled={form.watch("type") !== "MAIN"}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select parent menu" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">None (Top Level)</SelectItem>
                            {navigationItems.map((item) => (
                              <SelectItem key={item.id} value={item.id || ""}>
                                {item.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order *</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Active</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isExternal"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>External Link</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? (
                      <span className="flex items-center">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                        Processing...
                      </span>
                    ) : editingId ? (
                      <span className="flex items-center">
                        <Save className="mr-2 h-4 w-4" /> Update
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Plus className="mr-2 h-4 w-4" /> Create
                      </span>
                    )}
                  </Button>

                  {editingId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingId(null);
                        form.reset();
                      }}
                    >
                      <span className="flex items-center">
                        <X className="mr-2 h-4 w-4" /> Cancel
                      </span>
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
