# AI Chat - 実行計画 (TODO)

## Phase 1: プロジェクト初期セットアップ

- [x] Next.js プロジェクト作成（App Router, TypeScript）
- [x] Tailwind CSS セットアップ
- [x] Hono インストール・Next.js Route Handlers との統合
- [x] Prisma インストール・MongoDB 接続設定
- [x] Mastra インストール・初期設定
- [x] `.env.example` 作成（`ANTHROPIC_API_KEY`, `DATABASE_URL`）
- [x] ディレクトリ構成の作成

## Phase 2: データベース・スキーマ定義

- [x] Prisma スキーマ定義（`schema.prisma`）
  - [x] Character モデル（id, name, description, avatarUrl, systemPrompt, isPreset, createdAt, updatedAt）
  - [x] Conversation モデル（id, characterId, title, createdAt, updatedAt）
  - [x] Message モデル（id, conversationId, role, content, createdAt）
- [x] Prisma クライアント生成（`npx prisma generate`）
- [ ] DB スキーマ同期（`npx prisma db push`）※ MongoDB接続後に実行
- [x] プリセットキャラクターのシードデータ作成

## Phase 3: バックエンド API（Hono）

- [x] Hono ルーター基盤セットアップ（`src/app/api/`）
- [x] キャラクター API
  - [x] `GET /api/characters` - 一覧取得
  - [x] `POST /api/characters` - 新規作成
  - [x] `PUT /api/characters/:id` - 編集
  - [x] `DELETE /api/characters/:id` - 削除
- [x] 会話 API
  - [x] `POST /api/conversations` - 新規会話作成
  - [x] `GET /api/conversations` - 会話一覧取得
  - [x] `GET /api/conversations/:id` - 会話詳細（メッセージ含む）取得
  - [x] `DELETE /api/conversations/:id` - 会話削除
- [x] チャット API
  - [x] `POST /api/chat` - メッセージ送信・ストリーミングレスポンス

## Phase 4: AIエージェント（Mastra）

- [x] Mastra エージェント設定（`src/lib/mastra/`）
- [x] Claude API（claude-4-sonnet）との接続設定
- [x] キャラクターのシステムプロンプトをエージェントに適用するロジック
- [x] ストリーミングレスポンス対応
- [x] 会話コンテキスト（過去メッセージ）の送信処理

## Phase 5: フロントエンド - 共通レイアウト

- [x] レスポンシブ対応のベースレイアウト（モバイルファースト）
- [x] ヘッダー・ナビゲーション
- [x] ビジネスライクなデザインテーマ設定（Tailwind CSS）

## Phase 6: フロントエンド - キャラクター管理

- [x] キャラクター一覧ページ（`/characters`）
- [x] キャラクター作成フォーム
- [x] キャラクター編集・削除機能
- [x] プリセットキャラクターの表示

## Phase 7: フロントエンド - チャット機能

- [x] チャットページ（`/chat`）
- [x] キャラクター選択 → 会話開始フロー
- [x] メッセージ入力・送信UI
- [x] ストリーミングレスポンスの表示（文字が順次表示）
- [x] 会話履歴一覧（サイドバー or リスト）
- [x] 過去の会話の閲覧・再開

## Phase 8: デプロイ

- [x] Dockerfile 作成
- [ ] MongoDB Atlas セットアップ ※ 手動セットアップが必要
- [ ] Cloud Run デプロイ設定 ※ `gcloud run deploy` で実行
- [ ] 環境変数設定（`ANTHROPIC_API_KEY`, `DATABASE_URL`） ※ デプロイ時に設定
- [ ] 動作確認・デバッグ ※ デプロイ後に実施

## Phase 9: 品質改善・未実装機能

### エラーハンドリング・UXフィードバック
- [ ] API呼び出し失敗時のエラーメッセージ表示（キャラクター管理ページ）
- [ ] API呼び出し失敗時のエラーメッセージ表示（チャットページ）
- [ ] チャット送信失敗時のリトライUI or エラー表示（ChatRoom）
- [ ] 非同期処理中のローディングスピナー表示（キャラクター一覧取得、会話一覧取得）
- [ ] キャラクター作成・更新・削除後のトースト通知（成功/失敗）
- [ ] 会話削除時の確認ダイアログ（チャットページ側、現在は confirm なし）

### 入力バリデーション
- [ ] サーバーサイドの入力バリデーション（キャラクター作成・更新API）
- [ ] キャラクター名・説明文・システムプロンプトの文字数制限
- [ ] チャットメッセージの空文字・長すぎるテキストのバリデーション（API側）

### UI/UX改善
- [ ] キャラクターフォームに `avatarUrl` 入力欄を追加（スキーマには存在するがUIにない）
- [ ] 会話一覧にキャラクター名・最終更新日時を表示（ConversationList）
- [ ] 仕様書に記載の shadcn/ui の導入（現在は素のTailwindのみ）
- [ ] チャットメッセージのマークダウン対応（AI応答にコードブロック等が含まれる場合）
- [ ] メッセージのコピー機能（クリップボードにコピー）

### 環境変数・起動時チェック
- [ ] 環境変数（`ANTHROPIC_API_KEY`, `DATABASE_URL`）の起動時バリデーション
