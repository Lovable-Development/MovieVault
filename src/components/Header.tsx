import { Search, Home, Grid3X3, Library, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBar } from './SearchBar';
import { useState } from 'react';

interface HeaderProps {
  currentPage: 'home' | 'search' | 'collections' | 'vault';
  onPageChange: (page: 'home' | 'search' | 'collections' | 'vault') => void;
  onItemAdded?: () => void;
}

export function Header({ currentPage, onPageChange, onItemAdded }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handlePageChange = (page: 'home' | 'search' | 'collections' | 'vault') => {
    onPageChange(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-vault-dark/95 backdrop-blur-sm border-b border-vault-gray sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-vault-red rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-base sm:text-lg">MV</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-foreground">Movie Vault</h1>
          </div>

          {/* Search Bar (only on desktop search page) */}
          {currentPage === 'search' && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <SearchBar onItemAdded={onItemAdded} />
            </div>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
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
            
            <Button
              variant={currentPage === 'vault' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onPageChange('vault')}
              className={currentPage === 'vault' ? 'bg-vault-red hover:bg-vault-red-hover' : ''}
            >
              <Library className="h-4 w-4 mr-2" />
              Vault
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Search Bar (on search page) */}
        {currentPage === 'search' && (
          <div className="md:hidden mt-3 px-1">
            <SearchBar onItemAdded={onItemAdded} />
          </div>
        )}

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full bg-vault-dark/98 backdrop-blur-sm border-b border-vault-gray shadow-lg">
            <nav className="container mx-auto px-3 py-4 space-y-2">
              <Button
                variant={currentPage === 'home' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handlePageChange('home')}
                className={`w-full justify-start ${currentPage === 'home' ? 'bg-vault-red hover:bg-vault-red-hover' : ''}`}
              >
                <Home className="h-4 w-4 mr-3" />
                Home
              </Button>
              
              <Button
                variant={currentPage === 'search' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handlePageChange('search')}
                className={`w-full justify-start ${currentPage === 'search' ? 'bg-vault-red hover:bg-vault-red-hover' : ''}`}
              >
                <Search className="h-4 w-4 mr-3" />
                Search
              </Button>
              
              <Button
                variant={currentPage === 'collections' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handlePageChange('collections')}
                className={`w-full justify-start ${currentPage === 'collections' ? 'bg-vault-red hover:bg-vault-red-hover' : ''}`}
              >
                <Grid3X3 className="h-4 w-4 mr-3" />
                Collections
              </Button>
              
              <Button
                variant={currentPage === 'vault' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handlePageChange('vault')}
                className={`w-full justify-start ${currentPage === 'vault' ? 'bg-vault-red hover:bg-vault-red-hover' : ''}`}
              >
                <Library className="h-4 w-4 mr-3" />
                Vault
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}