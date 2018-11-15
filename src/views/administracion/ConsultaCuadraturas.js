/**
 * Created by Carlos Arce Sherader on 22/02/2018.
 */
import React, {Component} from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter, Button, Alert, Collapse} from 'reactstrap';

import Loading from '../../components/Loading/Loading';
import apis from '../../general/apis';
import base from '../../paths';

import classnames from 'classnames';

import moment from 'moment';
import 'moment/src/locale/es';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

class Cuadraturas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            alert: false,
            alert_type: 'danger',
            alert_msg: null,
            fechaIni: moment(),
            fechaFin: moment(),
            dataCuadraturas:[]
            
        };

        this.cambiarFechaIni = this.cambiarFechaIni.bind(this);
        this.cambiarFechaFin = this.cambiarFechaFin.bind(this);
        this.onDismissAlert = this.onDismissAlert.bind(this);
    }

    cambiarFechaIni(date) {
        this.setState({
            fechaIni: date
        });
    }

    cambiarFechaFin(date) {
        this.setState({
            fechaFin: date
        });
    }

    onDismissAlert() {
        this.setState({
            alert: false
        });
    }

    formatFecha(cell){

        var date = new Date(cell);
        function pad(s) { return (s < 10) ? '0' + s : s; }
        return [pad(date.getDate()), pad(date.getMonth()+1), date.getFullYear()].join('/') 
    }

    consultarCuadraturas(){
        
        var _fechaIni = this.state.fechaIni;
        var _fechaFin = this.state.fechaFin

        this.setState({
            loading: true
        });

        fetch(base.path.consulta_cuadraturas, {
            method: 'POST',
            headers: base.default_headers,
            body: JSON.stringify({
                fechaIni: _fechaIni.format('DD/MM/YYYY'),
                fechaFin: _fechaFin.format('DD/MM/YYYY')
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
                    dataCuadraturas: data.cuadraturas
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
                        Consulta Cuadraturas
                    </div>
                    <div className="card-body">
                        <Alert color={this.state.alert_type} isOpen={this.state.alert} toggle={this.onDismissAlert}>
                            {this.state.alert_msg}
                        </Alert>
                        <div className="row center"> 
                            <div className="col-sm-4">
                                <div className="form-group row">
                                    <label htmlFor="inputFechaIni"
                                        className="col-sm-4 col-form-label"><span
                                        className="text-red">*</span> Fecha Inicio</label>
                                        <div className="col-sm-6">
                                            <DatePicker selected={this.state.fechaIni} onChange={this.cambiarFechaIni}
                                            locale="es"
                                            dateFormat="DD/MM/YYYY"
                                            className="form-control" id="inputFechaIni" readOnly={true}
                                            />
                                        </div>
                                    <div className="col-sm-1">
                                        <label htmlFor="inputFechaIni" className="label-datepicker">
                                            <i className="fa fa-calendar" aria-hidden="true"></i>
                                        </label>
                                    </div>
                                </div>         
                            </div>
                            <div className="col-sm-4">
                                <div className="form-group row">
                                    <label htmlFor="inputFechaFin"
                                        className="col-sm-4 col-form-label"><span
                                        className="text-red">*</span> Fecha Fin</label>
                                        <div className="col-sm-6">
                                            <DatePicker selected={this.state.fechaFin} onChange={this.cambiarFechaFin}
                                            locale="es"
                                            dateFormat="DD/MM/YYYY"
                                            className="form-control" id="inputFechaFin" readOnly={true}
                                            />   
                                        </div>
                                    <div  className="col-sm-1">
                                        <label htmlFor="inputFechaFin" className="label-datepicker">
                                            <i className="fa fa-calendar" aria-hidden="true"></i>
                                        </label>
                                    </div>  
                                </div>
                                        
                            </div>
                            <div className="col-sm-2">
                                <button type="button" className="btn btn-success"
                                        onClick={this.consultarCuadraturas.bind(this)}
                                >
                                Buscar&nbsp;&nbsp;<i className="fa fa-search" aria-hidden="true"></i>
                                </button>        
                            </div>
                        </div>
                        <BootstrapTable data={this.state.dataCuadraturas} striped={true} hover={true} pagination={true}
                                        options={tbl_options} version="4">
                        <TableHeaderColumn width="80" dataField="complejo" isKey={true} dataAlign="center" dataSort={true}>Complejo</TableHeaderColumn>
                        <TableHeaderColumn width="80" dataField="codigoCine" dataAlign="center" dataSort={true}>Codigo</TableHeaderColumn>
                        <TableHeaderColumn width="80"  dataField="tipo" dataAlign="center" dataSort={true}>Tipo</TableHeaderColumn>
                        <TableHeaderColumn width="80"  dataField="idTransaccion" dataAlign="center" dataSort={true}>ID Transac.</TableHeaderColumn>
                        <TableHeaderColumn width="80"  dataField="fechaTrans" dataAlign="center" dataSort={true} dataFormat={this.formatFecha}>Fecha TransCash</TableHeaderColumn>
                        <TableHeaderColumn width="80"  dataField="fechaPOSS" dataAlign="center" dataSort={true} dataFormat={this.formatFecha}>Fecha POSS</TableHeaderColumn>
                        <TableHeaderColumn width="80"  dataField="fechaCuadraturas" dataAlign="center" dataSort={true} dataFormat={this.formatFecha}>Fecha Vista</TableHeaderColumn>
                        <TableHeaderColumn width="80"  dataField="serieCorrelativo" dataAlign="center" dataSort={true}>Serie</TableHeaderColumn>
                        <TableHeaderColumn width="80"  dataField="montoTotal" dataAlign="center" dataSort={true}>Monto Total</TableHeaderColumn>
                        </BootstrapTable>
                    </div>
                </div>
            </div>
        )
    }
}

export default Cuadraturas;