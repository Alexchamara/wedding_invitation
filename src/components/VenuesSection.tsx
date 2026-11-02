import React from 'react';
import { MapPin, Calendar, Clock, ExternalLink, Download } from 'lucide-react';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';

export const VenuesSection: React.FC = () => {
  const venues = [
    {
      id: 'ceremony',
      stepNum: '01 / Ceremony',
      time: '6:00 PM',
      date: 'Tuesday, 10 November 2026',
      title: 'Home Coming',
      venueName: 'Wave Bolgoda',
      address: 'Lakeside Lawn & Sanctuary, Rusigama Road',
      cityPostal: 'Bolgoda Lake, Moratuwa / Bandaragama, Sri Lanka',
      mapUrl: 'https://maps.google.com/?q=Wave+Bolgoda+Resort+Sri+Lanka',
      startDateIso: '2026-11-10T18:00:00+05:30',
      endDateIso: '2026-11-10T19:30:00+05:30',
      description: 'Home Coming of Bumika & Achini at Wave Bolgoda by the serene Bolgoda Lake.',
      badgeColor: 'bg-[#556B2F] text-white',
    },
  ];

  return (
    <section id="venues" className="py-24 px-4 bg-[#FAF8F3] text-[#2A2A2A] relative">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[4px] text-[#556B2F] font-medium mb-2">
            The Day Of
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#2A2A2A] mb-4">
            Ceremony &amp; Reception
          </h2>
          <div className="w-16 h-[1px] bg-[#C5A059] mx-auto mb-4" />
          <p className="font-serif text-base sm:text-lg italic text-[#4A4A45] max-w-lg mx-auto">
            We invite you to join us for our lakeside vows and dinner celebration at Wave Bolgoda.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {venues.map((venue) => {
            const googleCalUrl = generateGoogleCalendarUrl({
              title: `Bumika & Achini · ${venue.title}`,
              details: venue.description,
              location: `${venue.venueName}, ${venue.address}, ${venue.cityPostal}`,
              startDateIso: venue.startDateIso,
              endDateIso: venue.endDateIso,
            });

            return (
              <div
                key={venue.id}
                className="relative overflow-hidden rounded-3xl p-8 sm:p-12 border border-[#C5A059]/40 shadow-2xl flex flex-col justify-between group text-white bg-gradient-to-br from-[#3F5021] via-[#556B2F] to-[#2F3D18]"
              >
                <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#C5A059]/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-28 -left-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
                <div className="pointer-events-none absolute inset-3 rounded-2xl border border-[#C5A059]/30" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[11px] font-semibold uppercase tracking-[3px] text-[#E6CF9A]">
                      {venue.stepNum}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-white/15 text-white backdrop-blur-sm font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{venue.time}</span>
                    </span>
                  </div>

                  <h3 className="font-serif text-4xl sm:text-5xl font-light text-white mb-2">
                    {venue.title}
                  </h3>

                  <div className="text-sm font-medium text-[#E6CF9A] mb-6">
                    {venue.date}
                  </div>

                  <div className="space-y-2 mb-8 text-white/80">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-1" />
                      <div>
                        <div className="font-medium text-white">{venue.venueName}</div>
                        <div className="text-xs text-white/60">{venue.address}</div>
                        <div className="text-xs text-white/60">{venue.cityPostal}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative space-y-3 pt-6 border-t border-white/20">
                  <a
                    href={venue.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-[#F2EEE4] text-[#3F5021] text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View on Google Maps</span>
                  </a>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={googleCalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/25 text-[11px] font-medium transition-colors"
                    >
                      <Calendar className="w-3 h-3 text-[#E6CF9A]" />
                      <span>Google Cal</span>
                    </a>

                    <button
                      onClick={() =>
                        downloadIcsFile({
                          title: `Bumika & Achini · ${venue.title}`,
                          details: venue.description,
                          location: `${venue.venueName}, ${venue.address}, ${venue.cityPostal}`,
                          startDateIso: venue.startDateIso,
                          endDateIso: venue.endDateIso,
                          filename: `bumika-achini-${venue.id}`,
                        })
                      }
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/25 text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      <Download className="w-3 h-3 text-[#E6CF9A]" />
                      <span>Download .ics</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
