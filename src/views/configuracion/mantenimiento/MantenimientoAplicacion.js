import React, {Component} from 'react';
import Loading from '../../../components/Loading/Loading';
import {Alert} from 'reactstrap';
import base from "../../../paths";

class MantenimientoAplicacion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            alert: false,
            alert_type: 'danger',
            alert_msg: null,
            loading: false
        };

        this.onDismissAlert = this.onDismissAlert.bind(this);
        this.GuardarAplicacion = this.GuardarAplicacion.bind(this);
    }

    onDismissAlert() {
        this.setState({
            alert: false
        });
    }

    GuardarAplicacion() {

    }

    componentDidMount() {

    }

    render() {
        return(
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
                            <label htmlFor="inputModulo">Modulo</label>
                            <input id="inputModulo" type="text" className="form-control" disabled={true}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputNombre">Nombre</label>
                            <input id="inputNombre" type="text" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputRuta">Ruta</label>
                            <input id="inputRuta" type="text" className="form-control"/>
                        </div>
                    </div>
                    <div className="col-lg-12 text-center">
                        <button className="btn btn-primary" onClick={this.GuardarAplicacion.bind(this)}>Guardar Aplicación
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default MantenimientoAplicacion;