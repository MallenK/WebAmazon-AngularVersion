
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-politica-cookies',
  standalone: true,
  template: `
    <div class="container mx-auto p-6 md:p-10 bg-white rounded-lg shadow-sm border border-slate-200">
      <h2 class="text-2xl font-bold text-slate-800 mb-4">Política de Cookies</h2>
      <div class="prose prose-slate max-w-none space-y-4 text-sm text-slate-600">
        <p>Una cookie se refiere a un fichero que es enviado con la finalidad de solicitar permiso para almacenarse en su ordenador, al aceptar dicho fichero se crea y la cookie sirve entonces para tener información respecto al tráfico web, y también facilita las futuras visitas a una web recurrente. Otra función que tienen las cookies es que con ellas las web pueden reconocerte individualmente y por tanto brindarte el mejor servicio personalizado de su web.</p>
        <p>Nuestro sitio web emplea las cookies para poder identificar las páginas que son visitadas y su frecuencia. Esta información es empleada únicamente para análisis estadístico y después la información se elimina de forma permanente. Usted puede eliminar las cookies en cualquier momento desde su ordenador. Sin embargo las cookies ayudan a proporcionar un mejor servicio de los sitios web, estás no dan acceso a información de su ordenador ni de usted, a menos de que usted así lo quiera y la proporcione directamente.</p>
        <p>Usted puede aceptar o negar el uso de cookies, sin embargo la mayoría de navegadores aceptan cookies automáticamente pues sirve para tener un mejor servicio web. También usted puede cambiar la configuración de su ordenador para declinar las cookies. Si se declinan es posible que no pueda utilizar algunos de nuestros servicios.</p>
        <p><strong>Cookies de afiliados:</strong> Este sitio web participa en el Programa de Afiliados de Amazon EU, un programa de publicidad para afiliados diseñado para ofrecer a sitios web un modo de obtener comisiones por publicidad, publicitando e incluyendo enlaces a Amazon.es. Amazon y el logo de Amazon son marcas registradas de Amazon.com, Inc. o sus afiliados.</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoliticaCookiesComponent {}
