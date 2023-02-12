const Koa = require('koa')
const Router = require('@koa/router')
const {koaBody} = require('koa-body')

import * as store from './save-data'
import {bookmarksToJSON} from '../utils/bmk'
import fs from 'fs'
import flatten from "flat"

// cache for consistent query
let cache = {}

// init koa app
const app = new Koa({})
const router = new Router()

/**
 * 优化 bookmarksToJSON 的结果
 */
const convertData = (obj) => {
    if (obj.type === 'folder') {
        let arr = []
        for (let i = 0, len = obj.children.length; i < len; i++) {
            arr.push(convertData(obj.children[i]))
        }
        return {
            type: 'folder',
            update: obj.addDate,
            title: obj.title,
            // 与 naive-ui table 组件 children 命名冲突, 所以用 subdir
            subdir: arr
        }
    }
    return {
        type: 'link',
        update: obj.addDate,
        title: obj.title,
        // 不要 icon, 搜索太慢了, 放到动态缓存里
        icon: 'default',
        link: obj.url
    }
}

/**
 * 书签导入
 */
const bookmarkImportHandler = (content) => {
    const result = bookmarksToJSON(content, {stringify: false})
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

/**
 * 浏览器实时搜索
 */
router.get('/search', async (ctx, next) => {
    const candidate = []
    const max = 5
    const {text} = ctx.request.query
    // 搜索缓存, 避免频繁取数据
    if (!cache.search) {
        const result = store.takeSpecialData(null, {db: 'bookmark', path: '$'})
        let temp = cache.search = flatten(result, {
            transformKey(key) {

            }
        })
        console.log(typeof temp)
        console.log(temp)
        // .map(i => {
        //     i.icon && delete i.icon
        //     return i
        // })
        // .sort(({count: c1 = 0}, {count: c2 = 0}) => {
        //     return c1 - c2
        // })
        console.log("[cache make], size: ", cache.search.length)
    }
    for (let item of cache.search) {
        if (candidate.length >= max) break
        // TODO advanced search
        if (item.url.match(text)) {
            candidate.push(item)
        }
    }
    ctx.status = 200
    ctx.body = candidate
    ctx.set('keep-alive', true)
    await next()
})

/**
 * 增加搜索权重
 */
router.post('/search', async (ctx, next) => {
    const {path} = ctx.request.body
    let count = store.takeSpecialData(null, {db: 'bookmark', path: `${path}['count']`})
    if (typeof count !== 'number') count = 0
    store.saveSpecialData(null, {db: 'bookmark', path: `${path}['count']`, value: count + 1})
})

/**
 * 书签数据导入
 */
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
