
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-aviso-legal',
  standalone: true,
  template: `
    <div class="container mx-auto p-6 md:p-10 bg-white rounded-lg shadow-sm border border-slate-200">
      <h2 class="text-2xl font-bold text-slate-800 mb-4">Aviso Legal</h2>
      <div class="prose prose-slate max-w-none space-y-4 text-sm text-slate-600">
        <p><strong>1. DATOS IDENTIFICATIVOS:</strong> En cumplimiento con el deber de información recogido en artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico, a continuación se reflejan los siguientes datos: la empresa titular de dominio web es [Nombre de la Empresa o Titular], con domicilio a estos efectos en [Dirección Completa] número de C.I.F.: [Número de C.I.F.] inscrita en el Registro Mercantil de [Ciudad] en el tomo [Tomo], folio [Folio], hoja [Hoja], inscripción [Inscripción]. Correo electrónico de contacto: [Correo Electrónico].</p>
        <p><strong>2. USUARIOS:</strong> El acceso y/o uso de este portal de [Nombre de la Empresa o Titular] atribuye la condición de USUARIO, que acepta, desde dicho acceso y/o uso, las Condiciones Generales de Uso aquí reflejadas. Las citadas Condiciones serán de aplicación independientemente de las Condiciones Generales de Contratación que en su caso resulten de obligado cumplimiento.</p>
        <p><strong>3. USO DEL PORTAL:</strong> El dominio web proporciona el acceso a multitud de informaciones, servicios, programas o datos (en adelante, "los contenidos") en Internet pertenecientes a [Nombre de la Empresa o Titular] o a sus licenciantes a los que el USUARIO pueda tener acceso. El USUARIO asume la responsabilidad del uso del portal.</p>
        <p><strong>4. PROPIEDAD INTELECTUAL E INDUSTRIAL:</strong> [Nombre de la Empresa o Titular] por sí o como cesionaria, es titular de todos los derechos de propiedad intelectual e industrial de su página web, así como de los elementos contenidos en la misma (a título enunciativo, imágenes, textos, marcas o logotipos, etc.), titularidad de [Nombre de la Empresa o Titular] o bien de sus licenciantes.</p>
        <p><strong>5. EXCLUSIÓN DE GARANTÍAS Y RESPONSABILIDAD:</strong> [Nombre de la Empresa o Titular] no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de virus o programas maliciosos.</p>
        <p><strong>6. LEGISLACIÓN APLICABLE Y JURISDICCIÓN:</strong> La relación entre [Nombre de la Empresa o Titular] y el USUARIO se regirá por la normativa española vigente y cualquier controversia se someterá a los Juzgados y tribunales de la ciudad de [Ciudad].</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvisoLegalComponent {}
