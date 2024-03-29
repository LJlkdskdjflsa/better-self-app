import type {
  ApplicantBoardModel,
  ApplicantModelNew,
} from '../models/applicantModel';

import { debug } from './logging';

export function formatData(response: ApplicantModelNew[]): ApplicantBoardModel {
  return response.reduce(
    (acc, applicant) => {
      // Check if application_status is null or undefined
      if (
        !applicant.application_status ||
        !applicant.application_status.value
      ) {
        debug(
          `Error: applicant.application_status is null for applicant ${JSON.stringify(
            applicant
          )}`
        );
        // Skip this iteration, effectively skipping the applicant
        return acc;
      }
      const statusValue = applicant.application_status.value;

      // If the statusValue key doesn't exist in the accumulator, initialize it
      if (!acc[statusValue]) {
        acc[statusValue] = [];
      }

      // Add the current applicant to the appropriate status category
      acc[statusValue].push(applicant);

      return acc;
    },
    {} as Record<string, ApplicantModelNew[]>
  );
}

export function unformatData(
  applicantBoardModel: ApplicantBoardModel
): ApplicantModelNew[] {
  // 使用 Object.values 獲取所有鍵的值（即所有分類下的申請人列表），然後使用 Array.prototype.reduce 將它們合併成一個單一的列表
  return Object.values(applicantBoardModel).reduce(
    (acc: ApplicantModelNew[], currentCategory: ApplicantModelNew[]) => {
      // 將當前分類下的申請人列表合併到累加器中
      return acc.concat(currentCategory);
    },
    []
  );
}
