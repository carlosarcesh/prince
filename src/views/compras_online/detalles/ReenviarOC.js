/**
 * Created by Carlos Arce Sherader on 15/01/2018.
 */
import React, {Component} from 'react';
import { Alert } from 'reactstrap';

import Loading from '../../../components/Loading/Loading';

import base from '../../../paths';

class ReenviarOC extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: this.props.params.email,
            button_text: 'Reenviar',
            loading: false,
            alert: false,
            alert_type: 'danger',
            alert_msg: null
        };
        this.reenviarOC = this.reenviarOC.bind(this);
        this.onDismissAlert = this.onDismissAlert.bind(this);
    }

    reenviarOC() {
        this.setState({
            button_text: 'Enviando...',
            loading: true,
            alert: false,
            alert_type: null,
            alert_msg: null
        });

        fetch(base.path.vista_reenvio_oc, {
            method: 'POST',
            headers: base.default_headers,
            body: JSON.stringify({
                booking_id: this.props.params.booking_id,
                email: this.state.email
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            this.setState({
                button_text: 'Reenviar',
                loading: false
            });
            if(data.status == 'error') {
                this.setState({
                    alert: true,
                    alert_type: 'danger',
                    alert_msg: 'Ocurrió un error al reenviar la orden de compra.'
                });
            } else {
                this.setState({
                    alert: true,
                    alert_type: 'success',
                    alert_msg: 'Se envió correctamente la orden de compra.'
                });
            }
        }).catch(err => {
            console.log(err);
            this.setState({
                button_text: 'Reenviar',
                loading: false,
                alert: true,
                alert_type: 'danger',
                alert_msg: err.message
            });
        });
    }

    onDismissAlert() {
        this.setState({
            alert: false
        });
    }

    render() {
        if (this.props.params == null) {
            return null;
        }

        return (
            <div className="animated fadeIn">
                <Loading show={this.state.loading}/>
                <Alert color={this.state.alert_type} isOpen={this.state.alert} toggle={this.onDismissAlert}>
                    {this.state.alert_msg}
                </Alert>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="form-group row">
                            <label htmlFor="inputEmail"
                                   className="col-sm-2 col-form-label">E-mail</label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" id="inputEmail"
                                       onChange={ (e) => {
                                           this.setState({email: e.target.value})
                                       }  } defaultValue={this.props.params.email}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12 text-center">
                        <button type="button" className="btn btn-primary" onClick={this.reenviarOC.bind(this)}>
                            {this.state.button_text}
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default ReenviarOC;
