function element(id) {
  return document.getElementById(id)
}

function hide(id) {
  element(id).style.display = 'none'
}

function show(id) {
  element(id).style.display = ''
}

function showBlock(id) {
  element(id).style.display = 'block'
}

function addHTML(id, content) {
  element(id).innerHTML += content
}

function appendHTML(id, content) {
  element(id).appendChild(content)
}

function resetHTML(id) {
  element(id).innerHTML = ''
}

function setHTML(id, content) {
  element(id).innerHTML = content
}

function setTitle(content) {
  document.getElementsByTagName('TITLE')[0].text = content
}

function createElement(type, context) {
  var e = document.createElement(type)
  if (context)
    for (var key of Object.keys(context))
      if (key == 'list') {
        e.setAttribute(key, context[key])
      } else {
        e[key] = context[key]
      }
  return e
}

function A(context) {
  return createElement('a', context)
}

function Button(context) {
  context.type = 'button'
  return createElement('button', context)
}

function Checkbox(context) {
  context.type = 'checkbox'
  return createElement('input', context)
}

function Datalist(context) {
  return createElement('datalist', context)
}

function Div(context) {
  return createElement('div', context)
}

function H2(context) {
  return createElement('h2', context)
}

function H3(context) {
  return createElement('h3', context)
}

function I(context) {
  return createElement('i', context)
}

function Image(context) {
  return createElement('img', context)
}

function Input(context) {
  return createElement('input', context)
}

function Label(context) {
  return createElement('label', context)
}

function ListItem(context) {
  return createElement('li', context)
}

function Option(context) {
  return createElement('option', context)
}

function P(context) {
  return createElement('p', context)
}

function Select(context) {
  return createElement('select', context)
}

function Span(context) {
  return createElement('span', context)
}

function Table(context) {
  return createElement('table', context)
}

function TableData(context) {
  return createElement('td', context)
}

function TableDataParent(child, context=null) {
  var e = createElement('td', context)
  e.appendChild(child)
  return e
}

function TableHeader(context) {
  return createElement('th', context)
}

function TableRow(context) {
  return createElement('tr', context)
}

function TextArea(context) {
  return createElement('textarea', context)
}

function UnorderedList(context) {
  return createElement('ul', context)
}

function restoreFromLS(id, value) {
  return localStorage.hasOwnProperty(id) ?
    JSON.parse(localStorage[id]) : value
}

export {element, hide, show, showBlock, A, Button, Datalist, Div, H3, I, Input, Label,
        ListItem, Option, P, UnorderedList, resetHTML, setHTML, Span}

