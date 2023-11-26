import { formatDuration, intervalToDuration, parseISO } from 'date-fns';

/**
 * Formats a time string into an ISO 8601 date-time string with the current date.
 * @param time - Time string in HH:mm format
 * @returns ISO 8601 date-time string
 */
export const transferLocalTimeToUtcTimestamp = (time: string): string => {
  const currentDate = new Date();
  const [hours, minutes] = time.split(':');
  currentDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);

  return currentDate.toISOString();
};

/**
 * Converts a UTC timestamp into local time in HH:mm format.
 * If the hour is 24, it is set to 00.
 * @param timestamp - UTC timestamp
 * @returns Local time as a string in HH:mm format
 */
export const transferUtcTimestampToLocalTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  let hours = date.getHours();
  const minutes = date.getMinutes();

  // If the hour is 24, set it to 00
  if (hours === 24) {
    hours = 0;
  }

  // Pad the hours and minutes with leading zeros if necessary
  const hoursString = hours.toString().padStart(2, '0');
  const minutesString = minutes.toString().padStart(2, '0');

  return `${hoursString}:${minutesString}`;
};

/**
 * Gets the current local time in HH:mm format.
 * If the hour is 24, it is set to 00.
 * @returns Current local time as a string in HH:mm format
 */
export const getCurrentLocalTime = () => {
  const date = new Date();
  let hours = date.getHours();
  const minutes = date.getMinutes();

  // If the hour is 24, set it to 00
  if (hours === 24) {
    hours = 0;
  }

  // Pad the hours and minutes with leading zeros if necessary
  const hoursString = hours.toString().padStart(2, '0');
  const minutesString = minutes.toString().padStart(2, '0');

  return `${hoursString}:${minutesString}`;
};

export const fetchLastEndTime = async (token: string): Promise<string> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/records?page=1&size=1`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if (data && data.data && data.data.length > 0) {
      const lastRecord = data.data[0];
      return transferUtcTimestampToLocalTime(lastRecord.end_time);
    }
    return ''; // Return empty string or a default value if no record is found
  } catch (error) {
    return ''; // Return empty string or a default value in case of an error
  }
};

/**
 * Formats the time range between the start time and end time.
 * @param startTime - The start time of the range in ISO 8601 format.
 * @param endTime - The end time of the range in ISO 8601 format.
 * @returns The duration between start time and end time as a string in the format "X h Y m".
 */
export const formatTimeRange = (startTime: string, endTime: string) => {
  const start = parseISO(startTime);
  const end = parseISO(endTime);
  const duration = intervalToDuration({ start, end });

  return formatDuration(duration, {
    format: ['hours', 'minutes'],
    delimiter: ' ',
    zero: false,
    locale: {
      // Custom locale to override the format of duration parts
      formatDistance: (token, count) => {
        switch (token) {
          case 'xHours':
            return `${count} h`;
          case 'xMinutes':
            return `${count} m`;
          default:
            return `${count} ${token}`;
        }
      },
    },
  });
};

/**
 * Gets the start and end times for a specific day in ISO 8601 format.
 * The start time is set to 00:00:00.000 and the end time is set to 23:59:59.999.
 * @param date - The date for which to get the start and end times.
 * @returns An object with the start time and end time for the specified day.
 */
export const getDayDateRange = (date: Date | string) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0); // Set to start of the day

  const end = new Date(date);
  end.setHours(23, 59, 59, 999); // Set to end of the day

  // Format to an ISO string
  return {
    startTime: start.toISOString(),
    endTime: end.toISOString(),
  };
};

export const formatDurationToString = (duration: number) => {
  let seconds = Math.floor(duration / 1000);
  let minutes = Math.floor(seconds / 60);
  seconds %= 60;
  const hours = Math.floor(minutes / 60);
  minutes %= 60;
  return `${hours}h ${minutes}m ${seconds}s`;
};

export const formatDateTimeLocal = (dateTime: string) => {
  const date = new Date(dateTime);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
