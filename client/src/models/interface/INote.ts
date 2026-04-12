import { TLink } from "../type/TLink";
import { IComment } from "./IComment";
import { IBase } from "./IBase";

export interface INote extends IBase {
  content: string;
  title: string;
  order: number;
  links: TLink[];
  commentIds?: Array<string | IComment>;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
}
