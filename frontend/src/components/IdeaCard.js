import { Card, CardHeader, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MessageSquare, ArrowUp, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const IdeaCard = ({ idea, onVote, currentUser }) => {
  const navigate = useNavigate();
  const userVote = currentUser ? idea.user_votes?.[currentUser.id] : null;
  const netVotes = idea.votes_up - idea.votes_down;

  const handleVote = (action) => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    const voteAction = userVote === action ? 'remove' : action;
    onVote(idea.id, voteAction);
  };

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1" 
      data-testid="idea-card"
      onClick={(e) => {
        if (!e.target.closest('button')) {
          navigate(`/ideas/${idea.id}`);
        }
      }}
    >
      <CardHeader className="pb-2">
        <h3 className="font-semibold text-slate-900 text-lg" data-testid="idea-card-title">{idea.title}</h3>
        <div className="flex flex-wrap gap-2 mt-2" data-testid="idea-card-tags">
          {idea.tags.map((t, idx) => (
            <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">{t}</Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-slate-700 text-sm line-clamp-3 leading-relaxed">{idea.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              className={`transition-colors ${
                userVote === 'up' 
                  ? 'bg-[hsl(var(--vote-up))] text-white' 
                  : 'bg-slate-100 text-slate-700 hover:bg-[hsl(var(--vote-up))] hover:text-white'
              }`}
              aria-label="Upvote" 
              data-testid="idea-card-upvote-button" 
              onClick={(e) => {
                e.stopPropagation();
                handleVote('up');
              }}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <span className="text-base font-semibold min-w-[2rem] text-center" data-testid="idea-card-vote-count">
              {netVotes >= 0 ? '+' : ''}{netVotes}
            </span>
            <Button 
              size="sm" 
              className={`transition-colors ${
                userVote === 'down' 
                  ? 'bg-[hsl(var(--vote-down))] text-white' 
                  : 'bg-slate-100 text-slate-700 hover:bg-[hsl(var(--vote-down))] hover:text-white'
              }`}
              aria-label="Downvote" 
              data-testid="idea-card-downvote-button" 
              onClick={(e) => {
                e.stopPropagation();
                handleVote('down');
              }}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-slate-500 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span data-testid="idea-card-comment-count" className="text-sm">{idea.comments_count}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};