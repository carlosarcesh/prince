import React, {Component} from 'react';

import CardWrap from "../../components/Container/CardWrap";
import moment from "moment";
import DatePicker from "react-datepicker/es";
import {Modal, ModalBody} from "reactstrap";
import ConsultaClientes from "./ConsultaClientes";

class ConsultaLineaCredito extends Component {
    constructor(props) {
        super(props);

        this.state = {
            alert: false,
            alert_type: 'danger',
            alert_msg: null,
            loading: false,
            fecha_ini: moment().subtract(1, 'days'),
            fecha_fin: moment(),
            nombre_cliente: null,
            cliente: null,
            modalClientes: false
        };
        this.toggleClientes = this.toggleClientes.bind(this);
        this.setParamsFromModalCliente = this.setParamsFromModalCliente.bind(this);
    }

    toggleClientes() {
        this.setState({
            modalClientes: !this.state.modalClientes
        });
    }

    setParamsFromModalCliente(cliente, nombre_cliente) {
        this.setState({
            cliente,
            nombre_cliente
        }, () => {
            this.toggleClientes();
        });
    }

    wrapForm() {
        return (
            <div>
                {/*<div className="row">
                    <div className="col-sm-4">
                        <div className="form-group row">
                            <label htmlFor="inputFechaIni" className="col-sm-4 col-form-label">Fecha Inicio</label>
                            <div className="col-sm-8">
                                <DatePicker selected={this.state.fecha_ini} onChange={date => this.setState({fecha_ini: date})}
                                            locale="es"
                                            peekNextMonth
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            dateFormat="DD/MM/YYYY"
                                            className="form-control" id="inputFechaIni" readOnly={true}/>
                                <label htmlFor="inputFechaIni" className="label-datepicker"><i
                                    className="fa fa-calendar" aria-hidden="true"></i></label>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="form-group row">
                            <label htmlFor="inputFechaFin" className="col-sm-4 col-form-label">Fecha Fin</label>
                            <div className="col-sm-8">
                                <DatePicker selected={this.state.fecha_fin} onChange={date => this.setState({fecha_fin: date})}
                                            minDate={this.state.fecha_ini}
                                            peekNextMonth
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            dateFormat="DD/MM/YYYY"
                                            className="form-control" id="inputFechaFin" readOnly={true}/>
                                <label htmlFor="inputFechaFin" className="label-datepicker"><i
                                    className="fa fa-calendar" aria-hidden="true"></i></label>
                            </div>
                        </div>
                    </div>
                </div>*/}
                <div className="row">
                    <div className="col-sm-6">
                        <div className="form-group row">
                            <label htmlFor="inputCliente" className="col-sm-3 col-form-label">Cliente</label>
                            <div className="col-sm-9">
                                <input type="text" id="inputCliente" value={this.state.nombre_cliente} className="form-control col-lg-10 float-left bg-white" disabled={true}/>
                                <button className="btn2 btn-primary float-left" onClick={this.toggleClientes}><i className="fa fa-search" aria-hidden="true"></i></button>{' '}
                                {this.state.cliente && <button className="btn2 btn-default float-left"
                                                               onClick={() => {
                                                                   this.setState({
                                                                       cliente: null,
                                                                       nombre_cliente: null
                                                                   }, () => {
                                                                       document.getElementById("inputCliente").value = '';
                                                                   });
                                                               }}>X</button>}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 text-right">
                        <button className="btn btn-primary">
                            Buscar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    modals(){
        return(
            <div>
                {/* MODAL: CLIENT SELECTION */}
                <Modal isOpen={this.state.modalClientes} toggle={this.toggleClientes} className="modal-lg">
                    <ModalBody>
                        <ConsultaClientes toggle={this.toggleClientes} paramsCliente={this.setParamsFromModalCliente}/>
                    </ModalBody>
                </Modal>
            </div>
        );
    }

    render() {
        return (<CardWrap
            title="Consulta de Línea de Crédito"
            alert={this.state.alert}
            alertType={this.state.alert_type}
            alertMsg={this.state.alert_msg}
            loading={this.state.loading}
        >
            {this.wrapForm()}
            {this.modals()}
        </CardWrap>);
    }
}

export default ConsultaLineaCredito;
