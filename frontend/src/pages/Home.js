import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { IdeaCard } from '../components/IdeaCard';
import { StatsCard } from '../components/StatsCard';
import { Users, FileText, ThumbsUp, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [featuredIdeas, setFeaturedIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, ideasRes] = await Promise.all([
        axios.get(`${API}/stats`),
        axios.get(`${API}/ideas?sort=top`)
      ]);
      setStats(statsRes.data);
      setFeaturedIdeas(ideasRes.data.slice(0, 6));
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (ideaId, action) => {
    try {
      await axios.post(`${API}/ideas/${ideaId}/vote`, { action });
      fetchData();
      toast.success('Vote enregistré');
    } catch (error) {
      console.error('Vote failed:', error);
      toast.error('Erreur lors du vote');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--primary))]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#EAF3FF] via-[#E6F6F2] to-[#FFF5E9] py-20 md:py-28">
        <div className="noise-overlay"></div>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-900 mb-6">
                Des idées qui ont du sens
              </h1>
              <p className="text-lg text-slate-700 leading-relaxed mb-8">
                Proposez des idées, débattez et votez les projets qui comptent. 
                Rejoignez une communauté engagée pour faire avancer les initiatives importantes.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => navigate(user ? '/ideas/new' : '/auth')} 
                  size="lg"
                  className="bg-[hsl(var(--primary))] text-white hover:brightness-110"
                  data-testid="hero-propose-button"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Proposer une idée
                </Button>
                <Button 
                  onClick={() => navigate('/ideas')} 
                  size="lg"
                  variant="outline"
                  data-testid="hero-browse-button"
                >
                  Parcourir les idées
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {stats && (
                <>
                  <StatsCard title="Participants" value={stats.participants} icon={Users} delay={0.3} />
                  <StatsCard title="Propositions" value={stats.proposals} icon={FileText} delay={0.4} />
                  <StatsCard title="Votes" value={stats.votes} icon={ThumbsUp} delay={0.5} />
                  <StatsCard title="Commentaires" value={stats.comments} icon={MessageSquare} delay={0.6} />
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Ideas */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-semibold mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                À la une
              </h2>
              <p className="text-slate-600">Les idées les plus soutenues par la communauté</p>
            </div>
            <Button 
              onClick={() => navigate('/ideas')} 
              variant="ghost"
              className="hidden md:flex"
            >
              Voir tout
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredIdeas.map((idea, idx) => (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
              >
                <IdeaCard idea={idea} onVote={handleVote} currentUser={user} />
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Button onClick={() => navigate('/ideas')} variant="outline">
              Voir toutes les idées
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-center mb-12" style={{ fontFamily: 'Space Grotesk' }}>
            Comment ça marche ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 rounded-full bg-[hsl(var(--primary))] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Proposez</h3>
              <p className="text-slate-600">Déposez vos idées avec des tags pour les organiser</p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="w-16 h-16 rounded-full bg-[hsl(var(--success))] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Débattez</h3>
              <p className="text-slate-600">Commentez et améliorez les propositions ensemble</p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-16 h-16 rounded-full bg-[hsl(var(--warning))] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Votez</h3>
              <p className="text-slate-600">Exprimez vos préférences et soutenez les projets</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;