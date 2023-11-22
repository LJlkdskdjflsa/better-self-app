import type { FetchRecordsResponse } from '../types/recordTypes';

export async function fetchRecords(
  page: number,
  size: number
): Promise<FetchRecordsResponse> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/records?page=${page}&size=${size}`,
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
