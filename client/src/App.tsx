import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoutesAuth from "./components/PrivateRoutesAuth";
import PrivateRoutesAdmin from "./components/PrivateRoutesAdmin";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import PrivateRoutesUser from "./components/PrivateRoutesUser";
import PaymentSuccess from "./pages/PaymentSuccess";
import Section from "./pages/Section";
import Search from "./pages/Search";
import Profile from "./pages/Profile";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:productId" element={<Product />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/section/:sectionType" element={<Section />} />
                <Route path="/search/:query" element={<Search />} />
                <Route element={<PrivateRoutesUser />}>
                    <Route path="/payment-success/:sessionId" element={<PaymentSuccess />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/account" element={<Profile />} />
                    <Route path="/profile/orders" element={<Profile />} />
                </Route>
                <Route element={<PrivateRoutesAdmin />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/dashboard/new-product" element={<AdminDashboard />} />
                    <Route path="/admin/dashboard/manage-products" element={<AdminDashboard />} />
                    <Route path="/admin/dashboard/new-category" element={<AdminDashboard />} />
                    <Route path="/admin/dashboard/manage-categories" element={<AdminDashboard />} />
                    <Route path="/admin/dashboard/users" element={<AdminDashboard />} />
                    <Route path="/admin/dashboard/orders" element={<AdminDashboard />} />
                </Route>
                <Route element={<PrivateRoutesAuth />}>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                </Route>
            </Routes>
            <Toaster
                toastOptions={{
                    style: {
                        fontSize: "1.4rem"
                    }
                }}
            />
        </Router>
    );
}

export default App;