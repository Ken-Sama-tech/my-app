type Type = "unix" | "duration";
declare const formatDate: (timestamp: number, type?: Type) => string;
export default formatDate;
