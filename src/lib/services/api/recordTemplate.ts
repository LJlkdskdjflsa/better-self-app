import type {
  FetchTemplatesResponse,
  CreateRecordTemplateRequest,
  UpdateRecordTemplateRequest,
  CreateRecordTemplateRequestNew,
} from '~/lib/types/recordTemplate';

import { makeRequest } from './api';

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
  templateData: CreateRecordTemplateRequestNew
): Promise<CreateRecordTemplateRequest> {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/record-templates`;
    const body: UpdateRecordTemplateRequest = {
      default_title: templateData.title,
      default_focus: templateData.focus,
      default_point: templateData.point,
      default_note: templateData.note || '',
    };

    return await makeRequest<
      CreateRecordTemplateRequest,
      UpdateRecordTemplateRequest
    >(url, 'POST', body);
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Updates a personal record template.
 * @param templateId - The ID of the template to update.
 * @param updatedTemplate - The updated template data.
 * @returns The updated template data as a Promise.
 */
export async function updatePersonalTemplate(
  templateId: string,
  updatedTemplate: CreateRecordTemplateRequest
): Promise<CreateRecordTemplateRequest> {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/record-templates/${templateId}`;
    const body: UpdateRecordTemplateRequest = {
      default_title: updatedTemplate.title,
      default_focus: updatedTemplate.focus,
      default_point: updatedTemplate.point,
      default_note: updatedTemplate.note || '',
    };

    return await makeRequest<
      CreateRecordTemplateRequest,
      UpdateRecordTemplateRequest
    >(url, 'PUT', body);
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Deletes a personal record template.
 * @param templateId - The ID of the template to delete.
 * @returns A promise that resolves to a message indicating the template was deleted.
 */
export async function deletePersonalTemplate(
  templateId: string
): Promise<{ message: string }> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/record-templates/${templateId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error deleting the template');
    }

    return (await response.json()) as { message: string };
  } catch (error) {
    return Promise.reject(error);
  }
}
