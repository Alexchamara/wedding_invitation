import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Check, Heart, Plus, Minus, Send, Share2, Copy, CheckCheck } from 'lucide-react';
import { RsvpData } from '../types/wedding';
import { weddingAudio } from '../utils/audio';

interface RsvpSectionProps {
  initialGuestName?: string;
  onCelebrationTrigger?: () => void;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({
  initialGuestName = '',
  onCelebrationTrigger,
}) => {
  const [name, setName] = useState(initialGuestName);
  const [attending, setAttending] = useState(true);
  const [guestsCount, setGuestsCount] = useState(1);
  const [mealPreference, setMealPreference] = useState<'standard' | 'vegetarian' | 'vegan' | 'other'>('standard');
  const [mealNote, setMealNote] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [storedRsvps, setStoredRsvps] = useState<RsvpData[]>([]);

  // Share link generator state
  const [customGuestToShare, setCustomGuestToShare] = useState('');
  const [hasCopiedShareLink, setHasCopiedShareLink] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newRsvp: RsvpData = {
      id: String(Date.now()),
      name: name.trim(),
      attending,
      guestsCount,
      mealPreference,
      mealNote: mealNote.trim() || undefined,
      message: message.trim() || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setStoredRsvps((prev) => [newRsvp, ...prev]);
    setIsSubmitted(true);

    // Audio chime & Confetti burst
    weddingAudio.playCelebrationChime();
    if (onCelebrationTrigger) onCelebrationTrigger();

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#556B2F', '#8A9A5B', '#D4AF37', '#F2EEE4'],
    });
  };

  const handleCopyCustomLink = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = customGuestToShare.trim()
      ? `${baseUrl}?n=${encodeURIComponent(customGuestToShare.trim())}`
      : baseUrl;

    navigator.clipboard.writeText(shareUrl).then(() => {
      setHasCopiedShareLink(true);
      setTimeout(() => setHasCopiedShareLink(false), 2500);
    });
  };

  return (
    <section id="rsvp" className="py-24 px-4 bg-[#F2EEE4] text-[#2A2A2A] relative">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-full border border-[#556B2F]/40 bg-[#FAF8F3] mx-auto mb-4 flex items-center justify-center">
            <span className="font-script text-xl text-[#3F5021]">B | A</span>
          </div>
          <p className="text-xs uppercase tracking-[4px] text-[#556B2F] font-medium mb-1">
            Kindly Respond
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#2A2A2A] mb-2">
            RSVP
          </h2>
          <p className="text-xs uppercase tracking-[2px] text-[#8A8A82]">
            Kindly respond by 15 October 2026
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8E4D8] shadow-md">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-[#556B2F]/10 text-[#556B2F] flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-3xl font-light text-[#2A2A2A] mb-3">
                Thank You, {name}!
              </h3>
              <p className="text-sm text-[#4A4A45] max-w-md mx-auto mb-6">
                {attending
                  ? "Your RSVP has been joyfully received. We can't wait to celebrate our special day with you at Wave Bolgoda!"
                  : "We are sorry you won't be able to celebrate in person, but your love and prayers mean the world to us."}
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-xs uppercase tracking-wider text-[#556B2F] hover:text-[#3F5021] font-semibold underline underline-offset-4 cursor-pointer"
              >
                Edit My Response
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#4A4A45] font-medium mb-2">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex & Family"
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E4D8] bg-[#FAF8F3] text-[#2A2A2A] focus:outline-none focus:border-[#556B2F] transition-colors"
                />
              </div>

              {/* Attendance */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#4A4A45] font-medium mb-2">
                  Will You Be Attending?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAttending(true)}
                    className={`py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all cursor-pointer ${
                      attending
                        ? 'bg-[#556B2F] border-[#3F5021] text-white shadow-sm'
                        : 'bg-[#FAF8F3] border-[#E8E4D8] text-[#4A4A45] hover:bg-[#F2EEE4]'
                    }`}
                  >
                    Happily Attending 🥂
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending(false)}
                    className={`py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all cursor-pointer ${
                      !attending
                        ? 'bg-[#3F5021] border-[#2A3616] text-white shadow-sm'
                        : 'bg-[#FAF8F3] border-[#E8E4D8] text-[#4A4A45] hover:bg-[#F2EEE4]'
                    }`}
                  >
                    Unable to Attend
                  </button>
                </div>
              </div>

              {/* Guest count (if attending) */}
              {attending && (
                <>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#4A4A45] font-medium mb-2">
                      Total Guests Attending
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setGuestsCount((c) => Math.max(1, c - 1))}
                        className="w-10 h-10 rounded-xl bg-[#FAF8F3] border border-[#E8E4D8] flex items-center justify-center text-[#2A2A2A] hover:bg-[#F2EEE4] cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-serif text-2xl font-light tabular-nums w-8 text-center">
                        {guestsCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => setGuestsCount((c) => Math.min(6, c + 1))}
                        className="w-10 h-10 rounded-xl bg-[#FAF8F3] border border-[#E8E4D8] flex items-center justify-center text-[#2A2A2A] hover:bg-[#F2EEE4] cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <span className="text-xs text-[#8A8A82]">
                        {guestsCount === 1 ? 'Guest' : 'Guests'}
                      </span>
                    </div>
                  </div>

                  {/* Meal Preferences */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#4A4A45] font-medium mb-2">
                      Meal Preference
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'standard', label: 'Standard' },
                        { id: 'vegetarian', label: 'Vegetarian' },
                        { id: 'vegan', label: 'Vegan' },
                        { id: 'other', label: 'Other' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setMealPreference(item.id as typeof mealPreference)}
                          className={`py-2 px-3 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                            mealPreference === item.id
                              ? 'bg-[#556B2F] text-white border-[#3F5021]'
                              : 'bg-[#FAF8F3] text-[#4A4A45] border-[#E8E4D8] hover:bg-[#F2EEE4]'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {mealPreference === 'other' && (
                      <input
                        type="text"
                        value={mealNote}
                        onChange={(e) => setMealNote(e.target.value)}
                        placeholder="Please note dietary restrictions (e.g., Gluten-free, Halal)"
                        className="mt-2.5 w-full px-4 py-2 text-xs rounded-xl border border-[#E8E4D8] bg-[#FAF8F3] text-[#2A2A2A] focus:outline-none focus:border-[#556B2F]"
                      />
                    )}
                  </div>
                </>
              )}

              {/* Message */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#4A4A45] font-medium mb-2">
                  Message for Bumika &amp; Achini (Optional)
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share a wish or blessing for the bride and groom..."
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E4D8] bg-[#FAF8F3] text-[#2A2A2A] focus:outline-none focus:border-[#556B2F] transition-colors"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-[#556B2F] hover:bg-[#3F5021] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>Send RSVP</span>
              </button>
            </form>
          )}
        </div>

        {/* Personalized Guest Link Sharing Tool for the Couple & Family */}
        <div className="mt-8 bg-white/70 rounded-2xl p-6 border border-[#E8E4D8] text-center">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#556B2F] font-semibold mb-2">
            <Share2 className="w-3.5 h-3.5" />
            <span>Generate Personalized Invitation Link</span>
          </div>
          <p className="text-xs text-[#8A8A82] mb-4">
            Create a custom link with your guest&apos;s name (e.g. &ldquo;Dear Alex&rdquo;) to send via WhatsApp or email.
          </p>

          <div className="flex items-center gap-2 max-w-md mx-auto">
            <input
              type="text"
              value={customGuestToShare}
              onChange={(e) => setCustomGuestToShare(e.target.value)}
              placeholder="Guest Name (e.g. Uncle David)"
              className="flex-1 px-3 py-2 text-xs rounded-lg border border-[#E8E4D8] bg-[#FAF8F3] text-[#2A2A2A] focus:outline-none focus:border-[#556B2F]"
            />
            <button
              onClick={handleCopyCustomLink}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#556B2F] hover:bg-[#3F5021] text-white text-xs font-medium cursor-pointer transition-colors"
            >
              {hasCopiedShareLink ? (
                <>
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Local messages wall preview if any messages sent */}
        {storedRsvps.length > 0 && (
          <div className="mt-8 space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-[#556B2F] font-semibold text-center">
              Recent Wishes from Guests
            </h4>
            {storedRsvps.slice(0, 3).map((r) => (
              <div key={r.id} className="p-4 rounded-xl bg-white border border-[#E8E4D8] text-xs">
                <div className="flex items-center justify-between font-semibold text-[#2A2A2A] mb-1">
                  <span>{r.name}</span>
                  <span className="text-[10px] text-[#8A8A82]">{r.timestamp}</span>
                </div>
                {r.message && <p className="italic text-[#4A4A45]">{r.message}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
