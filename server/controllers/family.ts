import { Next } from 'koa'
import { RouterContext } from 'koa-router'
import db from '../db'

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
  }
  
}
