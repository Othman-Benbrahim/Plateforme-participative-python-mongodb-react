import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ReportsModeration() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const { isModerator } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isModerator()) {
      navigate('/');
      return;
    }
    fetchReports();
  }, [activeTab]);

  const fetchReports = async () => {
    try {
      const status = activeTab === 'all' ? null : activeTab;
      const response = await axios.get(`${API}/reports`, {
        params: status ? { report_status: status } : {}
      });
      setReports(response.data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (reportId, resolution, action = null) => {
    try {
      await axios.put(`${API}/reports/${reportId}`, null, {
        params: { resolution, action }
      });
      toast.success('Signalement traité');
      fetchReports();
    } catch (error) {
      toast.error('Erreur lors du traitement');
      console.error('Failed to resolve report:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Modération des signalements</h1>
        <p className="text-muted-foreground">Examinez et gérez les contenus signalés</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="reviewed">Examinés</TabsTrigger>
          <TabsTrigger value="resolved">Résolus</TabsTrigger>
          <TabsTrigger value="all">Tous</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {reports.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Aucun signalement à afficher
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <Card key={report.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          Signalement de {report.content_type === 'idea' ? 'proposition' : 'commentaire'}
                        </CardTitle>
                        <CardDescription>
                          Par {report.reporter_name} • {new Date(report.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </CardDescription>
                      </div>
                      <Badge variant={
                        report.status === 'pending' ? 'destructive' :
                        report.status === 'reviewed' ? 'secondary' : 'default'
                      }>
                        {report.status === 'pending' ? 'En attente' :
                         report.status === 'reviewed' ? 'Examiné' : 'Résolu'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="font-medium text-sm mb-1">Raison:</div>
                      <div className="text-sm">{report.reason}</div>
                    </div>
                    {report.description && (
                      <div>
                        <div className="font-medium text-sm mb-1">Description:</div>
                        <div className="text-sm text-muted-foreground">{report.description}</div>
                      </div>
                    )}
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">
                        Contenu signalé (ID: {report.content_id})
                      </div>
                      <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => {
                          if (report.content_type === 'idea') {
                            navigate(`/ideas/${report.content_id}`);
                          }
                        }}
                      >
                        Voir le contenu
                      </Button>
                    </div>

                    {report.status === 'pending' && (
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          onClick={() => handleResolve(report.id, 'Aucune action requise')}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Ignorer
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleResolve(report.id, 'Contenu supprimé', 'delete_content')}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Supprimer le contenu
                        </Button>
                      </div>
                    )}

                    {report.resolution && (
                      <div className="border-t pt-4">
                        <div className="font-medium text-sm mb-1">Résolution:</div>
                        <div className="text-sm">{report.resolution}</div>
                        {report.reviewed_at && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Traité le {new Date(report.reviewed_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
