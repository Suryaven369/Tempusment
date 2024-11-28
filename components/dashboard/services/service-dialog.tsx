"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, PlusCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { createService, updateService, getAllCategories, type ServiceCategory } from "@/lib/firebase-collections";
import { CategoryDialog } from "./category-dialog";
import type { Service } from "@/types";

interface ServiceDialogProps {
  service?: Service;
  onServiceAdded?: (service: Service) => void;
  onServiceUpdated?: (service: Service) => void;
}

export function ServiceDialog({ service, onServiceAdded, onServiceUpdated }: ServiceDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<Service>>(
    service || {
      name: "",
      description: "",
      duration: "60",
      price: "0",
      category: "",
      active: true,
    }
  );

  useEffect(() => {
    async function fetchCategories() {
      try {
        const fetchedCategories = await getAllCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    if (open) {
      fetchCategories();
    }
  }, [open]);

  const handleCategoryAdded = (newCategory: string) => {
    setCategories(prev => [...prev, { name: newCategory }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const serviceData = {
        ...formData,
        duration: parseInt(formData.duration as string, 10),
        price: parseFloat(formData.price as string),
      };

      if (service?.id) {
        const updatedService = await updateService(service.id, serviceData);
        onServiceUpdated?.(updatedService);
        toast({
          title: "Success",
          description: "Service updated successfully.",
        });
      } else {
        const newService = await createService(serviceData);
        onServiceAdded?.(newService);
        toast({
          title: "Success",
          description: "Service added successfully.",
        });
      }
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {service ? "Edit Service" : "New Service"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{service ? "Edit Service" : "Add New Service"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="category">Category</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCategoryDialog(true)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem 
                      key={category.id || category.name} 
                      value={category.name.toLowerCase()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : (service ? "Update Service" : "Add Service")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <CategoryDialog
        open={showCategoryDialog}
        onOpenChange={setShowCategoryDialog}
        onCategoryAdded={handleCategoryAdded}
      />
    </>
  );
}