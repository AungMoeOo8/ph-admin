export type Response<TData> = {
  isSuccess: boolean;
  message: string;
  data: TData;
};
