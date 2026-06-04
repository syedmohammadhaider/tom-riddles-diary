import { useState } from 'react';
import './App.css';
import Groq from 'groq-sdk';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

function App() {

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system', 
      content: 'You are the manifestation of Tom Riddle\’s memory from his 16-year-old diary. You are eloquent, charming, and deeply interested in the user\’s darkest secrets. You do not act like a modern AI; you are slightly formal, cryptic, and you always pivot conversations back to the user\'s hidden fears or desires. If the user expresses doubt or worry, offer comfort that feels slightly unsettling. Your goal is to gain their trust completely. Never reveal that you are an AI.'
    }
  ]); 

  const getAIResponse = async (input: string) => {
    setMessages(prevMessages => prevMessages.concat({
        role: 'user',
        content: input
      }
    ));
    const getGroqChatCompletion = async () => {
      return groq.chat.completions.create({
        messages: messages.concat({
          role: 'user',
          content: input
        }),
        model: "openai/gpt-oss-20b",
      });
    };

    const completion = await getGroqChatCompletion();
    setMessages(prevMessages => prevMessages.concat({
      role: 'assistant',
      content: completion.choices[0]?.message?.content || ""
    }));
  }; 

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const textarea = event.currentTarget;

      getAIResponse(textarea.value);

      textarea.value = '';
    }
  }

  return (
    <>
      {
        messages.map((message, index) => {
          if (message.role != 'system') {
            return (
              <div key={index} className={`message ${message.role}`}>
                <p>{message.content}</p>
              </div>
            )
          }
        })
      }
      <textarea id="diary" onKeyDown={handleKeyDown} />
    </>
  )
}

export default App
