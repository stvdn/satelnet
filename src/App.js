import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Header from "./components/Header";
import { BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import UploadProduct from "./pages/User/UploadProduct";
import Profile from "./pages/User/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Footer from "./components/Footer";
import ProductDetail from "./pages/ProductDetail";
import Contactus from "./pages/Contactus";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product-detail" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/upload-product" element={<UploadProduct />} />
        <Route path="/contactus" element={<Contactus/>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
