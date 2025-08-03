---
applyTo: 'application/**'
---

# Project Overview

This project is the application layer of Clean Architecture, implementing use case business logic using objects from the core layer.

## Coding Standards

- A Use Case can only have one `execute` method.
- The `execute` method of a Use Case must define DTOs (Data Transfer Objects): `*RequestDTO`, `*ResponseDTO`.
- Exceptions thrown by a Use Case must be subclasses of `BaseError` (`import { BaseError } from '@ca/core';`).
- The number of `*UseCase` classes must match the number of `*UseCaseError` classes (`*UseCaseError extends BaseError {...}`).
- If the `execute` method of a Use Case has specific error cases, a corresponding `SomeSpecificError extends BaseError {...}` class must be added.
- If the permission check in a Use Case fails, a `NoPermissionError` (`application/src/services/permission-service/error.ts`) must be thrown.

### Example of a Use Case Error

```typescript
import { BaseError } from '@ca/core';

export class TemplateUseCaseError extends BaseError {
  constructor(error?: Error) {
    super({
      name: 'TemplateUseCaseError',
      errorCode: 'TEMPLATE_USE_CASE_ERROR',
      message: 'Failed to execute the template use case.',
      cause: error,
    });
  }
}
```

### Example of a Use Case

```typescript
import { BaseError, NoPermissionError } from '@ca/core';

import { PermissionService } from '../../services';

import { TemplateUseCaseError } from './template.errors';

export type TemplateRequestDTO = {}; // Define the request DTO structure as needed

export type TemplateResponseDTO = {}; // Define the response DTO structure as needed

export class TemplateUseCase {
  private permissionService: PermissionService;

  constructor(options: {
    // Inject dependencies e.g. repositories, services...etc.
    permissionService: PermissionService;
  }) {
    // Initialize other dependencies if needed
    this.permissionService = options.permissionService;
  }

  async execute(
    request: TemplateRequestDTO,
    executer: string
  ): Promise<TemplateResponseDTO> {
    try {
      const can = await this.permissionService.can(
        executer,
        'action',
        'resource'
      );
      if (!can) {
        throw new NoPermissionError();
      }

      // Implement functionality
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new TemplateUseCaseError(
        error instanceof Error ? error : undefined
      );
    }
  }
}
```
