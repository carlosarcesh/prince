/**
 * Created by Carlos Arce Sherader on 22/02/2018.
 */
import React, {Component} from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter, Button, Alert} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import Loading from '../../components/Loading/Loading';

import base from '../../paths';

import MantenimientoUsuario from './mantenimiento/MantenimientoUsuarios';

class Usuarios extends Component {
    constructor(props) {
        super(props);

        this.state = {
            alert: false,
            alert_type: 'danger',
            alert_msg: null,
            usuarios_data: [],
            usuario: null,
            loading: false,
            showMantenimiento: false,
            user_data: [],
            is_edit: false
        };

        this.onDismissAlert = this.onDismissAlert.bind(this);
        this.buscarUsuarios = this.buscarUsuarios.bind(this);
        this.formatNombres = this.formatNombres.bind(this);
        this.formatEstado = this.formatEstado.bind(this);
        this.btnModificar = this.btnModificar.bind(this);
        this.btnCrear = this.btnCrear.bind(this);
        this.showMantenimientoModalToggle = this.showMantenimientoModalToggle.bind(this);
    }

    onDismissAlert() {
        this.setState({
            alert: false
        });
    }

    buscarUsuarios() {
        var _usuario = this.state.usuario;

        this.setState({
            loading: true
        });

        fetch(base.path.get_usuarios, {
            method: 'POST',
            headers: base.default_headers,
            body: JSON.stringify({
                usuario: _usuario
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
                    usuarios_data: data
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

    formatNombres(cell, row) {
        return row.CUsu_Apellidos + ', ' + row.CUsu_Nombre;
    }

    formatEstado(cell, row) {
        if (row.NUsu_Estado == '1') {
            return '<span class="badge badge-success">Activo</span>';
        } else {
            return '<span class="badge badge-danger">Inactivo</span>';
        }
    }

    btnModificar(cell, row) {
        return (
            <Button color="primary" onClick={(e) => {
                this.showMantenimientoModalToggle(row, true);
            }}>
                <i className="fa fa-edit">{''}</i>
            </Button>
        );
    }

    btnCrear() {
        this.showMantenimientoModalToggle(null, false);
    }

    showMantenimientoModalToggle(data, is_edit) {
        this.setState({
            showMantenimiento: !this.state.showMantenimiento,
            user_data: data,
            is_edit
        });
    }

    componentWillMount() {
        this.buscarUsuarios();
    }

    render() {
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

        return (
            <div className="animated fadeIn">
                <Loading show={this.state.loading}/>
                <div className="card">
                    <div className="card-header">
                        Administrador de Usuarios
                    </div>
                    <div className="card-body">
                        <Alert color={this.state.alert_type} isOpen={this.state.alert} toggle={this.onDismissAlert}>
                            {this.state.alert_msg}
                        </Alert>
                        <div className="row">
                            <div className="col-lg-4">
                                <div className="form-group">
                                    <label htmlFor="inputUser"><span className="text-red">*</span> Usuario</label>
                                    <input type="text" className="form-control"
                                           onChange={e => this.setState({usuario: e.target.value})}/>
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <button className="btn btn-primary pull-left" onClick={this.buscarUsuarios.bind(this)}>
                                    <i className="fa fa-search" aria-hidden="true">{''}</i> Buscar
                                </button>
                                <button className="btn btn-success pull-right" onClick={this.btnCrear.bind(this)}>
                                    <i className="fa fa-user-plus" aria-hidden="true">{''}</i> Crear Nuevo
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <BootstrapTable data={this.state.usuarios_data} striped={true} hover={true}
                                                pagination={true}
                                                options={tbl_options} version="4">
                                    <TableHeaderColumn width="80" dataField="NUsu_Id" isKey={true} dataAlign="center"
                                                       dataSort={true}>ID</TableHeaderColumn>
                                    <TableHeaderColumn width="150" dataField="CUsu_Usuario" dataAlign="center"
                                                       dataSort={true}>Usuario</TableHeaderColumn>
                                    <TableHeaderColumn width="120" dataField="CUsu_NDoc" dataAlign="center"
                                                       dataSort={true}># Documento</TableHeaderColumn>
                                    <TableHeaderColumn dataField="Nombres" dataAlign="center"
                                                       dataSort={true}
                                                       dataFormat={this.formatNombres}>Nombres</TableHeaderColumn>
                                    <TableHeaderColumn dataField="CUsu_Email" dataAlign="center"
                                                       dataSort={false}>Email</TableHeaderColumn>
                                    <TableHeaderColumn dataField="CRol_Desc" dataAlign="center"
                                                       dataSort={false}>Rol</TableHeaderColumn>
                                    <TableHeaderColumn width="80" dataField="NUsu_Estado" dataAlign="center"
                                                       dataFormat={this.formatEstado}>Estado</TableHeaderColumn>
                                    <TableHeaderColumn width="80" dataField="Modificar" dataAlign="center"
                                                       columnTitle="Editar Usuario"
                                                       dataSort={false}
                                                       dataFormat={this.btnModificar}>{''}</TableHeaderColumn>
                                </BootstrapTable>
                            </div>
                        </div>
                        <div className="small">
                            <i><span className="text-red">*</span> Campos obligatorios.</i>
                        </div>
                    </div>
                </div>

                {/* MODAL: MANTENIMIENTO USUARIO */}
                <Modal isOpen={this.state.showMantenimiento} toggle={this.showMantenimientoModalToggle}>
                    <ModalHeader toggle={this.showMantenimientoModalToggle}>Mantenimiento Usuario</ModalHeader>
                    <ModalBody>
                        <MantenimientoUsuario params={this.state.user_data} isEdit={this.state.is_edit}
                                              actionBuscar={this.buscarUsuarios.bind(this)}/>
                    </ModalBody>
                    <ModalFooter>
                        <div className="small">
                            <i><span className="text-red">*</span> Campos obligatorios.</i>
                        </div>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default Usuarios;