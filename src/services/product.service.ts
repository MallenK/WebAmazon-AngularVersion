
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../models/product.model';
import { catchError, of } from 'rxjs';

// ARCHITECTURE NOTE:
// This service fetches data directly from a Supabase Edge Function endpoint.
// The function at '/functions/v1/bright-task' queries the 'products_cafetera' table
// and returns only active products. All requests must include the Supabase anon key
// in the Authorization header for the call to succeed.
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  
  private readonly apiProducts = signal<Product[]>([]);

  constructor() {
    this.loadProducts();
  }

  public loadProducts(): void {
    const supabaseUrl = 'https://keewdanzvhxplokkgnhq.supabase.co/functions/v1/bright-task';
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlZXdkYW56dmh4cGxva2tnbmhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4NjQyNDUsImV4cCI6MjA4MzQ0MDI0NX0.Nx5qVmCilV0rVSm8sVS5_MfmT6tPdLY26jE6EPXIi94';
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${anonKey}`
    });

    this.http.get<Product[]>(supabaseUrl, { headers }).pipe(
      catchError(error => {
        console.error('Error loading products from Supabase Edge Function:', error);
        // In a real app, you might want more sophisticated error handling,
        // like showing a toast notification to the user.
        return of([]); // Return an empty array on error to prevent the app from crashing.
      })
    ).subscribe(activeProducts => {
      console.log('Productos recibidos desde backend:', activeProducts.slice(0, 2));
      console.log('Total productos:', activeProducts.length);
      this.apiProducts.set(activeProducts);
    });
  }

  getProducts() {
    return this.apiProducts;
  }
}
