import type { MediaArgs, ResponseData, PageArgs, MediaResponse, PageResponse, Genres } from "./types/anilist";
declare const anilist: () => {
    query: <TData, TVars>(gql: string, variables: TVars | object) => Promise<ResponseData<TData>>;
    media: <T>(args: MediaArgs, data: string[], isPaginated?: boolean) => MediaResponse<T>;
    Page: <T>({ page, perPage, pageInfo, }: PageArgs & {
        pageInfo?: boolean;
    }) => PageResponse<T>;
    genres: () => Promise<ResponseData<Genres>>;
};
export default anilist;
