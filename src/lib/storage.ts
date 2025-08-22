import { TMDBMovie } from './tmdb';

export interface VaultItem {
  id: string;
  tmdbId: number;
  title: string;
  posterPath: string | null;
  mediaType: 'movie' | 'tv';
  overview: string;
  releaseDate?: string;
  voteAverage: number;
  isWatched: boolean;
  collections: string[];
  addedAt: Date;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  itemIds: string[];
}

class VaultStorage {
  private readonly VAULT_ITEMS_KEY = 'movie_vault_items';
  private readonly COLLECTIONS_KEY = 'movie_vault_collections';

  // Vault Items
  getVaultItems(): VaultItem[] {
    try {
      const items = localStorage.getItem(this.VAULT_ITEMS_KEY);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Error loading vault items:', error);
      return [];
    }
  }

  saveVaultItems(items: VaultItem[]): void {
    try {
      localStorage.setItem(this.VAULT_ITEMS_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving vault items:', error);
    }
  }

  addVaultItem(tmdbMovie: TMDBMovie): VaultItem {
    const items = this.getVaultItems();
    
    // Check if item already exists
    const existingItem = items.find(item => 
      item.tmdbId === tmdbMovie.id && item.mediaType === tmdbMovie.media_type
    );
    
    if (existingItem) {
      return existingItem;
    }

    const newItem: VaultItem = {
      id: `${tmdbMovie.media_type}_${tmdbMovie.id}_${Date.now()}`,
      tmdbId: tmdbMovie.id,
      title: tmdbMovie.title || tmdbMovie.name || 'Unknown Title',
      posterPath: tmdbMovie.poster_path,
      mediaType: tmdbMovie.media_type || 'movie',
      overview: tmdbMovie.overview,
      releaseDate: tmdbMovie.release_date || tmdbMovie.first_air_date,
      voteAverage: tmdbMovie.vote_average,
      isWatched: false,
      collections: [],
      addedAt: new Date(),
    };

    items.push(newItem);
    this.saveVaultItems(items);
    return newItem;
  }

  updateVaultItem(itemId: string, updates: Partial<VaultItem>): void {
    const items = this.getVaultItems();
    const index = items.findIndex(item => item.id === itemId);
    
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      this.saveVaultItems(items);
    }
  }

  removeVaultItem(itemId: string): void {
    const items = this.getVaultItems();
    const filteredItems = items.filter(item => item.id !== itemId);
    this.saveVaultItems(filteredItems);
    
    // Also remove from collections
    const collections = this.getCollections();
    collections.forEach(collection => {
      if (collection.itemIds.includes(itemId)) {
        collection.itemIds = collection.itemIds.filter(id => id !== itemId);
      }
    });
    this.saveCollections(collections);
  }

  toggleWatched(itemId: string): void {
    const items = this.getVaultItems();
    const item = items.find(item => item.id === itemId);
    
    if (item) {
      item.isWatched = !item.isWatched;
      this.saveVaultItems(items);
    }
  }

  // Collections
  getCollections(): Collection[] {
    try {
      const collections = localStorage.getItem(this.COLLECTIONS_KEY);
      return collections ? JSON.parse(collections) : [];
    } catch (error) {
      console.error('Error loading collections:', error);
      return [];
    }
  }

  saveCollections(collections: Collection[]): void {
    try {
      localStorage.setItem(this.COLLECTIONS_KEY, JSON.stringify(collections));
    } catch (error) {
      console.error('Error saving collections:', error);
    }
  }

  createCollection(name: string, description?: string): Collection {
    const collections = this.getCollections();
    
    const newCollection: Collection = {
      id: `collection_${Date.now()}`,
      name: name.trim(),
      description: description?.trim(),
      createdAt: new Date(),
      itemIds: [],
    };

    collections.push(newCollection);
    this.saveCollections(collections);
    return newCollection;
  }

  addToCollection(itemId: string, collectionId: string): void {
    const collections = this.getCollections();
    const collection = collections.find(c => c.id === collectionId);
    
    if (collection && !collection.itemIds.includes(itemId)) {
      collection.itemIds.push(itemId);
      this.saveCollections(collections);
    }

    // Update vault item collections array
    const items = this.getVaultItems();
    const item = items.find(i => i.id === itemId);
    if (item && !item.collections.includes(collectionId)) {
      item.collections.push(collectionId);
      this.saveVaultItems(items);
    }
  }

  removeFromCollection(itemId: string, collectionId: string): void {
    const collections = this.getCollections();
    const collection = collections.find(c => c.id === collectionId);
    
    if (collection) {
      collection.itemIds = collection.itemIds.filter(id => id !== itemId);
      this.saveCollections(collections);
    }

    // Update vault item collections array
    const items = this.getVaultItems();
    const item = items.find(i => i.id === itemId);
    if (item) {
      item.collections = item.collections.filter(id => id !== collectionId);
      this.saveVaultItems(items);
    }
  }

  deleteCollection(collectionId: string): void {
    const collections = this.getCollections();
    const filteredCollections = collections.filter(c => c.id !== collectionId);
    this.saveCollections(filteredCollections);

    // Remove collection from all vault items
    const items = this.getVaultItems();
    items.forEach(item => {
      item.collections = item.collections.filter(id => id !== collectionId);
    });
    this.saveVaultItems(items);
  }

  getCollectionItems(collectionId: string): VaultItem[] {
    const collection = this.getCollections().find(c => c.id === collectionId);
    if (!collection) return [];
    
    const allItems = this.getVaultItems();
    return collection.itemIds
      .map(id => allItems.find(item => item.id === id))
      .filter(item => item !== undefined) as VaultItem[];
  }
}

export const vaultStorage = new VaultStorage();