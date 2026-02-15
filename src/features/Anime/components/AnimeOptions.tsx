// import { type FC, type RefObject } from "react";
// import { useRef, useEffect } from "react";
// import axios from "axios";
// import type {
//   AnimeExtensions,
//   ExtensionsResponse,
// } from "../../../../server/models/types/Extensions";
// import LabeledToggle from "../../../components/checkboxes/LabeledToggle";
// import useExtensions from "../../../lib/hooks/useExtensions";
// import SimpleError from "../../../components/ui/SimpleError";
// import useServerConfig from "../../../lib/hooks/useServerConfig";
// import { useQuery } from "@tanstack/react-query";

// export type Options = {
//   extensions:
//     | {
//         extension: AnimeExtensions;
//         active: boolean;
//         logo: string;
//       }[]
//     | [];
// };

// type AnimeOptionsProps = {
//   callback?: (options: RefObject<Options>) => void;
// };

// const AnimeOptions: FC<AnimeOptionsProps> = ({ callback }) => {
//   const extension = useExtensions("anime");
//   const { data: extensions, isError, isLoading } = extension.getExtensions();
//   const { getServerUrl: base } = useServerConfig();
//   const optionsRef = useRef<Options>({
//     extensions: [],
//   });

//   useEffect(() => {
//     if (isLoading || isError) return;
//     const { current } = optionsRef;
//     current.extensions =
//       extensions?.map((ext) => {
//         return { extension: ext.name, active: ext.active, logo: ext.logo };
//       }) || [];
//     if (callback) {
//       callback(optionsRef);
//     }
//   }, [isLoading]);

//   const {} = useQuery({
//     queryKey: ["settings-content"],
//     queryFn: () => null,
//   });

//   return (
//     <div className="size-full flex flex-col p-2 z-2">
//       <div className="w-full flex flex-col items-end">
//         <span className="text-md font-semibold w-full">Extensions</span>
//         {!isError && !isLoading && (
//           <ul className="grid size-full p-2">
//             {extensions?.map((ext, idx) => {
//               const { current } = optionsRef;
//               return (
//                 <li key={idx} className="w-full rounded-md">
//                   <LabeledToggle
//                     logo={ext.logo}
//                     label={ext.name}
//                     checked={ext.active}
//                     callback={async (_, isChecked) => {
//                       const api = `${base}/extensions/update/${ext._id}`;
//                       await axios.patch<ExtensionsResponse>(api, {
//                         active: isChecked,
//                       });

//                       if (!current.extensions.length) {
//                         console.log("No extension found");
//                         return;
//                       }

//                       const index: number = current.extensions?.findIndex(
//                         (option) => option.extension === ext.name
//                       );
//                       console.log(index);
//                       current.extensions[index].active = isChecked;
//                     }}
//                   />
//                 </li>
//               );
//             })}
//           </ul>
//         )}
//         {isError && (
//           <div className="flex w-full justify-center mt-1 items-center">
//             <SimpleError message="Failed to load" />
//           </div>
//         )}
//       </div>
//       <div className="w-full flex flex-col bg-white">
//         <span className=""></span>
//       </div>
//     </div>
//   );
// };

// export default AnimeOptions;
