.PHONY: build
build:
	npm run build
	npm --prefix ./packages/jobs run build
