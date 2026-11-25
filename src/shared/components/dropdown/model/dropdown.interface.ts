export interface DropdownOptions {
  label: string;
  value: string;
  content: readonly HTMLLIElement[];
  classNames?: string;
  onSelect?: (value: string) => void;
}
