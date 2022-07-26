import {defineClientConfig} from '@vuepress/client'
import {Mermaid} from './composables/mermaid'

export default defineClientConfig({
    enhance({app}) {
        app.component('Mermaid', Mermaid);
    }
})
