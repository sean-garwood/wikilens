.PHONY: zip distro clean test

zip:
	python3 utils/build-zip.py

distro:
	python3 scripts/release.py

clean:
ifeq ($(OS),Windows_NT)
	@echo make clean unsupported on Windows.
else
	rm -f wikilens.zip
	rm -rf dist/
endif

test:
	node --test
