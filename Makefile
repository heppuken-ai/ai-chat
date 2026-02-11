.PHONY: install generate db-push seed init dev build start lint docker-build deploy

# 初期化
install:
	npm install

generate:
	npx prisma generate

db-push:
	npx prisma db push

seed:
	npx prisma db seed

init: install generate db-push seed

# 開発
dev:
	npm run dev

lint:
	npm run lint

# ビルド
build:
	npm run build

start:
	npm run start

# デプロイ
docker-build:
	docker build -t ai-chat .

deploy:
	gcloud run deploy ai-chat \
		--source . \
		--region asia-northeast1 \
		--allow-unauthenticated \
		--set-env-vars ANTHROPIC_API_KEY=$${ANTHROPIC_API_KEY},DATABASE_URL=$${DATABASE_URL}
