<template>
  <div class="grid-view" @contextmenu="contextMenuHandler.show" @click="focusHandler">
    <span :class="['single-obj', currentObj.id === 'dir-2001' ? 'active': '']" id="dir-2001">
      <svg height="40px" viewBox="0 0 1024 1024">
        <use xlink:href="#icon-folder"/>
      </svg>
      <n-ellipsis style="max-width: 90px" :tooltip="false"
                  title="前端学习笔记真的很重要"> 前端学习笔记真的很重要
      </n-ellipsis>
    </span>
    <span :class="['single-obj', currentObj.id === 'tag-2002' ? 'active': '']" id="tag-2002">
      <svg height="40px" viewBox="0 0 1024 1024">
        <use xlink:href="#icon-file"/>
      </svg>
      <n-ellipsis style="max-width: 90px" :tooltip="false"
                  title="前端学习笔记真的很重要"> 前端学习笔记真的很重要
      </n-ellipsis>
    </span>
  </div>
  <n-dropdown
      trigger="manual"
      placement="bottom-start"
      :x="contextMenu.x.value" :y="contextMenu.y.value"
      :options="contextMenu.options.value"
      :show="contextMenu.visible.value"
      :on-clickoutside="contextMenuHandler.hide"
      @select="contextMenuHandler.select"
  />
</template>

<script setup>
import {ref, computed, nextTick} from 'vue'
import {NEllipsis, NDropdown} from 'naive-ui'

const data = ref([
  {title: '框架文档', type: 'dir', path: '/框架文档'},
  {title: '前端', type: 'dir', path: '/框架文档/前端'},
  {
    title: 'Aotu 前端代码规范',
    type: 'tag',
    path: '/框架文档/前端/Aotu 前端代码规范',
    url: 'https://guide.aotu.io/docs/',
    label: ['前端', '规范']
  },
  {
    title: 'Electron 启动加快',
    type: 'tag',
    path: '/框架文档/前端/Electron 启动加快',
    url: 'https://blog.inkdrop.app/how-to-make-your-electron-app-launch-1000ms-faster-32ce1e0bb52c',
    label: ['Electron']
  }
])

const currentObj = ref({
  id: '',
})

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
        {label: '新建书签', key: 'new-tag'},
        {label: '刷新', key: 'refresh'}
      ]
    } else if (contextMenu.awakeLoc.value === 'folder') {
      return [
        {label: '新建书签', key: 'new-tag'},
        {label: '重命名', key: 'rename'},
        {label: '移动到…', key: 'move'},
        {label: '删除', key: 'remove'},
      ]
    } else if (contextMenu.awakeLoc.value === 'tag') {
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
  y: ref(0)
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
      contextMenu.awakeLoc.value = item.id.startsWith('dir') ? 'folder' : 'tag'
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