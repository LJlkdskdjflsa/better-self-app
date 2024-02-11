import type {
  ApplicantBoardModel,
  ApplicantModelNew,
} from '../models/applicantModel';

export function formatData(response: ApplicantModelNew[]): ApplicantBoardModel {
  return response.reduce(
    (acc, applicant) => {
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

// const apiResponse: ApiResponse = {
//     "success": true,
//     "error_code": 0,
//     "error_message": "",
//     "data": [
//         {
//             "id": 15,
//             "first_name": "李大維",
//             "last_name": "",
//             "application_status": {
//                 "id": 1,
//                 "value": "APPLIED",
//                 "icon": null,
//                 "pos": 1,
//                 "rejectable": false,
//                 "default": false
//             },
//             "position": {
//                 "id": 3,
//                 "state": {
//                     "id": 2980,
//                     "code": "TPE",
//                     "name": "Taipei"
//                 },
//                 "country": {
//                     "id": 222,
//                     "code2": "TW",
//                     "name": "Taiwan"
//                 },
//                 "company": {
//                     "id": 1,
//                     "company": "SF tech",
//                     "logo": "/media/8af3c0b7-6f12-4d54-8d64-5c49f40f28fb.png",
//                     "domain": "https://landing-page-black-one-89.vercel.app/",
//                     "location_lat": null,
//                     "location_lon": null,
//                     "location_address": null,
//                     "description": "test",
//                     "phone_number": null,
//                     "employees_number": 100
//                 },
//                 "job": "後端工程師",
//                 "responsibilities": "使用 Java 協助公司維護功能",
//                 "requirements": "有程式語言和資料庫相關的知識，熟悉 SQL",
//                 "department": "Engineering",
//                 "job_type": "Full Time",
//                 "city": "",
//                 "is_deleted": false,
//                 "created_date": "2024-01-18T01:50:14.372015Z",
//                 "updated_date": "2024-01-18T01:50:14.372026Z"
//             },
//             "company_object": {
//                 "id": 2,
//                 "company": "Fuhai",
//                 "logo": "/media/8af3c0b7-6f12-4d54-8d64-5c49f40f28fb.png",
//                 "domain": null,
//                 "location_lat": null,
//                 "location_lon": null,
//                 "location_address": null,
//                 "description": null,
//                 "phone_number": null,
//                 "employees_number": null
//             },
//             "apply_date": "2024-01-13T00:00:00Z",
//             "is_rejected": false,
//             "email": null,
//             "phone_number": "",
//             "reference": null
//         },
//         {
//             "id": 16,
//             "first_name": "李大維",
//             "last_name": "",
//             "application_status": {
//                 "id": 1,
//                 "value": "APPLIED",
//                 "icon": null,
//                 "pos": 1,
//                 "rejectable": false,
//                 "default": false
//             },
//             "position": {
//                 "id": 3,
//                 "state": {
//                     "id": 2980,
//                     "code": "TPE",
//                     "name": "Taipei"
//                 },
//                 "country": {
//                     "id": 222,
//                     "code2": "TW",
//                     "name": "Taiwan"
//                 },
//                 "company": {
//                     "id": 1,
//                     "company": "SF tech",
//                     "logo": "/media/8af3c0b7-6f12-4d54-8d64-5c49f40f28fb.png",
//                     "domain": "https://landing-page-black-one-89.vercel.app/",
//                     "location_lat": null,
//                     "location_lon": null,
//                     "location_address": null,
//                     "description": "test",
//                     "phone_number": null,
//                     "employees_number": 100
//                 },
//                 "job": "後端工程師",
//                 "responsibilities": "使用 Java 協助公司維護功能",
//                 "requirements": "有程式語言和資料庫相關的知識，熟悉 SQL",
//                 "department": "Engineering",
//                 "job_type": "Full Time",
//                 "city": "",
//                 "is_deleted": false,
//                 "created_date": "2024-01-18T01:50:14.372015Z",
//                 "updated_date": "2024-01-18T01:50:14.372026Z"
//             },
//             "company_object": {
//                 "id": 2,
//                 "company": "Fuhai",
//                 "logo": "/media/8af3c0b7-6f12-4d54-8d64-5c49f40f28fb.png",
//                 "domain": null,
//                 "location_lat": null,
//                 "location_lon": null,
//                 "location_address": null,
//                 "description": null,
//                 "phone_number": null,
//                 "employees_number": null
//             },
//             "apply_date": "2024-01-13T00:00:00Z",
//             "is_rejected": false,
//             "email": null,
//             "phone_number": "",
//             "reference": null
//         },
//         {
//             "id": 17,
//             "first_name": "李大維",
//             "last_name": "",
//             "application_status": {
//                 "id": 1,
//                 "value": "APPLIED",
//                 "icon": null,
//                 "pos": 1,
//                 "rejectable": false,
//                 "default": false
//             },
//             "position": {
//                 "id": 1,
//                 "state": {
//                     "id": 36,
//                     "code": "09",
//                     "name": "Dibër"
//                 },
//                 "country": {
//                     "id": 3,
//                     "code2": "AL",
//                     "name": "Albania"
//                 },
//                 "company": {
//                     "id": 1,
//                     "company": "SF tech",
//                     "logo": "/media/8af3c0b7-6f12-4d54-8d64-5c49f40f28fb.png",
//                     "domain": "https://landing-page-black-one-89.vercel.app/",
//                     "location_lat": null,
//                     "location_lon": null,
//                     "location_address": null,
//                     "description": "test",
//                     "phone_number": null,
//                     "employees_number": 100
//                 },
//                 "job": "新的職位名稱",
//                 "responsibilities": "新的職責",
//                 "requirements": "新的要求",
//                 "department": "新的部門",
//                 "job_type": "新的工作類型",
//                 "city": "新的城市",
//                 "is_deleted": true,
//                 "created_date": "2024-01-13T11:41:22.905859Z",
//                 "updated_date": "2024-01-13T11:41:22.905884Z"
//             },
//             "company_object": {
//                 "id": 2,
//                 "company": "Fuhai",
//                 "logo": "/media/8af3c0b7-6f12-4d54-8d64-5c49f40f28fb.png",
//                 "domain": null,
//                 "location_lat": null,
//                 "location_lon": null,
//                 "location_address": null,
//                 "description": null,
//                 "phone_number": null,
//                 "employees_number": null
//             },
//             "apply_date": "2024-01-13T00:00:00Z",
//             "is_rejected": false,
//             "email": null,
//             "phone_number": "",
//             "reference": null
//         },
//         {
//             "id": 18,
//             "first_name": "李大維",
//             "last_name": "",
//             "application_status": {
//                 "id": 1,
//                 "value": "APPLIED",
//                 "icon": null,
//                 "pos": 1,
//                 "rejectable": false,
//                 "default": false
//             },
//             "position": {
//                 "id": 2,
//                 "state": {
//                     "id": 2963,
//                     "code": "CYQ",
//                     "name": "Chiayi"
//                 },
//                 "country": {
//                     "id": 222,
//                     "code2": "TW",
//                     "name": "Taiwan"
//                 },
//                 "company": {
//                     "id": 1,
//                     "company": "SF tech",
//                     "logo": "/media/8af3c0b7-6f12-4d54-8d64-5c49f40f28fb.png",
//                     "domain": "https://landing-page-black-one-89.vercel.app/",
//                     "location_lat": null,
//                     "location_lon": null,
//                     "location_address": null,
//                     "description": "test",
//                     "phone_number": null,
//                     "employees_number": 100
//                 },
//                 "job": "Test position",
//                 "responsibilities": "test",
//                 "requirements": "test",
//                 "department": "Engineering",
//                 "job_type": "Part Time",
//                 "city": "",
//                 "is_deleted": true,
//                 "created_date": "2024-01-16T02:59:16.880133Z",
//                 "updated_date": "2024-01-16T02:59:16.880169Z"
//             },
//             "company_object": {
//                 "id": 2,
//                 "company": "Fuhai",
//                 "logo": "/media/8af3c0b7-6f12-4d54-8d64-5c49f40f28fb.png",
//                 "domain": null,
//                 "location_lat": null,
//                 "location_lon": null,
//                 "location_address": null,
//                 "description": null,
//                 "phone_number": null,
//                 "employees_number": null
//             },
//             "apply_date": "2024-01-13T00:00:00Z",
//             "is_rejected": false,
//             "email": null,
//             "phone_number": "",
//             "reference": null
//         },
//         {
//             "id": 19,
//             "first_name": "李大維",
//             "last_name": "",
//             "application_status": {
//                 "id": 2,
//                 "value": "PHONE SCREEN",
//                 "icon": null,
//                 "pos": 2,
//                 "rejectable": false,
//                 "default": false
//             },
//             "position": {
//                 "id": 2,
//                 "state": {
//                     "id": 2963,
//                     "code": "CYQ",
//                     "name": "Chiayi"
//                 },
//                 "country": {
//                     "id": 222,
//                     "code2": "TW",
//                     "name": "Taiwan"
//                 },
//                 "company": {
//                     "id": 1,
//                     "company": "SF tech",
//                     "logo": "/media/8af3c0b7-6f12-4d54-8d64-5c49f40f28fb.png",
//                     "domain": "https://landing-page-black-one-89.vercel.app/",
//                     "location_lat": null,
//                     "location_lon": null,
//                     "location_address": null,
//                     "description": "test",
//                     "phone_number": null,
//                     "employees_number": 100
//                 },
//                 "job": "Test position",
//                 "responsibilities": "test",
//                 "requirements": "test",
//                 "department": "Engineering",
//                 "job_type": "Part Time",
//                 "city": "",
//                 "is_deleted": true,
//                 "created_date": "2024-01-16T02:59:16.880133Z",
//                 "updated_date": "2024-01-16T02:59:16.880169Z"
//             },
//             "company_object": {
//                 "id": 2,
//                 "company": "Fuhai",
//                 "logo": "/media/8af3c0b7-6f12-4d54-8d64-5c49f40f28fb.png",
//                 "domain": null,
//                 "location_lat": null,
//                 "location_lon": null,
//                 "location_address": null,
//                 "description": null,
//                 "phone_number": null,
//                 "employees_number": null
//             },
//             "apply_date": "2024-01-13T00:00:00Z",
//             "is_rejected": false,
//             "email": null,
//             "phone_number": "",
//             "reference": null
//         },
//         {
//             "id": 20,
//             "first_name": "李大維",
//             "last_name": "",
//             "application_status": {
//                 "id": 3,
//                 "value": "ONSITE INTERVIEW",
//                 "icon": null,
//                 "pos": 3,
//                 "rejectable": false,
//                 "default": false
//             },
//             "position": {
//                 "id": 2,
//                 "state": {
//                     "id": 2963,
//                     "code": "CYQ",
//                     "name": "Chiayi"
//                 },
//                 "country": {
//                     "id": 222,
//                     "code2": "TW",
//                     "name": "Taiwan"
//                 },
//                 "company": {
//                     "id": 1,
//                     "company": "SF tech",
//                     "logo": "/media/8af3c0b7-6f12-4d54-8d64-5c49f40f28fb.png",
//                     "domain": "https://landing-page-black-one-89.vercel.app/",
//                     "location_lat": null,
//                     "location_lon": null,
//                     "location_address": null,
//                     "description": "test",
//                     "phone_number": null,
//                     "employees_number": 100
//                 },
//                 "job": "Test position",
//                 "responsibilities": "test",
//                 "requirements": "test",
//                 "department": "Engineering",
//                 "job_type": "Part Time",
//                 "city": "",
//                 "is_deleted": true,
//                 "created_date": "2024-01-16T02:59:16.880133Z",
//                 "updated_date": "2024-01-16T02:59:16.880169Z"
//             },
//             "company_object": {
//                 "id": 2,
//                 "company": "Fuhai",
//                 "logo": "/media/8af3c0b7-6f12-4d54-8d64-5c49f40f28fb.png",
//                 "domain": null,
//                 "location_lat": null,
//                 "location_lon": null,
//                 "location_address": null,
//                 "description": null,
//                 "phone_number": null,
//                 "employees_number": null
//             },
//             "apply_date": "2024-01-13T00:00:00Z",
//             "is_rejected": false,
//             "email": null,
//             "phone_number": "",
//             "reference": null
//         },
//         {
//             "id": 21,
//             "first_name": "李大維",
//             "last_name": "",
//             "application_status": {
//                 "id": 4,
//                 "value": "OFFERS",
//                 "icon": null,
//                 "pos": 4,
//                 "rejectable": false,
//                 "default": false
//             },
//             "position": {
//                 "id": 2,
//                 "state": {
//                     "id": 2963,
//                     "code": "CYQ",
//                     "name": "Chiayi"
//                 },
//                 "country": {
//                     "id": 222,
//                     "code2": "TW",
//                     "name": "Taiwan"
//                 },
//                 "company": {
//                     "id": 1,
//                     "company": "SF tech",
//                     "logo": "/media/8af3c0b7-6f12-4d54-8d64-5c49f40f28fb.png",
//                     "domain": "https://landing-page-black-one-89.vercel.app/",
//                     "location_lat": null,
//                     "location_lon": null,
//                     "location_address": null,
//                     "description": "test",
//                     "phone_number": null,
//                     "employees_number": 100
//                 },
//                 "job": "Test position",
//                 "responsibilities": "test",
//                 "requirements": "test",
//                 "department": "Engineering",
//                 "job_type": "Part Time",
//                 "city": "",
//                 "is_deleted": true,
//                 "created_date": "2024-01-16T02:59:16.880133Z",
//                 "updated_date": "2024-01-16T02:59:16.880169Z"
//             },
//             "company_object": {
//                 "id": 2,
//                 "company": "Fuhai",
//                 "logo": "/media/8af3c0b7-6f12-4d54-8d64-5c49f40f28fb.png",
//                 "domain": null,
//                 "location_lat": null,
//                 "location_lon": null,
//                 "location_address": null,
//                 "description": null,
//                 "phone_number": null,
//                 "employees_number": null
//             },
//             "apply_date": "2024-01-13T00:00:00Z",
//             "is_rejected": false,
//             "email": null,
//             "phone_number": "",
//             "reference": null
//         },
//         {
//             "id": 22,
//             "first_name": "李大維",
//             "last_name": "",
//             "application_status": {
//                 "id": 4,
//                 "value": "OFFERS",
//                 "icon": null,
//                 "pos": 4,
//                 "rejectable": false,
//                 "default": false
//             },
//             "position": {
//                 "id": 2,
//                 "state": {
//                     "id": 2963,
//                     "code": "CYQ",
//                     "name": "Chiayi"
//                 },
//                 "country": {
//                     "id": 222,
//                     "code2": "TW",
//                     "name": "Taiwan"
//                 },
//                 "company": {
//                     "id": 1,
//                     "company": "SF tech",
//                     "logo": "/media/8af3c0b7-6f12-4d54-8d64-5c49f40f28fb.png",
//                     "domain": "https://landing-page-black-one-89.vercel.app/",
//                     "location_lat": null,
//                     "location_lon": null,
//                     "location_address": null,
//                     "description": "test",
//                     "phone_number": null,
//                     "employees_number": 100
//                 },
//                 "job": "Test position",
//                 "responsibilities": "test",
//                 "requirements": "test",
//                 "department": "Engineering",
//                 "job_type": "Part Time",
//                 "city": "",
//                 "is_deleted": true,
//                 "created_date": "2024-01-16T02:59:16.880133Z",
//                 "updated_date": "2024-01-16T02:59:16.880169Z"
//             },
//             "company_object": {
//                 "id": 2,
//                 "company": "Fuhai",
//                 "logo": "/media/8af3c0b7-6f12-4d54-8d64-5c49f40f28fb.png",
//                 "domain": null,
//                 "location_lat": null,
//                 "location_lon": null,
//                 "location_address": null,
//                 "description": null,
//                 "phone_number": null,
//                 "employees_number": null
//             },
//             "apply_date": "2024-01-13T00:00:00Z",
//             "is_rejected": false,
//             "email": null,
//             "phone_number": "",
//             "reference": null
//         }
//     ]
// }
// const categorizedData = formatData(apiResponse);

// console.log(categorizedData);
