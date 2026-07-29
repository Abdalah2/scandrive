import { useMemo, useState } from 'react';
import { Bot, X, Search } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import Button from './Button';
import Card from './Card';

export default function ChatbotWidget() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const faqItems = useMemo(
    () => [
      { question: t.faq1Question, answer: t.faq1Answer },
      { question: t.faq2Question, answer: t.faq2Answer },
      { question: t.faq3Question, answer: t.faq3Answer },
      { question: t.faq4Question, answer: t.faq4Answer },
    ],
    [t],
  );

  const filteredFaqs = useMemo(() => {
    if (!query.trim()) {
      return faqItems;
    }

    const normalized = query.toLowerCase();
    return faqItems.filter((item) =>
      [item.question, item.answer].some((text) => text.toLowerCase().includes(normalized)),
    );
  }, [faqItems, query]);

  const activeItem = useMemo(() => filteredFaqs[activeIndex] ?? filteredFaqs[0] ?? faqItems[0], [filteredFaqs, activeIndex, faqItems]);

  const handleOpen = () => {
    setOpen((value) => !value);
    setQuery('');
    setActiveIndex(0);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <Card className="mb-3 w-[min(24rem,calc(100vw-2rem))] p-4 shadow-2xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-brand-900">{t.chatbotTitle}</p>
              <p className="text-xs text-slate-500">{t.chatbotSubtitle}</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label={t.chatbotCloseAria} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              placeholder={t.chatbotSearchPlaceholder}
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="mt-4 space-y-2">
            {filteredFaqs.length ? (
              filteredFaqs.map((item, index) => (
                <button
                  key={item.question}
                  onClick={() => setActiveIndex(index)}
                  className={`w-full rounded-2xl border px-3 py-2 text-left text-sm transition ${index === activeIndex ? 'border-brand-300 bg-brand-50' : 'border-slate-200 bg-white hover:border-brand-200'}`}
                >
                  {item.question}
                </button>
              ))
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                {t.chatbotNoResults}
              </div>
            )}
          </div>

          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            {activeItem.answer}
          </div>

          <div className="mt-4 text-xs text-slate-500">{t.chatbotHint}</div>
        </Card>
      ) : null}

      <Button variant="accent" className="gap-2" onClick={handleOpen}>
        <Bot className="h-4 w-4" />
        {open ? t.chatbotCloseLabel : t.chatbotOpenLabel}
      </Button>
    </div>
  );
}
