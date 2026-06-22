import { Next } from 'koa'
import { RouterContext } from 'koa-router'
import db from '../db'

export const RecordController = {
    getList: async (ctx: RouterContext, next: Next) => {
        const userId = ctx.state.user.id
        const records = await db('records').select('*').where({ user_id: userId })
        ctx.body = records
    },
    create: async (ctx: RouterContext, next: Next) => {
        const { title, amount, type, category } = ctx.request.body as { title: string, amount: number, type: 'income' | 'expense', category: string }
        const userId = ctx.state.user.id
        const records = await db('records').insert({ title, amount, type, category, user_id: userId })
        ctx.body = { message: '插入成功' }
    },
    delete: async (ctx: RouterContext, next: Next) => {
        const id = ctx.params.id
        const records = await db('records').where('id', id).delete()
        ctx.body = { message: '删除成功' }
    },
    getStats: async (ctx: RouterContext, next: Next) => {
        const userId = ctx.state.user.id
        const income = await db('records').where({ type: 'income', user_id: userId }).sum('amount as total').first()
        const expense = await db('records').where({ type: 'expense', user_id: userId }).sum('amount as total').first()
        ctx.body = {
            income: income?.total || 0,
            expense: expense?.total || 0
        }
    }
}