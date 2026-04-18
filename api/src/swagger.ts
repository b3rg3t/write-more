import swaggerJSDoc from "swagger-jsdoc";

const requestBodyWithSample = (example: Record<string, unknown>) => ({
  required: true,
  content: {
    "application/json": {
      schema: {
        type: "object",
        additionalProperties: true,
      },
      example,
    },
  },
});

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Write More API",
      version: "1.0.0",
      description: "Swagger documentation for all Write More API requests.",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server",
      },
    ],
    tags: [
      { name: "Auth" },
      { name: "Notes" },
      { name: "Todos" },
      { name: "Trips" },
      { name: "Users" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        MessageResponse: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    paths: {
      "/api/auth/signup": {
        post: {
          tags: ["Auth"],
          summary: "Create a new account",
          requestBody: requestBodyWithSample({
            email: "new-user@example.com",
            password: "StrongPassword123!",
            firstName: "Alex",
            lastName: "Walker",
          }),
          responses: {
            "200": { description: "Signup successful" },
          },
        },
      },
      "/api/auth/signin": {
        post: {
          tags: ["Auth"],
          summary: "Sign in and receive token",
          requestBody: requestBodyWithSample({
            email: "new-user@example.com",
            password: "StrongPassword123!",
          }),
          responses: {
            "200": { description: "Signin successful" },
          },
        },
      },
      "/api/auth/me": {
        get: {
          tags: ["Auth"],
          summary: "Get current authenticated user",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": { description: "Current user fetched" },
            "401": { description: "Unauthorized" },
          },
        },
      },
      "/api/notes": {
        get: {
          tags: ["Notes"],
          summary: "Get all notes",
          security: [{ bearerAuth: [] }],
          responses: { "200": { description: "Notes fetched" } },
        },
        post: {
          tags: ["Notes"],
          summary: "Create note",
          security: [{ bearerAuth: [] }],
          requestBody: requestBodyWithSample({
            title: "Packing checklist",
            text: "Passport, charger, power bank.",
            tripId: "6617f2dd2f8f25d189f74c42",
          }),
          responses: { "200": { description: "Note created" } },
        },
      },
      "/api/notes/{id}": {
        get: {
          tags: ["Notes"],
          summary: "Get a note by id",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { "200": { description: "Note fetched" } },
        },
        put: {
          tags: ["Notes"],
          summary: "Update a note",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: requestBodyWithSample({
            title: "Updated packing checklist",
            text: "Passport, charger, adapter.",
            isPinned: true,
          }),
          responses: { "200": { description: "Note updated" } },
        },
        delete: {
          tags: ["Notes"],
          summary: "Delete a note",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { "200": { description: "Note deleted" } },
        },
      },
      "/api/notes/order": {
        patch: {
          tags: ["Notes"],
          summary: "Update note order",
          security: [{ bearerAuth: [] }],
          requestBody: requestBodyWithSample({
            noteIds: ["6617f2dd2f8f25d189f74c42", "6617f2dd2f8f25d189f74c43"],
          }),
          responses: { "200": { description: "Note order updated" } },
        },
      },
      "/api/todos": {
        get: {
          tags: ["Todos"],
          summary: "Get all todos",
          security: [{ bearerAuth: [] }],
          responses: { "200": { description: "Todos fetched" } },
        },
        post: {
          tags: ["Todos"],
          summary: "Create todo",
          security: [{ bearerAuth: [] }],
          requestBody: requestBodyWithSample({
            title: "Book airport transfer",
            isDone: false,
            tripId: "6617f2dd2f8f25d189f74c42",
          }),
          responses: { "200": { description: "Todo created" } },
        },
      },
      "/api/todos/{id}": {
        get: {
          tags: ["Todos"],
          summary: "Get todo by id",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { "200": { description: "Todo fetched" } },
        },
        put: {
          tags: ["Todos"],
          summary: "Update todo",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: requestBodyWithSample({
            title: "Book shuttle transfer",
            isDone: true,
          }),
          responses: { "200": { description: "Todo updated" } },
        },
        delete: {
          tags: ["Todos"],
          summary: "Delete todo",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { "200": { description: "Todo deleted" } },
        },
      },
      "/api/todos/order": {
        patch: {
          tags: ["Todos"],
          summary: "Update todo order",
          security: [{ bearerAuth: [] }],
          requestBody: requestBodyWithSample({
            todoIds: ["6617f2dd2f8f25d189f74c52", "6617f2dd2f8f25d189f74c53"],
          }),
          responses: { "200": { description: "Todo order updated" } },
        },
      },
      "/api/trips": {
        get: {
          tags: ["Trips"],
          summary: "Get trips for authenticated user",
          security: [{ bearerAuth: [] }],
          responses: { "200": { description: "Trips fetched" } },
        },
        post: {
          tags: ["Trips"],
          summary: "Create trip",
          security: [{ bearerAuth: [] }],
          requestBody: requestBodyWithSample({
            title: "Tokyo Spring Trip",
            startDate: "2026-04-20",
            endDate: "2026-04-30",
          }),
          responses: { "200": { description: "Trip created" } },
        },
      },
      "/api/trips/admin/all": {
        get: {
          tags: ["Trips"],
          summary: "Get all trips (admin)",
          security: [{ bearerAuth: [] }],
          responses: { "200": { description: "All trips fetched" } },
        },
      },
      "/api/trips/order": {
        patch: {
          tags: ["Trips"],
          summary: "Update trip order",
          requestBody: requestBodyWithSample({
            tripIds: ["6617f2dd2f8f25d189f74d10", "6617f2dd2f8f25d189f74d11"],
          }),
          responses: { "200": { description: "Trip order updated" } },
        },
      },
      "/api/trips/{id}": {
        get: {
          tags: ["Trips"],
          summary: "Get trip by id",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { "200": { description: "Trip fetched" } },
        },
        put: {
          tags: ["Trips"],
          summary: "Update trip",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: requestBodyWithSample({
            title: "Tokyo Spring Trip (Updated)",
            endDate: "2026-05-01",
            description: "Extended by one day.",
          }),
          responses: { "200": { description: "Trip updated" } },
        },
        delete: {
          tags: ["Trips"],
          summary: "Delete trip",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { "200": { description: "Trip deleted" } },
        },
      },
      "/api/trips/{tripId}/todos": {
        post: {
          tags: ["Trips"],
          summary: "Create todo for trip",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "tripId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: requestBodyWithSample({
            title: "Buy JR pass",
            isDone: false,
          }),
          responses: { "200": { description: "Trip todo created" } },
        },
      },
      "/api/trips/{tripId}/notes": {
        post: {
          tags: ["Trips"],
          summary: "Create note for trip",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "tripId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: requestBodyWithSample({
            title: "Hotel check-in",
            text: "Check-in starts at 15:00.",
          }),
          responses: { "200": { description: "Trip note created" } },
        },
      },
      "/api/trips/{id}/users": {
        post: {
          tags: ["Trips"],
          summary: "Add user to trip",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: requestBodyWithSample({
            userId: "6617f2dd2f8f25d189f74e20",
          }),
          responses: { "200": { description: "User added to trip" } },
        },
      },
      "/api/trips/{id}/users/{userId}": {
        delete: {
          tags: ["Trips"],
          summary: "Remove user from trip",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
            {
              name: "userId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { "200": { description: "User removed from trip" } },
        },
      },
      "/api/trips/{id}/image": {
        post: {
          tags: ["Trips"],
          summary: "Upload trip image (compressed to WebP)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["image"],
                  properties: {
                    image: {
                      type: "string",
                      format: "binary",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Trip image uploaded" },
            "400": { description: "Invalid file or request" },
            "401": { description: "Unauthorized" },
            "404": { description: "Trip not found" },
            "413": { description: "File too large" },
          },
        },
      },
      "/api/trips/{id}/images": {
        get: {
          tags: ["Trips"],
          summary: "Get all images for a trip",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": { description: "Trip images fetched" },
            "401": { description: "Unauthorized" },
            "404": { description: "Trip not found" },
          },
        },
      },
      "/api/trips/{id}/images/{imageId}": {
        get: {
          tags: ["Trips"],
          summary: "Get one image file for a trip (snapshot by default)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
            {
              name: "imageId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
            {
              name: "snapshot",
              in: "query",
              required: false,
              schema: { type: "string", enum: ["true", "false"] },
              description:
                "Defaults to true. Set snapshot=false to return full resolution.",
            },
          ],
          responses: {
            "200": { description: "Trip image file streamed" },
            "400": { description: "Invalid image id" },
            "401": { description: "Unauthorized" },
            "404": { description: "Trip or image not found" },
          },
        },
      },
      "/api/users": {
        get: {
          tags: ["Users"],
          summary: "Get all users",
          responses: { "200": { description: "Users fetched" } },
        },
        post: {
          tags: ["Users"],
          summary: "Create user",
          requestBody: requestBodyWithSample({
            email: "friend@example.com",
            password: "AnotherStrongPass123!",
            role: "USER",
          }),
          responses: { "200": { description: "User created" } },
        },
      },
      "/api/users/{id}": {
        get: {
          tags: ["Users"],
          summary: "Get user by id",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { "200": { description: "User fetched" } },
        },
        put: {
          tags: ["Users"],
          summary: "Update user",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: requestBodyWithSample({
            firstName: "Taylor",
            lastName: "Morgan",
            role: "ADMIN",
          }),
          responses: { "200": { description: "User updated" } },
        },
        delete: {
          tags: ["Users"],
          summary: "Delete user",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { "200": { description: "User deleted" } },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
