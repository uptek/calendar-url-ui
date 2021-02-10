import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { stringify } from 'query-string';

dayjs.extend(utc);

export class CalanderLinkGenerator {
  static google(event) {
    const endDate = dayjs(event.endDate).utc().format('YYYYMMDD[T]HHmmss[Z]');
    const startDate = dayjs(event.startDate).utc().format('YYYYMMDD[T]HHmmss[Z]');

    const details = {
      action: 'TEMPLATE',
      text: event.title,
      details: event.description,
      location: event.location,
      trp: event.busy,
      dates: `${startDate}/${endDate}`,
    };

    if (event.guests && event.guests.length) {
      details.add = event.guests.join();
    }

    return `https://calendar.google.com/calendar/render?${stringify(details)}`;
  }

  static yahoo(event) {
    const endDate = dayjs(event.endDate).utc().format('YYYYMMDD[T]HHmmss[Z]');
    const startDate = dayjs(event.startDate).utc().format('YYYYMMDD[T]HHmmss[Z]');

    const details = {
      v: 60,
      title: event.title,
      st: startDate,
      et: endDate,
      desc: event.description,
      in_loc: event.location,
    };

    return `https://calendar.yahoo.com/?${stringify(details)}`;
  }

  static outlook(event) {
    const endDate = dayjs(event.endDate).utc().format('YYYY-MM-DD[T]HH:mm:ssZ');
    const startDate = dayjs(event.startDate).utc().format('YYYY-MM-DD[T]HH:mm:ssZ');

    const details = {
      path: "/calendar/action/compose",
      rru: "addevent",
      startdt: startDate,
      enddt: endDate,
      subject: event.title,
      body: event.description,
      location: event.location,
    };

    return `https://outlook.live.com/calendar/0/deeplink/compose?${stringify(details)}`;
  }

  static ics(event) {
    const endDate = dayjs(event.endDate).utc().format('YYYYMMDD[T]HHmmss[Z]');
    const startDate = dayjs(event.startDate).utc().format('YYYYMMDD[T]HHmmss[Z]');

    const formattedDescription = (event.description || "")
      .replace(/,/gm, ",")
      .replace(/;/gm, ";")
      .replace(/\n/gm, "\\n")
      .replace(/(\\n)[\s\t]+/gm, "\\n");

    const formattedLocation = (event.location || "")
      .replace(/,/gm, ",")
      .replace(/;/gm, ";")
      .replace(/\n/gm, "\\n")
      .replace(/(\\n)[\s\t]+/gm, "\\n");

    const calendarChunks = [
      {
        key: "BEGIN",
        value: "VCALENDAR",
      },
      {
        key: "VERSION",
        value: "2.0",
      },
      {
        key: "BEGIN",
        value: "VEVENT",
      },
      {
        key: "URL",
        value: event.url,
      },
      {
        key: "DTSTART",
        value: startDate,
      },
      {
        key: "DTEND",
        value: endDate,
      },
      {
        key: "SUMMARY",
        value: event.title,
      },
      {
        key: "DESCRIPTION",
        value: formattedDescription,
      },
      {
        key: "LOCATION",
        value: formattedLocation,
      },
      {
        key: "END",
        value: "VEVENT",
      },
      {
        key: "END",
        value: "VCALENDAR",
      },
    ];

    let calendarUrl = "";

    calendarChunks.forEach((chunk) => {
      if (chunk.value) {
        calendarUrl += `${chunk.key}:${encodeURIComponent(`${chunk.value}\n`)}`;
      }
    });

    return `data:text/calendar;charset=utf8,${calendarUrl}`;
  }
}

export default CalanderLinkGenerator;
