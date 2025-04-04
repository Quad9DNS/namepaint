import { Settings } from "./settings";

/**
  * Updates dateTimeDisplayElement with currentTime - formatted in DD-MM-YYYY HH:MM:SS format
  *
  * @param dateTimeDisplayElement element to render the date time in
  * @param currentTime reference time to render
  * @param settings Settings container which is used for fetching selected time zone
  */
export function updateDate(
  dateTimeDisplayElement: HTMLElement,
  currentTime: Date,
  settings: Settings
) {

  var format = Intl.DateTimeFormat('default',
    {
      timeZone: settings.timeZone,
      timeZoneName: 'longOffset',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour12: false,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    })
  var parts = format.formatToParts(currentTime);

  var parsedParts = {
    year: "0000",
    month: "00",
    day: "00",
    hour: "00",
    minute: "00",
    second: "00",
    offset: "+00:00"
  };

  for (var part of parts) {
    switch (part.type) {
      case 'year':
        parsedParts.year = part.value;
        break;
      case 'month':
        parsedParts.month = part.value.padStart(2, '0');
        break;
      case 'day':
        parsedParts.day = part.value.padStart(2, '0');
        break;
      case 'hour':
        parsedParts.hour = part.value.padStart(2, '0');
        break;
      case 'minute':
        parsedParts.minute = part.value.padStart(2, '0');
        break;
      case 'second':
        parsedParts.second = part.value.padStart(2, '0');
        break;
      case 'timeZoneName':
        if (part.value.includes("+") || part.value.includes("-")) {
          parsedParts.offset = part.value.replace('GMT', '');
        } else {
          parsedParts.offset = part.value.replace('GMT', '+00:00');
        }
        break;
      default:
        break;
    }

  }

  dateTimeDisplayElement.hidden = !settings.showDateAndTime;
  dateTimeDisplayElement.innerHTML = `${parsedParts.year}-${parsedParts.month}-${parsedParts.day} ${parsedParts.hour}:${parsedParts.minute}:${parsedParts.second} ${parsedParts.offset}`;
}
