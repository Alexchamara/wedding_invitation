import React from 'react';
import { Calendar, Download, Share2, MapPin } from 'lucide-react';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';

interface CalendarCardProps {
  onScrollToVenues?: () => void;
  onScrollToRsvp?: () => void;
}

export const CalendarCard: React.FC<CalendarCardProps> = ({
  onScrollToVenues,
  onScrollToRsvp,
}) => {
  const googleCalUrl = generateGoogleCalendarUrl({
    title: 'Bumika & Achini · Wedding · Save the Date',
    details: 'Wedding of Bumika & Achini at Wave Bolgoda, Sri Lanka. Six o\'clock in the afternoon. Reception to follow.',
    location: 'Wave Bolgoda, Rusigama Road, Bolgoda Lake, Sri Lanka',
    startDateIso: '2026-11-10T18:00:00+05:30',
    endDateIso: '2026-11-10T23:30:00+05:30',
  });

  const handleDownloadIcs = () => {
    downloadIcsFile({
      title: 'Bumika & Achini Wedding · Wave Bolgoda',
      details: 'Wedding of Bumika & Achini at Wave Bolgoda, Sri Lanka. Six o\'clock in the afternoon. Reception to follow.',
      location: 'Wave Bolgoda, Rusigama Road, Bolgoda Lake, Sri Lanka',
      startDateIso: '2026-11-10T18:00:00+05:30',
      endDateIso: '2026-11-10T23:30:00+05:30',
      filename: 'bumika-achini-save-the-date',
    });
  };

  return (
    <section id="calendar-card" className="py-16 px-4 bg-[#F2EEE4] text-[#2A2A2A] relative overflow-hidden">
      <div className="max-w-xl mx-auto flex flex-col items-center">
        {/* Subtle section header */}
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[4px] text-[#556B2F] font-semibold mb-1">
            Official Save The Date
          </p>
          <h2 className="font-serif text-3xl font-light text-[#2A2A2A]">
            November 10, 2026
          </h2>
        </div>

        {/* The Exact Minimalist Wedding Invitation Card */}
        <div className="w-full bg-[#FAF7F2] rounded-2xl p-8 sm:p-14 shadow-xl border border-[#E8E2D5] flex flex-col items-center text-center relative select-none">
          {/* Subtle paper grain texture border */}
          <div className="absolute inset-2 border border-[#E8E2D5]/70 rounded-xl pointer-events-none" />

          {/* Month Header */}
          <div className="font-serif text-base sm:text-lg tracking-[8px] sm:tracking-[10px] uppercase text-[#1C1C1C] mb-8 font-normal">
            NOVEMBER
          </div>

          {/* Calendar Strip (Sat 07 to Fri 13) */}
          <div className="w-full max-w-sm mb-2">
            {/* Days of week row */}
            <div className="grid grid-cols-7 gap-1 text-[13px] sm:text-sm font-serif italic text-[#333333] mb-3">
              <div>Sat</div>
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
            </div>

            {/* Dates row */}
            <div className="grid grid-cols-7 gap-1 text-sm sm:text-base font-serif text-[#222222] items-center relative">
              <div className="py-2">07</div>
              <div className="py-2">08</div>
              <div className="py-2">09</div>

              {/* Tuesday 10 inside Dotted Heart */}
              <div className="relative py-2 flex flex-col items-center justify-center font-medium">
                {/* Dotted Heart Outline */}
                <svg
                  className="absolute -top-3 w-12 h-14 text-[#222222] pointer-events-none overflow-visible"
                  viewBox="0 0 44 48"
                  fill="none"
                >
                  <path
                    d="M 22 42 C 22 42 3 26 3 14 C 3 6.5 9 1.5 15.5 1.5 C 19 1.5 21.5 3.5 22 5 C 22.5 3.5 25 1.5 28.5 1.5 C 35 1.5 41 6.5 41 14 C 41 26 22 42 22 42 Z"
                    stroke="#1C1C1C"
                    strokeWidth="1.2"
                    strokeDasharray="2.5 2.5"
                  />
                </svg>
                <span className="relative z-10 font-serif text-base text-[#111111]">10</span>
              </div>

              <div className="py-2">11</div>
              <div className="py-2">12</div>
              <div className="py-2">13</div>
            </div>
          </div>

          {/* Dotted Pin Drop Line */}
          <div className="w-[1px] h-20 sm:h-24 border-r border-dotted border-[#222222] my-2" />

          {/* "save the date" Calligraphy */}
          <div className="font-script text-5xl sm:text-6xl text-[#1C1C1C] my-3 transform -rotate-1">
            save the date
          </div>

          {/* "FOR THE WEDDING OF" */}
          <div className="font-serif text-[11px] sm:text-xs tracking-[4px] uppercase text-[#444444] mt-6 mb-6 font-normal">
            FOR THE WEDDING OF
          </div>

          {/* Couple's Names: BUMIKA & ACHINI */}
          <h1 className="font-serif text-2xl sm:text-3xl tracking-[6px] sm:tracking-[8px] uppercase text-[#111111] font-normal mb-8">
            BUMIKA &amp; ACHINI
          </h1>

          {/* Date, Time & Venue */}
          <div className="space-y-2.5 font-serif text-xs sm:text-sm tracking-[3px] sm:tracking-[4px] uppercase text-[#222222]">
            <div>TUESDAY, NOVEMBER 10, 2026</div>
            <div className="text-[11px] sm:text-xs tracking-[3px] text-[#444444]">
              SIX O&apos;CLOCK IN THE AFTERNOON
            </div>
            <div className="font-medium text-[#111111] pt-1">
              WAVE BOLGODA
            </div>
          </div>

          {/* Reception note */}
          <div className="font-serif text-[11px] sm:text-xs tracking-[4px] uppercase text-[#333333] mt-10 pt-4 border-t border-[#E8E2D5]/80 w-3/4">
            RECEPTION TO FOLLOW
          </div>
        </div>

        {/* Card Quick Action Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <a
            href={googleCalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF8F3] text-[#2A2A2A] border border-[#E8E4D8] text-xs font-semibold uppercase tracking-wider transition-all shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5 text-[#556B2F]" />
            <span>Add to Google Calendar</span>
          </a>

          <button
            onClick={handleDownloadIcs}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF8F3] text-[#2A2A2A] border border-[#E8E4D8] text-xs font-semibold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#556B2F]" />
            <span>Save .ics Invite</span>
          </button>

          {onScrollToVenues && (
            <button
              onClick={onScrollToVenues}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#556B2F] hover:bg-[#3F5021] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Wave Bolgoda Details</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
