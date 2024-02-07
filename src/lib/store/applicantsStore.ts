// store/applicantsStore.js
import axios from 'axios';
import { create } from 'zustand';

import type { ApplicantBoardModel } from '../components/dashboard/models/applicanModel';
import {
  formatData,
  unformatData,
} from '../components/dashboard/utils/formData';
import { debug } from '../components/dashboard/utils/logging';

interface ApplicantsStoreState {
  applicants: ApplicantBoardModel | null;
  isLoading: boolean;
  fetchApplicants: () => Promise<void>;
  deleteApplicant: (applicantId: string) => Promise<void>;
  // updateApplicantStatus 函数如果需要的话
  // updateApplicantStatus: (applicantId: string, newStage: ColumnType) => Promise<void>;
}

const useApplicantsStore = create<ApplicantsStoreState>((set, get) => ({
  applicants: null,
  isLoading: true,
  fetchApplicants: async () => {
    const POSITION_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/positionapps/`;
    set({ isLoading: true });
    try {
      const response = await axios.get(POSITION_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (response.data.success) {
        const formattedData = formatData(response.data.data);
        set({ applicants: formattedData });
      } else {
        throw new Error('Failed to fetch tasks');
      }
    } catch (error) {
      debug('Failed to fetch applicants:', error);
      //   console.error('Failed to fetch applicants:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  deleteApplicant: async (applicantId) => {
    const POSITION_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/positionapps/`; // 假设 API 需要 applicantId 来删除
    try {
      await axios.delete(POSITION_URL, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        data: {
          jobapp_id: applicantId,
        },
      });

      // 删除成功后，从本地状态移除该申请者
      const updatedApplicants = unformatData(get().applicants).filter(
        (applicant) => applicant.id !== applicantId
      );
      set({ applicants: formatData(updatedApplicants) });
    } catch (error) {
      debug('Failed to delete applicant:', error);
      // 这里可以加入更多的错误处理逻辑，比如显示错误消息
    }
  },
  // updateApplicantStatus: async (applicantId, newStage) => {
  //     const POSITION_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/positionapps/`; // 假设 API 需要 applicantId 来更新状态
  //     try {
  //         await axios.put(POSITION_URL, {
  //             status_id: newStage.id, // 假设 API 需要 status_id 字段
  //         }, {
  //             headers: {
  //                 'Content-Type': 'application/json',
  //                 Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  //             },
  //         });

  //         // 更新成功后，更新本地状态
  //         const applicants = unformatData(get().applicants);
  //         const applicantIndex = applicants.findIndex(applicant => applicant.id === applicantId);
  //         if (applicantIndex !== -1) {
  //             applicants[applicantIndex].application_status = newStage;
  //             set({ applicants: formatData(applicants) });
  //         }
  //     } catch (error) {
  //         console.error('Failed to update applicant status:', error);
  //         // 这里可以加入更多的错误处理逻辑，比如显示错误消息
  //     }
  // },
}));

export default useApplicantsStore;
