import type { ColumnType } from './enums';

export interface ApplicantModel {
  id: string;
  title: string;
  column: ColumnType;
  color: string;
}

export interface DragItem {
  index: number;
  id: ApplicantModel['id'];
  from: ColumnType;
}
