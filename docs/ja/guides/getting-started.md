# 🚀 SSE モノレポ スタートガイド

## 概要

SSE (Server-Sent Events) モノレポへようこそ！このガイドでは、数分でフルスタック SSE ソリューションを実行できるようになります。

## クイックセットアップ

### 1. 前提条件
- **Node.js 18.0+** ([ダウンロード](https://nodejs.org/))
- **PNPM 9.0+** (`npm install -g pnpm`)
- **Git** (バージョン管理用)
- **モダンブラウザ** (Chrome, Firefox, Safari, Edge)

### 2. インストール
```bash
# リポジトリをクローン
git clone <your-repo-url>
cd server-sent-event

# すべての依存関係をインストール
pnpm install
```

### 3. 開発サーバーの起動
```bash
# バックエンドとフロントエンドを同時に起動
pnpm run dev
```

このコマンドで起動されるもの:
- **バックエンド**: http://localhost:3000 (NestJS SSE サーバー)
- **フロントエンド**: http://localhost:5173 (React + Vite クライアント)

### 4. アプリケーションのテスト
1. ブラウザで http://localhost:5173 を開く
2. "Login (Demo)" をクリックして認証
3. すべての SSE 接続が "Connected" 状態であることを確認
4. 各タブでリアルタイム機能をテスト

## プロジェクト構造

```
server-sent-event/
├── docs/                    # 多言語ドキュメント
├── sse-backend/             # NestJS SSE サーバー
├── sse-frontend/            # React + Vite クライアント
├── package.json             # ワークスペース設定
└── pnpm-workspace.yaml      # PNPM ワークスペース定義
```

## 主な機能

### バックエンド (NestJS)
- 様々なデータタイプ用の複数 SSE エンドポイント
- ロールベースアクセス制御付きトークン認証
- 自動接続クリーンアップとモニタリング
- プロダクション対応エラーハンドリングとロギング

### フロントエンド (React + Vite)
- 簡単な統合のためのカスタム useSSE フック
- リアルタイム UI コンポーネント
- 自動再接続処理
- 接続統計とモニタリング

## 次のステップ

- 📖 **[API リファレンス](../api/backend.md)** で詳細なエンドポイントドキュメントを確認
- 🧪 **[テストガイド](./testing.md)** に従って包括的なテストを実行
- 🏗️ **[開発ガイド](./development.md)** で高度なワークフローを確認
- 🚀 **[デプロイガイド](../deployment/production.md)** でプロダクションセットアップを確認

## 主要コマンド

```bash
# 開発
pnpm run dev              # 両サーバーを起動
pnpm run backend:dev      # バックエンドのみ
pnpm run frontend:dev     # フロントエンドのみ

# ビルド
pnpm run build            # すべてのパッケージをビルド
pnpm run backend:build    # バックエンドをビルド
pnpm run frontend:build   # フロントエンドをビルド

# テスト
pnpm run test             # すべてのテストを実行
pnpm run lint             # すべてのコードをリント
```

## サポートが必要ですか？

- 📚 `docs/` フォルダの包括的なドキュメントを確認
- 🧪 詳細なテスト手順は [テストガイド](../../TESTING-GUIDE.md) を参照
- 📦 ワークスペースセットアップは [PNPM マイグレーションガイド](../../PNPM-MIGRATION.md) を確認
- 🐛 バグや機能リクエストの場合はイシューを作成

---

**Server-Sent Events で素晴らしいものを構築する準備はできましたか？始めましょう！🚀**