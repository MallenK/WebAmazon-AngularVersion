
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-politica-privacidad',
  standalone: true,
  template: `
    <div class="container mx-auto p-6 md:p-10 bg-white rounded-lg shadow-sm border border-slate-200">
      <h2 class="text-2xl font-bold text-slate-800 mb-4">Política de Privacidad</h2>
      <div class="prose prose-slate max-w-none space-y-4 text-sm text-slate-600">
        <p>La presente Política de Privacidad establece los términos en que [Nombre de la Empresa o Titular] usa y protege la información que es proporcionada por sus usuarios al momento de utilizar su sitio web. Esta compañía está comprometida con la seguridad de los datos de sus usuarios. Cuando le pedimos llenar los campos de información personal con la cual usted pueda ser identificado, lo hacemos asegurando que sólo se empleará de acuerdo con los términos de este documento.</p>
        <p><strong>Información que es recogida:</strong> Nuestro sitio web podrá recoger información personal por ejemplo: Nombre, información de contacto como su dirección de correo electrónica e información demográfica. Así mismo cuando sea necesario podrá ser requerida información específica para procesar algún pedido o realizar una entrega o facturación.</p>
        <p><strong>Uso de la información recogida:</strong> Nuestro sitio web emplea la información con el fin de proporcionar el mejor servicio posible, particularmente para mantener un registro de usuarios, de pedidos en caso que aplique, y mejorar nuestros productos y servicios. Es posible que sean enviados correos electrónicos periódicamente a través de nuestro sitio con ofertas especiales, nuevos productos y otra información publicitaria que consideremos relevante para usted o que pueda brindarle algún beneficio.</p>
        <p><strong>Control de su información personal:</strong> En cualquier momento usted puede restringir la recopilación o el uso de la información personal que es proporcionada a nuestro sitio web. Esta compañía no venderá, cederá ni distribuirá la información personal que es recopilada sin su consentimiento, salvo que sea requerido por un juez con un orden judicial.</p>
        <p>[Nombre de la Empresa o Titular] se reserva el derecho de cambiar los términos de la presente Política de Privacidad en cualquier momento.</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoliticaPrivacidadComponent {}
