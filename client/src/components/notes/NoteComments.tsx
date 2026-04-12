import {
  Button,
  Box,
  CircularProgress,
  Divider,
  FormGroup,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FC, MouseEvent, useMemo, useState } from "react";
import { text } from "../../localization/eng";
import { IComment } from "../../models/interface/IComment";
import { INote } from "../../models/interface/INote";
import SendIcon from "@mui/icons-material/Send";
import AddCommentIcon from "@mui/icons-material/AddComment";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {
  useCreateCommentForNoteMutation,
  useDeleteCommentMutation,
  useGetCurrentUserQuery,
  useGetCommentsQuery,
  useUpdateCommentMutation,
} from "../../store/reducers/api/apiSlice";

export const NoteComments: FC<{ note: INote }> = ({ note }) => {
  const [newComment, setNewComment] = useState("");
  const [isCommentFormVisible, setIsCommentFormVisible] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const {
    data: fetchedComments,
    isLoading: isLoadingComments,
    error: commentsError,
  } = useGetCommentsQuery(note._id);
  const { data: currentUserResponse } = useGetCurrentUserQuery();
  const [createCommentForNote, { isLoading: isCreatingComment }] =
    useCreateCommentForNoteMutation();
  const [updateComment, { isLoading: isUpdatingComment }] =
    useUpdateCommentMutation();
  const [deleteComment, { isLoading: isDeletingComment }] =
    useDeleteCommentMutation();

  const comments = useMemo(() => {
    if (fetchedComments) {
      return fetchedComments;
    }

    return (note.commentIds || []).filter(
      (comment): comment is IComment => typeof comment !== "string",
    );
  }, [fetchedComments, note.commentIds]);

  const handleCreateComment = async () => {
    const content = newComment.trim();

    if (!content) {
      return;
    }

    try {
      await createCommentForNote({
        noteId: note._id,
        content,
      }).unwrap();
      setNewComment("");
      setIsCommentFormVisible(false);
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  const handleContainerClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  const handleOpenCommentForm = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setIsCommentFormVisible(true);
  };

  const handleCloseCommentForm = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setIsCommentFormVisible(false);
    setNewComment("");
  };

  const handleEditCommentStart = (comment: IComment) => {
    setEditingCommentId(comment._id);
    setEditingContent(comment.content);
  };

  const handleEditCommentCancel = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

  const handleEditCommentSave = async () => {
    if (!editingCommentId) {
      return;
    }

    const content = editingContent.trim();
    if (!content) {
      return;
    }

    try {
      await updateComment({ id: editingCommentId, content }).unwrap();
      handleEditCommentCancel();
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment({ id: commentId }).unwrap();
      if (editingCommentId === commentId) {
        handleEditCommentCancel();
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const commentTexts = text.notes.noteItem.comments;
  const currentUserId = currentUserResponse?.user?._id;

  return (
    <Box onClick={handleContainerClick} sx={{ mt: 1, mr: 1 }}>
      <Divider sx={{ mb: 1 }} />{" "}
      {!isCommentFormVisible ? (
        <Button
          variant="outlined"
          size="small"
          onClick={handleOpenCommentForm}
          startIcon={<AddCommentIcon fontSize="small" />}
          sx={{ my: 1, textTransform: "none" }}
        >
          {commentTexts.add}
        </Button>
      ) : (
        <FormGroup sx={{ width: "100%", px: 0, pb: 0, pt: 1 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
            <TextField
              fullWidth
              autoFocus
              label={commentTexts.title}
              size="small"
              placeholder={commentTexts.placeholder}
              value={newComment}
              onChange={(event) => setNewComment(event.target.value)}
              onClick={handleContainerClick}
              onKeyDown={(event) => {
                event.stopPropagation();
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void handleCreateComment();
                }
              }}
            />
            <IconButton
              size="small"
              color="primary"
              edge="end"
              aria-label={commentTexts.submit}
              disabled={isCreatingComment || !newComment.trim()}
              onClick={() => void handleCreateComment()}
              sx={{ pr: 0.5 }}
            >
              <SendIcon />
            </IconButton>
            <IconButton
              size="small"
              color="inherit"
              edge="end"
              aria-label={commentTexts.cancel}
              disabled={isCreatingComment}
              onClick={handleCloseCommentForm}
              sx={{ pr: 0.5 }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </FormGroup>
      )}
      {isLoadingComments ? (
        <Stack direction="row" spacing={1} alignItems="center">
          <CircularProgress size={16} />
          <Typography variant="body2" color="text.secondary">
            {commentTexts.loading}
          </Typography>
        </Stack>
      ) : commentsError ? (
        <Typography variant="body2" color="error">
          {commentTexts.error}
        </Typography>
      ) : comments.length === 0 ? (
        <></>
      ) : (
        <Stack spacing={1}>
          {comments.map((comment) => (
            <Box
              key={comment._id}
              sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
                px: 1,
                py: 0.75,
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={1}
                sx={{ mb: 0.5 }}
              >
                <Typography variant="subtitle2">
                  {comment.user.name || comment.user.username}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  {comment.isEdited ? (
                    <Typography variant="caption" color="text.secondary">
                      {commentTexts.edited}
                    </Typography>
                  ) : null}
                  {comment.user._id === currentUserId ? (
                    <>
                      <IconButton
                        size="small"
                        aria-label={commentTexts.edit}
                        onClick={() => handleEditCommentStart(comment)}
                      >
                        <EditIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton
                        size="small"
                        aria-label={commentTexts.delete}
                        disabled={isDeletingComment}
                        onClick={() => void handleDeleteComment(comment._id)}
                      >
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </>
                  ) : null}
                </Stack>
              </Stack>

              {editingCommentId === comment._id ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    fullWidth
                    size="small"
                    value={editingContent}
                    onChange={(event) => setEditingContent(event.target.value)}
                    onClick={handleContainerClick}
                    onKeyDown={(event) => {
                      event.stopPropagation();
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void handleEditCommentSave();
                      }
                    }}
                  />
                  <IconButton
                    size="small"
                    aria-label={commentTexts.save}
                    disabled={isUpdatingComment || !editingContent.trim()}
                    onClick={() => void handleEditCommentSave()}
                  >
                    <CheckIcon fontSize="inherit" />
                  </IconButton>
                  <IconButton
                    size="small"
                    aria-label={commentTexts.cancel}
                    onClick={handleEditCommentCancel}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                </Stack>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ whiteSpace: "pre-wrap" }}
                >
                  {comment.content}
                </Typography>
              )}
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};
