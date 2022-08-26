<template>
  <div class="position-relative">
    <div
      :id="rdid+'responsive-dropdown'"
      class="dropdown-container"
      :style="maxWidth?`max-width: ${maxWidth}${maxWidthSuffix}`:`max-width: calc(100% - ${fillerWidth}${fillerWidthSuffix})`"
    >
      <div :id="rdid+'slot-content'" :class="{'d-inline': !block, 'd-block': block}">
        <slot />
      </div>
      <button v-if="verticalContent > 0" :id="rdid+'more-btn'" class="button-container v-middle" :style="'color:' + color" @mouseup="active = !active">
        {{ buttonTitle }}
        <slot name="icon" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          :fill="color"
          class="bi bi-chevron-down v-middle"
          viewBox="0 0 16 16"
        >
          <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
        </svg>
      </button>
    </div>
    <div :id="rdid + 'vertical-content'" class="content-dropdown" :class="{ active }" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, onUnmounted, computed } from 'vue'

const props = defineProps({
  buttonTitle: {
    type: String,
    default: "Mais"
  },
  rdid: {
    type: String,
    default: "prefix_"
  },
  color: {
    type: String,
    default: 'white'
  },
  icon: {
    type: Boolean,
    default: true
  },
  maxWidth: {
    type: Number,
    default: null
  },
  maxWidthSuffix: {
    type: String,
    default: 'px'
  },
  fillerWidth: {
    type: Number,
    default: 0
  },
  fillerWidthSuffix: {
    type: String,
    default: 'px'
  },
  block: {
    type: Boolean,
    default: false
  }
})

const previousWidth = ref(0)
const active = ref(false)
const hovering = ref(false)
const verticalContent = ref(0)
const observer = ref(null)

const computedFillerWidth = computed(() => {
    return props.fillerWidth
})

const computedMaxWidth = computed(() => {
    return props.maxWidth
})

watch(computedMaxWidth, (newValue, oldValue) => {
  restructureElements({ target: { innerWidth: newValue > oldValue ? window.innerWidth - 1 : window.innerWidth + 1 } })
})

watch(computedFillerWidth, (newValue, oldValue) => {
  restructureElements({ target: { innerWidth: newValue > oldValue ? window.innerWidth - 1 : window.innerWidth + 1 } })
})

onMounted(() => {
  previousWidth.value = window.innerWidth
  const elements = document.getElementById(props.rdid + 'slot-content')
  const container = document.getElementById(props.rdid + 'vertical-content')
  window.addEventListener('mousedown', () => {
    if (active.value && !hovering.value) {
      active.value = false
      hovering.value = false
    }
  })
  container.addEventListener('mouseenter', () => {
    hovering.value = true
  })
  container.addEventListener('mouseleave', () => {
    hovering.value = false
  })
  const config = { attributes: true, childList: true, characterData: true }
  for (let i = 0; i < elements.children.length; i++) {
    const e = elements.children[i]
    e.setAttribute('id', props.rdid + 'rd_' + i)
  }
  restructureElements({ target: { innerWidth: window.innerWidth }, initial: true })
  window.addEventListener('resize', restructureElements)
  const localObserver = new MutationObserver(() => {
    restructureElements({ target: { innerWidth: window.innerWidth } })
  })
  localObserver.observe(elements, config)
  observer.value = localObserver
})

onBeforeUnmount(() => {
  observer.value.disconnect()
})

onUnmounted(() => {
  window.removeEventListener('resize', restructureElements)
})

const restructureElements = (e) => {
  const elements = document.getElementById(props.rdid + 'slot-content')
  const container = document.getElementById(props.rdid + 'vertical-content')
  if (e.target.innerWidth > previousWidth.value) {
    if (checkScrollBar(props.rdid + 'responsive-dropdown', 'horizontal')) {
      previousWidth.value = e.target.innerWidth
      return
    }
    elements.appendChild(container.children[0])
    verticalContent.value = container.children.length
  } else {
    if (!checkScrollBar(props.rdid + 'responsive-dropdown', 'horizontal')) {
      previousWidth.value = e.target.innerWidth
      return
    }
    while (checkScrollBar(props.rdid + 'responsive-dropdown', 'horizontal') && elements.children[elements.children.length - 1]) {
      container.appendChild(elements.children[elements.children.length - 1])
      verticalContent.value = container.children.length
    }
    if (e.initial && elements.children[elements.children.length - 1]) {
      container.appendChild(elements.children[elements.children.length - 1])
      verticalContent.value = container.children.length
    }
  }
  previousWidth.value = e.target.innerWidth
}

const checkScrollBar = (elementId, dir) => {
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
</script>

<style scoped>
.position-relative{
  position: relative;
}
.v-middle{
  vertical-align: middle;
}
.d-inline{
  display: inline;
}
.d-block{
  display: block;
}
.dropdown-container {
  white-space: nowrap;
  overflow: auto;
  width: 100%;
}
.content-dropdown{
  position: absolute;
  z-index: 1010;
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
