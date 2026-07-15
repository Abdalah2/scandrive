import { useMemo, useState } from 'react';
import { Bot, X } from 'lucide-react';
import Button from './Button';
import Card from './Card';

const FAQ = [
  { question: 'Comment réserver un essai ?', answer: 'Ouvrez une fiche voiture, cliquez sur RDV et choisissez le type Essai routier.' },
  { question: 'Les QR codes marchent-ils ?', answer: 'Oui. Chaque voiture génère un QR code vers sa fiche publique.' },
  { question: 'Puis-je comparer des voitures ?', answer: 'Ajoutez jusqu’à 4 voitures au comparateur depuis la liste ou la fiche.' },
  { question: 'Les données sont-elles persistées ?', answer: 'Les favoris, la session et les RDV sont conservés en localStorage.' },
];

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = useMemo(() => FAQ[activeIndex] ?? FAQ[0], [activeIndex]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <Card className="mb-3 w-[min(22rem,calc(100vw-2rem))] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-brand-900">ScanDrive Assistant</p>
              <p className="text-xs text-slate-500">FAQ rapide et contexte de démo</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Fermer le chatbot" className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {FAQ.map((item, index) => (
              <button
                key={item.question}
                onClick={() => setActiveIndex(index)}
                className={`w-full rounded-2xl border px-3 py-2 text-left text-sm transition ${index === activeIndex ? 'border-brand-300 bg-brand-50' : 'border-slate-200 bg-white hover:border-brand-200'}`}
              >
                {item.question}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            {activeItem.answer}
          </div>
        </Card>
      ) : null}

      <Button variant="accent" className="gap-2" onClick={() => setOpen((value) => !value)}>
        <Bot className="h-4 w-4" />
        Chatbot FAQ
      </Button>
    </div>
  );
}