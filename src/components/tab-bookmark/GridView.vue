<template>
  <div class="grid-view" @contextmenu="contextMenuHandler.show" @click="focusHandler">
    <template v-for="(item, index) of props.data" :key="index">
      <span :class="className(item.type + item.id)" :id="item.type + item.id"
            @dblclick="enterFolder(item, index)">
        <svg height="40px" viewBox="0 0 1024 1024">
          <use v-bind:xlink:href="'#icon-' + item.type"/>
        </svg>
        <div>
          <n-ellipsis style="max-width: 90px" :tooltip="false" :title="item.title">
            {{ item.title }}
          </n-ellipsis>
        </div>
      </span>
    </template>
  </div>
  <n-dropdown
      trigger="manual"
      placement="bottom-start"
      :x="contextMenu.x.value" :y="contextMenu.y.value"
      :options="contextMenu.options.value"
      :show="contextMenu.visible.value"
      :on-clickoutside="contextMenuHandler.hide"
      @select="contextMenuHandler.select"
      :render-label="contextMenu.labelRenderer"
  />
</template>

<script setup>
import {ref, computed, nextTick, h} from 'vue'
import {NEllipsis, NDropdown} from 'naive-ui'

// ----------------- props ------------------------
const props = defineProps({
  data: {required: true, type: Array},
  cut: {required: true, type: Object}
})
// ----------------- emit -------------------------
const emit = defineEmits(['enter:folder', 'context:click'])

// ------------------ data ------------------------
const currentObj = ref({id: '', pos: -1})
const className = computed(() => {
  return (id) => {
    return ['single-obj', currentObj.value.id === id ? 'active' : '']
  }
})

const enterFolder = async (item, pos) => {
  if (item.type === 'folder') {
    emit('enter:folder', item.id, pos)
  } else {
    await IPC_API.showInBrowser(item.link)
  }
}

// 单机切换焦点对象
const focusHandler = (e) => {
  // 空白点击
  if (e.target.className === 'grid-view') {
    currentObj.value.id = ''
    currentObj.value.pos = -1
    return
  }
  let item = e.composedPath().find(t => {
    return typeof (t.className) === 'string' && t.className.startsWith('single-obj')
  })
  currentObj.value.id = item.id
}

// 右键菜单
const contextMenu = {
  visible: ref(false),
  // 文件夹 | 书签 | 空白区域
  awakeLoc: ref('space'),
  options: computed(() => {
    if (contextMenu.awakeLoc.value === 'space') {
      let commonOptions = [
        {label: '新建文件夹', key: 'new-folder'},
        {label: '新建书签', key: 'new-link'},
        {label: '刷新', key: 'refresh'}
      ]
      if (props.cut.id !== null) {
        commonOptions.unshift({label: '粘贴', key: 'paste'})
      }
      return commonOptions
    } else if (contextMenu.awakeLoc.value === 'folder') {
      return [
        {label: '打开文件夹', key: 'open'},
        {label: '编辑', key: 'edit'},
        {label: '剪切', key: 'cut'},
        {label: '删除', key: 'remove'},
      ]
    } else if (contextMenu.awakeLoc.value === 'link') {
      return [
        {label: '打开浏览器', key: 'preview'},
        {label: '编辑', key: 'edit'},
        {label: '剪切', key: 'cut'},
        {label: '删除', key: 'remove'}
      ]
    }
  }),
  x: ref(0),
  y: ref(0),
  labelRenderer: (item) => {
    if (item.key === 'open' || item.key === 'paste') {
      return h('span', {style: {fontWeight: 'bold'}}, item.label)
    }
    return h('span', null, item.label)
  }
}

// 右键菜单事件回调
const contextMenuHandler = {
  show: function (e) {
    e.preventDefault()
    if (e.target.className === 'grid-view') {
      // 空白处点击的
      contextMenu.awakeLoc.value = 'space'
    } else {
      let item = e.composedPath().find(t => {
        return typeof (t.className) === 'string' && t.className.startsWith('single-obj')
      })
      contextMenu.awakeLoc.value = item.id.startsWith('folder') ? 'folder' : 'link'
      currentObj.value.id = item.id
    }
    contextMenu.visible.value = false
    nextTick().then(() => {
      contextMenu.visible.value = true
      contextMenu.x.value = e.clientX
      contextMenu.y.value = e.clientY
    })
  },
  hide: function () {
    contextMenu.visible.value = false
  },
  select: function (key) {
    // 这里的处理和 ListView 不同, 每个 id 前加了 folder 或 link
    // 上报事件时要去掉前缀
    const match = currentObj.value.id.match(/[0-9]+/)
    if (match) {
      const id = Number.parseInt(match[0])
      const pos = props.data.findIndex(item => item.id === id)
      emit('context:click', {key, id, pos})
    } else {
      emit('context:click', {key, id: null, pos: null})
    }
    contextMenu.visible.value = false
  }
}
</script>

<!--// TODO 快捷键绑定-->
<!--// Delete键 方向键 Home End 键 .etc-->
<style lang="scss" scoped>
.grid-view {
  display: grid;
  margin-top: 20px;
  grid-template-columns: repeat(auto-fill, 100px);
  grid-gap: 30px 35px;
  height: calc(100% - 20px);
  width: 100%;
}

.single-obj {
  text-align: center;
  height: 80px;
  width: 100px;
  border-radius: 3px;
  cursor: pointer;

  > svg {
    margin-top: 8px;
  }

  > span {
    font-size: 13px;
  }

  &:hover {
    background-color: #fcf0f0;
  }
}

.single-obj.active {
  border: 1px solid #ddd;
  background-color: #f8e2e1;
}
</style>