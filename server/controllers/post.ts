import { Next } from 'koa'
import { RouterContext } from 'koa-router'

export const PostController = {
   index: async (ctx: RouterContext, next: Next) => {
       const category = ctx.query.category
       ctx.body = {
        category,
       }
    } ,
    getDetail:async (ctx: RouterContext, next: Next)=>{
        const id = ctx.params.id
        ctx.body={
            id,
        }
    },
    create: async (ctx: RouterContext, next: Next) => {
        const { title, context, category } = ctx.request.body as { title: string, context: string, category: string }
        ctx.body = {
            title,
            context,
            category,
        }
    }
}


