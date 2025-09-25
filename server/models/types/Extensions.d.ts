export type ExtensionSchema = {
  name: string;
  logo_url: string;
  extType: "manga" | "anime" | "novel";
  source: string;
  ext_path: string;
  referrer: string;
};
