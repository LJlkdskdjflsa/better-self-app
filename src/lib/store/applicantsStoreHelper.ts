import type {
  ApplicantBoardModel,
  ApplicantModelNew,
} from '../components/dashboard/models/applicanModel';
import { unformatData } from '../components/dashboard/utils/formData';

export function getApplicantsFromStatus(
  applicantsInStatus: ApplicantBoardModel | null
): ApplicantModelNew[] {
  let applicantsList: ApplicantModelNew[] = [];
  if (applicantsInStatus) {
    applicantsList = unformatData(applicantsInStatus);
  }
  return applicantsList;
}
