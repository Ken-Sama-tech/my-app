// import { useState } from "react";
// import type { ChangeEvent } from "react";
// import useLocalStorage from "../../lib/hooks/useLocalStorage";

// type Props = {
//   label: string;
//   // callback: () => void;
// };

// type CheckTypeOption = Props & {
//   type: "check";
// };

// type EnumTypeOption = Props & {
//   type: "enum";
//   options?: string[];
// };

// type OptionListProps = Array<EnumTypeOption | CheckTypeOption>;

// const LibraryOptions = () => {
//   const ls = useLocalStorage();

//   const [optionList] = useState<OptionListProps>([
//     { label: "Anime", type: "check" },
//     { label: "Manga", type: "check" },
//     { label: "Novel", type: "check" },
//     { label: "Sort format", type: "enum", options: ["Desc", "Asc"] },
//     {
//       label: "Sort",
//       type: "enum",
//       options: [
//         "By name",
//         "By recent update",
//         "By recent read",
//         "By chapters left",
//         "By chapters read",
//       ],
//     },
//     {
//       label: "Status",
//       type: "enum",
//       options: ["Any", "Completed", "On going"],
//     },
//   ]);

//   return (
//     <ul className="size-full list-none py-2 px-1">
//       {optionList.map((option, idx) => {
//         const key = `${option.label}-${option.type}-${idx}`;
//         const value = ls.get<{ data: string | boolean }>(key);
//         console.log(value);
//         return (
//           <li
//             key={idx}
//             className="flex justify-start items-center hover:bg-neutral-500 transition-all duration-100 ease-in mt-1"
//           >
//             <label
//               title={option.label}
//               htmlFor={`${option.label}-${idx}`}
//               className="ps-2 text-md w-1/2 cursor-pointer line-clamp-1 shrink-0 grow-0 text-ellipsis"
//             >
//               {option.label}
//             </label>

//             {option.type == "check" && (
//               <input
//                 onChange={(e: ChangeEvent<HTMLInputElement>) => {
//                   const target = e.target;
//                   const isChecked = target.checked;
//                   ls.set(key, isChecked);
//                 }}
//                 id={`${option.label}-${idx}`}
//                 type="checkbox"
//                 {...{ defaultChecked: Boolean(value?.data) }}
//                 className="w-1/2 size-4 cursor-pointer"
//               />
//             )}

//             {option.type == "enum" && (
//               <select
//                 defaultValue={String(value?.data)}
//                 onChange={(e: ChangeEvent<HTMLSelectElement>) => {
//                   const target = e.target;
//                   ls.set(key, target.value);
//                 }}
//                 id={`${option.label}-${idx}`}
//                 className="bg-transparent block h-1/10 focus:outline-none border-none size-full line-clamp-1 text-ellipsis"
//               >
//                 {option.options?.map((opt) => {
//                   return (
//                     <option
//                       key={`${opt}-${idx}`}
//                       value={opt}
//                       className="bg-neutral-800 border-none"
//                     >
//                       {opt}
//                     </option>
//                   );
//                 })}
//               </select>
//             )}
//           </li>
//         );
//       })}
//     </ul>
//   );
// };

// export default LibraryOptions;
