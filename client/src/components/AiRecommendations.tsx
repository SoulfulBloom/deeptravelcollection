import { useQuery } from "@tanstack/react-query";
import { Loader2, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface AiRecommendationsProps {
  destinationId: number;
  destinationName: string;
}

interface Recommendation {
  tip: string;
}

interface RecommendationsResponse {
  recommendations: Recommendation[];
}

export default function AiRecommendations({ destinationId, destinationName }: AiRecommendationsProps) {
  const { toast } = useToast();
  
  const { data, isLoading, isError, refetch, isRefetching } = useQuery<RecommendationsResponse>({
    queryKey: [`/api/destinations/${destinationId}/recommendations`],
    enabled: false, // Don't load automatically - user needs to click the button
    retry: 1,
    retryDelay: 1000,
    gcTime: 0, // Don't cache the result to ensure fresh recommendations each time
  });

  const handleGenerateRecommendations = () => {
    console.log("Generating recommendations for destination:", destinationId);
    refetch()
      .then(response => {
        console.log("Recommendations response:", response);
        if (response.error) {
          throw response.error;
        }
      })
      .catch(error => {
        console.error("Error generating recommendations:", error);
        toast({
          title: "Error",
          description: "Failed to generate recommendations. Try again later.",
          variant: "destructive",
        });
      });
  };

  return (
    <Card className="mt-6 overflow-hidden border-t-4 border-t-primary shadow-md">
      <CardHeader className="bg-muted/30 pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="h-5 w-5 text-primary" />
          <span>AI Travel Recommendations</span>
        </CardTitle>
        <CardDescription>
          Get personalized AI-powered travel tips for {destinationName}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {!data && !isLoading && !isRefetching && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="mb-4 text-muted-foreground">
              Click the button below to generate personalized travel recommendations
              powered by AI.
            </p>
            <Button 
              onClick={handleGenerateRecommendations}
              disabled={isLoading || isRefetching}
              className="group relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <span className="relative">Generate Recommendations</span>
            </Button>
          </div>
        )}

        {(isLoading || isRefetching) && (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Generating recommendations...</p>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-red-500 mb-2">
              Sorry, we couldn't generate recommendations right now.
            </p>
            <Button 
              variant="outline" 
              onClick={handleGenerateRecommendations}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}

        {data && !isLoading && !isRefetching && (
          <div className="py-2">
            <ul className="space-y-3">
              {data.recommendations && Array.isArray(data.recommendations) ? (
                data.recommendations.map((recommendation: Recommendation, i: number) => (
                  <li key={i} className="flex gap-2 rounded-md bg-muted/40 p-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      {i + 1}
                    </span>
                    <span>{recommendation.tip}</span>
                  </li>
                ))
              ) : (
                <li className="rounded-md bg-muted/40 p-3 text-sm">
                  No recommendations available. Please try again.
                </li>
              )}
            </ul>
            <div className="mt-4 flex justify-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleGenerateRecommendations}
                disabled={isRefetching}
              >
                Regenerate Tips
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}