import { useFonts } from "./ui/fonts";
import { Button } from "./ui/button";
import { type Region } from "@shared/schema";

type RegionFilterProps = {
  regions: Region[];
  selectedRegion: number | null;
  onRegionChange: (regionId: number | null) => void;
};

export default function RegionFilter({ regions, selectedRegion, onRegionChange }: RegionFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-10">
      <Button
        variant={selectedRegion === null ? "default" : "outline"}
        className={selectedRegion === null ? 
          "bg-primary text-white" : 
          "bg-white text-neutral-600 hover:bg-neutral-200"
        }
        onClick={() => onRegionChange(null)}
      >
        All Regions
      </Button>
      
      {regions.map((region) => (
        <Button
          key={region.id}
          variant={selectedRegion === region.id ? "default" : "outline"}
          className={selectedRegion === region.id ? 
            "bg-primary text-white" : 
            "bg-white text-neutral-600 hover:bg-neutral-200"
          }
          onClick={() => onRegionChange(region.id)}
        >
          {region.name}
        </Button>
      ))}
    </div>
  );
}
