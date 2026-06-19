.PHONY: zip distro clean test

zip:
	python3 utils/build-zip.py

distro:
	python3 utils/release.py

clean:
ifeq ($(OS),Windows_NT)
	@echo make clean unsupported on Windows.
else
	rm -f wikilens.zip
endif

test:
	node --test
