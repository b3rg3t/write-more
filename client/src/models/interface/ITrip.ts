import { IBase } from "./IBase";
import { ITripImage } from "./ITripImage";
import { INote } from "./INote";
import { ITodo } from "./ITodo";
import { ITripUser } from "./ITripUser";
import { IUser } from "./IUser";

export interface ITripSectionBase {
  isAccordionOpen: boolean;
}

export interface ITripNotesSection extends ITripSectionBase {}

export interface ITripTodosSection extends ITripSectionBase {
  showCompleted: boolean;
}

export interface ITripImagesSection extends ITripSectionBase {}

export interface ITrip extends IBase {
  title: string;
  description?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  images: ITripImage[];
  notes: INote[];
  todos: ITodo[];
  users: ITripUser[] | string[];
  createdBy: IUser;
  order: number;
  notesSection?: ITripNotesSection;
  todosSection?: ITripTodosSection;
  imagesSection?: ITripImagesSection;
}
