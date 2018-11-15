import React, {Component} from 'react';
import {find, sumBy} from 'lodash';
import base from "../../paths";
import {BootstrapTable, TableHeaderColumn} from "react-bootstrap-table";
import functions from '../../utils/functions';

import CardWrap from '../../components/Container/CardWrap';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import cookie from "react-cookies";

class AnulacionCodigos extends Component {
    constructor(props) {
        super(props);

        this.state = {
            alert: false,
            alert_type: 'danger',
            alert_msg: null,
            loading: false,
            documento: null,
            orden: null,
            ordenes: [],
            anulados: [],
            cliente: [],
            email: null,
            showSendEmail: false,
            to: null,
            modalConfirm: false,
            emailSuccess: null,
            emailError: null
        };

        this.onDismissAlert = this.onDismissAlert.bind(this);
        this.getOrdenesVenta = this.getOrdenesVenta.bind(this);
        this.anularOrden = this.anularOrden.bind(this);
        this.enviarEmail = this.enviarEmail.bind(this);
        this.modalSendEmail = this.modalSendEmail.bind(this);
        this.modalConfirmAnular = this.modalConfirmAnular.bind(this);
        this.toggleModalSendEmail = this.toggleModalSendEmail.bind(this);
        this.toggleConfirm = this.toggleConfirm.bind(this);
    }

    getOrdenesVenta() {
        this.onDismissAlert();

        var {orden} = this.state;

        if (orden === '' || orden == null) {
            this.setState({
                alert: true,
                alert_type: 'danger',
                alert_msg: 'El campo de Ordenes de Ventas no puede estar vacío.'
            });
            return;
        }

        this.setState({
            loading: true
        });

        fetch(base.path.get_orden_venta, {
            method: 'POST',
            headers: base.default_headers,
            body: JSON.stringify({
                orden
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            this.setState({
                loading: false,
                cliente: data[0],
                ordenes: data[1],
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

    anularOrden() {
        this.setState({
            loading: true
        });

        this.toggleConfirm();

        var {orden} = this.state;

        if (orden === '' || orden == null) {
            this.setState({
                alert: true,
                alert_type: 'danger',
                alert_msg: 'El campo de Ordenes de Ventas no puede estar vacío.'
            });
            return;
        }

        fetch(base.path.anular_vouchers, {
            method: 'POST',
            headers: base.default_headers,
            body: JSON.stringify({
                orden,
                usuario: cookie.load('user'),
                cantidad: parseInt(sumBy(this.state.ordenes, 'CANTIDAD_POR_REDIMIR')),
                monto: parseFloat(sumBy(this.state.ordenes, 'TOTAL_POR_REDIMIR')).toFixed(2)
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            if (data.status) {
                if (data.status === 'error') {
                    this.setState({
                        alert: true,
                        alert_type: 'danger',
                        alert_msg: '¡Error! ' + data.message
                    });
                }
            } else {
                this.setState({
                    anulados: data
                }, () => {
                    if (data.length > 0) {
                        this.setState({
                            alert: true,
                            alert_type: 'success',
                            alert_msg: `El lote ${orden} ha sido anulado por el monto total de ${parseFloat(sumBy(data, 'TOTAL_POR_REDIMIR')).toFixed(2)} soles.`
                        }, () => {
                            this.toggleModalSendEmail();
                            this.getOrdenesVenta();
                        });
                    } else {
                        this.setState({
                            alert: true,
                            alert_type: 'warning',
                            alert_msg: 'No existen vouchers para anular.'
                        });
                    }
                });
            }
            this.setState({
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

    enviarEmail() {
        let {anulados, ordenes, orden, to, cliente} = this.state;

        function validateEmail(email) {
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }

        if (to === null || to === '') {
            this.setState({
                emailError: '¡Error! Email no puede estar vacío.'
            });
            return;
        }

        if (!validateEmail(to)) {
            this.setState({
                emailError: '¡Error! Email no válido.'
            });
            return;
        }

        this.setState({
            loading: true
        });

        let titleBgColor = 'DDEBF7';

        let from = 'anulaciones@cineplanet.com.pe',
            subject = `Lote ${orden} anulado`,
            html = `
            <p>Estimad@</p>
            <p>El lote ${orden} ha sido anulado por el monto total de ${parseFloat(sumBy(anulados, 'TOTAL_POR_REDIMIR')).toFixed(2)} soles.</p>
            <p>Factura Nro.: ${anulados[0].DOCUMENTO}</p>
            <p>Cliente: ${cliente[0].Nombre}</p>
            <p>Detalle:</p>
            <table border="1" cellspacing="0" style="border: .3px solid black;" cellpadding="3">
                <tr style="background-color: #${titleBgColor}">
                    <td align="center"><b>Voucher</b></td>
                    <td align="center"><b>Cantidad</b></td>
                    <td align="center"><b>Precio</b></td>
                    <td align="center"><b>Monto</b></td>
                </tr>`;
        let total = 0;
        anulados.forEach(m => {
            html = html + '<tr>';
            html = html + `<td>${m.DESCRIPCION}</td>`;
            html = html + `<td align="right">${m.CANTIDAD_POR_REDIMIR}</td>`;
            html = html + `<td align="right">${parseFloat(m.PRECIO_UNI).toFixed(2)}</td>`;
            html = html + `<td align="right">${parseFloat(m.TOTAL_POR_REDIMIR).toFixed(2)}</td>`;
            html = html + '</tr>';

            total = total + parseFloat(m.TOTAL_POR_REDIMIR);
        });
        html = html + '<tr>';
        html = html + `<td></td>`;
        html = html + `<td></td>`;
        html = html + `<td style="background-color: #${titleBgColor}"><b>Total</b></td>`;
        html = html + `<td><b>${parseFloat(total).toFixed(2)}</b></td>`;
        html = html + '</tr>';
        html = html + '</table>';

        if (orden === '' || orden == null) {
            this.setState({
                alert: true,
                alert_type: 'danger',
                alert_msg: 'El campo de Lote no puede estar vacío.'
            });
            return;
        }

        to = `${to}, ctacza@cineplanet.com.pe, saquino@cineplanet.com.pe, erodriguez@cineplanet.com.pe, drosadio@cineplanet.com.pe, fsalazar@cineplanet.com.pe, aacuna@cineplanet.com.pe`;
        //to = `${to}, ctacza@cineplanet.com.pe`;

        fetch(base.path.enviar_email, {
            method: 'POST',
            headers: base.default_headers,
            body: JSON.stringify({
                from,
                to,
                bbc: 'ctacza@cineplanet.com.pe',
                subject,
                html
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            if (data.status === 'success') {
                this.setState({
                    alert: true,
                    alert_type: 'success',
                    alert_msg: 'El email fue enviado con éxito.'
                }, () => {
                    this.toggleModalSendEmail();
                });
            } else {
                this.setState({
                    emailError: '¡Error! ' + data.message
                });
            }

            this.setState({
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

    toggleModalSendEmail() {
        this.setState({
            showSendEmail: !this.state.showSendEmail
        });
    }

    toggleConfirm() {
        this.setState({
            modalConfirm: !this.state.modalConfirm
        });
    }

    mainForm() {
        return (
            <div className="row">
                <div className="col-lg-12">
                    <div className="form-group row">
                        <label htmlFor="inputNro" className="col-sm-2 col-form-label">Nro. de Lote</label>
                        <div className="col-sm-4">
                            <input type="text" id="inputNro" className="form-control"
                                   onChange={e => this.setState({orden: e.target.value})}/>
                        </div>
                        <div className="col-sm-2">
                            <button className="btn btn-primary" onClick={this.getOrdenesVenta}>Buscar
                            </button>
                        </div>
                    </div>
                </div>
                {this.state.cliente.length > 0 &&
                <div className="col-lg-12">
                    <div className="form-group row">
                        <label htmlFor="inputLote" className="col-sm-2 col-form-label">Cliente</label>
                        <div className="col-sm-4">
                            <input type="text" id="inputLote" value={this.state.cliente[0].Nombre}
                                    className="form-control border border-primary rounded bg-white"
                                    disabled/>
                        </div>
                    </div>
                </div>
                }
            </div>
        );
    }

    wrapResult() {
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
            paginationPosition: 'top',
            noDataText: 'No se encontraron resultados.'
        };

        return (
            <div className="row">
                <div className="col-lg-12">
                    <BootstrapTable data={this.state.ordenes} striped={true} hover={true} pagination={true}
                                    options={tbl_options} version='4'>
                        <TableHeaderColumn width="120" dataField="VOUCHER_TYPE" isKey={true} dataAlign="center"
                                           dataSort={true}>Voucher Type</TableHeaderColumn>
                        <TableHeaderColumn width="120" dataField="DOCUMENTO" dataSort={true}>Documento</TableHeaderColumn>
                        <TableHeaderColumn dataField="DESCRIPCION" dataSort={true}>Descripcion</TableHeaderColumn>
                        <TableHeaderColumn width="80" dataField="CANTIDAD_SOLICITADA" dataAlign="right">Cant.
                            Sol.</TableHeaderColumn>
                        <TableHeaderColumn width="80" dataField="PRECIO_UNI" dataFormat={functions.priceFormatter}
                                           dataSort={true} dataAlign="right">Precio U.</TableHeaderColumn>
                        <TableHeaderColumn width="80" dataField="PRECIO_TOTAL" dataFormat={functions.priceFormatter}
                                           dataSort={true} dataAlign="right">Precio Tot.</TableHeaderColumn>
                        {/*<TableHeaderColumn width="80" dataField="CANTIDAD_REDIMIDA" dataAlign="right">Cant.
                            Red.</TableHeaderColumn>
                        <TableHeaderColumn width="80" dataField="TOTAL_REDIMIDO" dataFormat={functions.priceFormatter}
                                           dataSort={true} dataAlign="right">Total Red.</TableHeaderColumn>*/}
                        <TableHeaderColumn width="100" dataField="CANTIDAD_POR_REDIMIR"
                                           dataSort={true} dataAlign="right">Cant. x Red.</TableHeaderColumn>
                        <TableHeaderColumn width="100" dataField="TOTAL_POR_REDIMIR"
                                           dataFormat={functions.priceFormatter}
                                           dataSort={true} dataAlign="right">Total x Red.</TableHeaderColumn>
                        <TableHeaderColumn width="120" dataField="ESTADO">Estado</TableHeaderColumn>
                    </BootstrapTable>
                </div>
                <div className="col-lg-12 text-center">
                    <hr/>
                    <button className="btn btn-danger" onClick={this.toggleConfirm}
                            disabled={(find(this.state.ordenes, {'ESTADO': 'ANULADO'}) !== undefined)}>Anular Vouchers
                    </button>
                </div>

                {/* MODAL: SEND EMAIL */}
                {this.modalSendEmail()}
                {/* MODAL: CONFIRM */}
                {this.modalConfirmAnular()}
            </div>
        );
    }

    modalSendEmail() {
        return (
            <Modal isOpen={this.state.showSendEmail} toggle={this.toggleModalSendEmail} backdrop="static">
                <ModalBody>
                    <div className="row">
                        <div className="col-lg-12">
                            <p className="h3">¡Éxito!</p>
                            <p className="text-success">La anulación se realizó correctamente.</p>
                            <p className="text-success">{this.state.emailSuccess}</p>
                            <p className="text-danger">{this.state.emailError}</p>
                            <div className="form-group">
                                <input type="email" className="form-control"
                                       placeholder="Ingrese un email o presione cancelar."
                                       onChange={e => {
                                           this.setState({
                                               to: e.target.value
                                           });
                                       }}/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6">
                            <button className="btn btn-default" onClick={this.toggleModalSendEmail}>Cancelar</button>
                        </div>
                        <div className="col-lg-6 text-right">
                            <button className="btn btn-primary" onClick={this.enviarEmail}>Enviar Correo</button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        );
    }

    modalConfirmAnular() {
        return (
            <Modal isOpen={this.state.modalConfirm} toggle={this.toggleConfirm} backdrop="static">
                <ModalHeader toggle={this.toggle}>¡Atención!</ModalHeader>
                <ModalBody>
                    <p className="text-bold">¿Desea realmente anular los vouchers?</p>
                    <p>Recuerda que solo se anularán los vouchers que aún no han vencido.</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.anularOrden}>Anular</Button>{' '}
                    <Button color="secondary" onClick={this.toggleConfirm}>Cancelar</Button>
                </ModalFooter>
            </Modal>
        );
    }

    render() {

        return (<CardWrap
            title="Anulación de Códigos"
            alert={this.state.alert}
            alertType={this.state.alert_type}
            alertMsg={this.state.alert_msg}
            loading={this.state.loading}
        >
            {this.mainForm()}
            {this.state.ordenes.length > 0 && this.wrapResult()}
        </CardWrap>);
    }
}

export default AnulacionCodigos;
