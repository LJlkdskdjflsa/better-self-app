import type { ApplicantModelNew } from '../models/applicanModel';

// export interface ApplicantModel {
//   id: string;
//   title: string;
//   column: string;
//   color: string;
// }

export interface DragItem {
  index: number;
  id: ApplicantModelNew['id'];
  from: string;
}
