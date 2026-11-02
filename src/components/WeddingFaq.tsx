import React, { useState } from 'react';
import { ChevronDown, Sparkles, Shirt, Gift, Camera, HeartHandshake } from 'lucide-react';

export const WeddingFaq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      icon: <Shirt className="w-4 h-4 text-[#556B2F]" />,
      question: 'What is the dress code?',
      answer:
        'We invite our guests to wear Elegant Formal or Traditional Ceylon attire (lounge suits, formal evening wear, sarees, or smart batik). Since parts of the celebration will take place on the lakeside lawn at Wave Bolgoda, comfortable footwear or block heels are recommended.',
    },
    {
      icon: <Camera className="w-4 h-4 text-[#556B2F]" />,
      question: 'Is the wedding ceremony unplugged?',
      answer:
        'Yes, we kindly request an unplugged ceremony during our sunset vows by Bolgoda Lake. We invite you to be fully present with us as our professional photographers capture the sacred moments. You are welcome to take photos and videos during the reception to follow!',
    },
    {
      icon: <Gift className="w-4 h-4 text-[#556B2F]" />,
      question: 'What are your wishes regarding wedding gifts?',
      answer:
        'The greatest gift you can give us is your presence, love, and blessings on our special day. If you wish to bless us with a gift, a contribution towards our new beginning and home together would be warmly appreciated.',
    },
    {
      icon: <HeartHandshake className="w-4 h-4 text-[#556B2F]" />,
      question: 'Where can guests park?',
      answer:
        'Complimentary on-site guest parking with valet assistance is available directly inside Wave Bolgoda resort grounds along Rusigama Road.',
    },
  ];

  return (
    <section id="faq" className="py-20 px-4 bg-[#FAF8F3] border-t border-[#E8E4D8] text-[#2A2A2A]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[4px] text-[#556B2F] font-medium mb-1">
            Helpful Information
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#2A2A2A] mb-2">
            Wedding Details &amp; FAQ
          </h2>
          <div className="w-12 h-[1px] bg-[#C5A059] mx-auto" />
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="bg-white rounded-2xl border border-[#E8E4D8] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF8F3] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FAF8F3] border border-[#E8E4D8] flex items-center justify-center shrink-0">
                      {faq.icon}
                    </div>
                    <span className="font-medium text-sm text-[#2A2A2A]">{faq.question}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8A8A82] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#4A4A45] leading-relaxed border-t border-[#F2EEE4]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
