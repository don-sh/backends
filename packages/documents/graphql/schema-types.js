module.exports = `

scalar DateTime
scalar JSON

type Series {
  title: String!
  episodes: [Episode!]!
}

type Episode {
  title: String
  label: String
  image: String
  publishDate: DateTime
  document: Document
}

type AudioSource {
  mp3: String
  aac: String
  ogg: String
}

type Meta {
  title: String
  slug: String
  path: String
  image: String
  emailSubject: String
  description: String
  facebookTitle: String
  facebookImage: String
  facebookDescription: String
  twitterTitle: String
  twitterImage: String
  twitterDescription: String
  publishDate: DateTime
  template: String
  feed: Boolean
  kind: String
  color: String
  series: Series
  format: Document
  # the discussion wrapping document
  dossier: Document
  discussion: Document
  # the id of the discussion itself
  discussionId: ID
  credits: JSON
  audioSource: AudioSource
}

# implements FileInterface
input DocumentInput {
  # AST of /article.md
  content: JSON!
}

input DateRange {
  from: Date
  to: Date
}

interface FileInterface {
  content: JSON!
  meta: Meta!
}

type Document implements FileInterface {
  id: ID!
  # AST of /article.md
  content: JSON!
  meta: Meta!
}

type DocumentSearchNode {
  document: Document!
  highlights: [String!]!
  score: Float!
}

type SearchAggregation {
  buckets: [Bucket!]!
}

type Bucket {
  key: String!
  count: Int!
}

type DocumentSearchStats {
  authors: SearchAggregation!
  podcasts: Int!
  dossiers: SearchAggregation!
  formats: SearchAggregation!
  seriesMasters: SearchAggregation!
  discussions: Int!
}

type DocumentSearchConnection {
  nodes: [DocumentSearchNode!]!
  stats: DocumentSearchStats!
}

type DocumentPageInfo {
  endCursor: String
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
}

type DocumentConnection {
  nodes: [Document!]!
  pageInfo: DocumentPageInfo!
  totalCount: Int!
}

extend type User {
  documents(
    feed: Boolean
    first: Int
    last: Int
    before: String
    after: String
  ): DocumentConnection!
}
`
