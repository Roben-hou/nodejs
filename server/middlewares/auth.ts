import { RouterContext } from 'koa-router'
import { Next } from 'koa'
import jwt from 'jsonwebtoken'
export const authMiddleware = async (ctx: RouterContext, next: Next) => {
  const token = ctx.headers.authorization?.split(' ')[1]

  if (!token) {
    ctx.status = 401
    ctx.body = { message: '未登录' }
    return
  }

  try {
    ctx.state.user = jwt.verify(token, process.env.JWT_SECRET!)
  } catch (err) {
    ctx.status = 401
    ctx.body = { message: 'token无效或已过期' }
    return
  }

  // 必须放到 try/catch 外面
  await next()
}