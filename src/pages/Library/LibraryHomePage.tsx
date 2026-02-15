import Badge from "../../components/ui/Badge";
import { Inbox } from "lucide-react";

const LibraryHomePage = () => {
  return (
    <section className="h-[calc(100%-36px)] w-full bg-neutral-900 rm-scrollbar overflow-y-auto">
      <div className="min-h-full h-auto w-full relative">
        <Badge className="flex justify-center !w-9/10 md:!w-fit items-center gap-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-5">
          <Inbox className="shrink-0" />
          <span className="text-md font-semibold">Kinda lonely here</span>
        </Badge>
      </div>
    </section>
  );
};

export default LibraryHomePage;
