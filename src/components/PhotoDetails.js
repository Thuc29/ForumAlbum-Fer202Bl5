import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Breadcrumb, Button, Card, Carousel, Col, Container, Form, InputGroup, Modal, Row, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { FaCopy, FaEdit, FaEnvelope, FaFacebookF, FaHeart, FaShareAlt, FaStar, FaThumbsUp, FaTrashAlt, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { AiOutlineLink } from 'react-icons/ai';

function PhotoDetails() {
    const { photoId } = useParams(); // Extract photoId from the URL
    const [photos, setPhotos] = useState([]);
    const [comments, setComments] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [selectedRate, setSelectedRate] = useState(0); // Set default to 0
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentText, setEditingCommentText] = useState("");
    const [editingCommentRate, setEditingCommentRate] = useState(0); // Set default to 0
    const [showCopySuccess, setShowCopySuccess] = useState(false);
    const navigate = useNavigate();
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [likes, setLikes] = useState(0); 
    const [showModal, setShowModal] = useState(false); 
    const [shareLink, setShareLink] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);

    const fetchPhotos = async () => {
        try {
            const photosResponse = await axios.get(`http://localhost:9999/photos?photoId=${photoId}`);
            const updatedPhotos = photosResponse.data.map(p => ({
                ...p,
                image: {
                    ...p.image,
                    url: p.image.url.map(i => `/assest/images/${i}`)
                }
            }));
            setPhotos(updatedPhotos);
        } catch (error) {
            console.error("Error fetching photos:", error);
        }
    };

    const fetchCommentsAndUsers = async () => {
        try {
            const [commentsResponse, usersResponse] = await Promise.all([
                axios.get('http://localhost:9999/comments'),
                axios.get('http://localhost:9999/users')
            ]);
            setComments(commentsResponse.data);
            setUsers(usersResponse.data);

        } catch (error) {
            console.error("Error fetching comments or users:", error);
        }
    };

    useEffect(() => {
        fetchPhotos();
        fetchCommentsAndUsers();
        checkLoggedInUser();
    }, [photoId]);

    useEffect(() => {
        if (photos.length > 0) {
            setSelectedPhoto(photos[0]);
        }
    }, [photos]);

    const checkLoggedInUser = () => {
const user = JSON.parse(localStorage.getItem('loggedInUser'));
        setLoggedInUser(user);
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
    
        if (!loggedInUser) {
            alert("Please log in to add a comment");
            navigate('/auth/login');
            return;
        }
    
        const commentData = {
            userId: loggedInUser.id,
            photoId: selectedPhoto?.photoId,
            text: newComment,
            rate: selectedRate,
        };
    
        try {
            const response = await axios.post('http://localhost:9999/comments', commentData);
    
            if (response.status === 201) {
                setComments(prevComments => [response.data, ...prevComments]);
                setNewComment("");
                setSelectedRate(0);
            } else {
                console.error("Error adding comment:", response.statusText);
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleEditComment = (commentId, text, rate) => {
        setEditingCommentId(commentId);
        setEditingCommentText(text);
        setEditingCommentRate(rate);
    };

    const handleSaveEdit = async (commentId) => {
        if (editingCommentText.trim()) {
            try {
                const currentComment = comments.find(comment => comment.id === commentId);

                const updatedComment = {
                    ...currentComment,
                    text: editingCommentText,
                    rate: editingCommentRate,
                };

                const response = await axios.put(`http://localhost:9999/comments/${commentId}`, updatedComment);

                if (response.status === 200) {
                    setComments(prevComments => prevComments.map(comment =>
                        comment.id === commentId ? updatedComment : comment
                    ));
                    setEditingCommentId(null);
                    setEditingCommentText("");
                    setEditingCommentRate(0);
                } else {
                    console.error("Error updating comment:", response.statusText);
                }
            } catch (error) {
                console.error("Error updating comment:", error);
            }
        } else {
            handleDeleteComment(commentId);
        }
    };

    const cancelEdit = () => {
        setEditingCommentId(null);
        setEditingCommentText("");
        setEditingCommentRate(0);
    };
    const handleDeleteComment = async (commentId) => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            try {
                await axios.delete(`http://localhost:9999/comments/${commentId}`);
setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
            } catch (error) {
                console.error("Error deleting comment:", error);
            }
        }
    };

    const renderRatingStars = (currentRate, onRateChange) => {
        return [1, 2, 3, 4, 5].map(rate => (
            <FaStar
                key={rate}
                onClick={() => onRateChange(rate)}
                style={{
                    cursor: 'pointer',
                    color: currentRate >= rate ? 'yellow' : 'gray',
                    transition: 'color 0.3s ease',
                    fontSize: '1.5rem'
                }}
                onMouseEnter={(e) => (e.target.style.color = 'orange')}
                onMouseLeave={(e) => (e.target.style.color = currentRate >= rate ? 'yellow' : 'gray')}
                className='m-1'
            />
        ));
    };

    const handleToggleFavorite = async () => {
        if (!selectedPhoto || !loggedInUser) return;

        try {
            if (isFavorite) {
                await axios.delete(`http://localhost:9999/favorites?photoId=${selectedPhoto.photoId}&userId=${loggedInUser.id}`);
                setIsFavorite(false);
            } else {
                await axios.post('http://localhost:9999/favorites', {
                    photoId: selectedPhoto.photoId,
                    userId: loggedInUser.id,
                });
                setIsFavorite(true);
            }
        } catch (error) {
            console.error(`Failed to ${isFavorite ? 'remove' : 'add'} photo to favorites:`, error);
        }
    };

    const handleLike = () => {
        setLikes(likes + 1);
    };

    const handleShowModal = () => {
        const generatedLink = window.location.href;
        setShareLink(generatedLink);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareLink);
        setShowCopySuccess(true); 
        setTimeout(() => setShowCopySuccess(false), 2000); 
        handleCloseModal();
    };

    const filteredComments = comments.filter(comment => comment.photoId === selectedPhoto?.photoId);

    const getUserName = (userId) => {
        const user = users.find(user => user.id === userId);
        return user ? user.name : "Unknown";
    };

    // Handle thumbnail click to change the selected photo
    const handleClickUrl = (photoIndex) => {
        setCarouselIndex(photoIndex);
    };

    // Handle carousel index change
    const handleSelect = (selectedIndex) => {
        setCarouselIndex(selectedIndex);
    };

    return (
        <Container>
            <Row>
                <Col md={12} className='text-center'>
<Breadcrumb>
                        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item active className='text-light'> Details</Breadcrumb.Item>
                    </Breadcrumb>
                    <h3 className='text-light'>Photo Details</h3>
                </Col>
            </Row>
            {showCopySuccess && <Alert variant="success">Link copied successfully!</Alert>}
            <Row className='border p-3'>
                <Row>
                    <Col md={8}>
                        <Row>
                            <Col sm={12}>
                                <Carousel activeIndex={carouselIndex} onSelect={handleSelect} style={{ borderRadius: '20px' }}>
                                    {selectedPhoto && selectedPhoto.image && selectedPhoto.image.url.length > 0 ? (
                                        selectedPhoto.image.url.map((url, index) => (
                                            <Carousel.Item key={index}>
                                                <img
                                                    className="d-block w-100"
                                                    src={url}
                                                    alt={`Slide ${index + 1}`}
                                                    style={{
                                                        height: '400px',
                                                        objectFit: 'contain',
                                                        backgroundColor: 'lightgray',
                                                        borderRadius: '20px'
                                                    }}
                                                />
                                            </Carousel.Item>
                                        ))
                                    ) : (
                                        <p>No image available</p>
                                    )}
                                </Carousel>
                            </Col>
                            <Col sm={12} className='d-flex flex-wrap align-items-center justify-content-center mt-2'>
                                {selectedPhoto && selectedPhoto.image && selectedPhoto.image.url.length > 0 && selectedPhoto.image.url.map((url, index) => (
                                    <Card className='my-2 mx-2' style={{ cursor: 'pointer', width: '100px' }} onClick={() => handleClickUrl(index)} key={index}>
                                        <Card.Img src={url} alt={`Thumbnail ${index + 1}`}
                                            style={{ height: '50px' }}
                                            className={`img-thumbnail ${carouselIndex === index ? 'border-primary' : ''}`}
                                        />
                                    </Card>
                                ))}
                            </Col>
                        </Row>
</Col>
                    <Col md={4}>
                        <Row>
                            <Col>
                                <Card className='my-2 ' style={{ border: "2px solid aqua" }}>
                                    <Card.Body>
                                        <Card.Text> <b> Title: </b> {selectedPhoto?.title || "No title available"}</Card.Text>
                                        <Card.Text> <b> Tags: </b>{selectedPhoto?.tags && selectedPhoto.tags.join(', ') || "No tags"}</Card.Text>
                                        <Card.Text>
                                            {loggedInUser ? (
                                                <div className="d-flex align-items-center">
                                                    <Button onClick={handleLike} className="me-2">
                                                        <FaThumbsUp /> {likes} {likes !== 1 && ''}
                                                    </Button>
                                                    <Button
                                                        variant={isFavorite ? 'danger' : 'gray'}
                                                        className='me-2'
                                                        style={{ border: "2px solid black" }}
                                                        onClick={handleToggleFavorite}
                                                    >
                                                        <FaHeart />
                                                    </Button>
                                                    <Button variant='info' onClick={handleShowModal}>
                                                        <FaShareAlt />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <p className=" text-center text-danger"> "You must be logged in to use this feature"</p>
                                            )}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Row>
            <Row className='border  mt-2 p-3'>
                <Row>
                    <h4 className='text-light'>Comments</h4>
                </Row>
                <Row className='d-flex justify-content-center'>
                    {loggedInUser ? (
                        <Row className='bg-secondary p-2' style={{borderRadius: "10px", border: "2px solid aqua"}}>
                            <Col sm={12}>
                                <Form.Group controlId="commentText">
                                    <Form.Control
                                        as="textarea"
rows={3}
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Enter your comment"
                                    />
                                </Form.Group>
                                <Form.Group controlId="commentRating" className='d-flex justify-content-start'>
                                    <Form.Label className="my-1 mr-2">Rating:</Form.Label>
                                    {[1, 2, 3, 4, 5].map(rate => (
                                        <Form.Check
                                            key={rate}
                                            inline
                                            type="radio"
                                            label={rate}
                                            name="rating"
                                            checked={selectedRate === rate}
                                            onChange={() => setSelectedRate(rate)}
                                        />
                                    ))}
                                </Form.Group>
                                <div className='d-flex justify-content-end'>
                                    <Button variant="primary" onClick={handleAddComment}>
                                        Add Comment
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    ) : (
                        <p className='text-warning'> "Please log in to add a comment."</p>
                    )}
                </Row>

                {filteredComments.map(comment => (
                    <Col md={12} key={comment.id} className='border p-2 my-2' style={{borderRadius: '10px'}}>
                        <Row className='align-items-center justify-content-between'>
                            <Col md={10}>
                                <strong className='text-light'>{getUserName(comment.userId)}</strong>
                                {editingCommentId === comment.id ? (
                                    <Form.Group>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={editingCommentText}
                                            onChange={(e) => setEditingCommentText(e.target.value)}
                                        />
                                        <div>
                                            {[1, 2, 3, 4, 5].map(rate => (
                                                <Form.Check
                                                    key={rate}
                                                    inline
                                                    type="radio"
label={rate}
                                                    name="editRating"
                                                    checked={editingCommentRate === rate}
                                                    onChange={() => setEditingCommentRate(rate)}
                                                />
                                            ))}
                                        </div>
                                    </Form.Group>
                                ) : (
                                    <>
                                        <p className='text-light'> - {comment.text}</p>
                                        <small className='text-light'>Rating: {comment.rate}/5</small>
                                    </>
                                )}
                            </Col>
                            {loggedInUser?.id === comment.userId && (
                                <Col md={2} className='d-flex justify-content-end'>
                                    {editingCommentId === comment.id ? (
                                        <>
                                            <Button variant="primary" onClick={() => handleSaveEdit(comment.id)}>
                                                Save
                                            </Button>
                                            <Button variant="secondary" onClick={cancelEdit}>
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button className='mx-2' variant="outline-warning" onClick={() => handleEditComment(comment.id, comment.text, comment.rate)}>
                                                <FaEdit />
                                            </Button>
                                            <Button variant="outline-danger" onClick={() => handleDeleteComment(comment.id)}>
                                                <FaTrashAlt />
                                            </Button>
                                        </>
                                    )}
                                </Col>
                            )}
                        </Row>
                    </Col>
                ))}
            </Row>
            {/* Modal Share */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Share in a post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button variant="secondary" className="mb-3 w-100">Create post</Button>

                    <hr />

                    <div className="text-center mb-3">
                        <Row>
                            <Col>
<Button variant="outline-dark" className="rounded-circle p-2">
                                    <AiOutlineLink size={20} />
                                </Button>
                            </Col>
                            <Col>
                                <Button variant="outline-primary" className="rounded-circle p-2">
                                    <FaFacebookF size={20} />
                                </Button>
                            </Col>
                            <Col>
                                <Button variant="outline-success" className="rounded-circle p-2">
                                    <FaWhatsapp size={20} />
                                </Button>
                            </Col>
                            <Col>
                                <Button variant="outline-info" className="rounded-circle p-2">
                                    <FaTwitter size={20} />
                                </Button>
                            </Col>
                            <Col>
                                <Button variant="outline-dark" className="rounded-circle p-2">
                                    <FaEnvelope size={20} />
                                </Button>
                            </Col>
                        </Row>
                    </div>

                    <InputGroup>
                        <Form.Control
                            type="text"
                            readOnly
                            value={shareLink}
                        />
                        <Button variant="primary" onClick={handleCopyLink}>
                            <FaCopy /> Copy
                        </Button>
                    </InputGroup>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default PhotoDetails;