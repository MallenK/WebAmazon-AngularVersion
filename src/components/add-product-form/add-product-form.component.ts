
import { ChangeDetectionStrategy, Component, output, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomProductService } from '../../services/custom-product.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product } from '../../models/product.model';

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
  readonly editUrlControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(https?:\/\/)?(www\.)?(amazon\.es|amazon\.com)\/.+$/)
  ]);

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

  deleteProduct(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.customProductService.deleteProduct(id);
    }
  }

  startEdit(product: Product): void {
    this.editingProductId.set(product.id);
    this.editUrlControl.setValue(product.amazon_url);
  }

  cancelEdit(): void {
    this.editingProductId.set(null);
    this.editUrlControl.reset();
  }

  saveEdit(productId: string): void {
    if (this.editUrlControl.invalid || !this.editUrlControl.value) {
      return;
    }
    this.customProductService.updateProductUrl(productId, this.editUrlControl.value);
    this.cancelEdit();
  }
}
