import Koa from 'koa'

// 'import' command will cause error
const BodyParser = require('koa-bodyparser');
const bodyParser= new BodyParser();
import * as store from './save-data'

// init koa app
const app = new Koa({})
app.use(bodyParser)

// define handlers
const searchHandler = async (params) => {
    return store.takeData(params.path)
}

const handlers = {search: searchHandler}

app.use(async ctx => {
    const {command, params} = ctx.request.body
    if (handlers.hasOwnProperty(command)) {
        ctx.body = await handlers[command](params)
    } else {
        ctx.body = {status: 'fail', message: 'server error'}
    }
})

/**
 * why 7465?
 * nanote 的 16 进制形式是 6e616e6f7465
 * 取后四位便是 7465
 */
app.listen(7465, () => {
    console.log('koa is listening on 7465')
})
