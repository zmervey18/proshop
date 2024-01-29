import React from 'react'
import {useParams} from "react-router-dom"
import products from "../products"
import { Link } from "react-router-dom"
import { Row, Col, Image, ListGroup, Card, Button } from "react-bootstrap"
import Rating from '../components/Rating'
import axios from 'axios';
import { useEffect, useState } from 'react'
import { useGetProductDetailsQuery } from '../slices/productsApiSlice'

const ProductScreen = () => {
  
  // const [product, setProduct] = useState({})
  // //get the id from url. Destructure anything using params
  //coming from url productId by using useParams
  const { id: productId } = useParams();
  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);
  //   // const product = products.find((p) => p._id === productId )
  // // console.log(product);

  // //If productId changes then we want it to run
  // useEffect(() => {
  //   const fetchProduct = async () => {
  //     const { data }  = await axios.get(`/api/products/${productId}`)
  //     setProduct(data)
  //   }
  //   fetchProduct();
  // },[productId])
  return (
    <>
      <Link className='btn btn-light my-3' to='/'>
        Go Back
      </Link>
      {isLoading ? (<h2>Loading...</h2>) : error ? (<div>{error?.data?.message || error.error }</div>):(
      <Row>
        <Col md={5}>
          <Image src={product.image} alt={product.name} fluid/>
        </Col>
        <Col md={4}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{product.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating value={product.rating} text={`${product.numReviews} reviews`}/>
            </ListGroup.Item>
            <ListGroup.Item>
              Price: ${product.price}
            </ListGroup.Item>
            <ListGroup.Item>
              Description: ${product.description}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>
                    Price:
                  </Col>
                  <Col>
                    <strong>${product.price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
               <ListGroup.Item>
                <Row>
                  <Col>
                  Status:
                </Col>
                <Col>
                  <strong>{product.countInStock > 0 ? 'in stock' : 'out of stock'}</strong>
                  </Col>
                </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button className='btn-block' type='button' disabled={product.countInStock === 0}>Add To Cart</Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
      )}
      
    </>
  )
}

export default ProductScreen;
