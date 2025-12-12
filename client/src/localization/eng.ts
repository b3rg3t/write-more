export const text = {
  appName: "Write More",
  notes: {
    notesForm: {
      titleNew: "New Note",
      titleEdit: "Edit Note",
      titleUnknown: "Unknown Note",
      buttons: {
        submit: "Submit",
        cancel: "Cancel",
      },
      helperText: {
        nameRequired: "Name is required",
        contentRequired: "Content is required",
      },
    },
    noteItem: {
      created: "Created",
      updated: "Updated",
    },
    deleteNote: {
      title: "Delete Note",
      confirmation: "Are you sure you want to delete '{title}'? This action cannot be undone.",
      confirm: "Delete",
      cancel: "Cancel",
    },
  },
  errors: {
    root: "An error occurred",
  },
} as const;
