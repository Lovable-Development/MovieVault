import { useState, useEffect } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { MovieCarousel } from '@/components/MovieCarousel';
import { vaultStorage, VaultItem } from '@/lib/storage';
import { tmdbService, TMDBMovie } from '@/lib/tmdb';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingUp, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchPageProps {
  onItemAdded: () => void;
}

export function SearchPage({ onItemAdded }: SearchPageProps) {
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [trending, setTrending] = useState<TMDBMovie[]>([]);
  const [isLoadingTrending, setIsLoadingTrending] = useState(true);
  const navigate = useNavigate();

  // Load vault items and trending content
  useEffect(() => {
    setVaultItems(vaultStorage.getVaultItems());
    loadTrendingContent();
  }, []);

  const loadTrendingContent = async () => {
    try {
      setIsLoadingTrending(true);
      const trendingContent = await tmdbService.getTrending('all', 'week');
      setTrending(trendingContent.slice(0, 10));
    } catch (error) {
      console.error('Error loading trending content:', error);
    } finally {
      setIsLoadingTrending(false);
    }
  };

  const handleItemAdded = () => {
    setVaultItems(vaultStorage.getVaultItems());
    onItemAdded();
  };

  const handleToggleWatched = (itemId: string) => {
    vaultStorage.toggleWatched(itemId);
    setVaultItems(vaultStorage.getVaultItems());
  };

  const handleRemoveFromVault = (itemId: string) => {
    vaultStorage.removeVaultItem(itemId);
    setVaultItems(vaultStorage.getVaultItems());
    onItemAdded(); // Refresh parent
  };

  // Recent additions (last 5 items)
  const recentItems = vaultItems
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      {/* Search Hero Section */}
      <div className="bg-gradient-to-b from-vault-dark to-background py-16">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6 text-vault-red hover:text-vault-red-hover hover:bg-vault-gray"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Discover Movies & TV Shows
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Search through millions of movies and TV series from The Movie Database (TMDB) and add them to your vault
            </p>
            
            <div className="max-w-lg mx-auto">
              <SearchBar onItemAdded={handleItemAdded} />
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Trending This Week */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-vault-red" />
            <h2 className="text-xl font-bold text-foreground">Trending This Week</h2>
          </div>
          
          {isLoadingTrending ? (
            <Card className="bg-vault-gray/30 p-8">
              <div className="flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-vault-red mr-2" />
                <span className="text-muted-foreground">Loading trending content...</span>
              </div>
            </Card>
          ) : trending.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {trending.map((item) => {
                const title = item.title || item.name || 'Unknown Title';
                const year = item.release_date || item.first_air_date;
                const yearDisplay = year ? new Date(year).getFullYear() : 'N/A';
                const posterUrl = tmdbService.getPosterUrl(item.poster_path, 'w342');
                
                return (
                  <Card 
                    key={`${item.media_type}_${item.id}`}
                    className="bg-card hover:bg-vault-gray/50 transition-colors cursor-pointer border-border/50 hover:border-vault-red/50"
                  >
                    <div className="aspect-[2/3] relative overflow-hidden rounded-t-lg bg-vault-gray">
                      {item.poster_path ? (
                        <img
                          src={posterUrl}
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <div className="text-center">
                            <div className="text-2xl mb-1">🎬</div>
                            <div className="text-xs">No Poster</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm line-clamp-2 leading-tight mb-1">
                        {title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {yearDisplay} • {item.media_type === 'tv' ? 'TV Series' : 'Movie'}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="bg-vault-gray/30 p-8 text-center">
              <p className="text-muted-foreground">Unable to load trending content at the moment.</p>
            </Card>
          )}
        </div>

        {/* Recently Added to Vault */}
        {recentItems.length > 0 && (
          <MovieCarousel
            title="Recently Added to Your Vault"
            items={recentItems}
            onToggleWatched={handleToggleWatched}
            onRemoveFromVault={handleRemoveFromVault}
            showRemoveButton={true}
            emptyMessage="No items in your vault yet"
          />
        )}

        {/* Search Tips */}
        <Card className="bg-vault-gray/20 border-vault-red/20 p-6">
          <h3 className="text-lg font-semibold mb-3 text-foreground">Search Tips</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Search by movie or TV show title</li>
            <li>• Try searching for actors, directors, or keywords</li>
            <li>• Results include both movies and TV series</li>
            <li>• Click the + button to add items directly to your vault</li>
            <li>• Use specific titles for better results (e.g., "The Dark Knight" instead of "Batman")</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}