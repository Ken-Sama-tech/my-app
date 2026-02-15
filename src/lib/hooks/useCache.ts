import { useRef } from "react";

const useCache = <K = string, V = any>() => {
  const { current: cache } = useRef<Map<K, V>>(new Map());

  return {
    ...cache,
  };
};

export default useCache;
