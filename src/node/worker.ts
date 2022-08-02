const puppeteer = require('puppeteer')
const path = require('path')
const { resolve } = require('@babel/core/lib/vendor/import-meta-resolve')

const convertToValidXML = html => {
  // <br> tags in valid HTML (from innerHTML) look like <br>, but they must look like <br/> to be valid XML (such as SVG)
  return html.replace(/<br>/gi, '<br/>')
}

async function getSvg (definition) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(`file://${path.join(__dirname, '../index.html')}`)
  const result = await page.$eval('#container', (container, definition) => {
    container.textContent = definition
    try {
     //@ts-ignore
      window.mermaid.initThrowsErrors(undefined, container)
      return { status: 'success' }
    } catch (error) {
      return { status: 'error', error, message: error.message }
    }
  }, definition)
  if (result.status === 'error') {
    console.error(result.message)
  }
  const svg = await page.$eval('#container', (container,) => {
    // const svg = container.getElementsByTagName?.('svg')?.[0]
    // svg.style.backgroundColor = backgroundColor
    return container.innerHTML
  })
  const svgXML = convertToValidXML(svg)
  await browser.close()
  console.log(svgXML)
  return svgXML
}

function init () {
  // you can setup any connections you need here
  return function (message) {
    return getSvg(message)
  }
}

module.exports = init