import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  // Register state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      await login(loginEmail, loginPassword);
      toast.success('Connexion réussie !');
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error.response?.data?.detail || 'Email ou mot de passe incorrect');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    setRegisterLoading(true);
    try {
      await register(registerName, registerEmail, registerPassword);
      toast.success('Compte créé avec succès !');
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(error.response?.data?.detail || 'Erreur lors de l\'inscription');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAF3FF] via-[#E6F6F2] to-[#FFF5E9] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center">
              <Lightbulb className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: 'Space Grotesk' }}>
            Idées Ensemble
          </h1>
          <p className="text-slate-600">Rejoignez la communauté</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bienvenue</CardTitle>
            <CardDescription>
              Connectez-vous ou créez un compte pour commencer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" data-testid="login-tab">Connexion</TabsTrigger>
                <TabsTrigger value="register" data-testid="register-tab">Inscription</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="votre@email.com"
                      required
                      className="mt-2"
                      data-testid="login-email-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="mt-2"
                      data-testid="login-password-input"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full bg-[hsl(var(--primary))] text-white hover:brightness-110"
                    data-testid="login-submit-button"
                  >
                    {loginLoading ? 'Connexion...' : 'Se connecter'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="register-name">Nom complet</Label>
                    <Input
                      id="register-name"
                      type="text"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      placeholder="Jean Dupont"
                      required
                      className="mt-2"
                      data-testid="register-name-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder="votre@email.com"
                      required
                      className="mt-2"
                      data-testid="register-email-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-password">Mot de passe</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="mt-2"
                      data-testid="register-password-input"
                    />
                    <p className="text-xs text-slate-500 mt-1">Minimum 6 caractères</p>
                  </div>
                  <Button
                    type="submit"
                    disabled={registerLoading}
                    className="w-full bg-[hsl(var(--primary))] text-white hover:brightness-110"
                    data-testid="register-submit-button"
                  >
                    {registerLoading ? 'Création...' : 'Créer un compte'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;