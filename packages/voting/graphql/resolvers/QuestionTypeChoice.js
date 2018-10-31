const { resultChoice } = require('../../lib/Question')

module.exports = {
  async result (question, args, context) {
    if (question.result !== undefined) {
      if (!question.result) {
        return question.result
      }
      const { top } = args
      return top
        ? question.result.slice(0, top)
        : question.result
    }
    if (!question.questionnaire.liveResult) {
      return null
    }
    return resultChoice(question, args, context)
  }
}