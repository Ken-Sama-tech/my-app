import type { FC } from "react";

type Keys = "autoplay" | "muted" | "autoNext" | "skipIntroOutro";

type VideoSettings = Record<Keys, boolean>;

type VideoPlayerProps = {
  [K in keyof VideoSettings]?: VideoSettings[K];
} & {
  callback?: (node: HTMLVideoElement, args: VideoSettings) => void;
  url: string;
};

const VideoPlayer: FC<VideoPlayerProps> = ({
  autoplay = false,
  muted = true,
  autoNext = false,
  skipIntroOutro = false,
  url,
  callback,
}) => {
  return (
    <video
      ref={(vid) => {
        if (!vid) return;
        vid.setAttribute("tabindex", "0");
        vid.autoplay = autoplay;
        vid.addEventListener("playing", () => {
          if (!muted) vid.muted = false;
        });

        if (callback) {
          callback(vid, { autoplay, muted, autoNext, skipIntroOutro });
        }

        vid.addEventListener("keydown", () => {});

        // window.addEventListener(
        //   "keydown",
        //   (event: KeyboardEvent) => {
        //     if (event.key === "ArrowRight") {
        //       event.preventDefault();
        //       vid.currentTime = Math.min(vid.currentTime + 5, vid.duration);
        //       console.log(Math.min(vid.currentTime + 5, vid.duration));
        //     }

        //     if (event.key === "ArrowLeft") {
        //       event.preventDefault();
        //       vid.currentTime = Math.max(vid.currentTime - 5, 0);
        //     }
        //   },
        //   { capture: true },
        // );
      }}
      className="aspect-video w-full"
      muted
      controls
    >
      <source type="video/mp4" src={url} />
    </video>
  );
};

export default VideoPlayer;
