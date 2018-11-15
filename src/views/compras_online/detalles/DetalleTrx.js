/**
 * Created by Carlos Arce Sherader on 9/01/2018.
 */
import React, {Component} from 'react';
import {TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import classnames from 'classnames';

import cookie from "react-cookies";

import Loading from '../../../components/Loading/Loading';

import base from '../../../paths';
import functions from '../../../utils/functions';

class DetalleTrx extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: '1',
            has_taq: false,
            has_dul: false,
            taq_det: [],
            dul_det: [],
            vouchers: null,
            butacas: null,
            serie_corr: null,
            loading: false,
            pais: 'peru'
        };

        this.toggleTab = this.toggleTab.bind(this);
        this.loadTaquillaDetalles = this.loadTaquillaDetalles.bind(this);
        this.loadDulceriaDetalles = this.loadDulceriaDetalles.bind(this);
        this.precioFormatter = this.precioFormatter.bind(this);
        this.comboFormatter = this.comboFormatter.bind(this);
        this.cantidad = this.cantidad.bind(this);
    }

    toggleTab(tab) {
        if (this.state.has_taq == false && tab == '1') {
            return null;
        }

        if (this.state.has_dul == false && tab == '2') {
            return null;
        }

        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    formatFecha(cell, row) {
        var date = new Date(cell);

        function pad(s) {
            return (s < 10) ? '0' + s : s;
        }

        return [pad(date.getDate()), pad(date.getMonth() + 1), date.getFullYear()].join('/') + ' - ' + [pad(date.getHours()), pad(date.getMinutes()), pad(date.getSeconds())].join(':');
    }

    loadTaquillaDetalles() {
        var _complejo = this.props.params.cod_cine,
            _booking_id = this.props.params.booking_id,
            _tran_id = this.props.params.transaccion_id;

        if (_booking_id != null) {
            this.setState({
                loading: true
            });
            fetch(base.path.transacciones_taquilla_det, {
                method: 'POST',
                headers: base.default_headers,
                body: JSON.stringify({
                    complejo: _complejo,
                    booking_id: _booking_id,
                    tran_id: _tran_id
                })
            }).then(response => {
                return response.json();
            }).then(data => {
                this.setState({
                    loading: false
                });
                if (data.status == 'error') {
                    console.log(data.message);
                } else {
                    if (data.length > 0) {
                        this.setState({
                            has_taq: true,
                            taq_det: data,
                            serie_corr: data[0].SerieYCorrelativo,
                        });

                        let butacas_array = new Array();
                        let vouchers_array = new Array();
                        data.forEach(function (m) {
                            butacas_array.push(m.desc_fila + m.desc_columna);
                            vouchers_array.push(m.cod_voucher);
                        });

                        this.setState({
                            butacas: butacas_array.join(', '),
                            vouchers: vouchers_array.join(', ')
                        });
                    } else {
                        this.setState({
                            has_taq: false,
                            activeTab: '2'
                        });
                    }
                }
            }).catch(err => {
                this.setState({
                    loading: false
                });
                console.log(err);
            });

            this.loadDulceriaDetalles();
        }
    }

    loadDulceriaDetalles() {
        var _complejo = this.props.params.cod_cine,
            _booking_id = this.props.params.booking_id,
            _tran_id = this.props.params.transaccion_id;

        if (_booking_id != null) {
            this.setState({
                loading: true
            });
            fetch(base.path.transacciones_dulceria, {
                method: 'POST',
                headers: base.default_headers,
                body: JSON.stringify({
                    complejo: _complejo,
                    booking_id: _booking_id,
                    tran_id: _tran_id
                })
            }).then(response => {
                return response.json();
            }).then(data => {
                this.setState({
                    loading: false
                });
                if (data.status == 'error') {
                    console.log(data.message);
                } else {
                    if (data.length > 0) {
                        this.setState({
                            has_dul: true,
                            dul_det: data,
                            serie_corr: data[0].SerieYCorrelativo
                        });
                    } else {
                        this.setState({
                            has_dul: false
                        });
                    }
                }
            }).catch(err => {
                this.setState({
                    loading: false
                });
                console.log(err);
            });
        }
    }

    precioFormatter(cell, row) {
        if(cookie.load('pais') == 'peru') {
            return (cell - row.comision).toFixed(2);
        } else {
            return (cell - row.comision).toFixed(0);
        }
    }

    cantidad() {
        return 1;
    }

    subtotalFormatter(cell, row) {
        if(cookie.load('pais') == 'peru') {
            return (((row.precio_uni - row.comision) + row.comision) * 1).toFixed(2);
        } else {
            return (((row.precio_uni - row.comision) + row.comision) * 1).toFixed(0);
        }
    }

    butacaFormatter(cell, row) {
        return row.desc_fila + row.desc_columna;
    }

    comboFormatter(cell, row) {
        return (
            <span>
                {row.item_description}
                <br/>
                <small>{row.Item_strExtendedDescription}</small>
            </span>
        )
    }

    componentWillMount() {
        this.setState({
            pais: cookie.load('pais')
        });
        this.loadTaquillaDetalles();
    }

    render() {
        if (this.props.params == null) {
            return null;
        }

        const tbl_options = {
            page: 1,
            sizePerPage: 5,
            pageStartIndex: 1,
            paginationSize: 3,
            prePage: 'Anterior',
            nextPage: 'Siguiente',
            firstPage: 'Primero',
            lastPage: 'Último',
            hideSizePerPage: true,
            paginationPosition: 'bottom',
        };

        return (
            <div>
                <Loading show={this.state.loading}/>
                <div className="row">
                    <div className="col-lg-12">
                        <h5>
                            Detalles del Booking ID: {this.props.params.booking_id}
                        </h5>
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-lg-6">
                        <div className="row">
                            <div className="col-lg-4 font-weight-bold">
                                Socio:
                            </div>
                            <div className="col-lg-8">
                                ({this.props.params['socio?']}) {(this.props.params['socio?'] == 'NO') ? '' : this.props.params.cod_cliente + ' - '} {this.props.params.nombres}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4 font-weight-bold">
                                Complejo:
                            </div>
                            <div className="col-lg-8">
                                {this.props.params.desc_cine}
                            </div>
                        </div>
                        {this.state.pais == 'peru' &&
                        <div className="row">
                            <div className="col-lg-4 font-weight-bold">
                                Serie y Corr.:
                            </div>
                            <div className="col-lg-8">
                                {this.state.serie_corr}
                            </div>
                        </div>
                        }
                        <div className="row">
                            <div className="col-lg-4 font-weight-bold">
                                Origen:
                            </div>
                            <div className="col-lg-8">
                                {this.props.params.origen}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4 font-weight-bold">
                                {this.state.pais == 'peru' && 'ID Tran. Payu:'}
                                {this.state.pais == 'chile' && 'Session ID:'}
                                    </div>
                            <div className="col-lg-8">
                                {this.props.params.id_trx_payu}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="row">
                            <div className="col-lg-4 font-weight-bold">
                                Monto Total:
                            </div>
                            <div className="col-lg-8">
                                {this.state.pais == 'peru' && 'S/ '}
                                {this.props.params.monto_total && functions.priceFormatter(this.props.params.monto_total)}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4 font-weight-bold">
                                Fecha Trans.:
                            </div>
                            <div className="col-lg-8">
                                {this.formatFecha(this.props.params.fec_trx_varchar)}
                            </div>
                        </div>
                        {this.state.pais == 'peru' &&
                        <div className="row">
                            <div className="col-lg-4 font-weight-bold">
                                Forma Pago:
                            </div>
                            <div className="col-lg-8">
                                {this.props.params.forma_pago}
                            </div>
                        </div>
                        }
                        {this.state.pais == 'peru' &&
                        <div className="row">
                            <div className="col-lg-4 font-weight-bold">
                                Nro. Tarjeta:
                            </div>
                            <div className="col-lg-8">
                                {this.props.params.nro_tarjeta}
                            </div>
                        </div>
                        }
                        {this.props.params.estado &&
                        <div className="row">
                            <div className="col-lg-4 font-weight-bold">
                                Estado:
                            </div>
                            <div className="col-lg-8">
                                {this.props.params.estado}
                            </div>
                        </div>
                        }
                    </div>
                </div>
                <hr/>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({
                                active: this.state.activeTab === '1',
                                disabled: !this.state.has_taq
                            })}
                            onClick={() => {
                                this.toggleTab('1');
                            }}
                        >
                            Taquilla
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({
                                active: this.state.activeTab === '2',
                                disabled: !this.state.has_dul
                            })}
                            onClick={() => {
                                this.toggleTab('2');
                            }}
                        >
                            Dulcería
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    {/* TAB TALQUILLA*/}
                    <TabPane tabId="1">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="row">
                                    <div className="col-lg-4 font-weight-bold">
                                        Trans. ID:
                                    </div>
                                    <div className="col-lg-8">
                                        {this.props.params.transaccion_id && this.props.params.transaccion_id}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4 font-weight-bold">
                                        Total Taquilla:
                                    </div>
                                    <div className="col-lg-8">
                                        {this.state.pais == 'peru' && 'S/ '}
                                        {this.props.params.monto_total_taq && functions.priceFormatter(this.props.params.monto_total_taq)}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4 font-weight-bold">
                                        Película:
                                    </div>
                                    <div className="col-lg-8">
                                        {this.props.params.pelicula}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4 font-weight-bold">
                                        Sala:
                                    </div>
                                    <div className="col-lg-8">
                                        {this.props.params.sala}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4 font-weight-bold">
                                        Cód. Voucher:
                                    </div>
                                    <div className="col-lg-8">
                                        {this.state.vouchers||'-'}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="row">
                                    <div className="col-lg-4 font-weight-bold">
                                        Butacas:
                                    </div>
                                    <div className="col-lg-8">
                                        {this.state.butacas}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4 font-weight-bold">
                                        Categoría:
                                    </div>
                                    <div className="col-lg-8">
                                        {this.props.params.categoria}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4 font-weight-bold">
                                        Fecha Func.:
                                    </div>
                                    <div className="col-lg-8">
                                        {this.formatFecha(this.props.params.fec_hora_func_varchar)}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4 font-weight-bold">
                                        Fecha Canje:
                                    </div>
                                    <div className="col-lg-8">
                                        {this.props.params.fec_canje && this.formatFecha(this.props.params.fec_canje) || '-'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr/>
                        <div className="row">
                            <div className="col-lg-12">
                                <BootstrapTable data={this.state.taq_det} striped={true} hover={true} pagination={true}
                                                options={tbl_options} version='4'>
                                    <TableHeaderColumn dataField="boletos" isKey={true} dataSort={true}>Tipo
                                        Boleto</TableHeaderColumn>
                                    <TableHeaderColumn width="80" dataField="BUTACA"
                                                       dataFormat={this.butacaFormatter}
                                                       dataAlign="center">Butaca</TableHeaderColumn>
                                    <TableHeaderColumn width="80" dataField="precio_uni" dataAlign="right"
                                                       dataFormat={this.precioFormatter}>Precio</TableHeaderColumn>
                                    <TableHeaderColumn width="80" dataField="comision" dataAlign="right"
                                                       dataFormat={functions.priceFormatter}>Comisión</TableHeaderColumn>
                                    <TableHeaderColumn width="80" dataField="CANTIDAD" dataAlign="right"
                                                       dataFormat={this.cantidad}>Cant.</TableHeaderColumn>
                                    <TableHeaderColumn width="80" dataField="SUBTOTAL" dataAlign="right"
                                                       dataFormat={this.subtotalFormatter}>SubTotal</TableHeaderColumn>
                                </BootstrapTable>
                            </div>
                        </div>
                    </TabPane>
                    {/* TAB DULCERIA*/}
                    <TabPane tabId="2">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="row">
                                    <div className="col-lg-4 font-weight-bold">
                                        Trans. ID:
                                    </div>
                                    <div className="col-lg-8">
                                        {this.props.params.transaccion_id && this.props.params.transaccion_id}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4 font-weight-bold">
                                        Total Dulcería:
                                    </div>
                                    <div className="col-lg-8">
                                        {this.state.pais == 'peru' && 'S/ '}
                                        {this.props.params.monto_total_dul && functions.priceFormatter(this.props.params.monto_total_dul)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr/>
                        <div className="row">
                            <div className="col-lg-12">
                                <BootstrapTable data={this.state.dul_det} striped={true} hover={true} pagination={true}
                                                options={tbl_options} version='4'>
                                    <TableHeaderColumn dataField="description" dataFormat={this.comboFormatter}
                                                       isKey={true} dataSort={true}>Artículo</TableHeaderColumn>
                                    <TableHeaderColumn width="80" dataField="monto_total"
                                                       dataFormat={functions.priceFormatter}
                                                       dataAlign="right">Precio</TableHeaderColumn>
                                </BootstrapTable>
                            </div>
                        </div>
                    </TabPane>
                </TabContent>
            </div>
        )
    }
}

export default DetalleTrx;
