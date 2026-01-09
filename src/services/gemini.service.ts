
import { Injectable } from '@angular/core';
import { GoogleGenAI, Type } from '@google/genai';
import { Product } from '../models/product.model';

export interface AiResponse {
    recommendation_text: string;
    recommended_product_ids: string[];
}

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private readonly ai: GoogleGenAI;

  constructor() {
    if (!process.env.API_KEY) {
        console.error("API_KEY environment variable not set.");
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  // ARCHITECTURE NOTE: In a production backend-first architecture, this entire method would live on the backend
  // (e.g., a Supabase Edge Function). The frontend would make a single, authenticated API call to an endpoint
  // like `/api/recommendations`. The backend would then fetch products from the 'products_cafetera' database table and call the Google AI API securely,
  // preventing exposure of the API key and centralizing the business logic.
  async getRecommendations(
    userInput: string,
    products: readonly Product[]
  ): Promise<AiResponse> {
    const model = 'gemini-2.5-flash';
    
    const systemInstruction = `Eres un asistente experto en recomendaciones de productos para una web de afiliados de Amazon España. Tu especialidad actual son las cafeteras.
    Tu tono debe ser neutral, informativo y muy útil. Sigue estas reglas estrictamente:
    1.  Basa todas tus recomendaciones únicamente en la lista de productos en formato JSON que se te proporciona. No uses conocimiento externo ni inventes productos.
    2.  Tu objetivo principal es ayudar al usuario a encontrar la mejor cafetera para sus necesidades basándote en su consulta. Puedes usar campos como 'rating_num' (valoración), 'reviews_count' (número de reseñas) y 'bought_last_month' (popularidad reciente) para dar mejores respuestas.
    3.  Si el usuario pide "las mejores" o algo similar, prioriza los productos con alta valoración media ('rating_num') y un alto número de reseñas ('reviews_count'). Considera también la relación calidad-precio si el campo 'price' está disponible.
    4.  Mantén tus explicaciones breves, claras y centradas en los datos disponibles de los productos.
    5.  Debes responder siempre en formato JSON válido, siguiendo el esquema proporcionado. No añadas texto fuera del JSON.
    6.  Comunícate en español, ya que es el idioma del usuario.
    7.  Limita tus recomendaciones a un máximo de 5 productos para no abrumar al usuario.`;

    const request = {
      model: model,
      contents: `Consulta del usuario: "${userInput}"\n\nDatos de productos disponibles:\n${JSON.stringify(products)}`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendation_text: {
              type: Type.STRING,
              description: 'Un texto de introducción útil y breve en español, explicando por qué se recomiendan estos productos, basado en la consulta del usuario.'
            },
            recommended_product_ids: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Un array con los IDs de los productos de la lista proporcionada que recomiendas. No incluyas más de 5 IDs.'
            }
          },
          required: ['recommendation_text', 'recommended_product_ids']
        }
      }
    };

    try {
      const response = await this.ai.models.generateContent(request);
      const jsonText = response.text.trim();
      return JSON.parse(jsonText) as AiResponse;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      // Return a user-friendly error response
      return {
        recommendation_text: 'Lo siento, he tenido un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.',
        recommended_product_ids: []
      };
    }
  }
}
