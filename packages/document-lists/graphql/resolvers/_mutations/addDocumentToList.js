const { Roles } = require('@orbiting/backend-modules-auth')
const DocumentList = require('../../../lib/DocumentList')

module.exports = async (_, { repoId, listName }, context) => {
  const { pgdb, user: me, t, loaders } = context
  Roles.ensureUserHasRole(me, 'member')

  const transaction = await pgdb.transactionBegin()
  try {
    const list = await DocumentList.byNameForUser(listName, me.id, context)
    if (!list) {
      throw new Error(t(`api/document-lists/list/404`))
    }

    const doc = await loaders.Document.byRepoId.load(repoId)
    if (!doc) {
      throw new Error(t(`api/document-lists/document/404`))
    }

    await DocumentList.upsert(
      me.id,
      list.id,
      repoId,
      pgdb
    )

    await transaction.transactionCommit()

    return list
  } catch (e) {
    await transaction.transactionRollback()
    throw e
  }
}
