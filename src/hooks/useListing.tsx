import { useEffect, useState } from 'react';
import { PAGE_DEFAULT, PAGE_SIZE_DEFAULT } from '@/constants/pagination';
import { AnyRecord } from '@/types/utils';
import { isEmpty } from '@/services';

export interface UseListing<
  SearchParams extends AnyRecord,
  Model extends AnyRecord,
> {
  defaultSearchParams?: SearchParams;
  defaultResponse?: {
    data: Model[];
    totalRecords: number;
    totalPages: number;
    page: number;
    pageSize?: number;
  };
  getListService: (searchParams: SearchParams) => Promise<{
    data: Model[];
    totalRecords: number;
    totalPages: number;
    page: number;
    pageSize: number;
  }>;
}

export const useListing = <
  SearchParams extends AnyRecord,
  Model extends AnyRecord,
>({
  defaultSearchParams = {} as SearchParams,
  defaultResponse,
  getListService,
}: UseListing<SearchParams, Model>) => {
  const [searchParams, setSearchParams] =
    useState<SearchParams>(defaultSearchParams);

  const [listingState, setListingState] = useState({
    data: defaultResponse?.data ?? [],
    totalRecords: defaultResponse?.totalRecords ?? 0,
    totalPages: defaultResponse?.totalPages ?? 0,
    page: defaultResponse?.page ?? PAGE_DEFAULT,
    pageSize: defaultResponse?.pageSize ?? PAGE_SIZE_DEFAULT,
    isLoading: defaultResponse === undefined,
  });

  const handleGetList = async () => {
    setListingState((prevState) => {
      return {
        ...prevState,
        isLoading: true,
      };
    });

    try {
      const response = await getListService(searchParams);
      if (isEmpty(response.data)) {
        const avaliablePage = Math.min(response.page, response.totalPages);
        if (avaliablePage > 0) {
          setSearchParams((prevState) => {
            return {
              ...prevState,
              page: avaliablePage,
            };
          });
          return;
        }
      }
      setListingState({
        data: response.data,
        totalRecords: response.totalRecords,
        totalPages: response.totalPages,
        page: response.page,
        pageSize: response.pageSize,
        isLoading: false,
      });
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setListingState((prevState) => {
        return {
          ...prevState,
          isLoading: false,
        };
      });
    }
  };
  useEffect(() => {
    if (defaultResponse !== undefined) {
      console.log('defaultResponse', defaultResponse);
      return;
    }

    handleGetList();
    console.log('Search Params:', searchParams);

  }, [searchParams]);

  return {
    ...listingState,
    searchParams,
    setSearchParams,
    handleGetList,
  };
};