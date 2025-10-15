import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, X, Lightbulb, Shield, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { NotificationBell } from './NotificationBell';
import { BadgeDisplay } from './BadgeDisplay';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAdmin, isModerator } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Lightbulb className="h-6 w-6 text-[hsl(var(--primary))]" />
            <span className="text-xl font-semibold" style={{ fontFamily: 'Space Grotesk' }}>Idées Ensemble</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <Link to="/" className="text-slate-700 hover:text-slate-900 transition-colors">Accueil</Link>
            <Link to="/ideas" className="text-slate-700 hover:text-slate-900 transition-colors">Propositions</Link>
            <Link to="/polls" className="text-slate-700 hover:text-slate-900 transition-colors">Sondages</Link>
            
            {user ? (
              <>
                <Button 
                  onClick={() => navigate('/ideas/new')} 
                  data-testid="header-propose-idea-button"
                  className="bg-[hsl(var(--primary))] text-white hover:brightness-110"
                >
                  Proposer une idée
                </Button>
                <NotificationBell />
                {isModerator() && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/admin/reports')}
                    title="Modération"
                  >
                    <Shield className="h-5 w-5" />
                  </Button>
                )}
                {isAdmin() && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/admin')}
                    title="Administration"
                  >
                    <BarChart3 className="h-5 w-5" />
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="rounded-full h-10 w-10 p-0">
                      <div className="h-8 w-8 rounded-full bg-[hsl(var(--primary))] text-white flex items-center justify-center font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="px-2 py-1.5">
                      <div className="text-sm font-medium">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                      {user.role && user.role !== 'user' && (
                        <div className="text-xs text-blue-600 font-medium capitalize mt-1">
                          {user.role === 'admin' ? 'Administrateur' : 'Modérateur'}
                        </div>
                      )}
                      {user.badges && user.badges.length > 0 && (
                        <div className="mt-2">
                          <BadgeDisplay badges={user.badges} size="sm" />
                        </div>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>Se déconnecter</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => navigate('/auth')} variant="outline">Connexion</Button>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-slate-200">
            <Link to="/" className="block py-2 text-slate-700" onClick={() => setMobileMenuOpen(false)}>Accueil</Link>
            <Link to="/ideas" className="block py-2 text-slate-700" onClick={() => setMobileMenuOpen(false)}>Propositions</Link>
            <Link to="/polls" className="block py-2 text-slate-700" onClick={() => setMobileMenuOpen(false)}>Sondages</Link>
            {user ? (
              <>
                {isModerator() && (
                  <Link to="/admin/reports" className="block py-2 text-slate-700" onClick={() => setMobileMenuOpen(false)}>
                    <Shield className="h-4 w-4 inline mr-2" />
                    Modération
                  </Link>
                )}
                {isAdmin() && (
                  <Link to="/admin" className="block py-2 text-slate-700" onClick={() => setMobileMenuOpen(false)}>
                    <BarChart3 className="h-4 w-4 inline mr-2" />
                    Administration
                  </Link>
                )}
                <Button 
                  onClick={() => {
                    navigate('/ideas/new');
                    setMobileMenuOpen(false);
                  }} 
                  className="w-full bg-[hsl(var(--primary))] text-white"
                  data-testid="header-propose-idea-button-mobile"
                >
                  Proposer une idée
                </Button>
                <div className="pt-2 border-t border-slate-200">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                  {user.role && user.role !== 'user' && (
                    <div className="text-xs text-blue-600 font-medium capitalize mt-1">
                      {user.role === 'admin' ? 'Administrateur' : 'Modérateur'}
                    </div>
                  )}
                  {user.badges && user.badges.length > 0 && (
                    <div className="mt-2">
                      <BadgeDisplay badges={user.badges} size="sm" />
                    </div>
                  )}
                  <Button onClick={handleLogout} variant="ghost" className="w-full mt-2">Se déconnecter</Button>
                </div>
              </>
            ) : (
              <Button onClick={() => {
                navigate('/auth');
                setMobileMenuOpen(false);
              }} className="w-full" variant="outline">Connexion</Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};