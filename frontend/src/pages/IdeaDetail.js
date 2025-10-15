import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { ArrowLeft, ArrowUp, ArrowDown, MessageSquare, User, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BadgeDisplay } from '../components/BadgeDisplay';
import { ReportButton } from '../components/ReportButton';
import { SocialShare } from '../components/SocialShare';
import { StatusBadge } from '../components/StatusBadge';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const IdeaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [idea, setIdea] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [ideaRes, commentsRes] = await Promise.all([
        axios.get(`${API}/ideas/${id}`),
        axios.get(`${API}/comments/${id}`)
      ]);
      setIdea(ideaRes.data);
      setComments(commentsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (action) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    try {
      const userVote = idea.user_votes?.[user.id];
      const voteAction = userVote === action ? 'remove' : action;
      await axios.post(`${API}/ideas/${id}/vote`, { action: voteAction });
      fetchData();
      toast.success('Vote enregistré');
    } catch (error) {
      console.error('Vote failed:', error);
      toast.error('Erreur lors du vote');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!commentText.trim()) return;

    try {
      await axios.post(`${API}/comments`, {
        idea_id: id,
        text: commentText
      });
      setCommentText('');
      fetchData();
      toast.success('Commentaire ajouté');
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast.error('Erreur lors de l\'ajout du commentaire');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--primary))]"></div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Idée non trouvée</h2>
          <Button onClick={() => navigate('/ideas')}>Retour aux idées</Button>
        </div>
      </div>
    );
  }

  const userVote = user ? idea.user_votes?.[user.id] : null;
  const netVotes = idea.votes_up - idea.votes_down;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button 
          onClick={() => navigate('/ideas')} 
          variant="ghost" 
          className="mb-6"
          data-testid="back-button"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux idées
        </Button>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main content */}
          <motion.div 
            className="lg:col-span-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {idea.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-800">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <h1 className="text-3xl md:text-4xl font-semibold mb-4" style={{ fontFamily: 'Space Grotesk' }}>
                  {idea.title}
                </h1>

                <div className="flex items-center gap-4 text-sm text-slate-600 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{idea.author_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(idea.created_at), 'd MMMM yyyy', { locale: fr })}</span>
                  </div>
                </div>

                <div className="prose max-w-none mb-8">
                  <p className="text-slate-700 text-base leading-relaxed whitespace-pre-wrap">{idea.description}</p>
                </div>

                {/* Vote buttons */}
                <div className="flex items-center gap-4 py-4 border-t border-slate-200">
                  <Button 
                    onClick={() => handleVote('up')}
                    className={`transition-colors ${
                      userVote === 'up' 
                        ? 'bg-[hsl(var(--vote-up))] text-white' 
                        : 'bg-slate-100 text-slate-700 hover:bg-[hsl(var(--vote-up))] hover:text-white'
                    }`}
                    data-testid="idea-detail-upvote-button"
                  >
                    <ArrowUp className="h-5 w-5 mr-2" />
                    Voter pour
                  </Button>
                  <span className="text-2xl font-bold min-w-[3rem] text-center">
                    {netVotes >= 0 ? '+' : ''}{netVotes}
                  </span>
                  <Button 
                    onClick={() => handleVote('down')}
                    className={`transition-colors ${
                      userVote === 'down' 
                        ? 'bg-[hsl(var(--vote-down))] text-white' 
                        : 'bg-slate-100 text-slate-700 hover:bg-[hsl(var(--vote-down))] hover:text-white'
                    }`}
                    data-testid="idea-detail-downvote-button"
                  >
                    <ArrowDown className="h-5 w-5 mr-2" />
                    Voter contre
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card className="mt-8">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <MessageSquare className="h-6 w-6" />
                  Commentaires ({comments.length})
                </h2>

                {/* Add comment form */}
                {user ? (
                  <form onSubmit={handleCommentSubmit} className="mb-8">
                    <Textarea 
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Partagez votre avis sur cette idée..."
                      className="mb-3"
                      rows={4}
                      data-testid="comment-textarea"
                    />
                    <Button 
                      type="submit" 
                      disabled={!commentText.trim()}
                      data-testid="idea-detail-comment-submit-button"
                    >
                      Publier le commentaire
                    </Button>
                  </form>
                ) : (
                  <div className="mb-8 p-4 bg-slate-100 rounded-lg text-center">
                    <p className="text-slate-700 mb-3">Connectez-vous pour commenter</p>
                    <Button onClick={() => navigate('/auth')} variant="outline">Se connecter</Button>
                  </div>
                )}

                {/* Comments list */}
                <div className="space-y-6">
                  {comments.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">Aucun commentaire pour le moment. Soyez le premier à réagir !</p>
                  ) : (
                    comments.map((comment) => (
                      <motion.div 
                        key={comment.id}
                        className="border-l-4 border-slate-200 pl-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        data-testid="comment-item"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-[hsl(var(--primary))] text-white flex items-center justify-center text-sm font-semibold">
                            {comment.user_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{comment.user_name}</p>
                            <p className="text-xs text-slate-500">
                              {format(new Date(comment.created_at), 'd MMMM yyyy à HH:mm', { locale: fr })}
                            </p>
                          </div>
                        </div>
                        <p className="text-slate-700">{comment.text}</p>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            className="lg:col-span-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Statistiques</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 flex items-center gap-2">
                      <ArrowUp className="h-4 w-4 text-[hsl(var(--vote-up))]" />
                      Votes pour
                    </span>
                    <span className="font-semibold">{idea.votes_up}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 flex items-center gap-2">
                      <ArrowDown className="h-4 w-4 text-[hsl(var(--vote-down))]" />
                      Votes contre
                    </span>
                    <span className="font-semibold">{idea.votes_down}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Commentaires
                    </span>
                    <span className="font-semibold">{comments.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default IdeaDetail;