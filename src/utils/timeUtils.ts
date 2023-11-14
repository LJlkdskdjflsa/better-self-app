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
