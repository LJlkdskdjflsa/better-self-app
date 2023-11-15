import { transferUtcTimestampToLocalTime } from "~/utils/timeUtils";

describe('transferUtcTimestampToLocalTime', () => {
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
});