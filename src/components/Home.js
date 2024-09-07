import { useEffect, useState } from "react";
import { Col, Container, Row, Card, Button, Form } from "react-bootstrap";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSort, FaSortAlphaUp } from "react-icons/fa";

function Home() {
    const [photos, setPhotos] = useState([]);
    const [filterPhoto, setFilterPhoto] = useState([]);
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState(null); // Initially null, so no sorting
    const [selectedTags, setSelectedTags] = useState([]);
    const location = useLocation();
    const urlElement = new URLSearchParams(location.search);
    const album = urlElement.get("album");
    const [showAlert, setShowAlert] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        // Call API -> get all photos
        axios.get("http://localhost:9999/photos")
            .then(response => {
                let tempPhoto = response.data;

                // Filter by search
                if (search.length !== 0) {
                    tempPhoto = tempPhoto.filter(p =>
                        p.title.toUpperCase().includes(search.toUpperCase()) ||
                        p.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
                    );
                }

                // Filter by album
                if (album) {
                    tempPhoto = tempPhoto.filter(p => p.albumId === parseInt(album));
                }

                // Filter by selected tags (match any selected tag)
                if (selectedTags.length > 0) {
                    tempPhoto = tempPhoto.filter(p =>
                        selectedTags.some(tag => p.tags?.includes(tag.toLowerCase()))
                    );
                }

                setPhotos(tempPhoto);
                setFilterPhoto(response.data);
            })
            .catch(err => console.log("Error: " + err));
    }, [search, album, selectedTags]);

    function filterByTag(tag) {
        if (tag === "all") {
            setSelectedTags([]);
        } else {
            setSelectedTags(prevTags => 
                prevTags.includes(tag.toLowerCase()) 
                    ? prevTags.filter(t => t !== tag.toLowerCase()) 
                    : [...prevTags, tag.toLowerCase()]
            );
        }
    }

    // Sort photos when the sort button is clicked
    function toggleSortOrder() {
        setSortOrder(prevOrder => {
            const newOrder = prevOrder === "asc" ? "desc" : "asc";
            const sortedPhotos = [...photos].sort((a, b) => 
                newOrder === "asc" 
                    ? a.title.localeCompare(b.title) 
                    : b.title.localeCompare(a.title)
            );
            setPhotos(sortedPhotos);
            return newOrder;
        });
    }

    // Get all Tags
    let tagsList = [];
    filterPhoto.forEach(p => {
        let photoTags = Array.isArray(p.tags) ? p.tags : [];
        tagsList = [...tagsList, ...photoTags];
    });

    // Create a unique set of tags
    let tagsSet = new Set(tagsList);
    let newTags = [...tagsSet];

    // set time alert
    useEffect(() => {
        if (location.state?.showAlert) {
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 2000);
        }
    }, [location.state]);

    return (
        <Row className="content">
            <div>
                {showAlert && <div className="alert alert-success">Login successful!</div>}
            </div>
            <Col>
                <Container fluid>
                    <Row>
                        <Col md={{ span: 6}} style={{ margin: "10px auto"  }}>
                            <div>
                                <Form>
                                    <Form.Group>
                                        <Form.Control 
                                            placeholder="Enter photo title or tags"
                                            style={{ border: "1px solid gray" }}
                                            onChange={e => setSearch(e.target.value)} 
                                        />
                                    </Form.Group>
                                </Form>
                            </div>
                        </Col>
                        <Col md={3} className="text-end mt-3">
                            <Button 
                                variant="outline-info" 
                                onClick={toggleSortOrder}
                            >
                                <FaSort /> ({sortOrder === "asc" ? "Ascending" : "Descending"})
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12} md={10}>
                            <Container fluid>
                                <Row>
                                    {
                                        photos.length > 0 ? 
                                            photos.map(p => (
                                                <Col md={3} style={{ marginBottom: "10px" }} key={p.id}>
                                                    <Card style={{ width: '100%', border: "2px solid aqua" }}>
                                                        <Card.Img 
                                                            variant="top" 
                                                            src={"/assest/images/" + p.image?.thumbnail} 
                                                            style={{ height: "180px" }} 
                                                        />
                                                        <Card.Body style={{ textAlign: "center", borderTop: "2px solid black" }}>
                                                            <Card.Title>
                                                                <Link 
                                                                    to={`/photos/${p.photoId}`} 
                                                                    className="text-dark text-decoration-none"
                                                                >
                                                                    {p.title}
                                                                </Link>
                                                            </Card.Title>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            )) 
                                            : 
                                            <Col md={3} style={{ marginBottom: "10px", color: "red" }}>
                                                Photos not found
                                            </Col>
                                    }
                                </Row>
                            </Container>
                        </Col>
                        <Col className="d-none d-sm-none d-md-block" md={2}>
                            <div>Tags:</div>
                            <Button 
                                variant="info" 
                                style={{ margin: "5px" }} 
                                key={"all"} 
                                onClick={() => filterByTag("all")}
                            >
                                <Link to="/photo">All</Link>
                            </Button>
                            {
                                newTags.map(t => (
                                    <Button 
                                        variant="outline-info" 
                                        style={{ margin: "5px" }} 
                                        key={t}
                                        onClick={() => filterByTag(t)}
                                        active={selectedTags.includes(t.toLowerCase())}
                                    >
                                        {t}
                                    </Button>
                                ))
                            }
                        </Col>
                    </Row>
                </Container>
            </Col>
        </Row>
    );
}

export default Home;
