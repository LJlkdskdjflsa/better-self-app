import type { Tag, TagCreateRequest, TagUpdateRequest } from '~/lib/types/tag';

import { makeRequest } from './api';

/**
 * Fetch all tags for the authenticated user
 */
export async function fetchTags(): Promise<Tag[]> {
  return makeRequest<Tag[], never>(
    `${process.env.NEXT_PUBLIC_API_URL}/tags`,
    'GET'
  );
}

/**
 * Create a new tag
 */
export async function createTag(data: TagCreateRequest): Promise<Tag> {
  return makeRequest<Tag, TagCreateRequest>(
    `${process.env.NEXT_PUBLIC_API_URL}/tags`,
    'POST',
    data
  );
}

/**
 * Update an existing tag
 */
export async function updateTag(
  id: string,
  data: TagUpdateRequest
): Promise<Tag> {
  return makeRequest<Tag, TagUpdateRequest>(
    `${process.env.NEXT_PUBLIC_API_URL}/tags/${id}`,
    'PUT',
    data
  );
}

/**
 * Delete a tag
 */
export async function deleteTag(id: string): Promise<void> {
  return makeRequest<void, never>(
    `${process.env.NEXT_PUBLIC_API_URL}/tags/${id}`,
    'DELETE'
  );
}
