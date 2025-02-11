import {
    DefaultError,
    DefinedInitialDataOptions,
    DefinedUseQueryResult,
    QueryKey,
    useQuery,
} from "@tanstack/react-query";

export function useOnceQuery<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
>(
    options: DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
): DefinedUseQueryResult<TData, TError> {
    const queryResult = useQuery({
        ...options,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    return queryResult as DefinedUseQueryResult<TData, TError>;
}