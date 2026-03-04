export const searchQuery: string = `
      query(
          $search: SearchInput,
          $limit: Int,
          $page: Int,
          $translationType: VaildTranslationTypeEnumType,
          $countryOrigin: VaildCountryOriginEnumType
      ) {
      shows(
          search: $search,
          limit: $limit,
          page: $page,
          translationType: $translationType,
          countryOrigin: $countryOrigin
      ) {
          edges {
            _id
            malId
            thumbnail
            name
            altNames
            availableEpisodes
            __typename
          }
        }
      }
    `;

export const getEpisodeLinkQuery = `query(
        $showId: String!,
        $translationType: VaildTranslationTypeEnumType!,
        $episodeString: String!
    ) {
        episode(
            showId: $showId
            translationType: $translationType
            episodeString: $episodeString
        ) {
            episodeString
            sourceUrls
        }
    }`;

export const getEpisodeListQuery: string = `
      query(
          $showId: String!,
      ) {
      show(
        _id: $showId
      ) {
            availableEpisodes
        }
      }
    `;
