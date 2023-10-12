import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Announcement, Comment } from '../models/Announcement'
import { getAnnouncements, getAnnouncementComments, likeAnnouncement, postComment } from '../services/announcements'
import Swal from 'sweetalert2'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import './AnnouncementList.css'

const AnnouncementList: React.FC = () => {
	const [announcements, setAnnouncements] = useState<Announcement[]>([])
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(0)
	const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
	const [showModal, setShowModal] = useState(false)
	const [showDetails, setShowDetails] = useState<string | null>(null)
  const [commentContent, setCommentContent] = useState('')
	const [announcementComments, setAnnouncementComments] = useState<Comment[]>([])

	// Show the comment modal
	const handleShow = (announcement: Announcement) => {
		setSelectedAnnouncement(announcement)
		setShowModal(true)
	}

	// Close the comment modal
  const handleClose = () => {
    setShowModal(false)
    setCommentContent('') 
	}

  // Submit the comment
  const handleCommentSubmit = async () => {
    if (selectedAnnouncement) {
      try {
        if (selectedAnnouncement) {
						const statusCode = await postComment(selectedAnnouncement.id, commentContent)
						if (statusCode === 204) {
							Swal.fire(
									'Başarılı!',
									'Yorum eklendi.',
									'success'
							)
						}
            handleClose()
        }
			} catch (error) {
					console.error("Comment submission error:", error)
			}
    }
  }

	// Show Announcement Details
	const handleDetailsClick = async (announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
		setShowDetails(announcement.id)
    const comments = await getAnnouncementComments(announcement.id)
    setAnnouncementComments(comments) 
	}


	// Get Announcements
	useEffect(() => {
		const fetchData = async () => {
			const data = await getAnnouncements(currentPage)
				setAnnouncements(data.announcements)
				setTotalPages(data.totalPages)
			}

			fetchData()
	}, [currentPage])

	// Date Formatting
	const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0') // months are 0-indexed in JS
    const year = date.getFullYear()
    const hour = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')
    
    return `${month}/${day}/${year} ${hour}:${minute}`
}

	return (
		<div className="container mt-4">
			<table className="table table-striped">
				<thead>
					<tr className='fw-bold fs-6 text-gray-800 border-bottom border-gray-200'>
						<th className='details-column'>Details</th>
						<th className="title-column">Title</th>
						<th className='published-date-column'>Published Date</th>
        		<th className="actions-column">Actions</th>
					</tr>
				</thead>
				<tbody>
					{announcements.map((announcement) => (
						<React.Fragment key={announcement.id}>
							<tr>
								<td>
									<button 
										className="btn btn-link"
										onClick={() => handleDetailsClick(announcement)}
									>
										<i className="fa fa-search"></i>
									</button>
								</td>
								<td>{announcement.title}</td>
								<td>{formatDate(announcement.datePublished)}</td>
								<td>
										<button 
											className="like-btn me-2"
											onClick={async () => {
												await likeAnnouncement(announcement.id)
												// Sayfayı güncelle veya başka bir aksiyon al
												const data = await getAnnouncements(currentPage)
												setAnnouncements(data.announcements)
											}}
										>
											<span id="icon" className='me-2'><i className="fa fa-thumbs-up"></i></span>
											<span id="count">{announcement.likes}</span> likes
										</button>
										<button 
											className="comment-btn"
											onClick={() => handleShow(announcement)}
										>
											<span id="icon"><i className="fa fa-comments"></i></span>
										</button>
								</td>
							</tr>
							{showDetails === announcement.id && (
								<tr>
									<td colSpan={4}>
										<div className="card mt-2">
											<div className='card-header'>
												<button 
													className="btn btn-sm btn-link text-primary"
													onClick={() => setShowDetails(null)}
												>
													<i className="fa fa-times"></i>
												</button>
												<h5 className="card-title">Announcement</h5>
											</div>
											<div className="card-body">
													<p className="card-text">{announcement.content}</p>
													<div className="comments-section mt-3">
														<h5>Yorumlar</h5>
														{announcementComments.map(comment => (
                                <div key={comment.id} className="comment">
                                    <p>{comment.content} <small className="text-muted">{formatDate(comment.dateCommented)}</small></p>                                    
                                </div>
                            ))}
                        </div>
											</div>
										</div>
									</td>
								</tr>
							)}
						</React.Fragment>
					))}
				</tbody>
			</table>
			<ul className="pagination">
				{Array.from({ length: totalPages }, (_, i) => i).map(pageNumber => (
					<li
						key={pageNumber}
						onClick={() => setCurrentPage(pageNumber + 1)}
						className={currentPage === pageNumber + 1 ? 'active page-link' : 'page-link'}
					>
						{pageNumber + 1}
					</li>
				))}
			</ul>
			<Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add a Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea 
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Type your comment here..."
            className="form-control"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCommentSubmit}>
            Submit Comment
          </Button>
        </Modal.Footer>
      </Modal>
		</div>
	)
}

export default AnnouncementList