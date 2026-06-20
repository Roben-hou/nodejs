import { RouterContext } from 'koa-router'
import { Next } from 'koa'
import jwt from 'jsonwebtoken'

export const authMiddleware = async (ctx: RouterContext, next: Next) => {
    console.log('收到的header:', ctx.headers.authorization)
    const token = ctx.headers.authorization?.split(' ')[1]

  if (!token) {
    ctx.status = 401
    ctx.body = { message: '未登录' }
    return
  }
  try {
    const decoded = jwt.verify(token, 'secret')
    ctx.state.user = decoded
    await next()
  } catch (err) {
    ctx.status = 401
    ctx.body = { message: 'token无效或已过期' }
  }
}