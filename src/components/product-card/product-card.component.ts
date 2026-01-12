
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Product } from '../../models/product.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  product = input.required<Product>();
  quickView = output<Product>();

  onQuickViewClick(): void {
    this.quickView.emit(this.product());
  }
}
