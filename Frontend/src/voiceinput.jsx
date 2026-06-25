import { useState, useRef, useContext } from "react";
import Mycontext from "./Mycontext.jsx";
import axios from "axios";

function VoiceInput() {
  const { setprompt } = useContext(Mycontext);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        await sendAudio(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Please allow microphone access to use voice input.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const sendAudio = async (blob) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("audio", blob, "recording.webm");

    try {
      const res = await axios.post(
        "http://localhost:3000/api/voice/transcribe",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setprompt(res.data.text);
    } catch (err) {
      console.error("Voice transcription failed:", err);
      alert("Could not transcribe audio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      id="sigma-mic-btn"
      type="button"
      onClick={recording ? stopRecording : startRecording}
      disabled={loading}
      title={recording ? "Stop recording" : "Start recording"}
      style={{
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        background: recording ? "#e74c3c" : "#444",
        color: "white",
        border: "none",
        cursor: loading ? "not-allowed" : "pointer",
        fontSize: "16px",
        flexShrink: 0,
      }}
    >
      {loading ? "…" : recording ? "■" : "🎤"}
    </button>
  );
}

export default VoiceInput;