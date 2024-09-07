import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Footer, Header, Home, PhotoDetails, ChangePassword, ForgotPassword } from "./components/Index";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import ProfileForm from "./components/ProfileForm";
import AlbumForm from "./components/AlbumForm";
import PersonalInformation from "./components/PersonalInformation";
import FavoritePhotos from "./components/FavoritePhotos";

function App() {
  return (
    <Container fluid style={{ backgroundColor: "#1F2833" }}>
      <Container className="">
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/photo" element={<Home />} />
            <Route path="/photos/:photoId" element={<PhotoDetails />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgotpassword" element={<ForgotPassword />} />
            <Route path="/profile" element={<Profile />}>
              <Route index element={<ProfileForm />} />
              <Route path="albums" element={<AlbumForm />} />
               <Route path="changepassword" element={<ChangePassword />} />
              <Route path="albums/favorite" element={<FavoritePhotos />} />
            </Route>
            <Route path="/auth/active-account/:key" />
            <Route path="/infomation" element={<PersonalInformation />} />
          </Routes>
        </BrowserRouter>
      </Container>
      <Footer />
    </Container>
  );
}

export default App;
