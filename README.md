# visp

Visp is a toy-language built for a few purposes:

- I'd like to build a language from scratch
- I want to experiment with veneer syntax over s-expressions, and the impact on metaprogramming
- I want to type implementing `Y-calculus`
- All going well, this will compile into JS with acceptable performance

> Why on earth would you want a half-baked pseudoscheme with f-expressions, which are evil?

:woman_shrugging:

I'm unconvinced you need s-expressions directly to metaprogram, and I think macros are half-baked f-expressions. I often want code to inspect other code when working with JS for documentation and versioning, which is easily done with vau-calculus. Being able to define additional syntax is a bonus to!

I'd like it to compile to / be interpreted in JS for practicality.

So far, I've implemented:

- a tokeniser
- ~~a parser~~
- ~~an evaluator~~
- ~~a standard library~~
- ~~node library wrappers

It looks like this.

```js

; this is a comment

define!(my-hash, hash(
  (monday  0)
  (tuesday 1)
))

define!(falsity, lambda(() #false))
```
