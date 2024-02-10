// store/applicantsStore.js
import axios from 'axios';
import { create } from 'zustand';

import type {
  ApplicantBoardModel,
  ColumnType,
} from '../components/dashboard/models/applicanModel';
import {
  formatData,
  unformatData,
} from '../components/dashboard/utils/formData';
import { debug } from '../components/dashboard/utils/logging';

interface ApplicantsStoreState {
  applicants: ApplicantBoardModel | null;
  isLoading: boolean;
  fetchApplicants: () => Promise<void>;

  deleteApplicant: (applicantId: number) => Promise<void>;
  addNewApplicant: (
    applicant: {
      position: number;
      status_id: number;
      name: string;
    },
    afterOptimisticUpdate?: () => void
  ) => Promise<void>;
  // updateApplicantStatus 函数如果需要的话
  updateApplicantStatus: (
    applicantId: number,
    newStage: ColumnType
  ) => Promise<void>;
}

const POSITION_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/positionapps/`;
const HEADER_APPLICATION_JSON = 'application/json';

const useApplicantsStore = create<ApplicantsStoreState>((set, get) => ({
  applicants: null,
  isLoading: true,
  fetchApplicants: async () => {
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
      debug(`Failed to fetch applicants:${error}`);
      //   console.error('Failed to fetch applicants:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  addNewApplicant: async (
    applicant: {
      position: number;
      status_id: number;
      name: string;
    },
    afterOptimisticUpdate?: () => void
  ) => {
    // 樂觀更新本地狀態
    const applicantsData = get().applicants;
    // - 創建一個新的 applicant 物件
    // - 將其添加到 applicantsData
    // - 使用 set 更新 applicants

    // 關閉視窗
    if (afterOptimisticUpdate) {
      afterOptimisticUpdate();
    }

    try {
      const newApplicantData = await axios.post(
        POSITION_URL,
        {
          position_id: applicant.position,
          status_id: applicant.status_id,
          first_name: applicant.name,
          last_name: '',
          company: 'Fuhai',
          application_date: '2024-01-13',
          source: 'N/A',
        },
        {
          headers: {
            'Content-Type': HEADER_APPLICATION_JSON,
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      if (newApplicantData && applicantsData) {
        const updatedApplicants = [
          ...unformatData(applicantsData),
          newApplicantData.data.data,
        ];
        set({ applicants: formatData(updatedApplicants) });
      }
    } catch (error) {
      debug(`Failed to create applicant: ${error}`);
      // Handle error (e.g., display an error message)
    }
  },
  deleteApplicant: async (applicantId) => {
    try {
      await axios.delete(POSITION_URL, {
        headers: {
          'Content-Type': HEADER_APPLICATION_JSON,
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        data: {
          jobapp_id: applicantId,
        },
      });

      const applicantsData = get().applicants;
      if (applicantsData) {
        const updatedApplicants = unformatData(applicantsData).filter(
          (applicant) => applicant.id !== applicantId
        );
        set({ applicants: formatData(updatedApplicants) });
      }
    } catch (error) {
      debug(`Failed to delete applicant:${error}`);
      // 这里可以加入更多的错误处理逻辑，比如显示错误消息
    }
  },
  updateApplicantStatus: async (applicantId, newStage) => {
    // 樂觀更新本地狀態

    // - 使用 get 获取 applicants
    let applicantsAfterUpdate = unformatData(get().applicants);
    // - 找到 updatedApplicant
    const updatedApplicant = applicantsAfterUpdate.find(
      (applicant) => applicant.id === applicantId
    );

    const originalStage = updatedApplicant;

    // - 更新 updatedApplicant 的 status_id
    if (updatedApplicant) {
      updatedApplicant.application_status.id = newStage.id;
      updatedApplicant.application_status.value = newStage.value;
      updatedApplicant.application_status.pos = newStage.id;
    }

    // - 刪除本地的 applicantNeedUpdate
    applicantsAfterUpdate = applicantsAfterUpdate.filter(
      (applicant) => applicant.id !== applicantId
    );
    // - 添加 updatedApplicant 到本地
    if (updatedApplicant) {
      applicantsAfterUpdate.push(updatedApplicant);
    }
    // - 使用 set 更新 applicants
    set({ applicants: formatData(applicantsAfterUpdate) });
    // 更新 API
    try {
      const updateApplicantResult = await axios.put(
        POSITION_URL,
        {
          status_id: newStage.id, // 假设 API 需要 status_id 字段
        },
        {
          headers: {
            'Content-Type': HEADER_APPLICATION_JSON,
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      // if updateApplicantResult is not successful, we should rollback the local state
      if (!updateApplicantResult.data.success) {
        throw new Error('Failed to update applicant status');
      }
    } catch (error) {
      // 这里可以加入更多的错误处理逻辑，比如显示错误消息

      // 回滚本地状态
      // - 使用 get 获取 applicants
      let applicantsNeedRollback = unformatData(get().applicants);
      // - 找到 updatedApplicant
      const applicantNeedRollBack = applicantsNeedRollback.find(
        (applicant) => applicant.id === applicantId
      );
      // - 更新 updatedApplicant 的 status_id
      if (applicantNeedRollBack) {
        applicantNeedRollBack.application_status.id =
          originalStage?.application_status.id;
        applicantNeedRollBack.application_status.value =
          originalStage?.application_status.value;
        applicantNeedRollBack.application_status.pos =
          originalStage?.application_status.pos;
      }
      // - 移除 updatedApplicant
      applicantsNeedRollback = applicantsNeedRollback.filter(
        (applicant) => applicant.id !== applicantId
      );
      // - 把 applicantNeedRollBack 添加到 applicantsAfterUpdate
      applicantsNeedRollback.push(applicantNeedRollBack);

      // - 使用 set 更新 applicants
      set({ applicants: formatData(applicantsNeedRollback) });
    }
  },
}));

export default useApplicantsStore;
