
import type {Message} from "../types.ts"

import { Container, Stack, Card } from 'react-bootstrap';


export default function ChatBubble({msg} :{msg : Message}){

  const role = {
    "system" : "system",
    "user" : "incoming",
    "ai" : "outgoing"
  }[msg.role];

  // Some preferences
  const bubbleAlignment = "justify-content-" + {
    "system":   "center", 
    "incoming": "start",
    "outgoing": "end"
  }[role]
  const bubbleBackground = "bg-"+{
    "system": "info",
    "incoming": "secondary",
    "outgoing": "primary"
  }[role]
  const bubbleRadius = {
    system: '18px 18px 18px 18px',
    incoming: '18px 18px 18px 2px',
    outgoing: '18px 18px 2px 18px'
  }[role]

  return(
    <div className={`d-flex align-items-end ${bubbleAlignment}`} key={msg.id}>
      <div className="me-3 justify-content-center">
        {msg.role === 'user' ? (
          <div className="user-icon">&gt;</div>
        ) : (
          <div className="assistant-icon">✻</div>
        )}
      </div>
      <div className={`background ${bubbleBackground}  flex-grow-1 justify-content-center`} style={{ borderRadius: bubbleRadius, maxWidth: '60%' }}>
        <pre className="mb-0 p-2">{msg.content}</pre>
      </div>
      {role === "outgoing" && (<div className="me-4"></div>)}
    </div>   
  )
}