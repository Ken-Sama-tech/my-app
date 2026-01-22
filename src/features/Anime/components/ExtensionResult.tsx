import type { FC } from "react";
// import axios from "axios";
// import getServerAddress from "../../../lib/utils/getServerAddress";
// import useServerConfig from "../../../lib/hooks/useServerConfig";
import { fetchAnime } from "../../../lib/api/fetch";

type ExtensionResultProps = {
  title: string;
  idMal?: number;
};

// const foo = async (title: string, idMal: number) => {
//   const config = useServerConfig();
//   const response = await axios.get(
//     `${config.getServerUrl}/extensions/anime/episodes/ref?extension=allanime&query=${title}`,
//   );

//   console.log(response);
// };

const ExtensionResult: FC<ExtensionResultProps> = ({ title, idMal }) => {
  // foo(title, idMal);
  fetchAnime({
    extension: "allanime",
    title: title,
  });
  return <div>ExtensionResult</div>;
};

export default ExtensionResult;
