const PRELUDE = '<?xml version="1.0" encoding="UTF-8"?>'
const TETELEK = ['megnevezes', 'mennyiseg', 'mennyisegiEgyseg', 'nettoEgysegar', 'netto', 'afakulcs', 'afa', 'brutto']

class NyugtaCreate {
  constructor() {
    this.ns = 'http://www.szamlazz.hu/xmlnyugtacreate'
    this.xml = document.implementation.createDocument(this.ns, 'xmlnyugtacreate')
    this.rootElement = this.xml.childNodes[0]
    this.rootElement.setAttribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
    this.rootElement.setAttribute('xsi:schemaLocation', 'http://www.szamlazz.hu/xmlnyugtacreate http://www.szamlazz.hu/docs/xsds/nyugta/xmlnyugtacreate.xsd')
    this.beallitasok = this.xml.createElementNS(this.ns, 'beallitasok')
    this.fejlec = this.xml.createElementNS(this.ns, 'fejlec')
    this.tetelek = this.xml.createElementNS(this.ns, 'tetelek')
  }

  buildLeaf(name, content) {
    let e = this.xml.createElementNS(this.ns, name)
    e.textContent = content
    return e
  }

  setBeallitasok(szamlaagentkulcs, pdfLetoltes) {
    this.beallitasok.appendChild(this.buildLeaf('szamlaagentkulcs', szamlaagentkulcs))
    this.beallitasok.appendChild(this.buildLeaf('pdfLetoltes', pdfLetoltes))
  }

  setFejlec(elotag, fizmod, penznem, pdfSablon) {
    this.fejlec.appendChild(this.buildLeaf('elotag', elotag))
    this.fejlec.appendChild(this.buildLeaf('fizmod', fizmod))
    this.fejlec.appendChild(this.buildLeaf('penznem', penznem))
    this.fejlec.appendChild(this.buildLeaf('pdfSablon', pdfSablon))
  }

  addTetel(tetel) {
    let e = this.xml.createElementNS(this.ns, 'tetel')
    for (const i of TETELEK) {
      e.appendChild(this.buildLeaf(i, tetel.get(i)))
    }
    this.tetelek.appendChild(e)
  }

  toString() {
    this.rootElement.appendChild(this.beallitasok)
    this.rootElement.appendChild(this.fejlec)
    this.rootElement.appendChild(this.tetelek)
    let serializer = new XMLSerializer()
    return PRELUDE + serializer.serializeToString(this.xml)
  }
}

class NyugtaGet {
  constructor(szamlaagentkulcs, pdfLetoltes, nyugtaszam) {
    this.ns = 'http://www.szamlazz.hu/xmlnyugtaget'
    this.xml = document.implementation.createDocument(this.ns, 'xmlnyugtaget')
    this.rootElement = this.xml.childNodes[0]
    this.rootElement.setAttribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
    this.rootElement.setAttribute('xsi:schemaLocation', 'http://www.szamlazz.hu/xmlnyugtaget http://www.szamlazz.hu/docs/xsds/nyugtaget/xmlnyugtaget.xsd')
    this.beallitasok = this.xml.createElementNS(this.ns, 'beallitasok')
    this.beallitasok.appendChild(this.buildLeaf('szamlaagentkulcs', szamlaagentkulcs))
    this.beallitasok.appendChild(this.buildLeaf('pdfLetoltes', pdfLetoltes))
    this.fejlec = this.xml.createElementNS(this.ns, 'fejlec')
    this.fejlec.appendChild(this.buildLeaf('nyugtaszam', nyugtaszam))
  }

  buildLeaf(name, content) {
    let e = this.xml.createElementNS(this.ns, name)
    e.textContent = content
    return e
  }

  toString() {
    this.rootElement.appendChild(this.beallitasok)
    this.rootElement.appendChild(this.fejlec)
    let serializer = new XMLSerializer()
    return PRELUDE + serializer.serializeToString(this.xml)
  }
}

class NyugtaStorno {
  constructor(szamlaagentkulcs, pdfLetoltes, nyugtaszam) {
    this.ns = 'http://www.szamlazz.hu/xmlnyugtast'
    this.xml = document.implementation.createDocument(this.ns, 'xmlnyugtast')
    this.rootElement = this.xml.childNodes[0]
    this.rootElement.setAttribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
    this.rootElement.setAttribute('xsi:schemaLocation', 'http://www.szamlazz.hu/xmlnyugtast http://www.szamlazz.hu/docs/xsds/nyugtast/xmlnyugtast.xsd')
    this.beallitasok = this.xml.createElementNS(this.ns, 'beallitasok')
    this.beallitasok.appendChild(this.buildLeaf('szamlaagentkulcs', szamlaagentkulcs))
    this.beallitasok.appendChild(this.buildLeaf('pdfLetoltes', pdfLetoltes))
    this.fejlec = this.xml.createElementNS(this.ns, 'fejlec')
    this.fejlec.appendChild(this.buildLeaf('nyugtaszam', nyugtaszam))
  }

  buildLeaf(name, content) {
    let e = this.xml.createElementNS(this.ns, name)
    e.textContent = content
    return e
  }

  toString() {
    this.rootElement.appendChild(this.beallitasok)
    this.rootElement.appendChild(this.fejlec)
    let serializer = new XMLSerializer()
    return PRELUDE + serializer.serializeToString(this.xml)
  }
}

class NyugtaSend {
  constructor(szamlaagentkulcs, nyugtaszam, email, emailReplyto, emailTargy, emailSzoveg) {
    this.ns = 'http://www.szamlazz.hu/xmlnyugtasend'
    this.xml = document.implementation.createDocument(this.ns, 'xmlnyugtasend')
    this.rootElement = this.xml.childNodes[0]
    this.rootElement.setAttribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
    this.rootElement.setAttribute('xsi:schemaLocation', 'http://www.szamlazz.hu/xmlnyugtasend http://www.szamlazz.hu/docs/xsds/nyugtasend/xmlnyugtasend.xsd')
    this.beallitasok = this.xml.createElementNS(this.ns, 'beallitasok')
    this.beallitasok.appendChild(this.buildLeaf('szamlaagentkulcs', szamlaagentkulcs))
    this.fejlec = this.xml.createElementNS(this.ns, 'fejlec')
    this.fejlec.appendChild(this.buildLeaf('nyugtaszam', nyugtaszam))
    this.emailKuldes = this.xml.createElementNS(this.ns, 'emailKuldes')
    this.emailKuldes.appendChild(this.buildLeaf('email', email))
    this.emailKuldes.appendChild(this.buildLeaf('emailReplyto', emailReplyto))
    this.emailKuldes.appendChild(this.buildLeaf('emailTargy', emailTargy))
    this.emailKuldes.appendChild(this.buildLeaf('emailSzoveg', emailSzoveg))
  }

  buildLeaf(name, content) {
    let e = this.xml.createElementNS(this.ns, name)
    e.textContent = content
    return e
  }

  toString() {
    this.rootElement.appendChild(this.beallitasok)
    this.rootElement.appendChild(this.fejlec)
    this.rootElement.appendChild(this.emailKuldes)
    let serializer = new XMLSerializer()
    return PRELUDE + serializer.serializeToString(this.xml)
  }
}

export {NyugtaCreate, NyugtaGet, NyugtaStorno, NyugtaSend}

