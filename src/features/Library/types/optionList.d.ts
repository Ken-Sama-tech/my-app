type Props = {
  label: string;
  // callback: () => void;
};

export type CheckTypeOption = Props & {
  type: "check";
};

export type EnumTypeOption = Props & {
  type: "enum";
  options?: string[];
};

export type OptionListProps = Array<EnumTypeOption | CheckTypeOption>;
