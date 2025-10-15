import { Share2, Facebook, Twitter, Linkedin, Link } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function SocialShare({ title, description, url }) {
  const shareUrl = url || window.location.href;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || '');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Lien copié dans le presse-papier!');
  };

  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'text-blue-600'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'text-sky-500'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'text-blue-700'
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Partager
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {socialPlatforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <DropdownMenuItem
              key={platform.name}
              onClick={() => window.open(platform.url, '_blank', 'width=600,height=400')}
            >
              <Icon className={`h-4 w-4 mr-2 ${platform.color}`} />
              {platform.name}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuItem onClick={handleCopyLink}>
          <Link className="h-4 w-4 mr-2" />
          Copier le lien
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
