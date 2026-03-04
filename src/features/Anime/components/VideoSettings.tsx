import type { FC } from "react";
import useLocalStorage from "../../../lib/hooks/useLocalStorage";
import { useRef } from "react";

type VideoSettingsFields = {
  autoplay: boolean;
  autoNext: boolean;
  muted: boolean;
  skipIntroOutro: boolean;
};

type VideoSettingsProps = {
  callback?: (args: VideoSettingsFields) => void;
} & VideoSettingsFields;

const VideoSettings: FC<VideoSettingsProps> = (args) => {
  const { callback, ...rest } = args;
  const ls = useLocalStorage();
  const videoSettingsRef = useRef<VideoSettingsFields>(rest);
  return (
    <div className="size-full flex items-center justify-start gap-0.5">
      <div className="flex px-2 gap-2">
        <label
          htmlFor="autoplay"
          className="text-sm text-neutral-300! md:text-md"
        >
          Autoplay
        </label>
        <input
          ref={(node) => {
            if (!node) return;
            const videoSettings = videoSettingsRef.current;
            const isChecked = videoSettings.autoplay;
            node.checked = isChecked;
          }}
          onChange={({ target }) => {
            const videoSettings = videoSettingsRef.current;
            const isChecked = videoSettings.autoplay;
            target.checked = !isChecked;
            videoSettings.autoplay = !isChecked;
            if (callback) callback(videoSettings);
            ls.set("video-settings", videoSettings);
          }}
          type="checkbox"
          id="autoplay"
        />
      </div>
      <div className="flex px-2 gap-2">
        <label
          htmlFor="auto-next"
          className="text-sm text-neutral-300! md:text-md"
        >
          Auto Next
        </label>
        <input
          ref={(node) => {
            if (!node) return;
            const videoSettings = videoSettingsRef.current;
            const isChecked = videoSettings.autoNext;
            node.checked = isChecked;
          }}
          onChange={({ target }) => {
            const videoSettings = videoSettingsRef.current;
            const isChecked = videoSettings.autoNext;
            target.checked = !isChecked;
            videoSettings.autoNext = !isChecked;
            if (callback) callback(videoSettings);
            ls.set("video-settings", videoSettings);
          }}
          type="checkbox"
          id="auto-next"
        />
      </div>
      <div className="flex px-2 gap-2">
        <label htmlFor="muted" className="text-sm text-neutral-300! md:text-md">
          Muted
        </label>
        <input
          ref={(node) => {
            if (!node) return;
            const videoSettings = videoSettingsRef.current;
            const isChecked = videoSettings.muted;
            node.checked = isChecked;
          }}
          onChange={({ target }) => {
            const videoSettings = videoSettingsRef.current;
            const isChecked = videoSettings.muted;
            target.checked = !isChecked;
            videoSettings.muted = !isChecked;
            if (callback) callback(videoSettings);
            ls.set("video-settings", videoSettings);
          }}
          type="checkbox"
          id="muted"
        />
      </div>
      <div className="flex px-2 gap-2">
        <label
          htmlFor="skip-intro-outro"
          className="text-sm text-neutral-300! md:text-md"
        >
          Skip Intro/Outro
        </label>
        <input
          ref={(node) => {
            if (!node) return;
            const videoSettings = videoSettingsRef.current;
            const isChecked = videoSettings.skipIntroOutro;
            node.checked = isChecked;
          }}
          onChange={({ target }) => {
            const videoSettings = videoSettingsRef.current;
            const isChecked = videoSettings.skipIntroOutro;
            target.checked = !isChecked;
            videoSettings.skipIntroOutro = !isChecked;
            if (callback) callback(videoSettings);
            ls.set("video-settings", videoSettings);
          }}
          type="checkbox"
          id="skip-intro-outro"
        />
      </div>
    </div>
  );
};

export default VideoSettings;
