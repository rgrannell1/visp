# visp

Visp is a toy-language built for a few purposes:

- I'd like to build a language from scratch
- I want to experiment with veneer syntax over s-expressions, and its impact on metaprogramming
- I want to implement `vau-calculus`
- If this works out, I'd like to switch to this language from Node.js

> Why on earth would you want a half-baked pseudoscheme with f-expressions, which are evil?

:woman_shrugging:

I'm unconvinced you need s-expression syntax to metaprogram, and I think macros are poor substitutions for f-expressions. I often want code to inspect other code when working with JS for documentation and versioning, which is easily done with vau-calculus. Being able to *really* define new syntax is a bonus too!

So far, I've implemented:

- a parser
- ~~an evaluator~~
- ~~a standard library~~
- ~~node library wrappers~~

It looks like this.

```js

; this is a comment

define!(my-hash, hash(
  (monday  0)
  (tuesday 1)
))

define!(falsity, lambda(() #false))
```
