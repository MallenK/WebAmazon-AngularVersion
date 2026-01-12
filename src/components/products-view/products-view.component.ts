
import { ChangeDetectionStrategy, Component, computed, inject, signal, effect } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

// Helper function to safely parse numeric values from strings (e.g., "4,5")
const parseNumeric = (value: string | null): number | null => {
  if (value === null || value === undefined) return null;
  try {
    const normalizedString = String(value).replace(',', '.');
    const number = parseFloat(normalizedString);
    return isNaN(number) ? null : number;
  } catch {
    return null;
  }
};

@Component({
  selector: 'app-products-view',
  standalone: true,
  imports: [ProductCardComponent, FormsModule, RouterLink],
  templateUrl: './products-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsViewComponent {
  private readonly productService = inject(ProductService);

  readonly allProducts = this.productService.getProducts();

  // Filter signals
  readonly searchTerm = signal('');
  readonly showPopular = signal(false);
  readonly minRating = signal<number>(0);
  
  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const popular = this.showPopular();
    const minR = this.minRating();

    return this.allProducts().filter(p => {
      const nameMatch = term 
        ? p.name.toLowerCase().includes(term) || (p.title && p.title.toLowerCase().includes(term))
        : true;
      const popularMatch = popular ? !!p.bought_last_month : true;
      const productRating = parseNumeric(p.rating_num);
      const ratingMatch = (() => {
        if (minR === 0) return true;
        if (productRating === null) return false;
        return productRating >= minR;
      })();
      return nameMatch && popularMatch && ratingMatch;
    });
  });

  // Pagination state
  readonly itemsPerPage = 50;
  readonly currentPage = signal(1);

  readonly totalPages = computed(() => {
    return Math.ceil(this.filteredProducts().length / this.itemsPerPage);
  });

  readonly paginatedProducts = computed(() => {
    const products = this.filteredProducts();
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return products.slice(start, end);
  });

  constructor() {
    console.log(
      "[UI] Paginación activa:",
      {
        itemsPerPage: 50,
        controls: "top-and-bottom"
      }
    );
    console.log(
      "[UI] ASIN y URL ocultos en tarjetas de producto:",
      true
    );
    // Log for products rendered in the view (with compliance check)
    effect(() => {
      const productsForView = this.paginatedProducts(); // Now logging paginated products
      console.log(
        "Productos renderizados en la vista:",
        productsForView.map(p => ({
          asin: p.asin, name: p.name, title: p.title, amazon_url: p.amazon_url,
          image_url: p.image_url, rating_num: p.rating_num, reviews_count: p.reviews_count
        })).slice(0, 2)
      );
      console.log("[COMPLIANCE] Vista libre de precios y métricas prohibidas:", true);
    });

    // Effect to reset to page 1 when filters change
    effect(() => {
      this.filteredProducts(); // Depend on filtered products
      this.currentPage.set(1);
    }, { allowSignalWrites: true });
  }
  
  resetFilters(): void {
    this.searchTerm.set('');
    this.showPopular.set(false);
    this.minRating.set(0);
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
        this.currentPage.update(page => page + 1);
        this.scrollToTop();
    }
  }

  previousPage(): void {
      if (this.currentPage() > 1) {
          this.currentPage.update(page => page - 1);
          this.scrollToTop();
      }
  }

  private scrollToTop(): void {
    // Scrolls to the top of the main content area for better UX on page change
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
