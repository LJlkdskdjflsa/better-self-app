import axios from 'axios';
import { create } from 'zustand';

import type {
  ApplicantBoardModel,
  ApplicantModelNew,
  ColumnType,
} from '../components/dashboard/models/applicantModel';
import {
  formatData,
  unformatData,
} from '../components/dashboard/utils/formData';
import { debug } from '../components/dashboard/utils/logging';

import { getApplicantsFromStatus } from './applicantsStoreHelper';

interface ApplicantsStoreState {
  applicants: ApplicantBoardModel | null;
  isLoading: boolean;
  getApplicantsFromApi: () => Promise<void>;

  deleteApplicant: (applicantId: number) => Promise<void>;
  addNewApplicant: (
    applicant: {
      position: number;
      status: ColumnType;
      name: string;
    },
    afterOptimisticUpdate?: () => void
  ) => Promise<void>;
  // updateApplicantStatus 函数如果需要的话
  updateApplicantStatus: (
    applicantId: number,
    newStage: ColumnType
  ) => Promise<void>;
  resetStore: () => void;
}

const POSITION_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/positionapps/`;
const HEADER_APPLICATION_JSON = 'application/json';

const useApplicantsStore = create<ApplicantsStoreState>((set, get) => ({
  applicants: null,
  isLoading: true,

  getApplicantsFromApi: async () => {
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
      status: ColumnType;
      name: string;
    },
    afterOptimisticUpdate?: () => void
  ) => {
    // Use the current date instead of a hardcoded date
    const applicantsData = get().applicants;
    const currentDate = new Date().toISOString();

    const tempNewApplicant: ApplicantModelNew = {
      id: 10000000,
      first_name: applicant.name,
      last_name: '',
      application_status: {
        id: applicant.status.id,
        value: applicant.status.value,
        icon: null,
        pos: applicant.status.id,
        rejectable: false,
        default: false,
      },
      position: {
        id: applicant.position,
        state: {
          id: 1,
          code: 'BDS',
          name: 'Badakhshān',
        },
        country: {
          id: 1,
          code2: 'AF',
          name: 'Afghanistan',
        },
        company: {
          id: 1,
          company: '讀取中',
          logo: '/media/8af3c0b7-6f12-4d54-8d64-5c49f40f28fb.png',
          domain: 'https://www.xrex.io',
          location_lat: null,
          location_lon: null,
          location_address: null,
          description: '讀取中',
          phone_number: null,
          employees_number: 50,
        },
        job: '讀取中',
        responsibilities: '讀取中',
        requirements: '讀取中',
        job_type: 'full-time',
        city: '讀取中',
        is_deleted: false,
        created_date: currentDate, // Use the current date and time in ISO format
        updated_date: currentDate, // Use the current date and time in ISO format
        department: '',
      },
      company_object: {
        id: 2,
        company: 'Fuhai',
        logo: '/media/8af3c0b7-6f12-4d54-8d64-5c49f40f28fb.png',
        domain: null,
        location_lat: null,
        location_lon: null,
        location_address: null,
        description: null,
        phone_number: null,
        employees_number: null,
      },
      apply_date: currentDate, // Use the current date
      is_rejected: false,
      email: null,
      phone_number: '',
      reference: null,
      column: 'temp_column', // temp, TODO: remove
    };
    const applicantsNeedAdd: ApplicantModelNew[] = getApplicantsFromStatus(
      get().applicants
    );
    // - 將其添加到 applicantsNeedAdd
    applicantsNeedAdd.push(tempNewApplicant);

    // - 使用 set 更新 applicants
    set({ applicants: formatData(applicantsNeedAdd) });

    // 關閉視窗
    if (afterOptimisticUpdate) {
      afterOptimisticUpdate();
    }

    try {
      const newApplicantData = await axios.post(
        POSITION_URL,
        {
          position_id: applicant.position,
          status_id: applicant.status.id,
          first_name: applicant.name,
          last_name: '',
          company: 'Fuhai',
          application_date: currentDate, // Use the current date
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
        let updatedApplicants = [
          ...unformatData(applicantsData),
          newApplicantData.data.data,
        ];

        // 回滾本地狀態
        updatedApplicants = updatedApplicants.filter(
          (tempApplicant) => tempApplicant.id !== tempNewApplicant.id
        );

        set({ applicants: formatData(updatedApplicants) });
      }
    } catch (error) {
      debug(`Failed to create applicant: ${error}`);
      // 回滾本地狀態
      let applicantNeedRollBack: ApplicantModelNew[] = getApplicantsFromStatus(
        get().applicants
      );
      applicantNeedRollBack = applicantNeedRollBack.filter(
        (tempApplicant) => tempApplicant.id !== tempNewApplicant.id
      );
      set({ applicants: formatData(applicantNeedRollBack) });
    }
  },
  deleteApplicant: async (applicantId) => {
    // 樂觀更新本地狀態
    let applicantsNeedDelete: ApplicantModelNew[] = getApplicantsFromStatus(
      get().applicants
    );
    // - 找到需要刪除的 applicant
    const applicantNeedDelete = applicantsNeedDelete.find(
      (applicant) => applicant.id === applicantId
    );
    applicantsNeedDelete = applicantsNeedDelete.filter(
      (applicant) => applicant.id !== applicantId
    );
    set({ applicants: formatData(applicantsNeedDelete) });

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
    } catch (error) {
      debug(`Failed to delete applicant:${error}`);
      // 回滚本地状态
      const applicantsNeedRollback: ApplicantModelNew[] =
        getApplicantsFromStatus(get().applicants);
      // - 添加需要刪除的 applicant
      if (applicantNeedDelete) {
        applicantsNeedRollback.push(applicantNeedDelete);
      }
      // - 使用 set 更新 applicants
      set({ applicants: formatData(applicantsNeedRollback) });
    }
  },
  updateApplicantStatus: async (applicantId, newStage) => {
    // 樂觀更新本地狀態

    let applicantsNeedUpdate: ApplicantModelNew[] = getApplicantsFromStatus(
      get().applicants
    );

    // - 找到 updatedApplicant
    const updatedApplicant = applicantsNeedUpdate.find(
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
    applicantsNeedUpdate = applicantsNeedUpdate.filter(
      (applicant) => applicant.id !== applicantId
    );
    // - 添加 updatedApplicant 到本地
    if (updatedApplicant) {
      applicantsNeedUpdate.push(updatedApplicant);
    }
    // - 使用 set 更新 applicants
    set({ applicants: formatData(applicantsNeedUpdate) });
    // 更新 API
    try {
      const updateApplicantResult = await axios.put(
        POSITION_URL,
        {
          status_id: newStage.id,
          jobapp_id: applicantId,
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
      // 回滚本地状态
      // - 使用 get 获取 applicants
      let applicantsNeedRollback: ApplicantModelNew[] = getApplicantsFromStatus(
        get().applicants
      );
      // - 找到 updatedApplicant
      const applicantNeedRollBack = applicantsNeedRollback.find(
        (applicant) => applicant.id === applicantId
      );
      // - 移除 updatedApplicant
      if (applicantNeedRollBack) {
        applicantsNeedRollback = applicantsNeedRollback.filter(
          (applicant) => applicant.id !== applicantId
        );
      }
      // - 更新 updatedApplicant 的 status_id
      if (applicantNeedRollBack) {
        applicantNeedRollBack.application_status.id =
          originalStage?.application_status.id ?? 1;
        applicantNeedRollBack.application_status.value =
          originalStage?.application_status.value ?? '';
        applicantNeedRollBack.application_status.pos =
          originalStage?.application_status.pos ?? 1;
      }
      // - 加入 updatedApplicant
      if (applicantNeedRollBack) {
        applicantsNeedRollback.push(applicantNeedRollBack);
      }

      // - 使用 set 更新 applicants
      set({ applicants: formatData(applicantsNeedRollback) });
    }
  },
  resetStore: () => set({ applicants: null, isLoading: true }),
}));

export default useApplicantsStore;
