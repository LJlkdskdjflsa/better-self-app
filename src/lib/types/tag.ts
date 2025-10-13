// Tag entity type definitions

export interface Tag {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
}

export interface TagCreateRequest {
  name: string;
}

export interface TagUpdateRequest {
  name: string;
}
