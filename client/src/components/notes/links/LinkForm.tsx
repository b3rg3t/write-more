import {
  Box,
  Button,
  Container,
  IconButton,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { FC } from "react";
import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormRegister,
  useWatch,
} from "react-hook-form";
import { TBasicNote } from "../../../models/type/TBasicNote";
import { ENoteForm } from "../../../models/enum/ENoteForm";
import { text } from "../../../localization/eng";
import CloseIcon from "@mui/icons-material/Close";
import { fontSize16 } from "../../utils/FontSize";

export const LinkForm: FC<{
  control: Control<TBasicNote>;
  register: UseFormRegister<TBasicNote>;
  errors: FieldErrors<TBasicNote>;
}> = ({ control, register, errors }) => {
  const links = useWatch({
    name: ENoteForm.LINKS,
    control,
  });
  const { fields, append, remove } = useFieldArray({
    name: ENoteForm.LINKS,
    control,
  });

  const {
    links: { name, url, addLink },
    helperText,
  } = text.notes.notesForm;

  return (
    <>
      <List
        dense
        sx={{ p: 0, display: "flex", flexDirection: "column", gap: 1 }}
      >
        <Typography variant="h3" fontSize={fontSize16}>
          Links
        </Typography>
        {fields.map((field, index) => (
          <ListItem key={field.id} sx={{ p: 0, display: "flex" }}>
            <Paper sx={{ minWidth: "100%" }}>
              <Container sx={{ px: 1, pb: 0.5 }}>
                <Container
                  disableGutters
                  sx={{
                    display: "flex",
                    alignItems: "start",
                    justifyContent: "space-between",
                    width: "100%",
                    p: 0,
                  }}
                >
                  <TextField
                    label={name}
                    fullWidth
                    margin="normal"
                    error={!!errors?.[ENoteForm.LINKS]?.[index]?.name}
                    helperText={
                      errors?.[ENoteForm.LINKS]?.[index]?.name
                        ? helperText.contentRequired
                        : ""
                    }
                    {...register(`links.${index}.${ENoteForm.NAME}` as const, {
                      required: true,
                    })}
                    defaultValue={links?.[index]?.name}
                  />
                  <IconButton
                    type="button"
                    onClick={() => remove(index)}
                    size="small"
                    sx={{ mt: 1, ml: 1 }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Container>
                <TextField
                  label={url}
                  fullWidth
                  margin="normal"
                  error={!!errors?.[ENoteForm.LINKS]?.[index]?.url}
                  helperText={
                    errors?.[ENoteForm.LINKS]?.[index]?.url?.message || ""
                  }
                  {...register(`links.${index}.${ENoteForm.URL}` as const, {
                    required: helperText.contentRequired,
                    pattern: {
                      value:
                        /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
                      message: helperText.urlValid,
                    },
                  })}
                  defaultValue={links?.[index]?.url}
                />
              </Container>
            </Paper>
          </ListItem>
        ))}
      </List>
      <Box sx={{ "& button": { m: 1 } }}>
        <Button
          type="button"
          variant="contained"
          size="small"
          onClick={() => append({ name: "", url: "" })}
        >
          {addLink}
        </Button>
      </Box>
    </>
  );
};
