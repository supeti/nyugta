import {element, hide, resetHTML, setHTML, show, showBlock, A, Button, Datalist, Div, H3, I, Input,
        Label, ListItem, Option, P, Span, UnorderedList} from './common.js'
import {NyugtaCreate, NyugtaGet, NyugtaStorno, NyugtaSend} from './xmlBuilder.js'

var mySidebar

function openMenu() {
  if (mySidebar.style.display === 'block') {
    closeMenu()
  } else {
    mySidebar.style.display = 'block'
  }
}

function closeMenuIfNotLarge() {
  if (document.body.clientWidth < 993) {
    closeMenu()
  }
}

function closeMenu() {
  mySidebar.style.display = 'none'
}

const menuItems = ['info', 'settings', 'newReceipt', 'listReceipt', 'sendEmail']
var currentPage = 'infoPage'

function switchPage(targetPage) {
  if (targetPage != currentPage) {
    hide(currentPage)
    show(targetPage)
    currentPage = targetPage
  }
}

function switchPageHandler(event) {
  const targetPage = event.target.id + 'Page'
  closeMenuIfNotLarge()
  switchPage(targetPage)
}

function initMenu() {
  mySidebar = element('mySidebar')
  element('openMenu').addEventListener('click', openMenu)
  element('closeMenu').addEventListener('click', closeMenu)
  show('infoPage')
  hide('settingsPage')
  hide('newReceiptPage')
  hide('listReceiptPage')
  hide('sendEmailPage')
  for (const i of menuItems) {
    element(i).addEventListener('click', switchPageHandler)
  }
}

function initSzamlaagentkulcs() {
  const input = element('szamlaagentkulcs')
  input.value = localStorage.getItem('szamlaagentkulcs')
  input.addEventListener('change', event => { localStorage.setItem('szamlaagentkulcs', event.target.value) })
}

function initPDFLetoltes() {
  const input = element('pdfLetoltes')
  input.checked = localStorage.getItem('pdfLetoltes') == 'true'
  input.addEventListener('change', event => { localStorage.setItem('pdfLetoltes', event.target.checked) })
}

const fizmodok = ['átutalás', 'készpénz', 'bankkártya', 'csekk', 'utánvét', 'ajándékutalvány', 'barion',
                  'barter', 'csoportos beszedés', 'OTP Simple', 'kompenzáció', 'kupon', 'PayPal', 'PayU',
                  'SZÉP kártya', 'utalvány']
const penznemek = ['Ft', 'HUF', 'EUR', 'USD', 'BTC', 'ETH']
const afakulcsok = ['0', '5', '10', '27', 'AAM', 'TAM', 'EU', 'EUK', 'MAA', 'F.AFA', 'K.AFA', 'ÁKK']
const megysegek = ['db', 'kg', 'dkg', 'g', 'mg', 'μg', 't', 'l', 'dl', 'hl', 'ml', 'cs']
function createList(id, list) {
  let dl = Datalist({id: id})
  for (const i of list) {
    dl.append(Option({value: i}))
  }
  document.body.append(dl)
}

function initLists() {
  createList('fizmodok', fizmodok)
  createList('penznemek', penznemek)
  createList('afakulcsok', afakulcsok)
  createList('megysegek', megysegek)
}

var nyugtaMap = {}
var nyugtak = []
function initNyugtak() {
  if (localStorage.hasOwnProperty('nyugtak')) {
    nyugtak = JSON.parse(localStorage.nyugtak)
  }
  if (localStorage.hasOwnProperty('nyugtaMap')) {
    nyugtaMap = JSON.parse(localStorage.nyugtaMap)
  }
  for (const i of nyugtak.reverse()) {
    delete nyugtaMap[i].pdf
    insertNyugta(nyugtaMap[i])
  }
}

function deleteItem(event) {
  event.target.parentElement.remove()
}

const PRECISION = 2

function updateInput(id, value) {
  let input = element(id)
  input.value = value.toFixed(PRECISION)
  input.classList.remove('w3-red')
}

function updateBrutto(id, netto) {
  const afakulcs = element('afakulcs-' + id).value
  if (afakulcs) {
    const nak = isNaN(afakulcs) ? 0 : parseFloat(afakulcs) / 100
    const afa = netto * nak
    updateInput('afa-' + id, afa)
    updateInput('brutto-' + id, netto + afa)
  }
}

function updateNetto(id, brutto) {
  const afakulcs = element('afakulcs-' + id).value
  if (afakulcs) {
    const nak = isNaN(afakulcs) ? 0 : parseFloat(afakulcs) / 100
    const netto = brutto / (1 + nak)
    updateInput('netto-' + id, netto)
    updateInput('afa-' + id, brutto - netto)
    const mennyiseg = element('mennyiseg-' + id).value
    if (mennyiseg) {
      updateInput('nettoEgysegar-' + id, netto / parseFloat(mennyiseg))
    }
  }
}

function mennyisegChange(event) {
  const id = event.target.id.split('-')[1]
  const mennyiseg = event.target.value
  const egysegar = element('nettoEgysegar-' + id).value
  if (egysegar && mennyiseg) {
    const netto = parseFloat(mennyiseg) * parseFloat(egysegar)
    updateInput('netto-' + id, netto)
    updateBrutto(id, netto)
  }
}

function nettoEgysegarChange(event) {
  const id = event.target.id.split('-')[1]
  const mennyisegId = 'mennyiseg-' + id
  const mennyiseg = element(mennyisegId).value
  const nettoEgysegar = event.target.value
  if (mennyiseg && nettoEgysegar) {
    const netto = parseFloat(nettoEgysegar) * parseFloat(mennyiseg)
    updateInput('netto-' + id, netto)
    updateBrutto(id, netto)
  }
}

function afakulcsChange(event) {
  const id = event.target.id.split('-')[1]
  const netto = element('netto-' + id).value
  const brutto = element('brutto-' + id).value
  if (netto) {
    updateBrutto(id, parseFloat(netto))
  } else if (brutto) {
    updateNetto(id, parseFloat(brutto))
  }
}

function nettoChange(event) {
  const id = event.target.id.split('-')[1]
  const netto = parseFloat(event.target.value)
  const mennyisegId = 'mennyiseg-' + id
  const mennyiseg = element(mennyisegId).value
  if (mennyiseg) {
    updateInput('nettoEgysegar-' + id, netto / parseFloat(mennyiseg))
  }
  if (netto) {
    updateBrutto(id, netto)
  }
}

function bruttoChange(event) {
  const id = event.target.id.split('-')[1]
  const brutto = parseFloat(event.target.value)
  if (brutto) {
    updateNetto(id, brutto)
  }
}

function highlightEmptyInput(event) {
  const input = event.target
  if (input.value) {
    input.classList.remove('w3-red')
  } else {
    input.classList.add('w3-red')
  }
}

function addInput(cellContext, labelContext, handler, inputContext) {
  let div = Div(cellContext)
  div.append(Label(labelContext))
  let input = Input(inputContext)
  if (handler) {
    input.addEventListener('change', handler)
  }
  input.addEventListener('change', highlightEmptyInput)
  div.append(input)
  return div
}

var tetelek
var tetelId = 0
function addItem(event) {
  tetelId++
  let li = ListItem({className: 'w3-display-container w3-row-padding'})
  let close = I({className: 'material-icons w3-large w3-button w3-circle w3-red w3-display-topright', innerText: 'close'})
  close.addEventListener('click', deleteItem)
  li.append(close)
  const full = {className: 'w3-col s12 m12 l12'}
  li.append(addInput(full, {innerText: 'Megnevezés'}, false,
                          {id: 'megnevezes-'+tetelId, className: 'w3-input', autocomplete: 'on'}))
  const quarter = {className: 'w3-col s6 m4 l3'}
  li.append(addInput(quarter, {innerText: 'Mennyiség'}, mennyisegChange,
                          {id: 'mennyiseg-'+tetelId, className: 'w3-input', type: 'number', step: 0.01}))
  li.append(addInput(quarter, {innerText: 'M. egység'}, false,
                          {id: 'mennyisegiEgyseg-'+tetelId, className: 'w3-input', list: 'megysegek'}))
  li.append(addInput(quarter, {innerText: 'N. egységár'}, nettoEgysegarChange,
                          {id: 'nettoEgysegar-'+tetelId, className: 'w3-input', type: 'number', step: 0.01}))
  li.append(addInput(quarter, {innerText: 'ÁFA-kulcs'}, afakulcsChange,
                          {id: 'afakulcs-'+tetelId, className: 'w3-input', list: 'afakulcsok'}))
  li.append(addInput(quarter, {innerText: 'Nettó'}, nettoChange,
                          {id: 'netto-'+tetelId, className: 'w3-input', type: 'number', step: 0.01}))
  li.append(addInput(quarter, {innerText: 'ÁFA'}, false,
                          {id: 'afa-'+tetelId, className: 'w3-input', disabled: true}))
  li.append(addInput(quarter, {innerText: 'Bruttó'}, bruttoChange,
                          {id: 'brutto-'+tetelId, className: 'w3-input', type: 'number', step: 0.01}))
  tetelek.append(li)
}

function resetItems(event) {
  tetelek.innerHTML = ''
  addItem()
}

const inputSet = new Set(['szamlaagentkulcs', 'megnevezes', 'mennyiseg', 'mennyisegiEgyseg', 'nettoEgysegar',
                          'afakulcs', 'netto', 'afa', 'brutto'])
function validInputs() {
  const missing = new Set()
  for (const i of document.getElementsByTagName('input')) {
    const name = i.id.split('-')[0]
    if (inputSet.has(name)) {
      if (!(i.value)) {
        missing.add(name)
        i.classList.add('w3-red')
      } else {
        i.classList.remove('w3-red')
      }
    }
  }
  if (missing.size != 0) {
    alert('Hiányzó adatok: ' + [...missing])
  }
  return missing.size == 0
}

function post(data, callback) {
  let xhr = new XMLHttpRequest()
  xhr.addEventListener('loadend', callback)
  xhr.open('POST', '/szamla/')
  xhr.responseType = 'text'
  xhr.send(data)
  showBlock('loader')
}

function parseNyugta(xml) {
  const nyugta = {}
  for (const i of xml.querySelector('alap').childNodes) {
    if (!i.nodeName.startsWith('#')) {
      nyugta[i.nodeName] = i.innerHTML
    }
  }
  nyugta.tetelek = []
  for (const i of xml.querySelector('tetelek').childNodes) {
    if (i.nodeName == 'tetel') {
      const tetel = {}
      for (const j of i.childNodes) {
        if (!j.nodeName.startsWith('#') && j.nodeName != 'fokonyv') {
          tetel[j.nodeName] = j.innerHTML
        }
      }
      nyugta.tetelek.push(tetel)
    }
  }
  nyugta.afakulcsossz = []
  for (const i of xml.querySelector('osszegek').childNodes) {
    if (!i.nodeName.startsWith('#')) {
      const osszeg = {}
      for (const j of i.childNodes) {
        if (!j.nodeName.startsWith('#')) {
          osszeg[j.nodeName] = j.innerHTML
        }
      }
      if (i.nodeName == 'totalossz') {
        nyugta.totalossz = osszeg
      } else {
        nyugta.afakulcsossz.push(osszeg)
      }
    }
  }
  return nyugta
}

function deleteNyugta(event) {
  const card = event.target.parentElement.parentElement
  const id = card.id
  card.remove()
  nyugtak.splice(nyugtak.indexOf(id), 1)
  localStorage.nyugtak = JSON.stringify(nyugtak)
  if (nyugtaMap[id].pdf) {
    window.URL.revokeObjectURL(nyugtaMap[id].pdf)
  }
  delete nyugtaMap[id]
  localStorage.nyugtaMap = JSON.stringify(nyugtaMap)
  resetHTML('listaMessage')
}

function storno(event) {
  const card = event.target.parentElement.parentElement.parentElement
  const nyugtaszam = card.id
  resetHTML('listaMessage')
  let nyugtaStorno = new NyugtaStorno(element('szamlaagentkulcs').value, element('pdfLetoltes').checked, nyugtaszam)
  let xml = nyugtaStorno.toString()
  let formData = new FormData()
  let blob = new Blob([xml], { type: 'text/xml'})
  formData.append('action-szamla_agent_nyugta_storno', blob)
  formData.append('generate', 'Reverse receipt')
  post(formData, nyugtaGetResponse)
}

function sendReceipt(event) {
  const card = event.target.parentElement.parentElement.parentElement
  const id = card.id
  element('emailNyugtaszam').value = id
  switchPage('sendEmailPage')
}

function insertNyugta(nyugta) {
  const list = element('nyugtak')
  const card = Div({className: 'w3-card-2 w3-section', id: nyugta.nyugtaszam})
  let div = Div({className: 'w3-container w3-display-container w3-blue'})
  let p = H3({innerText: nyugta.nyugtaszam})
  const fileName = nyugta.nyugtaszam + '.pdf'
  let anchor = A({download: fileName, href: nyugta.pdf})
  let button = I({className: 'material-icons w3-large w3-button w3-circle w3-margin-left', innerText: 'file_download'})
  if (nyugta.pdf == undefined) {
    anchor.classList.add('disabled')
    button.classList.add('w3-grey')
  } else {
    button.classList.add('w3-green')
  }
  anchor.append(button)
  p.append(anchor)
  button = I({className: 'material-icons w3-large w3-button w3-circle w3-green w3-margin-left', innerText: 'email'})
  button.addEventListener('click', sendReceipt)
  p.append(button)
  button = I({className: 'material-icons w3-large w3-button w3-circle w3-margin-left', innerText: 'block'})
  if (nyugta.stornozott != 'true') {
    button.addEventListener('click', storno)
    button.classList.add('w3-red')
  } else {
    button.classList.add('disabled')
    button.classList.add('w3-grey')
  }
  p.append(button)
  div.append(p)
  button = I({className: 'material-icons w3-large w3-button w3-circle w3-red w3-display-right w3-margin-right', innerText: 'close'})
  button.addEventListener('click', deleteNyugta)
  div.append(button)
  card.append(div)
  div = Div({className: 'w3-container w3-khaki'})
  let stornoText = ''
  if (nyugta.stornozott == 'true') {
    if (nyugta.stornozottNyugtaszam) {
      stornoText = ', sztornózza: ' + nyugta.stornozottNyugtaszam
    } else {
      stornoText = ', sztornózva'
    }
  }
  div.append(P({innerText: nyugta.kelt + ', ' + nyugta.penznem + ', ' + nyugta.fizmod + stornoText}))
  let ul = UnorderedList({className: 'w3-ul w3-border'})
  for (const i of nyugta.tetelek) {
    ul.append(ListItem({innerText: i.mennyiseg + i.mennyisegiEgyseg + ' ' + i.megnevezes + ': ' +
                        i.netto + ' + ' + i.afa + ' = ' + i.brutto}))
  }
  div.append(ul)
  ul = UnorderedList({className: 'w3-ul w3-border'})
  for (const i of nyugta.afakulcsossz) {
    const afakulcs = parseInt(i.afakulcs) ? i.afakulcs + '%' : i.afakulcs
    ul.append(ListItem({innerText: afakulcs + ' : ' + i.netto + ' + ' + i.afa + ' = ' + i.brutto}))
  }
  div.append(ul)
  const total = nyugta.totalossz
  div.append(P({innerText: 'Összesen: ' + total.netto + ' + ' + total.afa + ' = ' + total.brutto}))
  card.append(div)
  list.prepend(card)
}

function createPdfUrl(dom, nyugta) {
  const pdf = dom.querySelector('nyugtaPdf')
  if (pdf) {
    const byteCharacters = atob(pdf.innerHTML);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], {type : 'application/pdf'})
    nyugta.pdf = window.URL.createObjectURL(blob)
  }
}

function nyugtaCreateResponse(event) {
  hide('loader')
  let xhr = event.target
  try {
    window.rsp = xhr.response
    const parser = new DOMParser();
    const dom = parser.parseFromString(xhr.response, "application/xml");
    if (dom.querySelector('sikeres').innerHTML == 'true') {
      switchPage('listReceiptPage')
      const nyugta = parseNyugta(dom)
      createPdfUrl(dom, nyugta)
      setHTML('listaMessage', 'Sikerült a nyugta: ' + nyugta.nyugtaszam)
      nyugtak.unshift(nyugta.nyugtaszam)
      localStorage.nyugtak = JSON.stringify(nyugtak)
      nyugtaMap[nyugta.nyugtaszam] = nyugta
      localStorage.nyugtaMap = JSON.stringify(nyugtaMap)
      insertNyugta(nyugta)
    } else {
      let hibakod = dom.querySelector('hibakod').innerHTML
      let hibauzenet = dom.querySelector('hibauzenet').innerHTML
      alert('Hiba ' + hibakod + ': ' + hibauzenet)
      setHTML('createErrorMessage', 'Hiba ' + hibakod + ': ' + hibauzenet)
    }
  } catch (error) {
    console.log(error)
    alert('Hiba.\n' + error)
  }
}

function createNyugta(event) {
  resetHTML('createErrorMessage')
  if (validInputs()) {
    let nyugtaCreate = new NyugtaCreate()
    nyugtaCreate.setBeallitasok(element('szamlaagentkulcs').value, element('pdfLetoltes').checked)
    nyugtaCreate.setFejlec(element('elotag').value, element('fizmod').value, element('penznem').value, element('pdfSablon').value)
    for (const li of tetelek.childNodes) {
      let tetel = new Map()
      for (const input of li.querySelectorAll('input')) {
        tetel.set(input.id.split('-')[0], input.value)
      }
      nyugtaCreate.addTetel(tetel)
    }
    let xml = nyugtaCreate.toString()
    let formData = new FormData()
    let blob = new Blob([xml], { type: 'text/xml'})
    formData.append('action-szamla_agent_nyugta_create', blob)
    formData.append('generate', 'Create receipt')
    post(formData, nyugtaCreateResponse)
  }
}

function nyugtaGetResponse(event) {
  hide('loader')
  let xhr = event.target
  try {
    window.rsp = xhr.response
    const parser = new DOMParser();
    const dom = parser.parseFromString(xhr.response, "application/xml");
    if (dom.querySelector('sikeres').innerHTML == 'true') {
      const nyugta = parseNyugta(dom)
      createPdfUrl(dom, nyugta)
      nyugtak.unshift(nyugta.nyugtaszam)
      localStorage.nyugtak = JSON.stringify(nyugtak)
      nyugtaMap[nyugta.nyugtaszam] = nyugta
      localStorage.nyugtaMap = JSON.stringify(nyugtaMap)
      insertNyugta(nyugta)
    } else {
      let hibakod = dom.querySelector('hibakod').innerHTML
      let hibauzenet = dom.querySelector('hibauzenet').innerHTML
      alert('Hiba ' + hibakod + ': ' + hibauzenet)
      setHTML('listaMessage', 'Hiba ' + hibakod + ': ' + hibauzenet)
    }
  } catch (error) {
    console.log(error)
    alert('Hiba.\n' + error)
  }
}

function getNyugta(event) {
  resetHTML('listaMessage')
  const nyugtaszam = element('nyugtaszam').value
  if (nyugtaszam) {
    if (nyugtaMap.hasOwnProperty(nyugtaszam)) {
      const card = element(nyugtaszam)
      card.remove()
      element('nyugtak').prepend(card)
      nyugtak.splice(nyugtak.indexOf(nyugtaszam), 1)
      nyugtak.unshift(nyugtaszam)
    } else {
      let nyugtaGet = new NyugtaGet(element('szamlaagentkulcs').value, element('pdfLetoltes').checked, nyugtaszam)
      let xml = nyugtaGet.toString()
      let formData = new FormData()
      let blob = new Blob([xml], { type: 'text/xml'})
      formData.append('action-szamla_agent_nyugta_get', blob)
      formData.append('generate', 'Query receipt')
      post(formData, nyugtaGetResponse)
    }
  }
}

function nyugtaSendResponse(event) {
  hide('loader')
  let xhr = event.target
  try {
    window.rsp = xhr.response
    const parser = new DOMParser();
    const dom = parser.parseFromString(xhr.response, "application/xml");
    if (dom.querySelector('sikeres').innerHTML == 'true') {
      setHTML('emailMessage', 'Sikerült elküldeni a nyugtát.')
    } else {
      let hibakod = dom.querySelector('hibakod').innerHTML
      let hibauzenet = dom.querySelector('hibauzenet').innerHTML
      alert('Hiba ' + hibakod + ': ' + hibauzenet)
      setHTML('emailMessage', 'Hiba ' + hibakod + ': ' + hibauzenet)
    }
  } catch (error) {
    console.log(error)
    alert('Hiba.\n' + error)
  }
}

function sendNyugta(event) {
  resetHTML('emailMessage')
  const nyugtaszam = element('emailNyugtaszam').value
  if (nyugtaszam) {
    let nyugtaSend = new NyugtaSend(element('szamlaagentkulcs').value, nyugtaszam,
                                    element('email').value, element('emailReplyto').value,
                                    element('emailTargy').value, element('emailSzoveg').value)
    let xml = nyugtaSend.toString()
    let formData = new FormData()
    let blob = new Blob([xml], { type: 'text/xml'})
    formData.append('action-szamla_agent_nyugta_send', blob)
    formData.append('generate', 'Send receipt')
    post(formData, nyugtaSendResponse)
  }
}

function init() {
  initMenu()
  initSzamlaagentkulcs()
  initPDFLetoltes()
  initLists()
  initNyugtak()
  element('addItem').addEventListener('click', addItem)
  element('resetItems').addEventListener('click', resetItems)
  element('createNyugta').addEventListener('click', createNyugta)
  element('getNyugta').addEventListener('click', getNyugta)
  element('send').addEventListener('click', sendNyugta)
  tetelek = element('tetelek')
  addItem()
  hide('loader')
}

document.addEventListener('DOMContentLoaded', init)

