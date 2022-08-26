<template>
  <div class="position-relative">
    <div :id="rdid+'responsive-dropdown'" class="dropdown-container" :style="`max-width: calc(100vw - ${fillerWidth}px)`">
      <div :id="rdid+'slot-content'" :class="{'d-inline': !block, 'd-block': block}">
        <slot />
      </div>
      <button v-if="verticalContent > 0" :id="rdid+'more-btn'" class="button-container" :style="'color:' + color" @mouseup="active = !active">
        {{ buttonTitle }}
        <slot name="icon" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          :fill="color"
          class="bi bi-chevron-down"
          viewBox="0 0 16 16"
        >
          <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
        </svg>
      </button>
    </div>
    <div :id="rdid + 'vertical-content'" class="content-dropdown" :class="{ active }" />
  </div>
</template>
<script>
export default {
  props: {
    buttonTitle: {
      type: String,
      default: 'Mais'
    },
    rdid: {
      type: String,
      default: 'prefix_'
    },
    color: {
      type: String,
      default: 'white'
    },
    icon: {
      type: Boolean,
      default: true
    },
    fillerWidth: {
      type: Number,
      default: 995
    },
    block: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    fillerWidth () {
      console.log('testing watch')
      this.restructureElements({ target: { innerWidth: window.innerWidth } })
    }
  },
  data () {
    return {
      previousWidth: 0,
      active: false,
      hovering: false,
      verticalContent: 0
    }
  },
  mounted () {
    this.previousWidth = window.innerWidth
    const elements = document.getElementById(this.rdid + 'slot-content')
    const container = document.getElementById(this.rdid + 'vertical-content')
    window.addEventListener('mousedown', () => {
      if (this.active && !this.hovering) {
        this.active = false
        this.hovering = false
      }
    })
    container.addEventListener('mouseenter', () => {
      this.hovering = true
    })
    container.addEventListener('mouseleave', () => {
      this.hovering = false
    })
    const config = { attributes: true, childList: true, characterData: true }
    for (let i = 0; i < elements.children.length; i++) {
      const e = elements.children[i]
      e.setAttribute('id', 'rd_' + i)
    }
    this.restructureElements({ target: { innerWidth: window.innerWidth }, initial: true })
    window.addEventListener('resize', this.restructureElements)
    const observer = new MutationObserver(() => {
      this.restructureElements({ target: { innerWidth: window.innerWidth } })
    })
    observer.observe(elements, config)
    this.observer = observer
  },
  beforeUnmount () {
    this.observer.disconnect()
  },
  destroyed () {
    window.removeEventListener('resize', this.restructureElements)
  },
  methods: {
    restructureElements (e) {
      const elements = document.getElementById(this.rdid + 'slot-content')
      const container = document.getElementById(this.rdid + 'vertical-content')
      if (e.target.innerWidth > this.previousWidth) {
        if (this.checkScrollBar(this.rdid + 'responsive-dropdown', 'horizontal')) {
          this.previousWidth = e.target.innerWidth
          return
        }
        elements.appendChild(container.children[0])
        this.verticalContent = container.children.length
      } else {
        if (!this.checkScrollBar(this.rdid + 'responsive-dropdown', 'horizontal')) {
          this.previousWidth = e.target.innerWidth
          return
        }
        while (this.checkScrollBar(this.rdid + 'responsive-dropdown', 'horizontal')) {
          if (elements.children[elements.children.length - 1]) {
            container.appendChild(elements.children[elements.children.length - 1])
            this.verticalContent = container.children.length
          }
        }
        if (e.initial && elements.children[elements.children.length - 1]) {
          container.appendChild(elements.children[elements.children.length - 1])
          this.verticalContent = container.children.length
        }
      }
      this.previousWidth = e.target.innerWidth
    },
    checkScrollBar (elementId, dir) {
      const element = document.getElementById(elementId)
      if (!element) {
        return false
      }
      dir = (dir === 'vertical') ? 'scrollTop' : 'scrollLeft'
      let res = !!element[dir]
      if (!res) {
        element[dir] = 1
        res = !!element[dir]
        element[dir] = 0
      }
      return res
    }
  }
}
</script>
<style scoped>
.dropdown-container {
  white-space: nowrap;
  overflow: auto;
  width: 100%;
}
.content-dropdown{
  position: absolute;
  z-index: 5010;
  background: white;
  color: black !important;
  border-radius: 5px;
  padding: 5px;
  right: 0;
  display: none;
}
.content-dropdown.active{
  display: grid;
}
.content-dropdown *{
  color: black !important;
}
.button-container{
  background: transparent;
  border: none;
  color: white;
  padding: 6px 12px;
}
.button-container:hover{
  font-weight: bold;
}
</style>
