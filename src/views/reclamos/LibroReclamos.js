/**
 * Created by Carlos Arce Sherader on 11/01/2018.
 */
import React, {Component} from 'react';

import moment from 'moment';
import DatePicker from 'react-datepicker';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import {Modal, ModalHeader, ModalBody, ModalFooter, Button, Alert} from 'reactstrap';

import Loading from '../../components/Loading/Loading';

import DetalleReclamo from './detalles/DetalleReclamo';

import base from '../../paths';
import apis from '../../general/apis';

class LibroReclamos extends Component {

    constructor(props) {
        super(props);
        this.state = {
            complejos_data: [],
            reclamos_data: [],
            complejo: null,
            fecha_ini: moment().subtract(1, 'days'),
            fecha_fin: moment(),
            doc_tipo: null,
            nro_doc: null,
            nro_rec: null,
            tipo_rec: null,
            loading: false,
            showConfirmChangeStatus: false,
            showDetalle: false,
            row: [],
            alert: false,
            alert_type: 'danger',
            alert_msg: null
        };
        this.buscarReclamos = this.buscarReclamos.bind(this);
        this.cambiarFechaIni = this.cambiarFechaIni.bind(this);
        this.cambiarFechaFin = this.cambiarFechaFin.bind(this);
        this.botonCerrar = this.botonCerrar.bind(this);
        this.botonDetalle = this.botonDetalle.bind(this);
        this.showConfirmChangeStatusModalToggle = this.showConfirmChangeStatusModalToggle.bind(this);
        this.showDetalleModalToggle = this.showDetalleModalToggle.bind(this);
        this.actualizarEstado = this.actualizarEstado.bind(this);
        this.onDismissAlert = this.onDismissAlert.bind(this);
    }

    cambiarFechaIni(date) {
        this.setState({
            fecha_ini: date
        });
    }

    cambiarFechaFin(date) {
        this.setState({
            fecha_fin: date
        });
    }

    buscarReclamos() {
        this.onDismissAlert();

        var _complejo = this.state.complejo,
            _tipo_doc = this.state.doc_tipo,
            _nro_doc = this.state.nro_doc,
            _nro_rec = this.state.nro_rec,
            _fecha_ini = this.state.fecha_ini.format('DD/MM/YYYY'),
            _fecha_fin = this.state.fecha_fin.format('DD/MM/YYYY'),
            _tipo_rec = this.state.tipo_rec;

        if(_complejo == '-' || _complejo == null) {
            this.setState({
                alert: true,
                alert_type: 'danger',
                alert_msg: '¡Error! Debe seleccionar un complejo.'
            });

            return;
        }

        if (_fecha_ini == null || _fecha_ini == '') {
            this.setState({
                alert: true,
                alert_type: 'danger',
                alert_msg: '¡Error! Debe seleccionar una fecha de inicio válida.'
            });

            return;
        }

        if (_fecha_fin == null || _fecha_fin == '') {
            this.setState({
                alert: true,
                alert_type: 'danger',
                alert_msg: '¡Error! Debe seleccionar una fecha de fin válida.'
            });

            return;
        }

        this.setState({
            loading: true
        });

        fetch(base.path.libro_reclamos, {
            method: 'POST',
            headers: base.default_headers,
            body: JSON.stringify({
                complejo: _complejo,
                tipo_doc: _tipo_doc,
                nro_doc: _nro_doc,
                nro_rec: _nro_rec,
                fecha_ini: _fecha_ini,
                fecha_fin: _fecha_fin,
                tipo_rec: _tipo_rec
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
                    reclamos_data: data
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

    actualizarEstado() {
        this.showConfirmChangeStatusModalToggle();
        this.setState({
            loading: true
        });

        var _complejo = this.state.row.COMPLEJO,
            _numero = this.state.row.NRO_RECLAMO,
            _fecha_reg = this.state.row.FECHA_REG,
            _nro_doc = this.state.row.NRO_DOC,
            _usuario = 'ADMIN';

        fetch(base.path.actualizar_estado_libro_reclamo, {
            method: 'POST',
            headers: base.default_headers,
            body: JSON.stringify({
                complejo: _complejo,
                numero: _numero,
                fecha_reg: _fecha_reg,
                nro_doc: _nro_doc,
                usuario: _usuario
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            if (data.status == 'success') {
                this.buscarReclamos();
            } else {
                this.setState({
                    alert: true,
                    alert_type: 'danger',
                    alert_msg: '¡Error! ' + data.message
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

    botonCerrar(cell, row) {
        if (cell == 'ACTIVO') {
            return (
                <Button color="danger" onClick={(e) => {
                    this.showConfirmChangeStatusModalToggle(cell, row)
                }}>
                    <i className="fa fa-lock"></i>
                </Button>
            );
        } else {
            return '-';
        }
    }

    botonDetalle(cell, row) {
        return (
            <Button color="primary" onClick={(e) => {
                this.showDetalleModalToggle(cell, row)
            }}>
                <i className="fa fa-book"></i>
            </Button>
        );
    }

    showDetalleModalToggle(cell, row) {
        this.setState({
            showDetalle: !this.state.showDetalle,
            row: row
        });
        console.log(row);
    }

    showConfirmChangeStatusModalToggle(cell, row) {
        this.setState({
            showConfirmChangeStatus: !this.state.showConfirmChangeStatus,
            row: row
        });
    }

    onDismissAlert() {
        this.setState({
            alert: false
        });
    }

    onSubmitExcel(e) {
        this.onDismissAlert();

        var _complejo = this.state.complejo,
            _fecha_ini = this.state.fecha_ini.format('DD/MM/YYYY'),
            _fecha_fin = this.state.fecha_fin.format('DD/MM/YYYY');

        if(_complejo == '-' || _complejo == null) {
            this.setState({
                alert: true,
                alert_type: 'danger',
                alert_msg: '¡Error! Debe seleccionar un complejo.'
            });

            e.preventDefault();
        }

        if (_fecha_ini == null || _fecha_ini == '') {
            this.setState({
                alert: true,
                alert_type: 'danger',
                alert_msg: '¡Error! Debe seleccionar una fecha de inicio válida.'
            });

            e.preventDefault();
        }

        if (_fecha_fin == null || _fecha_fin == '') {
            this.setState({
                alert: true,
                alert_type: 'danger',
                alert_msg: '¡Error! Debe seleccionar una fecha de fin válida.'
            });

            e.preventDefault();
        }
    }

    componentWillMount() {
        apis.lista_complejos((response, err) => {
            if (err) {
                this.setState({
                    alert: true,
                    alert_type: 'danger',
                    alert_msg: err.message
                });
                return console.log(err)
            }

            this.setState({
                complejos_data: response
            });
        });
    }

    render() {
        moment.locale('es');
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
                        Libro de Reclamos
                    </div>
                    <div className="card-body">
                        <Alert color={this.state.alert_type} isOpen={this.state.alert} toggle={this.onDismissAlert}>
                            {this.state.alert_msg}
                        </Alert>
                        <form>
                            <div className="row">
                                <div className="col-sm-4">
                                    <div className="form-group row">
                                        <label htmlFor="inputComplejo"
                                               className="col-sm-4 col-form-label">Complejo</label>
                                        <div className="col-sm-8">
                                            <select className="form-control" id="inputComplejo" onChange={ (e) => {
                                                this.setState({complejo: e.target.value})
                                            }  }>
                                                <option value="-">Seleccionar</option>
                                                <option value="">Todos</option>
                                                {
                                                    (this.state.complejos_data != null &&
                                                        this.state.complejos_data.map((param, i) =>
                                                            <option
                                                                value={param.cod_Cine} key={i}>
                                                                {param.desc_Cine}
                                                            </option>
                                                        )
                                                    )
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="form-group row">
                                        <label htmlFor="inputFechaIni" className="col-sm-4 col-form-label"><span
                                            className="text-red">*</span> Fecha
                                            Inicio</label>
                                        <div className="col-sm-8">
                                            <DatePicker selected={this.state.fecha_ini} onChange={this.cambiarFechaIni}
                                                        locale="es"
                                                        peekNextMonth
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        dropdownMode="select"
                                                        dateFormat="DD/MM/YYYY"
                                                        className="form-control" id="inputFechaIni" readOnly={false}/>
                                            <label htmlFor="inputFechaIni" className="label-datepicker"><i
                                                className="fa fa-calendar" aria-hidden="true"></i></label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="form-group row">
                                        <label htmlFor="inputFechaFin" className="col-sm-4 col-form-label"><span
                                            className="text-red">*</span> Fecha
                                            Fin</label>
                                        <div className="col-sm-8">
                                            <DatePicker selected={this.state.fecha_fin} onChange={this.cambiarFechaFin}
                                                        locale="es"
                                                        onSelect={this.cambiarFechaFin}
                                                        peekNextMonth
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        dropdownMode="select"
                                                        dateFormat="DD/MM/YYYY"
                                                        className="form-control" id="inputFechaFin" readOnly={true}/>
                                            <label htmlFor="inputFechaFin" className="label-datepicker"><i
                                                className="fa fa-calendar" aria-hidden="true"></i></label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-4">
                                    <div className="form-group row">
                                        <label htmlFor="cboDocTipo"
                                               className="col-sm-4 col-form-label">Doc. Tipo</label>
                                        <div className="col-sm-8">
                                            <select className="form-control" id="cboDocTipo" onChange={ (e) => {
                                                this.setState({doc_tipo: e.target.value})
                                            }  }>
                                                <option value="">Seleccionar</option>
                                                <option value="1">DNI</option>
                                                <option value="0">CE</option>
                                                <option value="2">Otros</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="form-group row">
                                        <label htmlFor="inputNroDoc" className="col-sm-4 col-form-label">Nro.
                                            Doc.</label>
                                        <div className="col-sm-8">
                                            <input type="text" className="form-control" id="inputNroDoc"
                                                   onChange={(e) => {
                                                       this.setState({nro_doc: e.target.value})
                                                   } }/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="form-group row">
                                        <label htmlFor="inputNroRec" className="col-sm-4 col-form-label">Nro.
                                            Reclamo</label>
                                        <div className="col-sm-8">
                                            <input type="text" className="form-control" id="inputNroRec"
                                                   onChange={(e) => {
                                                       this.setState({nro_rec: e.target.value})
                                                   } }/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-4">
                                    <div className="form-group row">
                                        <label htmlFor="cboTipoRec"
                                               className="col-sm-4 col-form-label">Tipo Reclamo</label>
                                        <div className="col-sm-8">
                                            <select className="form-control" id="cboTipoRec" onChange={ (e) => {
                                                this.setState({tipo_rec: e.target.value})
                                            }  }>
                                                <option value="">Seleccionar</option>
                                                <option value="F">Físico</option>
                                                <option value="V">Virtual</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <form action={base.path.exportar_libro_reclamos} method="GET"
                                          onSubmit={this.onSubmitExcel.bind(this)}>
                                        <input type="hidden" name="complejo" value={this.state.complejo}/>
                                        <input type="hidden" name="tipo_doc" value={this.state.tipo_doc}/>
                                        <input type="hidden" name="nro_doc" value={this.state.nro_doc}/>
                                        <input type="hidden" name="nro_rec" value={this.state.nro_rec}/>
                                        <input type="hidden" name="fecha_ini"
                                               value={this.state.fecha_ini.format('DD/MM/YYYY')}/>
                                        <input type="hidden" name="fecha_fin"
                                               value={this.state.fecha_fin.format('DD/MM/YYYY')}/>
                                        <input type="hidden" name="tipo_rec" value={this.state.tipo_rec}/>
                                        <button type="submit" className="btn btn-success pull-left"><i
                                            className="fa fa-download" aria-hidden="true"></i> Exportar
                                        </button>
                                    </form>
                                </div>
                                <div className="col-lg-6">
                                    <button type="button" className="btn btn-primary pull-right"
                                            onClick={this.buscarReclamos.bind(this)}><i className="fa fa-search"
                                                                                        aria-hidden="true"></i> Buscar
                                    </button>
                                </div>
                            </div>
                        </form>

                        <BootstrapTable data={this.state.reclamos_data} striped={true} hover={true} pagination={true}
                                        options={tbl_options} version='4'>
                            <TableHeaderColumn width="120" dataField="NRO_RECLAMO" isKey={true} dataAlign="center"
                                               dataSort={true}>Número</TableHeaderColumn>
                            <TableHeaderColumn width="120" dataField="COMPLEJO_DES" dataSort={true} dataAlign="center">Complejo</TableHeaderColumn>
                            <TableHeaderColumn width="100" dataField="NRO_RECLAMOFISICO"
                                               dataAlign="center"># Rec. Físico</TableHeaderColumn>
                            <TableHeaderColumn width="80" dataField="TIPO_DOC" dataSort={true} dataAlign="center">Tipo
                                Doc.</TableHeaderColumn>
                            <TableHeaderColumn width="90" dataField="NRO_DOC" dataSort={true} dataAlign="center">Doc.
                                Cliente</TableHeaderColumn>
                            <TableHeaderColumn dataField="CLIENTE">Desc. Cliente</TableHeaderColumn>
                            <TableHeaderColumn width="100" dataField="FECHA_REC"
                                               dataSort={true} dataAlign="center">Fec. Reclamo</TableHeaderColumn>
                            <TableHeaderColumn width="100" dataField="FECHA_REG"
                                               dataSort={true} dataAlign="center">Fec. Registro</TableHeaderColumn>
                            <TableHeaderColumn width="90" dataField="ESTADO"
                                               dataSort={true} dataAlign="center">Estado</TableHeaderColumn>
                            <TableHeaderColumn width="70" dataField="ESTADO" dataAlign="center"
                                               dataFormat={this.botonCerrar}>Cerrar</TableHeaderColumn>
                            <TableHeaderColumn width="70" dataField="DETALLEBTN" dataAlign="center"
                                               dataFormat={this.botonDetalle}>Detalle</TableHeaderColumn>
                        </BootstrapTable>

                        <div className="small">
                            <i><span className="text-red">*</span> Campos obligatorios.</i>
                        </div>
                    </div>
                </div>

                {/* MODAL: CONFIRMACION CAMBIO DE ESTADO */}
                <Modal isOpen={this.state.showConfirmChangeStatus} backdrop="static"
                       toggle={this.showConfirmChangeStatusModalToggle} className="modal-info">
                    <ModalHeader toggle={this.showConfirmChangeStatusModalToggle}>Atención</ModalHeader>
                    <ModalBody>
                        ¿Realmente desea CERRAR el reclamo
                        Nro. <b>{this.state.row != null ? this.state.row.NRO_RECLAMO : 'undefined'}</b>?
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.actualizarEstado} color="primary">SI</Button>
                        <Button onClick={this.showConfirmChangeStatusModalToggle} color="default">NO</Button>
                    </ModalFooter>
                </Modal>

                {/* MODAL: DETALLES RECLAMO */}
                <Modal isOpen={this.state.showDetalle} toggle={this.showDetalleModalToggle} className="modal-lg">
                    <ModalHeader toggle={this.showDetalleModalToggle}>Detalles del Reclamo</ModalHeader>
                    <ModalBody>
                        <DetalleReclamo params={this.state.row}/>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.showDetalleModalToggle}>Cerrar</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default LibroReclamos;
