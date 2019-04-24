
const constants = {
  tokens: {
    LEFT_PAREN: 'LEFT_PAREN',
    RIGHT_PAREN: 'RIGHT_PAREN',
    COMMA: 'COMMA',
    TICK: 'TICK',
    NUMBER: 'NUMBER',
    STRING: 'STRING',
    IDENTIFIER: 'IDENTIFIER',
    INFIX: 'INFIX',
    TRUE: 'TRUE',
    FALSE: 'FALSE'
  },
  charSets: {
    numbers: '0123456789'.split('')
  },
  regexp: {
    number: /^[+-]{0,1}[0-9]+([.][0-9]+)*/
  }
}

module.exports = constants
