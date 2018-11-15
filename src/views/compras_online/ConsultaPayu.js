/**
 * Created by Carlos Arce Sherader on 17/01/2018.
 */
import React, {Component} from 'react';

import Loading from '../../components/Loading/Loading';
import DetallePago from './detalles/DetallePagoPayu';
import {Alert} from 'reactstrap';

class ConsultaPayu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            alert: false,
            alert_type: 'danger',
            alert_msg: null,
            ref_cod: null
        };
        this.onDismissAlert = this.onDismissAlert.bind(this);
        this.buscarTransaccion = this.buscarTransaccion.bind(this);
    }

    buscarTransaccion() {
        this.onDismissAlert();

        if (document.getElementById('inputCodRef').value == '' || document.getElementById('inputCodRef').value == null) {
            this.setState({
                alert: true,
                alert_type: 'danger',
                alert_msg: 'El Código de Referencia no puede estar vacío.',
                ref_cod: null
            });
            return;
        }

        this.setState({
            ref_cod: document.getElementById('inputCodRef').value
        });
    }

    onDismissAlert() {
        this.setState({alert: false, alert_msg: null});
    }

    render() {
        return (
            <div className="animated fadeIn">
                <Loading show={this.state.loading}/>
                <div className="card">
                    <div className="card-header">
                        Consulta Payu
                    </div>
                    <div className="card-body">
                        <Alert color={this.state.alert_type} isOpen={this.state.alert} toggle={this.onDismissAlert}>
                            {this.state.alert_msg}
                        </Alert>
                        <form>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group row">
                                        <label htmlFor="inputCodRef"
                                               className="col-sm-4 col-form-label">Código de Referencia</label>
                                        <div className="col-sm-8">
                                            <textarea type="text" className="form-control" id="inputCodRef"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    <button type="button" className="btn btn-primary"
                                            onClick={this.buscarTransaccion.bind(this)}>
                                        <i className="fa fa-search" aria-hidden="true"></i> Buscar
                                    </button>
                                </div>
                            </div>
                        </form>
                        <hr/>
                        <DetallePago reference_code={this.state.ref_cod} action={this.buscarTransaccion}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default ConsultaPayu;