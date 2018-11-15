import React, {Component} from 'react';
import Loading from '../../components/Loading/Loading';
import {Card, Button, CardTitle, CardText, Row, Col, FormGroup, Alert} from 'reactstrap';

import SearchBox from '../../components/SearchBox/SearchBox';

import base from '../../paths';

import LoadingBall from '../../../public/img/loading_ball.gif';

class Funciones extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alert: false,
            alert_type: 'danger',
            alert_msg: null,
            peliculas: [],
            pelicula: null,
            complejos: [],
            complejo: null
        };

        this.loadComplejos = this.loadComplejos.bind(this);
    }

    loadComplejos() {
        var {pelicula} = this.state;
        fetch(base.path.get_cines_funciones, {
            method: 'POST',
            headers: base.default_headers,
            body: JSON.stringify({
                pelicula
            })
        }).then(response => {
            return response.json()
        }).then(data => {
            this.setState({
                complejos: data
            });
        });
    }

    loadPeliculas() {
        var {complejo} = this.state;
        fetch(base.path.get_peliculas_funciones, {
            method: 'POST',
            headers: base.default_headers,
            body: JSON.stringify({
                complejo
            })
        }).then(response => {
            return response.json()
        }).then(data => {
            this.setState({
                peliculas: data
            });
        });
    }

    sendComplejo() {
        this.setState({
            peliculas: [],
            pelicula: null
        });
        this.loadPeliculas();
    }

    sendPelicula() {
        if(this.state.complejo == null) {
            this.setState({
                complejos: [],
                complejo: null
            });
            this.loadComplejos();
        }
    }

    componentWillMount() {
        this.loadComplejos();
        this.loadPeliculas();
    }

    render() {

        return (
            <Row>
                <Col sm="6">
                    <Card body>
                        <CardTitle>Complejos</CardTitle>
                        {//todo COMPLEJOS NO SE LIMPIAN Y ACTUALIZAN
                        }
                        <CardText>
                            {this.state.complejos.length > 0 ?
                                <SearchBox
                                    placeHolder="Busque ó elija un complejo..."
                                    dataList={this.state.complejos}
                                    onSelect={(text, value) => {
                                        this.setState({
                                            complejo: value
                                        }, () => {
                                            this.sendComplejo();
                                        });
                                    }}
                                />
                                : <div>
                                    <img src={LoadingBall} width={32}/>  Cargando complejos...
                                </div>
                            }
                        </CardText>
                    </Card>
                </Col>
                <Col sm="6">
                    <Card body>
                        <CardTitle>Películas</CardTitle>
                        <CardText>
                            {this.state.peliculas.length > 0 ?
                            <SearchBox
                                placeHolder="Busque ó elija una función..."
                                dataList={this.state.peliculas}
                                onSelect={(text, value) => {
                                    this.setState({
                                        pelicula: value
                                    }, () => {
                                        this.sendPelicula();
                                    });
                                }}
                            />
                                : <div>
                                    <img src={LoadingBall} width={32}/>  Cargando películas...
                                </div>
                            }
                        </CardText>
                    </Card>
                </Col>
            </Row>
        );
    }
}

export default Funciones;