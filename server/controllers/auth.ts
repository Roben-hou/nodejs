import { RouterContext } from 'koa-router'
import bcrypt from 'bcryptjs'
import db from '../db'
import jwt from 'jsonwebtoken'

export const AuthController = {
  register: async (ctx: RouterContext) => {
    const { username, password } = ctx.request.body as { username: string, password: string }

    const user = await db('users').where({ username }).first()
    if (user) {
        ctx.status = 400
        ctx.body = { message: '用户已存在' }
        return
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    await db('users').insert({ username, password: hashedPassword })
        ctx.body = { message: '注册成功' }
    },
    login: async (ctx: RouterContext) => {
        const { username, password }=ctx.request.body as { username: string, password: string }
        const user = await db('users').where({ username }).first() 
        if (!user) {
            ctx.status = 401
            ctx.body = { message: '用户名或密码错误' }
            return
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            ctx.status = 401
            ctx.body = { message: '用户名或密码错误' }
            return
        }
        const token = jwt.sign({ id: user.id ,username:user.username}, 'secret', { expiresIn: '720h' }
        )    
        ctx.body = { message: '登录成功', token }
    }
}