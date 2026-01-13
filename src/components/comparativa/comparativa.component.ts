
import { ChangeDetectionStrategy, Component, computed, inject, input, effect } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ProductCardComponent } from '../product-card/product-card.component';
import { RouterLink } from '@angular/router';

interface EditorialContent {
  title: string;
  intro: string;
  profile: string;
}

const editorialMap: Record<string, EditorialContent> = {
  'cafeteras-de-capsulas': {
    title: 'Análisis de Cafeteras de Cápsulas',
    intro: 'Las cafeteras de cápsulas han revolucionado la forma en que muchos disfrutan del café en casa. Su principal atractivo reside en la comodidad y la rapidez: insertas una cápsula, pulsas un botón y en menos de un minuto tienes un café de calidad consistente. Son perfectas para quienes tienen una rutina ajetreada y no quieren complicarse con el molido del grano o la limpieza de la máquina.\n\nAdemás de la sencillez, ofrecen una enorme variedad de sabores y tipos de bebida, desde un espresso intenso hasta un capuchino o un chocolate caliente, todo gracias a la amplia gama de cápsulas compatibles disponibles en el mercado. Esto las convierte en una opción muy versátil para satisfacer los gustos de toda la familia.',
    profile: 'Este tipo de cafetera es ideal para personas que valoran la conveniencia por encima de todo. Si buscas rapidez, limpieza y una calidad de café constante sin esfuerzo, la cafetera de cápsulas es tu mejor aliada. También es una gran opción para hogares donde cada persona tiene una preferencia de bebida diferente.'
  },
  'cafeteras-italianas': {
    title: 'Análisis de Cafeteras Italianas (Moka)',
    intro: 'La cafetera italiana, también conocida como Moka, es un icono del diseño y de la cultura del café. Este método de preparación por percolación produce un café con cuerpo, aromático y con una intensidad similar a la del espresso, pero sin la necesidad de una máquina grande y costosa. Su funcionamiento es sencillo y se basa en la presión del vapor de agua para hacer pasar el agua a través del café molido.\n\nUtilizar una cafetera Moka es un ritual para muchos amantes del café. El sonido del café subiendo y el aroma que inunda la cocina son parte de una experiencia auténtica y tradicional. Son duraderas, portátiles y funcionan en casi cualquier tipo de fuego, lo que las hace perfectas tanto para casa como para llevar de viaje.',
    profile: 'Es la elección perfecta para los puristas del café que disfrutan del proceso de preparación y buscan un sabor intenso y tradicional. Si aprecias los rituales, te gusta controlar la molienda y la cantidad de café, y quieres una cafetera robusta que te dure toda la vida, la Moka no te decepcionará.'
  },
  'cafeteras-expreso': {
    title: 'Análisis de Cafeteras Exprés Automáticas',
    intro: 'Las cafeteras exprés automáticas (o superautomáticas) representan la vanguardia de la tecnología del café en el hogar. Estas máquinas lo hacen todo: muelen el grano al instante, dosifican la cantidad perfecta, prensan el café y extraen un espresso de alta calidad con solo pulsar un botón. Ofrecen una experiencia "bean-to-cup" (del grano a la taza) que garantiza la máxima frescura y sabor.\n\nSu principal ventaja es la personalización. Permiten ajustar la intensidad del café, el grado de molienda, la temperatura y la cantidad de agua, guardando a menudo estas preferencias en perfiles de usuario. Muchos modelos incluyen también vaporizadores automáticos para crear cappuccinos y lattes con una espuma perfecta, replicando la experiencia de una cafetería profesional en casa.',
    profile: 'Ideal para los entusiastas del café que desean la máxima calidad y frescura sin complicaciones. Si quieres disfrutar de un espresso perfecto y personalizado cada día, experimentar con diferentes granos de café y tener la comodidad de una máquina que se limpia sola, una cafetera exprés automática es la inversión definitiva.'
  },
  'cafeteras-de-goteo': {
    title: 'Análisis de Cafeteras de Goteo',
    intro: 'Las cafeteras de goteo, también conocidas como americanas o de filtro, son la opción clásica para preparar grandes cantidades de café de forma sencilla. Funcionan calentando agua y haciéndola pasar lentamente a través de un filtro con café molido, lo que resulta en una bebida suave, aromática y menos concentrada que un espresso.\n\nSon extremadamente fáciles de usar: solo tienes que añadir agua y café, y pulsar un botón. Muchos modelos incluyen jarras térmicas que mantienen el café caliente durante horas y funciones programables para que te despiertes con el café recién hecho. Son perfectas para oficinas, reuniones o para quienes beben varias tazas a lo largo de la mañana.',
    profile: 'Es la elección ideal para hogares u oficinas donde se consume mucho café. Si te gusta un café más suave y aromático y valoras la capacidad de preparar varias tazas a la vez de manera automática, la cafetera de goteo es la solución más práctica y económica.'
  }
};

@Component({
  selector: 'app-comparativa',
  standalone: true,
  imports: [ProductCardComponent, RouterLink],
  template: `
    <div class="bg-white p-6 md:p-10 rounded-lg shadow-sm border border-slate-200">
      @if (content(); as c) {
        <a routerLink="/" class="text-sm text-orange-600 hover:underline mb-6 inline-block">‹ Volver al catálogo</a>
        <h1 class="text-3xl font-bold text-slate-800 mb-4">{{ c.title }}</h1>
        <div class="prose prose-slate max-w-none space-y-4 text-slate-600 mb-8">
          <p>{{ c.intro.split('\\n\\n')[0] }}</p>
          <p>{{ c.intro.split('\\n\\n')[1] }}</p>
          <div class="p-4 bg-slate-50 border-l-4 border-orange-500 rounded-r-lg">
            <h3 class="font-semibold text-slate-800">¿Para quién es ideal?</h3>
            <p class="!mt-2">{{ c.profile }}</p>
          </div>
        </div>

        <h2 class="text-2xl font-bold text-slate-800 mb-6 border-b pb-2">Modelos Recomendados</h2>
        @if (products().length > 0) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (product of products(); track product.id) {
              <app-product-card [product]="product" />
            }
          </div>
        } @else {
          <p class="text-slate-500">No se encontraron productos para esta categoría en este momento.</p>
        }
      } @else {
        <h1 class="text-3xl font-bold">Página no encontrada</h1>
        <p class="text-slate-500 mt-4">La comparativa que buscas no existe.</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComparativaComponent {
  private readonly productService = inject(ProductService);
  
  tipo = input<string | null>(null);

  constructor() {
    console.log("[EDITORIAL] Navegación inversa disponible:", true);
    effect(() => {
      const currentTipo = this.tipo();
      if (currentTipo) {
        console.log("[EDITORIAL] Página comparativa cargada:", currentTipo);
      }
    });
  }

  readonly content = computed(() => {
    const currentTipo = this.tipo();
    return currentTipo ? editorialMap[currentTipo] : null;
  });
  
  readonly products = computed(() => {
    const currentTipo = this.tipo();
    const allProducts = this.productService.getProducts()();
    if (!currentTipo) return [];

    switch (currentTipo) {
      case 'cafeteras-de-capsulas':
        return allProducts.filter(p => p.name.toLowerCase().includes('cápsulas'));
      case 'cafeteras-italianas':
        return allProducts.filter(p => /italiana|moka/i.test(p.name));
      case 'cafeteras-expreso':
        return allProducts.filter(p => /automática|superautomática|espresso/i.test(p.name) && !/cápsulas/i.test(p.name));
      case 'cafeteras-de-goteo':
        return allProducts.filter(p => /goteo|filtro/i.test(p.name));
      default:
        return [];
    }
  });
}
