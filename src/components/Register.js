import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import PersonalInformation from './PersonalInformation'; // Import PersonalInformation

const Register = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [registeredEmails, setRegisteredEmails] = useState(['example1@gmail.com', 'example2@gmail.com']);

    const generateOtp = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const sendEmail = async () => {
        if (!email || !username || !password || !confirmPassword) {
            setError('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Mật khẩu không khớp.');
            return;
        }

        if (registeredEmails.includes(email)) {
            setError('Email đã được đăng ký. Vui lòng sử dụng email khác.');
            return;
        }

        try {
            const generatedOtp = generateOtp();
            setGeneratedOtp(generatedOtp);

            // Add new email to registered emails list
            setRegisteredEmails([...registeredEmails, email]);

            const baseLocation = window.location.origin;
            const verifyMessage = `Mã OTP của bạn là ${generatedOtp}\n
            Hoặc nhấp vào liên kết sau để xác minh tài khoản của bạn: ${baseLocation}/verification/${email}/${generatedOtp}`;

            // Send OTP email using EmailJS
            await emailjs.send(
                "service_c7gfj15", //Service ID 
                "template_kiwvwgw", // Replace with your EmailJS Template ID
                {
                    to_email: email,
                    code: verifyMessage,
                },
                "b1-fjcU3V1tkyr56I" // Replace with your EmailJS Public Key
            );

            alert('Đăng ký thành công. Vui lòng kiểm tra email của bạn để nhận mã OTP.');
            setStep(2);
        } catch (error) {
            console.error('Lỗi trong quá trình gửi email xác thực:', error);
            setError('Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại.');
        }
    };

    const verifyOtp = () => {
        if (otp === generatedOtp) {
            alert('Xác thực OTP thành công.');
            setStep(3); // Move to step 3 (Personal Information)
        } else {
            setError('OTP không đúng. Vui lòng thử lại.');
        }
    };

    return (
        <div className="container mt-5">
            {step === 1 && (
                <div className="row justify-content-center">
<div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h2 className="card-title text-center">Đăng ký</h2>
                                {error && <div className="alert alert-danger">{error}</div>}
                                <div className="form-group">
                                    <label>Địa chỉ email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Nhập email của bạn"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Tên đăng nhập</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Nhập tên đăng nhập của bạn"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Mật khẩu</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Nhập mật khẩu"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Xác nhận mật khẩu</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Xác nhận mật khẩu"
                                    />
                                </div>
                                <button className="btn btn-primary btn-block" onClick={sendEmail}>
                                    Đăng ký
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
)}
            {step === 2 && (
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h2 className="card-title text-center">Xác thực OTP</h2>
                                {error && <div className="alert alert-danger">{error}</div>}
                                <div className="form-group">
                                    <label>Nhập mã OTP</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="Nhập mã OTP đã được gửi tới email của bạn"
                                    />
                                </div>
                                <button className="btn btn-primary btn-block" onClick={verifyOtp}>
                                    Xác thực OTP
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {step === 3 && (
                <PersonalInformation email={email} password={password} autoLogin={true} />
            )}
        </div>
    );
};

export default Register;