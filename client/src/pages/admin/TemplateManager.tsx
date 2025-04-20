// client/src/pages/admin/TemplateManager.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { TemplateForm } from '@/components/admin/TemplateForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Plus, Edit, Trash2 } from "lucide-react";
import { Destination, ItineraryTemplate } from '@shared/schema';

export default function TemplateManager() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ItineraryTemplate | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch templates
  const { 
    data: templatesData, 
    isLoading: templatesLoading,
    error: templatesError
  } = useQuery({
    queryKey: ['/api/admin/templates'],
    queryFn: () => apiRequest('GET', '/api/admin/templates').then(res => res.json())
  });
  
  // Fetch destinations (for template creation form)
  const { 
    data: destinationsData, 
    isLoading: destinationsLoading,
    error: destinationsError
  } = useQuery({
    queryKey: ['/api/admin/destinations'],
    queryFn: () => apiRequest('GET', '/api/admin/destinations').then(res => res.json())
  });
  
  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: (template: any) => {
      return apiRequest('POST', '/api/admin/templates', template)
        .then(res => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/templates'] });
      toast({
        title: "Template created",
        description: "The template was created successfully.",
      });
      setIsFormOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error creating template",
        description: error.message || "There was an error creating the template.",
        variant: "destructive",
      });
    }
  });
  
  // Update template mutation
  const updateTemplateMutation = useMutation({
    mutationFn: (template: any) => {
      return apiRequest('PUT', `/api/admin/templates/${template.id}`, template)
        .then(res => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/templates'] });
      toast({
        title: "Template updated",
        description: "The template was updated successfully.",
      });
      setIsFormOpen(false);
      setEditingTemplate(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error updating template",
        description: error.message || "There was an error updating the template.",
        variant: "destructive",
      });
    }
  });
  
  // Delete template mutation
  const deleteTemplateMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest('DELETE', `/api/admin/templates/${id}`)
        .then(res => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/templates'] });
      toast({
        title: "Template deleted",
        description: "The template was deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting template",
        description: error.message || "There was an error deleting the template.",
        variant: "destructive",
      });
    }
  });
  
  const handleDeleteTemplate = (id: number) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      deleteTemplateMutation.mutate(id);
    }
  };
  
  const handleSubmit = (data: any) => {
    if (editingTemplate) {
      updateTemplateMutation.mutate({ ...data, id: editingTemplate.id });
    } else {
      createTemplateMutation.mutate(data);
    }
  };
  
  const handleEditTemplate = (template: ItineraryTemplate) => {
    setEditingTemplate(template);
    setIsFormOpen(true);
  };
  
  const handleCreateNewTemplate = () => {
    setEditingTemplate(null);
    setIsFormOpen(true);
  };
  
  const isLoading = templatesLoading || destinationsLoading;
  const error = templatesError || destinationsError;
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Template Manager</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Template Manager</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center mb-4">
          <AlertTriangle className="mr-2" />
          <span>Error loading data. Please try again later.</span>
        </div>
      </div>
    );
  }
  
  const templates = templatesData?.templates || [];
  const destinations = destinationsData?.destinations || [];
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Template Manager</h1>
        <Button onClick={handleCreateNewTemplate}>
          <Plus className="mr-2 h-4 w-4" /> Create New Template
        </Button>
      </div>
      
      {templates.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <p className="text-xl mb-4">No templates found</p>
          <Button onClick={handleCreateNewTemplate}>Create Your First Template</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template: ItineraryTemplate) => (
            <Card key={template.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{template.destination?.name || 'Unnamed Destination'}</CardTitle>
                    <CardDescription>
                      {template.durationDays} days • {template.theme} theme
                    </CardDescription>
                  </div>
                  <Badge variant={template.isActive ? "default" : "outline"}>
                    {template.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-24 overflow-hidden text-sm text-muted-foreground">
                  {template.promptTemplate.substring(0, 150)}...
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDeleteTemplate(template.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit Template' : 'Create New Template'}
            </DialogTitle>
          </DialogHeader>
          <TemplateForm 
            destinations={destinations}
            initialData={editingTemplate}
            onSubmit={handleSubmit}
            isSubmitting={createTemplateMutation.isPending || updateTemplateMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}