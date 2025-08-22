import { useState } from 'react';
import { Eye, EyeOff, Plus, Star } from 'lucide-react';
import { VaultItem } from '@/lib/storage';
import { tmdbService } from '@/lib/tmdb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MovieCardProps {
  item: VaultItem;
  onToggleWatched: (itemId: string) => void;
  onAddToCollection?: (itemId: string) => void;
  showCollectionButton?: boolean;
}

export function MovieCard({ 
  item, 
  onToggleWatched, 
  onAddToCollection, 
  showCollectionButton = true 
}: MovieCardProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  const posterUrl = tmdbService.getPosterUrl(item.posterPath, 'w342');
  const releaseYear = item.releaseDate ? new Date(item.releaseDate).getFullYear() : 'N/A';
  
  const handleImageLoad = () => {
    setImageLoading(false);
  };
  
  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  return (
    <TooltipProvider>
      <div className="movie-card group relative bg-card rounded-lg overflow-hidden border border-border/50 hover:border-vault-red/50 transition-all duration-300">
        {/* Poster Image */}
        <div className="aspect-[2/3] relative overflow-hidden bg-vault-gray">
          {!imageError ? (
            <img
              src={posterUrl}
              alt={item.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-vault-gray">
              <div className="text-center text-muted-foreground">
                <div className="text-4xl mb-2">🎬</div>
                <div className="text-sm">No Poster</div>
              </div>
            </div>
          )}
          
          {/* Loading skeleton */}
          {imageLoading && !imageError && (
            <div className="absolute inset-0 bg-vault-gray animate-pulse" />
          )}
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-2">
              {/* Watch Toggle Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant={item.isWatched ? "secondary" : "default"}
                    onClick={() => onToggleWatched(item.id)}
                    className="bg-vault-dark/80 hover:bg-vault-dark border-vault-red/50"
                  >
                    {item.isWatched ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {item.isWatched ? 'Mark as Unwatched' : 'Mark as Watched'}
                </TooltipContent>
              </Tooltip>
              
              {/* Add to Collection Button */}
              {showCollectionButton && onAddToCollection && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onAddToCollection(item.id)}
                      className="bg-vault-dark/80 hover:bg-vault-dark border-vault-red/50"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Add to Collection
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
          
          {/* Watched Badge */}
          {item.isWatched && (
            <Badge 
              className="absolute top-2 right-2 bg-vault-red hover:bg-vault-red-hover text-white border-0"
            >
              Watched
            </Badge>
          )}
          
          {/* Media Type Badge */}
          <Badge 
            variant="secondary"
            className="absolute top-2 left-2 bg-vault-dark/80 text-white border-vault-red/50"
          >
            {item.mediaType === 'tv' ? 'TV' : 'Movie'}
          </Badge>
        </div>
        
        {/* Movie Info */}
        <div className="p-3 space-y-2">
          <div>
            <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
              {item.title}
            </h3>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-muted-foreground">
                {releaseYear}
              </span>
              {item.voteAverage > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-current text-yellow-500" />
                  {item.voteAverage.toFixed(1)}
                </div>
              )}
            </div>
          </div>
          
          {item.overview && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {item.overview}
            </p>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}