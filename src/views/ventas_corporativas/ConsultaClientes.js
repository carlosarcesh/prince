import React, {Component} from 'react';
import Loading from '../../components/Loading/Loading';
import {Alert} from 'reactstrap';
import base from "../../paths";
import {BootstrapTable, TableHeaderColumn} from "react-bootstrap-table";

class ConsultaClientes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            alert: false,
            alert_type: 'danger',
            alert_msg: null,
            loading: false,
            nombre: null,
            documento: null,
            clientes: []
        };

        this.onDismissAlert = this.onDismissAlert.bind(this);
        this.getClientes = this.getClientes.bind(this);
        this.selectClient = this.selectClient.bind(this);
    }

    getClientes() {
        this.setState({
            loading: true
        });

        this.onDismissAlert();

        var {
            nombre,
            documento
        } = this.state;

        if ((nombre === null || nombre === '') && (documento === null || documento === '')) {
            this.setState({
                loading: false,
                alert: true,
                alert_type: 'danger',
                alert_msg: '¡Error! Uno de los campos es obligatorio.'
            });

            return;
        }

        if (nombre !== null) {
            if (nombre.length > 0 && nombre.length < 3) {
                this.setState({
                    loading: false,
                    alert: true,
                    alert_type: 'danger',
                    alert_msg: '¡Error! Ingrese al menos 3 caracteres en el nombre.'
                });

                return;
            }
        }

        fetch(base.path.get_clientes, {
            method: 'POST',
            headers: base.default_headers,
            body: JSON.stringify({
                nombre,
                documento
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
                    clientes: data,
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

    selectClient(cell, row) {
        return (
            <button className="btn2 btn-success btn-sm" onClick={e => {
                this.props.paramsCliente(row.CUSTOMER_ID, row.CLIENTE);
            }}>
                >>
            </button>
        );
    }

    onDismissAlert() {
        this.setState({
            alert: false
        });
    }

    render() {
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
            <div className="animated fadeIn">
                <Loading show={this.state.loading}/>
                <div className="card">
                    <div className="card-header">
                        Consulta de Clientes
                    </div>
                    <div className="card-body">
                        <Alert color={this.state.alert_type} isOpen={this.state.alert} toggle={this.onDismissAlert}>
                            {this.state.alert_msg}
                        </Alert>
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="form-group row">
                                    <label htmlFor="inputNombre" className="col-sm-3 col-form-label">Nombre</label>
                                    <div className="col-sm-9">
                                        <input type="text" id="inputNombre" className="form-control"
                                               onChange={e => this.setState({nombre: e.target.value})}/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="form-group row">
                                    <label htmlFor="inputDocumento"
                                           className="col-sm-4 col-form-label">Documento</label>
                                    <div className="col-sm-8">
                                        <input type="text" id="inputDocumento" className="form-control"
                                               onChange={e => this.setState({documento: e.target.value})}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <button type="button" className="btn btn-default pull-left" onClick={this.props.toggle}>
                                    Cancelar
                                </button>
                                <button type="button" className="btn btn-primary pull-right" onClick={this.getClientes}>
                                    <i className="fa fa-search" aria-hidden="true"></i> Buscar
                                </button>
                            </div>
                        </div>

                        <BootstrapTable data={this.state.clientes} striped={true} hover={true} pagination={true}
                                        options={tbl_options} version='4'>
                            <TableHeaderColumn width="120" dataField="RUC" isKey={true}
                                               dataSort={true}>RUC</TableHeaderColumn>
                            <TableHeaderColumn dataField="CLIENTE" dataSort={true}>Cliente</TableHeaderColumn>
                            <TableHeaderColumn dataField="DIRECCION">Dirección</TableHeaderColumn>
                            <TableHeaderColumn width="50" dataFormat={this.selectClient}
                                               dataAlign="center"></TableHeaderColumn>
                        </BootstrapTable>
                    </div>
                </div>
            </div>
        );
    }
}

export default ConsultaClientes;
