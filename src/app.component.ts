
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { ProductService } from './services/product.service';
import { Product } from './models/product.model';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { FormsModule } from '@angular/forms';
import { ChatAssistantComponent } from './components/chat-assistant/chat-assistant.component';

// Helper function to safely parse numeric values from strings (e.g., "99,99 €" or "4,5")
const parseNumeric = (value: string | null, isPrice: boolean = false): number | null => {
  if (value === null || value === undefined) return null;
  try {
    const cleanedString = isPrice ? String(value).replace(/€/g, '').trim() : String(value);
    const normalizedString = cleanedString.replace(',', '.');
    const number = parseFloat(normalizedString);
    return isNaN(number) ? null : number;
  } catch {
    return null;
  }
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProductCardComponent, ChatAssistantComponent, FormsModule],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly productService = inject(ProductService);

  readonly allProducts = this.productService.getProducts();
  readonly isChatVisible = signal(false);

  // Filter and Sort signals
  readonly searchTerm = signal('');
  readonly showPopular = signal(false);
  readonly maxPrice = signal<number | null>(null);
  readonly minRating = signal<number>(0);
  readonly priceSort = signal<'none' | 'asc' | 'desc'>('none');
  
  readonly maxProductPrice = computed(() => {
    return this.allProducts().reduce((max, p) => {
        const price = parseNumeric(p.price, true);
        return price !== null && price > max ? price : max;
    }, 0);
  });
  
  constructor() {
    effect(() => {
      // Initialize maxPrice slider when products are loaded for the first time
      if (this.maxPrice() === null && this.maxProductPrice() > 0) {
        this.maxPrice.set(this.maxProductPrice());
      }
    });
  }

  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const popular = this.showPopular();
    const maxP = this.maxPrice();
    const minR = this.minRating();
    const sort = this.priceSort();

    // 1. Filtering
    const filtered = this.allProducts().filter(p => {
      // Search term filter (checking both name and title)
      const nameMatch = term 
        ? p.name.toLowerCase().includes(term) || (p.title && p.title.toLowerCase().includes(term))
        : true;
      
      // Popularity filter
      const popularMatch = popular ? !!p.bought_last_month : true;

      // Price filter
      const productPrice = parseNumeric(p.price, true);
      const priceMatch = (() => {
        if (productPrice === null) return !maxP;
        return maxP !== null ? productPrice <= maxP : true;
      })();
      
      // Rating filter
      const productRating = parseNumeric(p.rating_num);
      const ratingMatch = (() => {
        if (minR === 0) return true; // "All ratings" option
        if (productRating === null) return false; // Hide products without rating if a filter is active
        return productRating >= minR;
      })();
      
      return nameMatch && popularMatch && priceMatch && ratingMatch;
    });

    // 2. Sorting
    if (sort === 'none') {
      return filtered;
    }

    return [...filtered].sort((a, b) => {
      const priceA = parseNumeric(a.price, true) ?? Infinity;
      const priceB = parseNumeric(b.price, true) ?? Infinity;
      return sort === 'asc' ? priceA - priceB : priceB - priceA;
    });
  });

  toggleChat(): void {
    this.isChatVisible.update(v => !v);
  }
  
  resetFilters(): void {
    this.searchTerm.set('');
    this.showPopular.set(false);
    this.maxPrice.set(this.maxProductPrice());
    this.minRating.set(0);
    this.priceSort.set('none');
  }
}