# AI Chat - プロジェクト仕様書

## 概要

ロールプレイ型AIチャットボットWebアプリケーション。ユーザーがキャラクターを作成・選択し、Claude APIを通じてキャラクターとの対話を楽しめるエンターテインメントサービス。スマホ対応のレスポンシブデザイン。同時接続ユーザーは5〜10人程度の小規模運用。

## 技術スタック

### フロントエンド
| カテゴリ | 技術 |
|---|---|
| フレームワーク | Next.js (App Router) |
| UIライブラリ | React |
| スタイリング | Tailwind CSS（ビジネスライクなデザイン） |
| レスポンシブ対応 | 必須（モバイルファースト） |

### バックエンド
| カテゴリ | 技術 |
|---|---|
| フレームワーク | Next.js + Hono |
| ORM | Prisma.js |
| データベース | MongoDB |
| AIエージェント | Mastra |
| AIモデル | Claude 4 Sonnet (claude-4-sonnet) |
| デプロイ | Google Cloud (Cloud Run) |

## アーキテクチャ

```
[Next.js App Router (フロント)] → [Hono API] → [Mastra Agent (claude-4-sonnet)]
                                       ↓
                                 [Prisma → MongoDB]
```

- Next.js App Router: UI・ページルーティング・SSR
- Hono: REST APIエンドポイント (Next.js Route Handlers内、または独立サービス)
- Mastra: AIエージェント管理・Claude APIとの通信・キャラクターのシステムプロンプト管理
- Prisma + MongoDB: 会話履歴・キャラクター定義の永続化

## 主要機能

### キャラクター管理
- ユーザーがオリジナルキャラクターを作成・編集・削除可能
- 各キャラクターは固有の名前・説明・性格・口調・設定を持つ（Mastraのシステムプロンプトで制御）
- プリセットキャラクターも用意

### チャット
- リアルタイムの対話UI
- ストリーミングレスポンス対応（文字が順次表示）
- 会話のコンテキスト維持

### 会話履歴
- 会話履歴をMongoDBに永続化
- 過去の会話を見返せる
- 会話の続きから再開可能

### UI/UX
- モバイルファースト・レスポンシブデザイン（スマホ対応）
- shadcn/ui + Tailwind CSSによるモダンなUI

## データモデル (Prisma)

### Character
- id, name, description, avatarUrl, systemPrompt, isPreset, createdAt, updatedAt

### Conversation
- id, characterId, title, createdAt, updatedAt

### Message
- id, conversationId, role (user/assistant), content, createdAt

## 非機能要件

- 同時接続ユーザー: 5〜10人程度
- 認証: なし（誰でもアクセス可能）

## デプロイ

- コンテナイメージをビルドしCloud Runにデプロイ
- MongoDB: MongoDB Atlas（推奨）またはGCE上でセルフホスト
- 環境変数で `ANTHROPIC_API_KEY`, `DATABASE_URL` 等を管理

## ディレクトリ構成（想定）

```
ai-chat/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── chat/             # チャットUI
│   │   ├── characters/       # キャラクター管理ページ
│   │   └── api/              # Hono APIルート
│   ├── lib/
│   │   ├── mastra/           # Mastraエージェント設定
│   │   └── prisma/           # Prismaクライアント
│   └── components/           # UIコンポーネント
├── prisma/
│   └── schema.prisma
├── Dockerfile
├── .env.example
├── package.json
└── tsconfig.json
```

## 開発コマンド

```bash
npm install          # 依存関係インストール
npm run dev          # 開発サーバー起動
npx prisma generate  # Prismaクライアント生成
npx prisma db push   # DBスキーマ同期
```
