import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PersonalInformation({ email, password, autoLogin }) {
    const [userData, setUserData] = useState({
        name: '',
        street: '',
        city: ''
    });
    const [id, setId] = useState(1); // Default to 1, sẽ được cập nhật sau khi fetch user
    const navigate = useNavigate();

    // Danh sách các tỉnh/thành phố
    const cities = [
        'An Giang', 'Bà Rịa - Vũng Tàu', 'Bạc Liêu', 'Bắc Giang', 'Bắc Kạn', 'Bắc Ninh', 'Bến Tre', 'Bình Dương',
        'Bình Định', 'Bình Phước', 'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Cần Thơ', 'Đà Nẵng', 'Đắk Lắk', 'Đắk Nông',
        'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Giang', 'Hà Nam', 'Hà Nội', 'Hà Tĩnh', 'Hải Dương',
        'Hải Phòng', 'Hậu Giang', 'Hòa Bình', 'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu', 'Lâm Đồng',
        'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định', 'Nghệ An', 'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên',
        'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sóc Trăng', 'Sơn La', 'Tây Ninh', 'Thái Bình',
        'Thái Nguyên', 'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang', 'Trà Vinh', 'Tuyên Quang', 'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'
    ];

    useEffect(() => {
        // Fetch users hiện tại để tìm id lớn nhất
        axios.get('http://localhost:9999/users')
            .then(response => {
                const users = response.data;
                if (users.length > 0) {
                    const maxId = Math.max(...users.map(user => user.id));
                    setId(maxId + 1); // Increment id
                }
            })
            .catch(error => {
                console.error('Lỗi khi fetch users:', error);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Tạo đối tượng user mới theo đúng format
        const newUser = {
            id: id,  // Sử dụng id mới
            userId: id,  // Sử dụng id mới cho userId
            name: userData.name,
            account: {
                email: email,
                password: password,  // Sử dụng password từ Register form
                activeCode: '',
                isActive: true  // Set isActive = true
            },
            address: {
                street: userData.street,
                city: userData.city,
                zipCode: null  // Set zipCode = null vì không có trong form
            }
        };

        // Lưu user mới vào db.json
axios.post('http://localhost:9999/users', newUser)
            .then(response => {
                alert('Lưu thông tin thành công.');

                // Tự động đăng nhập nếu `autoLogin` là true
                if (autoLogin) {
                    localStorage.setItem('loggedInUser', JSON.stringify(newUser));
                    navigate('/', { state: { showAlert: true } });  // Chuyển hướng về trang chủ
                }
            })
            .catch(error => {
                console.error('Lỗi khi lưu thông tin người dùng:', error.response ? error.response.data : error.message);
                alert('Có lỗi xảy ra khi lưu thông tin của bạn.');
            });
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <h1 className="text-center" style={{ color: 'white' }}>Thông tin cá nhân</h1>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formName">
                            <Form.Label style={{ color: 'white' }}>Tên</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={userData.name}
                                onChange={handleChange}
                                placeholder="Nhập tên của bạn"
                                required
                                
                            />
                        </Form.Group>

                        <Form.Group controlId="formStreet">
                            <Form.Label style={{ color: 'white' }}>Đường</Form.Label>
                            <Form.Control
                                type="text"
                                name="street"
                                value={userData.street}
                                onChange={handleChange}
                                placeholder="Nhập đường"
                                required
                                
                            />
                        </Form.Group>

                        <Form.Group controlId="formCity">
                            <Form.Label style={{ color: 'white' }}>Thành phố</Form.Label>
                            <Form.Control
                                as="select"
                                name="city"
                                value={userData.city}
                                onChange={handleChange}
                                required
                             
                            >
                                <option value="">Chọn thành phố</option>
                                {cities.map((city, index) => (
                                    <option key={index} value={city}>{city}</option>
                                ))}
                            </Form.Control>
</Form.Group>

                        <Button variant="primary" type="submit" block>
                            Lưu thông tin
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default PersonalInformation;