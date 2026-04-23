# SumUp

Notion風ノートアプリ

## 技術スタック
- **フロント**: Next.js (TypeScript, Tailwind CSS, BlockNote)
- **バック**: FastAPI (Python)
- **DB**: PostgreSQL

## セットアップ

### 1. PostgreSQLでDBを作成
```sql
CREATE DATABASE sumup;
```

### 2. バックエンド
```bash
cd backend
python -m venv venv
venv\Scripts\activate       # Windows
pip install -r requirements.txt

# .env を編集してDB接続情報を設定
copy .env.example .env

# マイグレーション実行
alembic revision --autogenerate -m "init"
alembic upgrade head

# 起動
uvicorn main:app --reload
```
→ http://localhost:8000

### 3. フロントエンド
```bash
cd frontend
npm install
npm run dev
```
→ http://localhost:3000
