import type { ApplicantModelNew } from '../models/applicantModel';

export interface DragItem {
  index: number;
  id: ApplicantModelNew['id'];
  from: string;
}
