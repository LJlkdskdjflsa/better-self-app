import type { TooltipProps } from 'recharts';

const formatDuration = (duration: number) => {
  let seconds = Math.floor(duration / 1000);
  let minutes = Math.floor(seconds / 60);
  seconds %= 60;
  const hours = Math.floor(minutes / 60);
  minutes %= 60;
  return `${hours}h ${minutes}m ${seconds}s`;
};

export const PieChartTooltip: React.FC<
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
        <p className="label">{`${payload[0]?.name} : ${formatDuration(
          payload[0]?.value || 0
        )}`}</p>
      </div>
    );
  }

  return null;
};
