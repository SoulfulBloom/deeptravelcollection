import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  
  // Define a type for region data
  interface Region {
    id: number;
    name: string;
  }

  const { data: regions = [] } = useQuery<Region[]>({
    queryKey: ['/api/regions'],
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    let searchParams = new URLSearchParams();
    
    if (searchTerm) {
      searchParams.append("search", searchTerm);
    }
    
    if (selectedRegion && selectedRegion !== "all") {
      searchParams.append("region", selectedRegion);
    }
    
    const queryString = searchParams.toString();
    setLocation(`/destinations${queryString ? `?${queryString}` : ''}`);
  };
  
  return (
    <div id="search-bar" className="max-w-xl mx-auto bg-white p-3 sm:p-4 rounded-lg shadow-lg">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        <div className="flex-grow">
          <label htmlFor="destination" className="block text-xs sm:text-sm font-medium text-neutral-700">Where to?</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
              <Search className="text-neutral-400 h-3 w-3 sm:h-4 sm:w-4" />
            </div>
            <Input
              type="text"
              name="destination"
              id="destination"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:ring-primary focus:border-primary block w-full pl-8 sm:pl-10 text-xs sm:text-sm border-neutral-300 rounded-md h-8 sm:h-10"
              placeholder="City, country, or region"
            />
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <label htmlFor="region" className="block text-xs sm:text-sm font-medium text-neutral-700">Region</label>
          <Select
            value={selectedRegion}
            onValueChange={setSelectedRegion}
          >
            <SelectTrigger id="region" className="w-full h-8 sm:h-10 text-xs sm:text-sm">
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {Array.isArray(regions) && regions.map((region: Region) => (
                <SelectItem key={region.id} value={String(region.id)}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="sm:self-end">
          <Button type="submit" className="w-full h-8 sm:h-10 inline-flex justify-center items-center px-4 sm:px-6 py-0 text-xs sm:text-sm mt-auto">
            Search
          </Button>
        </div>
      </form>
    </div>
  );
}
