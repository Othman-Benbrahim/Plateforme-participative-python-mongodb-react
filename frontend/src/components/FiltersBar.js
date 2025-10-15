import { Input } from './components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from './components/ui/select';
import { Search } from 'lucide-react';

export const FiltersBar = ({ search, onSearch, sort, onSort }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:items-center bg-white p-4 rounded-lg shadow-sm">
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
  );
};