import type { ColumnType } from './enumUtils';

export interface ApplicantModel {
  id: string;
  name: string;
  column: ColumnType;
  color: string;
}
