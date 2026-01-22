const PORT = import.meta.env?.VITE_SERVER_POR || 3000;

const getHostName = (): string => {
  const host: string = window.location.hostname || "localhost";
  return `http://${host}:${PORT}`;
};

export default getHostName;
