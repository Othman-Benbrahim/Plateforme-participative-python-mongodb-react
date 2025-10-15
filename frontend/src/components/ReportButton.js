import { useState } from 'react';
import { Flag } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export function ReportButton({ contentType, contentId, className }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) {
      toast.error('Veuillez sélectionner une raison');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/reports`, {
        content_type: contentType,
        content_id: contentId,
        reason,
        description
      });
      toast.success('Signalement envoyé avec succès');
      setOpen(false);
      setReason('');
      setDescription('');
    } catch (error) {
      toast.error('Erreur lors du signalement');
      console.error('Failed to report:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className={className}>
          <Flag className="h-4 w-4 mr-2" />
          Signaler
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Signaler ce contenu</DialogTitle>
          <DialogDescription>
            Aidez-nous à maintenir une communauté saine en signalant les contenus inappropriés.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Raison *</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Sélectionnez une raison" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spam">Spam ou publicité</SelectItem>
                <SelectItem value="inappropriate">Contenu inapproprié</SelectItem>
                <SelectItem value="harassment">Harcèlement</SelectItem>
                <SelectItem value="misinformation">Désinformation</SelectItem>
                <SelectItem value="offensive">Contenu offensant</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ajoutez des détails supplémentaires..."
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Envoi...' : 'Envoyer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
