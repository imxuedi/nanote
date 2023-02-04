<template>
  <div class="list-view" @contextmenu.self="contextMenuHandler.show" @click.self="unFocus">
    <n-data-table
        :columns="tableData.columns"
        :data="props.data"
        :bordered="tableData.border"
        :row-props="tableData.rowProps"
        :row-class-name="tableData.className"
    />
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
import {computed, nextTick, ref, h} from "vue";
import {NDataTable, NDropdown, NTime} from "naive-ui";
import NaImg from "@/components/main/NaImg.vue";

// ------------------------ data definition ------------------------

const props = defineProps({
  data: {required: true, type: Array},
  cut: {required: true, type: Object}
})

const emit = defineEmits(['enter:folder', 'context:click'])

const tableData = {
  columns: [
    {
      title: '名称', key: 'title', resizable: true,
      render({title, type, icon}) {
        if (type === 'folder') {
          let children = [h(NaImg, {src: '#icon-folder-small', height: 25, type: 'svg'}), title]
          let style = {display: 'flex', alignItems: 'center', lineHeight: '25px'}
          return h('span', {style}, children)
        }
        if (icon && icon !== 'default') {
          return h(NaImg, {src: icon, height: 20, type: 'img'}, () => title)
        }
        return h(NaImg, {src: '#icon-globe', height: 20, type: 'svg'}, () => title)
      }
    },
    {
      title: '修改日期', key: 'update', resizable: true, width: 250,
      render({update}) {
        if (update.toString().length < 10) return '未知时间'
        // 兼容 10 位日期格式 (以秒为单位)
        if (update.toString().length === 10) {
          update = update * 1000
        }
        return h(NTime, {time: update})
      }
    },
    {
      title: '类型', key: 'type', render(row) {
        return row.type === 'folder' ? '目录' : '书签'
      },
      resizable: true,
    }
  ],
  border: true,
  rowProps: (row, pos) => ({
    onContextmenu: (e) => {
      contextMenu.awakeLoc.value = row.type === 'folder' ? 'folder' : 'link'
      contextMenu.visible.value = false
      currentObj.value.id = row.id
      nextTick().then(() => {
        contextMenu.visible.value = true
        contextMenu.x.value = e.clientX
        contextMenu.y.value = e.clientY
      })
    },
    onClick: () => {
      currentObj.value.id = row.id
    },
    onDblclick: () => {
      if (row.type === 'folder') {
        emit("enter:folder", row.id, pos)
      } else {
        IPC_API.showInBrowser(row.link)
      }
    }
  }),
  className: (row) => {
    if (row.id === currentObj.value.id) {
      // naive-ui 对于 n-data-table-tr--summary 类不施加 hover 效果
      return 'active n-data-table-tr--summary'
    }
    return '';
  }
}

const currentObj = ref({id: '1'})

const unFocus = () => currentObj.value.id = ''

// --------------------------- context menu -------------------------

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
    contextMenu.awakeLoc.value = 'space'
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
    const pos = props.data.findIndex(item => item.id === currentObj.value.id)
    emit('context:click', {key, id: currentObj.value.id, pos})
    contextMenu.visible.value = false
  }
}
</script>

<style lang="scss" scoped>
.list-view {
  margin-top: 20px;
  height: calc(100% - 20px);
  width: 100%;
}

:deep(.active td) {
  background-color: #f8e2e1;
}

:deep(.n-data-table-tr) {
  --n-merged-td-color-hover: #fcf0f0;
}

</style>