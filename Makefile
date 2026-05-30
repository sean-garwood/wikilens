.PHONY: zip clean test

zip:
	python3 utils/build-zip.py

clean:
ifeq ($(OS),Windows_NT)
	@echo make clean unsupported on Windows.
else
	rm -f wikilens.zip
endif

test:
	node --test
