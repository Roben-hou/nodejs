import { RouterContext } from 'koa-router'
import bcrypt from 'bcryptjs'
import db from '../db'

export const AuthController = {
  register: async (ctx: RouterContext) => {
    const { username, password } = ctx.request.body as { username: string, password: string }
    
    const hashedPassword = await bcrypt.hash(password, 10)
    
    await db('users').insert({ username, password: hashedPassword })
    
    ctx.body = { message: '注册成功' }
  }
}