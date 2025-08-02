---
applyTo: 'api-server/**'
---

# Project Overview

This project is the implementation of the API server. It implements presenters to transform data between the client and the application layer, and controllers to receive client requests, invoke the corresponding use cases to handle business logic, and finally return the results to the client.

## Coding Standards

### API Controller Specification (`api-server/src/**/*.controller.ts`):

#### API Response Specification

- Always define DTOs (Data Transfer Objects) for both request and response.

HTTP response status codes:

Common Response Codes:

- Bad request: 400 Bad Request
- Forbidden: 403 Forbidden
- Not found: 404 Not Found
- Conflict: 409 Conflict

Create (POST):

- Created successfully: 201 Created, and return the new resource data

Read (GET):

- Query successful: 200 OK

Update (PUT/PATCH):

- Update successful: 204 No Content

Delete (DELETE):

- Delete successful: 204 No Content

API response data format:

200 or 201 response format:

- `data`: The response data is always in this field; it can be an object, array, string, etc.
- `pagination`: This field may be present depending on the API design (see the `Pagination` type in `api-server/src/types.ts`).

Example:

```json
{
  "data": {},
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

204 response format:

- No response body.

Error Handling:

- If the error is:
  `ValidationError` (`import { ValidationError } from '@ca/core'`), return 400 Bad Request.
  `NoPermissionError` (`import { NoPermissionError } from '@ca/core'`), return 403 Forbidden.
  `NotFoundError` (`import { NotFoundError } from '@ca/core'`), return 404 Not Found.
  `ConflictError` (`import { ConflictError } from '@ca/core'`), return 409 Conflict.
- If the error is a subclass of `BaseError` (`import { BaseError } from '@ca/core'`), return 500 Internal Server Error.

API response error format:

- `error`: This field is only present in error responses. The type is defined in `api-server/src/types.ts`.

Example:

```json
{
  "error": {
    "errorCode": "ERROR_CODE",
    "message": "Error message"
  }
}
```
