import { Search, Home, Grid3X3, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBar } from './SearchBar';

interface HeaderProps {
  currentPage: 'home' | 'search' | 'collections';
  onPageChange: (page: 'home' | 'search' | 'collections') => void;
  onItemAdded?: () => void;
}

export function Header({ currentPage, onPageChange, onItemAdded }: HeaderProps) {
  return (
    <header className="bg-vault-dark/95 backdrop-blur-sm border-b border-vault-gray sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-vault-red rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">MV</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">Movie Vault</h1>
          </div>

          {/* Search Bar (only on search page) */}
          {currentPage === 'search' && (
            <div className="flex-1 max-w-md mx-8">
              <SearchBar onItemAdded={onItemAdded} />
            </div>
          )}

          {/* Navigation */}
          <nav className="flex items-center space-x-2">
            <Button
              variant={currentPage === 'home' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onPageChange('home')}
              className={currentPage === 'home' ? 'bg-vault-red hover:bg-vault-red-hover' : ''}
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            
            <Button
              variant={currentPage === 'search' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onPageChange('search')}
              className={currentPage === 'search' ? 'bg-vault-red hover:bg-vault-red-hover' : ''}
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            
            <Button
              variant={currentPage === 'collections' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onPageChange('collections')}
              className={currentPage === 'collections' ? 'bg-vault-red hover:bg-vault-red-hover' : ''}
            >
              <Grid3X3 className="h-4 w-4 mr-2" />
              Collections
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}