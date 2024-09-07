import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaSign, FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';

function Header() {
    const [albums, setAlbums] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        axios.get("http://localhost:9999/albums")
            .then(res => setAlbums(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('loggedInUser');
        navigate('/');
    };

    const user = JSON.parse(localStorage.getItem('loggedInUser'));

    // Extract albumId from the URL query parameters
    const params = new URLSearchParams(location.search);
    const selectedAlbumId = parseInt(params.get('album'), 10);

    return (
        <Row className="header">
            <Row className="d-flex pt-2">
                <Col className="mt-3"> 
                    <Link to={'/'} className="text-decoration-none">
                    <span className="text-header text-white">PHOTO</span>
                    <span className="text-header text-info">FORUM</span>
                    </Link>
                </Col>
                <Col className="text-end mb-2">
                    {user ? (
                        <Col className="d-flex justify-content-end">
                            <div>
                                <span className='d-grid me-3 border p-1' style={{color: "#66FCF1", fontWeight: "900", borderRadius: "10px"}}>
                                    Welcome, {user.name}
                                    <Link to={'/profile'} className='text-white text-decoration-none me-3' style={{fontSize: "15px", fontWeight: "700"}}>
                                        <FaUser/> Profile
                                    </Link>
                                </span>
                            </div>
                            <div>
                                <Button variant='outline-info mt-2' onClick={handleLogout}>
                                    <FaSignInAlt/> Logout 
                                </Button>
                            </div>
                        </Col>
                    ) : (
                        <>
                            <Button variant='info'>
                                <Link to={'/auth/login'} className='text-white text-decoration-none'><FaSignOutAlt/> Login</Link>
                            </Button>
                            <span> </span>
                            <Button variant='outline-info'>
                                <Link to={'/auth/register'} className='text-info text-decoration-none'>Register</Link>
                            </Button>
                        </>
                    )}
                </Col>
            </Row>
            <Col xs={12} className="menu">
                <ul className="">
                    {albums?.map(a => (
                        <li key={a.id}>
                            <Button 
                                variant="outline-info bg-secondary" 
                                style={{
                                    padding: "0px 5px 0px 5px",
                                    color: "black",
                                    borderColor: a.albumId === selectedAlbumId ? "pink" : "",  // Highlight selected album
                                    backgroundColor: a.albumId === selectedAlbumId ? "#66FCF1" : "secondary"  // Darken background if selected
                                }}
                            >
                                <Link 
                                    to={`/photo?album=${a.albumId}`} 
                                    className="text-decoration-none text-header" 
                                    style={{
                                        color: "#ffffff", 
                                        fontStyle: "italic",
                                    }}
                                >
                                    {a.title}
                                </Link>
                            </Button>
                        </li>
                    ))}
                </ul>
            </Col>
        </Row>
    )
}

export default Header;
