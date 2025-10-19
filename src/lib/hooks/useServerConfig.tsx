import { useState } from "react";

type UseServerConfig = () => {
  setServerUrl: (url: string) => void;
  getServerUrl: string;
};

const PORT: string = import.meta.env.VITE_SERVER_PORT || "3000";

const useServerConfig: UseServerConfig = () => {
  const [serverUrl, setServerUrl] = useState<string>(
    `http://${window.location.hostname}:${PORT}`
  );

  return {
    setServerUrl,
    getServerUrl: serverUrl,
  };
};

export default useServerConfig;
