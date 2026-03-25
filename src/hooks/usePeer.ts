import { useEffect, useState } from "react";
import Peer, { type DataConnection } from "peerjs";

type Status = "disconnected" | "ready" | "connected" | "error";

interface UsePeerReturn {
    peerId: string | null;
    peer: Peer | null;
    conn: DataConnection | null;
    status: Status;
    connectToPeer: (remotePeerId: string) => void;
    sendData: (data: unknown) => void;
}

export function usePeer(): UsePeerReturn {
    const [peerId, setPeerId] = useState<string | null>(null);
    const [peer, setPeer] = useState<Peer | null>(null);
    const [conn, setConn] = useState<DataConnection | null>(null);
    const [status, setStatus] = useState<Status>("disconnected");

    useEffect(() => {
        const newPeer = new Peer(); // ID gerado automaticamente

        // const newPeer = new Peer({   // <-- substitui o "new Peer()" sem argumentos pelo seguinte para usar um servidor PeerJS personalizado
        //     host: "seu-servidor.com",
        //     port: 9000,
        //     path: "/",
        //     key: "peerjs",
        // });

        newPeer.on("open", (id) => {
            setPeerId(id);
            setStatus("ready");
        });

        // Recebe conexões de outros peers
        newPeer.on("connection", (connection) => {
            setConn(connection);
            setStatus("connected");

            connection.on("data", (data: unknown) => {
                console.log("Dados recebidos:", data);
            });
        });

        newPeer.on("error", (err) => {
            console.error("Erro PeerJS:", err);
            setStatus("error");
        });

        setPeer(newPeer);

        return () => newPeer.destroy();
    }, []);

    // Conecta a outro peer
    const connectToPeer = (remotePeerId: string): void => {
        if (!peer) return;

        const connection = peer.connect(remotePeerId);

        connection.on("open", () => {
            setConn(connection);
            setStatus("connected");
        });

        connection.on("data", (data: unknown) => {
            console.log("Dados recebidos:", data);
        });
    };

    // Envia dados
    const sendData = (data: unknown): void => {
        if (conn && conn.open) {
            conn.send(data);
        }
    };

    return { peerId, peer, conn, status, connectToPeer, sendData };
}