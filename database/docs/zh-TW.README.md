# Database 使用說明

本專案負責實作 Application 層定義的 Repository 介面，並透過 Prisma 與 PostgreSQL 進行資料庫存取。

---

## 快速開始

### 1. 啟動本地 PostgreSQL（含 Pgweb UI）

已提供 `docker-compose.postgres.yml`，可快速啟動：

```sh
docker compose -f docker-compose.postgres.yml up
```

- PostgreSQL 服務位於 `localhost:5432`（使用者：`developer`，密碼：`dev_password`，資料庫：`ca_dev_db`）
- Pgweb UI 管理介面：[http://localhost:8081](http://localhost:8081)

### 2. 設定資料庫連線

請將 `.env.example` 複製為 `.env`，並依需求調整內容：

```env
DATABASE_URL="postgresql://developer:dev_password@localhost:5432/ca_dev_db?schema=public"
```

### 3. 初始化資料庫 Schema

執行以下指令套用初始 migration：

```sh
npm run db:init
```

### 4. 產生 Prisma Client

執行以下指令產生 Prisma Client：

```sh
npm run db:generate
```

---

## 開發相關指令

- 開啟 Prisma Studio 管理資料庫：
  ```sh
  npm run db:studio
  ```
- 當 schema 有修改時，請執行 migration：
  ```sh
  npm run db:migrate
  ```

---

## Repository 實作範例

基礎設施層提供 Application 層定義的 Repository 介面實作，並與 Prisma/PostgreSQL 整合。

```typescript
import { prisma } from '@ca/database';
import { PrismaUsersRepository } from '@ca/database';

const userRepository = new PrismaUsersRepository(prisma);
// 現在你可以將 userRepository 用於你的 use case
```
