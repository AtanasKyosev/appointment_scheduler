import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Book from "./pages/Book";
import Services from "./pages/Services";
import SignUp from "./pages/SignUp"
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import NoPage from "./pages/NoPage";
import EditProfile from "./pages/EditProfile.jsx";
import AdminPage from "./pages/AdminPage.jsx";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>

                    <Route index element={<Home />} />
                    <Route path="book" element={<Book />} />
                    <Route path="services" element={<Services />} />
                    <Route path="administration" element={<AdminPage />} />

                    <Route path="signup" element={<SignUp />} />
                    <Route path="login" element={<Login />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="edit-profile" element={<EditProfile />} />

                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App