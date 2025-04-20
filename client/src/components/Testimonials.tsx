import { useFonts } from "./ui/fonts";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";
import { Star, StarHalf } from "lucide-react";

interface Testimonial {
  id: number;
  userName: string;
  userAvatar: string;
  destinationName: string;
  country: string;
  rating: number;
  comment: string;
  itineraryName: string;
}

export default function Testimonials() {
  const { heading } = useFonts();
  
  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });
  
  return (
    <div id="testimonials" className="bg-neutral-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className={`text-3xl font-bold text-neutral-900 sm:text-4xl ${heading}`}>
            What Travelers Say
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-neutral-500 sm:mt-4">
            Hear from travelers who used our itineraries for their trips
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            // Loading skeleton
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center mb-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="ml-4">
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/3 mt-4" />
            </div>
          ) : (
            // Show only the first testimonial with enhanced styling
            testimonials && Array.isArray(testimonials) && testimonials.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center mb-6">
                  <div className="flex-shrink-0">
                    <img 
                      className="h-16 w-16 rounded-full object-cover border-2 border-primary" 
                      src={testimonials[0].userAvatar} 
                      alt={`${testimonials[0].userName} avatar`}
                    />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xl font-semibold text-neutral-900">{testimonials[0].userName}</h4>
                    <div className="flex items-center">
                      {[...Array(Math.floor(testimonials[0].rating))].map((_, i) => (
                        <Star key={i} className="text-yellow-400 h-5 w-5 fill-current" />
                      ))}
                      {testimonials[0].rating % 1 > 0 && (
                        <StarHalf className="text-yellow-400 h-5 w-5 fill-current" />
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-neutral-700 text-lg italic mb-6 leading-relaxed">
                  "{testimonials[0].comment}"
                </p>
                <div className="flex items-center text-sm font-medium text-neutral-500">
                  <span className="mr-2">Used:</span>
                  <span className="text-primary">{testimonials[0].itineraryName}</span>
                  <span className="mx-2">•</span>
                  <span>{testimonials[0].destinationName}, {testimonials[0].country}</span>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
