import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Toaster } from './components/ui/sonner';
import Home from './pages/Home';
import IdeasList from './pages/IdeasList';
import IdeaDetail from './pages/IdeaDetail';
import NewIdea from './pages/NewIdea';
import Auth from './pages/Auth';
import Polls from './pages/Polls';
import AdminDashboard from './pages/AdminDashboard';
import ReportsModeration from './pages/ReportsModeration';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ideas" element={<IdeasList />} />
            <Route path="/ideas/new" element={<NewIdea />} />
            <Route path="/ideas/:id" element={<IdeaDetail />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/polls" element={<Polls />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/reports" element={<ReportsModeration />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;