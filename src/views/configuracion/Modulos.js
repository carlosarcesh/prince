/**
 * Created by Carlos Arce Sherader on 22/02/2018.
 */
import React, {Component} from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter, Button, Alert} from 'reactstrap';

import Loading from '../../components/Loading/Loading';
import base from "../../paths";
import MantenimientoModulos from "./mantenimiento/MantenimientoModulos";
import MantenimientoAplicacion from "./mantenimiento/MantenimientoAplicacion";

class Modulos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            alert: false,
            alert_type: 'danger',
            alert_msg: null,
            modules_data: [],
            module_id: null,
            module_des: null,
            app_data: [],
            data: [],
            showMantenimientoModulo: false,
            showMantenimientoAplicacion: false
        };

        this.onDismissAlert = this.onDismissAlert.bind(this);
        this.cargarModulos = this.cargarModulos.bind(this);
        this.cargarAplicaciones = this.cargarAplicaciones.bind(this);
        this.formatIcon = this.formatIcon.bind(this);
        this.formatVisible = this.formatVisible.bind(this);
        this.showMantenimientoModuloModalToggle = this.showMantenimientoModuloModalToggle.bind(this);
        this.showMantenimientoAplicacionModalToggle = this.showMantenimientoAplicacionModalToggle.bind(this);
    }

    cargarModulos() {
        fetch(base.path.lista_aplicaciones, {
            method: 'GET',
            headers: base.default_headers
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
                this.setState({
                    data
                });
                let tmp_data = [];
                data.forEach(element => {
                    if (element.NApl_IdPadre == null) {
                        tmp_data.push(element);
                    }
                });
                this.setState({
                    modules_data: tmp_data
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

    cargarAplicaciones(module_id) {
        if (module_id) {
            this.setState({module_id});
            let tmp_app = [];
            this.state.data.forEach(element => {
                if (element.NApl_IdPadre == module_id) {
                    tmp_app.push(element);
                }
            });
            this.setState({
                app_data: tmp_app
            });
        } else {
            this.setState({
                app_data: []
            });
        }
    }

    onDismissAlert() {
        this.setState({
            alert: false
        });
    }

    formatIcon(cell, row) {
        return (
            <i className={row.CApl_Icono}>{''}</i>
        );
    }

    formatVisible(cell, row) {
        if (row.NApl_Visible == 1) {
            return (
                <i className="icon-like text-green">{''}</i>
            );
        } else {
            return (
                <i className="icon-dislike">{''}</i>
            );
        }
    }

    showMantenimientoModuloModalToggle() {
        this.setState({
            showMantenimientoModulo: !this.state.showMantenimientoModulo
        });
    }

    showMantenimientoAplicacionModalToggle() {
        this.setState({
            showMantenimientoAplicacion: !this.state.showMantenimientoAplicacion
        });
    }

    componentWillMount() {
        this.cargarModulos();
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
                        Módulos
                    </div>
                    <div className="card-body">
                        <Alert color={this.state.alert_type} isOpen={this.state.alert} toggle={this.onDismissAlert}>
                            {this.state.alert_msg}
                        </Alert>
                        <div className="row">
                            <div className="col-lg-1">
                                <input type="text" className="form-control-plaintext" readOnly={true} value="Módulo"/>
                            </div>
                            <div className="col">
                                <select name="cboModulos" id="cboModulos" className="form-control"
                                        onChange={(e) => {
                                            this.cargarAplicaciones(e.target.value)
                                        }}>
                                    <option value="">Seleccionar</option>
                                    {
                                        this.state.modules_data.map((param, i) =>
                                            <option
                                                value={param.NApl_Id} key={i}>
                                                {param.CApl_DesApl}
                                            </option>
                                        )
                                    }
                                </select>
                            </div>
                            <div className="col-lg-4">
                                <button className="btn btn-danger"
                                        onClick={this.showMantenimientoModuloModalToggle.bind(this)}>
                                    Editar Módulo
                                </button>
                                {' '}
                                <button className="btn btn-success"
                                        onClick={this.showMantenimientoModuloModalToggle.bind(this)}>
                                    Crear Módulo
                                </button>
                            </div>
                        </div>
                        {this.state.app_data.length > 0 &&
                        <div className="row">
                            <div className="col-lg-12">
                                <BootstrapTable data={this.state.app_data} striped={true} hover={true}
                                                pagination={true}
                                                options={tbl_options} version="4">
                                    <TableHeaderColumn width="80" dataField="NApl_Id" isKey={true} dataAlign="center"
                                                       dataSort={true}>ID</TableHeaderColumn>
                                    <TableHeaderColumn dataField="CApl_DesApl" dataAlign="left"
                                                       dataSort={true}>Descripción</TableHeaderColumn>
                                    <TableHeaderColumn width="80" dataField="CApl_Icono" dataAlign="center"
                                                       dataFormat={this.formatIcon}>Ícono</TableHeaderColumn>
                                    <TableHeaderColumn width="80" dataField="NApl_Visible" dataAlign="center"
                                                       dataFormat={this.formatVisible}>Visible</TableHeaderColumn>
                                    <TableHeaderColumn dataField="CApl_Ruta" dataAlign="left"
                                                       dataSort={true}>Ruta</TableHeaderColumn>
                                </BootstrapTable>
                            </div>
                            <div className="col-lg-12 text-center">
                                <button className="btn btn-primary" onClick={this.showMantenimientoAplicacionModalToggle.bind(this)}>
                                    <i className="icon-plus"></i> Agregar Aplicación
                                </button>
                            </div>
                        </div>
                        }
                    </div>
                </div>

                {/* MODAL: MANTENIMIENTO MODULO */}
                <Modal isOpen={this.state.showMantenimientoModulo} toggle={this.showMantenimientoModuloModalToggle}>
                    <ModalHeader toggle={this.showMantenimientoModuloModalToggle}>Mantenimiento Módulo</ModalHeader>
                    <ModalBody>
                        <MantenimientoModulos/>
                    </ModalBody>
                    <ModalFooter>
                        <div className="small">
                            <i><span className="text-red">*</span> Campos obligatorios.</i>
                        </div>
                    </ModalFooter>
                </Modal>

                {/* MODAL: MANTENIMIENTO APLICACION */}
                <Modal isOpen={this.state.showMantenimientoAplicacion} toggle={this.showMantenimientoAplicacionModalToggle}>
                    <ModalHeader toggle={this.showMantenimientoAplicacionModalToggle}>Mantenimiento Aplicación</ModalHeader>
                    <ModalBody>
                        <MantenimientoAplicacion appParams={this.state.app_data}/>
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

export default Modulos;