import { useState, useRef, useEffect} from 'react';
import type KeyboardEvent from 'react'

import { Send, Sparkles, Calendar, User, Bot } from 'lucide-react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import './ChatInterface.css';

import type {Message, AgentResponse} from "../types.ts"

const DEFAULT_MSG_CONTENT = `
✻ Welcome to Claude Scheduler Connected to Outlook agent.
Ask me to:
  • Schedule meetings
  • Check your calendar
  • Reschedule or cancel events
  • Find available times
`
  
const DEFAULT_SYSTEM_MSG = {
  id: '1',
  role: 'system',
  content: DEFAULT_MSG_CONTENT,
  timestamp: new Date(),
} as Message

// TODO: Move this to an appropriate module
async function sendMessage(message: Message, history:Message[]): Promise<AgentResponse> {
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
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([DEFAULT_SYSTEM_MSG]); // message history
  const [input, setInput] = useState('');
  const [isLoading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });};

  useEffect(() => {scrollToBottom();}, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    try{
      const agentResponse = await sendMessage(userMessage, messages);

      const assistantMessage = { 
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: agentResponse.response,
        timestamp: new Date(),
      } as Message;
      setMessages((prev) => [...prev, assistantMessage]);
    }
    catch (err) {
      // TODO: improve error response!
       const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠ Error contacting agent: ${err instanceof Error ? err.message : 'Unknown error'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
    finally {
      setLoading(false);
    }

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Container fluid className="chat-container d-flex flex-column vh-100 p-0">
      
      <div className="chat-header px-3 py-2 d-flex justify-content-between align-items-center border-bottom">
        <div className="header-left d-flex align-items-center">
          <Sparkles size={16} className="sparkle-icon me-2" />
          <span className="header-title fw-bold">claude-scheduler</span>
          <span className="header-subtitle ms-2 d-none d-sm-inline opacity-75">outlook agent</span>
        </div>
        <div className="header-right d-flex align-items-center">
          <Calendar size={14} className="me-2" />
          <span className="status-dot me-1" />
          <span className="d-none d-sm-inline">connected</span>
        </div>
      </div>

      <div className="messages-container flex-grow-1 overflow-auto p-3">
        <Row className="g-0">
          <Col xs={12}>
            {messages.map((msg) => (
              <div key={msg.id} className={`message message-${msg.role} mb-4`}>
                {msg.role === 'system' ? (
                  <pre className="system-message">{msg.content}</pre>
                ) : (
                  <div className="d-flex align-items-start">
                    <div className="message-icon me-3">
                      {msg.role === 'user' ? (
                        <div className="user-icon">&gt;</div>
                      ) : (
                        <div className="assistant-icon">✻</div>
                      )}
                    </div>
                    <div className="message-content flex-grow-1">
                      <pre className="mb-0">{msg.content}</pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="message message-assistant d-flex align-items-start">
                <div className="message-icon me-3">
                  <div className="assistant-icon pulsing">✻</div>
                </div>
                <div className="message-content">
                  <span className="thinking">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </Col>
        </Row>
      </div>

      <div className="input-container border-top p-3">
        <Row className="g-0">
          <Col xs={12}>
            <InputGroup className="input-wrapper">
              <InputGroup.Text className="input-prompt border-0 bg-transparent">&gt;</InputGroup.Text>
              <Form.Control
                as="textarea"
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your schedule or request a meeting..."
                rows={1}
                disabled={isLoading}
                className="border-0 shadow-none bg-transparent"
              />
              <Button
                variant="link"
                className="send-button"
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
              >
                <Send size={14} />
              </Button>
            </InputGroup>
            <div className="input-hint d-flex justify-content-end mt-2 small opacity-75">
              <span className="me-3">↵ send</span>
              <span>⇧↵ newline</span>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default ChatInterface;