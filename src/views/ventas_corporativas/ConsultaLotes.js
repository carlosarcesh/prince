import React, {Component} from 'react';
import {Button, Modal, ModalBody} from 'reactstrap';
import base from "../../paths";
import {BootstrapTable, TableHeaderColumn} from "react-bootstrap-table";
import DatePicker from "react-datepicker/es";
import moment from 'moment';
import functions from '../../utils/functions';

import ConsultaClientes from './ConsultaClientes';
import FacturarLote from './FacturarLote';
import CardWrap from "../../components/Container/CardWrap";

class ConsultaLotes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            alert: false,
            alert_type: 'danger',
            alert_msg: null,
            loading: false,
            fecha_ini: moment().subtract(7, 'days'),
            fecha_fin: moment(),
            client_order: null,
            cliente: null,
            nombre_cliente: null,
            lotes: [],
            lote: [],
            modalClientes: false,
            modalFacturar: false,
        };

        this.onDismissAlert = this.onDismissAlert.bind(this);
        this.toggleClientes = this.toggleClientes.bind(this);
        this.toggleFacturar = this.toggleFacturar.bind(this);
        this.getLotes = this.getLotes.bind(this);
        this.setParamsFromModalCliente = this.setParamsFromModalCliente.bind(this);
        this.botonFacturar = this.botonFacturar.bind(this);
        this.mainContent = this.mainContent.bind(this);
    }

    getLotes() {
        this.setState({
            loading: true
        });

        this.onDismissAlert();

        var {
            fecha_ini,
            fecha_fin,
            client_order,
            cliente
        } = this.state;

        fetch(base.path.get_lotes, {
            method: 'POST',
            headers: base.default_headers,
            body: JSON.stringify({
                fecha_ini,
                fecha_fin,
                client_order,
                cliente
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            this.setState({
                lotes: data,
                loading: false
            });
        }).catch(err => {
            console.log(err);

            this.setState({
                loading: false,
                alert: true,
                alert_type: 'danger',
                alert_msg: '¡Error! ' + err
            });
        });
    }

    onDismissAlert() {
        this.setState({
            alert: false
        });
    }

    toggleClientes() {
        this.setState({
            modalClientes: !this.state.modalClientes
        });
    }

    toggleFacturar() {
        this.setState({
            modalFacturar: !this.state.modalFacturar
        });
    }

    setParamsFromModalCliente(cliente, nombre_cliente) {
        console.log(cliente,
            nombre_cliente);
        this.setState({
            cliente,
            nombre_cliente
        }, () => {
            this.toggleClientes();
        });
    }

    botonFacturar(cell, row) {
        return (
            <Button onClick={() => {
                this.setState({
                    lote: row
                }, () => {
                    this.toggleFacturar();
                });
            }}>
                F
            </Button>
        );
    }

    mainContent() {
        moment.locale('es');
        const tbl_options = {
            page: 1,
            sizePerPage: 10,
            pageStartIndex: 1,
            paginationSize: 3,
            prePage: 'Anterior',
            nextPage: 'Siguiente',
            firstPage: 'Primero',
            lastPage: 'Último',
            hideSizePerPage: true,
            paginationPosition: 'both',
            noDataText: 'No se encontraron resultados.'
        };

        return (
            <div>
                <div className="row">
                    <div className="col-sm-4">
                        <div className="form-group row">
                            <label htmlFor="inputFechaIni" className="col-sm-4 col-form-label">Fecha Inicio</label>
                            <div className="col-sm-8">
                                <DatePicker selected={this.state.fecha_ini}
                                            onChange={date => this.setState({fecha_ini: date})}
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
                                <DatePicker selected={this.state.fecha_fin}
                                            onChange={date => this.setState({fecha_fin: date})}
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
                    <div className="col-sm-4">
                        <div className="form-group row">
                            <label htmlFor="inputClientOrder" className="col-sm-4 col-form-label">Lote</label>
                            <div className="col-sm-8">
                                <input type="text" id="inputClientOrder" className="form-control"
                                       onChange={e => this.setState({client_order: e.target.value})}/>
                            </div>
                        </div>
                    </div>
                    {/*<div className="col-sm-6">
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
                    </div>*/}
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <button type="button" className="btn btn-primary pull-right" onClick={this.getLotes}>
                            <i className="fa fa-search" aria-hidden="true"></i> Buscar
                        </button>
                    </div>
                </div>

                <BootstrapTable data={this.state.lotes} striped={true} hover={true} pagination={true}
                                options={tbl_options} version='4'>
                    <TableHeaderColumn width="40" dataAlign="center"
                                       dataFormat={this.botonFacturar}>{''}</TableHeaderColumn>
                    <TableHeaderColumn width="150" dataField="LOTE" isKey={true} dataAlign="center"
                                       dataSort={true}>Lote</TableHeaderColumn>
                    <TableHeaderColumn width="150" dataField="FECHA_EMISION" dataSort={true} dataAlign="center">Fecha
                        Emisión</TableHeaderColumn>
                    <TableHeaderColumn dataField="CLIENTE">Cliente</TableHeaderColumn>
                    <TableHeaderColumn width="150" dataField="COMPROBANTE"
                                       dataSort={true}>Comprobante</TableHeaderColumn>
                    <TableHeaderColumn width="120" dataField="MONTO_TOTAL" dataFormat={functions.priceFormatter}
                                       dataSort={true} dataAlign="right">Monto Total</TableHeaderColumn>
                    <TableHeaderColumn width="120" dataField="ESTADO">Estado</TableHeaderColumn>
                </BootstrapTable>

                {/* MODAL: CLIENT SELECTION */}
                <Modal isOpen={this.state.modalClientes} toggle={this.toggleClientes} className="modal-lg">
                    <ModalBody>
                        <ConsultaClientes toggle={this.toggleClientes} paramsCliente={this.setParamsFromModalCliente}/>
                    </ModalBody>
                </Modal>

                {/* MODAL: FACTURAR LOTE */}
                <Modal isOpen={this.state.modalFacturar} toggle={this.toggleFacturar} className="modal-lg">
                    <ModalBody>
                        <FacturarLote toggle={this.toggleFacturar} params={this.state.lote}/>
                    </ModalBody>
                </Modal>
            </div>
        );
    }

    componentDidMount() {
        this.getLotes();
    }

    render() {
        return (<CardWrap
            title="Consulta de Lotes"
            alert={this.state.alert}
            alertType={this.state.alert_type}
            alertMsg={this.state.alert_msg}
            loading={this.state.loading}
        >
            {this.mainContent()}
        </CardWrap>);
    }
}

export default ConsultaLotes;
