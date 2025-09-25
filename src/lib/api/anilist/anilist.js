import axios, {} from "axios";
const anilist = () => {
    const api = "https://graphql.anilist.co";
    return {
        query: async (gql, variables) => {
            try {
                const res = await axios.post(api, {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    query: gql,
                    variables,
                });
                const { data } = res.data;
                return {
                    data,
                };
            }
            catch (error) {
                return {
                    error: true,
                    message: error || error.message,
                };
            }
        },
        media: (args, data, isPaginated = false) => {
            const { search = "", type = "ANIME", id = null, idMal = null, sort = null, isAdult = false, } = args;
            const queryArgs = [];
            const variables = {
                type: type,
                isAdult: isAdult,
            };
            queryArgs.push("$type: MediaType");
            queryArgs.push("$isAdult: Boolean");
            if (search) {
                queryArgs.push("$search: String");
                variables["search"] = search;
            }
            if (id) {
                queryArgs.push("$id: Int");
                variables["id"] = id;
            }
            if (idMal) {
                queryArgs.push("$idMal: Int");
                variables["idMal"] = idMal;
            }
            if (sort) {
                queryArgs.push("$sort: [MediaSort]");
                variables["sort"] = sort;
            }
            const self = anilist();
            const start = isPaginated ? "media" : "Media";
            const q = (s) => `query(${queryArgs.map((q) => " " + q)}) { ${s}} `;
            const mediaQuery = `${start} (${queryArgs.map((q) => {
                const start = q.indexOf("$") + 1;
                const end = q.indexOf(":");
                const key = q.slice(start, end);
                const value = q.slice(0, end);
                return ` ${key}: ${value}`;
            })}) {${data.map((q) => " " + q)} }`;
            const gql = q(mediaQuery);
            return {
                mediaQuery: mediaQuery,
                gql: gql,
                queryArgs,
                variables,
                query: async () => {
                    const res = await self.query(gql, variables);
                    return res;
                },
            };
        },
        Page: ({ page = 1, perPage = 10, pageInfo = false, }) => {
            const self = anilist();
            const includePageInfo = pageInfo
                ? `pageInfo { currentPage hasNextPage lastPage perPage total } `
                : "";
            const q = (mediaQuery, queryArgs) => `query($page: Int, $perPage: Int,${queryArgs.map((a) => " " + a)} ) { Page(page: $page, perPage: $perPage) { ${mediaQuery} ${includePageInfo}} }`;
            return {
                media: (args, data) => {
                    const res = self.media(args, data, true);
                    const { variables, mediaQuery, queryArgs } = res;
                    const gql = q(mediaQuery, queryArgs);
                    return {
                        query: async () => {
                            const res = await self.query(gql, {
                                ...variables,
                                page,
                                perPage,
                            });
                            return res;
                        },
                        gql,
                        mediaQuery,
                        queryArgs,
                        variables,
                    };
                },
            };
        },
        genres: async () => {
            const self = anilist();
            const genres = await self.query(`query{ GenreCollection }`, {});
            const { data, error, message } = genres;
            if (error) {
                return {
                    error,
                    message,
                };
            }
            return {
                data,
                message,
            };
        },
    };
};
export default anilist;
