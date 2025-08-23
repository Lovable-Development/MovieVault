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
import { tmdbService } from '@/lib/tmdb';
import { useToast } from '@/hooks/use-toast';

export function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [editCollectionName, setEditCollectionName] = useState('');
  const [editCollectionDescription, setEditCollectionDescription] = useState('');
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

  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection);
    setEditCollectionName(collection.name);
    setEditCollectionDescription(collection.description || '');
    setIsEditDialogOpen(true);
  };

  const handleUpdateCollection = () => {
    if (!editingCollection || !editCollectionName.trim()) {
      toast({
        title: "Error",
        description: "Collection name is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const collections = vaultStorage.getCollections();
      const updatedCollections = collections.map(collection => 
        collection.id === editingCollection.id 
          ? { 
              ...collection, 
              name: editCollectionName.trim(), 
              description: editCollectionDescription.trim() || undefined 
            }
          : collection
      );
      
      vaultStorage.saveCollections(updatedCollections);
      
      // Update selectedCollection if we're currently viewing the edited collection
      if (selectedCollection && selectedCollection.id === editingCollection.id) {
        setSelectedCollection({
          ...selectedCollection,
          name: editCollectionName.trim(),
          description: editCollectionDescription.trim() || undefined
        });
      }
      
      setEditCollectionName('');
      setEditCollectionDescription('');
      setEditingCollection(null);
      setIsEditDialogOpen(false);
      loadData();
      
      toast({
        title: "Updated",
        description: `Collection "${editCollectionName}" updated successfully!`,
      });
    } catch (error) {
      console.error('Error updating collection:', error);
      toast({
        title: "Error",
        description: "Failed to update collection. Please try again.",
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
                  onRemoveFromCollection={(itemId) => handleRemoveFromCollection(itemId, selectedCollection.id)}
                  isInCollectionView={true}
                  showCollectionButton={false}
                  emptyMessage="No watched items in this collection"
                />
              )}

              {/* Unwatched Items */}
              {unwatchedItems.length > 0 && (
                <MovieCarousel
                  title="To Watch"
                  items={unwatchedItems}
                  onToggleWatched={handleToggleWatched}
                  onRemoveFromCollection={(itemId) => handleRemoveFromCollection(itemId, selectedCollection.id)}
                  isInCollectionView={true}
                  showCollectionButton={false}
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

            {/* Edit Collection Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="bg-vault-dark border-vault-gray">
                <DialogHeader>
                  <DialogTitle>Edit Collection</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name *</label>
                    <Input
                      value={editCollectionName}
                      onChange={(e) => setEditCollectionName(e.target.value)}
                      placeholder="Collection name"
                      className="bg-vault-gray border-vault-gray-light"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description (optional)</label>
                    <Textarea
                      value={editCollectionDescription}
                      onChange={(e) => setEditCollectionDescription(e.target.value)}
                      placeholder="Describe what this collection is about..."
                      className="bg-vault-gray border-vault-gray-light"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateCollection} className="bg-vault-red hover:bg-vault-red-hover">
                    Update Collection
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Collections Display */}
      <div className="container mx-auto px-4 py-8">
        {collections.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">📁</div>
            <h2 className="text-xl md:text-2xl font-bold mb-4">No collections yet</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm md:text-base px-4">
              Create your first collection to organize your movies and TV shows by genre, mood, or any way you like!
            </p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-vault-red hover:bg-vault-red-hover"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Create Your First Collection</span>
              <span className="sm:hidden">Create Collection</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground mb-6">Your Collections</h2>
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                {collections.map((collection) => {
                  const itemCount = getCollectionItems(collection).length;
                  const collectionItems = getCollectionItems(collection);
                  const firstFourItems = collectionItems.slice(0, 4);
                  
                  return (
                    <div key={collection.id} className="flex-shrink-0 w-72 sm:w-80 snap-start">
                      <Card 
                        className="bg-card border-border/50 hover:border-vault-red/50 transition-all duration-300 cursor-pointer group h-full"
                        onClick={() => setSelectedCollection(collection)}
                      >
                        <div className="p-4 sm:p-6">
                          {/* Collection Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-vault-red/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Folder className="h-5 w-5 sm:h-6 sm:w-6 text-vault-red" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-base sm:text-lg group-hover:text-vault-red transition-colors truncate">
                                  {collection.name}
                                </h3>
                                <Badge variant="secondary" className="bg-vault-gray text-white text-xs">
                                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditCollection(collection);
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-vault-red p-1 sm:p-2"
                              >
                                <Edit3 className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => e.stopPropagation()}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive p-1 sm:p-2"
                                  >
                                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-vault-dark border-vault-gray mx-4 max-w-md">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Collection</AlertDialogTitle>
                                    <AlertDialogDescription className="text-sm">
                                      Are you sure you want to delete "{collection.name}"? This action cannot be undone.
                                      The movies and TV shows will remain in your vault.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                    <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteCollection(collection)}
                                      className="bg-destructive hover:bg-destructive/90 w-full sm:w-auto"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                          
                          {/* Preview Grid */}
                          {firstFourItems.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 mb-4">
                              {firstFourItems.map((item, index) => (
                                <div key={item.id} className="aspect-[2/3] relative rounded overflow-hidden bg-vault-gray group-hover:scale-105 transition-transform duration-300">
                                  <img 
                                    src={tmdbService.getPosterUrl(item.posterPath, 'w342')} 
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                </div>
                              ))}
                              {/* Fill empty slots with placeholder */}
                              {Array.from({ length: Math.max(0, 4 - firstFourItems.length) }).map((_, index) => (
                                <div key={`empty-${index}`} className="aspect-[2/3] bg-vault-gray/30 rounded flex items-center justify-center">
                                  <Folder className="h-6 w-6 text-vault-gray" />
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {collection.description && (
                            <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
                              {collection.description}
                            </p>
                          )}
                          
                          <p className="text-xs text-muted-foreground">
                            Created {new Date(collection.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}