
import { ChangeDetectionStrategy, Component, output, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomProductService } from '../../services/custom-product.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ManualProduct } from '../../models/manual-product.model';

@Component({
  selector: 'app-add-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, ProductCardComponent],
  templateUrl: './add-product-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProductFormComponent {
  readonly close = output<void>();
  private readonly customProductService = inject(CustomProductService);
  
  readonly manualProducts = this.customProductService.getManualProducts();

  readonly productUrlControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(https?:\/\/)?(www\.)?(amazon\.es|amazon\.com)\/.+$/)
  ]);
  readonly titleControl = new FormControl('', [Validators.required, Validators.maxLength(150)]);
  readonly productForm = new FormGroup({
    url: this.productUrlControl,
    title: this.titleControl,
    description: new FormControl('', [Validators.maxLength(300)])
  });

  readonly isSubmitting = signal(false);

  // Edit state
  readonly editingProductId = signal<string | null>(null);
  readonly editForm = new FormGroup({
    url: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(https?:\/\/)?(www\.)?(amazon\.es|amazon\.com)\/.+$/)
    ]),
    title: new FormControl('', [Validators.required, Validators.maxLength(150)]),
    description: new FormControl('', [Validators.maxLength(300)])
  });

  onSubmit(): void {
    if (this.productForm.invalid || this.isSubmitting()) {
      return;
    }
    this.isSubmitting.set(true);

    const { url, title, description } = this.productForm.value;

    if (url && title) {
      this.customProductService.addProduct(url, title, description || null);
      this.productForm.reset();
    }

    // Simulate a brief delay for user feedback
    setTimeout(() => {
      this.isSubmitting.set(false);
    }, 500);
  }

  onDeleteManual(id: string, event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    if (!id) {
      console.error("[DEACTIVATE][UI] Error: Se intentó desactivar un producto sin ID.");
      return;
    }

    if (confirm('¿Estás seguro de que quieres eliminar este producto? La acción no se puede deshacer.')) {
      console.log('[DEACTIVATE][UI] solicitando desactivación', id);
      this.customProductService.deleteManualProduct(id).subscribe(success => {
        if (success) {
          console.log('[DEACTIVATE][UI] producto desactivado correctamente', id);
        } else {
          console.error('[DEACTIVATE][UI] Fallo al desactivar el producto en el backend.', { id });
          alert('No se pudo eliminar el producto. Revise la consola para más detalles.');
        }
      });
    }
  }

  startEdit(product: ManualProduct): void {
    this.editingProductId.set(product.id);
    this.editForm.setValue({
      url: product.url,
      title: product.title || '',
      description: product.description || ''
    });
  }

  cancelEdit(): void {
    this.editingProductId.set(null);
    this.editForm.reset();
  }

  saveEdit(productId: string): void {
    if (this.editForm.invalid) {
      return;
    }
    const { url, title, description } = this.editForm.value;

    if (url && title) {
      this.customProductService.updateProduct(productId, { url, title, description: description || null });
    }
    this.cancelEdit();
  }
}
