import { useLocation } from "wouter";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface SubscriptionCardProps {
  title: string;
  description: string;
  price: number;
  interval: 'monthly' | 'annual';
  features: string[];
  isPopular?: boolean;
  savingsAmount?: number;
  isAuthenticated?: boolean;
}

export function SubscriptionCard({
  title,
  description,
  price,
  interval,
  features,
  isPopular = false,
  savingsAmount,
  isAuthenticated = true // Default to true for now, implement auth check later
}: SubscriptionCardProps) {
  const [, setLocation] = useLocation();

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      setLocation(`/signin?redirect=/subscription-plan/${interval}`);
      return;
    }
    
    // Redirect to subscription checkout page
    setLocation(`/subscription-plan/${interval}`);
  };

  return (
    <Card className={`h-full flex flex-col ${isPopular ? 'border-green-500 border-2' : ''}`}>
      {isPopular && (
        <div className="bg-green-500 text-white text-center py-1 text-sm font-medium">
          MOST POPULAR
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">${price.toFixed(2)}</span>
          <span className="text-gray-500 ml-1">
            /{interval === 'monthly' ? 'month' : 'year'}
          </span>
          {savingsAmount && (
            <div className="text-green-600 text-sm font-medium mt-1">
              Save ${savingsAmount.toFixed(2)}!
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubscribe}
          className={`w-full ${isPopular ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {interval === 'monthly' ? 'Subscribe Monthly' : 'Subscribe Annually'}
        </Button>
      </CardFooter>
    </Card>
  );
}