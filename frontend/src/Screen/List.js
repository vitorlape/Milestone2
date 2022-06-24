import React from "react";

import {useEffect, useReducer} from "react";
import logger from "use-reducer-logger";
import axios from "axios";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Product from "../components/Product";


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

function List(){
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
                const result = await axios.get('/api/products')
                dispatch({type: 'FETCH_SUCESS', payload: result.data});
            }catch (err){
                dispatch({type: 'FETCH_FAIL', payload: err.message});
            }
        }
        fetchData();
    }, []);


    return(
        loading? <div>Loading...</div>
            :error? <div>{error}</div> :

            <Row>
                <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
                {products.map((product) => (
                    <Col key={product.slug} sm={6} md={4} lg={3} xxl={5} className="mb-2">
                        <Product product={product}/>
                    </Col>
                ))}
                </div>
          </Row>
    );
}
export default List;