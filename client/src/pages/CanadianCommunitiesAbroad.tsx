import React from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Home, MapPin, Users, Calendar, Globe, Phone, Flag, Building } from "lucide-react";
import { Link } from "wouter";

const CanadianCommunitiesAbroad = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Find Your Canadian Community Abroad
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Connect with thriving Canadian expatriate communities in popular snowbird destinations for support, friendship, and a taste of home
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4 border-b">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home className="h-4 w-4 mr-1" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/canadian-snowbirds">
                Canadian Snowbirds
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Canadian Communities Abroad</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      {/* Introduction */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Introduction</h2>
            <p className="text-lg text-gray-700 mb-6">
              One of the most valuable resources for Canadian snowbirds is the network of fellow Canadians already established in international destinations. These communities provide instant social connections, practical local knowledge, and a touch of home in your new winter location. Our comprehensive guide to Canadian communities abroad helps you locate, connect with, and benefit from these networks before you even leave Canada.
            </p>
          </div>
        </div>
      </section>

      {/* Destination Tabs */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Discover Canadian Communities by Destination</h2>
            
            <Tabs defaultValue="mexico" className="w-full">
              <div className="flex justify-center mb-6">
                <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  <TabsTrigger value="mexico">Mexico</TabsTrigger>
                  <TabsTrigger value="panama">Panama</TabsTrigger>
                  <TabsTrigger value="colombia">Colombia</TabsTrigger>
                  <TabsTrigger value="portugal">Portugal</TabsTrigger>
                  <TabsTrigger value="costa-rica">Costa Rica</TabsTrigger>
                </TabsList>
              </div>
              
              {/* Mexico Tab */}
              <TabsContent value="mexico" className="border rounded-lg p-6 bg-white">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <div className="flex items-center mb-4">
                      <MapPin className="text-red-600 mr-2 h-6 w-6" />
                      <h3 className="text-2xl font-bold">Lake Chapala/Ajijic</h3>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <p className="flex items-center">
                        <Users className="text-blue-700 mr-2 h-5 w-5" /> 
                        <span className="font-semibold">Canadian Population:</span>
                        <span className="ml-2">5,000+ during winter months</span>
                      </p>
                      <p className="flex items-center mt-2">
                        <Calendar className="text-blue-700 mr-2 h-5 w-5" /> 
                        <span className="font-semibold">Established Since:</span>
                        <span className="ml-2">1980s, significant growth since 2010</span>
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-xl font-semibold mb-2">Organizations:</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Canadian Club of Lake Chapala - Meets weekly at La Nueva Posada</li>
                        <li>Canadians in Mexico Association - Provides support services for new arrivals</li>
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-xl font-semibold mb-2">Regular Events:</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Weekly coffee meetups (Thursdays, 10am at La Nueva Posada)</li>
                        <li>Monthly potluck dinners (First Saturday, 6pm at Lake Chapala Society)</li>
                        <li>Canada Day celebration (July 1st, Lake Chapala Society grounds)</li>
                        <li>Weekly farmers market with Canadian vendors (Wednesdays)</li>
                        <li>Monthly Canadian business networking (First Monday)</li>
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-xl font-semibold mb-2">Community Hubs:</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>La Nueva Posada - Popular restaurant and meeting spot</li>
                        <li>Lake Chapala Society - Cultural center with 2,500+ members</li>
                        <li>Ajijic Auditorium - Hosts Canadian events and performances</li>
                        <li>El Parque - Central gathering area for Canadian expats</li>
                        <li>Costalegre Mall - Shopping area with Canadian-owned stores</li>
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-xl font-semibold mb-2">Online Groups:</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>"Canadians in Lake Chapala" Facebook group (3,200+ members)</li>
                        <li>Chapala.com Forum - Active discussion board with Canadian section</li>
                        <li>"Lake Chapala Canadian Snowbirds" Facebook group</li>
                        <li>WhatsApp group for new Canadian arrivals</li>
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-xl font-semibold mb-2">Local Canadian Businesses:</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Tim's Tacos (Canadian-owned restaurant)</li>
                        <li>Maple Leaf Grill (Canadian-themed restaurant)</li>
                        <li>Canadian Insurance Services (Specialized in Canadian travel insurance)</li>
                        <li>Lake Chapala Real Estate (Canadian-owned realty company)</li>
                        <li>Ajijic Dental Clinic (Canadian dentists)</li>
                        <li>Lakeside Medical Group (Canadian doctors available)</li>
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-xl font-semibold mb-2">Healthcare Options:</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Ribera Medical Center - English-speaking staff, accepts Canadian insurance</li>
                        <li>Lakeside Medical Group - Established clinic with Canadian doctors</li>
                        <li>Cruz Roja (Red Cross) - 24/7 emergency services with bilingual staff</li>
                        <li>Maskaras Hospital - Private facility with Canadian patient liaison</li>
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-xl font-semibold mb-2">Volunteer Opportunities:</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Lake Chapala Society volunteer programs</li>
                        <li>Canadian-led English teaching initiatives</li>
                        <li>Animal rescue organizations (many Canadian-run)</li>
                        <li>Community development projects through Canadian Club</li>
                      </ul>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="flex items-center mb-4">
                      <MapPin className="text-red-600 mr-2 h-6 w-6" />
                      <h3 className="text-2xl font-bold">Puerto Vallarta</h3>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <p className="flex items-center">
                        <Users className="text-blue-700 mr-2 h-5 w-5" /> 
                        <span className="font-semibold">Canadian Population:</span>
                        <span className="ml-2">6,000+ during winter months</span>
                      </p>
                      <p className="flex items-center mt-2">
                        <Calendar className="text-blue-700 mr-2 h-5 w-5" /> 
                        <span className="font-semibold">Established Since:</span>
                        <span className="ml-2">1970s, major growth since 2000</span>
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-xl font-semibold mb-2">Organizations:</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Canadian Society of Puerto Vallarta - Meets monthly</li>
                        <li>International Friendship Club (IFC) - Popular among Canadians</li>
                        <li>Rotary Club (Canadian chapter)</li>
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-xl font-semibold mb-2">Regular Events:</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Weekly beach gatherings (Fridays, 4pm at Los Muertos Beach)</li>
                        <li>Monthly social dinners (Third Thursday, various restaurants)</li>
                        <li>Hockey viewing parties (during NHL playoffs, at Nacho Daddy's)</li>
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-xl font-semibold mb-2">Community Hubs:</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Nacho Daddy's - Popular Canadian hangout</li>
                        <li>Page in the Sun bookstore - Canadian-owned with community board</li>
                        <li>Marina Vallarta - Area with high Canadian resident concentration</li>
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-xl font-semibold mb-2">Online Groups:</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>"Canadians Living in Vallarta" Facebook group (4,500+ members)</li>
                        <li>"Puerto Vallarta Expat Network" Facebook group</li>
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-xl font-semibold mb-2">Local Canadian Businesses:</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Canadian Corner Store (Imports Canadian products)</li>
                        <li>Winnipeg Pete's Sports Bar (Canadian-owned sports bar)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Panama Tab */}
              <TabsContent value="panama" className="border rounded-lg p-6 bg-white">
                <div>
                  <div className="flex items-center mb-4">
                    <MapPin className="text-red-600 mr-2 h-6 w-6" />
                    <h3 className="text-2xl font-bold">Coronado</h3>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="flex items-center">
                      <Users className="text-blue-700 mr-2 h-5 w-5" /> 
                      <span className="font-semibold">Canadian Population:</span>
                      <span className="ml-2">1,500+ during winter months</span>
                    </p>
                    <p className="flex items-center mt-2">
                      <Calendar className="text-blue-700 mr-2 h-5 w-5" /> 
                      <span className="font-semibold">Established Since:</span>
                      <span className="ml-2">2005, steady growth</span>
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-xl font-semibold mb-2">Organizations:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Coronado Social Association - Strong Canadian membership</li>
                      <li>Canadian Club of Panama - Monthly meetings</li>
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-xl font-semibold mb-2">Regular Events:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Weekly farmers market (Mondays, Coronado Mall parking lot)</li>
                      <li>Monthly Canadian dinner (Last Friday, varies by restaurant)</li>
                      <li>Quarterly beach cleanups (Organized by Canadian residents)</li>
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-xl font-semibold mb-2">Community Hubs:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Coronado Golf Club - Popular with Canadian residents</li>
                      <li>Picasso Restaurant - Regular Canadian gatherings</li>
                      <li>El Rey Coronado - Canadian shopping meetup spot</li>
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-xl font-semibold mb-2">Online Groups:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>"Canadians in Panama" Facebook group (1,200+ members)</li>
                      <li>"Expats in Coronado, Panama" Facebook group</li>
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-xl font-semibold mb-2">Local Canadian Businesses:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Maple Leaf Realty (Canadian-owned real estate)</li>
                      <li>Canadian Insurance Panama (Specialized services for Canadians)</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              {/* Colombia Tab */}
              <TabsContent value="colombia" className="border rounded-lg p-6 bg-white">
                <div>
                  <div className="flex items-center mb-4">
                    <MapPin className="text-red-600 mr-2 h-6 w-6" />
                    <h3 className="text-2xl font-bold">Medellín</h3>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="flex items-center">
                      <Users className="text-blue-700 mr-2 h-5 w-5" /> 
                      <span className="font-semibold">Canadian Population:</span>
                      <span className="ml-2">1,000+ and growing rapidly</span>
                    </p>
                    <p className="flex items-center mt-2">
                      <Calendar className="text-blue-700 mr-2 h-5 w-5" /> 
                      <span className="font-semibold">Established Since:</span>
                      <span className="ml-2">2015, fastest-growing Canadian community</span>
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-xl font-semibold mb-2">Organizations:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Medellín Canadian Association - Monthly gatherings</li>
                      <li>First Thursday Medellín - Popular networking event with Canadian section</li>
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-xl font-semibold mb-2">Regular Events:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Monthly Canadian meetups (Second Wednesday, Poblado area)</li>
                      <li>Language exchange events (Weekly, with Canadian participation)</li>
                      <li>Quarterly Canadian business networking (Organized by Canadian entrepreneurs)</li>
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-xl font-semibold mb-2">Community Hubs:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Café Velvet - Popular Canadian digital nomad workspace</li>
                      <li>Parque Lleras - Area with Canadian-frequented establishments</li>
                      <li>Provenza district - Popular Canadian residence area</li>
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-xl font-semibold mb-2">Online Groups:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>"Canadians in Medellín" Facebook group (800+ members)</li>
                      <li>"Canadian Expats in Colombia no Jerks" Facebook group</li>
                      <li>Medellín Guru - Website with Canadian section</li>
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-xl font-semibold mb-2">Local Canadian Businesses:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Maple Tech Hub (Canadian-owned coworking space)</li>
                      <li>True North Café (Canadian-themed café)</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              {/* Portugal Tab */}
              <TabsContent value="portugal" className="border rounded-lg p-6 bg-white">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <div className="flex items-center mb-4">
                      <MapPin className="text-red-600 mr-2 h-6 w-6" />
                      <h3 className="text-2xl font-bold">Algarve Region</h3>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <p className="flex items-center">
                        <Users className="text-blue-700 mr-2 h-5 w-5" /> 
                        <span className="font-semibold">Canadian Population:</span>
                        <span className="ml-2">2,000+ and growing rapidly</span>
                      </p>
                      <p className="flex items-center mt-2">
                        <Calendar className="text-blue-700 mr-2 h-5 w-5" /> 
                        <span className="font-semibold">Established Since:</span>
                        <span className="ml-2">2010, accelerated growth since 2018</span>
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-xl font-semibold mb-2">Organizations:</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Algarve Canadian Club - Monthly meetings</li>
                        <li>Canadian-Portuguese Cultural Association - Cultural events</li>
                        <li>International Women in Portugal - Strong Canadian membership</li>
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-xl font-semibold mb-2">Regular Events:</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Monthly Canadian meetups (First Tuesday, varies by location)</li>
                        <li>Weekly golf gatherings (Thursdays, rotating courses)</li>
                        <li>Annual Canada Day beach party (July 1st, Praia da Rocha)</li>
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-xl font-semibold mb-2">Community Hubs:</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>The Black Anchor - Canadian-owned pub</li>
                        <li>Holiday Inn Algarve - Hosts Canadian events</li>
                        <li>Algarve Shopping - Canadian shopping meetup spot</li>
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-xl font-semibold mb-2">Online Groups:</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>"Canadians in the Algarve" Facebook group (1,500+ members)</li>
                        <li>"Canadians in Portugal" Facebook group (3,200+ members)</li>
                        <li>Expats Portugal Forum - Active Canadian section</li>
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-xl font-semibold mb-2">Local Canadian Businesses:</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Maple Leaf Properties Algarve (Canadian-owned real estate)</li>
                        <li>Canadian Corner Store (Imports Canadian products)</li>
                      </ul>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="flex items-center mb-4">
                      <MapPin className="text-red-600 mr-2 h-6 w-6" />
                      <h3 className="text-2xl font-bold">Lisbon/Cascais</h3>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <p className="flex items-center">
                        <Users className="text-blue-700 mr-2 h-5 w-5" /> 
                        <span className="font-semibold">Canadian Population:</span>
                        <span className="ml-2">1,500+ and growing</span>
                      </p>
                      <p className="flex items-center mt-2">
                        <Calendar className="text-blue-700 mr-2 h-5 w-5" /> 
                        <span className="font-semibold">Established Since:</span>
                        <span className="ml-2">2015, steady growth</span>
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-xl font-semibold mb-2">Organizations:</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Lisbon Canadian Network - Monthly gatherings</li>
                        <li>Canadian-Portuguese Business Association - Business networking</li>
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-xl font-semibold mb-2">Regular Events:</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Monthly Canadian social (Second Thursday, varies by venue)</li>
                        <li>Weekly language exchange (Tuesdays, with Canadian section)</li>
                        <li>Quarterly Canadian business networking (Organized by Canadian entrepreneurs)</li>
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-xl font-semibold mb-2">Community Hubs:</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>The Couch Sports Bar - Shows Canadian sports</li>
                        <li>Mercado de Campo de Ourique - Popular Canadian meetup spot</li>
                        <li>Cascais Marina - Weekend gathering area</li>
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-xl font-semibold mb-2">Online Groups:</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>"Canadians in Lisbon" Facebook group (900+ members)</li>
                        <li>"Expats in Lisbon" Facebook group - Active Canadian section</li>
                        <li>Meetup.com Portugal groups - Several Canadian-focused groups</li>
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-xl font-semibold mb-2">Local Canadian Businesses:</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Maple Leaf Consulting (Canadian-owned business services)</li>
                        <li>The Poutine Factory (Canadian restaurant)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Costa Rica Tab */}
              <TabsContent value="costa-rica" className="border rounded-lg p-6 bg-white">
                <div>
                  <div className="flex items-center mb-4">
                    <MapPin className="text-red-600 mr-2 h-6 w-6" />
                    <h3 className="text-2xl font-bold">Central Valley (San José, Escazú, Santa Ana)</h3>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="flex items-center">
                      <Users className="text-blue-700 mr-2 h-5 w-5" /> 
                      <span className="font-semibold">Canadian Population:</span>
                      <span className="ml-2">4,000+ during winter months</span>
                    </p>
                    <p className="flex items-center mt-2">
                      <Calendar className="text-blue-700 mr-2 h-5 w-5" /> 
                      <span className="font-semibold">Established Since:</span>
                      <span className="ml-2">1990s, steady growth</span>
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-xl font-semibold mb-2">Organizations:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Association of Residents of Costa Rica (ARCR) - Popular among Canadians</li>
                      <li>Canadian Club of Costa Rica - Monthly meetings</li>
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-xl font-semibold mb-2">Regular Events:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Monthly Canadian meetups (First Tuesday, 5pm at Tin Jo Restaurant)</li>
                      <li>Canada Day celebration (July 1st, location varies annually)</li>
                      <li>Weekly coffee mornings (Wednesdays, 9am at Spoon Restaurant, Escazú)</li>
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-xl font-semibold mb-2">Community Hubs:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Tin Jo Restaurant - Regular Canadian gatherings</li>
                      <li>Plaza Itskatzú - Shopping center popular with expats</li>
                      <li>Price Smart Escazú - Canadian shopping meetup spot</li>
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-xl font-semibold mb-2">Online Groups:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>"Canadian Expats in Costa Rica" Facebook group (2,800+ members)</li>
                      <li>"Costa Rica Living" Facebook group - Active Canadian participation</li>
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-xl font-semibold mb-2">Local Canadian Businesses:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Maple Leaf Dental Clinic (Canadian dentists)</li>
                      <li>Canadian Real Estate Costa Rica (Specializing in Canadian buyers)</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
      
      {/* Community Resources Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Community Resources</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <Users className="text-blue-700 mr-2 h-6 w-6" />
                  <h3 className="text-2xl font-bold">Connect with Canadian Communities</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Community Directories</h4>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700">
                      <li>Canadian Clubs and Associations Directory
                        <ul className="list-disc pl-6 space-y-1 text-gray-700 mt-1">
                          <li>Comprehensive listings of Canadian clubs by country</li>
                          <li>Contact information for community leaders</li>
                          <li>Membership requirements and benefits</li>
                          <li>Meeting schedules and locations</li>
                          <li>Special interest subgroups (sports, arts, volunteering)</li>
                        </ul>
                      </li>
                      <li className="mt-2">Regional Canadian Business Directories
                        <ul className="list-disc pl-6 space-y-1 text-gray-700 mt-1">
                          <li>Canadian-owned businesses by destination</li>
                          <li>Services catering to Canadian needs</li>
                          <li>Special offers for Canadian customers</li>
                          <li>Business networking opportunities</li>
                        </ul>
                      </li>
                      <li className="mt-2">Healthcare Providers Directory
                        <ul className="list-disc pl-6 space-y-1 text-gray-700 mt-1">
                          <li>Medical professionals familiar with Canadian insurance</li>
                          <li>Canadian-trained doctors and dentists</li>
                          <li>Hospitals with Canadian patient services</li>
                          <li>Pharmacies carrying Canadian medications</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Canadian Events Calendar</h4>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700">
                      <li>Monthly Calendar by Destination
                        <ul className="list-disc pl-6 space-y-1 text-gray-700 mt-1">
                          <li>Canada Day celebrations (July 1st)</li>
                          <li>Thanksgiving gatherings (October)</li>
                          <li>Hockey tournaments and viewing parties</li>
                          <li>Newcomer welcome events</li>
                          <li>Charitable and volunteer opportunities</li>
                        </ul>
                      </li>
                      <li className="mt-2">Cultural Exchange Events
                        <ul className="list-disc pl-6 space-y-1 text-gray-700 mt-1">
                          <li>Canadian-local cultural integration activities</li>
                          <li>Language exchange meetups</li>
                          <li>Cooking classes featuring Canadian cuisine</li>
                          <li>Local festivals with Canadian participation</li>
                        </ul>
                      </li>
                      <li className="mt-2">Canadian Sports Leagues
                        <ul className="list-disc pl-6 space-y-1 text-gray-700 mt-1">
                          <li>Canadian-organized hockey leagues</li>
                          <li>Curling clubs and tournaments</li>
                          <li>Golf tournaments for Canadian expats</li>
                          <li>Baseball and softball leagues</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Newcomer Integration Programs</h4>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700">
                      <li>Mentorship Matching
                        <ul className="list-disc pl-6 space-y-1 text-gray-700 mt-1">
                          <li>Connect with established Canadian residents</li>
                          <li>One-on-one guidance from experienced expats</li>
                          <li>Family matching for couples and families</li>
                          <li>Professional mentoring by industry</li>
                        </ul>
                      </li>
                      <li className="mt-2">Arrival Orientation Programs
                        <ul className="list-disc pl-6 space-y-1 text-gray-700 mt-1">
                          <li>Orientation tours and welcome packages</li>
                          <li>Language exchange partnerships</li>
                          <li>Local knowledge sharing sessions</li>
                          <li>Emergency support networks</li>
                          <li>Banking and financial setup assistance</li>
                        </ul>
                      </li>
                      <li className="mt-2">Digital Connection Services
                        <ul className="list-disc pl-6 space-y-1 text-gray-700 mt-1">
                          <li>Pre-arrival virtual meetups</li>
                          <li>Online forums for newcomers</li>
                          <li>Digital resource libraries</li>
                          <li>Virtual orientation sessions</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <Globe className="text-blue-700 mr-2 h-6 w-6" />
                  <h3 className="text-2xl font-bold">Canadian Services Abroad</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Canadian Government Resources</h4>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700">
                      <li>Consulates and Embassies
                        <ul className="list-disc pl-6 text-gray-700 mt-1">
                          <li>Mexico: Canadian Embassy in Mexico City</li>
                          <li>Costa Rica: Canadian Embassy in San José</li>
                          <li>Panama: Canadian Embassy in Panama City</li>
                          <li>Colombia: Canadian Embassy in Bogotá</li>
                          <li>Portugal: Canadian Embassy in Lisbon</li>
                          <li>Thailand: Canadian Embassy in Bangkok</li>
                        </ul>
                      </li>
                      <li className="mt-2">Emergency Assistance
                        <ul className="list-disc pl-6 text-gray-700 mt-1">
                          <li>24/7 Emergency Watch and Response Centre: +1-613-996-8885</li>
                          <li>Email: sos@international.gc.ca</li>
                          <li>Global Affairs Canada - Travel Information: 1-800-267-6788</li>
                          <li>Medical emergencies: local emergency numbers provided for each destination</li>
                          <li>Emergency fund transfer services</li>
                        </ul>
                      </li>
                      <li className="mt-2">Government Services
                        <ul className="list-disc pl-6 text-gray-700 mt-1">
                          <li>Registration of Canadians Abroad service</li>
                          <li>Travel advisories and updates</li>
                          <li>Passport services abroad</li>
                          <li>Notarial services (passport applications, document authentication, legal presence)</li>
                          <li>Voting services for Canadian elections</li>
                          <li>Pension and benefits services</li>
                          <li>Citizenship applications for children born abroad</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Canadian Healthcare Support</h4>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700">
                      <li>Medical Referral Network
                        <ul className="list-disc pl-6 text-gray-700 mt-1">
                          <li>Embassy-vetted medical facilities by destination</li>
                          <li>English and French-speaking medical professionals</li>
                          <li>Canadian-trained doctors and specialists</li>
                          <li>Medical evacuation service providers</li>
                          <li>Mental health resources for Canadians abroad</li>
                        </ul>
                      </li>
                      <li className="mt-2">Insurance Assistance
                        <ul className="list-disc pl-6 text-gray-700 mt-1">
                          <li>Help with insurance claims in foreign hospitals</li>
                          <li>Liaison services with Canadian insurance providers</li>
                          <li>Assistance with medical documentation</li>
                          <li>Emergency coverage information</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Canadian Businesses Abroad</h4>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700">
                      <li>Food and Dining
                        <ul className="list-disc pl-6 text-gray-700 mt-1">
                          <li>Canadian-owned restaurants and cafés</li>
                          <li>Specialty food stores with Canadian products</li>
                          <li>Maple syrup suppliers and Canadian food imports</li>
                          <li>Canadian bakeries and coffee shops</li>
                          <li>Poutine restaurants and Canadian comfort food</li>
                        </ul>
                      </li>
                      <li className="mt-2">Professional Services
                        <ul className="list-disc pl-6 text-gray-700 mt-1">
                          <li>Canadian accountants specializing in cross-border taxation</li>
                          <li>Legal services for Canadians abroad</li>
                          <li>Canadian real estate specialists</li>
                          <li>Healthcare providers familiar with Canadian insurance</li>
                          <li>Investment advisors for Canadian snowbirds</li>
                          <li>Education consultants for families with children</li>
                        </ul>
                      </li>
                      <li className="mt-2">Entertainment and Recreation
                        <ul className="list-disc pl-6 text-gray-700 mt-1">
                          <li>Canadian sports viewing venues</li>
                          <li>Hockey leagues and curling clubs</li>
                          <li>Canadian cultural events and performances</li>
                          <li>Canadian book clubs and libraries</li>
                          <li>Canadian-style recreational facilities</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Banking and Financial Services</h4>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700">
                      <li>Canadian Banking Partnerships
                        <ul className="list-disc pl-6 text-gray-700 mt-1">
                          <li>Local banks with Canadian partnerships</li>
                          <li>ATM fee reimbursement programs</li>
                          <li>Preferred exchange rates for Canadians</li>
                          <li>Cross-border banking services</li>
                        </ul>
                      </li>
                      <li className="mt-2">Tax Services
                        <ul className="list-disc pl-6 text-gray-700 mt-1">
                          <li>Canadian tax preparation services</li>
                          <li>Cross-border tax specialists</li>
                          <li>Residency status consulting</li>
                          <li>Foreign income reporting assistance</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-12 bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Connect Before You Travel</h2>
            <p className="text-xl mb-8">
              Join online communities, reach out to local Canadian associations, and start building your network before you even leave home.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-white text-red-700 hover:bg-gray-100">
                <Users className="mr-2 h-5 w-5" />
                Join Online Communities
              </Button>
              <Button className="bg-white text-red-700 hover:bg-gray-100">
                <Calendar className="mr-2 h-5 w-5" />
                View Upcoming Events
              </Button>
              <Button className="bg-white text-red-700 hover:bg-gray-100">
                <Building className="mr-2 h-5 w-5" />
                Find Canadian Businesses
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CanadianCommunitiesAbroad;