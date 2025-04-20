import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { EnhancedExperience } from "@shared/schema";
import { Calendar, MapPin, Users, Clock, Leaf, Award } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface EnhancedExperiencesResponse {
  experiences: EnhancedExperience[];
  destination: {
    id: number;
    name: string;
    country: string;
  };
}

interface EnhancedExperiencesProps {
  destinationId: number;
}

export default function EnhancedExperiences({ destinationId }: EnhancedExperiencesProps) {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("all");

  const { data, isLoading, error } = useQuery<EnhancedExperiencesResponse>({
    queryKey: ["/api/destinations", destinationId, "enhanced-experiences"],
    queryFn: () => 
      fetch(`/api/destinations/${destinationId}/enhanced-experiences`).then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch enhanced experiences");
        }
        return res.json();
      })
  });

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Local Experiences</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="p-4">
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent className="p-4">
                <Skeleton className="h-24 w-full" />
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2 p-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm my-6">
        <h2 className="text-2xl font-bold tracking-tight mb-2">Local Experiences</h2>
        <p className="text-muted-foreground">
          Sorry, we couldn't load the enhanced experiences for this destination.
        </p>
        <Button 
          className="mt-4"
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    );
  }

  // Filter experiences based on selected tab
  const filteredExperiences = data.experiences.filter(exp => {
    if (selectedTab === "all") return true;
    if (selectedTab === "seasonal" && exp.season) return true;
    if (selectedTab === "personal" && exp.personalNarrative) return true;
    return false;
  });

  const handleShare = (experienceTitle: string) => {
    navigator.clipboard.writeText(
      `Check out this amazing experience in ${data.destination.name}: ${experienceTitle}`
    );
    toast({
      title: "Link copied to clipboard",
      description: "You can now share this experience with friends and family",
    });
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Authentic Local Experiences
        </h2>
        <p className="text-muted-foreground max-w-3xl">
          Discover unique, personalized experiences with insights from travelers who've been there. 
          From seasonal events to local hidden gems, these are the authentic moments that transform a trip into a journey.
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Experiences</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal Highlights</TabsTrigger>
          <TabsTrigger value="personal">Personal Stories</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {filteredExperiences.length === 0 ? (
            <p className="text-muted-foreground">No experiences available for this filter.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {filteredExperiences.map((experience) => (
                <ExperienceCard key={experience.id} experience={experience} onShare={handleShare} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="seasonal" className="mt-0">
          {filteredExperiences.length === 0 ? (
            <p className="text-muted-foreground">No seasonal experiences available.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {filteredExperiences.map((experience) => (
                <ExperienceCard key={experience.id} experience={experience} onShare={handleShare} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="personal" className="mt-0">
          {filteredExperiences.length === 0 ? (
            <p className="text-muted-foreground">No personal narratives available.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {filteredExperiences.map((experience) => (
                <ExperienceCard key={experience.id} experience={experience} onShare={handleShare} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface ExperienceCardProps {
  experience: EnhancedExperience;
  onShare: (title: string) => void;
}

function ExperienceCard({ experience, onShare }: ExperienceCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-2 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{experience.title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {experience.specificLocation}
            </CardDescription>
          </div>
          {experience.season && (
            <Badge variant="outline" className="bg-primary/5 border-primary/20">
              <Calendar className="h-3 w-3 mr-1" /> 
              {experience.season}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-3">
        <p className="text-sm text-card-foreground mb-3">
          {experience.description}
        </p>

        <Accordion type="single" collapsible className="w-full">
          {experience.personalNarrative && (
            <AccordionItem value="personal-narrative">
              <AccordionTrigger className="text-sm font-medium py-2">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Traveler's Perspective
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm italic bg-muted/30 p-3 rounded-md">
                "{experience.personalNarrative}"
              </AccordionContent>
            </AccordionItem>
          )}
          
          {experience.seasonalEvent && (
            <AccordionItem value="seasonal-event">
              <AccordionTrigger className="text-sm font-medium py-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Seasonal Events
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm">
                {experience.seasonalEvent}
              </AccordionContent>
            </AccordionItem>
          )}

          {experience.bestTimeToVisit && (
            <AccordionItem value="best-time">
              <AccordionTrigger className="text-sm font-medium py-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Best Time to Visit
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm">
                {experience.bestTimeToVisit}
              </AccordionContent>
            </AccordionItem>
          )}

          {experience.localTip && (
            <AccordionItem value="local-tip">
              <AccordionTrigger className="text-sm font-medium py-2">
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-2" />
                  Local Tip
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm font-medium bg-muted/30 p-3 rounded-md">
                <div className="flex">
                  <Leaf className="h-4 w-4 mr-2 text-primary flex-shrink-0 mt-0.5" />
                  <span>{experience.localTip}</span>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex justify-between gap-4 border-t">
        <Button 
          variant="outline" 
          size="sm"
          className="text-xs"
          onClick={() => onShare(experience.title)}
        >
          Share Experience
        </Button>
      </CardFooter>
    </Card>
  );
}