import { Next } from 'koa'
import { RouterContext } from 'koa-router'
import db from '../db'
import { request } from 'http'

export const FamilyController = {
  create: async (ctx: RouterContext, next: Next) => {
  const userId = ctx.state.user.id
  const { name } = ctx.request.body as { name: string }

  const result = await db.transaction(async (trx) => {
    const [familyId] = await trx('families').insert({ name, created_by: userId })
    await trx('family_members').insert({ family_id: familyId, user_id: userId, role: 'owner' })
    return familyId
  })
  ctx.body = { message: '创建成功', id: result }
  },
  getMyFamilies: async (ctx: RouterContext, next: Next) => { 
    const userId = ctx.state.user.id
    const families = await db('family_members')
  .join('families', 'family_members.family_id', 'families.id')
  .where('family_members.user_id', userId)
      .select('families.id', 'families.name', 'family_members.role')
    ctx.body = families
  },
  getMyInvitations: async (ctx: RouterContext, next: Next) => {
    const userId = ctx.state.user.id
    const ownedFamilyIds = await db('family_members')
      .where({ user_id: userId, role: 'owner' })
      .pluck('family_id')
    const invitations = await db('family_invitations')
      .join('users', 'family_invitations.user_id', 'users.id')
      .join('families', 'family_invitations.family_id', 'families.id')
      .where('family_invitations.user_id', userId)
      .orWhereIn('family_invitations.family_id', ownedFamilyIds)
      .select('family_invitations.*', 'users.username', 'families.name as family_name')
    ctx.body = invitations
  },
  apply: async (ctx: RouterContext, next: Next) => {
  const userId = ctx.state.user.id
    const { familyId } = ctx.request.body as {familyId: number}
    // 第一步：检查是否已经是成员
    const existingMember = await db('family_members')
      .where({ family_id: familyId, user_id: userId })
      .first()

    if (existingMember) {
      ctx.status = 400
      ctx.body = { message: '已经是该家庭的成员' }
      return
    }
  // 第二步：检查是否已有 pending 申请
  const existingApplication = await db('family_invitations')
      .where({ family_id: familyId, user_id: userId, status: 'pending' })
      .first()

    if (existingApplication) {
      ctx.status = 400
      ctx.body = { message: '已有待处理的申请' }
      return
    }
    // 第三步：都没问题，才真正插入
    const [invitationId] = await db('family_invitations').insert({
      family_id: familyId,
      user_id: userId,
      status: 'pending',
      type: 'apply'
    })
    
    ctx.body = { message: '申请成功',id:invitationId}
  },


}
