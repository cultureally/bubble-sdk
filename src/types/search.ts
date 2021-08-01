import BubbleDataType from "../BubbleDataType";

export interface BaseDataType {
  "Created Date": string;
  "Created By": string;
  "Modified Date": string;
  _id: string;
}

export interface SortConfig<T extends BaseDataType> {
  sort_field: keyof T & string;
  descending: boolean;
}

export type ConstraintField<T extends BaseDataType> = keyof Omit<
  T,
  "type" | "save"
>;

export interface Constraint<T extends BaseDataType> {
  key: ConstraintField<T>;
  constraint_type: ConstraintType;
  value?: (string | number) | (string | number)[];
}

export type ConstraintType =
  | "equals"
  | "is_empty"
  | "not_equal"
  | "is_not_empty"
  | "text contains"
  | "not text contains"
  | "greater than"
  | "less than"
  | "in"
  | "not in"
  | "contains"
  | "not contains"
  | "empty"
  | "not empty";

export interface SearchConfig<T extends BubbleDataType> {
  constraints: Constraint<T>[];
  sort?: SortConfig<T>;
  cursor?: number;
}
