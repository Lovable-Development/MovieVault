import { useState, useEffect } from "react";
import { VaultItem, vaultStorage } from "@/lib/storage";
import { MovieCarousel } from "@/components/MovieCarousel";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import heroImage from "@/assets/movie-hero-bg.jpg";
import { useNavigate } from "react-router-dom";

interface HomePageProps {
  onPageChange: (page: "search" | "collections" | "vault") => void;
  refreshTrigger: number;
}

const HomePage = ({ onPageChange, refreshTrigger }: HomePageProps) => {
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [collections, setCollections] = useState(vaultStorage.getCollections());
  const navigate = useNavigate();

  // Load vault items
  useEffect(() => {
    setVaultItems(vaultStorage.getVaultItems());
    setCollections(vaultStorage.getCollections());
  }, [refreshTrigger]);

  const handleToggleWatched = (itemId: string) => {
    vaultStorage.toggleWatched(itemId);
    setVaultItems(vaultStorage.getVaultItems());
  };

  const handleRemoveFromVault = (itemId: string) => {
    vaultStorage.removeVaultItem(itemId);
    setVaultItems(vaultStorage.getVaultItems());
    setCollections(vaultStorage.getCollections());
  };

  // Separate watched and unwatched items
  const watchedItems = vaultItems.filter((item) => item.isWatched);
  const unwatchedItems = vaultItems.filter((item) => !item.isWatched);

  // Recent additions (last 10 items)
  const recentItems = vaultItems
    .sort(
      (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    )
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div
        className="relative h-[40vh] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-2xl px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
              Your Movie Vault
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90 animate-slide-up">
              Organize, track, and discover your favorite movies and TV series
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
              <Button
                size="lg"
                onClick={() => navigate("search")}
                className="bg-vault-red hover:bg-vault-red-hover text-white"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Movies & TV Shows
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("vault")}
                className="border-white text-white hover:bg-white hover:text-black"
              >
                Browse Vault
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        {vaultItems.length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🎬</div>
            <h2 className="text-2xl font-bold mb-4">Your vault is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start building your movie and TV show collection by searching and
              adding your favorites!
            </p>
            <Button
              size="lg"
              onClick={() => onPageChange("search")}
              className="bg-vault-red hover:bg-vault-red-hover"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Movie
            </Button>
          </div>
        ) : (
          <>
            {/* Recent Additions */}
            {recentItems.length > 0 && (
              <MovieCarousel
                title="Recently Added"
                items={recentItems}
                onToggleWatched={handleToggleWatched}
                onRemoveFromVault={handleRemoveFromVault}
                showRemoveButton={true}
                emptyMessage="No recent additions"
              />
            )}

            {/* Watched Section */}
            <MovieCarousel
              title="Watched"
              items={watchedItems}
              onToggleWatched={handleToggleWatched}
              onRemoveFromVault={handleRemoveFromVault}
              showRemoveButton={true}
              emptyMessage="No watched movies or shows yet. Mark some as watched to see them here!"
            />

            {/* Not Watched Section */}
            <MovieCarousel
              title="To Watch"
              items={unwatchedItems}
              onToggleWatched={handleToggleWatched}
              onRemoveFromVault={handleRemoveFromVault}
              showRemoveButton={true}
              emptyMessage="All caught up! Add more movies to your watchlist."
            />

            {/* Collections Preview */}
            {collections.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">
                    Your Collections
                  </h2>
                  <Button
                    variant="outline"
                    onClick={() => onPageChange("collections")}
                    className="border-vault-red text-vault-red hover:bg-vault-red hover:text-white"
                  >
                    View All Collections
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {collections.slice(0, 4).map((collection) => {
                    const collectionItems = vaultStorage.getCollectionItems(
                      collection.id
                    );
                    return (
                      <div
                        key={collection.id}
                        className="bg-card border border-border/50 rounded-lg p-4 hover:border-vault-red/50 transition-colors cursor-pointer"
                        onClick={() => onPageChange("collections")}
                      >
                        <h3 className="font-semibold mb-2 line-clamp-1">
                          {collection.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {collectionItems.length}{" "}
                          {collectionItems.length === 1 ? "item" : "items"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
