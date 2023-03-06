let mathTextView = document.getElementById(mathTextViewClass)
mathTextView.oncut = callOnCut
mathTextView.oncopy = callOnCopy
mathTextView.onpaste = callOnPaste

function setText(text) {
  mathTextView.innerHTML = toHtml(text)
  callOnChange()
}

function setHint(hintText) {
  mathTextView.setAttribute("hint", hintText)
}

function setColor(color) {
  mathTextView.style.color = color
}

function setIsEditable(isEditable) {
  mathTextView.contentEditable = isEditable
  requestFocus()
}

function insertAtCursor(text) {
  let selection = window.getSelection()
  let range = selection.getRangeAt(0)

  range.deleteContents()
  range.collapse()

  let parentNode = range.startContainer
  let childPrevNode = null

  while (parentNode.className !== mathTextViewClass
    && parentNode.className !== textHintClass
    && !containerClasses.includes(parentNode.className)
    && !subContainerClasses.includes(parentNode.className)) {

    childPrevNode = parentNode
    parentNode = parentNode.parentNode
  }

  let childNextNode = childPrevNode !== null ?
    childPrevNode.nextSibling :
    parentNode.children.length > 0 ?
      parentNode.children.firstChild :
      null

  let insNode = createSpan()
  insNode.innerHTML = toHtml(text)

  while (insNode.firstChild) {
    parentNode.insertBefore(insNode.firstChild, childNextNode)
  }

  let childPrevNodeIndex = childPrevNode !== null ?
    Array.prototype.indexOf.call(parentNode.children, childPrevNode) :
    0

  let childNextNodeIndex = childNextNode !== null ?
    Array.prototype.indexOf.call(parentNode.children, childNextNode) :
    parentNode.children.length - 1

  let firstTextHintNode = getFirstChildTextHintNode(parentNode, childPrevNodeIndex, childNextNodeIndex)

  if (firstTextHintNode !== null) {
    let tmpNode = createSpan()
    tmpNode.innerHTML = "|"

    firstTextHintNode.appendChild(tmpNode)
    setCursorToNode(range, firstTextHintNode)
    firstTextHintNode.removeChild(tmpNode)
  }
  else if (childNextNode !== null && parentNode.children.length > 0) {
    setCursorToNode(range, childNextNode.previousSibling)
  }
  else {
    setCursorToNode(range,  parentNode.lastChild)
  }

  callOnChange()
}

function deleteAtCursor() {
  let selection = window.getSelection()
  let range = selection.getRangeAt(0)

  if (!range.collapsed) {
    range.deleteContents()
    range.collapse()
  }
  else if (range.startOffset !== 0) {
    let node = range.startContainer.parentNode

    if (node.innerText.length === 1) {
      node.innerText = ''
    }
    else {
      document.execCommand("delete", false, null)
    }
  }
  else {
    let parentNode = range.startContainer
    let childNode = parentNode

    while (parentNode.innerText === ''
      && parentNode.className !== mathTextViewClass
      && !containerClasses.includes(childNode.className)) {

      childNode = parentNode
      parentNode = parentNode.parentNode
    }

    if (childNode.innerText !== '') {
      moveCursorLeft()
      return
    }

    parentNode.removeChild(childNode)
  }

  callOnChange()

  // TODO: fix cursor here
}

function clear() {
  setText("")
}

function undo() {
  document.execCommand("undo", false, null)
  // setCursorPosition(mathTextView, window.getSelection().anchorOffset)
  callOnChange()
}

function redo() {
  document.execCommand("redo", false, null)
  // setCursorPosition(mathTextView, window.getSelection().anchorOffset)
  callOnChange()
}

function moveCursorLeft() {
  // setCursorPosition(mathTextView, window.getSelection().anchorOffset - 1)
}

function moveCursorRight() {
  // setCursorPosition(mathTextView, window.getSelection().anchorOffset + 1)
}

function requestFocus() {
  mathTextView.focus()
}

function callOnCut(event) {
  setTimeout(() => {
    callOnChange()
  }, 0)
}

function callOnCopy(event) {
}

function callOnPaste(event) {
  const text = event.clipboardData.getData("text/plain")
  insertAtCursor(mathTextView, toMathText(text))
  event.preventDefault()
}

function callOnChange() {
  reformatMathTextView(mathTextView)
  Android.callOnTextChanged(toMathText(mathTextView.innerHTML))
}
