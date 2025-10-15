import { useEffect, useState } from 'react';
import axios from 'axios';
import { IdeaCard } from '../components/IdeaCard';
import { FiltersBar } from '../components/FiltersBar';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const IdeasList = () => {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recent');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIdeas();
  }, [sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search) {
        fetchIdeas();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (sort) params.append('sort', sort);
      if (search) params.append('search', search);
      
      const response = await axios.get(`${API}/ideas?${params.toString()}`);
      setIdeas(response.data);
    } catch (error) {
      console.error('Failed to fetch ideas:', error);
      toast.error('Erreur lors du chargement des idées');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (ideaId, action) => {
    try {
      await axios.post(`${API}/ideas/${ideaId}/vote`, { action });
      fetchIdeas();
      toast.success('Vote enregistré');
    } catch (error) {
      console.error('Vote failed:', error);
      toast.error('Erreur lors du vote');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-4xl font-semibold mb-2" style={{ fontFamily: 'Space Grotesk' }}>Toutes les propositions</h1>
          <p className="text-slate-600 mb-8">Découvrez et soutenez les idées de la communauté</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-8"
        >
          <FiltersBar 
            search={search} 
            onSearch={setSearch} 
            sort={sort} 
            onSort={setSort} 
          />
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--primary))]"></div>
          </div>
        ) : ideas.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💡</div>
            <h3 className="text-xl font-semibold mb-2">Aucune idée trouvée</h3>
            <p className="text-slate-600">Essayez de modifier vos filtres ou soyez le premier à proposer une idée !</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea, idx) => (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <IdeaCard idea={idea} onVote={handleVote} currentUser={user} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeasList;