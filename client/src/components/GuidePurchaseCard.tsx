import { useLocation } from "wouter";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GuidePurchaseCardProps {
  guideId: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  guideType: 'immersive' | 'snowbird';
  isAuthenticated?: boolean;
}

export function GuidePurchaseCard({
  guideId,
  title,
  description,
  price,
  imageUrl,
  guideType,
  isAuthenticated = true // Default to true for now, implement auth check later
}: GuidePurchaseCardProps) {
  const [, setLocation] = useLocation();

  const handlePurchase = () => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      setLocation(`/signin?redirect=/guide/${guideId}`);
      return;
    }
    
    // Redirect to checkout page with guide info
    const type = guideType === 'immersive' ? 'premium_itinerary' : 'snowbird_destination';
    setLocation(`/checkout?destinationId=${guideId}&type=${type}&product=${guideId}`);
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 mb-4">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-xl font-bold">${price.toFixed(2)}</span>
        <Button 
          variant={guideType === 'immersive' ? 'outline' : 'default'} 
          onClick={handlePurchase}
          className={guideType === 'immersive' ? 'border-blue-500 text-blue-600 hover:bg-blue-50' : 'bg-blue-600 hover:bg-blue-700'}
        >
          Purchase Guide
        </Button>
      </CardFooter>
    </Card>
  );
}