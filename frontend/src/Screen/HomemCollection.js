import React from "react";

import {useEffect, useReducer} from "react";
import logger from "use-reducer-logger";
import axios from "axios";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Product from "../components/Product";
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true};
        case 'FETCH_SUCESS':
            return {...state, products: action.payload ,loading: false};
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload};
        default:
            return state
    }
}

function HomemCollection(){
    const [{loading, error, products}, dispatch] = useReducer(logger(reducer), {
        products: [],
        loading: true,
        error:'',
    });
    // const [products, setProducts] = useState([]);
    useEffect(()=>{
        const fetchData = async () => {
            dispatch({type: 'FETCH_REQUEST'});
            try {
                const result = await axios.get(`/api/products/category/HOMEM`);
                dispatch({type: 'FETCH_SUCESS', payload: result.data});
            }catch (err){
                dispatch({type: 'FETCH_FAIL', payload: err.message});
            }
        }
        fetchData();
    }, []);


    return(
        loading? <div>Carregando...</div>
            :error? <div>{error}</div> :

             <div>
      <Helmet>
        <title>Relógios</title>
      </Helmet>
                 <div class="padrao">
                     <h1>Produtos</h1>
                 </div>
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product}/>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
    );
}
export default HomemCollection;