build:
	./node_modules/webpack/bin/webpack.js

watch:
	./node_modules/webpack/bin/webpack.js --watch


test:
	./node_modules/mocha/bin/mocha --compilers js:babel-core/register

.PHONY: test

