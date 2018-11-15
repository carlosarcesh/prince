/**
 * Created by Carlos Arce Sherader on 16/01/2018.
 */
import React, {Component} from 'react';

import {Modal, ModalHeader, ModalBody, ModalFooter, Button, Alert} from 'reactstrap';

import Loading from '../../../components/Loading/Loading';
import base from '../../../paths';
import cookie from 'react-cookies';
import functions from '../../../utils/functions';

class DetallePago extends Component {
    constructor(props) {
        super(props);

        this.state = {
            payu_status: null,
            payu_payload_tx_value: null,
            payu_payload_tx_value_currency: null,
            payu_id: null,
            payu_transactions: [],
            loading: false,
            not_data_found: false,
            showReversion: false,
            motivo_rev: null,
            alert: false,
            alert_type: 'danger',
            alert_msg: null,
        };
        this.getDatosPagoPayu = this.getDatosPagoPayu.bind(this);
        this.getDatosPagoPayuByReferenceCode = this.getDatosPagoPayuByReferenceCode.bind(this);
        this.revertirPago = this.revertirPago.bind(this);
        this.showReversionModalToggle = this.showReversionModalToggle.bind(this);
        this.onDismissAlert = this.onDismissAlert.bind(this);
        this.saveLogReversionAudit = this.saveLogReversionAudit.bind(this);
        this.formatPayuDate = this.formatPayuDate.bind(this);
    }

    getDatosPagoPayu() {
        if (this.props.params != null) {
            var _booking_id = this.props.params.booking_id;
            var _cine = this.props.params.cod_cine;
            var _transaccion_id = this.props.params.booking_number;

            if (_booking_id != null || _booking_id != '') {
                this.setState({
                    loading: true,
                    not_data_found: false
                });

                fetch(base.path.get_reference_code, {
                    method: 'POST',
                    headers: base.default_headers,
                    body: JSON.stringify({
                        booking_id: _booking_id,
                        cine: _cine,
                        transaccion_id: _transaccion_id,
                        _: new Date().getTime()
                    })
                }).then(response => {
                    return response.json();
                }).then(data => {
                    if(data[0].reference_code != null) {
                        this.getDatosPagoPayuByReferenceCode(data[0].reference_code);
                    } else {
                        console.warn('no reference code');
                        this.setState({
                            loading: false,
                            not_data_found: true
                        });
                    }
                }).catch(err => {
                    this.setState({
                        loading: false
                    });
                    console.log(err);
                });
            }
        }
    }

    getDatosPagoPayuByReferenceCode(ref_code) {
        var _reference_code = ref_code.trim();

        if (_reference_code != null || _reference_code != '') {
            this.setState({
                loading: true,
                not_data_found: false
            });

            fetch(base.path.get_datos_payu_by_reference, {
                method: 'POST',
                headers: base.default_headers,
                body: JSON.stringify({
                    reference_code: _reference_code,
                    _: new Date().getTime()
                })
            }).then(response => {
                return response.json();
            }).then(dataPayu => {
                if (dataPayu.result.payload != null) {
                    var data = dataPayu.result.payload;
                    if(data.length > 0) {
                        //sorting by date of trx
                        data[0].transactions.sort(function (a, b) {
                            return new Date(a.transactionResponse.operationDate) - new Date(b.transactionResponse.operationDate);
                        });

                        var _payu_transactions = data[0].transactions;

                        this.setState({
                            payu_status: data[0].status,
                            payu_payload_tx_value: data[0].additionalValues.TX_VALUE.value,
                            payu_payload_tx_value_currency: data[0].additionalValues.TX_VALUE.currency,
                            payu_id: data[0].id,
                            payu_transactions: _payu_transactions
                        });
                    } else {
                        this.setState({
                            not_data_found: true
                        });
                    }
                } else {
                    this.setState({
                        not_data_found: true
                    });
                }
                this.setState({
                    loading: false
                });
            }).catch(err => {
                this.setState({
                    loading: false
                });
                console.log(err);
            });
        }
    }

    revertirPago() {

        this.onDismissAlert();

        if (this.state.payu_transactions == null) {
            return;
        }

        var _order_id = this.state.payu_id,
            _trx_id = this.state.payu_transactions[0].id,
            _motivo = this.state.motivo_rev;

        if(!cookie.load('user')) {
            this.setState({
                loading: false,
                alert: true,
                alert_type: 'danger',
                alert_msg: '¡Error! Sesión terminada. Por favor vuelva a iniciar sesión.'
            });
            return;
        }

        if (_motivo == null || _motivo == '') {
            this.setState({
                loading: false,
                alert: true,
                alert_type: 'danger',
                alert_msg: '¡Error! El motivo no puede estar vacío.'
            });
            return;
        }

        this.setState({
            loading: true,
        });

        fetch(base.path.reversion_pago, {
            method: 'POST',
            headers: base.default_headers,
            body: JSON.stringify({
                order_id: _order_id,
                motivo: _motivo,
                trx_id: _trx_id,
                _: new Date().getTime()
            })
        }).then(response => {
            return response.json();
        }).then(dataPayu => {
            console.log(dataPayu);
            if (dataPayu.status == 'error') {
                this.setState({
                    alert: true,
                    alert_type: 'danger',
                    alert_msg: '¡Error! ' + dataPayu.message
                });
            } else {
                this.setState({
                    alert: true,
                    alert_type: 'success',
                    alert_msg: 'Reversión aprobada.'
                });
                this.saveLogReversionAudit();
            }

            this.setState({
                loading: false
            });
        }).catch(err => {
            this.setState({
                loading: false
            });
            console.log(err);
        });
    }

    saveLogReversionAudit() {
        const param = this.state.payu_transactions[0];
        var response_code = param.transactionResponse.responseCode,
            fecha_trx = this.formatPayuDate(param.transactionResponse.operationDate),
            id_trx = param.id,
            metodo_pago = param.paymentMethod,
            banco = param.creditCard.issuerBank,
            nro_tarjeta = param.creditCard.maskedNumber,
            tarjeta_hab = param.creditCard.name,
            dni = param.payer.dniNumber,
            email = param.payer.emailAddress,
            usuario = cookie.load('user');

        fetch(base.path.reversiones_audit, {
            method: 'POST',
            headers: base.default_headers,
            body: JSON.stringify({
                response_code,
                fecha_trx,
                id_trx,
                metodo_pago,
                banco,
                nro_tarjeta,
                tarjeta_hab,
                dni,
                email,
                usuario,
                _: new Date().getTime()
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            if (data.status == 'error') {
                this.setState({
                    alert: true,
                    alert_type: 'danger',
                    alert_msg: '¡Error! ' + data.message
                });
            } else {
                this.props.action();
            }

            this.setState({
                loading: false
            });
        }).catch(err => {
            this.setState({
                loading: false
            });
        });
    }

    formatPayuDate(str) {
        var date = new Date(str);
        var year = date.getFullYear();
        var month = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
        var day = (date.getDate() < 10 ? '0' : '') + date.getDate();
        return [day, month, year].join('/') + ' ' + [date.getHours(), date.getMinutes()].join(':');
    }

    showReversionModalToggle() {
        this.setState({
            showReversion: !this.state.showReversion,
            motivo_rev: null,
            alert: false
        });
    }

    onDismissAlert() {
        this.setState({alert: false, alert_msg: null});
    }

    componentWillMount() {
        if (this.props.reference_code == null) {
            this.getDatosPagoPayu();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.reference_code != null) {
            this.getDatosPagoPayuByReferenceCode(nextProps.reference_code);
        }
    }

    render() {

        function cardCreditCard(param) {
            if (param.creditCard == null) {
                return null;
            }

            return (
                <div className="row">
                    <div className="col-lg-3">
                        <b>Banco:</b>
                    </div>
                    <div className="col-lg-9">
                        {param.creditCard.issuerBank}
                    </div>
                    <div className="col-lg-3">
                        <b>Nro. Tarjeta:</b>
                    </div>
                    <div className="col-lg-9">
                        {param.creditCard.maskedNumber}
                    </div>
                    <div className="col-lg-3">
                        <b>Tarjetahabiente:</b>
                    </div>
                    <div className="col-lg-9">
                        {param.creditCard.name}
                    </div>
                </div>
            );
        }

        function cardIP(param) {
            if (param.ipAddress == null) {
                return null;
            }

            return (
                <div className="row">
                    <div className="col-lg-3">
                        <b>IP:</b>
                    </div>
                    <div className="col-lg-9">
                        {param.ipAddress}
                    </div>
                </div>
            );
        }

        function cardPayer(param) {
            if (param.payer == null) {
                return null;
            }

            return (
                <div className="row">
                    <div className="col-lg-3">
                        <b>DNI:</b>
                    </div>
                    <div className="col-lg-9">
                        {param.payer.dniNumber}
                    </div>
                    <div className="col-lg-3">
                        <b>Email:</b>
                    </div>
                    <div className="col-lg-9">
                        {param.payer.emailAddress}
                    </div>
                </div>
            );
        }

        function formatStatus2Str(str) {
            var status = null;
            switch (str) {
                case 'APPROVED':
                    status = 'Transacción aprobada';
                    break;
                case 'PAYMENT_NETWORK_REJECTED':
                    status = 'Transacción rechazada por entidad financiera';
                    break;
                case 'ENTITY_DECLINED':
                    status = 'Transacción rechazada por el banco';
                    break;
                case 'INSUFFICIENT_FUNDS':
                    status = 'Fondos insuficientes';
                    break;
                case 'INVALID_CARD':
                    status = 'Tarjeta inválida';
                    break;
                case 'CONTACT_THE_ENTITY':
                    status = 'Contactar entidad financiera';
                    break;
                case 'EXPIRED_CARD':
                    status = 'Tarjeta vencida';
                    break;
                case 'RESTRICTED_CARD':
                    status = 'Tarjeta restringida';
                    break;
                case 'INVALID_EXPIRATION_DATE_OR_SECURITY_CODE':
                    status = 'Fecha de expiración o código de seguridad inválidos';
                    break;
                case 'INVALID_TRANSACTION':
                    status = 'Transacción inválida';
                    break;
                case 'ANTIFRAUD_REJECTED':
                    status = 'Transacción rechazada por sospecha de fraude';
                    break;
                case 'ERROR':
                    status = 'Error';
                    break;
                case 'AUTOMATICALLY_FIXED_AND_SUCCESS_REVERSAL':
                    status = 'La transacción se corrigió automáticamente y podría generar un código de reversión';
                    break;
                case 'AUTOMATICALLY_FIXED_AND_UNSUCCESS_REVERSAL':
                    status = 'La transacción se corrigió automáticamente y no pudo crear un código de reversión';
                    break;
                case 'FIX_NOT_REQUIRED':
                    status = 'El código de la corrección no era obligatorio';
                    break;
                case 'ERROR_FIXING_AND_REVERSING':
                    status = 'La transacción no se pudo arreglar e invertir el código';
                    break;
                default:
                    status = str;
            }
            return status;
        }

        if (this.props.reference_code == null && this.props.params == null) {
            return null;
        }

        if (this.state.not_data_found) {
            return (
                <div className="animated fadeIn">
                    <span className="font-weight-bold">No se encontraron resultados.</span>
                </div>
            );
        }

        return (
            <div className="animated fadeIn">
                <Loading show={this.state.loading}/>
                <div className="row">
                    <div className="col-lg-2">
                        <b>Estado Actual:</b>
                    </div>
                    <div className="col-lg-10">
                        {this.state.payu_status}
                    </div>
                    <div className="col-lg-2">
                        <b>Monto a Pagar:</b>
                    </div>
                    <div className="col-lg-10">
                        {parseFloat(this.state.payu_payload_tx_value || 0.0).toFixed(2)}
                    </div>
                    <div className="col-lg-2">
                        <b>Moneda:</b>
                    </div>
                    <div className="col-lg-10">
                        {this.state.payu_payload_tx_value_currency}
                    </div>
                    <div className="col-lg-2">
                        <b>ID Orden:</b>
                    </div>
                    <div className="col-lg-10">
                        {this.state.payu_id}
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-lg-12">
                        {
                            this.state.payu_transactions.map((param, i) =>
                                <div className="card" key={i}>
                                    <div className="card-header">
                                        Transacción: <span className="font-weight-bold">{param.type}</span>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-lg-3">
                                                <b>Código de Respuesta:</b>
                                            </div>
                                            <div className="col-lg-9">
                                                {param.transactionResponse.responseCode} <span
                                                className="font-weight-bold">({formatStatus2Str(param.transactionResponse.responseCode)})</span>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-3">
                                                <b>Fecha de Transaccción:</b>
                                            </div>
                                            <div className="col-lg-9">
                                                {this.formatPayuDate(param.transactionResponse.operationDate)}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-3">
                                                <b>ID de Transaccción:</b>
                                            </div>
                                            <div className="col-lg-9">
                                                {param.id}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-3">
                                                <b>Método de Pago:</b>
                                            </div>
                                            <div className="col-lg-9">
                                                {param.paymentMethod}
                                            </div>
                                        </div>
                                        {cardCreditCard(param)}
                                        {cardIP(param)}
                                        {cardPayer(param)}
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
                {/*(cookie.load('user_rango') == 1) &&*/}
                {(functions.hasModuleEnabled(9)) &&
                <div className="row">
                    <div className="col-lg-12 text-right">
                        <button type="button" className="btn btn-danger"
                                onClick={this.showReversionModalToggle.bind(this)}>
                            <i className="fa fa-history" aria-hidden="true"></i> Revertir Pago
                        </button>
                    </div>
                </div>
                }

                {/* MODAL: REVERSION */}
                {this.state.payu_transactions.length > 0 && (
                    <Modal isOpen={this.state.showReversion} toggle={this.showReversionModalToggle}
                           className="modal-lg">
                        <ModalHeader toggle={this.showReversionModalToggle}>Revertir Pago</ModalHeader>
                        <ModalBody>
                            <Loading show={this.state.loading}/>
                            <Alert color={this.state.alert_type} isOpen={this.state.alert} toggle={this.onDismissAlert}>
                                {this.state.alert_msg}
                            </Alert>
                            <div className="row">
                                <div className="col-lg-2">
                                    <b>ID Orden:</b>
                                </div>
                                <div className="col-lg-10">
                                    {this.state.payu_id}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-2">
                                    <b>ID Transacción:</b>
                                </div>
                                <div className="col-lg-10">
                                    {this.state.payu_transactions[0].id}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    <b>Razón para solicitar el reembolso o cancelación de la transacción:</b>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                <textarea className="form-control" onChange={(e) => {
                                    this.setState({motivo_rev: e.target.value})
                                } }>{''}</textarea>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.revertirPago}>Solicitar Reembolso</Button>
                            <Button onClick={this.showReversionModalToggle}>Cerrar</Button>
                        </ModalFooter>
                    </Modal>
                )}
            </div>
        )
    }
}

export default DetallePago;
