const myVideo = document.getElementById("my-video");
const remoteVideo = document.getElementById("remote-video");
const myIdSpan = document.getElementById("my-id");
const peerIdInput = document.getElementById("peer-id-input");
const callBtn = document.getElementById("call-btn");
const endBtn = document.getElementById("end-btn");
const micBtn = document.getElementById("toggle-mic");
const camBtn = document.getElementById("toggle-cam");

let localStream;
let currentCall;

// PeerJS connection
const peer = new Peer(undefined, {
  host: location.hostname,
  port: location.port || (location.protocol === "https:" ? 443 : 80),
  path: "/peerjs",
  secure: location.protocol === "https:",
});


navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then((stream) => {
    localStream = stream;
    myVideo.srcObject = stream;

    peer.on("call", (call) => {
      call.answer(localStream);
      currentCall = call;

      call.on("stream", (remoteStream) => {
        remoteVideo.srcObject = remoteStream;
      });

      call.on("close", () => {
        remoteVideo.srcObject = null;
      });
    });
  })
  .catch((err) => {
    alert("Failed to access media: " + err);
  });

peer.on("open", (id) => {
  myIdSpan.textContent = id;
});

callBtn.addEventListener("click", () => {
  const peerId = peerIdInput.value.trim();
  if (!peerId) return alert("Enter a valid peer ID");

  const call = peer.call(peerId, localStream);
  currentCall = call;

  call.on("stream", (remoteStream) => {
    remoteVideo.srcObject = remoteStream;
  });

  call.on("close", () => {
    remoteVideo.srcObject = null;
  });
});

endBtn.addEventListener("click", () => {
  if (currentCall) {
    currentCall.close();
    remoteVideo.srcObject = null;
  }
});

micBtn.addEventListener("click", () => {
  const audioTrack = localStream.getAudioTracks()[0];
  audioTrack.enabled = !audioTrack.enabled;
  micBtn.textContent = audioTrack.enabled ? "🎙️ Mute" : "🔇 Unmute";
});

camBtn.addEventListener("click", () => {
  const videoTrack = localStream.getVideoTracks()[0];
  videoTrack.enabled = !videoTrack.enabled;
  camBtn.textContent = videoTrack.enabled ? "📷 Off" : "📷 On";
});
