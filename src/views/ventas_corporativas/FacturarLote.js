import React, {Component} from 'react';
import {find, sumBy} from 'lodash';
import {TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import CardWrap from "../../components/Container/CardWrap";
import {BootstrapTable, TableHeaderColumn} from "react-bootstrap-table";
import base from "../../paths";

import classnames from 'classnames';
import functions from "../../utils/functions";

class FacturarLote extends Component {
    constructor(props) {
        super(props);

        this.state = {
            alert: false,
            alert_type: 'danger',
            alert_msg: null,
            loading: false,
            client_order: null,
            tipo: null,
            vendedor: null,
            factura: [],
            taquilla: [],
            dulceria: [],
            activeTab: '1',
            guardar_active: false,
            facturar_active: false,
            class_btn_check: 'btn-primary',
            vendedores: [],
        };

        this.onDismissAlert = this.onDismissAlert.bind(this);
        this.getDetalleFactura = this.getDetalleFactura.bind(this);
    }

    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    getVendedores() {
        fetch(base.path.get_vendedores, {
            method: 'POST',
            headers: base.default_headers,
            body: JSON.stringify({
                nombre: null
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            if (data.status === 'error') {
                this.setState({
                    alert: true,
                    alert_type: 'danger',
                    alert_msg: '¡Error! ' + data.message
                });
            } else {
                this.setState({
                    vendedores: data,
                });
            }
        }).catch(err => {
            console.log(err);

            this.setState({
                alert: true,
                alert_type: 'danger',
                alert_msg: '¡Error! ' + err
            });
        });
    }

    getDetalleFactura() {
        this.setState({
            loading: true
        });

        let lote = this.props.params.LOTE;
        fetch(base.path.get_detalle_factura, {
            method: 'POST',
            headers: base.default_headers,
            body: JSON.stringify({
                orden: lote
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            if (data.status === 'error') {
                this.setState({
                    loading: false,
                    alert: true,
                    alert_type: 'danger',
                    alert_msg: '¡Error! ' + data.message
                });
            } else {
                this.setState({
                    factura: data[0][0],
                    taquilla: data[1],
                    dulceria: data[2],
                    loading: false
                });
            }
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

    checkClient() {
        this.setState({
            loading: true,
            class_btn_check: 'btn-primary',
            guardar_active: false,
            facturar_active: false,
        });

        let cliente = this.state.factura.DOC_CLIENTE;
        fetch(base.path.check_cliente, {
            method: 'POST',
            headers: base.default_headers,
            body: JSON.stringify({
                cliente
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            if (data.status === 'error') {
                this.setState({
                    loading: false,
                    alert: true,
                    alert_type: 'danger',
                    alert_msg: '¡Error! El cliente registrado en VISTA no es correcto.',
                    class_btn_check: 'btn-danger',
                    guardar_active: false,
                    facturar_active: false,
                });
            } else {
                this.setState({
                    loading: false,
                    class_btn_check: 'btn-success',
                    guardar_active: true,
                });
            }
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

    btnPriceCard() {
        return(
            <button className="btn btn-default">
                <i className="fa fa-eye">{''}</i>
            </button>
        );
    }

    onDismissAlert() {
        this.setState({
            alert: false
        });
    }

    formContent() {
        if(this.state.factura)
        return(
            <form className="row">
                <div className="col-sm-4">
                    <div className="form-group row">
                        <label htmlFor="inputClientOrder" className="col-sm-4 col-form-label">Lote</label>
                        <div className="col-sm-8">
                            <input type="text" id="inputClientOrder" className="form-control" value={this.props.params.LOTE} disabled/>
                        </div>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div className="form-group row">
                        <label htmlFor="inputTipo" className="col-sm-5 col-form-label">Tipo Lote</label>
                        <div className="col-sm-7">
                            <input type="text" id="inputTipo" className="form-control" value={this.state.factura.TIPO_LOTE} disabled/>
                        </div>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div className="form-group row">
                        <label htmlFor="cboDocTipo"
                               className="col-sm-5 col-form-label">Tipo Comp.</label>
                        <div className="col-sm-7">
                            <select className="form-control" id="cboDocTipo" onChange={ (e) => {
                                this.setState({tipo_comp: e.target.value})
                            }  }>
                                <option value="01">Factura</option>
                                <option value="03">Boleta</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="col-lg-12 m-3">{''}</div>
                <div className="col-sm-6">
                    <div className="form-group row">
                        <label htmlFor="inputCliente" className="col-sm-4 col-form-label">Doc. Cliente</label>
                        <div className="col-sm-8">
                            <input type="text" id="inputCliente" name="inputCliente" value={this.state.factura.DOC_CLIENTE} className="form-control col-lg-10 float-left" disabled={true}/>
                            <button className={"btn2 " + this.state.class_btn_check + " float-left"} onClick={this.checkClient.bind(this)}>
                                ✔
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="form-group row">
                        <label htmlFor="inputNombreCliente" className="col-sm-4 col-form-label">Nom. Cliente</label>
                        <div className="col-sm-8">
                            <input type="text" id="inputNombreCliente" className="form-control" value={this.state.factura.NOM_CLIENTE} disabled/>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="form-group row">
                        <label htmlFor="inputDirCliente" className="col-sm-4 col-form-label">Dir. Cliente</label>
                        <div className="col-sm-8">
                            <input type="text" id="inputDirCliente" className="form-control" value={this.state.factura.DIRECCION} disabled/>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="form-group row">
                        <label htmlFor="inputTermPago" className="col-sm-4 col-form-label">Term. Pago</label>
                        <div className="col-sm-8">
                            <input type="text" id="inputTermPago" className="form-control" value={this.state.factura.TERMINO_PAGO} disabled/>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="form-group row">
                        <label htmlFor="inputVendedor" className="col-sm-4 col-form-label">Vendedor</label>
                        <div className="col-sm-8">
                            <select className="form-control" id="inputVendedor" onChange={(e) => {
                                this.setState({vendedor: e.target.value})
                            }} value={this.state.factura.VENDEDOR}>
                                <option value="">Seleccionar</option>
                                {
                                    this.state.vendedores.map((param, i) =>
                                        <option
                                            value={param.SALESREP_ID} key={i}>
                                            {param.NAME}
                                        </option>
                                    )
                                }
                            </select>
                        </div>
                    </div>
                </div>
            </form>
        );
    }

    wrapTabs() {
        return (
            <div>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '1' })}
                            onClick={() => { this.toggleTab('1'); }}
                        >
                            Taquilla
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '2' })}
                            onClick={() => { this.toggleTab('2'); }}
                        >
                            Dulcería
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                        {this.wrapTaquilla()}
                    </TabPane>
                    <TabPane tabId="2">
                        {this.wrapDulceria()}
                    </TabPane>
                </TabContent>
            </div>
        );
    }

    wrapTaquilla(){
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
            paginationPosition: 'bottom',
            noDataText: 'No se encontraron resultados.'
        };

        return(
            <BootstrapTable data={this.state.taquilla} striped={true} hover={true} pagination={true}
                            options={tbl_options} version='4'>
                <TableHeaderColumn width="150" dataField="CODIGO_VOUCHER" isKey={true} dataAlign="center"
                                   dataSort={true}>Voucher</TableHeaderColumn>
                <TableHeaderColumn width="150" dataField="VOUCHER" dataSort={true} dataAlign="center">Tipo</TableHeaderColumn>
                <TableHeaderColumn dataField="CANTIDAD" dataAlign="right">Cantidad</TableHeaderColumn>
                <TableHeaderColumn width="150" dataField="PRECIO" dataFormat={functions.priceFormatter}
                                   dataSort={true} dataAlign="right">Precio</TableHeaderColumn>
                <TableHeaderColumn width="120" dataField="TOTAL" dataFormat={functions.priceFormatter}
                                   dataSort={true} dataAlign="right">Total</TableHeaderColumn>
                <TableHeaderColumn width="120" dataField="ESTADO" dataFormat={this.btnPriceCard}>PriceCard</TableHeaderColumn>
            </BootstrapTable>
        );
    }

    wrapDulceria() {
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
            paginationPosition: 'bottom',
            noDataText: 'No se encontraron resultados.'
        };

        return(
            <BootstrapTable data={this.state.dulceria} striped={true} hover={true} pagination={true}
                            options={tbl_options} version='4'>
                <TableHeaderColumn width="150" dataField="CODIGO_VOUCHER" isKey={true} dataAlign="center"
                                   dataSort={true}>Voucher</TableHeaderColumn>
                <TableHeaderColumn width="150" dataField="VOUCHER" dataSort={true} dataAlign="center">Tipo</TableHeaderColumn>
                <TableHeaderColumn dataField="CANTIDAD" dataAlign="right">Cantidad</TableHeaderColumn>
                <TableHeaderColumn width="150" dataField="PRECIO" dataFormat={functions.priceFormatter}
                                   dataSort={true} dataAlign="right">Precio</TableHeaderColumn>
                <TableHeaderColumn width="120" dataField="TOTAL" dataFormat={functions.priceFormatter}
                                   dataSort={true} dataAlign="right">Total</TableHeaderColumn>
                <TableHeaderColumn width="120" dataField="ESTADO">PriceCard</TableHeaderColumn>
            </BootstrapTable>
        );
    }

    wrapButtons() {
        return(
            <div className="row mt-3">
                <div className="col-lg-4 text-right">
                    <button className="btn btn-primary" disabled={!this.state.guardar_active}>Guardar</button>
                </div>
                <div className="col-lg-4 text-center">
                    <button className="btn btn-primary" disabled={!this.state.facturar_active}>Facturar</button>
                </div>
                <div className="col-lg-4">
                    <button className="btn btn-primary" onClick={this.props.toggle}>Cancelar</button>
                </div>
            </div>
        );
    }


    mainContent() {
        return(
            <div>
                {this.formContent()}
                {this.wrapTabs()}
                {this.wrapButtons()}
            </div>
        );
    }

    render() {
        return (<CardWrap
            title="Facturar Lote"
            alert={this.state.alert}
            alertType={this.state.alert_type}
            alertMsg={this.state.alert_msg}
            loading={this.state.loading}
        >
            {this.mainContent()}
        </CardWrap>);
    };

    componentWillMount() {
        this.getVendedores();
    }

    componentDidMount() {
        this.getDetalleFactura();
    }
}

export default FacturarLote;
