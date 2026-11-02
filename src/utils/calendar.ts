// Calendar export helpers for Google Calendar & iCal (.ics)

export function generateGoogleCalendarUrl(event: {
  title: string;
  details: string;
  location: string;
  startDateIso: string; // e.g. 2026-07-28T17:00:00+05:30
  endDateIso: string;   // e.g. 2026-07-28T18:30:00+05:30
}): string {
  // Convert ISO string to UTC compact YYYYMMDDTHHMMSSZ format for Google Calendar
  const start = new Date(event.startDateIso).toISOString().replace(/-|:|\.\d\d\d/g, '');
  const end = new Date(event.endDateIso).toISOString().replace(/-|:|\.\d\d\d/g, '');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${start}/${end}`,
    details: event.details,
    location: event.location,
    sf: 'true',
    output: 'xml',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcsFile(event: {
  title: string;
  details: string;
  location: string;
  startDateIso: string;
  endDateIso: string;
  filename: string;
}) {
  const start = new Date(event.startDateIso).toISOString().replace(/-|:|\.\d\d\d/g, '');
  const end = new Date(event.endDateIso).toISOString().replace(/-|:|\.\d\d\d/g, '');
  const now = new Date().toISOString().replace(/-|:|\.\d\d\d/g, '');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Bumika & Achini Wedding//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:ba-wedding-${Date.now()}@wavebolgoda.wedding`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.details.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.location.replace(/,/g, '\\,')}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${event.filename}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
