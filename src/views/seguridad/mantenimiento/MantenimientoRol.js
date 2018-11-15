import React, {Component} from 'react';
import _ from 'lodash';
import Loading from '../../../components/Loading/Loading';
import {Alert, FormGroup, Label, Input} from 'reactstrap';
import CheckboxTree from 'react-checkbox-tree';
import base from "../../../paths";

import 'react-checkbox-tree/lib/react-checkbox-tree.css';

class MantenimientoRol extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isEdit: false,
            alert: false,
            alert_type: 'danger',
            alert_msg: null,
            loading: false,
            descripcion: null,
            app_data: [],
            app_list: [],
            tmp_checked: [],
            checked: [],
            expanded: [],
            rol_data: [],
            rol_name: ''
        };

        this.GuardarRol = this.GuardarRol.bind(this);
        this.cargarAplicaciones = this.cargarAplicaciones.bind(this);
        this.addParents = this.addParents.bind(this);
        this.cargarRol = this.cargarRol.bind(this);
    }

    cargarRol() {

        this.setState({
            loading: true,
        });

        fetch(base.path.get_roles, {
            method: 'POST',
            headers: base.default_headers,
            body: JSON.stringify({
                rol: this.props.id
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
                    loading: true,
                    descripcion: data[0].CRol_Desc,
                }, () => {
                    this.props.modules.forEach(element => {
                        this.state.checked.push(parseInt(element.NRolAp_IdAplicacion));
                    });
                    this.setState({
                        loading: false
                    });
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

    addParents() {
        let list = this.state.checked.slice();

        _.uniq(list).forEach(id => {
            let parentidx = _.findIndex(this.state.app_list, {'NApl_Id': parseInt(id)});
            if (this.state.app_list[parentidx].NApl_IdPadre != null) {
                let parent = this.state.app_list[parentidx].NApl_IdPadre.toString();
                list.push(parent);
            }
        });

        return _.uniq(list);
    }

    GuardarRol() {
        if (this.props.isEdit) {
            return this.modificarRol();
        } else {
            return this.crearRol();
        }
    }

    modificarRol() {
        var _id = this.props.id,
            _descripcion = this.state.descripcion,
            _aplicaciones = this.addParents().join(',') + ',';

        if (_descripcion == null || _descripcion == '') {
            this.setState({
                alert: true,
                alert_type: 'danger',
                alert_msg: 'El nombre no puede estar vacío.'
            });
            return;
        }

        if (this.state.checked.length == 0) {
            this.setState({
                alert: true,
                alert_type: 'danger',
                alert_msg: 'Debe seleccionar al menos una aplicación.'
            });
            return;
        }

        fetch(base.path.editar_rol, {
            method: 'POST',
            headers: base.default_headers,
            body: JSON.stringify({
                id: _id,
                descripcion: _descripcion,
                aplicaciones: _aplicaciones
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
                    alert_msg: 'Rol editado con éxito.'
                }, () => {
                    this.props.action(_id);
                    this.props.actionOnLoad();
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

    crearRol() {
        var _descripcion = this.state.descripcion,
            _aplicaciones = this.addParents().join(',') + ',';

        if (_descripcion == null || _descripcion == '') {
            this.setState({
                alert: true,
                alert_type: 'danger',
                alert_msg: 'El nombre no puede estar vacío.'
            });
            return;
        }

        if (this.state.checked.length == 0) {
            this.setState({
                alert: true,
                alert_type: 'danger',
                alert_msg: 'Debe seleccionar al menos una aplicación.'
            });
            return;
        }

        this.setState({
            loading: true
        });

        fetch(base.path.insertar_rol, {
            method: 'PUT',
            headers: base.default_headers,
            body: JSON.stringify({
                id: null,
                descripcion: _descripcion,
                aplicaciones: _aplicaciones
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
                    alert_msg: 'Rol creado con éxito.'
                }, () => {
                    this.props.actionOnLoad();
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

    cargarAplicaciones() {
        /*this.setState({
            loading: true
        });*/

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
                    app_list: data
                });

                let items = [];
                let c = 0;
                data.forEach(element => {
                    if (element.NApl_IdPadre === null) {
                        let item = {
                            value: element.NApl_Id.toString(),
                            label: element.CApl_DesApl,
                            children: []
                        };
                        items.push(item);

                        data.forEach(_element => {
                            if (_element.NApl_IdPadre !== null) {
                                if (element.NApl_Id === _element.NApl_IdPadre) {
                                    let children = {
                                        value: _element.NApl_Id.toString(),
                                        label: _element.CApl_DesApl,
                                    };
                                    items[c].children.push(children);
                                }
                            }
                        });

                        c = c + 1;
                    }
                });

                this.setState({
                    app_data: items
                });
            }
            /*this.setState({
                loading: false
            });*/
        }).catch(err => {
            console.log(err);

            this.setState({
                //loading: false,
                alert: true,
                alert_type: 'danger',
                alert_msg: '¡Error! ' + err
            });
        });
    }

    componentWillMount() {
        this.cargarAplicaciones();
        if (this.props.isEdit) {
            this.cargarRol();
        }
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
                    <div className="col-lg-12">
                        <div className="form-group">
                            <label htmlFor="inputNombre"><b><span className="text-red">*</span> Nombre</b></label>
                            <input type="text" id="inputNombre" className="form-control"
                                   value={this.state.descripcion}
                                   onChange={(e) => {
                                       this.setState({descripcion: e.target.value})
                                   }}/>
                        </div>
                        <div className="form-group">
                            <label><b><span className="text-red">*</span> Aplicaciones</b></label>
                            <CheckboxTree
                                nodes={this.state.app_data}
                                checked={this.state.checked}
                                expanded={this.state.expanded}
                                onCheck={checked => this.setState({checked, tmp_checked: checked})}
                                onExpand={expanded => this.setState({expanded})}
                            />
                        </div>
                    </div>
                    <hr/>
                    <div className="col-lg-12 text-center">
                        <button className="btn btn-primary" onClick={this.GuardarRol.bind(this)}>Guardar Rol
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default MantenimientoRol;