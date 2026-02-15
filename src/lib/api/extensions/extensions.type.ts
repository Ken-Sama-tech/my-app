import type { ExtensionsSchema } from "../../../../shared-types/extensions";

export type ExtensionsFields = {
  [K in keyof ExtensionsSchema]?: ExtensionsSchema[K];
};
