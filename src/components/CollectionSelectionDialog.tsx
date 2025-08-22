import { useState, useEffect } from 'react';
import { Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { vaultStorage, Collection, VaultItem } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface CollectionSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vaultItem: VaultItem | null;
}

export function CollectionSelectionDialog({
  isOpen,
  onClose,
  vaultItem
}: CollectionSelectionDialogProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setCollections(vaultStorage.getCollections());
    }
  }, [isOpen]);

  const handleAddToCollection = (collectionId: string) => {
    if (!vaultItem) return;

    try {
      vaultStorage.addToCollection(vaultItem.id, collectionId);
      toast({
        title: "Added to Collection",
        description: `"${vaultItem.title}" has been added to the collection.`,
      });
      setCollections(vaultStorage.getCollections());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to collection.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFromCollection = (collectionId: string) => {
    if (!vaultItem) return;

    try {
      vaultStorage.removeFromCollection(vaultItem.id, collectionId);
      toast({
        title: "Removed from Collection",
        description: `"${vaultItem.title}" has been removed from the collection.`,
      });
      setCollections(vaultStorage.getCollections());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from collection.",
        variant: "destructive",
      });
    }
  };

  const handleCreateAndAdd = () => {
    if (!vaultItem || !newCollectionName.trim()) return;

    try {
      const newCollection = vaultStorage.createCollection(newCollectionName.trim());
      vaultStorage.addToCollection(vaultItem.id, newCollection.id);
      
      toast({
        title: "Collection Created",
        description: `Collection "${newCollectionName}" created and item added.`,
      });
      
      setNewCollectionName('');
      setIsCreating(false);
      setCollections(vaultStorage.getCollections());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create collection.",
        variant: "destructive",
      });
    }
  };

  const isInCollection = (collectionId: string) => {
    return vaultItem?.collections.includes(collectionId) || false;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-vault-dark border-vault-gray max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Collection</DialogTitle>
          {vaultItem && (
            <p className="text-sm text-muted-foreground">
              Managing collections for "{vaultItem.title}"
            </p>
          )}
        </DialogHeader>

        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {/* Existing Collections */}
          {collections.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Your Collections</h4>
              {collections.map((collection) => (
                <div
                  key={collection.id}
                  className="flex items-center justify-between p-3 bg-vault-gray/30 rounded-lg border border-vault-gray"
                >
                  <div>
                    <div className="font-medium text-sm">{collection.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {vaultStorage.getCollectionItems(collection.id).length} items
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant={isInCollection(collection.id) ? "secondary" : "outline"}
                    onClick={() => {
                      if (isInCollection(collection.id)) {
                        handleRemoveFromCollection(collection.id);
                      } else {
                        handleAddToCollection(collection.id);
                      }
                    }}
                  >
                    {isInCollection(collection.id) ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Added
                      </>
                    ) : (
                      <>
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Create New Collection */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Create New Collection</h4>
            {isCreating ? (
              <div className="space-y-2">
                <Input
                  placeholder="Enter collection name..."
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  className="bg-vault-gray border-vault-gray-light"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleCreateAndAdd}
                    disabled={!newCollectionName.trim()}
                    className="bg-vault-red hover:bg-vault-red-hover"
                  >
                    Create & Add
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false);
                      setNewCollectionName('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCreating(true)}
                className="w-full border-vault-red text-vault-red hover:bg-vault-red hover:text-white"
              >
                <Plus className="h-3 w-3 mr-2" />
                Create New Collection
              </Button>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
