import type {
  FetchTemplatesResponse,
  RecordTemplate,
} from '~/lib/types/recordTemplate';

export async function fetchPersonalTemplates(
  page: number,
  size: number
): Promise<FetchTemplatesResponse> {
  try {
    const token = localStorage.getItem('token');

    const queryParams = `page=${page}&size=${size}`;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/record-templates?${queryParams}`,
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

    return (await response.json()) as FetchTemplatesResponse;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function createPersonalTemplate(
  templateData: RecordTemplate
): Promise<RecordTemplate> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/record-templates`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          default_title: templateData.title,
          default_focus: templateData.focus,
          default_point: templateData.point,
          default_note: templateData.note,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Error creating the template');
    }

    return (await response.json()) as RecordTemplate;
  } catch (error) {
    return Promise.reject(error);
  }
}
