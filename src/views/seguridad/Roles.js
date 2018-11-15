/**
 * Created by Carlos Arce Sherader on 22/02/2018.
 */
import React, {Component} from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter, Alert, Button} from 'reactstrap';
import Select from 'react-select';

import Loading from '../../components/Loading/Loading';
import MantenimientoRol from './mantenimiento/MantenimientoRol';
import base from "../../paths";

import '../../../scss/vendors/react-select.css';

class Roles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            alert: false,
            alert_type: 'danger',
            alert_msg: null,
            modules_data: [],
            roles_data: [],
            rol_data: [],
            showMantenimientoRol: false,
            is_edit: false,
            crear_disabled: true,
            module_name: null,
            selectedOption: '',
            roles_multi: [],
            modalConfirm: false
        };

        this.onDismissAlert = this.onDismissAlert.bind(this);
        this.cargarModulos = this.cargarModulos.bind(this);
        this.cargarRoles = this.cargarRoles.bind(this);
        this.showMantenimientoRolModalToggle = this.showMantenimientoRolModalToggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.eliminarRol = this.eliminarRol.bind(this);
        this.openEditar = this.openEditar.bind(this);
        this.openCrear = this.openCrear.bind(this);
        this.toggleConfirm = this.toggleConfirm.bind(this);
    }

    cargarModulos(rol) {
        this.setState({
            alert: false,
            loading: true
        });

        fetch(base.path.modulos_rol, {
            method: 'POST',
            headers: base.default_headers,
            body: JSON.stringify({
                rol
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
                this.setState({
                    modules_data: data
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

    cargarRoles() {

        this.setState({
            roles_multi: [],
            loading: true,
            isEdit: this.props.isEdit,
        });

        fetch(base.path.get_roles, {
            method: 'POST',
            headers: base.default_headers,
            body: JSON.stringify({
                rol: null
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            if (data.status === 'error') {
                this.setState({
                    alert: true,
                    alert_type: 'danger',
                    alert_msg: data.message
                });
            } else {
                this.setState({
                    roles_data: data,
                });
                data.forEach(element => {
                    this.state.roles_multi.push({value: element.NRol_Id, label: element.CRol_Desc});
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

    eliminarRol() {
        var id = this.state.selectedOption;

        fetch(base.path.eliminar_rol, {
            method: 'DELETE',
            headers: base.default_headers,
            body: JSON.stringify({
                id
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            if (data.status === 'error') {
                this.setState({
                    alert: true,
                    alert_type: 'danger',
                    alert_msg: data.message
                });
            } else {
                this.setState({
                    alert: true,
                    alert_type: 'success',
                    alert_msg: 'Rol eliminado con éxito.',
                    modules_data: []
                }, () => {
                    this.toggleConfirm();
                    this.cargarRoles();
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

    openEditar() {
        this.showMantenimientoRolModalToggle(true);
    }

    openCrear() {
        this.showMantenimientoRolModalToggle(false);
    }

    showMantenimientoRolModalToggle(is_edit) {
        this.setState({
            showMantenimientoRol: !this.state.showMantenimientoRol,
            is_edit
        });
    }

    onDismissAlert() {
        this.setState({
            alert: false
        });
    }

    componentWillMount() {
        this.cargarRoles();
    }

    handleChange(value) {
        this.setState({selectedOption: value});
        this.cargarModulos(value);
    }

    rowClassNameFormat(row, rowIdx) {
        if (row.NApl_Visible == 0) {
            return 'td-row-is-not-visible';
        }

        return row.NApl_IdPadre === null ? 'td-row-is-parent' : '';
    }

    toggleConfirm() {
        this.setState({
            modalConfirm: !this.state.modalConfirm
        });
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
                        Roles
                    </div>
                    <div className="card-body">
                        <Alert color={this.state.alert_type} isOpen={this.state.alert} toggle={this.onDismissAlert}>
                            {this.state.alert_msg}
                        </Alert>
                        <div className="row">
                            <div className="col-lg-1">
                                <input type="text" className="form-control-plaintext" readOnly={true} value="Rol"/>
                            </div>
                            <div className="col">
                                <Select
                                    name="form-field-name"
                                    simpleValue
                                    value={this.state.selectedOption}
                                    onChange={this.handleChange}
                                    options={this.state.roles_multi}
                                    placeholder="Seleccione un rol."
                                />
                            </div>
                            <div className="col-lg-3 text-center">
                                <button className="btn btn-primary" onClick={this.openCrear}>
                                    <i className="icon-plus"></i> Agregar Rol
                                </button>
                            </div>
                        </div>
                        <hr/>
                        {this.state.modules_data.length > 0 &&
                        <div className="row">
                            <div className="col-lg-12">
                                <BootstrapTable data={this.state.modules_data}
                                                striped={false}
                                                hover={true}
                                                pagination={true}
                                                trClassName={this.rowClassNameFormat}
                                                options={tbl_options} version="4">
                                    <TableHeaderColumn width="80" dataField="NRolAp_Id" isKey={true}
                                                       dataAlign="center">ID</TableHeaderColumn>
                                    <TableHeaderColumn dataField="CApl_DesApl"
                                                       dataAlign="left">Descripción</TableHeaderColumn>
                                </BootstrapTable>
                            </div>
                            <div className="col-lg-12 text-right">
                                <button className="btn btn-success" onClick={this.openEditar.bind(this)}>
                                    <i className="fa fa-edit"></i> Modificar Rol
                                </button>
                                {' '}
                                <button className="btn btn-danger" onClick={this.toggleConfirm}>
                                    <i className="icon-trash"></i> Eliminar Rol
                                </button>
                            </div>
                        </div>
                        }
                    </div>
                </div>

                {/* MODAL: MANTENIMIENTO ROL */}
                <Modal isOpen={this.state.showMantenimientoRol} toggle={this.showMantenimientoRolModalToggle}>
                    <ModalHeader toggle={this.showMantenimientoRolModalToggle}>Mantenimiento Rol</ModalHeader>
                    <ModalBody>
                        <MantenimientoRol modules={this.state.modules_data} id={this.state.selectedOption}
                                          isEdit={this.state.is_edit} action={this.handleChange}
                                          actionOnLoad={this.cargarRoles}/>
                    </ModalBody>
                    <ModalFooter>
                        <div className="small">
                            <i><span className="text-red">*</span> Campos obligatorios.</i>
                        </div>
                    </ModalFooter>
                </Modal>

                {/* MODAL: CONFIRM DELETE */}
                <Modal isOpen={this.state.modalConfirm} toggle={this.toggleConfirm} backdrop="static">
                    <ModalHeader toggle={this.toggle}>¡Atención!</ModalHeader>
                    <ModalBody>
                        ¿Desea realmente eliminar el Rol?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.eliminarRol}>Borrar</Button>{' '}
                        <Button color="secondary" onClick={this.toggleConfirm}>Cancelar</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default Roles;