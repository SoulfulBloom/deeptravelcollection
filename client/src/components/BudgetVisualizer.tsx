import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Check, DollarSign, Plus } from "lucide-react";
import { getQueryFn } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { useFonts } from "@/components/ui/fonts.tsx";
import { useToast } from "@/hooks/use-toast";

interface BudgetCategory {
  id: number;
  destinationId: number;
  name: string;
  amount: number;
  icon: string;
  color: string;
  description: string;
  milestoneEmoji: string;
  milestoneMessage: string;
}

interface BudgetResponse {
  categories: BudgetCategory[];
  total: number;
  currency: string;
  destination: {
    id: number;
    name: string;
    country: string;
  };
}

interface BudgetVisualizerProps {
  destinationId: number;
}

export default function BudgetVisualizer({ destinationId }: BudgetVisualizerProps) {
  const { heading } = useFonts();
  const { toast } = useToast();
  const [savedAmount, setSavedAmount] = useState<number>(0);
  const [milestoneReached, setMilestoneReached] = useState<BudgetCategory | null>(null);
  const [showMilestoneMessage, setShowMilestoneMessage] = useState(false);
  const [previouslyCompletedCategories, setPreviouslyCompletedCategories] = useState<Set<number>>(new Set());

  // Fetch budget data
  const { data, isLoading, error } = useQuery<BudgetResponse>({
    queryKey: [`/api/destinations/${destinationId}/budget`],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Effect to check milestone completion
  useEffect(() => {
    if (!data) return;

    // Track which categories are newly completed
    const completedCategories = new Set<number>();
    let newMilestoneCategory: BudgetCategory | null = null;

    let runningTotal = 0;
    for (const category of data.categories) {
      runningTotal += category.amount;
      if (savedAmount >= runningTotal && !previouslyCompletedCategories.has(category.id)) {
        completedCategories.add(category.id);
        newMilestoneCategory = category; // Most recent milestone
      }
    }

    // If we've reached a new milestone
    if (newMilestoneCategory && !previouslyCompletedCategories.has(newMilestoneCategory.id)) {
      setMilestoneReached(newMilestoneCategory);
      setShowMilestoneMessage(true);
      
      // Update previously completed categories
      const updatedCompleted = new Set(previouslyCompletedCategories);
      completedCategories.forEach(id => updatedCompleted.add(id));
      setPreviouslyCompletedCategories(updatedCompleted);
      
      // Show toast celebration
      toast({
        title: `${newMilestoneCategory.milestoneEmoji} Milestone Reached!`,
        description: newMilestoneCategory.milestoneMessage,
        duration: 5000,
      });

      // Hide milestone message after delay
      setTimeout(() => {
        setShowMilestoneMessage(false);
      }, 5000);
    }
  }, [savedAmount, data, previouslyCompletedCategories, toast]);

  // Calculate progress percentage
  const calculateProgress = (saved: number, total: number) => {
    if (total === 0) return 0;
    const percentage = (saved / total) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

  // Handle saving money
  const handleAddMoney = (amount: number) => {
    setSavedAmount(prev => prev + amount);
  };

  // Check if a category is complete
  const isCategoryComplete = (categoryIndex: number) => {
    if (!data) return false;
    
    let runningTotal = 0;
    for (let i = 0; i <= categoryIndex; i++) {
      runningTotal += data.categories[i].amount;
    }
    
    return savedAmount >= runningTotal;
  };

  // Get progress for a specific category
  const getCategoryProgress = (categoryIndex: number) => {
    if (!data) return 0;
    
    let previousCategoriesTotal = 0;
    for (let i = 0; i < categoryIndex; i++) {
      previousCategoriesTotal += data.categories[i].amount;
    }
    
    const categoryAmount = data.categories[categoryIndex].amount;
    const savedForCategory = Math.max(0, Math.min(categoryAmount, savedAmount - previousCategoriesTotal));
    
    return (savedForCategory / categoryAmount) * 100;
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className={heading}>Trip Budget</CardTitle>
          <CardDescription>
            Budget information couldn't be loaded.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Please try again later or contact support.
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalBudget = data.total;
  const totalProgress = calculateProgress(savedAmount, totalBudget);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className={heading}>
          Trip Budget Planner
        </CardTitle>
        <CardDescription>
          Track your savings progress toward your dream vacation
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Overall Progress */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm font-medium">
              ${savedAmount.toLocaleString()} / ${totalBudget.toLocaleString()}
            </span>
          </div>
          <Progress value={totalProgress} className="h-3" />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>Just Starting</span>
            <span>Halfway There</span>
            <span>Ready to Go!</span>
          </div>
        </div>

        {/* Add Money Buttons */}
        <div className="mb-6 grid grid-cols-3 gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleAddMoney(50)}
            className="flex items-center"
          >
            <Plus className="mr-1 h-4 w-4" /> $50
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleAddMoney(100)}
            className="flex items-center"
          >
            <Plus className="mr-1 h-4 w-4" /> $100
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleAddMoney(500)}
            className="flex items-center"
          >
            <Plus className="mr-1 h-4 w-4" /> $500
          </Button>
        </div>

        {/* Milestone Message */}
        {showMilestoneMessage && milestoneReached && (
          <div className="mb-6 p-4 bg-primary/10 rounded-lg text-center">
            <div className="text-2xl mb-1">{milestoneReached.milestoneEmoji}</div>
            <p className="font-medium">{milestoneReached.milestoneMessage}</p>
          </div>
        )}

        {/* Category Breakdown */}
        <h3 className={`text-lg font-semibold ${heading} mb-4`}>Budget Breakdown</h3>
        <div className="space-y-4">
          {data.categories.map((category, index) => (
            <div key={category.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-3 text-xl"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <h4 className="font-medium">{category.name}</h4>
                    <p className="text-xs text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${category.amount}</div>
                  {isCategoryComplete(index) && (
                    <div className="text-xs text-primary flex items-center">
                      <Check className="h-3 w-3 mr-1" /> Complete
                    </div>
                  )}
                </div>
              </div>
              <Progress 
                value={getCategoryProgress(index)} 
                className="h-2"
                style={{ 
                  backgroundColor: `${category.color}20`,
                  '--progress-background': category.color
                } as React.CSSProperties}
              />
            </div>
          ))}
        </div>

        {/* Currency Note */}
        <div className="mt-6 flex items-center text-xs text-muted-foreground">
          <DollarSign className="h-3 w-3 mr-1" />
          <span>All amounts shown in {data.currency}</span>
        </div>
      </CardContent>
    </Card>
  );
}