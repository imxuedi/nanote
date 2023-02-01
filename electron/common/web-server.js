const Koa = require('koa')
const Router = require('@koa/router')
const {koaBody} = require('koa-body')

import * as store from './save-data'
import {bookmarksToJSON} from '../utils/bmk'
import fs from 'fs'

// init koa app
const app = new Koa({})
const router = new Router()


// define handlers
const searchHandler = async (params) => {
    return store.takeData(params.path)
}

const convertData = (obj) => {
    if (obj.type === 'folder') {
        let arr = []
        for (let i = 0, len = obj.children.length; i < len; i++) {
            arr.push(convertData(obj.children[i]))
        }
        return {
            type: 'folder',
            update: obj.lastModified,
            title: obj.title,
            subdir: arr
        }
    }
    return {
        type: 'link',
        update: obj.addDate,
        title: obj.title,
        // 与 naive-ui table 组件 children 命名冲突, 所以用 subdir
        icon: obj.icon || 'default',
        link: obj.url
    }
}

const bookmarkImportHandler = (content) => {
    const result = bookmarksToJSON(content, {stringify: false})
    console.log({result})
    if (Array.isArray(result)) {
        const obj = {
            title: '导入的文件夹',
            update: Date.now(),
            type: 'folder',
            subdir: result.map(item => convertData(item))
        }
        const root = store.takeSpecialData(null, {db: 'bookmark', path: '$'})
        const nextIndex = root.length
        store.saveSpecialData(null, {db: 'bookmark', path: `$[${nextIndex}]`, value: obj})
    }
    return null
}

const handlers = {search: searchHandler}

router.get('/search', (ctx, next) => {

})

router.post('/upload', async (ctx, next) => {
    const file = ctx.request.files.file
    const content = fs.readFileSync(file.filepath, "utf8")
    const err = bookmarkImportHandler(content)
    if (err) {
        ctx.status = 500
    }
    ctx.status = 200
})

// use middlewares
app
    .use(koaBody({
        multipart: true,
        formidable: {
            // 设置上传文件大小最大限制，默认2M
            maxFileSize: 200 * 1024 * 1024
        }
    }))
    .use(async (ctx, next) => {
        ctx.set("Access-Control-Allow-Origin", "*")
        ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE")
        await next()
    })
    .use(router.routes())
    .use(router.allowedMethods())

/**
 * why 7465?
 * nanote 的 16 进制形式是 6e616e6f7465
 * 取后四位便是 7465
 */
app.listen(7465, () => {
    console.log('koa is listening on 7465')
})
