import { Col, Row, Container } from "react-bootstrap";
import { FaHome, FaEnvelope, FaPhone, FaPrint, FaFacebookF, FaTwitter, FaGoogle, FaInstagram } from 'react-icons/fa';

function Footer() {
    return (
        <footer className="text-center text-lg-start text-white" style={{ backgroundColor: "#45526e" }}>
            <Container className="p-4 pb-0">
                <Row>
                    {/* Column for Company Info */}
                    <Col md={3} lg={3} xl={3} className="mx-auto mt-3">
                        <h6 className="text-uppercase mb-4 font-weight-bold">Company name</h6>
                        <p>Here you can use rows and columns to organize your footer content. Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                    </Col>

                    <hr className="w-100 clearfix d-md-none" />

                    {/* Column for Products */}
                    <Col md={2} lg={2} xl={2} className="mx-auto mt-3">
                        <h6 className="text-uppercase mb-4 font-weight-bold">Products</h6>
                        <p><a className="text-white" href="#">MDBootstrap</a></p>
                        <p><a className="text-white" href="#">MDWordPress</a></p>
                        <p><a className="text-white" href="#">BrandFlow</a></p>
                        <p><a className="text-white" href="#">Bootstrap Angular</a></p>
                    </Col>

                    <hr className="w-100 clearfix d-md-none" />

                    {/* Column for Useful Links */}
                    <Col md={3} lg={2} xl={2} className="mx-auto mt-3">
                        <h6 className="text-uppercase mb-4 font-weight-bold">Useful links</h6>
                        <p><a className="text-white" href="#">Your Account</a></p>
                        <p><a className="text-white" href="#">Become an Affiliate</a></p>
                        <p><a className="text-white" href="#">Shipping Rates</a></p>
                        <p><a className="text-white" href="#">Help</a></p>
                    </Col>

                    <hr className="w-100 clearfix d-md-none" />

                    {/* Column for Contact Information */}
                    <Col md={4} lg={3} xl={3} className="mx-auto mt-3">
                        <h6 className="text-uppercase mb-4 font-weight-bold">Contact</h6>
                        <p><FaHome className="mr-3" /> New York, NY 10012, US</p>
                        <p><FaEnvelope className="mr-3" /> info@gmail.com</p>
                        <p><FaPhone className="mr-3" /> + 01 234 567 88</p>
                        <p><FaPrint className="mr-3" /> + 01 234 567 89</p>
                    </Col>
                </Row>

                <hr className="my-3" />

                {/* Copyright Section */}
                <Row className="d-flex align-items-center">
                    <Col md={7} lg={8} className="text-center text-md-start">
                        <div className="p-3">
                            © 2020 Copyright: <a className="text-white" href="https://mdbootstrap.com/">MDBootstrap.com</a>
                        </div>
                    </Col>
                    <Col md={5} lg={4} className="text-center text-md-end">
                        <a className="btn btn-outline-light btn-floating m-1" role="button" href="#"><FaFacebookF /></a>
                        <a className="btn btn-outline-light btn-floating m-1" role="button" href="#"><FaTwitter /></a>
                        <a className="btn btn-outline-light btn-floating m-1" role="button" href="#"><FaGoogle /></a>
                        <a className="btn btn-outline-light btn-floating m-1" role="button" href="#"><FaInstagram /></a>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;
