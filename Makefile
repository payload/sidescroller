PROJECT = sidescroller
BUILD_PATH = build
COFFEE = $(wildcard coffee/*.coffee)
JS = $(wildcard js/*.js)
BUILD = $(wildcard $(BUILD_PATH)/*)
PROJECTJS = $(BUILD_PATH)/$(PROJECT).js

compile: $(PROJECTJS)

$(PROJECTJS): $(COFFEE) $(JS)
	mkdir -p $(BUILD_PATH)
	rm -f $(PROJECTJS)
	echo "\n// copied JavaScripts\n" >> $(PROJECTJS)
	cat $(JS) >> $(PROJECTJS)
	echo "\n// generated from CoffeeScripts\n" >> $(PROJECTJS)
	coffee -jpb $(COFFEE) >> $(PROJECTJS)

clean: $(BUILD)
	rm -f $?

