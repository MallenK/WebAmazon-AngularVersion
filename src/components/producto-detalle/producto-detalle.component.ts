
import { ChangeDetectionStrategy, Component, computed, input, effect, inject } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (product(); as p) {
      <div class="bg-white p-6 md:p-10 rounded-lg shadow-sm border border-slate-200">
        <a routerLink="/" class="text-sm text-orange-600 hover:underline mb-6 inline-block">‹ Volver al catálogo</a>
        <div class="flex flex-col md:flex-row gap-8">
          <div class="md:w-1/3">
             @if (p.image_url) {
              <div class="bg-slate-50 rounded-lg border p-4 sticky top-24">
                <img [src]="p.image_url" [alt]="p.name" class="w-full h-auto object-contain">
              </div>
            }
          </div>
          <div class="md:w-2/3">
            <h1 class="text-2xl md:text-3xl font-bold text-slate-800">{{ p.name }}</h1>
            <div class="flex items-center gap-2 mt-2 text-sm text-slate-500 mb-4">
              @if(p.rating_num) {
                <div class="flex items-center gap-1 text-amber-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  <span class="font-bold text-slate-700">{{ p.rating_num }}</span>
                </div>
                @if(p.reviews_count) { <span class="text-slate-300">|</span> }
              }
              @if(p.reviews_count) {
                <span>Basado en {{ p.reviews_count }} reseñas</span>
              }
            </div>
            
            <div class="prose prose-slate max-w-none space-y-4 text-slate-600">
              <p>Este modelo es una opción destacada dentro de su categoría, ofreciendo un equilibrio entre funcionalidad y diseño. Ha sido seleccionada por nuestro equipo por su fiabilidad y las valoraciones positivas de los usuarios.</p>
              <p>Es especialmente adecuada para quienes buscan una experiencia de café superior en casa sin una gran complicación. Su diseño se adapta bien a la mayoría de las cocinas modernas, y su funcionamiento está pensado para ser intuitivo para el usuario medio.</p>
              <div class="p-4 bg-slate-50 border-l-4 border-orange-500 rounded-r-lg !my-6">
                <h3 class="font-semibold text-slate-800">Nuestra valoración editorial</h3>
                <p class="!mt-2">Consideramos que este producto ofrece una excelente propuesta para su perfil de usuario. Aunque siempre recomendamos revisar las especificaciones completas en la página del vendedor, es una de las opciones más consistentes que hemos analizado en su rango.</p>
              </div>
            </div>

            <div class="mt-8 pt-6 border-t">
               <p class="text-sm text-slate-500 mb-2">Para ver detalles actualizados, especificaciones y la información más reciente, consulta la página oficial del producto en Amazon.</p>
               <a [href]="p.amazon_url" target="_blank" rel="noopener sponsored" class="inline-block w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors duration-300">
                Ver en Amazon
              </a>
            </div>

          </div>
        </div>
      </div>
    } @else {
      <div class="text-center py-20">
        <h3 class="text-2xl font-bold text-slate-700">Producto no encontrado</h3>
        <p class="text-slate-500 mt-2">No hemos podido encontrar el producto que buscas.</p>
        <a routerLink="/" class="mt-6 inline-block px-4 py-2 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600 transition-colors">Volver al catálogo</a>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductoDetalleComponent {
  private readonly productService = inject(ProductService);
  asin = input.required<string>();

  readonly product = computed(() => {
    return this.productService.getProducts()().find(p => p.asin === this.asin()) ?? null;
  });

  constructor() {
    console.log("[EDITORIAL] Navegación inversa disponible:", true);
    effect(() => {
      const p = this.product();
      if (p) {
        console.log("[EDITORIAL] Ficha editorial de producto cargada:", p.asin);
      }
    });
  }
}
