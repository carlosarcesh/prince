import React, {Component} from 'react';
import Loading from '../../components/Loading/Loading';
import {Alert, ListGroup, ListGroupItem} from 'reactstrap';
import base from "../../paths";
import CardWrap from "../../components/Container/CardWrap";

class ConsultaPases extends Component {
    constructor(props) {
        super(props);

        this.state = {
            alert: false,
            alert_type: 'danger',
            alert_msg: null,
            loading: false,
            detalle_pase: [],
            priceCard: [],
            priceBook: [],
            paseDet: null,
            voucher: null,
            lote: null,
            tipo: null,
            cliente: null,
            finVigencia: null
        };

        this.onDismissAlert = this.onDismissAlert.bind(this);
        this.getDetallePase = this.getDetallePase.bind(this);
        this.wrapContent = this.wrapContent.bind(this);
    }

    onDismissAlert() {
        this.setState({
            alert: false
        });
    }

    getDetallePase() {
        this.onDismissAlert();

        var {pase} = this.state;

        if (pase === '' || pase == null) {
            this.setState({
                alert: true,
                alert_type: 'danger',
                alert_msg: 'El campo de Pase Corporativo no puede estar vacío.'
            });
            return;
        }

        this.setState({
            loading: true
        });

        fetch(base.path.get_detalle_pase, {
            method: 'POST',
            headers: base.default_headers,
            body: JSON.stringify({
                pase
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            this.setState({
                loading: false,
                detalle_pase: data[0],
                priceCard: data[1],
                priceBook: data[2]
            }, () => {
                data[0].forEach(m => {
                    this.setState({
                        paseDet: m.PASE_CORPORATIVO,
                        voucher: m.VOUCHER,
                        lote: m.LOTE,
                        tipo: m.TIPO_PASE,
                        cliente: m.CLIENTE,
                        finVigencia: m.FIN_VIGENCIA
                    });
                });
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

    wrapContent() {
        return(
            <div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="form-group row">
                            <label htmlFor="inputPase" className="col-sm-2 col-form-label">Pase
                                Corporativo</label>
                            <div className="col-sm-4">
                                <input type="text" id="inputPase" className="form-control"
                                       onChange={e => this.setState({pase: e.target.value})}/>
                            </div>
                            <div className="col-sm-2">
                                <button className="btn btn-primary" onClick={this.getDetallePase}>Buscar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {this.state.detalle_pase.length > 0 &&
                <div className="row">
                    <div className="col-lg-12">
                        <hr/>
                    </div>
                    <div className="col-lg-6">
                        <div className="form-group row">
                            <label htmlFor="inputPaseDet" className="col-sm-3 col-form-label">Pase
                                Corporativo</label>
                            <div className="col-sm-6">
                                <input type="text" id="inputPaseDet" value={this.state.paseDet}
                                       className="form-control border border-primary rounded bg-white"
                                       disabled/>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="form-group row">
                            <label htmlFor="inputVoucher" className="col-sm-3 col-form-label">Voucher</label>
                            <div className="col-sm-6">
                                <input type="text" id="inputVoucher" value={this.state.voucher}
                                       className="form-control border border-primary rounded bg-white"
                                       disabled/>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="form-group row">
                            <label htmlFor="inputLote" className="col-sm-3 col-form-label">Lote</label>
                            <div className="col-sm-6">
                                <input type="text" id="inputLote" value={this.state.lote}
                                       className="form-control border border-primary rounded bg-white"
                                       disabled/>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="form-group row">
                            <label htmlFor="inputTipo" className="col-sm-3 col-form-label">Tipo Pase</label>
                            <div className="col-sm-6">
                                <input type="text" id="inputTipo" value={this.state.tipo}
                                       className="form-control border border-primary rounded bg-white"
                                       disabled/>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="form-group row">
                            <label htmlFor="inputCliente" className="col-sm-3 col-form-label">Cliente</label>
                            <div className="col-sm-9">
                                <input type="text" id="inputCliente" value={this.state.cliente}
                                       className="form-control border border-primary rounded bg-white"
                                       disabled/>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6"></div>
                    <div className="col-lg-6">
                        <div className="form-group row">
                            <label htmlFor="inputFinVigencia" className="col-sm-3 col-form-label">Fin
                                Vigencia</label>
                            <div className="col-sm-6">
                                <input type="text" id="inputFinVigencia" value={this.state.finVigencia}
                                       className="form-control border border-primary rounded bg-white"
                                       disabled/>
                            </div>
                        </div>
                    </div>
                </div>
                }

                <div className="row">
                    {this.state.priceCard.length > 0 &&
                    <div className="col-lg-6">
                        <h3 className="mt-3"><b>PriceCard</b></h3>
                        <ListGroup className="list-group-prices">
                            {this.state.priceCard.map((param, i) =>
                                <ListGroupItem key={i}>
                                    {param.PRICE_CARD}
                                </ListGroupItem>
                            )}
                        </ListGroup>
                    </div>
                    }
                    {this.state.priceBook.length > 0 &&
                    <div className="col-lg-6">
                        <h3 className="mt-3"><b>PriceBook</b></h3>
                        <ListGroup className="list-group-prices">
                            {this.state.priceBook.map((param, i) =>
                                <ListGroupItem key={i}>
                                    {param.Cinema_strName}
                                </ListGroupItem>
                            )}
                        </ListGroup>
                    </div>
                    }
                </div>
            </div>
        );
    }

    render() {
        return (<CardWrap
            title="Consulta de Pases Corporativos"
            alert={this.state.alert}
            alertType={this.state.alert_type}
            alertMsg={this.state.alert_msg}
            loading={this.state.loading}
        >
            {this.wrapContent()}
        </CardWrap>);
    }
}

export default ConsultaPases;
