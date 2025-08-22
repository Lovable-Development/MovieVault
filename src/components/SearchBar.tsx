import { useState, useEffect } from 'react';
import { Search, Plus, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { tmdbService, TMDBMovie } from '@/lib/tmdb';
import { vaultStorage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface SearchBarProps {
  onItemAdded?: () => void;
}

export function SearchBar({ onItemAdded }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TMDBMovie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await tmdbService.searchMulti(query);
        setResults(response.results.slice(0, 8)); // Limit to 8 results
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        toast({
          title: "Search Error",
          description: "Failed to search movies and TV shows. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, toast]);

  const handleAddToVault = (movie: TMDBMovie) => {
    try {
      const addedItem = vaultStorage.addVaultItem(movie);
      
      toast({
        title: "Added to Vault",
        description: `"${addedItem.title}" has been added to your vault!`,
      });

      // Clear search and results
      setQuery('');
      setResults([]);
      setShowResults(false);
      
      // Notify parent component
      onItemAdded?.();
    } catch (error) {
      console.error('Error adding to vault:', error);
      toast({
        title: "Error",
        description: "Failed to add item to vault. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative max-w-md mx-auto">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search movies and TV shows..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-4 bg-vault-dark border-vault-gray focus:border-vault-red"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 animate-spin" />
        )}
      </div>

      {/* Search Results */}
      {showResults && results.length > 0 && (
        <Card className="absolute top-full mt-2 w-full max-w-lg left-1/2 transform -translate-x-1/2 bg-vault-dark border-vault-gray shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            {results.map((movie) => {
              const title = movie.title || movie.name || 'Unknown Title';
              const year = movie.release_date || movie.first_air_date;
              const yearDisplay = year ? new Date(year).getFullYear() : 'N/A';
              const posterUrl = tmdbService.getPosterUrl(movie.poster_path, 'w185');
              
              return (
                <div
                  key={`${movie.media_type}_${movie.id}`}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-vault-gray transition-colors"
                >
                  {/* Poster */}
                  <div className="w-12 h-16 bg-vault-gray rounded overflow-hidden flex-shrink-0">
                    {movie.poster_path ? (
                      <img
                        src={posterUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                        🎬
                      </div>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-sm line-clamp-1">
                          {title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {yearDisplay}
                          </span>
                          <Badge 
                            variant="secondary" 
                            className="text-xs bg-vault-gray-light text-white"
                          >
                            {movie.media_type === 'tv' ? 'TV Series' : 'Movie'}
                          </Badge>
                        </div>
                        {movie.overview && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {movie.overview}
                          </p>
                        )}
                      </div>
                      
                      {/* Add Button */}
                      <Button
                        size="sm"
                        onClick={() => handleAddToVault(movie)}
                        className="flex-shrink-0 bg-vault-red hover:bg-vault-red-hover"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
      
      {/* No Results */}
      {showResults && results.length === 0 && !isSearching && query.trim() && (
        <Card className="absolute top-full mt-2 w-full bg-vault-dark border-vault-gray shadow-lg z-50">
          <div className="p-4 text-center text-muted-foreground">
            <div className="text-2xl mb-2">🔍</div>
            <p className="text-sm">No results found for "{query}"</p>
          </div>
        </Card>
      )}
    </div>
  );
}