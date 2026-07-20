import { Next } from 'koa'
import { RouterContext } from 'koa-router'
import db from '../db'

export const RecordController = {
    getList: async (ctx: RouterContext, next: Next) => {
        const userId = ctx.state.user.id
        const familyId = ctx.query.familyId ? Number(ctx.query.familyId) : null
        
        if (familyId) {
            const isMember = await db('family_members')
                .where({ family_id: familyId, user_id: userId })
                .first()
            if (!isMember) {
                ctx.status = 403
                ctx.body = { message: '你不是该家庭的成员' }
                return
            }
            const records = await db('records')
                .leftJoin('users', 'records.user_id', 'users.id')
                .where({ family_id: familyId })
                .select('records.*', 'users.username')
            ctx.body = records
        } else {
            const records = await db('records')
                .leftJoin('users', 'records.user_id', 'users.id')
                .where({ 'records.user_id': userId })
                .select('records.*', 'users.username')
            ctx.body = records
        }
    },
    create: async (ctx: RouterContext, next: Next) => {
        const { title, amount, type, category, family_id } = ctx.request.body as { title: string, amount: number, type: 'income' | 'expense', category: string, family_id?: number }
        const userId = ctx.state.user.id
        if (family_id !== undefined) {
            const isMember = await db("family_members")
            .where({
                family_id,
                user_id: userId,
            })
            .first();
            if (!isMember) {
                ctx.status = 403;
                ctx.body = { message: "你不是该家庭的成员" };
                return;
            }
        }
        await db('records').insert({ title, amount, type, category, user_id: userId, family_id:family_id ?? null })
        ctx.body = { message: '插入成功' }
    },
    delete: async (ctx: RouterContext, next: Next) => {
        const id = ctx.params.id
        const userId = ctx.state.user.id
        await db('records').where({ id, user_id: userId }).delete()
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
    },
    update: async (ctx: RouterContext, next: Next) => {
        const id = ctx.params.id
        const userId = ctx.state.user.id
        const { title, amount, type, category } = ctx.request.body as { title: string, amount: number, type: 'income' | 'expense', category: string }
        await db('records').where({ id, user_id: userId }).update({ title, amount, type, category })
        ctx.body = { message: '更新成功' } 
    }
}