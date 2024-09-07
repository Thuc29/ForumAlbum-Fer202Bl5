import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Form, ListGroup, Image, Modal } from 'react-bootstrap';
import axios from 'axios';
import { FaPlusCircle, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function AlbumForm() {
    const [albums, setAlbums] = useState([]);
    const [selectedAlbumId, setSelectedAlbumId] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [showAddAlbumModal, setShowAddAlbumModal] = useState(false);
    const [newAlbumTitle, setNewAlbumTitle] = useState("");
    const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
    const [newPhotoTitle, setNewPhotoTitle] = useState("");
    const [newPhotoUrls, setNewPhotoUrls] = useState(""); // Lưu nhiều URL ảnh
    const [newPhotoThumbnail, setNewPhotoThumbnail] = useState(""); // Lưu thumbnail
    const [newPhotoAlbumId, setNewPhotoAlbumId] = useState(null);
    const [newPhotoTag, setNewPhotoTag] = useState([]);
    const [showEditPhotoModal, setShowEditPhotoModal] = useState(false);
    const [editPhotoId, setEditPhotoId] = useState(null);
    const [editPhotoTitle, setEditPhotoTitle] = useState("");
    const [editPhotoUrls, setEditPhotoUrls] = useState(""); // Sửa nhiều URL ảnh
    const [editPhotoThumbnail, setEditPhotoThumbnail] = useState(""); // Sửa thumbnail
    const [editPhotoAlbumId, setEditPhotoAlbumId] = useState(null);
    const [editPhotoTag, setEditPhotoTag] = useState([]);

    const allTags = ["summer", "hot", "new", "beautiful", "col"];

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const userId = loggedInUser?.userId;

    useEffect(() => {
        axios.get("http://localhost:9999/albums")
            .then(response => {
                const userAlbums = response.data.filter(album => album.userId === userId);
                setAlbums(userAlbums);
                if (userAlbums.length > 0) {
                    setSelectedAlbumId(userAlbums[0].albumId);
                }
            })
            .catch(error => console.error("Error fetching albums:", error));
    }, [userId]);

    useEffect(() => {
        if (selectedAlbumId) {
            axios.get(`http://localhost:9999/photos?albumId=${selectedAlbumId}`)
                .then(response => setPhotos(response.data))
                .catch(error => console.error("Error fetching photos:", error));
        }
    }, [selectedAlbumId]);

    const handleAddAlbum = async () => {
        try {
            const response = await axios.get("http://localhost:9999/albums");
            const existingAlbums = response.data;

            const maxId = Math.max(...existingAlbums.map(album => album.id), 0);
            const maxAlbumId = Math.max(...existingAlbums.map(album => album.albumId), 0);

            const newAlbumId = maxId + 1;
            const newAlbumAlbumId = maxAlbumId + 1;
            const newAlbum = {
albumId: newAlbumAlbumId,
                title: newAlbumTitle,
                userId: userId,
                id: newAlbumId
            };
            const result = await axios.post("http://localhost:9999/albums", newAlbum);
            const addedAlbum = result.data;

            setAlbums([...albums, addedAlbum]);
            setNewAlbumTitle("");
            setShowAddAlbumModal(false);
            setSelectedAlbumId(addedAlbum.albumId);
        } catch (error) {
            console.error("Error adding album:", error);
        }
    };

    const handleAddPhoto = async () => {
        try {
            const response = await axios.get("http://localhost:9999/photos");
            const allPhotos = response.data;

            const maxPhotoId = Math.max(...allPhotos.map(photo => photo.photoId), 0);
            const newPhotoId = maxPhotoId + 1;

            const newPhoto = {
                photoId: newPhotoId,
                title: newPhotoTitle,
                albumId: parseInt(newPhotoAlbumId) || selectedAlbumId, // Chuyển đổi albumId thành số
                image: {
                    url: newPhotoUrls.split(',').map(url => url.trim()), // Tách chuỗi URL thành mảng
                    thumbnail: newPhotoThumbnail
                },
                tags: newPhotoTag,
                likes: 0
            };

            const result = await axios.post("http://localhost:9999/photos", newPhoto);
            setPhotos([...photos, result.data]);

            setNewPhotoTitle("");
            setNewPhotoUrls("");
            setNewPhotoThumbnail("");
            setNewPhotoAlbumId(null);
            setNewPhotoTag([]);
            setShowAddPhotoModal(false);

        } catch (error) {
            console.error("Error adding photo:", error);
        }
    };

    const handleDeletePhoto = (photoId) => {
        axios.delete(`http://localhost:9999/photos/${photoId}`)
            .then(() => {
                setPhotos(prevPhotos => prevPhotos.filter(photo => photo.photoId !== photoId));
            })
            .catch(error => {
                console.error("Error deleting photo:", error);
            });
    };

    const handleDeleteAlbum = (albumId) => {
        axios.delete(`http://localhost:9999/albums/${albumId}`)
            .then(() => {
                setAlbums(prevAlbums => prevAlbums.filter(album => album.albumId !== albumId));
                if (selectedAlbumId === albumId) {
                    setSelectedAlbumId(albums.length > 1 ? albums[0].albumId : null);
                }
            })
            .catch(error => {
                console.error("Error deleting album:", error);
            });
    };

    const handleShowEditModal = (photo) => {
        setEditPhotoId(photo.photoId);
        setEditPhotoTitle(photo.title);
        setEditPhotoUrls(photo.image.url.join(', ')); // Ghép mảng URL thành chuỗi
        setEditPhotoThumbnail(photo.image.thumbnail);
        setEditPhotoAlbumId(photo.albumId);
setEditPhotoTag(photo.tags || []);
        setShowEditPhotoModal(true);
    };

    const handleEditPhoto = () => {
        if (editPhotoId == null) return;

        axios.put(`http://localhost:9999/photos/${editPhotoId}`, {
            photoId: editPhotoId,
            title: editPhotoTitle,
            albumId: parseInt(editPhotoAlbumId), // Chuyển đổi albumId thành số
            image: {
                url: editPhotoUrls.split(',').map(url => url.trim()), // Tách chuỗi URL thành mảng
                thumbnail: editPhotoThumbnail
            },
            tags: editPhotoTag
        })
            .then(response => {
                setPhotos(photos.map(photo => photo.photoId === editPhotoId ? response.data : photo));
                setShowEditPhotoModal(false);
            })
            .catch(error => console.error("Error updating photo:", error));
    };

    return (
        <Row className="content">
            <Col xs={3} className="sidebar">
                <h5>Albums</h5>
                <ListGroup>
                    {albums.map(album => (
                        <ListGroup.Item
                            key={album.albumId}
                            active={album.albumId === selectedAlbumId}
                            className="d-flex justify-content-between align-items-center"
                        >
                            <span onClick={() => setSelectedAlbumId(album.albumId)}>{album.title}</span>
                            <Button variant="danger" size="sm" onClick={() => handleDeleteAlbum(album.albumId)}> <FaTrashAlt/></Button>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                <Button variant="outline-info" onClick={() => setShowAddAlbumModal(true)} className="mt-3"> <FaPlusCircle/> Album </Button>
            </Col>
            <Col xs={9} className="album-content">
                <h5>Photos in Album {selectedAlbumId}</h5>
                <Row>
                    {photos?.map(photo => (
                        <Col xs={4} key={photo.photoId} className="mb-3">
                            <Image src={`/assest/images/${photo.image.thumbnail}`} thumbnail style={{ width: "100%", height: "150px" }}/>
                            <p className='text-center'>
                                <Link to={`/photos/${photo.photoId}`} className='text-decoration-none'>{photo.title}</Link></p>
                            <Button variant="outline-warning" onClick={() => handleShowEditModal(photo)}><FaPencilAlt /></Button>
                            <Button variant="outline-danger" onClick={() => handleDeletePhoto(photo.photoId)}><FaTrashAlt /></Button>
                        </Col>
                    ))}
                    <Col xs={4} className="mb-3">
                        <Button variant="outline-primary" onClick={() => setShowAddPhotoModal(true)}> <FaPlusCircle/> Photo</Button>
                    </Col>
                </Row>
            </Col>
<Modal show={showAddAlbumModal} onHide={() => setShowAddAlbumModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Album</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Album Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={newAlbumTitle}
                            onChange={(e) => setNewAlbumTitle(e.target.value)}
                            placeholder="Enter album title"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddAlbumModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleAddAlbum}>Add Album</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showAddPhotoModal} onHide={() => setShowAddPhotoModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Photo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Photo Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={newPhotoTitle}
                            onChange={(e) => setNewPhotoTitle(e.target.value)}
                            placeholder="Enter photo title"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Photo URLs (separated by commas)</Form.Label>
                        <Form.Control
                            type="text"
                            value={newPhotoUrls}
                            onChange={(e) => setNewPhotoUrls(e.target.value)}
                            placeholder="Enter photo URLs"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Photo Thumbnail URL</Form.Label>
                        <Form.Control
                            type="text"
                            value={newPhotoThumbnail}
                            onChange={(e) => setNewPhotoThumbnail(e.target.value)}
                            placeholder="Enter photo thumbnail URL"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Select Album</Form.Label>
                        <Form.Select
                            value={newPhotoAlbumId}
                            onChange={(e) => setNewPhotoAlbumId(parseInt(e.target.value))} // Chuyển đổi albumId thành số
                        >
                            <option value="">Select an album</option>
                            {albums.map(album => (
<option key={album.albumId} value={album.albumId}>{album.title}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Tag</Form.Label>
                        <div>
                            {allTags.map(tag => (
                                <Form.Check
                                    key={tag}
                                    type="checkbox"
                                    id={`new-tag-${tag}`}
                                    label={tag}
                                    value={tag}
                                    checked={newPhotoTag.includes(tag)}
                                    onChange={(e) => {
                                        const { value, checked } = e.target;
                                        setNewPhotoTag(prevTags =>
                                            checked
                                                ? [...prevTags, value]
                                                : prevTags.filter(tag => tag !== value)
                                        );
                                    }}
                                />
                            ))}
                        </div>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddPhotoModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleAddPhoto}>Add Photo</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEditPhotoModal} onHide={() => setShowEditPhotoModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Photo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Photo Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={editPhotoTitle}
                            onChange={(e) => setEditPhotoTitle(e.target.value)}
                            placeholder="Enter photo title"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Photo URLs (separated by commas)</Form.Label>
                        <Form.Control
                            type="text"
                            value={editPhotoUrls}
                            onChange={(e) => setEditPhotoUrls(e.target.value)}
                            placeholder="Enter photo URLs"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Photo Thumbnail URL</Form.Label>
                        <Form.Control
                            type="text"
value={editPhotoThumbnail}
                            onChange={(e) => setEditPhotoThumbnail(e.target.value)}
                            placeholder="Enter photo thumbnail URL"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Select Album</Form.Label>
                        <Form.Select
                            value={editPhotoAlbumId}
                            onChange={(e) => setEditPhotoAlbumId(parseInt(e.target.value))} // Chuyển đổi albumId thành số
                        >
                            <option value="">Select an album</option>
                            {albums.map(album => (
                                <option key={album.albumId} value={album.albumId}>{album.title}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Tag</Form.Label>
                        <div>
                            {allTags.map(tag => (
                                <Form.Check
                                    key={tag}
                                    type="checkbox"
                                    id={`edit-tag-${tag}`}
                                    label={tag}
                                    value={tag}
                                    checked={editPhotoTag.includes(tag)}
                                    onChange={(e) => {
                                        const { value, checked } = e.target;
                                        setEditPhotoTag(prevTags =>
                                            checked
                                                ? [...prevTags, value]
                                                : prevTags.filter(tag => tag !== value)
                                        );
                                    }}
                                />
                            ))}
                        </div>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditPhotoModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleEditPhoto}>Update Photo</Button>
                </Modal.Footer>
            </Modal>
        </Row>
    );
}