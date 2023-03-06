const mathTextViewClass = 'math_text_view'
const textClass = 'text'
const textHintClass = 'text_hint'
const functionClass = 'function'
const functionNameClass = 'function_name'
const binaryOperatorClass = 'binary_operator'
const unaryPrefixOperatorClass = 'unary_prefix_operator'
const unaryPostfixOperatorClass = 'unary_postfix_operator'
const bracketsClass = 'brackets'
const absClass = 'abs'
const powerClass = 'power'
const powerBaseClass = 'power_base'
const powerExpClass = 'power_exp'
const rootClass = 'root'
const fractionClass = 'fraction'
const fractionLineClass = 'fraction_line'
const numeratorClass = 'numerator'
const denominatorClass = 'denominator'

const containerClasses = [
  functionClass,
  bracketsClass,
  absClass,
  powerClass,
  rootClass,
  fractionClass,
]

const subContainerClasses = [
  powerBaseClass,
  powerExpClass,
  numeratorClass,
  denominatorClass,
]

const mathHtmlMap = {
  '*': String.fromCodePoint(0x00d7),
  ' / ': String.fromCodePoint(0x00F7),
  '<=': String.fromCodePoint(0x2264),
  '>=': String.fromCodePoint(0x2265),
  '!=': String.fromCodePoint(0x2260),
  '&': String.fromCodePoint(0x2227),
  '|': String.fromCodePoint(0x2228),
  '~': String.fromCodePoint(0x00AC),
  '!<->': String.fromCodePoint(0x2262),
  '<->': String.fromCodePoint(0x2261),
  '->': String.fromCodePoint(0x21D2),
  'E': String.fromCodePoint(0x1d626),
  'Pi': String.fromCodePoint(0x03C0),
  'I': String.fromCodePoint(0x1d62a),
  'True': 'T',
  'False': 'F',
}

const binaryOperators = [
  '+',
  '-',
  mathHtmlMap['*'],
  mathHtmlMap[' / '],
  '=',
  mathHtmlMap['!='],
  '>',
  "<",
  mathHtmlMap['<='],
  mathHtmlMap['>='],
  mathHtmlMap['&'],
  mathHtmlMap['|'],
  mathHtmlMap['->'],
  mathHtmlMap['<->'],
  mathHtmlMap['!<->'],
  ',',
]

const unaryPrefixOperators = [
  '+',
  '-',
  mathHtmlMap['~'],
]

const unaryPostfixOperators = [
  '%',
  '!',
  '°',
  '\'',
]
