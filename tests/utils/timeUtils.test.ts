import { transferUtcTimestampToLocalTime } from "~/utils/timeUtils";
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

