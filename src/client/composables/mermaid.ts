import {h, reactive, watchEffect} from 'vue'
import Loading from './loading'

const Mermaid = {
    name: 'Mermaid',
    props: {
        id: {
            type: String,
            required: false,
            default() {
                return 'diagram_' + Date.now()
            }
        },
        graph: {
            type: String,
            required: true
        },
        style: {
            type: Object,
            required: false,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            svg: undefined
        }
    },
    setup(props) {
        const state = reactive({
            svg: undefined
        })

        watchEffect(() => {
            if (props.graph) {
                import('mermaid/dist/mermaid.min').then(mermaid => {
                    mermaid.initialize({
                        startOnLoad: true
                    })

                    mermaid.render(
                        props.id,
                        decodeURIComponent(props.graph),
                        (svg) => {
                            state.svg = svg
                        }
                    )
                })
            }
        })

        return () => {
            const style = {
                width: '100%',
                ...props.style
            }

            return state.svg ? h('div', {
                innerHTML: state.svg,
                ...style
            }) : h(Loading)
        }
    },
    components: {
        Loading
    }
}

export {Mermaid}