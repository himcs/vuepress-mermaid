import type {Plugin} from '@vuepress/core'
import {hash, path} from '@vuepress/utils'
const puppeteer = require('puppeteer')
const path = require('path')
const backgroundColor = 'white'
getSVG = async (definition) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(`file://${path.join(__dirname, '../index.html')}`)
    const result = await page.$eval('#container', (container, definition) => {
      container.textContent = definition
      try {
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
      const svg = container.getElementsByTagName?.('svg')?.[0]
      svg.style.backgroundColor = backgroundColor
      return container.innerHTML
    })
    const svgXML = convertToValidXML(svg)
    await browser.close()
    return svgXML
  }


//注册组件
const mermaidChart = (tokens, idx, options, env, slf) => {
    try {
        const token = tokens[idx]
        const key = `mermaid_${hash(idx)}`
        const {content} = token
        return await getSVG(token)
    } catch ({str, hash}) {
        return `<pre>${str}</pre>`
    }
}

const MarkdownMermaidPlugin = (md) => {
    const temp = md.renderer.rules.fence.bind(md.renderer.rules)
    md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
        const token = tokens[idx]
        const code = token.content.trim()
        if (token.info === 'mermaid') {
            return mermaidChart(tokens, idx, options, env, slf)
        }
        return temp(tokens, idx, options, env, slf)
    }
}


export const MermaidPlugin = (): Plugin => ({
    name: 'vuepress-mermaid',
    extendsMarkdown: (md) => {
        md.use(MarkdownMermaidPlugin)
    },
    clientConfigFile: path.resolve(__dirname, '../client/config.js'),
})
