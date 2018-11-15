/**
 * Created by Carlos Arce Sherader on 08/03/2018.
 */
import React, {Component} from 'react';
import Loading from '../../../components/Loading/Loading';
import {Alert} from 'reactstrap';
import base from "../../../paths";

class MantenimientoModulos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alert: false,
            alert_type: 'danger',
            alert_msg: null,
            loading: false,
            visible: null,
            nombre: null,
            icon: null
        };

        this.onDismissAlert = this.onDismissAlert.bind(this);
        this.GuardarModulo = this.GuardarModulo.bind(this);
    }

    onDismissAlert() {
        this.setState({
            alert: false
        });
    }

    GuardarModulo() {
        this.onDismissAlert();
        var nombre = this.state.nombre;
        var icono = this.state.icon;
        var visible = this.state.visible;

        if (nombre == null || nombre == '' || nombre == undefined) {
            this.setState({
                alert: true,
                alert_type: 'danger',
                alert_msg: 'La descripción no puede estar vacía.',
            });

            return;
        }

        if (icono == null || icono === '' || icono === undefined) {
            this.setState({
                alert: true,
                alert_type: 'danger',
                alert_msg: 'Debe seleccionar un ícono.',
            });

            return;
        }

        if (visible == null || visible === '' || visible === undefined) {
            this.setState({
                alert: true,
                alert_type: 'danger',
                alert_msg: 'Debe escoger entre Visible o Invisible.',
            });

            return;
        }
    }

    componentWillMount() {
    }

    render() {
        const icon_list = [
            'icon-user',
            'icon-people',
            'icon-user-female',
            'icon-user-follow',
            'icon-user-following',
            'icon-user-unfollow',
            'icon-login',
            'icon-logout',
            'icon-emotsmile',
            'icon-phone',
            'icon-call-end',
            'icon-call-in',
            'icon-call-out',
            'icon-map',
            'icon-location-pin',
            'icon-direction',
            'icon-directions',
            'icon-compass',
            'icon-layers',
            'icon-menu',
            'icon-list',
            'icon-options-vertical',
            'icon-options',
            'icon-arrow-down',
            'icon-arrow-left',
            'icon-arrow-right',
            'icon-arrow-up',
            'icon-arrow-up-circle',
            'icon-arrow-left-circle',
            'icon-arrow-right-circle',
            'icon-arrow-down-circle',
            'icon-check',
            'icon-clock',
            'icon-plus',
            'icon-minus',
            'icon-close',
            'icon-event',
            'icon-exclamation',
            'icon-organization',
            'icon-trophy',
            'icon-screen-smartphone',
            'icon-screen-desktop',
            'icon-plane',
            'icon-notebook',
            'icon-mustache',
            'icon-mouse',
            'icon-magnet',
            'icon-energy',
            'icon-disc',
            'icon-cursor',
            'icon-cursor-move',
            'icon-crop',
            'icon-chemistry',
            'icon-speedometer',
            'icon-shield',
            'icon-screen-tablet',
            'icon-magic-wand',
            'icon-hourglass',
            'icon-graduation',
            'icon-ghost',
            'icon-game-controller',
            'icon-fire',
            'icon-eyeglass',
            'icon-envelope-open',
            'icon-envelope-letter',
            'icon-bell',
            'icon-badge',
            'icon-anchor',
            'icon-wallet',
            'icon-vector',
            'icon-speech',
            'icon-puzzle',
            'icon-printer',
            'icon-present',
            'icon-playlist',
            'icon-pin',
            'icon-picture',
            'icon-handbag',
            'icon-globe-alt',
            'icon-globe',
            'icon-folder-alt',
            'icon-folder',
            'icon-film',
            'icon-feed',
            'icon-drop',
            'icon-drawer',
            'icon-docs',
            'icon-doc',
            'icon-diamond',
            'icon-cup',
            'icon-calculator',
            'icon-bubbles',
            'icon-briefcase',
            'icon-book-open',
            'icon-basket-loaded',
            'icon-basket',
            'icon-bag',
            'icon-action-undo',
            'icon-action-redo',
            'icon-wrench',
            'icon-umbrella',
            'icon-trash',
            'icon-tag',
            'icon-support',
            'icon-frame',
            'icon-size-fullscreen',
            'icon-size-actual',
            'icon-shuffle',
            'icon-share-alt',
            'icon-share',
            'icon-rocket',
            'icon-question',
            'icon-pie-chart',
            'icon-pencil',
            'icon-note',
            'icon-loop',
            'icon-home',
            'icon-grid',
            'icon-graph',
            'icon-microphone',
            'icon-music-tone-alt',
            'icon-music-tone',
            'icon-earphones-alt',
            'icon-earphones',
            'icon-equalizer',
            'icon-like',
            'icon-dislike',
            'icon-control-start',
            'icon-control-rewind',
            'icon-control-play',
            'icon-control-pause',
            'icon-control-forward',
            'icon-control-end',
            'icon-volume-1',
            'icon-volume-2',
            'icon-volume-off',
            'icon-calendar',
            'icon-bulb',
            'icon-chart',
            'icon-ban',
            'icon-bubble',
            'icon-camrecorder',
            'icon-camera',
            'icon-cloud-download',
            'icon-cloud-upload',
            'icon-envelope',
            'icon-eye',
            'icon-flag',
            'icon-heart',
            'icon-info',
            'icon-key',
            'icon-link',
            'icon-lock',
            'icon-lock-open',
            'icon-magnifier',
            'icon-magnifier-add',
            'icon-magnifier-remove',
            'icon-paper-clip',
            'icon-paper-plane',
            'icon-power',
            'icon-refresh',
            'icon-reload',
            'icon-settings',
            'icon-star',
            'icon-symbol-female',
            'icon-symbol-male',
            'icon-target',
            'icon-credit-card',
            'icon-paypal',
            'icon-social-tumblr',
            'icon-social-twitter',
            'icon-social-facebook',
            'icon-social-instagram',
            'icon-social-linkedin',
            'icon-social-pinterest',
            'icon-social-github',
            'icon-social-google',
            'icon-social-reddit',
            'icon-social-skype',
            'icon-social-dribbble',
            'icon-social-behance',
            'icon-social-foursqare',
            'icon-social-soundcloud',
            'icon-social-spotify',
            'icon-social-stumbleupon',
            'icon-social-youtube',
            'icon-social-dropbox',
            'icon-social-vkontakte',
            'icon-social-steam',
        ];

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
                        <form>
                            <div className="form-group">
                                <label htmlFor="inputDescripcion">Desc. Aplicación</label>
                                <input type="text" className="form-control" id="inputDescripcion"
                                       onChange={e => this.setState({nombre: e.target.value})} required/>
                            </div>
                            <div className="form-group form-check-inline">
                                <input className="" type="radio" name="rdVisible" id="rdbVisible"
                                       onChange={e => this.setState({visible: 1})}/>
                                <label className="form-check-label" htmlFor="rdbVisible">
                                    Visible
                                </label>
                            </div>
                            <div className="form-group form-check-inline">
                                <input className="" type="radio" name="rdVisible" id="rdbInvisible"
                                       onChange={e => this.setState({visible: 0})}/>
                                <label className="form-check-label" htmlFor="rdbInvisible">
                                    Invisible
                                </label>
                            </div>
                        </form>
                    </div>
                    <div className="col-lg-6">
                        <div className="form-group">
                            <label htmlFor="cboIconos">Ícono</label>
                            <select name="cboIconos" id="cboIconos" className="form-control"
                                    onChange={e => this.setState({icon: e.target.value})}>
                                <option value="">Seleccionar</option>
                                {
                                    icon_list.map((item, i) =>
                                        <option
                                            value={item} key={i}>
                                            <i className={item}></i> {item}
                                        </option>
                                    )
                                }
                            </select>
                        </div>
                    </div>
                    <div className="col-lg-12 text-center">
                        <button className="btn btn-primary" onClick={this.GuardarModulo.bind(this)}>Guardar Módulo
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default MantenimientoModulos;