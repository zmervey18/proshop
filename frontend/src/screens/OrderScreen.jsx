import { Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Form, Button, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { useEffect } from "react";
import {PayPalButtons, usePayPalScriptReducer} from '@paypal/react-paypal-js'
import { useGetOrderDetailsQuery, usePayOrderMutation, useGetPaypalClientIdQuery, useDeliverOrderMutation } from "../slices/ordersApiSlice";

const OrderScreen = () => {
    const { id: orderId } = useParams();
    const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
    console.log(order);

    const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
    const { userInfo } = useSelector(state => state.auth);
    
    const { data: paypal, isLoading: loadingPayPal, error: errorPayPal} = useGetPaypalClientIdQuery();
    
    useEffect(() => {
        if (!loadingPayPal && !errorPayPal && paypal.clientId) {
            const loadPayPalScript = async () => {
                paypalDispatch({
                    type: "resetOptions",
                    value: {
                        "client-id": paypal.clientId,
                        currency: 'USD'
                    }
                });
                paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
            }
            if (order && !order.isPaid) {
                if (!window.paypal) {
                    loadPayPalScript();
                }
            }
        }
    }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal])
    
    async function onApproveTest() { 
        await payOrder({ orderId, details:{payer:{}} });
                refetch();
        toast.success('Order is paid');
    };

    function onApprove(data, actions) { 
        return actions.order.capture().then(async function(details) {
            try {
                await payOrder({ orderId, details });
                refetch();
                toast.success('Order is paid')
            } catch(err) {
                toast.error(err?.data?.message || err.error);
            }
        });
    }

    function createOrder(data, actions) {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: order.totalPrice,
                    }
                }
            ],
        })
            .then((orderId) => {
                return orderId;
            });
    }
    
    function onError(err) {
        toast.error(error.message);
    }

    const deliverOrderHandler = async () => {

            await deliverOrder(orderId);
            //refethces and updates the page and delivery details
            refetch();
            toast.success('Order delivered');
    }

    return isLoading ? <Loader /> : error ? <Message variant="danger"></Message>
        : (
            <>
                <h1>Order {order._id}</h1>
                <Row>
                    <Col md={8}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>Shipping</h2>
                                <p>
                                    <strong>Name: </strong>{order.user.name}
                                </p>
                                <p>
                                    <strong>Email: </strong>{order.user.email}
                                </p>
                                <p>
                                    <strong>Address: </strong>
                                    {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                                    {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                                </p>
                                {order.isDelivered ? (
                                    <Message variant="success">Delivered on {order.deliveredAt }</Message>
                                ) : (
                                        <Message variant="danger">Not Delivered</Message>
                                )}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <h2>Payment Method</h2>
                                <p>
                                    <strong>Method: </strong>
                                    {order.paymentMethod}
                                </p>
                                {order.isPaid ? (
                                    <Message variant="success">Order paid on {order.paidAt}</Message>
                                ) : (
                                        <Message variant="danger">Order has not been paid</Message>
                                )}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <h2>Order Items</h2>
                                {order.orderItems.length === 0 ? (
                                    <Message>Order is empty</Message>
                                ) : (
                                        <ListGroup variant="flush">
                                            {order.orderItems.map((item, index) => (
                                                <ListGroup.Item key={index}>
                                                    <Row>
                                                        <Col md={1}>
                                                            <Image
                                                                src={item.image}
                                                                alt={item.name}
                                                                fluid
                                                                rounded
                                                            />
                                                        </Col>
                                                        <Col>
                                                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                        </Col>
                                                        <Col md={4}>
                                                            {item.qty} x {item.price} = ${item.qty * item.price}
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                )}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h2>Order Summary</h2>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Items</Col>
                                        <Col>${order.itemsPrice}</Col>
                                    </Row>
                                    <Row>
                                        <Col>Shipping</Col>
                                        <Col>${order.shippingPrice}</Col>
                                    </Row>
                                    <Row>
                                        <Col>Tax</Col>
                                        <Col>${order.taxPrice}</Col>
                                    </Row>
                                    <Row>
                                        <Col>Total</Col>
                                        <Col>${order.totalPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                    {!order.isPaid && (
                                        <ListGroup.Item>
                                        {loadingPay && <Loader />}
                                        
                                        {isPending ? <Loader /> : (
                                            <>
                                                {/* <div>
                                                    <Button onClick={onApproveTest} style={{marginBottom : '10px'}}>Test Pay Order</Button>
                                                </div> */}
                                                <div>
                                                    <PayPalButtons
                                                        style={{ layout: "vertical" }}
                                                        createOrder={createOrder}
                                                        onApprove={onApprove}
                                                        onError={onError}
                                                    ></PayPalButtons>
                                                </div>
                                            </>
                                        )}
                                        </ListGroup.Item>
                                    ) }
                                {/* Mark as delivered placeholder for admin*/}
                                {loadingDeliver && <Loader />}
                                {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                    <ListGroup.Item>
                                        <Button type="button" className="btn btn-block" onClick={deliverOrderHandler}>Mark As Delivered</Button>
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </>
        )
}


export default OrderScreen
