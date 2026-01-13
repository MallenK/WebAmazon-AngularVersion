
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ManualProduct } from '../models/manual-product.model';
import { catchError, tap, of, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomProductService {
  private readonly http = inject(HttpClient);
  private readonly manualProducts = signal<ManualProduct[]>([]);
  
  private readonly supabaseRestUrl = 'https://keewdanzvhxplokkgnhq.supabase.co/rest/v1/products_manual';
  private readonly anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlZXdkYW56dmh4cGxva2tnbmhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4NjQyNDUsImV4cCI6MjA4MzQ0MDI0NX0.Nx5qVmCilV0rVSm8sVS5_MfmT6tPdLY26jE6EPXIi94';
  
  private readonly headers = new HttpHeaders({ 
    'apikey': this.anonKey,
    'Authorization': `Bearer ${this.anonKey}`,
    'Content-Type': 'application/json'
  });

  private readonly affiliateTag = 'cafeteras_mallen-21';

  constructor() {
    this.loadManualProducts();
  }

  getManualProducts() {
    return this.manualProducts.asReadonly();
  }

  loadManualProducts(): void {
    const params = {
      is_active: 'eq.true', // Only fetch active products
      order: 'created_at.desc'
    };

    this.http.get<ManualProduct[]>(this.supabaseRestUrl, { headers: this.headers, params }).pipe(
      catchError(err => {
        console.error('Error loading manual products from Supabase', err);
        return of([]);
      })
    ).subscribe(products => {
      this.manualProducts.set(products);
    });
  }

  addProduct(url: string, title: string, description: string | null): void {
    const finalUrl = this.ensureAffiliateTag(url);

    const newProductData = {
      url: finalUrl,
      title: title,
      description: description,
    };

    const postHeaders = this.headers.append('Prefer', 'return=representation');

    this.http.post<ManualProduct[]>(this.supabaseRestUrl, newProductData, { headers: postHeaders }).pipe(
      tap(() => {
        this.loadManualProducts();
      }),
      catchError(err => {
        console.error('Error adding manual product to Supabase', err);
        return of(null);
      })
    ).subscribe();
  }

  updateProduct(productId: string, data: { title: string; description: string | null; url: string; }): void {
    const finalUrl = this.ensureAffiliateTag(data.url);
    const updateData = {
      url: finalUrl,
      title: data.title,
      description: data.description,
    };

    const params = { id: `eq.${productId}` };
    
    this.http.patch(this.supabaseRestUrl, updateData, { headers: this.headers, params }).pipe(
      tap(() => {
        this.loadManualProducts();
      }),
      catchError(err => {
        console.error('Error updating manual product in Supabase', err);
        return of(null);
      })
    ).subscribe();
  }

  deleteManualProduct(id: string): Observable<boolean> {
    console.log('[DEACTIVATE][SERVICE] id recibido para desactivar', id);
    const params = { id: `eq.${id}` };
    const updateData = { is_active: false };
    const patchHeaders = this.headers.append('Prefer', 'count=exact');

    return this.http.patch(this.supabaseRestUrl, updateData, { headers: patchHeaders, params, observe: 'response' }).pipe(
      map(response => {
        const contentRange = response.headers.get('content-range');
        const count = contentRange ? parseInt(contentRange.split('/')[1], 10) : 0;
        
        console.log('[DEACTIVATE][SERVICE] resultado Supabase', { data: response.body, error: null, count });

        if (count === 1) {
          // If successful, remove from the local list of active products.
          this.manualProducts.update(currentProducts => 
            currentProducts.filter(p => p.id !== id)
          );
          return true;
        }
        
        console.error('[DEACTIVATE][SERVICE] ERROR: Se esperaba desactivar 1 fila, pero el recuento es', count);
        return false;
      }),
      catchError(error => {
        console.error('[DEACTIVATE][SERVICE] resultado Supabase', { data: null, error: error, count: 0 });
        return of(false);
      })
    );
  }

  private ensureAffiliateTag(url: string): string {
    let correctedUrl = url.trim();
    if (!/^https?:\/\//i.test(correctedUrl)) {
      correctedUrl = `https://${correctedUrl}`;
    }

    try {
      const urlObj = new URL(correctedUrl);
      if (urlObj.searchParams.get('tag') !== this.affiliateTag) {
        urlObj.searchParams.set('tag', this.affiliateTag);
      }
      return urlObj.toString();
    } catch (e) {
      console.error("Invalid URL provided:", url);
      return url; // Return original url if parsing fails
    }
  }
}
