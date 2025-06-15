import { EntityState } from "@reduxjs/toolkit";
import { TNote } from "../type/TNote";

export interface INote extends EntityState<TNote, string> {
  isEditing?: TNote["id"];
}
