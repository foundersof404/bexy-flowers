/**
 * Prompt History & Favorites System
 * 
 * Stores generation history and user favorites
 * for quick regeneration and reference.
 */

const HISTORY_KEY = 'bexy-prompt-history';
const FAVORITES_KEY = 'bexy-prompt-favorites';
const MAX_HISTORY_SIZE = 20;
const MAX_FAVORITES_SIZE = 10;

export interface PromptHistoryEntry {
  id: string;
  hash: string;
  prompt: string;
  preview: string; // Human-readable summary
  imageUrl?: string; // Thumbnail or full image
  createdAt: number;
  configuration: {
    packageType: 'box' | 'wrap';
    boxShape?: string;
    size: string;
    color: string;
    flowers: Array<{ id: string; name: string; quantity: number }>;
    withGlitter: boolean;
    withRibbon?: boolean;
    accessories: string[];
    stylePreset?: string;
    template?: string;
  };
}

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Get history from localStorage
export function getPromptHistory(): PromptHistoryEntry[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as PromptHistoryEntry[];
  } catch (error) {
    console.error('[PromptHistory] Error reading history:', error);
    return [];
  }
}

// Add entry to history
export function addToHistory(entry: Omit<PromptHistoryEntry, 'id' | 'createdAt'>): PromptHistoryEntry {
  const history = getPromptHistory();
  
  // Check if same hash already exists (avoid duplicates)
  const existingIndex = history.findIndex(h => h.hash === entry.hash);
  if (existingIndex !== -1) {
    // Update existing entry
    history[existingIndex] = {
      ...history[existingIndex],
      ...entry,
      createdAt: Date.now()
    };
    // Move to front
    const [updated] = history.splice(existingIndex, 1);
    history.unshift(updated);
  } else {
    // Add new entry
    const newEntry: PromptHistoryEntry = {
      ...entry,
      id: generateId(),
      createdAt: Date.now()
    };
    history.unshift(newEntry);
  }
  
  // Trim to max size
  while (history.length > MAX_HISTORY_SIZE) {
    history.pop();
  }
  
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('[PromptHistory] Error saving history:', error);
  }
  
  return history[0];
}

// Remove entry from history
export function removeFromHistory(id: string): void {
  const history = getPromptHistory();
  const filtered = history.filter(h => h.id !== id);
  
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('[PromptHistory] Error removing from history:', error);
  }
}

// Clear all history
export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('[PromptHistory] Error clearing history:', error);
  }
}

// Get favorites from localStorage
export function getFavorites(): PromptHistoryEntry[] {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as PromptHistoryEntry[];
  } catch (error) {
    console.error('[PromptHistory] Error reading favorites:', error);
    return [];
  }
}

// Add to favorites
export function addToFavorites(entry: PromptHistoryEntry): boolean {
  const favorites = getFavorites();
  
  // Check if already in favorites
  if (favorites.some(f => f.hash === entry.hash)) {
    return false; // Already exists
  }
  
  // Check max size
  if (favorites.length >= MAX_FAVORITES_SIZE) {
    return false; // Favorites full
  }
  
  favorites.unshift(entry);
  
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return true;
  } catch (error) {
    console.error('[PromptHistory] Error saving favorite:', error);
    return false;
  }
}

// Remove from favorites
export function removeFromFavorites(id: string): void {
  const favorites = getFavorites();
  const filtered = favorites.filter(f => f.id !== id);
  
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('[PromptHistory] Error removing favorite:', error);
  }
}

// Check if entry is favorited
export function isFavorite(hash: string): boolean {
  const favorites = getFavorites();
  return favorites.some(f => f.hash === hash);
}

// Toggle favorite status
export function toggleFavorite(entry: PromptHistoryEntry): boolean {
  if (isFavorite(entry.hash)) {
    removeFromFavorites(entry.id);
    return false;
  } else {
    return addToFavorites(entry);
  }
}

// Clear all favorites
export function clearFavorites(): void {
  try {
    localStorage.removeItem(FAVORITES_KEY);
  } catch (error) {
    console.error('[PromptHistory] Error clearing favorites:', error);
  }
}

// Search history by text
export function searchHistory(query: string): PromptHistoryEntry[] {
  const history = getPromptHistory();
  const lowerQuery = query.toLowerCase();
  
  return history.filter(entry => 
    entry.preview.toLowerCase().includes(lowerQuery) ||
    entry.prompt.toLowerCase().includes(lowerQuery) ||
    entry.configuration.flowers.some(f => f.name.toLowerCase().includes(lowerQuery))
  );
}

// Get recent unique configurations (for quick access)
export function getRecentConfigurations(limit: number = 5): PromptHistoryEntry[] {
  const history = getPromptHistory();
  const seen = new Set<string>();
  const unique: PromptHistoryEntry[] = [];
  
  for (const entry of history) {
    // Create a simplified key for uniqueness
    const key = `${entry.configuration.packageType}-${entry.configuration.size}-${entry.configuration.color}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(entry);
      if (unique.length >= limit) break;
    }
  }
  
  return unique;
}

export default {
  getPromptHistory,
  addToHistory,
  removeFromHistory,
  clearHistory,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  toggleFavorite,
  clearFavorites,
  searchHistory,
  getRecentConfigurations
};
