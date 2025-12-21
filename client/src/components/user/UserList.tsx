import { UserItem } from "./UserItem";
import List from "@mui/material/List";
import { ListItem } from "@mui/material";
import { FC } from "react";
import { TUser } from "../../models/type/TUser";

interface UserListProps {
  users: TUser[];
}

export const UserList: FC<UserListProps> = ({ users }) => {
  return (
    <List sx={{ width: "100%" }}>
      {users.map((user) => (
        <ListItem key={user.username} disablePadding sx={{ display: "block" }}>
          <UserItem user={user} />
        </ListItem>
      ))}
    </List>
  );
};
