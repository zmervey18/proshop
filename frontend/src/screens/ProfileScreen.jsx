import { useState, useEffect } from "react";
import { Table, Form, Button, Row, Col, FormGroup, FormLabel } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useProfileMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import { useGetMyOrdersQuery } from "../slices/ordersApiSlice";
import { FaTimes } from "react-icons/fa";

const ProfileScreen = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);
    const [updateProfile, {isLoading:loadingUpdateProfile}] = useProfileMutation();
    const { data: orders, isLoading, error } = useGetMyOrdersQuery();
    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name);
            setEmail(userInfo.email);
        }
    }, [userInfo.name, userInfo.email, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
        } else {
            try {
                const res = await updateProfile({ _id: userInfo._id, name, email, password }).unwrap();
                dispatch(setCredentials(res));
                toast.success('Profile updated successfully');
            } catch(err){
                toast.error(err?.data?.message || err?.error);
            }
        }
    }

    return (
        <Row>
            <Col md={3}>
                <h2>User Profile</h2>
                <Form onSubmit={submitHandler}>
                    <FormGroup controlId="name" className="my-2">
                        <FormLabel>Name</FormLabel>
                        <Form.Control
                            type="name"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                        ></Form.Control>
                    </FormGroup>
                    <FormGroup controlId="email" className="my-2">
                        <FormLabel>Email</FormLabel>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                        ></Form.Control>
                    </FormGroup>
                    <FormGroup controlId="password" className="my-2">
                        <FormLabel>Password</FormLabel>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                        ></Form.Control>
                    </FormGroup>
                    <FormGroup controlId="confirmpassword" className="my-2">
                        <FormLabel>Confirm Password</FormLabel>
                        <Form.Control
                            type="confirm password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e)=>setConfirmPassword(e.target.value)}
                        ></Form.Control>
                    </FormGroup>
                    <Button type="submit" variant="primary" className="my-2">Update</Button>
                    {loadingUpdateProfile && <Loader/>}
                </Form>
            </Col>
            <Col md={9}>
                {isLoading ? (<Loader/>): error ? (<Message variant="danger">
                    {error?.data?.message || error.error}
                </Message>):(
                        <Table striped hover responsive className="table-sm">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Paid</th>
                                    <th>Delivered</th>
                                    <th></th>
                                </tr>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id}>
                                            <td>{order._id}</td>
                                            <td>{order.createdAt?.substring(0,10)}</td>
                                            <td>${order.totalPrice}</td>
                                            <td>
                                                {order.isPaid ? (
                                                order.paidAt?.substring(0,10)
                                                ) : (
                                                        <FaTimes style={{ color:'red' }} />
                                                )}
                                            </td>
                                            <td>
                                                {order.isDelivered ? (
                                                order.deliveredAt?.substring(0,10)
                                                ) : (
                                                        <FaTimes style={{ color:'red' }} />
                                                )}
                                            </td>
                                            <td>
                                                <LinkContainer to={`/orders/${order._id}`}>
                                                    <Button className="btn-sm" variant="light">
                                                        Details
                                                    </Button>
                                                </LinkContainer>
                                            </td>
                                        </tr>
                                    ))}

                                    
                                </tbody>
                            </thead>
                </Table>
                )}
            </Col>
        </Row>
    )
}

export default ProfileScreen
