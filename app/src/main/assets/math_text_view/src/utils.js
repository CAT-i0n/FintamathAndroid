function toHtml(mathText) {
  let text = mathText

  for (let key in mathHtmlMap) {
    text = text.replaceAll(key, mathHtmlMap[key])
  }

  return toHtmlRec(text, 0, text.length - 1)

  //---------------------------------------------------------------------------------------------------------//

  function toHtmlRec(mathText, start, end) {
    if (start > end) {
      return ''
    }

    let mainNode = createSpan()
    let innerNode = createSpan(textClass)
    mainNode.appendChild(innerNode)

    for (let i = start; i <= end; i++) {
      const ch = mathText[i]

      switch (ch) {
        case '(': {
          ({ start: i, innerNode: innerNode } = insertBrackets(mathText, i, end, mainNode, innerNode));
          continue
        } case '^': {
          innerNode = insertPower(mainNode, innerNode)
          continue
        } case '/': {
          innerNode = insertFraction(mainNode, innerNode)
          continue
        } case ' ': {
          innerNode = insertSpace(innerNode, mainNode)
          continue
        }
      }

      if (binaryOperators.indexOf(ch) !== -1) {
        innerNode = removeLastEmptyText(mainNode, innerNode)
        innerNode = insertOperator(mainNode, innerNode, ch, binaryOperatorClass)
        continue
      }
      if (unaryPrefixOperators.indexOf(ch) !== -1) {
        innerNode = removeLastEmptyText(mainNode, innerNode)
        innerNode = insertOperator(mainNode, innerNode, ch, unaryPrefixOperatorClass)
        continue
      }
      if (unaryPostfixOperators.indexOf(ch) !== -1) {
        innerNode = removeLastEmptyText(mainNode, innerNode)
        innerNode = insertOperator(mainNode, innerNode, ch, unaryPostfixOperatorClass)
        continue
      }

      innerNode = insertLastEmptyText(mainNode, innerNode);

      innerNode.innerHTML += ch
    }

    return mainNode.innerHTML
  }

  function insertSpace(innerNode, mainNode) {
    if (innerNode.innerHTML != '') {
      innerNode = createSpan(textClass)
      mainNode.appendChild(innerNode)
    }

    return innerNode
  }

  function insertOperator(mainNode, innerNode, operatorName, operatorClass) {
    let currentNode = mainNode
    if (innerNode !== null && innerNode.innerHTML === '' && subContainerClasses.includes(innerNode.className)) {
      currentNode = innerNode
    }

    innerNode = createSpan(operatorClass)
    innerNode.innerHTML = operatorName
    currentNode.appendChild(innerNode)

    innerNode = createSpan(textClass)
    currentNode.appendChild(innerNode)

    return innerNode
  }

  function insertPower(mainNode, innerNode) {
    let parentNode = innerNode.parentNode

    let powSpan = createSpan(powerClass)
    parentNode.appendChild(powSpan)

    powSpan.appendChild(innerNode)
    innerNode = createSpan(powerExpClass)
    powSpan.appendChild(innerNode)

    return innerNode
  }

  function insertFraction(mainNode, innerNode) {
    mainNode.removeChild(innerNode)
    innerNode.className = numeratorClass

    let fracSpan = createSpan(fractionClass)
    mainNode.appendChild(fracSpan)

    fracSpan.appendChild(innerNode)
    fracSpan.appendChild(createSpan(fractionLineClass))
    innerNode = createSpan(denominatorClass)
    fracSpan.appendChild(innerNode)

    return innerNode
  }

  function insertBrackets(mathText, start, end, mainNode, innerNode) {
    const closingBracketPos = getClosingBracketPos(mathText, start, end)

    if (closingBracketPos !== -1) {
      let funcName = innerNode.innerHTML

      innerNode = insertLastEmptyText(mainNode, innerNode);

      if (funcName !== '') {
        switch (funcName) {
          case 'sqrt': {
            let sqrtSpan = createSpan(rootClass)

            innerNode.innerHTML = ''
            innerNode.appendChild(sqrtSpan)
            innerNode = sqrtSpan

            break
          } case 'abs': {
            let absSpan = createSpan(absClass)

            innerNode.innerHTML = ''
            innerNode.appendChild(absSpan)
            innerNode = absSpan

            break
          } default: {
            let nameSpan = createSpan(functionNameClass)
            nameSpan.innerHTML = innerNode.innerHTML

            let funcSpan = createSpan(functionClass)
            funcSpan.appendChild(nameSpan)
            funcSpan.appendChild(createSpan(bracketsClass))

            innerNode.innerHTML = ''
            innerNode.appendChild(funcSpan)
            innerNode = funcSpan.lastChild

            break
          }
        }

        innerNode.innerHTML += funcName
      } else if (innerNode.className === textClass) {
        innerNode.className = bracketsClass
      }

      let hintSpan = createSpan(textHintClass)
      hintSpan.innerHTML = toHtmlRec(mathText, start + 1, closingBracketPos - 1)
      innerNode.innerHTML = ''
      innerNode.appendChild(hintSpan)

      innerNode = mainNode.lastChild

      start = closingBracketPos
    } else {
      innerNode.innerHTML += '('

      innerNode = createSpan(textClass)
      mainNode.appendChild(innerNode)
    }

    return { start, innerNode: innerNode }
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

  function removeLastEmptyText(mainNode, innerNode) {
    if (mainNode.lastChild.className === textClass && mainNode.lastChild.innerHTML === '') {
      mainNode.removeChild(mainNode.lastChild)
      innerNode = mainNode.lastChild
    }

    return innerNode
  }

  function insertLastEmptyText(mainNode, innerNode) {
    if (innerNode && innerNode.lastChild && innerNode.lastChild.className) {
      innerNode = createSpan(text)
      mainNode.appendChild(innerNode)
    }

    return innerNode
  }
}

function toMathText(htmlText) {
  let node = createSpan()
  node.innerHTML = htmlText

  let text = toMathTextRec(node)

  for (let key in mathHtmlMap) {
    text = text.replaceAll(mathHtmlMap[key], key)
  }

  return text

  //---------------------------------------------------------------------------------------------------------//

  function toMathTextRec(node) {
    if (node.childElementCount === 0) {
      return node.innerText
    }

    switch (node.className) {
      case textClass:
      case textHintClass:
      case functionNameClass:
      case binaryOperatorClass:
      case unaryPrefixOperatorClass:
      case unaryPostfixOperatorClass: {
        return node.innerText
      }
      case bracketsClass: {
        return '(' + toMathTextChildren(node) + ')'
      }
      case absClass: {
        return 'abs(' + toMathTextChildren(node) + ')'
      }
      case rootClass: {
        return 'sqrt(' + toMathTextChildren(node) + ')'
      }
      case fractionClass: {
        return '(' + toMathTextChildren(node.firstChild) + ')/(' + toMathTextChildren(node.lastChild) + ')'
      }
      case powerClass: {
        return '(' + toMathTextChildren(node.firstChild) + ')^(' + toMathTextChildren(node.lastChild) + ')'
      }
      default: {
        return toMathTextChildren(node)
      }
    }
  }

  function toMathTextChildren(node) {
    let text = ''

    for (let i = 0; i < node.childElementCount; i++) {
      const child = node.children[i]
      const childText = toMathTextRec(child)

      if (text.length > 0 && text.charAt(text.length - 1) === ' ' && child.className === unaryPostfixOperatorClass) {
        text = text.substring(0, text.length - 1)
      }

      text += childText

      if (childText !== '' && child.className !== functionNameClass && child.className !== unaryPrefixOperatorClass) {
        text += ' '
      }
    }

    if (text.length > 0 && text.charAt(text.length - 1) === ' ') {
      return text.substring(0, text.length - 1)
    }

    return text
  }
}

function reformatMathTextView(node) {
  removeEmptyTexts(node)
  // TODO: fix this function
  // reformatTexts(node)
  reformatOperators(node)
  reformatContainers(node)

  //---------------------------------------------------------------------------------------------------------//

  function removeEmptyTexts(node) {
    for (let i = 0; i < node.childElementCount; i++) {
      let childNode = node.children[i]
      removeEmptyTexts(childNode)

      if (childNode.className === textClass && childNode.innerText === '') {
        node.removeChild(childNode)
        i--
      }
    }
  }

  function reformatTexts(node) {
    for (let i = 0; i < node.childElementCount; i++) {
      let childNode = node.children[i]
      reformatTexts(childNode)

      if (childNode.childElementCount > 0
        && (childNode.className === textClass || childNode.className === textHintClass)) {

        while (childNode.childElementCount !== 0) {
          node.insertBefore(childNode.firstChild, childNode)
        }

        node.removeChild(childNode)

        i--
      }
    }
  }

  function reformatOperators(node) {
    for (let i = 0; i < node.childElementCount; i++) {
      let childNode = node.children[i]
      reformatOperators(childNode)
    }

    for (let i = 0; i < node.childElementCount; i++) {
      let child = node.children[i]

      if (child.className === binaryOperatorClass
        && unaryPrefixOperators.includes(child.innerText)
        && (child.previousSibling === null
          || child.previousSibling.className === unaryPrefixOperatorClass
          || child.previousSibling.innerHTML === '')) {

        child.className = unaryPrefixOperatorClass
      }
    }

    for (let i = 0; i < node.childElementCount; i++) {
      let child = node.children[i]

      if (child.className === binaryOperatorClass) {
        if (child.previousSibling === null || child.previousSibling.className === binaryOperatorClass) {
          node.insertBefore(createSpan(textHintClass), child)
        }

        if (child.nextSibling === null || child.nextSibling.className === binaryOperatorClass) {
          node.insertBefore(createSpan(textHintClass), child.nextSibling)
          i++
        }
      }
      else if (child.className === unaryPrefixOperatorClass) {
        if (child.previousSibling === null) {
          node.insertBefore(createSpan(textClass), child)
        }

        if (child.nextSibling === null || child.nextSibling.className === binaryOperatorClass) {
          node.insertBefore(createSpan(textHintClass), child.nextSibling)
          i++
        }
      }
      else if (child.className === unaryPostfixOperatorClass) {
        if (child.previousSibling === null || child.previousSibling.className === binaryOperatorClass) {
          node.insertBefore(createSpan(textHintClass), child)
        }

        if (child.nextSibling === null) {
          node.insertBefore(createSpan(textClass), child.nextSibling)
          i++
        }
      }
    }
  }

  function reformatContainers(node) {
    for (let i = 0; i < node.childElementCount; i++) {
      let childNode = node.children[i]
      reformatContainers(childNode)

      if (containerClasses.includes(childNode.className)) {
        let prevSibling = childNode.previousSibling
        if (prevSibling === null || containerClasses.includes(prevSibling.className)) {
          node.insertBefore(createSpan(textClass), childNode)
        }

        let nextSibling = childNode.nextSibling
        if (nextSibling === null || containerClasses.includes(nextSibling.className)) {
          node.insertBefore(createSpan(textClass), nextSibling)
          i++
        }
      }
    }

    if (subContainerClasses.includes(node.className)) {
      if (node.childElementCount === 0) {
        let newChild = createSpan(textHintClass)
        newChild.innerText = node.innerText

        node.innerText = ''
        node.appendChild(newChild)
      }
    }

    if (containerClasses.includes(node.className) || subContainerClasses.includes(node.className)) {
      if (node.childElementCount === 1) {
        let child = node.children[0]

        if (child.className === textClass) {
          let newChild = createSpan(textHintClass)
          newChild.innerText = child.innerText

          let parentNode = child.parentNode
          parentNode.replaceChild(newChild, child)
        }
      }
    }

    // TODO: it would be nice to find another way to put the cursor in situations like '(5)' when inserting the cursor before '5'
    if (node.childElementCount > 0
      && (node.firstChild.className === textClass || node.firstChild.className === textHintClass)
      && node.firstChild.innerText !== '') {

      node.insertBefore(createSpan(textClass), node.firstChild)
    }
  }
}

function getFirstChildTextHintNode(mainNode, startIndex, endIndex) {
  for (let i = startIndex; i <= endIndex; i++) {
    let child = mainNode.children[i]

    if (child.className === textHintClass) {
      return child
    }

    if (child.children.length > 0) {
      return getFirstChildTextHintNode(child, 0, child.children.length - 1)
    }
  }

  return null
}

function setCursorToNode(range, node) {
  range.setStart(node, node.innerText.length)
  node.scrollIntoView()
}

function createSpan(className) {
  let span = document.createElement('span')
  span.className = className
  return span
}
