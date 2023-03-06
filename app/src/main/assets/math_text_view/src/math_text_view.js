let mathTextView = document.getElementById("math_text_view")
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
  document.execCommand("insertHTML", false, toHtml(text))
  setCursorPosition(mathTextView, window.getSelection().anchorOffset)
  callOnChange()
}

function deleteAtCursor() {
  document.execCommand("delete", false, null)
  setCursorPosition(mathTextView, window.getSelection().anchorOffset)
  callOnChange()
}

function clear() {
  setText("")
}

function undo() {
  document.execCommand("undo", false, null)
  setCursorPosition(mathTextView, window.getSelection().anchorOffset)
  callOnChange()
}

function redo() {
  document.execCommand("redo", false, null)
  setCursorPosition(mathTextView, window.getSelection().anchorOffset)
  callOnChange()
}

function moveCursorLeft() {
  setCursorPosition(mathTextView, window.getSelection().anchorOffset - 1)
}

function moveCursorRight() {
  setCursorPosition(mathTextView, window.getSelection().anchorOffset + 1)
}

function requestFocus() {
  mathTextView.focus()
}

function callOnCut(event) {
  setTimeout(() => {
    callOnChange()
  }, 0);
}

function callOnCopy(event) {
}

function callOnPaste(event) {
  const text = event.clipboardData.getData("text/plain")
  insertAtCursor(toMathText(text))
  event.preventDefault()
}

function callOnChange() {
  reformatMathTextView(mathTextView)
  // TODO: uncomment
  // Android.callOnTextChanged(toMathText(mathTextView.innerHTML))
}
