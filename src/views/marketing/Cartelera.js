/**
 * Created by Carlos Arce Sherader on 25/01/2018.
 */
import React, {Component} from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter, Button, Alert} from 'reactstrap';
import {AsyncTypeahead} from 'react-bootstrap-typeahead';
import DropzoneComponent from 'react-dropzone-component';
import ReactImg from 'react-image';

import Loading from '../../components/Loading/Loading';
import base from '../../paths';
import functions from '../../utils/functions';

import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-dropzone-component/styles/filepicker.css';
import 'dropzone/dist/min/dropzone.min.css';

class Cartelera extends Component {
    constructor(props) {
        super(props);

        this.state = {
            files: [],
            isLoading: false,
            loading: false,
            options: [],
            alert: false,
            alert_type: 'danger',
            alert_msg: null,
            cod_pelicula: null,
            err_msg: null,
            base_img_url: null
        };

        this.onDismissAlert = this.onDismissAlert.bind(this);
        this.showSuccess = this.showSuccess.bind(this);
        this.imgLoader = this.imgLoader.bind(this);
    }

    showSuccess() {
        this.setState({
            alert: true,
            alert_type: 'success',
            alert_msg: '¡La imagen fue subida al servidor con éxito!',
        });
    }

    imgLoader() {
        return(
            <div>
                Cargando vista previa...
            </div>
        );
    }

    onDismissAlert() {
        this.setState({
            alert: false
        });
    }

    componentDidMount() {
        if(functions.getCountry() == 'peru') {
            this.setState({
                base_img_url: "http://shop.cineplanet.com.pe/peliculas/plasma/"
            });
        } else {
            this.setState({
                base_img_url: "http://10.45.100.201/peliculas/plasma/"
            });
        }
    }

    render() {

        var djsConfig = {
            dictDefaultMessage: '¡Arrastra aquí para cargar!',
            dictFallbackMessage: this.state.err_msg,
            addRemoveLinks: true,
            uploadMultiple: false,
            maxFiles: 1,
            params: {
                pelicula_cod: this.state.cod_pelicula
            }
        };

        var componentConfig = {
            iconFiletypes: ['.jpg'],
            showFiletypeIcon: true,
            postUrl: base.path.cartelera_upload,
        };

        var cod_tmp = this.state.cod_pelicula;

        var eventHandlers = {
            processing: () => {
                this.setState({
                    loading: true,
                    cod_pelicula: null,
                    alert: true,
                    alert_type: 'success',
                    alert_msg: '¡Imagen cargada con éxito!'
                });
            },
            success: () => {
                this.setState({
                    loading: false,
                    cod_pelicula: cod_tmp,
                    alert: true,
                    alert_type: 'success',
                    alert_msg: '¡Imagen cargada con éxito!'
                });
            },
            error: (result, err) => {
                this.setState({
                    loading: false,
                    cod_pelicula: cod_tmp,
                    alert: true,
                    alert_type: 'danger',
                    alert_msg: err.message,
                    err_msg: err.message
                });
            },
            removedfile: () => {
                this.setState({
                    alert: false
                });
            }
        };

        return (
            <div className="animated fadeIn">
                <Loading show={this.state.loading}/>
                <div className="card">
                    <div className="card-header">
                        Subir Imagen Cartelera
                    </div>
                    <div className="card-body">
                        <Alert color={this.state.alert_type} isOpen={this.state.alert} toggle={this.onDismissAlert}>
                            {this.state.alert_msg}
                        </Alert>

                        <div className="row">
                            <div className="col-lg-6">
                                <form>
                                    <div className="form-group">
                                        <span className="text-red"><b>Paso 1:</b></span> <label htmlFor="inputPelicula">Buscar
                                        Película</label>
                                        <AsyncTypeahead
                                            isLoading={this.state.isLoading}
                                            onSearch={query => {
                                                this.setState({isLoading: true});
                                                fetch(base.path.get_peliculas_cartelera, {
                                                    method: 'POST',
                                                    headers: base.default_headers,
                                                    body: JSON.stringify({
                                                        pelicula: query
                                                    })
                                                })
                                                    .then(resp => resp.json())
                                                    .then(json => this.setState({
                                                            isLoading: false,
                                                            options: json,
                                                        })
                                                    );
                                            }}
                                            onChange={(selected) => {
                                                if (selected.length > 0) {
                                                    this.setState({
                                                        cod_pelicula: selected[0].cod_pelicula,
                                                        alert: false
                                                    });
                                                } else {
                                                    this.setState({
                                                        cod_pelicula: null,
                                                        alert: false
                                                    });
                                                }
                                            }}
                                            options={this.state.options}
                                            labelKey="desc_pelicula"
                                            valueKey="cod_pelicula"
                                            placeholder="Título de la película..."
                                            emptyLabel="No se encontró la película."
                                            searchText="Buscando..."
                                            promptText="Escribe para buscar..."
                                            minLength={3}
                                            clearButton={true}
                                        />
                                    </div>
                                </form>
                                {this.state.cod_pelicula}
                                {this.state.cod_pelicula &&
                                <div className="row text-center">
                                    <ReactImg
                                        src={this.state.base_img_url + this.state.cod_pelicula + ".JPG?cache=" + new Date().getTime()}
                                        className="img-thumbnail img-prev" loader={<div className="mx-auto d-block text-red">Cargando vista previa...</div>}/>
                                </div>
                                }
                            </div>
                            <div className="col-lg-6">
                                {this.state.cod_pelicula &&
                                <div>
                                    <span className="text-red"><b>Paso 2:</b></span> <label htmlFor="file">
                                    <span className="text-red">*</span> Seleccionar o
                                    arrastrar imagen.</label>
                                    <DropzoneComponent config={componentConfig} eventHandlers={eventHandlers}
                                                       djsConfig={djsConfig}/>
                                    <small>
                                        <i>
                                            <span className="text-red">*</span> Formato JPG obligatorio.
                                        </i>
                                    </small>
                                </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Cartelera;
