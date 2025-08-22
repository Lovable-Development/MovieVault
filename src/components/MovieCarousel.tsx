import { VaultItem } from '@/lib/storage';
import { MovieCard } from './MovieCard';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface MovieCarouselProps {
  title: string;
  items: VaultItem[];
  onToggleWatched: (itemId: string) => void;
  onAddToCollection?: (itemId: string) => void;
  showCollectionButton?: boolean;
  emptyMessage?: string;
}

export function MovieCarousel({ 
  title, 
  items, 
  onToggleWatched, 
  onAddToCollection,
  showCollectionButton = true,
  emptyMessage = "No items to display"
}: MovieCarouselProps) {
  if (items.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <div className="bg-vault-gray/30 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">📽️</div>
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 pb-4">
          {items.map((item) => (
            <div key={item.id} className="w-[200px] flex-shrink-0">
              <MovieCard
                item={item}
                onToggleWatched={onToggleWatched}
                onAddToCollection={onAddToCollection}
                showCollectionButton={showCollectionButton}
              />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}