# Application Layer

This project is the Application Layer of Clean Architecture, responsible for implementing specific business logic (Use Cases) and defining abstract interfaces required to operate Use Cases for implementation by external layers.

## Main Responsibilities

- Implement specific business logic (Use Cases)
- Define Data Transfer Objects (DTOs)
- Manage permission checks and error handling
- Provide abstract interfaces to facilitate external dependency inversion

## Architecture Description

- Each Use Case contains only one `execute` method.
- The `execute` method must define Request/Response DTOs.
- All errors must inherit from `BaseError`.
- When permissions are insufficient, a `NoPermissionError` must be thrown.
- According to Clean Architecture principles, the application layer must not directly depend on infrastructure.

## System Overview

This application is a simple blog system with the following features:

- Member registration
- Users can write articles
- Role-based access control
- A role with a priority of 0 means the role has no permissions at all; even if it is assigned all resources and actions, it cannot perform any operations
- Default account: [mail]superadmin@mail.com, [password]superadmin
- Default roles: super-admin and user
