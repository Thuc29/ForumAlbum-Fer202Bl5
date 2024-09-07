import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Image, Row } from "react-bootstrap";
import { FaRemoveFormat, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

function FavoritePhotos() {
    const [photos, setPhotos] = useState([]);
    const [favorites, setFavorites] = useState([]);

    // Fetch photos data from the API
    useEffect(() => {
        axios.get("http://localhost:9999/photos")
            .then(res => setPhotos(res.data))
            .catch(err => console.error(err));
    }, []);

    // Fetch favorites data from the API
    useEffect(() => {
        axios.get("http://localhost:9999/favorites")
            .then(res => setFavorites(res.data))
            .catch(err => console.error(err));
    }, []);

    // Filter favorite photos
    const favoritePhotos = photos.filter(photo => 
        favorites.some(fav => fav.photoId === photo.photoId)
    );

    // Remove photo from favorites
    const removeFavorite = (photoId) => {
        const favorite = favorites.find(fav => fav.photoId === photoId);
        if (favorite) {
            axios.delete(`http://localhost:9999/favorites/${favorite.id}`)
                .then(() => {
                    setFavorites(favorites.filter(fav => fav.photoId !== photoId));
                })
                .catch(err => console.error(err));
        }
    };

    return (
        <Row className="content">
            <Col xs={12} className="menu">
                <h3 className="text-white text-center">Favorite Photos</h3>
                {favoritePhotos.length === 0 ? (
                    <p className="text-warning">  - You have no favorite photos yet.</p>
                ) : (
                    <ul className="list-unstyled d-flex flex-wrap">
                        {favoritePhotos.map(photo => (
                            <li key={photo.id} className="m-3">
                                <Image 
                                    src={`/assest/images/${photo.image.thumbnail}`} 
                                    thumbnail 
                                    style={{ width: "250px", height: "150px" }} 
                                /> 
                                <br/>
                                <div className="d-flex justify-content-between mt-2">
                                    <Link 
                                    to={`/photos/${photo.photoId}`} 
                                    className="text-decoration-none text-header text-white" 
                                    style={{ fontStyle: "italic", marginLeft: "10px" }}
                                >
                                    {photo.title}
                                </Link>
                                
                                    <Button 
                                        variant="outline-danger" 
                                        onClick={() => removeFavorite(photo.photoId)}
                                    >
                                        <FaTimes/>
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </Col>
        </Row>
    );
}

export default FavoritePhotos;
