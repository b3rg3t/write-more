import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { text } from "../../localization/eng";
import { FC } from "react";

interface AboutProps {
  hideTopSection?: boolean;
}

export const About: FC<AboutProps> = ({ hideTopSection = false }) => {
  return (
    <Box sx={{ py: 2, px: 3 }}>
      {!hideTopSection && (
        <>
          <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <BorderColorIcon color="primary" fontSize="small" />
              <Typography variant="h2" fontWeight={700}>
                {text.appName}
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {text.tagline}
            </Typography>
          </Stack>
          <Divider sx={{ mb: 3 }} />
        </>
      )}

      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mb: 3 }}
      >
        {text.footer.madeBy}
      </Typography>

      <Stack direction="row" justifyContent="center" spacing={1}>
        <Button
          component="a"
          href={text.footer.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="outlined"
          startIcon={<LinkedInIcon />}
          size="small"
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          LinkedIn
        </Button>
        <Button
          component="a"
          href={text.footer.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="outlined"
          startIcon={<GitHubIcon />}
          size="small"
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          GitHub
        </Button>
      </Stack>
    </Box>
  );
};
