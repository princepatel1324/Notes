import OpenAI from 'openai';

interface GlossaryTerm {
  term: string;
  definition: string;
  position: number;
}

interface GrammarError {
  text: string;
  suggestion: string;
  position: number;
}

interface AISummary {
  summary: string;
  keyPoints: string[];
}

interface AITags {
  tags: string[];
  confidence: number;
}

class AIService {
  private openai: OpenAI | null = null;
  private apiKey: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    console.log('AI Service: API key loaded:', this.apiKey ? 'Yes (length: ' + this.apiKey.length + ')' : 'No');
    console.log('AI Service: API key starts with sk-:', this.apiKey.startsWith('sk-'));
    
    // Validate API key format and initialize OpenAI client
    if (!this.apiKey) {
      console.warn('OpenAI API key not found. AI features will use mock data.');
    } else if (!this.apiKey.startsWith('sk-') || this.apiKey.length < 50) {
      console.warn('OpenAI API key appears to be invalid. Expected format: sk-... (51+ characters)');
      console.warn('Current key:', this.apiKey.substring(0, 20) + '...');
      this.apiKey = ''; // Reset to empty to force fallback
    } else {
      // Initialize OpenAI client with valid API key
      this.openai = new OpenAI({
        apiKey: this.apiKey,
        dangerouslyAllowBrowser: true // Required for client-side usage
      });
      console.log('AI Service: OpenAI client initialized successfully');
    }
  }

  private async makeAPICall(prompt: string, maxTokens: number = 500): Promise<{ success: boolean; data?: string; error?: string }> {
    console.log('AI Service: makeAPICall called with prompt length:', prompt.length);
    
    if (!this.openai) {
      console.log('AI Service: OpenAI client not initialized, returning error');
      return { success: false, error: 'OpenAI client not initialized' };
    }

    try {
      console.log('AI Service: Making API call to OpenAI...');
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini', // Using the model you specified
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant that analyzes text content and provides insights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: 0.3,
      });

      console.log('AI Service: API response received');
      const content = response.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content received from OpenAI API');
      }

      return { success: true, data: content };
    } catch (error) {
      console.error('AI API Error:', error);
      
      // Handle specific OpenAI errors
      if (error instanceof Error) {
        if (error.message.includes('429') || error.message.includes('quota')) {
          return { 
            success: false, 
            error: 'OpenAI quota exceeded. Please check your billing and usage limits at https://platform.openai.com/usage' 
          };
        } else if (error.message.includes('401') || error.message.includes('unauthorized')) {
          return { 
            success: false, 
            error: 'Invalid OpenAI API key. Please check your API key configuration.' 
          };
        } else if (error.message.includes('rate limit')) {
          return { 
            success: false, 
            error: 'OpenAI rate limit exceeded. Please try again in a few minutes.' 
          };
        }
      }
      
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async generateSummary(content: string): Promise<AISummary> {
    console.log('AI Service: Generating summary for content:', content.substring(0, 100) + '...');
    
    const prompt = `Please provide a concise 1-2 line summary of the following text and list 3-5 key points. Format your response as JSON with "summary" and "keyPoints" fields:

Text: ${content.substring(0, 2000)}

Response format:
{
  "summary": "Brief summary here",
  "keyPoints": ["Point 1", "Point 2", "Point 3"]
}`;

    const response = await this.makeAPICall(prompt, 300);
    console.log('AI Service: API response:', response);
    
    if (response.success && response.data) {
      try {
        const parsed = JSON.parse(response.data);
        console.log('AI Service: Parsed summary data:', parsed);
        return {
          summary: parsed.summary || 'Unable to generate summary',
          keyPoints: parsed.keyPoints || []
        };
      } catch (parseError) {
        console.log('AI Service: JSON parse error, using raw response:', response.data);
        return {
          summary: response.data || 'Unable to generate summary',
          keyPoints: []
        };
      }
    }

    console.log('AI Service: Using fallback mock data');
    // Fallback mock data - this will be the same for all notes until API key is fixed
    return {
      summary: "This note discusses important topics and key concepts relevant to the subject matter. [Note: OpenAI quota exceeded - please check billing at https://platform.openai.com/usage]",
      keyPoints: [
        "Key concept 1",
        "Important point 2", 
        "Main topic 3",
        "Significant detail 4",
        "⚠️ OpenAI quota exceeded - check billing"
      ]
    };
  }

  async generateTags(content: string): Promise<AITags> {
    const prompt = `Analyze the following text and suggest 3-5 relevant tags. Return only a JSON array of tag strings:

Text: ${content.substring(0, 2000)}

Example response: ["tag1", "tag2", "tag3"]`;

    const response = await this.makeAPICall(prompt, 150);
    
    if (response.success && response.data) {
      try {
        const tags = JSON.parse(response.data);
        return {
          tags: Array.isArray(tags) ? tags : [],
          confidence: 0.8
        };
      } catch {
        return {
          tags: [],
          confidence: 0.3
        };
      }
    }

    // Fallback mock data
    return {
      tags: ["general", "notes", "content", "⚠️-quota-exceeded"],
      confidence: 0.3
    };
  }

  async checkGrammar(content: string): Promise<GrammarError[]> {
    const prompt = `Analyze the following text for grammar errors and provide corrections. Return a JSON array of objects with "text", "suggestion", and "position" fields:

Text: ${content.substring(0, 2000)}

Example response:
[
  {
    "text": "incorrect text",
    "suggestion": "corrected text", 
    "position": 45
  }
]`;

    const response = await this.makeAPICall(prompt, 400);
    
    if (response.success && response.data) {
      try {
        const errors = JSON.parse(response.data);
        return Array.isArray(errors) ? errors : [];
      } catch {
        return [];
      }
    }

    // Fallback mock data
    return [
      {
        text: "teammates",
        suggestion: "team members",
        position: 45
      },
      {
        text: "However",
        suggestion: "However,",
        position: 120
      },
      {
        text: "⚠️ OpenAI quota exceeded",
        suggestion: "Check your billing at https://platform.openai.com/usage",
        position: 0
      }
    ];
  }

  async generateGlossary(content: string): Promise<GlossaryTerm[]> {
    const prompt = `Identify key terms, concepts, and technical words in the following text that might need explanation. For each term, provide a brief definition. Return a JSON array of objects with "term", "definition", and "position" fields:

Text: ${content.substring(0, 2000)}

Example response:
[
  {
    "term": "Agile methodology",
    "definition": "An iterative approach to project management",
    "position": 120
  }
]`;

    const response = await this.makeAPICall(prompt, 500);
    
    if (response.success && response.data) {
      try {
        const terms = JSON.parse(response.data);
        return Array.isArray(terms) ? terms : [];
      } catch {
        return [];
      }
    }

    // Fallback mock data
    return [
      {
        term: "Agile methodology",
        definition: "An iterative approach to project management",
        position: 120
      },
      {
        term: "Sprint planning",
        definition: "A collaborative event where the team plans work",
        position: 200
      },
      {
        term: "Stakeholder",
        definition: "Anyone with an interest in the project outcome",
        position: 300
      },
      {
        term: "⚠️ OpenAI Quota",
        definition: "Check your billing and usage at https://platform.openai.com/usage to resolve quota issues",
        position: 0
      }
    ];
  }

  // Helper method to strip HTML and get plain text
  stripHtmlTags(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  }
}

export const aiService = new AIService();
export type { AISummary, AITags, GrammarError, GlossaryTerm };
