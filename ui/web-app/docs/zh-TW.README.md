# Web App 前端專案說明

本專案採用 **Vite + React + TypeScript** 技術，並結合 **Tailwind CSS** 及 **shadcn/ui** 進行 UI 設計。網站主題色使用 shadcn/ui 預設 "new-york" 風格，並以行動裝置優先（Mobile-first）設計，支援 RWD 響應式網頁。

前端框架選擇多元，每個框架都有自己的生態系（如狀態管理、UI 套件等）。為了方便未來切換框架，整個應用程式統一透過 `APIServiceFactory` 操作 API 抽象介面。API 的實作細節可自由選用 fetch、axios 或 RxJS 等方式，確保程式碼維護性與

---

## 專案結構

- `src/api/`：API 抽象介面與實作。
- `src/hooks/`：跨頁共用 hook。
- `src/components/`：跨頁共用元件。
- `src/components/ui/`：shadcn/ui 樣式元件。
- `src/pages/[page]/_components/`：僅該頁面使用的元件。
- `src/pages/`：各網頁頁面，依功能分資料夾。

---

## 開發規範

- 檔案命名採用 **kebab-case**。
- 頁面元件與共用元件分開管理。
- shadcn/ui 元件統一放置於 `src/components/ui/`。
- 網頁設計需支援 RWD，並以行動裝置優先。
- import 順序需遵循專案規範，分組並空行區隔。
