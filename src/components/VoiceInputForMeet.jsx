import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { RiMicFill, RiMicOffFill, RiSendPlaneFill } from 'react-icons/ri';
import { toast } from 'sonner';

export function VoiceInputForMeet({ onMeetingDetailsExtracted, onTranscription }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleStartRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = async () => {
          setIsProcessing(true);
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' }); // o audio/wav, audio/mp3 dependiendo de lo que acepte tu backend/Whisper
          const audioFile = new File([audioBlob], "voice_command.webm", { type: 'audio/webm' });
          
          // Enviar al backend
          const formData = new FormData();
          formData.append('audio', audioFile);

          try {
            // Asegúrate de que la URL del backend sea correcta
            const response = await fetch('http://localhost:3004/api/voice/process-command', {
              method: 'POST',
              body: formData,
              // No necesitas 'Content-Type' aquí, FormData lo maneja.
              // 'credentials: 'include'' si tu backend lo requiere y está configurado para CORS
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Error al procesar el comando de voz');
            }

            const result = await response.json();
            toast.success('Comando de voz procesado.');
            if (onTranscription) {
              onTranscription(result.transcribedText);
            }
            if (onMeetingDetailsExtracted && result.meetingDetails) {
              onMeetingDetailsExtracted(result.meetingDetails);
            }
          } catch (error) {
            console.error("Error sending audio:", error);
            toast.error(error.message || 'Fallo al enviar el audio.');
          } finally {
            setIsProcessing(false);
            // Detener las pistas del stream para apagar el indicador del micrófono
            stream.getTracks().forEach(track => track.stop());
          }
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
        toast.info('Grabando... Habla ahora.');
      } catch (err) {
        console.error("Error accessing microphone:", err);
        toast.error('No se pudo acceder al micrófono. Verifica los permisos.');
      }
    } else {
      toast.error('La grabación de audio no es compatible con este navegador.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.info('Procesando grabación...');
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2 my-4">
      <Button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        variant={isRecording ? "destructive" : "outline"}
        size="lg"
        className="w-full max-w-xs"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <RiSendPlaneFill className="mr-2 h-5 w-5 animate-pulse" />
            Procesando...
          </>
        ) : isRecording ? (
          <>
            <RiMicOffFill className="mr-2 h-5 w-5" />
            Detener Grabación
          </>
        ) : (
          <>
            <RiMicFill className="mr-2 h-5 w-5" />
            Agendar por Voz
          </>
        )}
      </Button>
      {isRecording && <p className="text-sm text-muted-foreground">Grabando audio...</p>}
      {isProcessing && <p className="text-sm text-muted-foreground">Enviando y procesando audio...</p>}
    </div>
  );
}