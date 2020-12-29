.PHONY: build
build:
	rm -rf packages/*/dist packages/*/module
	npm run build
	npm --prefix ./packages/jobs run build
