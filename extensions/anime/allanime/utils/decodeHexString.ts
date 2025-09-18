import { hexMap } from "../vars.js";

const decodeHexString = (hexString: string): string => {
  if (!hexString) return;

  const cleanHex: string = hexString.replace(/[^0-9a-f]/gi, "");

  const hexPairs: string[] = [];

  for (let i: number = 0; i < cleanHex.length; i += 2) {
    hexPairs.push(cleanHex.slice(i, i + 2));
  }

  const decodeHex: string = hexPairs
    .map((hex: string) => hexMap.get(hex.toLocaleLowerCase()))
    .filter(Boolean)
    .join("");

  return decodeHex;
};

export default decodeHexString;
