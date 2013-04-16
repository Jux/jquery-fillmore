# Contributing

To build the concatenated+minified files, install Node.js `>= 0.8.0`, and run:

```bash
# setup
npm install -g grunt-cli
npm install

# build the files
grunt
```

While developing, have it build automatically as files are changed:

```bash
grunt watch
```

To test visually:

```bash
open examples/*.html
```
