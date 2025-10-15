import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { X, Sparkles, Upload, FileText, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const COMMON_TAGS = [
  'Environnement',
  'Éducation',
  'Santé',
  'Transport',
  'Culture',
  'Social',
  'Technologie',
  'Économie',
  'Urbanisme',
  'Loisirs'
];

const NewIdea = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [customTag, setCustomTag] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleTagToggle = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && !tags.includes(customTag.trim())) {
      setTags([...tags, customTag.trim()]);
      setCustomTag('');
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Check file types and sizes
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name}: Type de fichier non supporté. Utilisez PNG, JPG ou PDF.`);
        continue;
      }
      if (file.size > maxSize) {
        toast.error(`${file.name}: Fichier trop volumineux (max 10MB)`);
        continue;
      }

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);

        const token = localStorage.getItem('token');
        const response = await axios.post(`${API}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });

        setAttachments([...attachments, response.data]);
        toast.success(`${file.name} téléchargé avec succès`);
      } catch (error) {
        console.error('Upload failed:', error);
        toast.error(`Erreur lors du téléchargement de ${file.name}`);
      } finally {
        setUploading(false);
      }
    }
  };

  const removeAttachment = (attachmentId) => {
    setAttachments(attachments.filter(a => a.id !== attachmentId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (title.trim().length < 6) {
      toast.error('Le titre doit contenir au moins 6 caractères');
      return;
    }
    
    if (description.trim().length < 40) {
      toast.error('La description doit contenir au moins 40 caractères');
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(`${API}/ideas`, {
        title: title.trim(),
        description: description.trim(),
        tags
      });
      toast.success('Idée publiée avec succès !');
      navigate(`/ideas/${response.data.id}`);
    } catch (error) {
      console.error('Failed to create idea:', error);
      toast.error('Erreur lors de la publication de l\'idée');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-semibold mb-2 flex items-center gap-2" style={{ fontFamily: 'Space Grotesk' }}>
            <Sparkles className="h-8 w-8 text-[hsl(var(--primary))]" />
            Proposer une nouvelle idée
          </h1>
          <p className="text-slate-600">Partagez votre idée avec la communauté</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Détails de votre idée</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Un titre accrocheur pour votre idée"
                    className="mt-2"
                    data-testid="new-idea-title-input"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">Minimum 6 caractères</p>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Décrivez votre idée en détail. Pourquoi est-elle importante ? Comment pourrait-elle être mise en œuvre ?"
                    className="mt-2"
                    rows={8}
                    data-testid="new-idea-description-textarea"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">Minimum 40 caractères ({description.length}/40)</p>
                </div>

                {/* Tags */}
                <div>
                  <Label>Tags</Label>
                  <p className="text-sm text-slate-600 mb-3">Sélectionnez des tags pour catégoriser votre idée</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {COMMON_TAGS.map((tag) => (
                      <Badge
                        key={tag}
                        variant={tags.includes(tag) ? 'default' : 'outline'}
                        className={`cursor-pointer transition-colors ${
                          tags.includes(tag)
                            ? 'bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary))]/90'
                            : 'hover:bg-slate-100'
                        }`}
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Custom tag */}
                  <div className="flex gap-2">
                    <Input
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      placeholder="Ajouter un tag personnalisé"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomTag();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddCustomTag} variant="outline">
                      Ajouter
                    </Button>
                  </div>

                  {/* Selected tags */}
                  {tags.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-slate-600 mb-2">Tags sélectionnés :</p>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Badge key={tag} className="bg-blue-100 text-blue-800 pr-1">
                            {tag}
                            <button
                              type="button"
                              onClick={() => setTags(tags.filter(t => t !== tag))}
                              className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-[hsl(var(--primary))] text-white hover:brightness-110"
                    data-testid="new-idea-submit-button"
                  >
                    {submitting ? 'Publication...' : 'Publier l\'idée'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/ideas')}
                    disabled={submitting}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default NewIdea;