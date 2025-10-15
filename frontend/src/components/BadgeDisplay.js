import { Award, ThumbsUp, Lightbulb, Star, Users } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const badgeInfo = {
  contributor: {
    icon: Award,
    label: 'Contributeur',
    description: '10+ commentaires',
    color: 'text-blue-500'
  },
  active_voter: {
    icon: ThumbsUp,
    label: 'Votant Actif',
    description: '20+ votes',
    color: 'text-green-500'
  },
  idea_creator: {
    icon: Lightbulb,
    label: 'Créateur d\'Idées',
    description: '1+ idée créée',
    color: 'text-yellow-500'
  },
  top_contributor: {
    icon: Star,
    label: 'Top Contributeur',
    description: '10+ idées créées',
    color: 'text-purple-500'
  },
  community_leader: {
    icon: Users,
    label: 'Leader Communautaire',
    description: 'Membre actif et influent',
    color: 'text-orange-500'
  }
};

export function BadgeDisplay({ badges, size = 'md' }) {
  if (!badges || badges.length === 0) return null;

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        {badges.map((badgeKey) => {
          const badge = badgeInfo[badgeKey];
          if (!badge) return null;
          
          const Icon = badge.icon;
          
          return (
            <Tooltip key={badgeKey}>
              <TooltipTrigger>
                <Icon className={`${sizeClasses[size]} ${badge.color}`} />
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <div className="font-semibold">{badge.label}</div>
                  <div className="text-xs text-muted-foreground">{badge.description}</div>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
