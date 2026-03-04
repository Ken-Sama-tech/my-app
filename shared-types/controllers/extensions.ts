export type UpdateExtensionsResBody =
  | {
      acknowledged: true;
      error: false;
      message: string;
      status: number;
    }
  | {
      acknowledged: false;
      error: true;
      message: string;
      status: number;
    };
