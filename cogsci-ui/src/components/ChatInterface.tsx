import './ChatInterface.css';
import { useState, useRef, useEffect} from 'react';
import type {KeyboardEvent, MouseEvent} from 'react'

import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { Stack, Card } from 'react-bootstrap';

import type {Message, AgentResponse} from "../types.ts"
import ChatBubble from './ChatBubble.tsx';
import ChatHeader from './ChatHeader.tsx'
import ExpertCard from './ExpertCard.tsx';

const Alice = [
  `Hej AI!
  Hur lagar man snabbnudlar?
  `,

  `
  Ursäkta? Kan du ta om det igen?
  `,

  `
  Du är inge vidare hjälpsam, försök igen!
  `,

  `Tack så mycket!`

]
const Bot = [
  // Poeten
`Midnattstimmans tysta ljus,
Alice vandrar genom hus.
Kylen öppnas, kylen stängs,
bort till skafferiet de steg hon svängs.

I magen brummar ett litet skrik,
hon söker efter måltid rik.
Där står en skål, där står ett paket,
om Alice hungriga hemlighet.`,
  
  // Schack
  `Dam B4, schack.`,

  // kocken
  `
  Javisst! Så här gör du:
    1) Låt cirka 3dl vatten koka upp i en kastrull.
    2) Lägg en portion försiktigt ner i kastrullen,
       så att det inte skvätter och låt det koka i 3 minuter.
    3) Bon apetit!
  `
]

const BotProgression = [
  "poet",
  "chess",
  "cook"
]

// TODO: Move this to an appropriate module
async function sendMessage(message: Message, history:Message[]): Promise<AgentResponse> {
  /*
  const response = await fetch(
    import.meta.env.VITE_AGENT_URL || 'http://127.0.0.1:5000/chat', //FIXME: update this!
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json',},
      body: JSON.stringify({
        message: message.content,
        history: history
          .filter((m) => m.role !== 'system')
          .map((m) => ({ role: m.role, content: m.content })),
        }),
    }
  );
  if (!response.ok)
    throw new Error(`HTTP ${response.status}`);
  return response.json() as Promise<AgentResponse>
  */
  return Promise.resolve({response: "Foo"})
}

const ChatInterface = () => {
  const [index, setIndex] = useState(0) // Conversation index

  const [messages, setMessages] = useState<Message[]>([{
    id: `${2*index}`,
    role: 'user',
    content: Alice[index],
    timestamp: new Date(),
  } ]); // message history
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  function handleButtonClick(e: MouseEvent) { 
    e.preventDefault()

    const name = e.currentTarget.id
    if (name != BotProgression[index]) {
      console.log("Wrong")
      return;
    }

    console.log("Hi " + name)

    setMessages([...messages, {
      id : `${2*index+1}`,
      role: 'ai',
      content: Bot[index],
      timestamp: new Date()
    } as Message, 
    {
      id : `${2*index + 2}`,
      role: 'user',
      content : Alice[index+1],
      timestamp: new Date()
    } as Message])

    setIndex(index+1)
  }

  const scrollToBottom = () => {messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });};

  useEffect(() => {scrollToBottom();}, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <Container fluid className="chat-container d-flex flex-column vh-100 p-0">
      
      {/* Conversation Stack */}
      <Stack gap={3}>
        {messages.map((msg) => (
          <ChatBubble msg={msg}/>
        ))}
        <div ref={messagesEndRef} />
      </Stack>
      <Stack gap={3} direction="horizontal" className="justify-content-center">

        <Button className="p-0" onClick={handleButtonClick} id="poet">
          <ExpertCard name="poet"/>
        </Button>
        <Button className="p-0" onClick={handleButtonClick} id="chess">
          <ExpertCard name="chess"/>  
        </Button>
        <Button className="p-0" onClick={handleButtonClick} id="cook">
          <ExpertCard name="cook"/>
        </Button>
      </Stack>
    </Container>
  );
};

export default ChatInterface;