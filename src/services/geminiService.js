import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    // Use environment variable for API key
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!this.apiKey) {
      console.error('❌ Gemini API key not found. Please set VITE_GEMINI_API_KEY in your .env file');
      return;
    }
    
    try {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      console.log('✅ Gemini AI initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Gemini AI:', error);
    }
    
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
      if (!this.model) {
        throw new Error('Gemini AI not properly initialized');
      }

      // Build conversation context
      let conversationContext = this.systemPrompt + "\n\nCONVERSATION HISTORY:\n";
      
      // Add recent conversation history (last 6 messages for context)
      const recentHistory = conversationHistory.slice(-6);
      recentHistory.forEach(msg => {
        conversationContext += `${msg.sender === 'user' ? 'Customer' : 'Assistant'}: ${msg.text}\n`;
      });
      
      conversationContext += `\nCustomer: ${userMessage}\nAssistant:`;

      console.log('🤖 Sending request to Gemini AI...');
      const result = await this.model.generateContent(conversationContext);
      const response = await result.response;
      const text = response.text();
      console.log('✅ Received response from Gemini AI');
      return text;
    } catch (error) {
      console.error('❌ Gemini API Error:', error);
      
      // Enhanced fallback responses based on user message content
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes('paint') && lowerMessage.includes('room')) {
        return "For room-specific paint recommendations, I'd suggest speaking with Pratik directly at 9096457620. He has extensive experience helping customers choose the perfect paint for every room in their home. Visit our shop at Yakatput Road, Ausa for personalized consultation!";
      }
      
      if (lowerMessage.includes('color') || lowerMessage.includes('colour')) {
        return "Color selection is one of our specialties! Pratik can help you choose the perfect color combinations for your space. Call 9096457620 or visit Divya Colour Home for expert color consultation and see our extensive color palette!";
      }
      
      if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        return "For accurate pricing on paints and services, please contact Pratik at 9096457620. Prices vary based on paint type, quantity, and specific requirements. We offer competitive rates and quality products!";
      }
      
      if (lowerMessage.includes('book') || lowerMessage.includes('appointment')) {
        return "To book a consultation or painting service, please call Pratik directly at 9096457620. He'll be happy to schedule a convenient time to discuss your paint needs and provide expert guidance!";
      }
      
      // Generic fallback
      return "I'm having some technical difficulties right now, but Pratik is always available to help! Call him at 9096457620 for immediate assistance with your paint needs, or visit Divya Colour Home at Yakatput Road, Ausa, Latur. He's the expert who can solve any paint challenge! 🎨";
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