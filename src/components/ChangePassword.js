import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert, Row, Col, Breadcrumb } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user from localStorage on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (storedUser) {
      setUser(storedUser);
    } else {
      setError('User not found. Please log in again.');
      navigate('/auth/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      setError('User not found. Please log in again.');
      return;
    }

    if (user.account.password !== oldPassword) {
      setError('Old password is incorrect');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    try {
      const updatedUser = {
        ...user,
        account: { ...user.account, password: newPassword },
      };

      await axios.put(`http://localhost:9999/users/${user.id}`, updatedUser);

      localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSuccess('Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <Container fluid>
      <Row className='justify-content-center'> 
        <Col xs={12} md={6}>
          <h2 className='text-center text-white mt-3'>Change Password</h2>
          {error && <Alert variant='danger'>{error}</Alert>}
          {success && <Alert variant='success'>{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className='mb-1'>
              <Form.Label className='text-white'>Old Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter old password'
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className='mb-1'>
              <Form.Label className='text-white'>New Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter new password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className='mb-1'>
              <Form.Label className='text-white'>Confirm New Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Confirm new password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant='primary' type='submit' className='w-100'>
              Change Password
            </Button>
          </Form>
          <div className='text-center mt-3'>
            <a href='/'>Back to Home</a>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ChangePassword;
