const { githubRest } = require('../lib/github')

// Because githubs get-contents is limited to 1MB the current
// approach is to extract the blobs sha from the filename,
// get the file via get-blob, and send the content directly as response.
// Optimization: Find a way to get the download url of a blob
// without requestion the content and pipe fetch(download_url) as
// response to our request.
// https://developer.github.com/v3/repos/contents/#get-contents
// https://developer.github.com/v3/git/blobs/#get-a-blob
module.exports = (server) => {
  server.get('/assets/:login/:repoName/:path(*)', async (req, res) => {
    const {
      login,
      repoName,
      path
    } = req.params

    const blobSha = path
      .split('/')
      .pop()
      .split('.')[0]

    const result = await githubRest.gitdata.getBlob({
      owner: login,
      repo: repoName,
      sha: blobSha
    })
      .then(result => result.data)

    return res.end(Buffer.from(result.content, 'base64'))
  })
}
