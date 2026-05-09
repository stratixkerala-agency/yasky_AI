export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export function createMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export async function sendToAI(
  systemPrompt: string,
  userMessage: string,
  history: ChatMessage[] = []
): Promise<string> {
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    { role: 'user', content: userMessage }
  ];

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error('AI service error');
    }

    const data = await response.json();
    return data.message || 'I apologize, but I could not generate a response. Please try again.';
  } catch (error) {
    console.error('AI Error:', error);
    return 'I apologize, but I encountered an error while processing your request. Please check your connection and try again.';
  }
}