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
        urlValid: "Please enter a valid URL",
      },
      links: {
        name: "Link name",
        url: "Link URL",
        addLink: "Add Link",
      },
    },
    noteItem: {
      created: "Created",
      updated: "Updated",
    },
    notesList: {
      loading: "Loading notes",
      noNotes: "Create a new note to get started!",
      createNote: "Create Note",
      fetchError: "Failed to load notes. Please try again.",
    },
    deleteNote: {
      title: "Delete Note",
      titleUnknown: "Unknown Note",
      confirmation:
        "Are you sure you want to delete '{title}'? This action cannot be undone.",
      buttons: { confirm: "Delete", cancel: "Cancel" },
    },
  },
  errors: {
    root: "An error occurred",
  },
} as const;
