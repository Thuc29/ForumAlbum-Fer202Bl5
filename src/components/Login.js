import React, { useState } from 'react';
import { Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Login() {
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [errorMessage, setErrorMessage] = useState('');
     const navigate = useNavigate(); // Khai báo hook useNavigate

     const handleLogin = async (e) => {
          e.preventDefault();
          if (!email && !password) {
               setErrorMessage('Email and password are required');
               return;
           }
   
           if (!email) {
               setErrorMessage('Email is required');
               return;
           }
   
           if (!password) {
               setErrorMessage('Password is required');
               return;
           }
   
          try {
               const response = await fetch('http://localhost:9999/users');
               const users = await response.json();

               const user = users.find(
                    (user) => user.account.email === email && user.account.password === password
               );

               if (user) {
                    if (user.account.isActive) {
                         // Lưu thông tin người dùng vào localStorage nếu cần
                         localStorage.setItem('loggedInUser', JSON.stringify(user));
                         // Chuyển hướng đến trang chủ
                         navigate('/', { state: { showAlert: true } });
                    } else {
                         setErrorMessage('Account is not active. Please activate your account first.');
                    }
               } else {
                    setErrorMessage('Invalid email or password.');
               }
          } catch (error) {
               console.error("Error fetching users:", error);
               setErrorMessage('An error occurred during login. Please try again later.');
          }
     };

     return (
          
               <Row className='text-center p-3'>
                    <Col>
                         <h3 className='text-white'>Login Form</h3>
                         <Button variant="danger" className='w-25'>Google</Button>
                         <hr className='w-25 mx-auto text-white' />
                         <Form className='w-25 mx-auto' onSubmit={handleLogin}>
                            
                              <InputGroup className="mb-3">
                                   <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                                   <Form.Control
                                        type="email"
                                        placeholder="Email"
                                        aria-label="Email"
                                        aria-describedby="basic-addon1"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                   />
                              </InputGroup>
                              
                              <InputGroup className="">
                                   <InputGroup.Text id="basic-addon1">Password</InputGroup.Text>
                                   <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        aria-label="Password"
                                        aria-describedby="basic-addon1"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                   />
                              </InputGroup>
                              <Form.Text><a href='/auth/forgotpassword' className='text-info text-decoration-none' style={{paddingLeft: '65%'}}>Forgot Password</a>
                              </Form.Text >
                              {errorMessage && <p className="text-danger">{errorMessage}</p>}
                              <Button variant="outline-info" type="submit" className='w-100 mt-3'>Login</Button>
                              <Form.Text className='text-sm text-white '>Don't have an account?
                                    <b><a href='/register' className='text-info text-sm'>Register</a></b>
                                    </Form.Text>
                              
                         </Form>
                    </Col>
               </Row>
     );
}

export default Login;
