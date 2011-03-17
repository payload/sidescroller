all: $(patsubst %.coffee, %.js, $(wildcard *.coffee))

%.js: %.coffee
	coffee -c $<

