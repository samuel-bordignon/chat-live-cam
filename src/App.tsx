import { useState } from "react";
import { usePeer } from "./hooks/usePeer";

function App() {
   const { peerId, status, connectToPeer, sendData } = usePeer();
  const [remotePeerId, setRemotePeerId] = useState("");
  const [message, setMessage] = useState("");
  return (
    <div>
      <p>Seu ID: <strong>{peerId ?? "Carregando..."}</strong></p>
      <p>Status: {status}</p> 

      <div>
        <input
          placeholder="ID do peer remoto"
          value={remotePeerId}
          onChange={(e) => setRemotePeerId(e.target.value)}
        />
        <button onClick={() => connectToPeer(remotePeerId)}>Conectar</button>
      </div>

      {status === "connected" && (
        <div>
          <input
            placeholder="Mensagem"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={() => sendData(message)}>Enviar</button>
        </div>
      )}
    </div>
    
  )
}

export default App
