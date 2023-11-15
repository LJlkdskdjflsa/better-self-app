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

export const fetchLastEndTime = async (): Promise<string> => {
  try {
    const response = await fetch(
      'https://heavyweight-fastapi-production-1c7c.up.railway.app/records?page=1&size=1',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if (data && data.data && data.data.length > 0) {
      const lastRecord = data.data[0];
      // console.log(lastRecord);
      return transferUtcTimestampToLocalTime(lastRecord.end_time);
    }
    return ''; // Return empty string or a default value if no record is found
  } catch (error) {
    return ''; // Return empty string or a default value in case of an error
  }
};
