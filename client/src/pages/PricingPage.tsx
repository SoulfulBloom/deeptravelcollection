import React from "react";
import { Link } from "wouter";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Check, CreditCard, Calendar } from "lucide-react";
import { SubscriptionCard } from "@/components/SubscriptionCard";

const PricingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Choose the option that works best for your travel needs
          </p>
        </div>
      </section>

      {/* Individual Guides Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Individual Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Immersive Experience Guides */}
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-center">Immersive Experience Guides</CardTitle>
                <div className="text-center mt-4">
                  <span className="text-4xl font-bold">$15.99</span>
                  <span className="text-gray-500"> / guide</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>7-day authentic cultural itineraries</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Local hidden gems and experiences</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Cultural context and insights</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Practical travel logistics</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>One-time purchase, lifetime access</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/immersive-experiences">
                    Browse Immersive Guides
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Snowbird Destination Guides */}
            <Card className="shadow-lg border-blue-500 border-2">
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-2">
                  <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                </div>
                <CardTitle className="text-2xl font-bold text-center">Snowbird Destination Guides</CardTitle>
                <div className="text-center mt-4">
                  <span className="text-4xl font-bold">$24.99</span>
                  <span className="text-gray-500"> / guide</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Comprehensive 3-month itineraries</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Healthcare system navigation</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Provincial insurance compatibility</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Canadian community connections</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Financial and housing guidance</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>One-time purchase, lifetime access</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href="/canadian-snowbirds/destinations">
                    Browse Snowbird Guides
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Subscription Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">All-Access Subscription</h2>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SubscriptionCard 
                title="Monthly All-Access"
                description="Full access with monthly billing"
                price={19.99}
                interval="monthly"
                features={[
                  "All Immersive Experience Guides (12+ destinations)",
                  "All Snowbird Destination Guides (13+ destinations)",
                  "Monthly content updates and new destinations",
                  "Priority support",
                  "Cancel anytime"
                ]}
              />
              
              <SubscriptionCard 
                title="Annual All-Access"
                description="Our best value option"
                price={199}
                interval="annual"
                isPopular={true}
                savingsAmount={40}
                features={[
                  "All Immersive Experience Guides (12+ destinations)",
                  "All Snowbird Destination Guides (13+ destinations)",
                  "Monthly content updates and new destinations",
                  "Priority support and early access",
                  "Downloadable PDFs of all guides",
                  "Two months free compared to monthly"
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-2">What's included in each guide?</h3>
              <p className="text-gray-700">
                Each guide includes detailed itineraries, local recommendations, cultural insights, 
                practical travel information, and downloadable resources. Snowbird guides also include 
                healthcare information, housing options, and community connections.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">How long do I have access to a guide after purchase?</h3>
              <p className="text-gray-700">
                Individual guide purchases provide lifetime access to the guide, including any future updates 
                to that specific guide.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Can I cancel my subscription?</h3>
              <p className="text-gray-700">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the 
                end of your billing period. For annual subscriptions, we do not provide prorated refunds for 
                mid-term cancellations.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Are the guides downloadable?</h3>
              <p className="text-gray-700">
                Yes, all guides can be downloaded as PDFs for offline use. This feature is available for 
                both individual guide purchases and subscription members.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">How often are new guides added?</h3>
              <p className="text-gray-700">
                We add new destination guides every month. As a subscription member, you'll get immediate 
                access to all new guides as they're published.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Whether you're planning a short cultural immersion or a longer snowbird stay, 
            we have the perfect guide to help you experience authentic travel.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/immersive-experiences">
                Explore Immersive Guides
              </Link>
            </Button>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/checkout?type=annual_subscription">
                Get All-Access Subscription
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;