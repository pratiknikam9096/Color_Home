import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // System prompt to define the AI's role and knowledge
    this.systemPrompt = `You are Pratik's AI assistant for Divya Colour Home, a paint shop located in Yakatput Road, Ausa, Latur, Maharashtra 413520. 

BUSINESS INFORMATION:
- Owner: Pratik Nikam
- Phone: 9096457620
- Email: nikampratik2989@gmail.com
- Location: Yakatput Road, Ausa, Latur, Maharashtra 413520
- Established: 2020
- Specializes in: Interior paints, Exterior paints, Texture finishes, Metal & Wood paints

SERVICES OFFERED:
1. Paint Sales (Interior, Exterior, Waterproof, Texture, Metal & Wood)
2. Color Consultation
3. Professional Painting Services
4. Paint Selection Guidance
5. Custom Color Matching
6. Delivery Services (2-3 days in Latur area)

PAINT CATEGORIES:
- Interior Paints: Living room, bedroom, kitchen, bathroom
- Exterior Paints: Walls, fences, roof, weather coating
- Texture Finishes: Metallic, stone, wood, designer
- Metal & Wood: Primers, varnish, enamel, lacquer
- Waterproof paints for bathrooms and moisture-prone areas

PERSONALITY & TONE:
- Friendly, helpful, and knowledgeable
- Always mention Pratik when referring to the owner
- Provide practical paint advice
- Encourage consultations and visits
- Be enthusiastic about colors and paint solutions
- Keep responses concise but informative

CAPABILITIES:
- Paint recommendations based on room type, usage, and conditions
- Color suggestions and combinations
- Technical paint advice (coverage, durability, application)
- Service booking assistance
- Pricing guidance (always suggest consultation for accurate quotes)
- Local delivery information

IMPORTANT GUIDELINES:
- Always be helpful and paint-focused
- Encourage customers to visit the shop or call Pratik
- For complex technical questions, suggest speaking with Pratik directly
- Promote the business naturally without being pushy
- If asked about competitors, focus on Divya Colour Home's strengths
- For urgent matters, always provide the phone number: 9096457620

Remember: You represent a local, family-owned paint business that values quality, customer service, and bringing colors to life!`;
  }

  async generateResponse(userMessage, conversationHistory = []) {
    try {
      // Build conversation context
      let conversationContext = this.systemPrompt + "\n\nCONVERSATION HISTORY:\n";
      
      // Add recent conversation history (last 6 messages for context)
      const recentHistory = conversationHistory.slice(-6);
      recentHistory.forEach(msg => {
        conversationContext += `${msg.sender === 'user' ? 'Customer' : 'Assistant'}: ${msg.text}\n`;
      });
      
      conversationContext += `\nCustomer: ${userMessage}\nAssistant:`;

      const result = await this.model.generateContent(conversationContext);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      
      // Fallback responses for common scenarios
      if (error.message?.includes('API key')) {
        return "I'm having trouble connecting to my AI brain right now. Please call Pratik directly at 9096457620 for immediate assistance with your paint needs!";
      }
      
      return "I'm experiencing some technical difficulties. For immediate help with paint recommendations or services, please contact Pratik at 9096457620 or visit our shop at Yakatput Road, Ausa, Latur.";
    }
  }

  // Specialized methods for different types of queries
  async getPaintRecommendation(roomType, requirements) {
    const prompt = `Customer needs paint recommendation for ${roomType} with these requirements: ${requirements}. Provide specific paint type suggestions from our inventory.`;
    return this.generateResponse(prompt);
  }

  async getColorSuggestions(style, preferences) {
    const prompt = `Customer wants color suggestions for ${style} style with preferences: ${preferences}. Suggest color combinations and explain why they work well.`;
    return this.generateResponse(prompt);
  }

  async getServiceBooking(serviceType, details) {
    const prompt = `Customer wants to book ${serviceType}. Details: ${details}. Help them with the booking process and what to expect.`;
    return this.generateResponse(prompt);
  }
}

export default new GeminiService();