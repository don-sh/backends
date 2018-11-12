const moment = require('moment')

module.exports = async (_, { lastDays = 5 }, { pgdb }, info) =>
  pgdb.query(`
    SELECT
      COUNT(*) as count,
      d.*
    FROM comments c
    JOIN
      discussions d
      ON c."discussionId" = d.id
    WHERE
      c."createdAt" > :minDate
    GROUP BY d.id
    ORDER BY 1 DESC
  `, {
    minDate: moment().subtract(lastDays, 'days')
  })
    .then(result => result
      .map(result => ({
        commentsCount: result.count,
        discussion: result
      }))
    )
