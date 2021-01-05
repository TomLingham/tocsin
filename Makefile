.PHONY: prepare
prepare:
	npm ci

.PHONY: clean
clean:
	rm -rf packages/*/dist packages/*/module

.PHONY: build
build:
	npm run build
	npm --prefix ./packages/jobs run build

.PHONY: dev/server
dev/server:
	npm --prefix ./packages/server run dev
