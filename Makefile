BUILD_PATH = build
COFFEE = $(wildcard coffee/*.coffee)
JS = $(wildcard $(BUILD_PATH)/*.js)
COFFEE_PAT = coffee/%.coffee
JS_PAT = $(BUILD_PATH)/%.js

compile: $(patsubst $(COFFEE_PAT), $(JS_PAT), $(COFFEE))

clean: $(JS)
	rm -f $?

build/%.js: $(COFFEE_PAT)
	coffee -c -o $(BUILD_PATH)/ $<

