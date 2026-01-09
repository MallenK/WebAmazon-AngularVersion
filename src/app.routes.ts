
import { Routes } from '@angular/router';
import { ProductsViewComponent } from './components/products-view/products-view.component';
import { ComparativaComponent } from './components/comparativa/comparativa.component';
import { ProductoDetalleComponent } from './components/producto-detalle/producto-detalle.component';
import { AvisoLegalComponent } from './components/aviso-legal/aviso-legal.component';
import { PoliticaPrivacidadComponent } from './components/politica-privacidad/politica-privacidad.component';
import { PoliticaCookiesComponent } from './components/politica-cookies/politica-cookies.component';

export const routes: Routes = [
    { path: '', component: ProductsViewComponent, pathMatch: 'full' },
    { path: 'comparativas/:tipo', component: ComparativaComponent },
    { path: 'producto/:asin', component: ProductoDetalleComponent },
    { path: 'aviso-legal', component: AvisoLegalComponent },
    { path: 'politica-privacidad', component: PoliticaPrivacidadComponent },
    { path: 'politica-cookies', component: PoliticaCookiesComponent },
    { path: '**', redirectTo: '' }
];
