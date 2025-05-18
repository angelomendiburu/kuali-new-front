import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

export default function SendMailDialog({ open, onClose, lead, mode }) {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [preview, setPreview] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (open && lead) {
      fetch('http://localhost:3003/api/templates', { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          if (mode === 'whatsapp') {
            setTemplates(data.filter(t => t.type === 'whatsapp'));
          } else {
            setTemplates(data.filter(t => t.type === 'correo'));
          }
        });
      setSelectedTemplateId('');
      setPreview('');
    }
  }, [open, lead, mode]);

  useEffect(() => {
    if (selectedTemplateId && lead) {
      const tpl = templates.find(t => t.id === Number(selectedTemplateId));
      if (tpl) {
        // Simple reemplazo de variables
        let body = tpl.body.replace(/{{\s*nombre\s*}}/gi, lead.name || '');
        setPreview(body);
      } else {
        setPreview('');
      }
    } else {
      setPreview('');
    }
  }, [selectedTemplateId, templates, lead]);

  const handleSend = async () => {
    if (!selectedTemplateId) return;
    setSending(true);
    const tpl = templates.find(t => t.id === Number(selectedTemplateId));
    try {
      if (mode === 'whatsapp') {
        // Abrir WhatsApp Web con el mensaje y número del lead
        const phone = lead.phone ? lead.phone.replace(/[^0-9]/g, '') : '';
        const text = encodeURIComponent(preview.replace(/<[^>]+>/g, ''));
        if (phone) {
          window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
        } else {
          toast.error('El lead no tiene número de teléfono válido');
        }
        onClose();
      } else {
        await fetch('http://localhost:3003/api/templates/send-mail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            to: lead.email,
            subject: tpl.name,
            body: preview,
          })
        });
        toast.success('Correo enviado correctamente');
        onClose();
      }
    } catch (e) {
      toast.error('Error al enviar el mensaje');
    }
    setSending(false);
  };

  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'whatsapp' ? `Enviar WhatsApp a ${lead?.name}` : `Enviar correo a ${lead?.name}`}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Plantilla</label>
            <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
              <SelectTrigger>
                <SelectValue placeholder={mode === 'whatsapp' ? 'Selecciona una plantilla de WhatsApp' : 'Selecciona una plantilla de correo'} />
              </SelectTrigger>
              <SelectContent>
                {templates.map(tpl => (
                  <SelectItem key={tpl.id} value={String(tpl.id)}>{tpl.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {preview && (
            <div>
              <label className="block mb-1">Vista previa</label>
              <div className="border rounded p-3 bg-zinc-50 dark:bg-zinc-800" dangerouslySetInnerHTML={{ __html: preview }} />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={sending}>Cancelar</Button>
          <Button onClick={handleSend} disabled={!selectedTemplateId || sending}>
            {sending ? (mode === 'whatsapp' ? 'Enviando...' : 'Enviando...') : (mode === 'whatsapp' ? 'Enviar WhatsApp' : 'Enviar correo')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
