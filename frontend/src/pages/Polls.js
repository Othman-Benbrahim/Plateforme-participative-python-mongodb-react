import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import { Plus, Vote } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { PollCard } from '@/components/PollCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Polls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    options: ['', '']
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await axios.get(`${API}/polls`);
      setPolls(response.data);
    } catch (error) {
      console.error('Failed to fetch polls:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    
    // Validate
    if (!formData.title.trim()) {
      toast.error('Le titre est requis');
      return;
    }
    
    const validOptions = formData.options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      toast.error('Au moins 2 options sont requises');
      return;
    }

    try {
      await axios.post(`${API}/polls`, {
        ...formData,
        options: validOptions
      });
      toast.success('Sondage créé avec succès!');
      setCreateOpen(false);
      setFormData({ title: '', description: '', options: ['', ''] });
      fetchPolls();
    } catch (error) {
      toast.error('Erreur lors de la création du sondage');
      console.error('Failed to create poll:', error);
    }
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, '']
    });
  };

  const removeOption = (index) => {
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      options: newOptions
    });
  };

  const updateOption = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({
      ...formData,
      options: newOptions
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Sondages</h1>
          <p className="text-muted-foreground">Participez aux sondages de la communauté</p>
        </div>
        {user && (
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Créer un sondage
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer un nouveau sondage</DialogTitle>
                <DialogDescription>
                  Posez une question à la communauté
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreatePoll} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre du sondage *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Quel projet devrait être prioritaire?"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optionnel)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Ajoutez des détails sur votre sondage..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Options (minimum 2)</Label>
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                      />
                      {formData.options.length > 2 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removeOption(index)}
                        >
                          Supprimer
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addOption}
                    className="w-full"
                  >
                    Ajouter une option
                  </Button>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    Créer le sondage
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {polls.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <Vote className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucun sondage disponible</h3>
          <p className="text-muted-foreground mb-4">
            Soyez le premier à créer un sondage!
          </p>
          {user && (
            <Button onClick={() => setCreateOpen(true)}>
              Créer un sondage
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {polls.map((poll) => (
            <PollCard key={poll.id} poll={poll} onVote={fetchPolls} />
          ))}
        </div>
      )}
    </div>
  );
}
