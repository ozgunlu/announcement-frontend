import axios from 'axios'
import { Announcement, Comment } from '../models/Announcement'

const API_URL = 'https://localhost:7268/Announcements'

export const getAnnouncements = async (page: number, pageSize: number = 10): Promise<{announcements: Announcement[], totalPages: number}> => {
    const response = await axios.get(`${API_URL}?pageNumber=${page}&pageSize=${pageSize}`)
    return {
      announcements: response.data.announcements as Announcement[],
      totalPages: response.data.paginationInfo.totalPages as number
    }
}

export const getAnnouncementComments = async (announcementId: string): Promise<Comment[]> => {
  const response = await axios.get(`${API_URL}/${announcementId}/comments`)
  return response.data as Comment[]
}


export const postComment = async (announcementId: string, content: string): Promise<number> => {
  const response = await axios.post(`${API_URL}/${announcementId}/comments`, { content })
  return response.status
}

export const likeAnnouncement = async (announcementId: string): Promise<void> => {
  await axios.patch(`${API_URL}/${announcementId}/like`)
}