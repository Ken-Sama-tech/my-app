import { useEffect, type FC } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const ExtensionResults: FC = () => {
  const {
    data: extensions,
    isError: extensionsIsError,
    isLoading: extensionsIsLoading,
  } = useQuery({
    queryKey: ["extensions"],
    queryFn: () => {
      return null;
    },
  });

  useEffect(() => {}, []);

  return <div>{extensions}</div>;
};

export default ExtensionResults;
