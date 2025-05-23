import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
// Checkbox might be needed later if we add more options, for now, it's not used directly in the requirements.
// import { Checkbox } from './ui/checkbox'; 

export function BulkWhatsAppDialog({ isOpen, onClose, selectedLeads, onSubmit }) {
  const [message, setMessage] = useState('');

  const handleSendMessages = () => {
    if (onSubmit) {
      onSubmit(message, selectedLeads);
    }
    onClose(); // Close the dialog after submitting
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enviar Mensajes de WhatsApp en Lote</DialogTitle>
          <DialogDescription>
            Redacta el mensaje que se enviará a los leads seleccionados.
            Actualmente tienes {selectedLeads.length} lead(s) seleccionado(s).
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 items-center gap-4">
            <Textarea
              id="message"
              placeholder="Escribe tu mensaje aquí. Puedes usar {nombre} para personalizar."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="col-span-3"
              rows={5}
            />
          </div>
          {/* 
            Future enhancement: Display lead names and numbers here if needed.
            For now, only the count is displayed in DialogDescription.
            <div>
              <h4 className="font-medium">Leads Seleccionados:</h4>
              <ul>
                {selectedLeads.map(lead => (
                  <li key={lead.id}>{lead.name} ({lead.phone})</li>
                ))}
              </ul>
            </div>
          */}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSendMessages} disabled={!message.trim() || selectedLeads.length === 0}>
            Enviar Mensajes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
