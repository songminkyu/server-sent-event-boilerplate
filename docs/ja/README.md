# 🇯🇵 SSE モノレポ ドキュメント - 日本語

Server-Sent Events (SSE) モノレポプロジェクトの完全な日本語ドキュメントです。

## 📋 目次

### 🚀 はじめに
- [クイックスタートガイド](./guides/getting-started.md) - 数分でプロジェクトを起動
- [インストールガイド](./guides/installation.md) - 詳細なインストール手順
- [プロジェクト構造](./guides/project-structure.md) - モノレポレイアウトの理解

### 📖 ガイド
- [テストガイド](./guides/testing.md) - 包括的なテスト手順
- [PNPM マイグレーションガイド](./guides/pnpm-migration.md) - npmからpnpmへの移行
- [開発ガイド](./guides/development.md) - 開発ワークフローと慣例
- [コントリビューションガイド](./guides/contributing.md) - プロジェクトへの貢献方法

### 🔌 API リファレンス
- [バックエンド API](./api/backend.md) - 完全な NestJS API ドキュメント
- [フロントエンド API](./api/frontend.md) - React コンポーネントとフック参照
- [SSE エンドポイント](./api/sse-endpoints.md) - Server-Sent Events エンドポイント
- [認証](./api/authentication.md) - 認証システムドキュメント

### 📚 チュートリアル
- [初めての SSE アプリ構築](./tutorials/first-sse-app.md) - ステップバイステップチュートリアル
- [高度な SSE パターン](./tutorials/advanced-patterns.md) - 複雑な実装パターン
- [リアルタイムチャット実装](./tutorials/chat-implementation.md) - チャットシステムの構築
- [パフォーマンス最適化](./tutorials/performance.md) - SSE アプリケーションの最適化

### 💡 サンプル
- [基本的な SSE 接続](./examples/basic-connection.md) - シンプルな SSE 実装
- [認証サンプル](./examples/authentication.md) - 認証統合サンプル
- [フロントエンド統合](./examples/frontend-integration.md) - 様々なフロントエンドフレームワーク
- [プロダクションサンプル](./examples/production.md) - プロダクション対応設定

### 🏗️ アーキテクチャ
- [システムアーキテクチャ](./architecture/system-overview.md) - 高レベルシステム設計
- [バックエンドアーキテクチャ](./architecture/backend.md) - NestJS バックエンドアーキテクチャ
- [フロントエンドアーキテクチャ](./architecture/frontend.md) - React フロントエンドアーキテクチャ
- [データフロー](./architecture/data-flow.md) - データフローとイベントハンドリング

### 🚀 デプロイメント
- [開発環境デプロイメント](./deployment/development.md) - ローカル開発環境セットアップ
- [プロダクションデプロイメント](./deployment/production.md) - プロダクションデプロイガイド
- [Docker デプロイメント](./deployment/docker.md) - コンテナ化デプロイメント
- [クラウドデプロイメント](./deployment/cloud.md) - クラウドプラットフォームデプロイメント

### 🐛 トラブルシューティング
- [よくある問題](./troubleshooting/common-issues.md) - 頻繁に発生する問題
- [接続問題](./troubleshooting/connection.md) - SSE 接続のトラブルシューティング
- [パフォーマンス問題](./troubleshooting/performance.md) - パフォーマンス関連の問題
- [開発環境の問題](./troubleshooting/development.md) - 開発環境の問題

## 🔧 プロジェクト情報

- **バックエンド**: NestJS + TypeScript + Server-Sent Events
- **フロントエンド**: React + TypeScript + Vite
- **パッケージマネージャー**: PNPM（ワークスペースサポート）
- **テスティング**: Jest（バックエンド）+ Vitest（フロントエンド）
- **リンティング**: ESLint + Prettier
- **ドキュメント**: 多言語サポート

## 🌟 主要機能

- ✅ リアルタイム双方向通信
- ✅ 認証と認可
- ✅ 複数の SSE エンドポイントタイプ
- ✅ 自動再接続処理
- ✅ 接続状態管理
- ✅ プロダクション対応設定
- ✅ 包括的なエラーハンドリング
- ✅ パフォーマンス最適化
- ✅ 完全な TypeScript サポート
- ✅ 多言語ドキュメントサポート

## 📞 サポート

- 📧 **課題**: [GitHub Issues](https://github.com/your-repo/issues)
- 📖 **ドキュメント**: この包括的なガイド
- 💬 **ディスカッション**: [GitHub Discussions](https://github.com/your-repo/discussions)

---

**次のステップ**: [クイックスタートガイド](./guides/getting-started.md)から始めて、SSE アプリケーションを実行してみましょう！