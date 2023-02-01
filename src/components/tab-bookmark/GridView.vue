<template>
  <div class="grid-view" @contextmenu="contextMenuHandler.show" @click="focusHandler">
    <template v-for="(item, index) of props.data" :key="index">
      <span :class="className(item.id)" :id="item.type + item.id"
            @dblclick="enterFolder(item)">
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

const props = defineProps({
  data: {required: true, type: Array}
})

const emit = defineEmits(['enter:folder'])

const currentObj = ref({id: ''})

const className = computed(() => {
  return (id) => {
    return ['single-obj', currentObj.value.id === id ? 'active' : '']
  }
})

const enterFolder = async (item) => {
  if (item.type === 'folder') {
    emit('enter:folder', item.id)
  } else {
    await IPC_API.showInBrowser(item.link)
  }
}

// 单机切换焦点对象
const focusHandler = (e) => {
  // 空白点击
  if (e.target.className === 'grid-view') {
    currentObj.value.id = ''
    return
  }
  let item = e.path.find(t => {
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
      return [
        {label: '新建文件夹', key: 'new-folder'},
        {label: '新建书签', key: 'new-link'},
        {label: '刷新', key: 'refresh'}
      ]
    } else if (contextMenu.awakeLoc.value === 'folder') {
      return [
        {label: '打开', key: 'open'},
        {label: '重命名', key: 'rename'},
        {label: '移动到…', key: 'move'},
        {label: '删除', key: 'remove'},
      ]
    } else if (contextMenu.awakeLoc.value === 'link') {
      return [
        {label: '打开浏览器', key: 'preview'},
        {label: '重命名', key: 'rename'},
        {label: '编辑', key: 'edit'},
        {label: '移动到…', key: 'move'},
        {label: '删除', key: 'remove'}
      ]
    }
  }),
  x: ref(0),
  y: ref(0),
  labelRenderer: (item) => {
    if (item.key === 'open') {
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
      let item = e.path.find(t => {
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
    console.log(key)
  }
}
</script>

// TODO 快捷键绑定
// Delete键 方向键 Home End 键 .etc
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