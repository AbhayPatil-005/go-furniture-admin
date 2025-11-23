import { useState, useEffect } from "react";
import { Table, Button, Spinner, Toast, ToastContainer, Form } from "react-bootstrap";



const OrdersPage = () => {
    const BASE_URL = import.meta.env.VITE_FIREBASE_BASE_URL;
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, variant: "", message: "", textColor: "" });

    const fetchOrders = async (flagLoading = true) => {
        setLoading(flagLoading);
        try {
            const res = await fetch(`${BASE_URL}/orders.json`);
            const data = await res.json();
            if (!data) {
                setOrders([]);
                return;
            }
            const allOrders = [];

            Object.entries(data).forEach(([userEmail, userOrders])=>{
                if(userOrders?.newOrders){
                    Object.entries(userOrders.newOrders).forEach(([orderId, orderData])=>{
                        allOrders.push({
                            id:orderId,
                            userEmail,
                            ...orderData
                        });
                    });
                }
            });
            console.log(allOrders);
            setOrders(allOrders.reverse());

        } catch (error) {
            setToast({
                show: true,
                message: "Failed to load orders",
                variant: "danger",
                textColor: "text-white",
            })
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, [])

    const handleStatusChange = async (id, userEmail,  newStatus) => {
        const safeEmail = userEmail.replace(/\./g, ",");
        try {
            console.log(id, userEmail, newStatus)
            await fetch(`${BASE_URL}/orders/${safeEmail}/newOrders/${id}.json`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            setToast({
                show: true,
                variant: "success",
                message: `Order marked as ${newStatus}`,
                textColor: "text-white",
            });

            // refresh list
            fetchOrders(false);
        } catch (error) {
            setToast({
                show: true,
                variant: "danger",
                message: "Failed to update order status.",
                textColor: "text-white",
            });
            console.log(error.message);
        }
    }

    if (loading)
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    return (
        <>
            <ToastContainer position="top-end" className="mt-3">
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

            <h4 className="mb-3 text-center">📦 All Orders</h4>

            {orders.length === 0 ? (
                <p className="text-center text-muted">No orders found.</p>
            ) : (
                <Table bordered hover responsive>
                    <thead className="table-dark text-center">
                        <tr>
                            <th>#</th>
                            <th>User Email</th>
                            <th>Address</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, idx) => (
                            
                            <tr key={order.id}>
                                <td>{idx + 1}</td>
                                <td>{order.userEmail}</td>
                                <td>
                                    {order.address?.street}, {order.address?.city}, {order.address?.pincode}
                                </td>
                                <td>₹{order.totalAmount}/-</td>
                                <td>
                                    <Form.Select
                                        value={order.status || "placed."}
                                        onChange={(e) => handleStatusChange(order.id, order.userEmail, e.target.value)}
                                        size="sm"
                                    >
                                        <option>Placed</option>
                                        <option>Shipped</option>
                                        <option>Delivered</option>
                                        <option>Cancelled</option>
                                    </Form.Select>
                                </td>
                                <td>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={async () => {
                                            
                                            await fetch(`${BASE_URL}orders/${order.userEmail.replace(/\./g, ",")}/newOrders/${order.id}.json`, { method: "DELETE" })
                                            .then((err)=>console.log(err));
                                            fetchOrders();
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20px" height="30px" viewBox="0 0 30 30">
                                            <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z"></path>
                                        </svg> Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    )
}
export default OrdersPage;