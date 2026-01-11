import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { text } from "../../localization/eng";

export const About = () => {
  return (
    <>
      <Typography sx={{ fontWeight: 600, mb: 2 }} variant="h2">
        {text.footer.header}
      </Typography>
      <Typography sx={{ pb: 2 }} variant="body1">
        {text.footer.madeBy}
      </Typography>
      <List dense sx={{ display: "flex", flexDirection: "row" }}>
        <ListItem
          component="a"
          href={text.footer.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ textDecoration: "none", color: "primary.main" }}
        >
          <ListItemAvatar>
            <Avatar>
              <LinkedInIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={text.footer.linkedin} />
        </ListItem>
        <ListItem
          component="a"
          href={text.footer.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ textDecoration: "none", color: "primary.main" }}
        >
          <ListItemAvatar>
            <Avatar>
              <GitHubIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={text.footer.github} />
        </ListItem>
      </List>
    </>
  );
};
