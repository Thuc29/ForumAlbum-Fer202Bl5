import React, { useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function ProfileForm() {
const user = JSON.parse(localStorage.getItem('loggedInUser'));
const [isEditing, setIsEditing] = useState(false);
const navigate = useNavigate();
const [updatedUser, setUpdatedUser] = useState({ 
name: user?.name || '', 
address: { 
street: user?.address?.street || '', 
city: user?.address?.city || '' 
        }
    });
const cities = [
'An Giang', 'Bà Rịa - Vũng Tàu', 'Bạc Liêu', 'Bắc Giang', 'Bắc Kạn', 'Bắc Ninh', 'Bến Tre', 'Bình Dương', 
'Bình Định', 'Bình Phước', 'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Cần Thơ', 'Đà Nẵng', 'Đắk Lắk', 'Đắk Nông', 
'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Giang', 'Hà Nam', 'Hà Nội', 'Hà Tĩnh', 'Hải Dương', 
'Hải Phòng', 'Hậu Giang', 'Hòa Bình', 'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu', 'Lâm Đồng', 
'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định', 'Nghệ An', 'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên', 
'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sóc Trăng', 'Sơn La', 'Tây Ninh', 'Thái Bình', 
'Thái Nguyên', 'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang', 'Trà Vinh', 'Tuyên Quang', 'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'
    ];
const handleEdit = () => {
setIsEditing(true);
    };
const handleUpdate = async () => {
try {
const fullUserUpdate = {
...user,
name: updatedUser.name,
address: {
...updatedUser.address,
                }
            };
const response = await axios.put(`http://localhost:9999/users/${user.userId}`, fullUserUpdate);
if (response.status === 200) {
localStorage.setItem('loggedInUser', JSON.stringify(fullUserUpdate));
setIsEditing(false);
alert('Profile updated successfully.');
            } else {
console.error('Update failed with status:', response.status);
alert('Failed to update profile.');
            }
        } catch (error) {
console.error("Error updating profile:", error);
alert('Failed to update profile.');
        }
    };
const handleChange = (e) => {
const { name, value } = e.target;
setUpdatedUser(prevState => ({
...prevState,
[name]: value,
        }));
    };
const handleAddressChange = (e) => {
const { name, value } = e.target;
setUpdatedUser(prevState => ({
...prevState,
address: {
...prevState.address,
[name]: value,
            }
        }));
    };
return (
<Container>
<Row className="justify-content-center m-3">
<Col md={9}>
<h3 className='text-center text-white'>{user?.name} - <span>INFORMATION</span></h3>
<Form className="text-white">
<Form.Group controlId="formName">
<Form.Label>Name</Form.Label>
<Form.Control 
type="text" 
name="name" 
value={updatedUser?.name} 
onChange={handleChange} 
disabled={!isEditing} 
/>
</Form.Group>
<Form.Group controlId="formEmail">
<Form.Label>Email</Form.Label>
<Form.Control 
type="email" 
name="email" 
value={user?.account.email} 
disabled 
/>
</Form.Group>
<Form.Group controlId="formStreet">
<Form.Label>Street</Form.Label>
<Form.Control 
type="text" 
name="street" 
value={updatedUser?.address.street} 
onChange={handleAddressChange} 
disabled={!isEditing} 
/>
</Form.Group>
<Form.Group controlId="formCity" className="mb-3">
<Form.Label>City</Form.Label>
<Form.Control 
as="select" 
name="city" 
value={updatedUser.address.city} 
onChange={handleAddressChange} 
disabled={!isEditing}
>
<option value="">Choose...</option>
{cities.map(city => (
<option key={city} value={city}>{city}</option>
                                ))}
</Form.Control>
</Form.Group>
{isEditing ? (
<Button variant="success" onClick={handleUpdate}>Update</Button>
                        ) : (
<Button variant="info" onClick={handleEdit}>Edit</Button>
                        )}
</Form>
</Col>
</Row>
</Container>
    );
}
export default ProfileForm;