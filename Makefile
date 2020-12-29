.PHONY: build
build:
	rm -rf packages/*/dist packages/*/module
	npm run build
	npm --prefix ./packages/jobs run build
	(cd packages/server; docker build . -t tomlingham/tocsin)

.PHONY: publish
publish:
	docker push tomlingham/tocsin
