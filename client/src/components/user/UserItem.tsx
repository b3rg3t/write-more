import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Stack,
  IconButton,
  Chip,
} from "@mui/material";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import { FC } from "react";
import { TUser } from "../../models/type/TUser";
import { EUserRole } from "../../models/enum/EUserRole";

export const UserItem: FC<{ user: TUser }> = ({ user }) => {
  const handleEditUser = () => {
    // TODO: Implement edit functionality
    console.log("Edit user:", user.username);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        boxShadow: 2,
        mb: 2,
        "&:hover": {
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h3" color="text.primary" fontWeight="bold">
            {user.username}
          </Typography>
          {user.firstName || user.lastName ? (
            <Typography variant="body2">
              {user.firstName} {user.lastName}
            </Typography>
          ) : null}
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
          {user.role && (
            <Chip
              label={user.role}
              size="small"
              color={
                user.role === EUserRole.ADMIN
                  ? "secondary"
                  : user.role === EUserRole.GUEST
                  ? "default"
                  : "primary"
              }
              sx={{ width: "fit-content" }}
            />
          )}
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
        <IconButton
          aria-label="edit user"
          onClick={handleEditUser}
          size="small"
          color="primary"
        >
          <EditSquareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};
