import React from 'react'
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { Link, useParams } from 'react-router-dom';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';

const HomeScreen = () => {
    const { pageNumber, keyword} = useParams();
    const { data, isLoading, error } = useGetProductsQuery({ keyword, pageNumber });
    // const [products, setProducts] = useState([]);

    //dependency array empty, runs once when page loads
    // useEffect(() => {
    //     const fetchProducts = async () => {
    //         const { data } = await axios.get('api/products')
    //         setProducts(data)
    //     };
    //     fetchProducts();
    // },[])


  return (
      <>
          {!keyword ? (<ProductCarousel/>) : (<Link to="/" className='btn btn-light mb-4'>Go Back</Link>)}
          {isLoading ? (<Loader/>
          ) : error ? (<Message variant='danger'>{ error?.data?.message || error.error}</Message>): (
                  <>
          <h1>Latest Products</h1>
          <Row>
              {data.products.map((product) => (
                  <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                      <Product product={product} />
                  </Col>
              ))}
                      </Row>
                      <Paginate pages={data.pages} page={data.page} keyword={keyword?keyword:'' } />
              </>
          )}
          
      </>
  )
}

export default HomeScreen


