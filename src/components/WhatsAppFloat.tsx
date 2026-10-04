import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '+9176681 19521';
const WHATSAPP_MESSAGE = 'Hi, I would like to know more about your pooja services.';

export default function WhatsAppFloat() {
  const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <a href={link} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition-transform duration-200">
      <MessageCircle className="w-7 h-7" fill="white" strokeWidth={0} />
    </a>
  );
}