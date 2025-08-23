import { useState, useEffect } from 'react';
import { Library, Filter, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MovieCarousel } from '@/components/MovieCarousel';
import { vaultStorage, VaultItem } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface VaultPageProps {
  refreshTrigger: number;
}

export function VaultPage({ refreshTrigger }: VaultPageProps) {
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'tv'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'watched' | 'unwatched'>('all');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setVaultItems(vaultStorage.getVaultItems());
  }, [refreshTrigger]);

  const handleToggleWatched = (itemId: string) => {
    vaultStorage.toggleWatched(itemId);
    setVaultItems(vaultStorage.getVaultItems());
  };

  const handleRemoveFromVault = (itemId: string) => {
    vaultStorage.removeVaultItem(itemId);
    setVaultItems(vaultStorage.getVaultItems());
    
    toast({
      title: "Removed",
      description: "Item removed from your vault.",
    });
  };

  // Filter items based on search and filters
  const filteredItems = vaultItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || item.mediaType === filterType;
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'watched' && item.isWatched) ||
      (filterStatus === 'unwatched' && !item.isWatched);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Separate filtered items by watched status
  const watchedItems = filteredItems.filter(item => item.isWatched);
  const unwatchedItems = filteredItems.filter(item => !item.isWatched);

  // Stats for the header
  const totalMovies = vaultItems.filter(item => item.mediaType === 'movie').length;
  const totalTvShows = vaultItems.filter(item => item.mediaType === 'tv').length;
  const totalWatched = vaultItems.filter(item => item.isWatched).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Vault Header */}
      <div className="bg-vault-dark border-b border-vault-gray">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6 text-vault-red hover:text-vault-red-hover hover:bg-vault-gray"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Library className="h-6 w-6 text-vault-red" />
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Your Vault
                </h1>
              </div>
              <p className="text-muted-foreground mb-4">
                Manage your entire movie and TV show collection
              </p>
              
              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <Badge variant="secondary" className="bg-vault-gray text-white">
                  {vaultItems.length} total items
                </Badge>
                <Badge variant="secondary" className="bg-vault-gray text-white">
                  {totalMovies} movies
                </Badge>
                <Badge variant="secondary" className="bg-vault-gray text-white">
                  {totalTvShows} TV shows
                </Badge>
                <Badge variant="secondary" className="bg-vault-red text-white">
                  {totalWatched} watched
                </Badge>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 min-w-0 lg:min-w-[400px]">
              <div className="flex-1">
                <Input
                  placeholder="Search your vault..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-vault-gray border-vault-gray-light"
                />
              </div>
              
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger className="w-full sm:w-[120px] bg-vault-gray border-vault-gray-light">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-vault-dark border-vault-gray">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="movie">Movies</SelectItem>
                  <SelectItem value="tv">TV Shows</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <SelectTrigger className="w-full sm:w-[130px] bg-vault-gray border-vault-gray-light">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-vault-dark border-vault-gray">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="watched">Watched</SelectItem>
                  <SelectItem value="unwatched">To Watch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Vault Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {vaultItems.length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🎬</div>
            <h2 className="text-2xl font-bold mb-4">Your vault is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start building your movie and TV show collection by searching and adding your favorites!
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          // No Results State
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🔍</div>
            <h2 className="text-xl font-bold mb-4">No results found</h2>
            <p className="text-muted-foreground">
              Try adjusting your search query or filters.
            </p>
          </div>
        ) : (
          <>
            {/* Results Summary */}
            {(searchQuery || filterType !== 'all' || filterStatus !== 'all') && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    Showing {filteredItems.length} of {vaultItems.length} items
                  </span>
                  
                  {(searchQuery || filterType !== 'all' || filterStatus !== 'all') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery('');
                        setFilterType('all');
                        setFilterStatus('all');
                      }}
                      className="border-vault-red text-vault-red hover:bg-vault-red hover:text-white"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Watched Items */}
            {watchedItems.length > 0 && (
              <MovieCarousel
                title={`Watched ${filterStatus !== 'watched' ? `(${watchedItems.length})` : ''}`}
                items={watchedItems}
                onToggleWatched={handleToggleWatched}
                onRemoveFromVault={handleRemoveFromVault}
                showRemoveButton={true}
                emptyMessage="No watched items match your filters"
              />
            )}

            {/* Unwatched Items */}
            {unwatchedItems.length > 0 && (
              <MovieCarousel
                title={`To Watch ${filterStatus !== 'unwatched' ? `(${unwatchedItems.length})` : ''}`}
                items={unwatchedItems}
                onToggleWatched={handleToggleWatched}
                onRemoveFromVault={handleRemoveFromVault}
                showRemoveButton={true}
                emptyMessage="No unwatched items match your filters"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}