import { useEffect, useState } from "react";
import { Table, Button, Spinner, Toast, ToastContainer, Badge, Modal } from "react-bootstrap";
import ProductForm from "./ProductForm";

const ProductList = () => {
    const BASE_URL = import.meta.env.VITE_FIREBASE_BASE_URL;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({
        show: false, variant: "", message: ""
    });

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchProducts = async (flag=false) => {
        setLoading(flag);
        try {
            const res = await fetch(`${BASE_URL}/products.json`);
            const data = await res.json();
            if (data) {
                const formatted = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }));
                setProducts(formatted.reverse());
            } else setProducts([]);
        } catch (error) {
            setToast({ show: true, variant: "danger", message: "Failed to load products!" });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`${BASE_URL}/products/${id}.json`, { method: "DELETE" });
            setToast({ show: true, variant: "success", message: "Product deleted successfully" });
            fetchProducts(false);
        } catch (error) {
            setToast({ show: true, variant: "danger", message: "Failed to delete product!" });
        }
    };

    const handleUpdate = async (id, updatedData) => {
        try {
            await fetch(`${BASE_URL}/products/${id}.json`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });
            setToast({ show: true, variant: "success", message: "Product updated successfully" });
            fetchProducts(false);
        } catch (error) {
            setToast({ show: true, variant: "danger", message: "Failed to update product!" });
        }
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    useEffect(() => {
        fetchProducts(true);
    }, []);

    if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );

    return (<>
        <ToastContainer position="top-end" className="mt-3">
            <Toast
                bg={toast.variant}
                show={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
                delay={3000}
                autohide
            >
                <Toast.Body className="text-white">{toast.message}</Toast.Body>
            </Toast>
        </ToastContainer>
        <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            centered
            backdrop="static"
            style={{ zIndex: 2000 }}
        >
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
                <ProductForm
                    product={selectedProduct}
                    onClose={() => setShowModal(false)}
                    onProductUpdated={fetchProducts}
                />
            </Modal.Body>
        </Modal>
        <div className="p-4">
            <h4 className="mb-4">Product List</h4>
            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <Table striped bordered hover responsive>
                    <thead className="table-dark text-center">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price (₹)</th>
                            <th>Quantity</th>
                            <th>Status</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="align-middle text-center">
                        {products.map((p, i) => (
                            <tr key={p.id}>
                                <td>{i + 1}</td>
                                <td>{p.name}</td>
                                <td>{p.category}</td>
                                <td>{p.price}</td>
                                <td>{p.quantity}</td>
                                <td>
                                    {p.quantity > 0 ? (
                                        <Badge bg="success">In Stock</Badge>
                                    ) : (
                                        <Badge bg="danger">Out of Stock</Badge>
                                    )}
                                </td>
                                <td style={{ maxWidth: "180px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                                    {p.description}
                                </td>
                                <td>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        className="me-2"
                                        onClick={() =>
                                            handleUpdate(p.id, { quantity: Number(p.quantity) + 1 })
                                        }
                                    >
                                        +Qty
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleDelete(p.id)}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleEdit(p)}
                                    >
                                        Edit
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    </>)
}

export default ProductList;