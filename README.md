# Clean Architecture

This is a simple project demonstrating the [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) structure, emphasizing layered design, maintainability, and testability.

---

## Prerequisites

Before you begin, please make sure you have installed the following tools:

- **Node.js**: v22.11.0  
- **Docker**: v20.10.20  

---

## Quick Start

### 1. Setup

```bash
npm install

copy database/.env.example database/.env
copy ui/web-app/.env.example ui/web-app/.env

# Start the Postgres database Docker
docker compose -f ./database/docker-compose.postgres.yml up

# Open a new terminal window
npm run db:migrate -w @ca/database
# Seed essential system data
npm run db:seed -w @ca/database

npm run build -w @ca/core
npm run build -w @ca/application
npm run build -w @ca/database
```

### 2. Start API Server

```bash
npm run dev -w @ca/api-server
```

### 3. Start Frontend

```bash
npm run dev -w @ca/web-app
```

---

## Architecture Layer Description

This project follows Clean Architecture principles and divides the code into the following layers:

| Layer                  | Description                                                                | Dependency Direction         |
|------------------------|---------------------------------------------------------------------------|-----------------------------|
| Entities               | Represents enterprise business rules, most stable and least likely to change | No dependencies, innermost   |
| Use Cases              | Represents application business logic, defines system operation flows        | Depends on Entities          |
| Interface Adapters     | Converts data to formats suitable for Use Cases and Entities, connects external systems (e.g., database, Web) | Depends on Use Cases         |
| Frameworks & Drivers   | Outermost layer, includes database, web frameworks, and technical details   | Depends on Interface Adapters|

Dependency Rule:

> "Code dependencies can only point inward."

This means that in the concentric circle structure of Clean Architecture, the more inner the code, the more abstract and stable it is, while the outer code is concrete technical implementation. Dependencies can only go from outer to inner; inner layers should not know about the existence of outer layers.

---

## Layer Details

### Entities

> Entities encapsulate Enterprise wide business rules. An entity can be an object with methods, or it can be a set of data structures and functions. It doesn’t matter so long as the entities could be used by many different applications in the enterprise.
>
> If you don’t have an enterprise, and are just writing a single application, then these entities are the business objects of the application. They encapsulate the most general and high-level rules. They are the least likely to change when something external changes. For example, you would not expect these objects to be affected by a change to page navigation, or security. No operational change to any particular application should affect the entity layer.

**Description:**

Represents the core business rules of the entire enterprise or application. Features:
- Encapsulates enterprise-level business logic: These are the most stable and least likely to change parts of the system.
- Highly reusable: Entities can be shared by multiple applications, as they represent general business concepts.
- Technology agnostic: Entities should not depend on any external frameworks, databases, UI, or other technical details.

Corresponds to the `/core` folder.

---

### Use Cases

> The software in this layer contains application specific business rules. It encapsulates and implements all of the use cases of the system. These use cases orchestrate the flow of data to and from the entities, and direct those entities to use their enterprise wide business rules to achieve the goals of the use case.
>
>We do not expect changes in this layer to affect the entities. We also do not expect this layer to be affected by changes to externalities such as the database, the UI, or any of the common frameworks. This layer is isolated from such concerns.
>
> We do, however, expect that changes to the operation of the application will affect the use-cases and therefore the software in this layer. If the details of a use-case change, then some code in this layer will certainly be affected.

**Description:**

Responsible for handling "application-specific business logic":

- Only operates on abstract interfaces (such as repository, services), without concern for implementation details. For example: the application layer only needs to operate on the repository interface, without knowing the storage method (file, database, etc.).
- Does not depend on external technologies: Use Cases should not know about the existence of databases, UI, or frameworks.

Corresponds to the `/application` folder.

---

### Interface Adapters

> The software in this layer is a set of adapters that convert data from the format most convenient for the use cases and entities, to the format most convenient for some external agency such as the Database or the Web. It is this layer, for example, that will wholly contain the MVC architecture of a GUI. The Presenters, Views, and Controllers all belong in here. The models are likely just data structures that are passed from the controllers to the use cases, and then back from the use cases to the presenters and views.
>
> Similarly, data is converted, in this layer, from the form most convenient for entities and use cases, into the form most convenient for whatever persistence framework is being used. i.e. The Database. No code inward of this circle should know anything at all about the database. If the database is a SQL database, then all the SQL should be restricted to this layer, and in particular to the parts of this layer that have to do with the database.
>
> Also in this layer is any other adapter necessary to convert data from some external form, such as an external service, to the internal form used by the use cases and entities.

**Description:**

Acts as a "bridge", responsible for converting data formats between layers, enabling collaboration without violating dependency rules.

Data format conversion:
- Converts data from Use Cases / Entities format to the format required by external systems (such as database, Web, UI)
- Also responsible for converting external input (such as HTTP Request, DB Row) into a format that Use Cases can understand

Components included:
- Presenter, View, Controller in MVC architecture all belong to this layer
- Database access logic (Repository, DAO) is also in this layer
- API Adapter, DTO Mapper, ViewModel Builder, and other converters

Dependency rules:
- This layer can depend on Use Case and Entity, but not vice versa
- All database-related code (such as SQL) should only exist in this layer, and not leak into Use Case or Entity layers

`/database`: Responsible for data format conversion, allowing the Use Case layer to communicate smoothly with the database driver. You can implement the repository interface in any way, such as Prisma, pg-lite, plain text file storage, etc.

`/api-server`: Responsible for data format conversion, allowing the Use Case layer to communicate smoothly with the frontend or client. The API server can use any technology, such as Express, NestJS, GraphQL, tRPC, etc.

---

### Frameworks and Drivers

> The outermost layer is generally composed of frameworks and tools such as the Database, the Web Framework, etc. Generally you don’t write much code in this layer other than glue code that communicates to the next circle inwards.
>
> This layer is where all the details go. The Web is a detail. The database is a detail. We keep these things on the outside where they can do little harm.

**Description:**

Represents all "technical details" and "external tools" in the system, with the following design principles and roles:
- Web frameworks (such as ASP.NET, Spring, Express)
- Databases (such as MySQL, MongoDB, PostgreSQL)
- UI technologies (such as React, Angular, Flutter)
- Third-party tools and libraries (such as logging, authentication, messaging)

For example:
- Database, API server, UI, etc., usually directly use third-party libraries.
- `/ui/web-app`: Implements the web UI. UI can also be desktop, mobile, CLI, etc.

This layer is only responsible for glue code to communicate with the system, with details concentrated here to avoid affecting core logic.

---

## Crossing Boundaries

How data and control flow from the outer layer (such as Controller, Presenter) into the inner layer (such as Use Case), while adhering to the Dependency Rule.

Use: Dependency Inversion Principle

Specific approach:
- Use Case defines an interface (such as OutputPort)
- Presenter implements this interface
- Use Case calls this interface, rather than directly depending on Presenter

This allows control flow from Use Case to Presenter, but the dependency direction remains inward, conforming to architectural principles.

---

## Framework Selection Risks

Frameworks can accelerate development, but some frameworks have preset layered architectures, which may limit flexibility and should be chosen carefully. Over-reliance on frameworks may limit future maintenance and expansion due to framework design.

---

## Additional Clarification

**Q: Do I have to use a monorepo and split the project this way?**

A: Not necessarily. You can put all backend code in the same project and only separate frontend and backend. This project is just a demonstration of layered architecture; actual projects can be adjusted as needed.

---

## References

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
