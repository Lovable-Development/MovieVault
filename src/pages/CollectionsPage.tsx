import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { MovieCarousel } from '@/components/MovieCarousel';
import { vaultStorage, Collection, VaultItem } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

export function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setCollections(vaultStorage.getCollections());
    setVaultItems(vaultStorage.getVaultItems());
  };

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) {
      toast({
        title: "Error",
        description: "Collection name is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      vaultStorage.createCollection(newCollectionName, newCollectionDescription);
      setNewCollectionName('');
      setNewCollectionDescription('');
      setIsCreateDialogOpen(false);
      loadData();
      
      toast({
        title: "Success",
        description: `Collection "${newCollectionName}" created successfully!`,
      });
    } catch (error) {
      console.error('Error creating collection:', error);
      toast({
        title: "Error",
        description: "Failed to create collection. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCollection = (collection: Collection) => {
    try {
      vaultStorage.deleteCollection(collection.id);
      if (selectedCollection?.id === collection.id) {
        setSelectedCollection(null);
      }
      loadData();
      
      toast({
        title: "Deleted",
        description: `Collection "${collection.name}" has been deleted.`,
      });
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast({
        title: "Error",
        description: "Failed to delete collection. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleWatched = (itemId: string) => {
    vaultStorage.toggleWatched(itemId);
    loadData();
  };

  const handleRemoveFromCollection = (itemId: string, collectionId: string) => {
    try {
      vaultStorage.removeFromCollection(itemId, collectionId);
      loadData();
      
      toast({
        title: "Removed",
        description: "Item removed from collection.",
      });
    } catch (error) {
      console.error('Error removing from collection:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from collection.",
        variant: "destructive",
      });
    }
  };

  const getCollectionItems = (collection: Collection) => {
    return vaultStorage.getCollectionItems(collection.id);
  };

  if (selectedCollection) {
    const collectionItems = getCollectionItems(selectedCollection);
    const watchedItems = collectionItems.filter(item => item.isWatched);
    const unwatchedItems = collectionItems.filter(item => !item.isWatched);

    return (
      <div className="min-h-screen bg-background">
        {/* Collection Header */}
        <div className="bg-vault-dark border-b border-vault-gray">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-start justify-between">
              <div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedCollection(null)}
                  className="mb-4 text-vault-red hover:text-vault-red-hover hover:bg-vault-gray"
                >
                  ← Back to Collections
                </Button>
                <h1 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">
                  {selectedCollection.name}
                </h1>
                {selectedCollection.description && (
                  <p className="text-muted-foreground mb-4 max-w-2xl">
                    {selectedCollection.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{collectionItems.length} items</span>
                  <span>•</span>
                  <span>{watchedItems.length} watched</span>
                  <span>•</span>
                  <span>Created {new Date(selectedCollection.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Collection Content */}
        <div className="container mx-auto px-4 py-8 space-y-8">
          {collectionItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">📁</div>
              <h2 className="text-xl font-bold mb-4">This collection is empty</h2>
              <p className="text-muted-foreground mb-8">
                Add movies and TV shows to this collection from your vault or search page.
              </p>
            </div>
          ) : (
            <>
              {/* Watched Items */}
              {watchedItems.length > 0 && (
                <MovieCarousel
                  title="Watched"
                  items={watchedItems}
                  onToggleWatched={handleToggleWatched}
                  onAddToCollection={(itemId) => handleRemoveFromCollection(itemId, selectedCollection.id)}
                  showCollectionButton={true}
                  emptyMessage="No watched items in this collection"
                />
              )}

              {/* Unwatched Items */}
              {unwatchedItems.length > 0 && (
                <MovieCarousel
                  title="To Watch"
                  items={unwatchedItems}
                  onToggleWatched={handleToggleWatched}
                  onAddToCollection={(itemId) => handleRemoveFromCollection(itemId, selectedCollection.id)}
                  showCollectionButton={true}
                  emptyMessage="No unwatched items in this collection"
                />
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Collections Header */}
      <div className="bg-vault-dark border-b border-vault-gray">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">
                Your Collections
              </h1>
              <p className="text-muted-foreground">
                Organize your movies and TV shows into custom collections
              </p>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-vault-red hover:bg-vault-red-hover">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Collection
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-vault-dark border-vault-gray">
                <DialogHeader>
                  <DialogTitle>Create New Collection</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name *</label>
                    <Input
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      placeholder="e.g., Marvel Movies, Korean Dramas"
                      className="bg-vault-gray border-vault-gray-light"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description (optional)</label>
                    <Textarea
                      value={newCollectionDescription}
                      onChange={(e) => setNewCollectionDescription(e.target.value)}
                      placeholder="Describe what this collection is about..."
                      className="bg-vault-gray border-vault-gray-light"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCollection} className="bg-vault-red hover:bg-vault-red-hover">
                    Create Collection
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="container mx-auto px-4 py-8">
        {collections.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">📁</div>
            <h2 className="text-xl font-bold mb-4">No collections yet</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Create your first collection to organize your movies and TV shows by genre, mood, or any way you like!
            </p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-vault-red hover:bg-vault-red-hover"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Collection
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => {
              const itemCount = getCollectionItems(collection).length;
              
              return (
                <Card 
                  key={collection.id}
                  className="bg-card border-border/50 hover:border-vault-red/50 transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelectedCollection(collection)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-vault-red/20 rounded-lg flex items-center justify-center">
                          <Folder className="h-6 w-6 text-vault-red" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg group-hover:text-vault-red transition-colors">
                            {collection.name}
                          </h3>
                          <Badge variant="secondary" className="bg-vault-gray text-white">
                            {itemCount} {itemCount === 1 ? 'item' : 'items'}
                          </Badge>
                        </div>
                      </div>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-vault-dark border-vault-gray">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Collection</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{collection.name}"? This action cannot be undone.
                              The movies and TV shows will remain in your vault.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteCollection(collection)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    
                    {collection.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {collection.description}
                      </p>
                    )}
                    
                    <p className="text-xs text-muted-foreground">
                      Created {new Date(collection.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}