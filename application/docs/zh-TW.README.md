# Application 應用層

本專案為 Clean Architecture 的應用層，負責實作特定業務邏輯（Use Case），並定義操作 Use Case 所需的抽象介面，供外部層級實作。

## 主要職責

- 實現特定業務邏輯（Use Case）
- 定義資料傳輸物件（DTO）
- 管理權限檢查與錯誤處理
- 提供抽象介面，促進外部依賴反轉

## 架構說明

- 每個 Use Case 只包含一個 `execute` 方法。
- `execute` 方法需定義 Request/Response DTO。
- 所有錯誤皆繼承自 `BaseError`。
- 權限不足時，需拋出 `NoPermissionError`。
- 依據 Clean Architecture 原則，應用層不直接依賴基礎設施。

## 系統簡介

此應用程式是一個簡易部落格系統，具備以下功能：

- 會員註冊
- 使用者撰寫文章
- 角色權限管理（Role-based access control）
- 角色權重為 0，表示該角色完全沒有任何權限，即使其設定擁有所有資源與操作，也無法執行
- 預設帳號: [mail]superadmin@mail.com, [password]superadmin
- 預設角色: super-admin 與 user
