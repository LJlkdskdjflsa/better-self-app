import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

import type { Position } from '../positions/interfaces';
import { adminAxiosInstance } from '~/utils/axiosUtils';

type PositionQueryParams = {
  page: number;
  pageSize: number;
  deleted: boolean;
};

export type PositionsResponse = {
  data: Position[];
  pagination: {
    current_page: number;
    page_count: number;
    total_count: number;
  };
};

export async function fetchPositions({
  deleted = false,
  page = 1,
  pageSize = 10,
} = {}) {
  const deletedQueryParam = deleted ? 'deleted=only' : '';
  const { data } = await adminAxiosInstance.get<PositionsResponse>(
    `/api/positions/company?page_size=${pageSize}&page=${page}&${deletedQueryParam}`
  );

  return data;
}

export function usePositions(props?: PositionQueryParams) {
  const { page, pageSize, deleted } = props ?? {};
  const [queryParams, setQueryParams] = useState<Partial<PositionQueryParams>>({
    deleted,
    page,
    pageSize,
  });

  const rtqRes = useQuery(
    ['/api/positions/company', queryParams],
    () => fetchPositions(queryParams),
    { refetchOnWindowFocus: false, enabled: !!page && !!pageSize }
  );

  useEffect(() => {
    setQueryParams({ deleted, page, pageSize });
  }, [deleted, page, pageSize]);

  return { ...rtqRes, positionsResData: rtqRes?.data };
}
