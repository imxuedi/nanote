<template>
  <div class="list-view" @contextmenu.self="contextMenuHandler.show" @click.self="focusHandler">
    <n-data-table
        :columns="tableData.columns"
        :data="tableData.data.value"
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
import {NDataTable, NDropdown} from "naive-ui";
import NaSvg from "@/components/main/NaSvg.vue";

// ------------------------ data definition ------------------------

const tableData = {
  columns: [
    {
      title: '名称', key: 'name', resizable: true,
      render({name, type}) {
        let icon = type === 'dir' ? '#icon-folder-small' : '#icon-globe'
        let children = [h(NaSvg, {icon, height: '25px'}), name]
        let style = {display: 'flex', alignItems: 'center', lineHeight: '25px'}
        return h('span', {style}, children)
      }
    },
    {title: '修改日期', key: 'update', resizable: true, width: 250},
    {
      title: '类型', key: 'type', render(row) {
        return row.type === 'dir' ? '目录' : '书签'
      },
      resizable: true,
    },
    // {
    //   title: '打开', key: 'link', render(row) {
    //     if (row.type === 'tag') {
    //       return h('a', {href: row.link}, '在浏览器中打开')
    //     }
    //     return ''
    //   }
    // }
  ],
  data: ref([
    {
      id: '1',
      name: '锦上添花', type: 'dir', update: '2023-01-30 10:53',
      child: [
        {id: '1-1', name: 'Get Waves', type: 'tag', update: '2023-01-30 10:55', link: 'https://getwaves.io/'},
        {
          id: '1-2',
          name: 'Fancy Border',
          type: 'tag',
          update: '2023-01-30 10:55',
          link: 'https://9elements.github.io/fancy-border-radius/'
        },
        {id: '1-3', name: 'CSS Section Separator', type: 'tag', update: '2023-01-30 10:55', link: 'https://wweb.dev/'},
      ]
    },
    {id: '2', name: '阿里云', type: 'tag', update: '2023-01-30 10:55', link: 'https://developer.aliyun.com/mirror/'}
  ]),
  border: true,
  rowProps: (row) => ({
    onContextmenu: (e) => {
      contextMenu.awakeLoc.value = row.type === 'dir' ? 'folder' : 'tag'
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
        {label: '新建书签', key: 'new-tag'},
        {label: '刷新', key: 'refresh'}
      ]
    } else if (contextMenu.awakeLoc.value === 'folder') {
      return [
        {label: '打开', key: 'open'},
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