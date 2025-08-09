# 🔌 SSE エンドポイント API リファレンス

## 概要

SSE バックエンドは、様々なタイプのリアルタイムデータストリーム用の複数の Server-Sent Events エンドポイントを提供します。

## 認証

ほとんどのエンドポイントは、トークンパラメータまたは Authorization ヘッダーによる認証が必要です：

```javascript
// クエリパラメータ（SSE に推奨）
const eventSource = new EventSource('/notifications/stream?token=YOUR_TOKEN');

// Authorization ヘッダー（HTTP リクエスト用）
fetch('/api/endpoint', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
});
```

**デモトークン**: `dGVzdDEyMzp0ZXN0dXNlcjp0ZXN0QGV4YW1wbGUuY29tOnVzZXIsYWRtaW4=`

## SSE エンドポイント

### 通知ストリーム
**エンドポイント**: `GET /notifications/stream`  
**認証**: 必要  
**パラメータ**: `token` (文字列)

認証されたユーザーにプッシュ通知をストリーミングします。

```javascript
const eventSource = new EventSource('/notifications/stream?token=YOUR_TOKEN');

eventSource.addEventListener('notification', (event) => {
  const data = JSON.parse(event.data);
  console.log('通知:', data);
  // { id, title, message, type, timestamp, userId }
});
```

### リアルタイム更新ストリーム
**エンドポイント**: `GET /realtime/stream`  
**認証**: 必要  
**パラメータ**: `token` (文字列)

リアルタイムエンティティ更新とシステムイベントをストリーミングします。

```javascript
const eventSource = new EventSource('/realtime/stream?token=YOUR_TOKEN');

eventSource.addEventListener('update', (event) => {
  const data = JSON.parse(event.data);
  console.log('更新:', data);
  // { entityType, entityId, action, data, timestamp }
});
```

### チャットストリーム
**エンドポイント**: `GET /chat/stream`  
**認証**: 必要  
**パラメータ**: `token` (文字列), `room` (文字列、オプション)

指定されたルームまたはアクセス可能なすべてのルームのチャットメッセージをストリーミングします。

```javascript
const eventSource = new EventSource('/chat/stream?token=YOUR_TOKEN&room=general');

eventSource.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  console.log('チャット:', data);
  // { id, roomId, userId, username, message, timestamp }
});
```

### システム状態ストリーム
**エンドポイント**: `GET /system/status/stream`  
**認証**: 不要  
**パラメータ**: なし

システム状態の更新とヘルス情報をストリーミングします。

```javascript
const eventSource = new EventSource('/system/status/stream');

eventSource.addEventListener('status', (event) => {
  const data = JSON.parse(event.data);
  console.log('システム:', data);
  // { status, uptime, connections, memory, cpu, timestamp }
});
```

## HTTP API エンドポイント

### 通知送信
**エンドポイント**: `POST /notifications/send`  
**認証**: 必要  
**Content-Type**: `application/json`

```bash
curl -X POST http://localhost:3000/notifications/send \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "テスト通知",
    "message": "こんにちは！",
    "type": "info"
  }'
```

### リアルタイム更新送信
**エンドポイント**: `POST /realtime/update`  
**認証**: 必要  
**Content-Type**: `application/json`

```bash
curl -X POST http://localhost:3000/realtime/update \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "entityType": "user",
    "entityId": "user123", 
    "action": "updated",
    "data": {"status": "online"}
  }'
```

### チャットメッセージ送信
**エンドポイント**: `POST /chat/send`  
**認証**: 必要  
**Content-Type**: `application/json`

```bash
curl -X POST http://localhost:3000/chat/send \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "general",
    "message": "皆さん、こんにちは！"
  }'
```

## イベントタイプ

### 通知イベント
- `notification`: 標準ユーザー通知
- `system-notification`: システム全体のお知らせ
- `error-notification`: エラーまたは警告メッセージ

### リアルタイムイベント
- `update`: エンティティ更新イベント
- `create`: エンティティ作成イベント
- `delete`: エンティティ削除イベント
- `status-change`: ステータス変更イベント

### チャットイベント
- `message`: 標準チャットメッセージ
- `user-joined`: ユーザーがルームに参加
- `user-left`: ユーザーがルームから退出
- `typing`: ユーザータイピング表示

### システムイベント
- `status`: システム状態更新
- `heartbeat`: 接続ハートビート
- `maintenance`: メンテナンスモード通知

## エラー処理

SSE 接続は以下の理由で閉じられることがあります：
- **401 Unauthorized**: 無効または期限切れのトークン
- **403 Forbidden**: 権限不足
- **429 Too Many Requests**: レート制限超過
- **500 Internal Server Error**: サーバーエラー

指数バックオフで再接続ロジックを実装：

```javascript
let reconnectDelay = 1000;
const maxDelay = 30000;

function connectSSE() {
  const eventSource = new EventSource('/notifications/stream?token=YOUR_TOKEN');
  
  eventSource.onopen = () => {
    reconnectDelay = 1000; // 接続成功時に遅延をリセット
  };
  
  eventSource.onerror = () => {
    eventSource.close();
    setTimeout(connectSSE, reconnectDelay);
    reconnectDelay = Math.min(reconnectDelay * 2, maxDelay);
  };
}
```

## 接続制限

- **ユーザーあたりの最大接続数**: 5
- **グローバル接続制限**: 1000
- **アイドルタイムアウト**: 5分
- **ハートビート間隔**: 30秒

---

詳細については、[バックエンド開発ガイド](../guides/development.md)をご覧ください。