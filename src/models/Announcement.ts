export interface Announcement {
  id: string
  title: string
  content: string
  datePublished: string
  likes: number
}

export interface Comment {
  id: string
  content: string
  dateCommented: string
}