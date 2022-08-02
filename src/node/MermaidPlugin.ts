import type {Plugin} from '@vuepress/core'
import {hash, path} from '@vuepress/utils'

const rpc = require('sync-rpc');
const remote = rpc(__dirname + '/worker.js');

const { optimize } = require('svgo');



//注册组件
const mermaidChart = (tokens, idx, options, env, slf) => {
    try {
        const token = tokens[idx]
        const {content} = token
        let t =  remote(content)
        const result = optimize(t,{
            plugins:[
                'cleanupAttrs',
                'mergeStyles',
                'inlineStyles',
                'removeStyleElement',
                'removeScriptElement'
            ]
        });
        const optimizedSvgString = result.data;
        return `${optimizedSvgString}`;
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
    }
})
