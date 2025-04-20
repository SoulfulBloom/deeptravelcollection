import { useState } from "react";
import { Share2, Facebook, Twitter, Link, X } from "lucide-react";
import { Button } from "./ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonProps {
  destinationName: string;
  destinationId: number;
  className?: string;
}

export default function ShareButton({ destinationName, destinationId, className = "" }: ShareButtonProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const shareUrl = `${window.location.origin}/destinations/${destinationId}`;
  const shareText = `Check out this travel itinerary for ${destinationName} on Deep Travel Collections!`;

  const handleShare = (platform: string) => {
    let shareLink = "";

    switch (platform) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(shareUrl)
          .then(() => {
            toast({
              title: "Link copied",
              description: "Link has been copied to your clipboard.",
            });
          })
          .catch(() => {
            toast({
              title: "Copy failed",
              description: "Failed to copy link to clipboard. Please try again.",
              variant: "destructive",
            });
          });
        break;
    }

    if (shareLink) {
      window.open(shareLink, "_blank");
    }

    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={`rounded-full ${className}`}
          aria-label="Share this destination"
        >
          <Share2 className="h-5 w-5 text-neutral-600" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleShare("facebook")}>
          <Facebook className="mr-2 h-4 w-4 text-blue-600" />
          <span>Share on Facebook</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("twitter")}>
          <Twitter className="mr-2 h-4 w-4 text-blue-400" />
          <span>Share on Twitter</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("copy")}>
          <Link className="mr-2 h-4 w-4 text-neutral-600" />
          <span>Copy link</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}