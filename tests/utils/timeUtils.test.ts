import { getTodayDateRange, transferUtcTimestampToLocalTime } from "~/utils/timeUtils";
import timezoneMock from 'timezone-mock';

describe('transferUtcTimestampToLocalTime', () => {
    beforeAll(() => {
        // timezoneMock.register('Etc/GMT+8'); // Set the time zone to UTC+8 for testing
    });

    afterAll(() => {
        timezoneMock.unregister();
    });


    it('should correctly convert a UTC timestamp to local time', () => {
        const timestamp = '2022-01-01T00:00:00Z'; // This is midnight UTC on 2022-01-01
        const expectedLocalTime = new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
        console.log(expectedLocalTime);

        const result = transferUtcTimestampToLocalTime(timestamp);

        expect(result).toEqual(expectedLocalTime);
    });

    it('should correctly convert a UTC timestamp to local time', () => {
        // const timestamp = '2023-11-15T15:15:00.614000';
        const timestamp = '2023-11-15T15:15:00.614000Z';
        const result = transferUtcTimestampToLocalTime(timestamp);

        expect(result).toEqual("23:15");
    });

    it('when input hour=24, return must be hour=00', () => {

        const timestamp = '2023-11-15T16:15:00.614000Z';
        const result = transferUtcTimestampToLocalTime(timestamp);

        expect(result).toEqual("00:15");
    });
});

const mockDate = new Date('2023-11-22T12:00:00Z');
jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

describe('getTodayDateRange', () => {
  it('should return start and end times for the current day', () => {
    const { startTime, endTime } = getTodayDateRange();

    // Expected start and end times for the mocked date
    const expectedStartTime = new Date(mockDate);
    expectedStartTime.setHours(0, 0, 0, 0);
    const expectedEndTime = new Date(mockDate);
    expectedEndTime.setHours(23, 59, 59, 999);

    expect(startTime).toEqual(expectedStartTime.toISOString());
    expect(endTime).toEqual(expectedEndTime.toISOString());
  });
});