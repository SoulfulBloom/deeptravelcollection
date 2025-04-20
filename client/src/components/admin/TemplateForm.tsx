// client/src/components/admin/TemplateForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Destination } from "@shared/schema";

interface TemplateFormProps {
  destinations: Destination[];
  initialData?: any;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

export const TemplateForm: React.FC<TemplateFormProps> = ({ 
  destinations, 
  initialData, 
  onSubmit,
  isSubmitting = false
}) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: initialData || {
      destinationId: '',
      durationDays: 7,
      theme: 'cultural',
      promptTemplate: getDefaultPromptTemplate(),
      styleGuide: getDefaultStyleGuide(),
      isActive: true
    }
  });
  
  // Handle select changes manually since they're not directly compatible with react-hook-form
  const handleSelectChange = (field: string, value: string) => {
    setValue(field, value, { shouldValidate: true });
  };

  const isActiveValue = watch('isActive');
  const handleCheckboxChange = (checked: boolean) => {
    setValue('isActive', checked);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="destinationId">Destination</Label>
        <Select 
          onValueChange={(value) => handleSelectChange('destinationId', value)}
          defaultValue={initialData?.destinationId?.toString() || ""}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a destination" />
          </SelectTrigger>
          <SelectContent>
            {destinations.map(dest => (
              <SelectItem key={dest.id} value={dest.id.toString()}>
                {dest.name}, {dest.country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input type="hidden" {...register('destinationId', { required: 'Destination is required' })} />
        {errors.destinationId && (
          <p className="text-sm text-destructive">{errors.destinationId.message as string}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="durationDays">Duration (Days)</Label>
        <Input
          id="durationDays"
          type="number"
          {...register('durationDays', { 
            required: 'Duration is required',
            min: { value: 1, message: 'Duration must be at least 1 day' },
            max: { value: 30, message: 'Duration cannot exceed 30 days' }
          })}
        />
        {errors.durationDays && (
          <p className="text-sm text-destructive">{errors.durationDays.message as string}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="theme">Theme</Label>
        <Select 
          onValueChange={(value) => handleSelectChange('theme', value)}
          defaultValue={initialData?.theme || "cultural"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cultural">Cultural</SelectItem>
            <SelectItem value="adventure">Adventure</SelectItem>
            <SelectItem value="culinary">Culinary</SelectItem>
            <SelectItem value="relaxation">Relaxation</SelectItem>
            <SelectItem value="family">Family</SelectItem>
            <SelectItem value="budget">Budget</SelectItem>
            <SelectItem value="luxury">Luxury</SelectItem>
          </SelectContent>
        </Select>
        <input type="hidden" {...register('theme')} />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="promptTemplate">Prompt Template</Label>
        <Textarea
          id="promptTemplate"
          {...register('promptTemplate', { required: 'Prompt template is required' })}
          rows={10}
          placeholder="Enter the OpenAI prompt template for this destination..."
        />
        {errors.promptTemplate && (
          <p className="text-sm text-destructive">{errors.promptTemplate.message as string}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="styleGuide">Style Guide</Label>
        <Textarea
          id="styleGuide"
          {...register('styleGuide')}
          rows={5}
          placeholder="Enter styling instructions for the generated content..."
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="isActive"
          checked={isActiveValue}
          onCheckedChange={handleCheckboxChange}
        />
        <Label htmlFor="isActive">Active</Label>
        <input type="hidden" {...register('isActive')} />
      </div>
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Processing...' : initialData ? 'Update Template' : 'Create Template'}
      </Button>
    </form>
  );
};

// Helper functions to provide default templates
function getDefaultPromptTemplate(): string {
  return `Create a detailed travel itinerary for the selected destination.

The itinerary should include:
1. Brief introduction to the destination's culture, history, and key attractions
2. Day-by-day breakdown with morning, afternoon, and evening activities
3. Suggested places to eat, from budget options to fine dining
4. Accommodation recommendations for different budget levels
5. Transportation tips within the destination
6. Cultural norms and etiquette to be aware of
7. Practical tips for travelers (e.g., currency, language basics, safety)
8. Suggestions for off-the-beaten-path experiences

Focus on authentic local experiences rather than tourist traps.`;
}

function getDefaultStyleGuide(): string {
  return `Write in a friendly, conversational tone that feels like advice from a well-traveled friend. 
Use descriptive language that engages the senses. 
Organize information clearly with proper headings and subheadings. 
Include specific names of places, streets, and establishments. 
Prioritize local insights and hidden gems over obvious tourist attractions.`;
}