import { useState } from "react";
import { Form, Button, Container, Card, Spinner, Toast, ToastContainer } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../reduxStore/authSlice";
import DashboardHeader from "../components/layouts/DashboardHeader";

const AdminLogin = () => {
    
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "", })
    const [toast, setToast] = useState({ show: false, message: "", variant: "", textColor: "" })

    const errorMap = {
        INVALID_LOGIN_CREDENTIALS: "You have either entered wrong email or wrong password",
        EMAIL_NOT_FOUND: "Email not registered.",
        INVALID_PASSWORD: "Wrong password. Try again.",
        INVALID_EMAIL: "Wrong email. Try again.",
        USER_DISABLED: "This account has been disabled.",
    }
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const API_KEY = import.meta.env.VITE_FIREBASE_AUTH_API_KEY;
    const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

    const handleSubmitEvent = async (e) => {
        e.preventDefault();
        if(formData.email !== ADMIN_EMAIL){
            setToast({ show: true, variant: "danger", message: "Only admin has access", textColor: "text-white" });
            return;
        }
        setLoading(true);

        try {
            const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
                method: "POST",
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    returnSecureToken: true,
                })
            });
            const data = await res.json();

            if (!res.ok) {
                const readError = errorMap[data.error?.message] || "Failed to login, please try again later"
                setToast({
                    show: true, variant: "danger", message: readError, textColor: "text-white",
                })
                throw new Error(data.error.message || "Authentication failed")
            }

            dispatch(login({ token: data.idToken, userId: data.localId, adminEmail: data.email }))
            setToast({
                show: true,
                variant: "success",
                message: "Login successful!",
                textColor: "text-white",
            });
            setTimeout(()=>navigate("/home"),1000);

        } catch (error) {
            console.log(error)
            const readError = errorMap[error?.message] || "Failed to login, please try again later"
            setToast({
                show: true, variant: "danger", message: readError, textColor: "text-white",
            })
        }
        finally {
            setLoading(false)
        };
    }

    return (
        <>
            <ToastContainer position="top-end" className="mt-5">
                <Toast
                    className="text-center"
                    bg={toast.variant}
                    show={toast.show}
                    onClose={() => setToast({ ...toast, show: false })}
                    delay={3000}
                    autohide
                >
                    <Toast.Body className={toast.textColor}>{toast.message}</Toast.Body>
                </Toast>
            </ToastContainer>
            <DashboardHeader />
            <Container
                fluid
                className="d-flex flex-column align-items-center vh-100 w-100 m-0"
                style={{ backgroundColor: "#e8f3ffff" }}
            >   
                <div className=" mt-5">
                <h3 className="text-center mb-4 fw-semibold text-dark">
                    Welcome Back, please Login!
                </h3>

                <Card className="shadow-sm p-0 border-0" style={{ width: "360px" }}>
                    <h4 className="text-center mb-4 fw-bold bg-dark text-white mx-0 p-3 rounded-top">Admin Login</h4>

                    <Form onSubmit={handleSubmitEvent} className="text-start p-4 pt-0 ">
                        <Form.Group controlId="email" className="mb-3">
                            <Form.Label>Admin email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                required
                                disabled={loading}
                            />
                        </Form.Group>

                        <Form.Group controlId="password" className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                required
                                disabled={loading}
                            />
                        </Form.Group>

                        <Button
                            variant="success"
                            type="submit"
                            className="w-100 mt-2 fw-semibold"
                            disabled={loading}
                        >
                            {loading ? (
                                <Spinner animation="border" size="sm" />) : ("Login")
                            }
                        </Button>
                    </Form>
                </Card>
                </div>
            </Container>
        </>
    )
}

export default AdminLogin;