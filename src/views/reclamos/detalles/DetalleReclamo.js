/**
 * Created by Carlos Arce Sherader on 19/01/2018.
 */
import React, {Component} from 'react';

import Loading from '../../../components/Loading/Loading';

import base from '../../../paths';

class DetalleReclamo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            entity: [],
            loading: false,
            alert: false,
            alert_type: 'danger',
            alert_msg: ''
        };
        this.getDetallesReclamo = this.getDetallesReclamo.bind(this);
    }

    getDetallesReclamo() {
        fetch(base.path.detalle_reclamo, {
            method: 'POST',
            headers: base.default_headers,
            body: JSON.stringify({
                nro_rec: this.props.params.NRO_RECLAMO
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
                    entity : data[0]
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

    componentWillMount() {
        if(this.props.params.NRO_RECLAMO != null || (typeof this.props.params.NRO_RECLAMO != 'undefined ')) {
            this.getDetallesReclamo();
        }
    }

    render() {

        if(this.props.params == null && this.state.entity.length == 0) {
            return null;
        }

        return (
            <div className="animated fadeIn">
                <Loading show={this.state.loading}/>
                <div className="row">
                    <div className="col-lg-6">

                        <div className="row">
                            <div className="col-lg-12">
                                <b>Tipo de Documento:</b>
                            </div>
                            <div className="col-lg-12">
                                {this.state.entity.TIPO_DOC || '-'}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <b>Cliente:</b>
                            </div>
                            <div className="col-lg-12">
                                {this.state.entity.APE_PATERNO} {this.state.entity.APE_MATERNO}, {this.state.entity.NOMBRES}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <b>Domicilio:</b>
                            </div>
                            <div className="col-lg-12">
                                {this.state.entity.DIRECCION || '-'}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <b>Padre o Madre (En el caso de ser menor de edad):</b>
                            </div>
                            <div className="col-lg-12">
                                {this.state.entity.NOMBRE_APODERADO || '-'}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <b>Área de Ocurrencia:</b>
                            </div>
                            <div className="col-lg-12">
                                {this.state.entity.AREA_OCURRENCIA || '-'}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <b>Tipo Bien Contratado:</b>
                            </div>
                            <div className="col-lg-12">
                                {this.state.entity.TIPO_BIEN_CONTRATADO || '-'}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <b>Complejo Ocurrencia:</b>
                            </div>
                            <div className="col-lg-12">
                                {this.state.entity.COMPLEJO_OCURRENCIA || '-'}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <b>Fecha de Reclamo:</b>
                            </div>
                            <div className="col-lg-12">
                                {this.state.entity.FECHA_RECLAMO || '-'}
                            </div>
                        </div>

                    </div>
                    <div className="col-lg-6">

                        <div className="row">
                            <div className="col-lg-12">
                                <b>Número de Documento:</b>
                            </div>
                            <div className="col-lg-12">
                                {this.state.entity.NRO_DOCUMENTO || '-'}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <b>Teléfono:</b>
                            </div>
                            <div className="col-lg-12">
                                {this.state.entity.TELEFONO || '-'}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <b>Email:</b>
                            </div>
                            <div className="col-lg-12">
                                {this.state.entity.EMAIL || '-'}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <b>Lugar de Ocurrencia:</b>
                            </div>
                            <div className="col-lg-12">
                                {this.state.entity.LUGAR_OCURRENCIA || '-'}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <b>Motivo:</b>
                            </div>
                            <div className="col-lg-12">
                                {this.state.entity.MOTIVO_OCURRENCIA || '-'}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <b>Tipo de Reclamación:</b>
                            </div>
                            <div className="col-lg-12">
                                {this.state.entity.TIPO_RECLAMACION || '-'}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <b>Monto Reclamado:</b>
                            </div>
                            <div className="col-lg-12">
                                {this.state.entity.MONTO_RECLAMADO || '-'}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <b>Canal de Reclamo:</b>
                            </div>
                            <div className="col-lg-12">
                                {this.state.entity.CANAL_REC || '-'}
                            </div>
                        </div>

                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <b>Descripción de Ocurrencia:</b>
                    </div>
                    <div className="col-lg-12">
                        {this.state.entity.DESCRIPCION_OCURRENCIA || '-'}
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <b>Detalle de Reclamo:</b>
                    </div>
                    <div className="col-lg-12">
                        {this.state.entity.DETALLE_RECLAMACION || '-'}
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <b>Pedido de Reclamación:</b>
                    </div>
                    <div className="col-lg-12">
                        {this.state.entity.PEDIDO_RECLAMACION || '-'}
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <b>Acciones del Proveedor:</b>
                    </div>
                    <div className="col-lg-12">
                        {this.state.entity.ACCIONES_PROVEEDOR || '-'}
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <b>Propuesta Solución:</b>
                    </div>
                    <div className="col-lg-12">
                        {this.state.entity.PROPUESTA_SOLUCION || '-'}
                    </div>
                </div>
            </div>
        )
    }
}

export default DetalleReclamo;
