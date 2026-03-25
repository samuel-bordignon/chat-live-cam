import { MediaConnection } from "peerjs";

interface CallPeerParams {
  remotePeerId: string;
  peer: any;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
}

// Inicia chamada de vídeo
export const callPeer = async ({
  remotePeerId,
  peer,
  remoteVideoRef,
}: CallPeerParams): Promise<void> => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  const call: MediaConnection = peer.call(remotePeerId, stream);

  call.on("stream", (remoteStream: MediaStream) => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  });
};

// Recebe chamada
export const handleIncomingCall = (
  peer: any,
  remoteVideoRef: React.RefObject<HTMLVideoElement>
): void => {
  peer.on("call", async (call: MediaConnection) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    call.answer(stream);

    call.on("stream", (remoteStream: MediaStream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    });
  });
};