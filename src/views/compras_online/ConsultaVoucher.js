import React, {Component} from 'react';

import CardWrap from "../../components/Container/CardWrap";
import apis from "../../general/apis";
import base from "../../paths";

class ConsultaVoucher extends Component {
    constructor(props) {
        super(props);

        this.state = {
            alert: false,
            alert_type: 'danger',
            alert_msg: null,
            loading: false,
            complejos_data: [],
            voucher_data: [],
            complejo: null,
            voucher: null
        };
    }

    buscarVoucher() {
        let {complejo, voucher} = this.state;

        if (voucher == '' || voucher == null) {
            this.setState({
                alert: true,
                alert_type: 'danger',
                alert_msg: 'El código de voucher no puede estar vacío.'
            });
            return;
        }

        this.setState({
            alert: false,
            alert_type: null,
            alert_msg: null,
            voucher_data: [],
            loading: true
        });

        fetch(base.path.consulta_voucher, {
            method: 'POST',
            headers: base.default_headers,
            body: JSON.stringify({complejo, voucher})
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
                if (data.length > 0 && data[0] != null && data[0] != undefined) {
                    this.setState({
                        voucher_data: data[0][0]
                    });
                } else {
                    this.setState({
                        alert: true,
                        alert_type: 'danger',
                        alert_msg: 'No se encontró el voucher.'
                    });
                }
            }

            this.setState({
                loading: false
            });
        }).catch(err => {
            console.log(err);
            this.setState({
                alert: true,
                alert_type: 'danger',
                alert_msg: err,
                loading: false
            });
        });
    }

    wrapForm() {
        return (
            <div>
                <div className="row">
                    <div className="col-sm-4">
                        <div className="form-group row">
                            <label htmlFor="inputComplejo"
                                   className="col-sm-4 col-form-label">Complejo</label>
                            <div className="col-sm-8">
                                <select className="form-control" id="inputComplejo" onChange={(e) => {
                                    this.setState({complejo: e.target.value})
                                }}>
                                    <option value="">Todos</option>
                                    {
                                        this.state.complejos_data.map((param, i) =>
                                            <option
                                                value={param.cod_Cine} key={i}>
                                                {param.desc_Cine}
                                            </option>
                                        )
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="form-group row">
                            <label htmlFor="inputVoucher"
                                   className="col-sm-4 col-form-label"><span
                                className="text-red">*</span> Voucher</label>
                            <div className="col-sm-8">
                                <input type="text" id="inputVoucher" className="form-control"
                                       onChange={e => this.setState({voucher: e.target.value})}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <button className="btn btn-primary" onClick={this.buscarVoucher.bind(this)}>Buscar</button>
                    </div>
                </div>
            </div>
        );
    }

    wrapResult() {
        if (this.state.voucher_data !== undefined) {
            if (this.state.voucher_data.codigo != undefined) {
                return (<CardWrap
                    title="Detalles del Voucher"
                >
                    <div className="row">
                        <div className="col-lg-2"><b>Código:</b></div>
                        <div className="col-lg-10">{this.state.voucher_data.codigo}</div>
                    </div>
                    <div className="row">
                        <div className="col-lg-2"><b>Booking ID:</b></div>
                        <div className="col-lg-10">{this.state.voucher_data.booking_id}</div>
                    </div>
                    <div className="row">
                        <div className="col-lg-2"><b>Estado:</b></div>
                        <div className="col-lg-10">{this.state.voucher_data.Estado}</div>
                    </div>
                    <div className="row">
                        <div className="col-lg-2"><b>Cliente:</b></div>
                        <div className="col-lg-10">{this.state.voucher_data.cod_cliente}</div>
                    </div>
                    <div className="row">
                        <div className="col-lg-2"><b>¿Socio?:</b></div>
                        <div className="col-lg-10">{this.state.voucher_data["socio?"]}</div>
                    </div>
                    {this.state.voucher_data.nombres &&
                    <div className="row">
                        <div className="col-lg-2"><b>Nombres:</b></div>
                        <div className="col-lg-10">{this.state.voucher_data.nombres}</div>
                    </div>
                    }
                    <div className="row">
                        <div className="col-lg-2"><b>Transacción ID:</b></div>
                        <div className="col-lg-10">{this.state.voucher_data.transaccion_id}</div>
                    </div>
                    <div className="row">
                        <div className="col-lg-2"><b>Booking Number:</b></div>
                        <div className="col-lg-10">{this.state.voucher_data.booking_number}</div>
                    </div>
                    <div className="row">
                        <div className="col-lg-2"><b>Fecha Transacción:</b></div>
                        <div className="col-lg-10">{this.state.voucher_data.fec_trx_varchar}</div>
                    </div>
                    <div className="row">
                        <div className="col-lg-2"><b>Monto Total:</b></div>
                        <div className="col-lg-10">{this.state.voucher_data.monto_total}</div>
                    </div>
                    <div className="row">
                        <div className="col-lg-2"><b>Forma Pago:</b></div>
                        <div className="col-lg-10">{this.state.voucher_data.forma_pago}</div>
                    </div>
                    <div className="row">
                        <div className="col-lg-2"><b>Origen:</b></div>
                        <div className="col-lg-10">{this.state.voucher_data.origen}</div>
                    </div>
                    <div className="row">
                        <div className="col-lg-2"><b>Pelicula:</b></div>
                        <div className="col-lg-10">{this.state.voucher_data.pelicula}</div>
                    </div>
                    <div className="row">
                        <div className="col-lg-2"><b>Sala:</b></div>
                        <div className="col-lg-10">{this.state.voucher_data.sala}</div>
                    </div>
                    <div className="row">
                        <div className="col-lg-2"><b>Categoria:</b></div>
                        <div className="col-lg-10">{this.state.voucher_data.categoria}</div>
                    </div>
                    <div className="row">
                        <div className="col-lg-2"><b>Censura:</b></div>
                        <div className="col-lg-10">{this.state.voucher_data.censura}</div>
                    </div>
                    <div className="row">
                        <div className="col-lg-2"><b>Fecha Función:</b></div>
                        <div className="col-lg-10">{this.state.voucher_data.fec_hora_func_varchar}</div>
                    </div>
                    <div className="row">
                        <div className="col-lg-2"><b>Fecha Envío OC:</b></div>
                        <div className="col-lg-10">{this.state.voucher_data.FEC_ENVIO_OC}</div>
                    </div>
                    <div className="row">
                        <div className="col-lg-2"><b>Monto Taquilla:</b></div>
                        <div className="col-lg-10">{this.state.voucher_data.monto_total_taq}</div>
                    </div>
                    <div className="row">
                        <div className="col-lg-2"><b>Monto Dulcería:</b></div>
                        <div className="col-lg-10">{this.state.voucher_data.monto_total_dul}</div>
                    </div>
                    <div className="row">
                        <div className="col-lg-2"><b>Email:</b></div>
                        <div className="col-lg-10">{this.state.voucher_data.email}</div>
                    </div>
                    <div className="row">
                        <div className="col-lg-2"><b>Cod. Cine:</b></div>
                        <div className="col-lg-10">{this.state.voucher_data.cod_cine}</div>
                    </div>
                    <div className="row">
                        <div className="col-lg-2"><b>Cine:</b></div>
                        <div className="col-lg-10">{this.state.voucher_data.desc_cine}</div>
                    </div>
                    <div className="row">
                        <div className="col-lg-2"><b>ID Trans. PayU:</b></div>
                        <div className="col-lg-10">{this.state.voucher_data.id_trx_payu}</div>
                    </div>
                    <div className="row">
                        <div className="col-lg-2"><b>Nro. Tarjeta:</b></div>
                        <div className="col-lg-10">{this.state.voucher_data.nro_tarjeta}</div>
                    </div>
                    <div className="row">
                        <div className="col-lg-2"><b>Fecha Canje:</b></div>
                        <div className="col-lg-10">{this.state.voucher_data.fec_canje}</div>
                    </div>
                    <div className="row">
                        <div className="col-lg-2"><b>Fecha Redimido:</b></div>
                        <div className="col-lg-10">{this.state.voucher_data.fec_redimido}</div>
                    </div>
                </CardWrap>);
            }
        } else {
            return(
                <p>
                    <b>No se encontraron resultados.</b>
                </p>
            );

        }
    }

    render() {
        return (<CardWrap
            title="Consulta Vouchers"
            alert={this.state.alert}
            alertType={this.state.alert_type}
            alertMsg={this.state.alert_msg}
            loading={this.state.loading}
        >
            {this.wrapForm()}
            {this.wrapResult()}
        </CardWrap>);
    }

    componentWillMount() {
        apis.lista_complejos((response, err) => {
            if (err) {
                this.setState({
                    alert: true,
                    alert_type: 'danger',
                    alert_msg: err.message
                });
            }

            this.setState({
                complejos_data: response
            });
        });
    }
}

export default ConsultaVoucher;
