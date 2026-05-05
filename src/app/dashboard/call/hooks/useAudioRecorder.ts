"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface UseAudioRecorderProps {
  onChunkAvailable?: (blob: Blob) => void;
  timeslice?: number;
}

export const useAudioRecorder = ({ onChunkAvailable, timeslice = 2000 }: UseAudioRecorderProps = {}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
          onChunkAvailable?.(event.data);
        }
      };

      mediaRecorder.start(timeslice);
      setIsRecording(true);
      setElapsedSeconds(0);

      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      setError("Microphone permission denied or no audio device found.");
      console.error(err);
    }
  }, [onChunkAvailable, timeslice]);

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current;
      if (!mediaRecorder || mediaRecorder.state === "inactive") {
        resolve(null);
        return;
      }

      mediaRecorder.onstop = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsRecording(false);
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());

        const type = chunksRef.current.length > 0 ? chunksRef.current[0].type : "audio/webm";
        const fullAudioBlob = new Blob(chunksRef.current, { type });
        resolve(fullAudioBlob);
      };

      mediaRecorder.stop();
    });
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  return {
    startRecording,
    stopRecording,
    isRecording,
    elapsedSeconds,
    error,
  };
};
