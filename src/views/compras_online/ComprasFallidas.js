/**
 * Created by Carlos Arce Sherader on 2/01/2018.
 */
import React, {Component} from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import NumberFormat from 'react-number-format';

import {Button, Modal, ModalBody, ModalFooter, ModalHeader, UncontrolledTooltip} from 'reactstrap';

import DetalleTrxFallidas from './detalles/DetalleTrxFallidas';
import ReenviarOC from './detalles/ReenviarOC';
import DetallePago from './detalles/DetallePagoPayu';

import base from '../../paths';
import apis from '../../general/apis';
import functions from '../../utils/functions';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import CardWrap from "../../components/Container/CardWrap";

class ComprasFallidas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            complejos_data: [],
            trx_data: [],
            complejo: null,
            cod_cliente: null,
            booking_id: null,
            trans_id: null,
            email: null,
            tran_id_payu: null,
            nro_tarjeta: null,
            fecha: moment(),
            canal: null,
            loading: false,
            showDetalle: false,
            showReenviar: false,
            showDetallePago: false,
            entity: [],
            alert: false,
            alert_type: 'danger',
            alert_msg: null,
            pais: 'peru',
            estado: null,
        };
        this.cambiarFecha = this.cambiarFecha.bind(this);
        this.buscarTransacciones = this.buscarTransacciones.bind(this);
        this.showDetalleModalToggle = this.showDetalleModalToggle.bind(this);
        this.showReenviarModalToggle = this.showReenviarModalToggle.bind(this);
        this.showDetallePagoModalToggle = this.showDetallePagoModalToggle.bind(this);
        this.botonDetalles = this.botonDetalles.bind(this);
        this.botonReenvio = this.botonReenvio.bind(this);
        this.botonEstadoPago = this.botonEstadoPago.bind(this);
        this.onDismissAlert = this.onDismissAlert.bind(this);
        this.wrapContent = this.wrapContent.bind(this);
        this.wrapTableResults = this.wrapTableResults.bind(this);
        this.wrapModals = this.wrapModals.bind(this);
    }

    cambiarFecha(date) {
        this.setState({
            fecha: date
        });
    }

    buscarTransacciones() {
        this.setState({
            alert: false,
            alert_type: null,
            alert_msg: null
        });

        var _complejo = this.state.complejo,
            _socio = this.state.cod_cliente,
            _booking_id = this.state.booking_id,
            _tran_id = this.state.trans_id,
            _tran_fecha = this.state.fecha,
            _canal = this.state.canal,
            _email = this.state.email,
            _tran_id_payu = this.state.tran_id_payu,
            _nro_tarjeta = this.state.nro_tarjeta,
            _estado = this.state.estado;

        if (_complejo == '' || _complejo == null) {
            this.setState({
                alert: true,
                alert_type: 'danger',
                alert_msg: 'Debe seleccionar un complejo.'
            });
            return;
        }

        if (_tran_fecha == '' || _tran_fecha == null) {
            this.setState({
                alert: true,
                alert_type: 'danger',
                alert_msg: 'Debe seleccionar una fecha.'
            });
            return;
        }

        if (_complejo == '00' && ((_socio == '' || _socio == null) && (_booking_id == '' || _booking_id == null) && (_tran_id_payu == '' || _tran_id_payu == null) && (_canal == '' || _canal == null) && (_email == '' || _email == null) && (_nro_tarjeta == '' || _nro_tarjeta == null))) {
            this.setState({
                alert: true,
                alert_type: 'danger',
                alert_msg: 'Al seleccionar todos los complejos, debe ingresar algún filtro adicional (Ejm.: Socio, Booking ID, ID Trans. Payu, Canal, Email ó N. Tarjeta).'
            });
            return;
        }

        this.setState({
            trx_data: [],
            loading: true
        });

        fetch(base.path.transacciones_taquilla_fallidas, {
            method: 'POST',
            headers: base.default_headers,
            body: JSON.stringify({
                complejo: _complejo,
                socio: _socio,
                booking_id: _booking_id,
                tran_id: _tran_id,
                tran_fecha: _tran_fecha.format('DD/MM/YYYY'),
                canal: _canal,
                email: _email,
                tran_id_payu: _tran_id_payu,
                nro_tarjeta: _nro_tarjeta,
                estado: _estado
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            if (data.status == 'error') {
                if (data.message.includes('Failed to connect')) {
                    data.message = 'La información del complejo no se encuentra disponible en este momento.';
                }
                this.setState({
                    alert: true,
                    alert_type: 'danger',
                    alert_msg: data.message
                });
            } else {
                this.setState({
                    trx_data: data
                });
            }

            this.setState({
                loading: false
            });
        }).catch(err => {
            console.log(err);

            this.setState({
                loading: false
            });
        });
    }

    formatFecha(cell) {
        var date = new Date(cell);

        function pad(s) {
            return (s < 10) ? '0' + s : s;
        }

        return [pad(date.getDate()), pad(date.getMonth() + 1), date.getFullYear()].join('/').concat(" ").concat([pad(date.getHours()), pad(date.getMinutes()), pad(date.getSeconds())].join(":"))
    }

    botonDetalles(cell, row) {
        return (
            <Button color="warning" onClick={(e) => {
                this.showDetalleModalToggle(cell, row)
            }}>
                <i className="fa fa-ticket"></i>
            </Button>
        );
    }

    botonReenvio(cell, row) {
        return (
            <Button color="primary" onClick={(e) => {
                this.showReenviarModalToggle(cell, row)
            }}>
                <i className="fa fa-paper-plane"></i>
            </Button>
        );
    }

    botonEstadoPago(cell, row) {
        return (
            <Button color="success" onClick={(e) => {
                this.showDetallePagoModalToggle(cell, row)
            }} disabled={(row.monto_total === 0)}>
                <i className="fa fa-credit-card"></i>
            </Button>
        );
    }

    botonEstado(cell, row) {
        const {cod_estado, transaccion_id, estado} = row;
        const state = (cod_estado == '1') ? 'dot_failed' : 'dot_success';
        const tooltip_id = 'Tooltip-' + transaccion_id;

        return (
            <div>
                <a href="javascript:void(0)" id={tooltip_id}>
                    <img src={"./img/" + state + ".png"}/>
                </a>
                <UncontrolledTooltip target={tooltip_id}>
                    {estado}
                </UncontrolledTooltip>
            </div>
        );
    }

    showDetalleModalToggle(cell, row) {
        this.setState({
            showDetalle: !this.state.showDetalle,
            entity: row
        });
    }

    showReenviarModalToggle(cell, row) {
        this.setState({
            showReenviar: !this.state.showReenviar,
            entity: row
        });
    }

    showDetallePagoModalToggle(cell, row) {
        this.setState({
            showDetallePago: !this.state.showDetallePago,
            entity: row
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

    wrapContent() {
        return (
            <div>
                <form>
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
                                        {/*<option value="00">Todos</option>*/}
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
                                <label htmlFor="inputCliente"
                                       className="col-sm-3 col-form-label">Cliente</label>
                                <div className="col-sm-9">
                                    <input type="text" className="form-control" id="inputCliente"
                                           onChange={(e) => {
                                               this.setState({cod_cliente: e.target.value})
                                           }}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="form-group row">
                                <label htmlFor="inputBooking" className="col-sm-4 col-form-label">Booking
                                    ID</label>
                                <div className="col-sm-8">
                                    <input type="text" className="form-control" id="inputBooking"
                                           onChange={(e) => {
                                               this.setState({booking_id: e.target.value})
                                           }}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-4">
                            <div className="form-group row">
                                <label htmlFor="inputIdTxnPayu" className="col-sm-4 col-form-label">
                                    {functions.getCountry() == 'peru' && 'ID Trans. Payu'}
                                    {functions.getCountry() == 'chile' && 'Trans. ID.'}
                                </label>
                                <div className="col-sm-8">
                                    <input type="text" className="form-control" id="inputIdTxnPayu"
                                           onChange={(e) => {
                                               this.setState({tran_id_payu: e.target.value})
                                           }}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="form-group row">
                                <label htmlFor="inputFecha" className="col-sm-3 col-form-label"><span
                                    className="text-red">*</span> Fecha</label>
                                <div className="col-sm-9">
                                    <DatePicker selected={this.state.fecha} onChange={this.cambiarFecha}
                                                locale="es"
                                                peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                dateFormat="DD/MM/YYYY"
                                                className="form-control" id="inputFecha" readOnly={true}/>
                                    <label htmlFor="inputFecha" className="label-datepicker"><i
                                        className="fa fa-calendar" aria-hidden="true">{''}</i></label>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="form-group row">
                                <label htmlFor="inputCanal" className="col-sm-4 col-form-label">Canal</label>
                                <div className="col-sm-8">
                                    <select className="form-control" id="inputCanal" onChange={(e) => {
                                        this.setState({canal: e.target.value})
                                    }}>
                                        <option value="">Todos</option>
                                        <option value="WWW">Página Web</option>
                                        <option value="RSP">Módulo de Exploración</option>
                                        <option value="CELL">Aplicación Móvil</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-4">
                            <div className="form-group row">
                                <label htmlFor="inputEmail" className="col-sm-4 col-form-label">Email</label>
                                <div className="col-sm-8">
                                    <input type="text" className="form-control" id="inputEmail"
                                           onChange={(e) => {
                                               this.setState({email: e.target.value})
                                           }}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="form-group row">
                                <label htmlFor="inputTarjeta" className="col-sm-3 col-form-label">N.
                                    Tarjeta</label>
                                <div className="col-sm-9">
                                    <NumberFormat id="inputTarjeta" format="#### ##.. .... ####"
                                                  className="form-control" onValueChange={(values) => {
                                        const {formattedValue, value} = values;
                                        this.setState({nro_tarjeta: value})
                                    }}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="form-group row">
                                <label htmlFor="inputEstado"
                                       className="col-sm-4 col-form-label">Estado</label>
                                <div className="col-sm-8">
                                    <select className="form-control" id="inputEstado" onChange={(e) => {
                                        this.setState({estado: e.target.value})
                                    }}>
                                        <option value="">Todos</option>
                                        <option value="0">Exitosas</option>
                                        <option value="1">Fallidas</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12 text-right">
                            <input type="reset" className="btn btn-default" value="Limpiar"/>{' '}
                            <button type="button" className="btn btn-primary"
                                    onClick={this.buscarTransacciones.bind(this)}>
                                <i className="fa fa-search" aria-hidden="true"></i> Buscar
                            </button>
                        </div>
                    </div>
                </form>
                {this.wrapTableResults()}
                <div className="small">
                    <i><span className="text-red">*</span> Campos obligatorios.</i>
                </div>
            </div>
        );
    }

    wrapTableResults() {
        moment.locale('es');

        const tbl_options = {
            page: 1,
            sizePerPage: 20,
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

        const selectRowProp = {
            mode: "radio",
            clickToSelect: true,
            className: "row-selected",
            hideSelectColumn: true
        };

        return (
            <BootstrapTable data={this.state.trx_data} striped={true} hover={true} pagination={true}
                            options={tbl_options} selectRow={selectRowProp} version="4">
                {/*<TableHeaderColumn width="60" dataField="cod_estado" dataFormat={this.botonEstado}
                                       dataSort={true} dataAlign="center"></TableHeaderColumn>*/}
                <TableHeaderColumn width="80" dataField="transaccion_id" isKey={true} dataAlign="center"
                                   dataSort={true}>Trans.
                    ID</TableHeaderColumn>
                <TableHeaderColumn width="100" dataField="booking_id" dataSort={true} dataAlign="center">Booking
                    ID</TableHeaderColumn>
                <TableHeaderColumn width="150" dataField="fec_trx_varchar" dataSort={true}
                                   dataFormat={this.formatFecha}
                                   dataAlign="center">Fecha
                    Trans.</TableHeaderColumn>
                <TableHeaderColumn width="100" dataField="cod_cliente" dataSort={true} dataAlign="center">Cod.
                    Cliente</TableHeaderColumn>
                <TableHeaderColumn dataField="nombres" dataSort={true}>Desc. Cliente</TableHeaderColumn>
                <TableHeaderColumn width="70" dataField="socio?"
                                   dataSort={true} dataAlign="center">¿Socio?</TableHeaderColumn>
                <TableHeaderColumn width="70" dataField="monto_total" dataAlign="right"
                                   dataSort={true}
                                   dataFormat={functions.priceFormatter}>Monto</TableHeaderColumn>
                {/*<TableHeaderColumn width="70" dataField="ESTADO"
                             dataAlign="center">Estado</TableHeaderColumn>*/}
                <TableHeaderColumn width="70" dataField="detalle" columnTitle="Detalle de Compra"
                                   dataAlign="center"
                                   dataFormat={this.botonDetalles}>Detalles</TableHeaderColumn>
                <TableHeaderColumn width="70" dataField="reenvio" columnTitle="Reenvío de Correo"
                                   dataAlign="center"
                                   dataFormat={this.botonReenvio}>Reenvío</TableHeaderColumn>
                <TableHeaderColumn width="70" dataField="estadopago" columnTitle="Estado del Pago"
                                   dataAlign="center"
                                   dataFormat={this.botonEstadoPago}>E. Pago</TableHeaderColumn>
            </BootstrapTable>
        );
    }

    wrapModals() {
        return (
            <div>
                {/* MODAL: DETALLES TRANSACCION */}
                <Modal isOpen={this.state.showDetalle} toggle={this.showDetalleModalToggle} className="modal-lg">
                    <ModalHeader toggle={this.showDetalleModalToggle}>Detalles de la Transacción</ModalHeader>
                    <ModalBody>
                        <DetalleTrxFallidas params={this.state.entity}/>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.showDetalleModalToggle}>Cerrar</Button>
                    </ModalFooter>
                </Modal>

                {/* MODAL: REENVIO DE CORREO */}
                <Modal isOpen={this.state.showReenviar} toggle={this.showReenviarModalToggle} className="modal-md">
                    <ModalHeader toggle={this.showReenviarModalToggle}>Reenviar Orden de Compra</ModalHeader>
                    <ModalBody>
                        <ReenviarOC params={this.state.entity}/>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.showReenviarModalToggle}>Cerrar</Button>
                    </ModalFooter>
                </Modal>

                {/* MODAL: DETALLES PAGO */}
                <Modal isOpen={this.state.showDetallePago} toggle={this.showDetallePagoModalToggle}
                       className="modal-lg">
                    <ModalHeader toggle={this.showDetallePagoModalToggle}>Detalles del Pago</ModalHeader>
                    <ModalBody>
                        <DetallePago params={this.state.entity}/>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.showDetallePagoModalToggle}>Cerrar</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }

    render() {
        return (<CardWrap
            title="Compras Online"
            alert={this.state.alert}
            alertType={this.state.alert_type}
            alertMsg={this.state.alert_msg}
            loading={this.state.loading}
        >
            {this.wrapContent()}
            {this.wrapModals()}
        </CardWrap>);
    }
}

export default ComprasFallidas;
