import type { FetchRecordsResponse, Record } from '../../types/recordTypes';

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

/**
 * Fetches a record by its ID.
 * @param recordId - The ID of the record to fetch.
 * @returns The record data as a Promise.
 */
export async function fetchRecordById(recordId: string): Promise<Record> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/records/${recordId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error fetching the record');
    }

    return await response.json();
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function deleteRecord(
  recordId: string
): Promise<{ success: boolean }> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/records/${recordId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error deleting the record');
    }
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
