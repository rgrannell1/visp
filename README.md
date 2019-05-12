# visp

> Programming languages should be designed not by piling feature on top of feature, but by removing the weaknesses and restrictions that make additional features appear necessary

Visp is a toy-language built for a few purposes:

- I'd like to build a language from scratch
- I want to experiment with non-sexpr languages with metaprogramming support
- I want to implement `vau-calculus`
- I want to implement a language with lenses as the sole path management method
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

$define!(sym symbol("some js symbol"))
$define!(val hash*(
  ("a" 1)
  ("b" 2)
  (sym hash*(
    ("c" 3)
    ("d" 4)))))

$define!(accessor at-key(sym))

$define!(test $lambda((x y)
  show("hello!")
  $define!(z, 3)
  sum*(x y z)))

show(test(1 2))

show(lens-get(accessor val))
```

## Standard Library

- `boolean?`
- `not?`
- `and?`
- `or?`
- `$and?`
- `$or?`
- `$eq?`
- `$equal?`
