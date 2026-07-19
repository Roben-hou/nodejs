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
  invite: async (ctx: RouterContext, next: Next) => {
    const userId = ctx.state.user.id
    const { username } = ctx.request.body as {username: string}
    const familyId=ctx.params.id
    const targetUser = await db('users').where({ username }).first()
    if (!targetUser) {
      ctx.status = 400
      ctx.body = { message: '用户不存在' }
      return
    }
    const targetUserId = targetUser.id as number
    //第一步：检查操作权限
    const isOwner = await db('family_members')
      .where({ family_id: familyId, user_id: userId, role: 'owner' })
      .first()

    if (!isOwner) {
      ctx.status = 400
      ctx.body = { message: '你没有该家庭的邀请权限' }
      return
    }
    //第二步：检查是否已是成员
    const existingMember = await db('family_members')
    .where({ family_id: familyId, user_id: targetUserId })
    .first()
    if (existingMember) {
      ctx.status = 400
      ctx.body = { message: '已经是该家庭的成员' }
      return
    }
    //第三步：检查是否已存在 pending 邀请
    const existingInvitation = await db('family_invitations')
      .where({ family_id: familyId, user_id: targetUserId, status: 'pending' })
      .first()
      if (existingInvitation) {
      ctx.status = 400
      ctx.body = { message: '已有待处理的邀请' }
      return
    }

    //第四步，执行插入
    const [invitationId] = await db('family_invitations').insert({
      family_id: familyId,
      user_id: targetUserId,
      status: 'pending',
      type: 'invite'
    })

    ctx.body = { message: '邀请成功', id: invitationId }
  },
requestJoin: async (ctx: RouterContext, next: Next) => {
  const userId = ctx.state.user.id
  const id = ctx.params.id
  
  // 第一步：先查出这条 invitation 记录本身
  const invitation = await db('family_invitations').where({ id, status: 'pending', type: 'apply' }).first()
  if (!invitation) {
    ctx.status = 400
    ctx.body = { message: '申请不存在或已处理' }
    return
  }
  // 第二步：检查当前登录用户，是不是【这条记录里的 family_id】对应的 owner
   else{
    const isOwner = await db('family_members')
    .where({ family_id: invitation.family_id, user_id: userId, role: 'owner' })
    .first()
    //第三步：处理事务
    if (isOwner) {
      await db.transaction(async (trx) => {
        await trx('family_invitations')
          .where({ id,status: 'pending',type: 'apply' })
          .update({ status: 'accepted' })
        await trx('family_members').insert({
          family_id: invitation.family_id,
          user_id: invitation.user_id,
          role: 'member'
        })
      })
      ctx.body = { message: '加入成功' }
    } else {
      ctx.status = 400
      ctx.body = { message: '你没有该家庭的申请' }
    }
   }
  },
  acceptInvite: async (ctx: RouterContext, next: Next) => {
    const userId = ctx.state.user.id
    const id = ctx.params.id
    // 第一步：先查出这条 invitation 记录本身
    const invitation = await db('family_invitations').where({ id, status: 'pending', type: 'invite' }).first()
    if (!invitation) {
      ctx.status = 400
      ctx.body = { message: '邀请不存在或已处理' }
      return
    }
    else{
      if (invitation.user_id === userId) {
        await db.transaction(async (trx) => {
          await trx('family_invitations')
            .where({ id,status: 'pending',type: 'invite' })
            .update({ status: 'accepted' })
          await trx('family_members').insert({
            family_id: invitation.family_id,
            user_id: invitation.user_id,
            role: 'member'
          })
        })
        ctx.body = { message: '加入成功' }
      } else {
        ctx.status = 400
        ctx.body = { message: '你没有该家庭的邀请' }
      }
    }
  },
rejectRequest: async (ctx: RouterContext, next: Next) => {
  const userId = ctx.state.user.id
  const id = ctx.params.id

  // 第一步：先查出这条记录本身（不管是 apply 还是 invite）
  const invitation = await db('family_invitations').where({ id, status: 'pending' }).first()
  if (!invitation) {
    ctx.status = 400
    ctx.body = { message: '记录不存在或已处理' }
    return
  }

  // 第二步：根据 type 分别判断权限
  if (invitation.type === 'apply') {
    const isFamilyOwner = await db('family_members')
    .where({ family_id: invitation.family_id, user_id: userId, role: 'owner' })
    .first()
    if(!isFamilyOwner){
      ctx.status = 400
      ctx.body = { message: '你没有该家庭的申请' }
      return
    }
  }
  else {
    if(invitation.user_id !== userId){
      ctx.status = 400
      ctx.body = { message: '你没有被邀请' }
      return
    }
  }
    // 第三步：权限通过后，统一执行拒绝操作
    await db('family_invitations').where({ id }).update({ status: 'rejected' })
    ctx.body = { message: '已拒绝' }
  }

}
