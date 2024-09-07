import React from 'react';
import { Col, Row, ListGroup } from 'react-bootstrap';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Row className='mt-3 mb-3'>
            <Col md={2} sm={12} className='border pt-3'>
                <ListGroup >
                    <ListGroup.Item action onClick={() => navigate('/profile')} active={location.pathname === '/profile'}>
                        User Profile
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={() => navigate('/profile/albums')} active={location.pathname === '/profile/albums'}>
                        Album
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={() => navigate('/profile/changePassword')} active={location.pathname === '/changePassword'}>
                        Change Password
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={() => navigate('/profile/albums/favorite')} active={location.pathname === '/profile/albums/favorite'}>
                        Favorite Photo
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col md={10} className='border'>
                <Outlet />
            </Col>
        </Row>
    );
}

export default Profile;
