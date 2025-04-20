import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface FavoriteButtonProps {
  destinationId: number;
  className?: string;
}

export default function FavoriteButton({ destinationId, className = "" }: FavoriteButtonProps) {
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await apiRequest("GET", `/api/favorites/check/${destinationId}`);
        const data = await response.json();
        setIsFavorite(data.isFavorite);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    checkFavoriteStatus();
  }, [destinationId]);

  const handleToggleFavorite = async () => {
    setIsLoading(true);
    try {
      if (isFavorite) {
        await apiRequest("DELETE", `/api/favorites/${destinationId}`);
        toast({
          title: "Removed from favorites",
          description: "This destination has been removed from your favorites.",
        });
      } else {
        await apiRequest("POST", `/api/favorites`, { destinationId });
        toast({
          title: "Added to favorites",
          description: "This destination has been added to your favorites.",
        });
      }
      setIsFavorite(!isFavorite);
      
      // Invalidate the favorites count query to refresh the counter in the navbar
      queryClient.invalidateQueries({ queryKey: ['/api/favorites/count'] });
      
      // Also invalidate the favorites list query
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={`rounded-full ${className}`}
      onClick={handleToggleFavorite}
      disabled={isLoading}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart 
        className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-neutral-400"}`} 
      />
    </Button>
  );
}