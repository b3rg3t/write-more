import { IBase } from "./IBase";

export interface ITodo extends IBase {
  name: string;
  order: number;
  isCompleted: boolean;
}
