<template>
  <div class="list-view" @contextmenu.self="contextMenuHandler.show" @click.self="focusHandler">
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
import NaSvg from "@/components/main/NaSvg.vue";

// ------------------------ data definition ------------------------

const props = defineProps({
  data: {required: true, type: Array}
})

const emit = defineEmits(['enter:folder'])

const tableData = {
  columns: [
    {
      title: '名称', key: 'title', resizable: true,
      render({title, type}) {
        let icon = type === 'folder' ? '#icon-folder-small' : '#icon-globe'
        let children = [h(NaSvg, {icon, height: '25px'}), title]
        let style = {display: 'flex', alignItems: 'center', lineHeight: '25px'}
        return h('span', {style}, children)
      }
    },
    {
      title: '修改日期', key: 'update', resizable: true, width: 250,
      render({update}) {
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
  rowProps: (row) => ({
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
        emit("enter:folder", row.id)
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

const focusHandler = () => {
  // 空白点击
  currentObj.value.id = ''
}

// --------------------------- context menu -------------------------

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
    console.log(key)
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