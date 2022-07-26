import {defineComponent, h} from 'vue'

import './style/loading.css'

export const Loading = defineComponent({
    name: 'Loading',
    props: {
        color: {
            required: false,
            default: 'rgb(66, 185, 131)'
        }
    },
    render() {
        return
        h(
            'div',
            {
                class: 'spinner',
                style: `{ background: ${this.props.color}`
            }
        )
    }
})

export default Loading
