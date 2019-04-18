# visp

Visp is a toy-language built for a few purposes:

- I'd like to build a language from scratch
- I want to experiment with veneer syntax over s-expressions, and the impact on metaprogramming
- I want to type implementing `vau-calculus`
- All going well, this will compile into JS with acceptable performance

So far, I've implemented:

- a tokeniser
- ~~a parser~~

It looks like this.

```js

; oh hai

multiline(a,
  b,
  c
)
anIdentifier(a, b)
fn(a, b)
fn(a, b(c, d, "this is a string")) ; hai
a `+` b
10.0 `+` 2
a `^` -10.00000
a `fn` b(
  c,
  d,
  e("a")
)

define(falsity, lambda((a, b) #false))

#true
#false
```