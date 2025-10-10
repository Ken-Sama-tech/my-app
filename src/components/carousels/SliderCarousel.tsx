import { useRef } from "react";
import type { FC } from "react";
import type { SliderCarouselProps } from "./types/carousels";
import SubHeading from "../headings/SubHeading";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const SliderCarousel: FC<SliderCarouselProps> = ({
  children,
  className = "",
  heading = "Default heading",
  url = "#",
}) => {
  const sliderRef = useRef<HTMLDivElement | null>(null);

  return (
    <section className="flex min-h-[30vh] w-full relative items-center flex-col overflow-hidden">
      <div className="w-full h-auto flex items-center justify-between">
        <SubHeading loading={false} className="ps-2">
          {heading}
        </SubHeading>
        <Link
          to={url}
          className="!text-blue-600 flex hover:opacity-90 hover:underline transition-opacity duration-200 ease-in"
        >
          View
        </Link>
      </div>
      <div className="w-11/12 flex items-center justify-center">
        <div
          ref={sliderRef}
          className={`flex snap-x snap-mandatory py-2 items-center overflow-x-auto w-full h-auto rm-scrollbar gap-5 ${className}`}
        >
          {children}
        </div>
      </div>

      <button
        onClick={() => {
          if (!sliderRef.current) return;
          const slider: HTMLDivElement = sliderRef.current;
          slider.scrollBy({
            behavior: "smooth",
            left: -200,
          });
        }}
        className="size-10 bg-[rgba(81,162,255,0.2)] cursor-pointer left-0 flex justify-center items-center absolute rounded-full top-1/2 -translate-y-1/2"
      >
        <ChevronLeft className="size-full" />
      </button>
      <button
        onClick={() => {
          if (!sliderRef.current) return;
          const slider: HTMLDivElement = sliderRef.current;
          slider.scrollBy({
            behavior: "smooth",
            left: 200,
          });
        }}
        className="size-10 bg-[rgba(81,162,255,0.2)] cursor-pointer right-0 flex justify-center items-center absolute rounded-full top-1/2 -translate-y-1/2"
      >
        <ChevronRight className="size-full" />
      </button>
    </section>
  );
};

export default SliderCarousel;
