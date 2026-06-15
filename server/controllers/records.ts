import { Next } from 'koa'
import { RouterContext } from 'koa-router'
import db from '../db'

export const RecordController = {
    getList: async (ctx: RouterContext, next: Next) => {
        const records = await db('records').select('*')
        ctx.body = records
    },
    create: async (ctx: RouterContext, next: Next) => {
        const { title, amount, type, category } = ctx.request.body as { title: string, amount: number, type: 'income' | 'expense', category: string }
        const records = await db('records').insert({ title, amount, type, category })
        ctx.body = { message: '插入成功' }
    },
    delete: async (ctx: RouterContext, next: Next) => {
        const id = ctx.params.id
        const records = await db('records').where('id', id).delete()
        ctx.body = { message: '删除成功' }
    }
}