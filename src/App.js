import { useState } from 'react'

import minecraftAILogo from './minecraft_ai_assistant.png';
import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react"

function App() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am the Minecraft AI Assistant. How can I help you?",
      sender: "Minecraft Assistant",
      direction: "incoming"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    }

    const newMessages = [...messages, newMessage];

    // update messages state
    setMessages(newMessages);

    // process message to API
    setIsTyping(true);
    await processMessageToAPI(newMessages, message);
  };

  async function processMessageToAPI(chatMessages,chatMessage) {
      // chatMessages { send: "user" or "ChatGPT", message: "message" }
      // Langflow request object
      // { input_value: "message", output_type: "chat", input_type: "chat" }

    let apiMessage = { question: chatMessage };

    console.log("MCW_URL=" + process.env.REACT_APP_MCW_URL)
    console.log("apiMessage" + apiMessage)
    console.log("body=" + JSON.stringify(apiMessage))
    
    await fetch(process.env.REACT_APP_MCW_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiMessage)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      // console.log(data.outputs[0].outputs[0].results.message.data.text);
      setMessages(
        [...chatMessages, {
          message: data.answer,
          sender: "Minecraft Assistant",
          direction: "incoming"
        }]
      );
      setIsTyping(false);
    });
  }

  return (
    <div classname="App">
      <div style={{ position: "relative", height: "600px", width: "700px"}}>
        <img src={minecraftAILogo} height="100" alt=""/>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior='smooth'
              typingIndicator={isTyping ? <TypingIndicator content="The Minecraft Assistant is typing..." /> : null}
            >
              {messages.map((message, mIndex) => {
                return <Message key={mIndex} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder='Type message here' onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default App;
