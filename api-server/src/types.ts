export type BaseRequestDTO<
  PATH = undefined,
  QUERY = undefined,
  BODY = undefined,
> = {} & (PATH extends undefined ? object : { path: PATH }) &
  (QUERY extends undefined ? object : { query: QUERY }) &
  (BODY extends undefined ? object : { body: BODY });

export type BaseResponseDTO<
  Data = unknown,
  WithPagination extends boolean = false,
> = {
  data: Data;
} & (WithPagination extends true ? { pagination: Pagination } : object);

export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type ErrorResponse = {
  errorCode: string;
  message: string;
};
