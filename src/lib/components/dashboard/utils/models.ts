export interface ApplicantModel {
  id: string;
  title: string;
  column: string;
  color: string;
}

export interface DragItem {
  index: number;
  id: ApplicantModel['id'];
  from: string;
}
