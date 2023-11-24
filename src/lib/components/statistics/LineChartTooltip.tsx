import type { TooltipProps } from 'recharts';

import { transferUtcTimestampToLocalTime } from '~/utils/timeUtils';

export const LineChartTooltip: React.FC<
  TooltipProps<number, string> & { colorMode: string }
> = ({ active, payload, colorMode }) => {
  const textColor = colorMode === 'light' ? '#000' : '#fff'; // Adjust colors as needed
  const backgroundColor = colorMode === 'light' ? '#fff' : '#000'; // Adjust colors as needed

  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor,
          padding: '5px',
          border: '1px solid #cccccc',
          color: textColor,
        }}
      >
        <p className="label">{`Title: ${payload[0].payload.name}`}</p>
        <p>{`Focus: ${payload[0].payload.focus}`}</p>
        <p>{`Point: ${payload[0].payload.point}`}</p>
        <p>{`Start Time: ${transferUtcTimestampToLocalTime(
          payload[0].payload.startTime
        )}`}</p>
      </div>
    );
  }

  return null;
};
