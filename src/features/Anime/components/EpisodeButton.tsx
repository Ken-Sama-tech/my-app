import type { CSSProperties, FC } from "react";

type EpisdoeButtonProps = {
  title: string;
  disabled?: boolean;
  grid?: boolean;
  episode: number;
  style: CSSProperties;
  callback?: () => void;
};

const EpisodeButton: FC<EpisdoeButtonProps> = ({
  title,
  style,
  callback,
  grid = false,
  episode,
  disabled = false,
}) => {
  return (
    <button
      data-episode={episode}
      data-episode-title={title.toLocaleLowerCase()}
      disabled={disabled}
      style={style}
      className="p-2 text-center bg-neutral-700 cursor-pointer hover:bg-neutral-600 grow-0 shrink-0"
      title={title}
      onClick={() => {
        if (callback) callback();
      }}
    >
      {grid ? episode : title}
    </button>
  );
};

export default EpisodeButton;
