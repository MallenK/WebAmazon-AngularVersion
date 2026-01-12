
import { ChangeDetectionStrategy, Component, output, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomProductService } from '../../services/custom-product.service';
import { ProductCardComponent } from '../product-card/product-card.component';

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
  
  readonly productForm = new FormGroup({
    url: this.productUrlControl
  });

  readonly isSubmitting = signal(false);

  onSubmit(): void {
    if (this.productForm.invalid || this.isSubmitting()) {
      return;
    }
    this.isSubmitting.set(true);

    const url = this.productForm.value.url;
    if (url) {
      this.customProductService.addProduct(url);
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
}