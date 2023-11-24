import type { FetchRecordsResponse } from '../types/recordTypes';

export async function fetchRecords(
  page: number,
  size: number,
  queryStartTime?: string | null,
  queryEndTime?: string | null
): Promise<FetchRecordsResponse> {
  try {
    const token = localStorage.getItem('token');

    let queryParams = `page=${page}&size=${size}`;
    if (queryStartTime) {
      queryParams += `&query_start_time=${encodeURIComponent(queryStartTime)}`;
    }
    if (queryEndTime) {
      queryParams += `&query_end_time=${encodeURIComponent(queryEndTime)}`;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/records?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return (await response.json()) as FetchRecordsResponse;
  } catch (error) {
    return Promise.reject(error);
  }
}
