import React from 'react';
import { Card } from '@/components/ui/card';
import { useFonts } from '@/components/ui/fonts';

interface Testimonial {
  id: string;
  name: string;
  image: string;
  text: string;
  location?: string;
  rating: number;
  additionalQuestion?: {
    question: string;
    answer: string;
  };
}

export default function CanadianTestimonials() {
  const { heading } = useFonts();
  
  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Leah Quinn',
      image: '/testimonials/leah-quinn.svg',
      text: 'I met Krynn over 20 years ago and in that time have always known her to be a deeply caring, compassionate, kind and sincere person. When she is passionate about something she puts her ALL into it - whether that be caring for animals, her travel adventures, raising her beautiful daughter (as a single mom) or supporting other women - Krynn can be counted on to go the distance. She is a beautiful soul that anyone would be fortunate to have in their corner.',
      rating: 5
    },
    {
      id: '2',
      name: 'Barrie Derbatz-Olson',
      image: '/testimonials/barrie-derbatz.svg',
      text: 'Yes, I would absolutely recommend your services. You have a unique ability to encourage and support people while providing accurate, reliable information. You make every effort to accommodate people\'s schedules and preferences, handling everything in an organized and timely manner. Your dedication ensures a smooth and personalized experience for everyone you work with.',
      rating: 5
    },
    {
      id: '3',
      name: 'Rose Ann Reininger',
      image: '/testimonials/rose-ann.svg',
      text: 'Krynn\'s enthusiasm is contagious! Her zest for travel creates an excitement and confidence throughout the planning stages of my tours. She is always there to lend an empathic ear when issues arise. I know that she "has my back" and is always "there" for me.',
      rating: 5,
      additionalQuestion: {
        question: 'What was most valuable about my travel coaching/advising or planning services?',
        answer: 'Krynn is an excellent problem solver. She is able to look outside the box and find solutions to roadblocks during the planning process. She is not a "quitter", she works very hard to "makes things right".'
      }
    }
  ];

  return (
    <div className="py-12 bg-red-50 rounded-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold sm:text-4xl ${heading} text-gray-900`}>
            What Canadian Snowbirds Say
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-600">
            Real feedback from Canadians who've trusted us with their winter escape planning
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="overflow-hidden bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                {/* Star Rating */}
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                {/* Testimonial Text */}
                <p className="text-gray-700 mb-6 text-base italic">"{testimonial.text}"</p>
                
                {/* Additional Q&A if available */}
                {testimonial.additionalQuestion && (
                  <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-800 mb-1">{testimonial.additionalQuestion.question}</p>
                    <p className="text-gray-700 text-sm">{testimonial.additionalQuestion.answer}</p>
                  </div>
                )}
                
                {/* User Info */}
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
                      <img 
                        src={testimonial.image} 
                        alt={`${testimonial.name} photo`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // If image fails to load, show the initials
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gray-200">
                            <span class="text-xl font-bold text-gray-600">
                              ${testimonial.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>`;
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{testimonial.name}</h4>
                    {testimonial.location && (
                      <p className="text-sm text-gray-600">{testimonial.location}</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 italic">
            All testimonials from real Canadian clients who've used our snowbird alternative services
          </p>
        </div>
      </div>
    </div>
  );
}