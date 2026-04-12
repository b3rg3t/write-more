import { IBase } from "./IBase";
import { ICommentUser } from "./ICommentUser";

export interface IComment extends IBase {
  content: string;
  user: ICommentUser;
  isEdited: boolean;
}
