import { useState, useEffect } from "react";
import { Form, Button, Card, Spinner, Toast, ToastContainer } from "react-bootstrap";


const ProductForm = ({ onProductAdded, onProductUpdated, onClose, product  }) => {
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
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "", 
                description: product.description || "",
                price: product.price || "",
                quantity: product.quantity || "",
                category: product.category || "",
                imageUrl: product.imageUrl || "",
            });
        }
    }, [product]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = product
                ? `${BASE_URL}/products/${product.id}.json`
                : `${BASE_URL}/products.json`;

            const method = product ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to save product");

            setToast({
                show: true,
                variant: "success",
                message: product ? "✅ Product updated successfully!" : "✅ Product added successfully!",
                textColor: "text-white",
            });

            if (product && onProductUpdated) onProductUpdated();
            else if (onProductAdded) onProductAdded();

            if (onClose) onClose();

            if (!product) {
                setFormData({
                    name: "",
                    price: "",
                    category: "",
                    quantity: "",
                    description: "",
                    imageUrl: "",
                });
            }
        } catch (error) {
            setToast({
                show: true,
                variant: "danger",
                message: error.message || "Failed to save product",
                textColor: "text-white",
            });
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <>
            <ToastContainer position="top-end" className="mt-1">
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
            <h5 className="mb-3 text-center" >{product ? "Edit Product" : "Add New Product"}</h5>
            <div className="d-flex justify-content-center">
            <Card className="p-4 shadow-sm mb-4 " style={{width:"700px"}}>
                
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
                            <option value="chairs">Chairs</option>
                            <option value="sofas">Sofas</option>
                            <option value="beds">Beds</option>
                            <option value="wardrobes">Wardrobes</option>
                            <option value="benches/tables">Benches/Tables</option>

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

                    <Button variant="primary" type="submit" className="w-100"disabled={loading}>
                        {loading ? (<Spinner animation="border" size="sm" />) 
                        : product ? ( "Update Product") : ("Add Product")}
                    </Button>
                </Form>
            </Card>
            </div>
        </>)
}

export default ProductForm;