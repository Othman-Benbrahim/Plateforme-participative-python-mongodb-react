import { useState, useEffect } from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export function PollCard({ poll: initialPoll, onVote }) {
  const [poll, setPoll] = useState(initialPoll);
  const [selectedOption, setSelectedOption] = useState(null);
  const [voting, setVoting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setPoll(initialPoll);
    if (user && initialPoll.user_votes && initialPoll.user_votes[user.id]) {
      setSelectedOption(initialPoll.user_votes[user.id]);
    }
  }, [initialPoll, user]);

  const totalVotes = Object.values(poll.votes || {}).reduce((sum, count) => sum + count, 0);

  const handleVote = async (option) => {
    if (!user) {
      toast.error('Vous devez être connecté pour voter');
      return;
    }

    if (isEnded) {
      toast.error('Ce sondage est terminé');
      return;
    }

    setVoting(true);
    try {
      const response = await axios.post(`${API}/polls/${poll.id}/vote`, { option });
      setPoll({ ...poll, votes: response.data.votes, user_votes: { ...poll.user_votes, [user.id]: option } });
      setSelectedOption(option);
      toast.success('Vote enregistré!');
      if (onVote) onVote();
    } catch (error) {
      toast.error('Erreur lors du vote');
      console.error('Failed to vote:', error);
    } finally {
      setVoting(false);
    }
  };

  const isEnded = poll.ends_at && new Date(poll.ends_at) < new Date();
  const hasVoted = selectedOption !== null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{poll.title}</CardTitle>
            {poll.description && (
              <CardDescription className="mt-1">{poll.description}</CardDescription>
            )}
          </div>
          {isEnded && (
            <Badge variant="secondary">
              <Clock className="h-3 w-3 mr-1" />
              Terminé
            </Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          Par {poll.author_name} • {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {poll.options.map((option) => {
            const voteCount = poll.votes?.[option] || 0;
            const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
            const isSelected = selectedOption === option;

            return (
              <div key={option}>
                <Button
                  variant={isSelected ? 'default' : 'outline'}
                  className="w-full justify-start mb-2"
                  onClick={() => handleVote(option)}
                  disabled={voting || isEnded || hasVoted}
                >
                  {isSelected && <CheckCircle2 className="h-4 w-4 mr-2" />}
                  <span className="flex-1 text-left">{option}</span>
                  {hasVoted && (
                    <span className="text-sm font-semibold">
                      {voteCount} ({percentage.toFixed(0)}%)
                    </span>
                  )}
                </Button>
                {hasVoted && (
                  <Progress value={percentage} className="h-2" />
                )}
              </div>
            );
          })}
        </div>
        {poll.ends_at && !isEnded && (
          <div className="text-sm text-muted-foreground mt-4">
            Se termine le {new Date(poll.ends_at).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
