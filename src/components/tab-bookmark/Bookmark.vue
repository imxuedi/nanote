<template>
  <div class="na-container">
    <div class="na-action">
      <div class="btn-group">
        <svg height="40%" viewBox="0 0 1024 1024" @click="backFolder()">
          <use xlink:href="#icon-back"></use>
        </svg>
        <div>
          <n-breadcrumb>
            <n-breadcrumb-item v-for="(item, index) of rendererData.folders" :key="index">
              <span @click="backFolder(index)"> {{ item.title }} </span>
            </n-breadcrumb-item>
          </n-breadcrumb>
        </div>
      </div>
      <div class="view-switch">
        <svg :class="[curView==='list'?'active':'']" @click="changeView('list')" height="40%" viewBox="0 0 1024 1024">
          <use xlink:href="#icon-list-view"/>
        </svg>
        <svg :class="[curView==='grid'?'active':'']" @click="changeView('grid')" height="40%" viewBox="0 0 1024 1024">
          <use xlink:href="#icon-grid-view"/>
        </svg>
      </div>
    </div>
    <div class="na-data">
      <component
          :is="Views[curView]"
          :data="rendererData.data"
          :cut="rendererData.cut"
          @enter:folder="enterFolder"
          @context:click="contextClick"
      />
    </div>
    <div class="info">
      <span>{{ info }}</span>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from "vue";
import {NBreadcrumb, NBreadcrumbItem} from 'naive-ui'
import GridView from "@/components/tab-bookmark/GridView.vue";
import ListView from "@/components/tab-bookmark/ListView.vue";

// revert color when img color conflicts with background color
// import {useRevertColor} from "@/utils/revert-color";
// useRevertColor(".icon-img", curView, rendererData.value.folders)

const curView = ref('list')
const Views = {grid: GridView, list: ListView}
const changeView = (viewName) => {
  curView.value = viewName
}

const info = computed(() => {
  return '选中 2 个项目，包含 10 个书签'
  // return '包含 10 个书签，上次修改 2023/1/29'
})

const rendererData = ref({
  folders: [{title: '根目录', path: '$'}],
  data: [],
  cut: {path: null, id: null}
})

const fetchRendererData = async (path) => {
  const res = await IPC_API.takeSpecialData({
    db: 'bookmark', path, excludes: ['subdir']
  })
  // console.log({path, res})
  // 去除 null 值, 但保留 index 的相对性
  // 否则会与数据库中的相对次序出现误差
  let temp = []
  res.forEach((item, index) => {
    if (!item) return
    temp.push({id: index, ...item})
  })
  rendererData.value.data = temp
}

// id 是数据库中的次序, pos 是 nanote 中的次序
// 很烦~ 呜呜呜~ 救命！ QAQ

const enterFolder = async (id, pos) => {
  let folders = rendererData.value.folders
  let data = rendererData.value.data
  // dot syntax: https://github.com/sindresorhus/dot-prop
  let path = `${folders[folders.length - 1].path}[${id}].subdir`
  folders.push({title: data[pos].title, path})
  await fetchRendererData(path)
}

const backFolder = async (index) => {
  let folders = rendererData.value.folders
  // 根目录不退回
  if (folders.length <= 1) return
  // index 可以是 0
  if (index !== undefined) {
    // 点击面包屑
    folders.splice(index + 1, folders.length - index - 1)
  } else {
    // 点击退回按钮
    folders.pop()
  }
  await fetchRendererData(folders[folders.length - 1].path)
}

const contextClick = async ({key, id, pos}) => {
  let folders = rendererData.value.folders
  let data = rendererData.value.data
  let path = folders[folders.length - 1].path
  console.log({key, id, pos})
  switch (key) {
    case 'refresh': {
      await fetchRendererData(path)
      // clear clipboard
      clearClipBoard()
      break
    }
    case 'preview': {
      await IPC_API.showInBrowser(data[pos].link)
      break
    }
    case 'open': {
      await enterFolder(id, pos)
      break
    }
    case 'cut': {
      rendererData.value.cut.path = path
      rendererData.value.cut.id = id
      break
    }
    case 'paste': {
      let cut = rendererData.value.cut
      // source object is an object {}, not array []
      let sourceObject = await IPC_API.takeSpecialData({db: 'bookmark', path: `${cut.path}[${cut.id}]`})
      let destLen = await IPC_API.countSpecialSize({db: 'bookmark', path: `${path}`})
      if (destLen === -1) {
        alert('can not count size of an object')
        return
      }
      console.table({sourceObject, destLen})
      await IPC_API.saveSpecialData({db: 'bookmark', path: `${path}[${destLen}]`, value: sourceObject})
      // TODO 如果 save 成功再删除
      await IPC_API.removeSpecialData({db: 'bookmark', path: `${cut.path}[${cut.id}]`})
      await fetchRendererData(path)
      clearClipBoard()
      break
    }
    case 'remove': {
      await IPC_API.removeSpecialData({db: 'bookmark', path: `${path}[${id}]`})
      await fetchRendererData(path)
      break
    }
    case 'refresh': {

      break
    }
    case 'refresh': {

      break
    }
  }
}

const clearClipBoard = () => {
  rendererData.value.cut.path = null
  rendererData.value.cut.id = null
}

onMounted(async () => {
  await fetchRendererData('$')
})

</script>

<style lang="scss" scoped>
.na-container {
  padding: 15px;

  .na-action {
    display: flex;
    align-items: center;
  }

  .na-data {
    height: calc(100vh - 165px);
    overflow-y: auto;
    overflow-x: hidden;
  }
}


.btn-group {
  height: 35px;
  width: 60vw;
  display: flex;
  align-items: center;
  background-color: #fcf0f0;
  border-radius: 3px;
  box-shadow: 0 0 1px 1px #ddd;

  svg {
    margin-right: 10px;
    padding: 11px;
    background-color: #f8e2e1;
    border-right: 1px solid #ddd;

    &:hover {
      background-color: #f5d0cf;
    }
  }

  > div {
    max-width: calc(100% - 55px);
    overflow-x: scroll;
    position: relative;
    height: 100%;
    top: 5px;
  }

  ::-webkit-scrollbar {
    height: 5px;
  }

  ::-webkit-scrollbar-track {
    background-color: #ffff;
  }

  .n-breadcrumb {
    display: inline-block;
  }
}

.btn-group, .view-switch {
  svg {
    color: #d64541;
    transition: background-color .3s ease;
    border-radius: 3px;
    cursor: pointer;
  }
}

.view-switch {
  height: 50px;
  display: flex;
  align-items: center;
  flex-grow: 1;
  justify-content: flex-end;

  svg {
    padding: 6px;
    border-right: 1px solid #ddd;

    &.active {
      background-color: #f8e2e1;
    }
  }
}

.info {
  border-top: 1px solid #dddddd;
  position: fixed;
  bottom: 5px;
  right: 0;
  left: 75px;
  padding: 10px;
  font-size: 12px;
  color: #666;
}
</style>