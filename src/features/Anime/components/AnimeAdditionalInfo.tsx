import type { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import anilist from "../../../lib/api/anilist/anilist";
import formatDate from "../../../lib/utils/formatDate";

type AnimeAdditionalInfoProps = {
  animeAnlId: number;
};

const anl = anilist();

const AnimeAdditionalInfo: FC<AnimeAdditionalInfoProps> = ({ animeAnlId }) => {
  const {
    data: tracker,
    isLoading: trackerIsLoading,
    isError: trackerHasError,
  } = useQuery({
    queryKey: ["watch"],
    queryFn: () =>
      anl.getFullSeasonChain(animeAnlId, {
        type: "ANIME",
      }),
  });

  console.log(tracker);
  return <div className="size-full border">AnimeAdditionalInfo</div>;
};

export default AnimeAdditionalInfo;
