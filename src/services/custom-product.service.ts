
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../models/product.model';
import { catchError, tap, of } from 'rxjs';

// Represents the data structure from the new 'products_manual' table
interface ManualProductResponse {
  id: string;
  url: string;
  created_at: string;
  is_active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CustomProductService {
  private readonly http = inject(HttpClient);
  private readonly manualProducts = signal<Product[]>([]);
  private readonly storageKey = 'products_manual_fallback';
  
  // NOTE: This is a hypothetical endpoint for the new 'products_manual' table.
  private readonly supabaseUrl = 'https://keewdanzvhxplokkgnhq.supabase.co/functions/v1/products-manual';
  private readonly anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlZXdkYW56dmh4cGxva2tnbmhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4NjQyNDUsImV4cCI6MjA4MzQ0MDI0NX0.Nx5qVmCilV0rVSm8sVS5_MfmT6tPdLY26jE6EPXIi94';
  private readonly headers = new HttpHeaders({ 'Authorization': `Bearer ${this.anonKey}` });
  private readonly affiliateTag = 'cafeteras_mallen-21';

  constructor() {
    this.loadManualProducts();
  }

  getManualProducts() {
    return this.manualProducts.asReadonly();
  }

  loadManualProducts(): void {
    const stored = localStorage.getItem(this.storageKey);
    const products: ManualProductResponse[] = stored ? JSON.parse(stored) : [];
    const activeProducts = products.filter(p => p.is_active !== false); // Treat undefined as true for backward compatibility
    this.manualProducts.set(activeProducts.map((p) => this.transformToProduct(p)));
  }

  addProduct(url: string): void {
    const asin = this.extractAsinFromUrl(url);
    if (!asin) {
      console.error('Could not extract ASIN from URL:', url);
      return;
    }
    
    const finalUrl = this.ensureAffiliateTag(url);

    const pseudoResponse: ManualProductResponse = {
        id: `manual-${asin}-${Date.now()}`,
        url: finalUrl,
        created_at: new Date().toISOString(),
        is_active: true
    };
    
    // This POST call is simulated. In a real scenario, it would save to the DB.
    const add$ = of(pseudoResponse).pipe(tap(() => {
        const stored = localStorage.getItem(this.storageKey);
        const products = stored ? JSON.parse(stored) : [];
        products.push(pseudoResponse);
        localStorage.setItem(this.storageKey, JSON.stringify(products));
    }));

    add$.pipe(
      tap(() => this.loadManualProducts()),
      catchError(err => {
        console.error('Error adding manual product', err);
        return of(null);
      })
    ).subscribe();
  }

  deleteProduct(productId: string): void {
    // This PATCH call is simulated. It would set is_active = false in the DB.
    const delete$ = of(null).pipe(tap(() => {
        const stored = localStorage.getItem(this.storageKey);
        let products: ManualProductResponse[] = stored ? JSON.parse(stored) : [];
        products = products.map(p => {
          if (p.id === productId) {
            return { ...p, is_active: false };
          }
          return p;
        });
        localStorage.setItem(this.storageKey, JSON.stringify(products));
    }));

    delete$.pipe(
      tap(() => this.loadManualProducts()),
      catchError(err => {
        console.error('Error deleting manual product', err);
        return of(null);
      })
    ).subscribe();
  }

  private ensureAffiliateTag(url: string): string {
    try {
      const urlObj = new URL(url);
      if (urlObj.searchParams.get('tag') !== this.affiliateTag) {
        urlObj.searchParams.set('tag', this.affiliateTag);
      }
      return urlObj.toString();
    } catch (e) {
      console.error("Invalid URL provided:", url);
      return url; // Return original url if parsing fails
    }
  }

  private transformToProduct(response: ManualProductResponse): Product {
    const asin = this.extractAsinFromUrl(response.url);
    return {
      id: response.id,
      name: `Producto Manual (${asin || 'N/A'})`,
      title: `Producto añadido manualmente`,
      asin: asin,
      image_url: null, // Manual products have no image scraping
      amazon_url: response.url,
      price: null,
      old_price: null,
      rating_num: null,
      rating_text: null,
      reviews_count: null,
      bought_last_month: null,
      is_sponsored: true, // Mark as special
      is_active: response.is_active,
    };
  }

  private extractAsinFromUrl(url: string): string | null {
    const asinRegex = /\/(?:dp|gp\/product)\/([A-Z0-9]{10})/;
    const match = url.match(asinRegex);
    return match ? match[1] : null;
  }
}