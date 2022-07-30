import type {Plugin} from '@vuepress/core'
import {hash, path} from '@vuepress/utils'


//注册组件
const mermaidChart = (tokens, idx, options, env, slf) => {
    try {
        const token = tokens[idx]
        const key = `mermaid_${hash(idx)}`
        const {content} = token

        let encoded = encodeURIComponent(content)
        return `<Mermaid id="${key}" graph="${encoded}"></Mermaid>`
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