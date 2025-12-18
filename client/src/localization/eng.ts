export const text = {
  appName: "Write More",
  notes: {
    header: "Notes",
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
      createTodo: "Create Todo",
    },
    noteDetail: {
      loading: "Loading...",
      notFound: "Note not found",
    },
    deleteNote: {
      title: "Delete Note",
      titleUnknown: "Unknown Note",
      confirmation:
        "Are you sure you want to delete '{title}'? This action cannot be undone.",
      buttons: { confirm: "Delete", cancel: "Cancel" },
    },
  },
  todos: {
    header: "Todos",
    todosForm: {
      titleNew: "New Todo",
      titleEdit: "Edit Todo",
      titleUnknown: "Unknown Todo",
      buttons: {
        submit: "Submit",
        cancel: "Cancel",
      },
      helperText: {
        nameRequired: "Name is required",
      },
    },
    todosList: {
      loading: "Loading todos",
      noTodos: "Create a new todo to get started!",
      createTodo: "Create Todo",
      fetchError: "Failed to load todos. Please try again.",
    },
    todoDetail: {
      loading: "Loading...",
      notFound: "Todo not found",
    },
  },
  trips: {
    header: "Trips",
    tripsForm: {
      titleNew: "New Trip",
      titleEdit: "Edit Trip",
      titleUnknown: "Unknown Trip",
      buttons: {
        submit: "Submit",
        cancel: "Cancel",
      },
      helperText: {
        titleRequired: "Title is required",
      },
    },
    deleteTrip: {
      title: "Delete Trip",
      titleUnknown: "Unknown Trip",
      confirmation:
        "Are you sure you want to delete '{title}'? This action cannot be undone.",
      buttons: { confirm: "Delete", cancel: "Cancel" },
    },
    tripsList: {
      loading: "Loading trips",
      noTrips: "Create a new trip to get started!",
      createTrip: "Create Trip",
      fetchError: "Failed to load trips. Please try again.",
    },
    tripDetail: {
      loading: "Loading trip",
      notFound: "Trip not found",
    },
  },
  errors: {
    root: "An error occurred",
  },
} as const;
