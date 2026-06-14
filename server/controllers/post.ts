import { Next } from 'koa'
import { RouterContext } from 'koa-router'
import db from '../db'

export const PostController = {
   getList: async (ctx: RouterContext, next: Next) => {
        const category = ctx.query.category
        const posts = await db('posts').select('*')
       ctx.body = posts      
    } ,
    getDetail:async (ctx: RouterContext, next: Next)=>{
        const id = ctx.params.id
        const posts = await db('posts').select('*').where('id',id).first()
        ctx.body=posts
    },
    create: async (ctx: RouterContext, next: Next) => {
        const { title, content, category } = ctx.request.body as { title: string, content: string, category: string }
        const posts = await db('posts').insert({title,content,category})
        ctx.body={message:'插入成功'}
    },
    delete: async(ctx: RouterContext, next: Next)=>{
        const id = ctx.params.id
        const posts = await db('posts').where('id',id).delete()
        ctx.body={message:'删除成功'}
    }
}


