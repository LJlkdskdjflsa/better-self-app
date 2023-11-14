/**
 * Formats a time string into an ISO 8601 date-time string with the current date.
 * @param time - Time string in HH:mm format
 * @returns ISO 8601 date-time string
 */
export const formatDateAndTime = (time: string): string => {
  const currentDate = new Date();
  const [hours, minutes] = time.split(':');
  currentDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);

  return currentDate.toISOString();
};

/**
 * Gets the current local time in HH:mm format.
 * @returns Current local time as a string in HH:mm format
 */
export const getCurrentTime = () => {
  const date = new Date();
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
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
      return lastRecord.end_time.substring(11, 16); // Extracts the HH:mm part and returns it
    }
    return ''; // Return empty string or a default value if no record is found
  } catch (error) {
    return ''; // Return empty string or a default value in case of an error
  }
};
