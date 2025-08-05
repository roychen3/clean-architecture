# Clean Architecture

這是一個簡單演示 [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) 架構的專案，強調分層設計、可維護性與可測試性。

---

## Prerequisites

開始之前，請確保你已安裝以下工具：

- **Node.js**：v22.11.0  
- **Docker**：v20.10.20  

---

## Quick Start

### 1. Setup

```bash
npm install

copy database/.env.example database/.env
copy ui/web-app/.env.example ui/web-app/.env

# 啟動 Postgres 資料庫的 Docker
docker compose -f ./database/docker-compose.postgres.yml up

# 開啟新終端機視窗
npm run db:migrate -w @ca/database
# 建立系統必要資料
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

## 架構分層說明

本專案依循 Clean Architecture 原則，將程式碼分為以下幾層：

| 層級                  | 說明                                                                | 依賴方向                 |
|----------------------|---------------------------------------------------------------------|------------------------|
| Entities             | 表示企業級的業務規則，最穩定、最不易改變                                   | 無依賴，最內層           |
| Use Cases            | 表示應用程式的業務邏輯，定義系統的操作流程                                 | 依賴 Entities           |
| Interface Adapters   | 將資料轉換為適合 Use Cases 和 Entities 的格式，連接外部系統（如資料庫、Web） | 依賴 Use Cases          |
| Frameworks & Drivers | 最外層，包含資料庫、Web 框架等技術細節                                    | 依賴 Interface Adapters |

Dependency Rule（依賴規則） 指的是：

>「程式碼的依賴只能指向內層。」

這意味著在 Clean Architecture 的同心圓架構中，越內層的程式碼越抽象、越穩定，而外層的程式碼則是具體的技術實作。依賴只能由外向內，內層不能知道外層的存在。

---

## 各層詳細介紹

### Entities

> Entities encapsulate Enterprise wide business rules. An entity can be an object with methods, or it can be a set of data structures and functions. It doesn’t matter so long as the entities could be used by many different applications in the enterprise.
>
> If you don’t have an enterprise, and are just writing a single application, then these entities are the business objects of the application. They encapsulate the most general and high-level rules. They are the least likely to change when something external changes. For example, you would not expect these objects to be affected by a change to page navigation, or security. No operational change to any particular application should affect the entity layer.

**說明：**

代表整個企業或應用的核心業務規則。它們具有以下特性：
- 封裝企業級的商業邏輯：這些邏輯是整個系統中最穩定、最不容易改變的部分。
- 可重用性高：Entities 可以被多個應用程式共用，因為它們代表的是通用的業務概念。
- 技術無關性：Entities 不應依賴任何外部框架、資料庫、UI 或其他技術細節。

對應到 `/core` 資料夾。

---

### Use Cases

> The software in this layer contains application specific business rules. It encapsulates and implements all of the use cases of the system. These use cases orchestrate the flow of data to and from the entities, and direct those entities to use their enterprise wide business rules to achieve the goals of the use case.
>
>We do not expect changes in this layer to affect the entities. We also do not expect this layer to be affected by changes to externalities such as the database, the UI, or any of the common frameworks. This layer is isolated from such concerns.
>
> We do, however, expect that changes to the operation of the application will affect the use-cases and therefore the software in this layer. If the details of a use-case change, then some code in this layer will certainly be affected.

**說明：**

負責處理「應用程式特定的業務邏輯」:

- 只操作抽象介面（如 repository, services），不關注實作細節。例如：application 層只需操作 repository 介面，不需知道資料儲存方式（檔案、資料庫等）。
- 不依賴外部技術：Use Cases 不應知道資料庫、UI 或框架的存在。

對應到 `/application` 資料夾。

---

### Interface Adapters

> The software in this layer is a set of adapters that convert data from the format most convenient for the use cases and entities, to the format most convenient for some external agency such as the Database or the Web. It is this layer, for example, that will wholly contain the MVC architecture of a GUI. The Presenters, Views, and Controllers all belong in here. The models are likely just data structures that are passed from the controllers to the use cases, and then back from the use cases to the presenters and views.
>
> Similarly, data is converted, in this layer, from the form most convenient for entities and use cases, into the form most convenient for whatever persistence framework is being used. i.e. The Database. No code inward of this circle should know anything at all about the database. If the database is a SQL database, then all the SQL should be restricted to this layer, and in particular to the parts of this layer that have to do with the database.
>
> Also in this layer is any other adapter necessary to convert data from some external form, such as an external service, to the internal form used by the use cases and entities.

**說明：**

扮演的是「橋接」的角色，負責將資料在不同層之間轉換格式，使各層能夠彼此協作而不違反依賴規則

資料格式轉換
- 將資料從 Use Cases / Entities 的格式 轉換成 外部系統（如資料庫、Web、UI）所需的格式
- 也負責將外部輸入（如 HTTP Request、DB Row）轉換成 Use Case 能理解的格式

包含的元件
- MVC 架構中的 Presenter、View、Controller 都屬於這一層
- 資料庫存取邏輯（Repository、DAO） 也在這一層
- API Adapter、DTO Mapper、ViewModel Builder 等轉換器

依賴規則
- 這一層可以依賴 Use Case 和 Entity，但反過來不行
- 所有資料庫相關的程式碼（如 SQL）應該只存在於這一層，不能滲透到 Use Case 或 Entity 層

`/database`：負責資料格式轉換，讓 Use Case 層能與資料庫驅動順利溝通。你可以用任何方式實作 repository 介面，例如：Prisma、pg-lite、單純文字檔儲存等。

`/api-server`：負責資料格式轉換，讓 Use Case 層能與前端或 client 端順利溝通。API server 可採用任意技術，例如 Express、NestJS、GraphQL、tRPC 等。

---

### Frameworks and Drivers

> The outermost layer is generally composed of frameworks and tools such as the Database, the Web Framework, etc. Generally you don’t write much code in this layer other than glue code that communicates to the next circle inwards.
>
> This layer is where all the details go. The Web is a detail. The database is a detail. We keep these things on the outside where they can do little harm.

**說明：**

代表系統中所有「技術細節」與「外部工具」，其設計原則與角色如下：
- Web 框架（如 ASP.NET、Spring、Express）
- 資料庫（如 MySQL、MongoDB、PostgreSQL）
- UI 技術（如 React、Angular、Flutter）
- 第三方工具與函式庫（如 logging、authentication、messaging）

例如:
- 資料庫、API server、UI 等，通常直接使用第三方 library。
- `/ui/web-app`：實作網頁 UI。UI 亦可為桌面、手機、CLI 等介面。

此層僅負責與系統溝通的膠合程式碼，細節集中於此，避免影響核心邏輯。

---

## 跨越邊界

資料與控制流程如何從外層（如 Controller、Presenter）進入內層（如 Use Case），並且如何遵守 Dependency Rule 的原則。

使用：依賴反轉原則（Dependency Inversion Principle）

具體做法如下：
- Use Case 定義一個介面（例如 OutputPort）
- Presenter 實作這個介面
- Use Case 呼叫這個介面，而不是直接依賴 Presenter

這樣就能讓控制流程從 Use Case 流向 Presenter，但依賴方向仍然向內，符合架構原則。

---

## 選擇框架的風險

框架能加速開發，但有些框架已預設分層架構，可能限制彈性，需謹慎選擇。若過度依賴框架，未來維護與擴充可能受限於框架設計。

---

## 模糊定義補充

**Q: 一定要使用 monorepo 把專案拆這麼細嗎？**

A: 不一定。你可以將後端全部放在同一個專案，只拆分前後端。本專案僅為示範分層架構，實際專案可依需求調整。

---

## 參考資料

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
