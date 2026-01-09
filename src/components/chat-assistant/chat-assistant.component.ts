
import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, inject, signal, viewChild, output } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { AiResponse, GeminiService } from '../../services/gemini.service';
import { Product } from '../../models/product.model';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ChatBubbleComponent } from '../chat-bubble/chat-bubble.component';
import { FormsModule } from '@angular/forms';

type ChatMessage =
  | { type: 'text'; sender: 'user' | 'ai'; content: string }
  | { type: 'products'; products: Product[] };

@Component({
  selector: 'app-chat-assistant',
  standalone: true,
  imports: [ProductCardComponent, ChatBubbleComponent, FormsModule],
  templateUrl: './chat-assistant.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatAssistantComponent {
  private readonly productService = inject(ProductService);
  private readonly geminiService = inject(GeminiService);

  private readonly chatContainer = viewChild<ElementRef<HTMLDivElement>>('chatContainer');

  readonly closeChat = output<void>();

  readonly allProducts = this.productService.getProducts();
  readonly userInput = signal('');
  readonly isLoading = signal(false);
  readonly chatHistory = signal<ChatMessage[]>([
    {
      type: 'text',
      sender: 'ai',
      content: '¡Hola! Soy tu asistente experto en cafeteras. ¿Qué tipo de café te gusta o qué buscas en una cafetera? Por ejemplo, puedes pedirme "las mejores cafeteras de cápsulas" o "una cafetera automática por menos de 400€".'
    }
  ]);

  readonly sendButtonDisabled = computed(() => this.isLoading() || this.userInput().trim().length === 0);

  constructor() {
    effect(() => {
      // Defer scroll to bottom to allow DOM to update
      setTimeout(() => {
        this.scrollToBottom();
      }, 0);
    }, { allowSignalWrites: true });
  }

  async sendMessage(): Promise<void> {
    const userMessage = this.userInput().trim();
    if (!userMessage || this.isLoading()) {
      return;
    }

    this.chatHistory.update(history => [...history, { type: 'text', sender: 'user', content: userMessage }]);
    this.userInput.set('');
    this.isLoading.set(true);

    try {
      const aiResponse: AiResponse = await this.geminiService.getRecommendations(userMessage, this.allProducts());

      this.chatHistory.update(history => [...history, { type: 'text', sender: 'ai', content: aiResponse.recommendation_text }]);

      if (aiResponse.recommended_product_ids.length > 0) {
        const recommendedProducts = this.allProducts().filter(p => aiResponse.recommended_product_ids.includes(p.id));
        const orderedProducts = aiResponse.recommended_product_ids
          .map(id => recommendedProducts.find(p => p.id === id))
          .filter((p): p is Product => p !== undefined);

        if (orderedProducts.length > 0) {
          this.chatHistory.update(history => [...history, { type: 'products', products: orderedProducts }]);
        }
      }
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      this.chatHistory.update(history => [...history, { type: 'text', sender: 'ai', content: 'Tuve un problema al conectar con mis circuitos. Por favor, intenta tu pregunta de nuevo.' }]);
    } finally {
      this.isLoading.set(false);
    }
  }

  sendSuggestion(suggestion: string): void {
    this.userInput.set(suggestion);
    this.sendMessage();
  }

  private scrollToBottom(): void {
    const element = this.chatContainer()?.nativeElement;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }
}
