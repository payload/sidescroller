all: $(patsubst %.coffee, %-compile, $(wildcard *.coffee))

clean: $(patsubst %.coffee, %-clean, $(wildcard *.coffee))

%-compile: %.coffee
	coffee -c $<

%-clean: %.js
	rm $<
