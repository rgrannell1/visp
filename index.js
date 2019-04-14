
const visp = {}

/*

expression → literal
  | unary
  | binary
  | grouping

literal → NUMBER | STRING | #t | #f
grouping → "(" expression ")"
binary → expression operator expression
unary → operator expression
operator → string
 */

const constants = {
  tokens: {
    LEFT_PAREN: 'LEFT_PAREN',
    RIGHT_PAREN: 'RIGHT_PAREN',
    COMMA: 'COMMA',
    TICK: 'TICK',
    NUMBER: 'NUMBER',
    STRING: 'STRING',
    IDENTIFIER: 'IDENTIFIER',
    INFIX: 'INFIX'
  }
}

const Token = data => {
  return data
}

const ast = {
  binary (lhs, fn, rhs) {
    return {lhs, fn. rhs}
  },
  literal (value) {
    return {value}
  },
  grouping (expr) {
    return {expr}
  }
}

const scanner = source => {
  const tokens = []

  const state = {
    source,
    start: 0,
    current: 0,
    line: 1
  }

  const scanner = {
    ...state,
    finished () {
      return this.current >= this.source.length
    },
    scan () {
      while (!this.finished()) {
        this.start = this.current
        this.scanToken()
      }

      return tokens
    },
    advance () {
      this.current++
      return this.source.charAt(this.current - 1)
    },
    addToken (type, literal = null) {
      const text = this.source.substring(this.start, this.current)

      if (typeof type === 'undefined') {
        throw new Error(`missing token-type: ${text}`)
      }

      const opts = {
        type,
        text,
        line: this.line
      }

      if (literal !== null) {
        opts.literal = literal
      }

      tokens.push(Token(opts))
    },
    string () {
      while (this.peek() !== '"' && !this.finished()) {
        if (this.peek() === '\n') {
          ++this.line
        }
        this.advance()
      }

      if (this.finished()) {
        throw new Error('unterminated string')
      }

      // -- close string.
      this.advance()
      const value = this.source.substring(this.start + 1, this.current - 1)
      this.addToken(constants.tokens.STRING, value)
    },
    number () {
      while (this.isDigit(this.peek())) {
        this.advance()
      }

      if (this.peek() === '.' && this.isDigit(this.peekNext())) {
        this.advance()

        while (this.isDigit(this.peek())) {
          this.advance()
        }
      }

      this.addToken(constants.tokens.NUMBER, this.source.substring(this.start, this.current))
    },
    identifier () {
      while (this.isIdentifier(this.peek())) {
        this.advance()
      }

      this.addToken(constants.tokens.IDENTIFIER)
    },
    infix () {
      while (this.peek() !== '`' && !this.finished()) {
        if (this.peek() === '\n') {
          throw new Error('newline in identifier')
        }
        this.advance()
      }

      if (this.finished()) {
        throw new Error('unterminated infix')
      }

      // -- close infix.
      this.advance()
      const value = this.source.substring(this.start + 1, this.current - 1)
      this.addToken(constants.tokens.INFIX, value)
    },
    comment () {
      while (this.peek() !== '\n' && !this.finished()) {
        this.advance()
      }
    },
    scanToken () {
      const char = this.advance()

      switch (char) {
        case '(':
          this.addToken(constants.tokens.LEFT_PAREN)
          break
        case ')':
          this.addToken(constants.tokens.RIGHT_PAREN)
          break
        case ',':
          this.addToken(constants.tokens.COMMA)
          break
        case '`':
          this.infix()
          break
        case '"':
          this.string()
          break
        case ' ':
          break
        case '\r':
          break
        case '\t':
          break
        case '\n':
          this.line++
          break
        case ';':
          this.comment()
        default:
          if (this.isDigit(char)) {
            this.number()
          } else if (this.isCharacter(char) || char === '#') {
            this.identifier()
          } else {
            return new SyntaxError('mmh.')
          }
          break
      }
    },
    isCharacter (char) {
      return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char == '_';
    },
    isIdentifier (char) {
      return this.isCharacter(char) || this.isDigit(char)
    },
    isDigit (char) {
      return '0123456789'.includes(char)
    },
    peek () {
      return this.finished()
        ? '\0'
        : this.source.charAt(this.current)
    },
    peekNext () {
      if (this.current + 1 >= this.source.length) {
        return '\0'
      }
      return this.source.charAt(this.current + 1)
    },
    match (expected) {
      if (this.finished()) {
        return false
      }
      if (this.source.charAt(this.current) !== expected) {
        return false
      }

      this.current++
      return true
    }
  }

  return scanner.scan()
}

const parser = tokens => {
  const parser = {
    current: 0,
    parse () {

    },
    infix () {

    },
    match (...tokens) {
      for (const token of tokens) {
        if (this.check(token)) {
          this.advance()
          return true
        }
      }
      return false
    },
    check (type) {
      return this.finished()
        ? false
        : this.peek().type === type
    },
    advance () {
      if (!this.finished()) {
        ++this.current
      }
      return this.previous()
    },
    finished () {
      return this.peek().type === 'EOF'
    },
    peek () {
      return tokens[current]
    },
    previous () {
      return tokens[current - 1]
    }
  }

  return parser.parse()
}

const source = require('fs').readFileSync('example.txt').toString()

const tokens = scanner(source)
const mmm = parser(tokens)

console.log(mmm)
