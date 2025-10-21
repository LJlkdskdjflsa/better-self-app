'use client';

import { useColorMode } from '@chakra-ui/react';
import { useCallback } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

import { formatDuration } from '~/lib/utils/durationUtils';
import type { TagTimeAllocation } from '~/types/statistics';

interface TagPieChartProps {
  data: TagTimeAllocation[];
  onTagClick: (tag: TagTimeAllocation) => void;
}

/**
 * Pie chart visualization for tag time allocation
 * Implements FR-004 (pie chart), FR-014 (duration format), FR-015 (theme support)
 * Source: research.md section 4, quickstart.md section 3.3
 */
export default function TagPieChart({ data, onTagClick }: TagPieChartProps) {
  const { colorMode } = useColorMode();

  const chartData = data.map((tag) => ({
    name: tag.tagName,
    value: tag.totalDuration,
    fill: tag.tagColor || '#888888',
    tag,
  }));

  // Memoized tooltip renderer to avoid nested component issues
  const renderTooltip = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (props: any) => {
      const { payload } = props;
      if (!payload || payload.length === 0) return null;
      const tooltipData = payload[0].payload;
      return (
        <div
          style={{
            background: colorMode === 'dark' ? '#2D3748' : '#fff',
            padding: '8px 12px',
            border: '1px solid #E2E8F0',
            borderRadius: '4px',
          }}
        >
          <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            {tooltipData.name}
          </p>
          <p style={{ fontSize: '14px' }}>
            {formatDuration(tooltipData.value)}
          </p>
          <p style={{ fontSize: '12px', color: '#718096' }}>
            {tooltipData.tag.recordCount} records
          </p>
        </div>
      );
    },
    [colorMode]
  );

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
          label={(entry) =>
            `${entry.name} (${entry.tag.percentage.toFixed(1)}%)`
          }
          onClick={(clickData) => onTagClick(clickData.tag)}
        >
          {chartData.map((entry) => (
            <Cell key={entry.tag.tagId} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip content={renderTooltip} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
