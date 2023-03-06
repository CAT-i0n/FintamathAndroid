function toHtml(mathText) {
  let text = mathText;

  for (let key in mathHtmlMap) {
    text = text.replaceAll(key, mathHtmlMap[key])
  }

  return toHtmlRec(text, 0, text.length - 1)

  //---------------------------------------------------------------------------------------------------------//

  function toHtmlRec(mathText, start, end) {
    if (start > end) {
      return ''
    }

    let mainEl = createSpan()
    let innerEl = createSpan(textClass)
    mainEl.append(innerEl)

    for (let i = start; i <= end; i++) {
      const ch = mathText[i]

      switch (ch) {
        case '(': {
          ({ start: i, innerEl: innerEl } = insertBrackets(mathText, i, end, mainEl, innerEl, ch))
          continue
        } case '^': {
          innerEl = insertPower(mainEl, innerEl)
          continue
        } case '/': {
          innerEl = insertFraction(mainEl, innerEl)
          continue
        } case ' ': {
          innerEl = insertSpace(innerEl, mainEl)
          continue
        }
      }

      if (binaryOperators.indexOf(ch) !== -1) {
        removeLastEmptyText(mainEl, innerEl)
        innerEl = insertOperator(mainEl, innerEl, ch, binaryOperatorClass)
        continue
      }
      if (unaryPrefixOperators.indexOf(ch) !== -1) {
        removeLastEmptyText(mainEl, innerEl)
        innerEl = insertOperator(mainEl, innerEl, ch, unaryPrefixOperatorClass)
        continue
      }
      if (unaryPostfixOperators.indexOf(ch) !== -1) {
        removeLastEmptyText(mainEl, innerEl)
        innerEl = insertOperator(mainEl, innerEl, ch, unaryPostfixOperatorClass)
        continue
      }

      innerEl.innerHTML += ch
    }

    return mainEl.innerHTML
  }

  function insertSpace(innerEl, mainEl) {
    if (innerEl.innerHTML != '') {
      innerEl = createSpan(textClass)
      mainEl.append(innerEl)
    }

    return innerEl
  }

  function insertOperator(mainEl, innerEl, ch, operatorClass) {
    innerEl = createSpan(operatorClass)
    innerEl.innerHTML = ch
    mainEl.append(innerEl)

    innerEl = createSpan(textClass)
    mainEl.append(innerEl)

    return innerEl
  }

  function insertPower(mainEl, innerEl) {
    mainEl.removeChild(innerEl)
    innerEl.className = textHintClass

    let powSpan = createSpan(powerClass)
    mainEl.append(powSpan)

    powSpan.append(innerEl)
    innerEl = createSpan(supClass)
    powSpan.append(innerEl)

    return innerEl
  }

  function insertFraction(mainEl, innerEl) {
    mainEl.removeChild(innerEl)
    innerEl.className = textHintClass

    let fracSpan = createSpan(fractionClass)
    mainEl.append(fracSpan)

    fracSpan.append(innerEl)
    fracSpan.append(createSpan(fractionLineClass))
    innerEl = createSpan(textHintClass)
    fracSpan.append(innerEl)

    return innerEl
  }

  function insertBrackets(mathText, start, end, mainEl, innerEl, ch) {
    const closingBracketPos = getClosingBracketPos(mathText, start, end)

    if (closingBracketPos !== -1) {
      let funcName = innerEl.innerHTML

      if (funcName !== '') {
        switch (funcName) {
          case 'sqrt': {
            let sqrtSpan = createSpan(rootClass)

            innerEl.innerHTML = ''
            innerEl.append(sqrtSpan)
            innerEl = sqrtSpan

            break
          } case 'abs': {
            let absSpan = createSpan(absClass)

            innerEl.innerHTML = ''
            innerEl.append(absSpan)
            innerEl = absSpan

            break
          } default: {
            let nameSpan = createSpan(functionNameClass)
            nameSpan.innerHTML = innerEl.innerHTML

            let funcSpan = createSpan(functionClass)
            funcSpan.append(nameSpan)
            funcSpan.append(createSpan(bracketsClass))

            innerEl.innerHTML = ''
            innerEl.append(funcSpan)
            innerEl = funcSpan.lastChild

            break
          }
        }

        innerEl.innerHTML += funcName
      } else if (innerEl.className === textClass) {
        innerEl.className = bracketsClass
      }

      let hintSpan = createSpan(textHintClass)
      hintSpan.innerHTML = toHtmlRec(mathText, start + 1, closingBracketPos - 1)
      innerEl.innerHTML = ''
      innerEl.append(hintSpan)

      innerEl = mainEl.lastChild

      start = closingBracketPos
    } else {
      innerEl.innerHTML += ch

      innerEl = createSpan(textClass)
      mainEl.append(innerEl)
    }

    return { start, innerEl }
  }

  function getClosingBracketPos(mathText, start, end) {
    let bracketsNum = 0

    for (let i = start; i <= end; i++) {
      const ch = mathText[i]

      switch (ch) {
        case '(': {
          bracketsNum++
          break
        }
        case ')': {
          bracketsNum--
          if (bracketsNum === 0) return i
          break
        }
      }
    }

    return -1
  }

  function removeLastEmptyText(mainEl, innerEl) {
    if (mainEl.lastChild.className === textClass && mainEl.lastChild.innerHTML === '') {
      mainEl.removeChild(mainEl.lastChild)
      innerEl = mainEl.lastChild
    }
  }
}

function toMathText(htmlText) {
  let text = htmlText

  // text = text.replace(/<[^>]+>/g, '')
  // text = text.replaceAll(/&nbsp;/g, ' ')
  // text = text.replaceAll(/&amp;/g, '&')
  // text = text.replaceAll(/&lt;/g, '<')
  // text = text.replaceAll(/&gt;/g, '>')

  return text
}

function reformatMathTextView(mathTextView_) {
  let mathTextView = createDiv('')

  for (let i = 1; i < mathTextView.children.length - 1; i++) {
    const child = mathTextView.children[i]

    if (el.className === textClass || el.className === textHintClass) {
      continue
    }

    reformatMathTextView(child)
  }
}

function createDiv(className) {
  let div = document.createElement('div')
  div.className = className
  return div
}

function createSpan(className) {
  let span = document.createElement('span')
  span.className = className
  return span
}


function setCursorPosition(el, pos) {
  if (el.contentEditable) {
    el.requestFocus()
    let selection = window.getSelection()
    selection.collapse(selection.anchorNode, pos)
  }

  // TODO: fix
  // window.scrollTo(document.body.scrollWidth * pos / el.innerText.length, 0);
}
