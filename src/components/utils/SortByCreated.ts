import { TRound } from "../../models/type/TRound";

export const sortByCreated = (rounds: TRound[]) => {
    const roundList = [...rounds]

    return roundList.sort((a, b) => {
        const dateA = new Date(a.created);
        const dateB = new Date(b.created);
    
        return dateA < dateB ? 1 : dateA > dateB ? -1 : 0;
      })
}