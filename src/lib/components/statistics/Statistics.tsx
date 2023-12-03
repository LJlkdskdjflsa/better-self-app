import {
  Button,
  Text,
  Flex,
  Spacer,
  useColorMode,
  Box,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import { fetchRecords } from '~/lib/services/api/record';
import type { Record } from '~/lib/types/recordTypes';
import { getDayDateRange } from '~/utils/timeUtils';

import { LineChartTooltip } from './LineChartTooltip';
import { PieChartTooltip } from './PieChartTooltip';

export default function Statistics() {
  const [records, setRecords] = useState<Record[]>([]);
  const { colorMode } = useColorMode();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const changeDate = (delta: number) => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + delta);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  useEffect(() => {
    const loadRecords = async () => {
      const date = new Date(selectedDate);
      const { startTime, endTime } = getDayDateRange(date);
      const response = await fetchRecords(1, 100, startTime, endTime); // Modify fetchRecords to accept startTime and endTime
      if (response && response.data) {
        setRecords(response.data);
      }
    };

    loadRecords();
  }, [selectedDate]);

  const pieChartDataArray = [
    ...records.map((record) => ({
      id: record.id,
      name: record.title,
      value: Math.max(
        0,
        new Date(record.end_time).getTime() -
          new Date(record.start_time).getTime()
      ),
      focus: record.focus,
      point: record.point,
      startTime: record.start_time,
      endTime: record.end_time,
    })),
  ].reverse();
  // Colors for Pie Chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div>
      <h2>Statistics</h2>
      <Box pt={5}>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </Box>

      {records.length > 0 ? (
        <>
          <PieChart width={400} height={400}>
            <Pie
              data={pieChartDataArray}
              cx={200}
              cy={200}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={(entry) => entry.name}
            >
              {pieChartDataArray.map((entry) => (
                <Cell
                  key={entry.id}
                  fill={
                    COLORS[pieChartDataArray.indexOf(entry) % COLORS.length]
                  }
                />
              ))}
            </Pie>
            <Tooltip content={<PieChartTooltip colorMode={colorMode} />} />
          </PieChart>
          <LineChart
            width={500}
            height={300}
            data={pieChartDataArray}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="created_at" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip content={<LineChartTooltip colorMode={colorMode} />} />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="focus"
              stroke="#8884d8"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="point"
              stroke="#82ca9d"
            />
          </LineChart>
        </>
      ) : (
        // Render a friendly message if there are no records
        <Flex
          justifyContent="center"
          alignItems="center"
          height="300px"
          borderWidth="1px"
          borderRadius="lg"
          p={4}
          borderColor="gray.200"
        >
          <Text fontSize="xl" color="gray.500">
            No data available for this day.
          </Text>
        </Flex>
      )}
      <Flex p={5}>
        <Button onClick={() => changeDate(-1)}>Previous Day</Button>
        <Spacer />
        <Button onClick={() => changeDate(1)}>Next Day</Button>
      </Flex>
    </div>
  );
}
