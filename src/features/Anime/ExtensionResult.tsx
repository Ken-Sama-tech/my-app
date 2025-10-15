import type { FC } from "react";

type AnimeExtensionResultProps = {
  logo: string;
  availableEpisodes?: {
    episode: number;
    episodeTitle?: number;
  };
};

const AnimeExtensionResult: FC<AnimeExtensionResultProps> = () => {
  return <div className=""></div>;
};

export default AnimeExtensionResult;
