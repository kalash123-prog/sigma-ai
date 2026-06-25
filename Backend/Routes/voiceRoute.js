import express from "express";
import multer from "multer";
import { pipeline } from "@xenova/transformers";
import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import wavefilePkg from "wavefile";

const { WaveFile } = wavefilePkg;

ffmpeg.setFfmpegPath(ffmpegPath);

const router = express.Router();
const upload = multer({ dest: "uploads/" });

let transcriber = null;

async function getTranscriber() {
  if (!transcriber) {
    transcriber = await pipeline(
      "automatic-speech-recognition",
      "Xenova/whisper-base.en"
    );
  }
  return transcriber;
}

function convertToWav(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioFrequency(16000)
      .audioChannels(1)
      .format("wav")
      .on("end", resolve)
      .on("error", reject)
      .save(outputPath);
  });
}

router.post("/transcribe", upload.single("audio"), async (req, res) => {
  const inputPath = req.file.path;
  const wavPath = inputPath + ".wav";

  try {
    await convertToWav(inputPath, wavPath);

    const wavBuffer = fs.readFileSync(wavPath);
    const wav = new WaveFile(wavBuffer);
    wav.toBitDepth("32f");
    const audioData = wav.getSamples(false, Float32Array);

    const model = await getTranscriber();
    const output = await model(audioData);

    res.json({ text: output.text });
  } catch (err) {
    console.error("Transcription error:", err.message);
    res.status(500).json({ error: "Transcription failed" });
  } finally {
    fs.unlink(inputPath, () => {});
    fs.unlink(wavPath, () => {});
  }
});

export default router;