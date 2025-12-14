import { TLink } from "../type/TLink";
import { IBase } from "./IBase";

export interface INote extends IBase {
  content: string;
  title: string;
  order: number;
  links: TLink[];
}
