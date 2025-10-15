import { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from './ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from './ui/select';
import { Search } from 'lucide-react';
import { Badge } from './ui/badge';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const FiltersBar = ({ search, onSearch, sort, onSort, category, onCategory, status, onStatus }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            value={search} 
            onChange={(e) => onSearch(e.target.value)} 
            placeholder="Rechercher des idées..." 
            data-testid="ideas-filter-search-input" 
            className="pl-10 md:w-full" 
          />
        </div>
        <Select value={sort} onValueChange={onSort}>
          <SelectTrigger data-testid="ideas-sort-select" className="w-full md:w-56">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Récentes</SelectItem>
            <SelectItem value="top">Plus votées</SelectItem>
            <SelectItem value="active">Actives</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category and Status Filters */}
      {(onCategory || onStatus) && (
        <div className="flex flex-col md:flex-row gap-4">
          {onCategory && (
            <div className="flex-1">
              <Select value={category || ''} onValueChange={onCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les catégories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.icon && `${cat.icon} `}{cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {onStatus && (
            <div className="flex-1">
              <Select value={status || ''} onValueChange={onStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les statuts</SelectItem>
                  <SelectItem value="discussion">💬 Discussion</SelectItem>
                  <SelectItem value="approved">✅ Approuvée</SelectItem>
                  <SelectItem value="in_progress">🚀 En cours</SelectItem>
                  <SelectItem value="rejected">❌ Rejetée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      {/* Active filters */}
      {(category || status) && (
        <div className="flex flex-wrap gap-2">
          {category && (
            <Badge 
              variant="secondary" 
              className="cursor-pointer hover:bg-slate-200"
              onClick={() => onCategory && onCategory('')}
            >
              Catégorie: {categories.find(c => c.id === category)?.name} ×
            </Badge>
          )}
          {status && (
            <Badge 
              variant="secondary" 
              className="cursor-pointer hover:bg-slate-200"
              onClick={() => onStatus && onStatus('')}
            >
              Statut: {status} ×
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};