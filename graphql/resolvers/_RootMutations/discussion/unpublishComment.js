const Roles = require('../../../../lib/Roles')

module.exports = async (_, args, { pgdb, user, req, t, pubsub }) => {
  Roles.ensureUserHasRole(user, 'member')

  const { id } = args

  const transaction = await pgdb.transactionBegin()
  try {
    // ensure comment exists and belongs to user
    const comment = await transaction.public.comments.findOne({ id })
    if (!comment) {
      throw new Error(t('api/comment/404'))
    }
    if (comment.userId !== user.id && !Roles.ensureUserHasRole(user, 'admin')) {
      throw new Error(t('api/comment/notYours'))
    }

    const update = comment.userId === user.id
      ? { published: false }
      : { adminUnpublished: true }

    const updatedComment = await transaction.public.comments.updateAndGetOne({
      id: comment.id
    },
      update
    )

    await transaction.transactionCommit()

    await pubsub.publish('comments', { comments: updatedComment })

    return updatedComment
  } catch (e) {
    await transaction.transactionRollback()
    throw e
  }
}