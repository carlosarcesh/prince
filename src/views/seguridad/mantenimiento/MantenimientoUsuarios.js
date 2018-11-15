/**
 * Created by Carlos Arce Sherader on 27/02/2018.
 */
import React, {Component} from 'react';
import Loading from '../../../components/Loading/Loading';
import {Alert} from 'reactstrap';
import base from "../../../paths";

class MantenimientoUsuarios extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            alert: false,
            alert_type: 'danger',
            alert_msg: null,
            loading: false,
            roles_data: [],
            modules_data: [],
            usuario: null,
            nro_doc: null,
            apellidos: null,
            nombres: null,
            email: null,
            password: null,
            rol: null,
            estado: null,
            module: null
        };

        this.modificarUsuario = this.modificarUsuario.bind(this);
        this.crearUsuario = this.crearUsuario.bind(this);
        this.loadRoles = this.loadRoles.bind(this);
        this.loadModules = this.loadModules.bind(this);
    }

    loadModules() {
        this.setState({
            isEdit: this.props.isEdit
        });
        fetch(base.path.lista_aplicaciones, {
            method: 'GET',
            headers: base.default_headers
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

    loadRoles() {
        this.setState({
            isEdit: this.props.isEdit
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
                    roles_data: data
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

    modificarUsuario() {
        var _nro_doc = this.state.nro_doc || this.props.params.CUsu_NDoc || null,
            _usuario = this.state.usuario || this.props.params.CUsu_Usuario || null,
            _nombres = this.state.nombres || this.props.params.CUsu_Nombre || null,
            _apellidos = this.state.apellidos || this.props.params.CUsu_Apellidos || null,
            _email = this.state.email || this.props.params.CUsu_Email || null,
            _rol = this.state.rol || this.props.params.CRol_Id || null,
            _estado = this.state.estado || this.props.params.NUsu_Estado || null,
            _pass = this.state.password || null;

        if (_nro_doc == '' || _nro_doc == null || _nro_doc == undefined) {
            this.setState({
                alert: true,
                alert_type: 'danger',
                alert_msg: 'El nro. de documento no puede estar vacío.'
            });
            return;
        }

        if (_nombres == '' || _nombres == null || _nombres == undefined) {
            this.setState({
                alert: true,
                alert_type: 'danger',
                alert_msg: 'El nombre no puede estar vacío.'
            });
            return;
        }

        if (_apellidos == '' || _apellidos == null || _apellidos == undefined) {
            this.setState({
                alert: true,
                alert_type: 'danger',
                alert_msg: 'El apellido no puede estar vacío.'
            });
            return;
        }

        fetch(base.path.editar_usuario, {
            method: 'POST',
            headers: base.default_headers,
            body: JSON.stringify({
                usuario: _usuario,
                nro_doc: _nro_doc,
                nombres: _nombres,
                apellidos: _apellidos,
                email: _email,
                rol: _rol,
                estado: _estado,
                clave: _pass,
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
                    alert_msg: 'Usuario editado con éxito.'
                });

                this.props.actionBuscar();
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

    crearUsuario() {
        var _nro_doc = this.state.nro_doc,
            _usuario = this.state.usuario,
            _nombres = this.state.nombres,
            _apellidos = this.state.apellidos,
            _email = this.state.email,
            _rol = this.state.rol,
            _estado = this.state.estado || this.props.params.NUsu_Estado || null,
            _pass = this.state.password;

        if (_nro_doc == '' || _nro_doc == null || _nro_doc == undefined) {
            this.setState({
                alert: true,
                alert_type: 'danger',
                alert_msg: 'El nro. de documento no puede estar vacío.'
            });
            return;
        }

        if (_nombres == '' || _nombres == null || _nombres == undefined) {
            this.setState({
                alert: true,
                alert_type: 'danger',
                alert_msg: 'El nombre no puede estar vacío.'
            });
            return;
        }

        if (_apellidos == '' || _apellidos == null || _apellidos == undefined) {
            this.setState({
                alert: true,
                alert_type: 'danger',
                alert_msg: 'El apellido no puede estar vacío.'
            });
            return;
        }

        if (_pass == '' || _pass == null || _pass == undefined) {
            this.setState({
                alert: true,
                alert_type: 'danger',
                alert_msg: 'La contraseña no puede estar vacía.'
            });
            return;
        }

        fetch(base.path.insertar_usuario, {
            method: 'PUT',
            headers: base.default_headers,
            body: JSON.stringify({
                nro_doc: _nro_doc,
                usuario: _usuario,
                nombres: _nombres,
                apellidos: _apellidos,
                email: _email,
                rol: _rol,
                estado: _estado,
                clave: _pass,
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
                    alert_msg: 'Usuario insertado con éxito.'
                }, () => {
                    this.props.actionBuscar();
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

    GuardarUsuario() {
        this.setState({
            alert: false
        });

        if (this.props.isEdit) {
            return this.modificarUsuario();
        } else {
            return this.crearUsuario();
        }
    }

    componentWillMount() {
        this.loadRoles();
    }

    render() {

        return (
            <div className="animated fadeIn">
                <Loading show={this.state.loading}/>
                <div className="row">
                    <div className="col-lg-12">
                        <Alert color={this.state.alert_type} isOpen={this.state.alert} toggle={this.onDismissAlert}>
                            {this.state.alert_msg}
                        </Alert>
                    </div>
                    <div className="col-lg-6">
                        <div className="form-group">
                            <label htmlFor="inputUsuario"><b>Usuario</b></label>
                            <input type="text" id="inputUsuario" className="form-control"
                                   defaultValue={this.props.params && this.props.params.CUsu_Usuario}
                                   onChange={(e) => {
                                       this.setState({usuario: e.target.value})
                                   }}
                                   disabled={this.props.isEdit}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputApellidos"><b>Apellidos</b></label>
                            <input type="text" id="inputApellidos" className="form-control"
                                   defaultValue={this.props.params && this.props.params.CUsu_Apellidos}
                                   onChange={(e) => {
                                       this.setState({apellidos: e.target.value})
                                   }}/>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="form-group">
                            <label htmlFor="inputNDoc"><b><span className="text-red">*</span> Nro. Documento</b></label>
                            <input type="text" id="inputNDoc" className="form-control"
                                   defaultValue={this.props.params && this.props.params.CUsu_NDoc} onChange={(e) => {
                                this.setState({nro_doc: e.target.value})
                            }}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputNombres"><b>Nombres</b></label>
                            <input type="text" id="inputNombres" className="form-control"
                                   defaultValue={this.props.params && this.props.params.CUsu_Nombre} onChange={(e) => {
                                this.setState({nombres: e.target.value})
                            }}/>
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="form-group">
                            <label htmlFor="inputEmail"><b>Email</b></label>
                            <input type="text" id="inputEmail" className="form-control"
                                   defaultValue={this.props.params && this.props.params.CUsu_Email} onChange={(e) => {
                                this.setState({email: e.target.value})
                            }}/>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="form-group">
                            <label htmlFor="cboRango"><b>Rol</b></label>
                            <select id="cboRango" className="form-control"
                                    value={this.state.rol ? this.state.rol : this.props.params && this.props.params.CRol_Id}
                                    onChange={(e) => {
                                        this.setState({rol: e.target.value})
                                    }}>
                                <option value="">Seleccionar</option>
                                {
                                    this.state.roles_data.map((param, i) =>
                                        <option
                                            value={param.NRol_Id} key={i}>
                                            {param.CRol_Desc}
                                        </option>
                                    )
                                }
                            </select>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="form-group">
                            <label htmlFor="inputPassword"><b>Contraseña</b> {this.props.isEdit &&
                            <small>(Solo si desea cambiar)</small>}</label>
                            <input type="password" className="form-control" onChange={(e) => {
                                this.setState({password: e.target.value})
                            }}/>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="form-group">
                            <label htmlFor="cboEstado"><b>Estado</b></label>
                            <select id="cboEstado" className="form-control"
                                    value={this.state.estado ? this.state.estado : this.props.params && this.props.params.NUsu_Estado}
                                    onChange={(e) => {
                                        this.setState({estado: e.target.value})
                                    }}>
                                <option value="">Seleccionar</option>
                                <option value="1">Activo</option>
                                <option value="0">Inactivo</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-lg-12 text-center">
                        <button className="btn btn-primary" onClick={this.GuardarUsuario.bind(this)}>Guardar Usuario
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default MantenimientoUsuarios;