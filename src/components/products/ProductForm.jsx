import { useState } from "react";
import { Form, Button, Card, Spinner, Toast, ToastContainer } from "react-bootstrap";

const ProductForm = ({ onProductAdded }) => {
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", variant: "", textColor: "" });
    const BASE_URL = import.meta.env.VITE_FIREBASE_BASE_URL;

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: "",
        quantity: "",
        description: "",
        imageUrl: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/products.json`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to add product");
            setToast({
                show: true,
                variant: "success",
                message: "✅ Product added successfully!",
                textColor: "text-white",
            });

            setFormData({
                name: "",
                price: "",
                category: "",
                quantity: "",
                description: "",
                imageUrl: "",
            });
            if (onProductAdded) onProductAdded(); 
        } catch (error) {
            setToast({
                show: true,
                variant: "danger",
                message: error.message || "Failed to add product",
                textColor: "text-white",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer position="top-right" className="mt-3">
                <Toast
                    bg={toast.variant}
                    show={toast.show}
                    onClose={() => setToast({ ...toast, show: false })}
                    delay={3000}
                    autohide
                >
                    <Toast.Body className={toast.textColor}>{toast.message}</Toast.Body>
                </Toast>
            </ToastContainer>

            <Card className="p-4 shadow-sm mb-4">
                <h5 className="mb-3">Add New Product</h5>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                        >
                            <option value="">Select category</option>
                            <option value="1-door-wardrobe">1 Door Wardrobe</option>
                            <option value="2-door-wardrobe">2 Door Wardrobe</option>
                            <option value="sliding-wardrobe">Sliding Wardrobe</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Price (₹)</Form.Label>
                        <Form.Control
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control
                            type="number"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Image URL</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : "Add Product"}
                    </Button>
                </Form>
            </Card>
        </>)
}

export default ProductForm;