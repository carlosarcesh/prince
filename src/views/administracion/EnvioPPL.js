/**
 * Created by Carlos Arce Sherader on 22/02/2018.
 */
import React, {Component} from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter, Button, Alert, Collapse} from 'reactstrap';

import Loading from '../../components/Loading/Loading';
import apis from '../../general/apis';
import base from '../../paths';

import classnames from 'classnames';

import moment from 'moment';
import 'moment/src/locale/es';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

class Roles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            alert: false,
            alert_type: 'danger',
            alert_msg: null,
            complejos_data: [],
            collapseCom: false,
            collapseFull: false,
            complejo: null,
            fechaEnvio: moment(),
            fechaEnviofull: moment(),
        };

        this.cambiarFecha = this.cambiarFecha.bind(this);
        this.cambiarFechafull = this.cambiarFechafull.bind(this);
        this.onDismissAlert = this.onDismissAlert.bind(this);
        this.toggleCom = this.toggleCom.bind(this);
        this.toggleFull = this.toggleFull.bind(this);
    
    }

    cambiarFecha(date) {
        this.setState({
            fechaEnvio: date
        });
    }

    cambiarFechafull(date) {
        this.setState({
            fechaEnviofull: date
        });
    }

    toggleCom() {
        this.setState({ 
            collapseCom: !this.state.collapseCom,
            collapseFull: false 
        });
    }

    toggleFull() {
        this.setState({ 
            collapseFull: !this.state.collapseFull,
            collapseCom: false,
            complejo: null 
        });
    }

    onDismissAlert() {
        this.setState({
            alert: false
        });
    }

    componentWillMount() {
        apis.lista_complejos((response, err) => {
            if (err) {
                this.setState({
                    alert: true,
                    alert_type: 'danger',
                    alert_msg: err.message
                });
                return console.log(err)
            }

            this.setState({
                complejos_data: response
            });
        });
    }

    enviarComplejo(full){

        console.log('envioComplejo'+ this.state.complejo);

        var _complejo = this.state.complejo;
        var _fechaEnvio = (full == true ?  this.state.fechaEnviofull : this.state.fechaEnvio);

        console.log('fechaComplejo'+ _fechaEnvio);

        this.setState({
            loading: true
        });

        fetch(base.path.generar_boletas, {
            method: 'POST',
            headers: base.default_headers,
            body: JSON.stringify({
                complejo: _complejo,
                fecha: _fechaEnvio.format('DD/MM/YYYY') 
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            if (data.status == 'error') {
                this.setState({
                    alert: true,
                    alert_type: 'danger',
                    alert_msg: data.message
                });
            } else {
                this.setState({
                    alert: true,
                    alert_type: 'success',
                    alert_msg: 'El proceso se realizó correctamente'
                });
            }

            this.setState({
                loading: false
            });
        }).catch(err => {
            this.setState({
                alert: true,
                alert_type: 'danger',
                alert_msg: err
            });

            this.setState({
                loading: false
            });
        });
    }

    enviarFull(){
        console.log('enviofull');
        var full = true;
        this.enviarComplejo(full);
    }

    render() {
        return (
            <div className="animated fadeIn">
                <Loading show={this.state.loading}/>
                <div className="card">
                    <div className="card-header">
                        Envio a Paperless
                    </div>
                    <div className="card-body">
                        <Alert color={this.state.alert_type} isOpen={this.state.alert} toggle={this.onDismissAlert}>
                            {this.state.alert_msg}
                        </Alert>
                        <div className="row"> 
                            <div className="col-sm-2 center">
                            </div>
                            <div className="col-sm-4 center">
                                <button type="button" className="btn btn-primary"
                                    onClick={this.toggleCom}
                                >
                                Seleccionar Complejos
                                </button>{'  '}
                            </div>
                            <div className="col-sm-4 center">
                                <button type="button" className="btn btn-primary"
                                    onClick={this.toggleFull}
                                >
                                Enviar a Todos
                                </button>
                            </div>
                            <div className="col-sm-2 center">
                            </div>
                        </div>
                        
                        <hr/>
                            
                                <Collapse isOpen={this.state.collapseCom}>
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <div className="form-group row">
                                                <label htmlFor="inputComplejo"
                                                    className="col-sm-4 col-form-label"><span
                                                    className="text-red">*</span> Complejo</label>
                                                <div className="col-sm-8">
                                                    <select className="form-control" id="inputComplejo" onChange={(e) => {
                                                        this.setState({complejo: e.target.value})
                                                    }}>
                                                        <option value="">Seleccionar</option>
                                                        <option value="">Todos</option>
                                                        {
                                                            this.state.complejos_data.map((param, i) =>
                                                                <option
                                                                    value={param.cod_Cine} key={i}>
                                                                    {param.desc_Cine}
                                                                </option>
                                                            )
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="form-group row">
                                                <label htmlFor="inputFecha"
                                                    className="col-sm-3 col-form-label"><span
                                                    className="text-red">*</span> Fecha</label>
                                                <div className="col-sm-9">
                                                    <DatePicker selected={this.state.fechaEnvio} onChange={this.cambiarFecha}
                                                    locale="es"
                                                    dateFormat="DD/MM/YYYY"
                                                    className="form-control" id="inputFecha" readOnly={true}
                                                    />
                                                    <label htmlFor="inputFecha" className="label-datepicker">
                                                        <i className="fa fa-calendar" aria-hidden="true"></i>
                                                    </label>
                                                </div>
                                            </div>         
                                        </div>
                                        <div className="col-sm-2">
                                            <button type="button" className="btn btn-success"
                                                onClick={this.enviarComplejo.bind(this)}
                                            >
                                            Enviar&nbsp;&nbsp;<i className="fa fa-hand-o-right" aria-hidden="true"></i>
                                            </button>        
                                        </div>
                                    </div>
                                </Collapse>
                                <Collapse isOpen={this.state.collapseFull}>
                                    <div className="row">
                                    <div className="col-sm-4">
                                            <div className="form-group row">
                                                <label htmlFor="inputFechaFull"
                                                    className="col-sm-3 col-form-label"><span
                                                    className="text-red">*</span> Fecha</label>
                                                <div className="col-sm-9">
                                                    <DatePicker selected={this.state.fechaEnviofull} onChange={this.cambiarFechafull}
                                                    locale="es"
                                                    dateFormat="DD/MM/YYYY"
                                                    className="form-control" id="inputFechaFull" readOnly={true}
                                                    />
                                                    <label htmlFor="inputFechaFull" className="label-datepicker">
                                                        <i className="fa fa-calendar" aria-hidden="true"></i>
                                                    </label>
                                                </div>
                                            </div>         
                                        </div>
                                        <div className="col-sm-2">
                                            <button type="button" className="btn btn-success"
                                                onClick={this.enviarFull.bind(this)}
                                            >
                                            Enviar&nbsp;&nbsp;<i className="fa fa-send-o" aria-hidden="true"></i>
                                            </button>        
                                        </div>
                                    </div>
                                </Collapse>
                                <div>
                                </div>
                            
                            
                    </div>
                </div>
            </div>
        )
    }
}

export default Roles;