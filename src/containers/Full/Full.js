import React, {Component} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {Container} from 'reactstrap';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';

import Dashboard from '../../views/Dashboard/';
import ComprasExitosas from '../../views/compras_online/ComprasExitosas';
import ComprasFallidas from '../../views/compras_online/ComprasFallidas';
import ConsultaPayu from '../../views/compras_online/ConsultaPayu';
import Funciones from '../../views/compras_online/Funciones';
import ConsultaVoucher from '../../views/compras_online/ConsultaVoucher';
import LibroReclamos from '../../views/reclamos/LibroReclamos';
import Cartelera from '../../views/marketing/Cartelera';
import Usuarios from '../../views/seguridad/Usuarios';
import Roles from '../../views/seguridad/Roles';
import Modulos from '../../views/configuracion/Modulos';
import EnvioPPL from '../../views/administracion/EnvioPPL';
import Cuadraturas from '../../views/administracion/ConsultaCuadraturas';
import ConsultaLotes from '../../views/ventas_corporativas/ConsultaLotes';
import ConsultaPases from '../../views/ventas_corporativas/ConsultaPases';
import AnulacionCodigos from '../../views/ventas_corporativas/AnulacionCodigos';
import ConsultaLineaCredito from '../../views/ventas_corporativas/ConsultaLineaCredito';

import cookie from 'react-cookies';

import {find} from 'lodash';

class Full extends Component {
    render() {

        if (!cookie.load('user')) {
            window.location = 'http://' + location.hostname + '/logout';
            return (
                <div>
                    Redirigiendo...
                </div>
            );
        }

        const {pathname} = this.props.location;

        if (pathname !== '/' && pathname !== '/dashboard') {
            const AplicativoRol = JSON.parse(cookie.load('response').replace('j:', ''));

            if (find(AplicativoRol, {'CApl_Ruta': pathname}) === undefined) {
                setTimeout(() => {
                    this.props.history.push('/dashboard');
                    //window.location = 'http://' + location.hostname + '/logout';
                }, 5000);
                return (
                    <div>
                        <p>¡Atención! No cuenta con privilegios suficientes para acceder a este módulo.</p>
                        <p>Por favor contacte con el área de sistemas.</p>
                        <p>Redirigiendo...</p>
                    </div>
                );
            }
        }

        return (
            <div className="app">
                <Header/>
                <div className="app-body">
                    <Sidebar {...this.props}/>
                    <main className="main">
                        <Breadcrumb/>
                        <Container fluid>
                            <Switch>
                                <Route path="/dashboard" name="Dashboard" component={Dashboard}/>

                                <Route path="/atencion_al_cliente/compras_exitosas" name="Dashboard"
                                       component={ComprasExitosas}/>
                                <Route path="/atencion_al_cliente/compras_online" name="Dashboard"
                                       component={ComprasFallidas}/>
                                <Route path="/atencion_al_cliente/consulta_payu" name="Dashboard"
                                       component={ConsultaPayu}/>
                                <Route path="/atencion_al_cliente/funciones" name="Dashboard" component={Funciones}/>
                                <Route path="/atencion_al_cliente/consulta_voucher" name="Dashboard" component={ConsultaVoucher}/>
                                <Route path="/reclamos/libro_reclamos" name="Dashboard" component={LibroReclamos}/>
                                <Route path="/marketing/cartelera" name="Dashboard" component={Cartelera}/>
                                <Route path="/seguridad/adm_usuarios" name="Dashboard" component={Usuarios}/>
                                <Route path="/seguridad/adm_roles" name="Dashboard" component={Roles}/>
                                <Route path="/configuracion/modulos" name="Dashboard" component={Modulos}/>
                                <Route path="/administracion/envioPPL" name="Dashboard" component={EnvioPPL}/>
                                <Route path="/administracion/cuadraturas" name="Dashboard" component={Cuadraturas}/>
                                <Route path="/ventas_corporativas/consulta_lotes" name="Dashboard"
                                       component={ConsultaLotes}/>
                                <Route path="/ventas_corporativas/consulta_pases" name="Dashboard"
                                       component={ConsultaPases}/>
                                <Route path="/ventas_corporativas/consulta_ordenes_venta" name="Dashboard"
                                       component={AnulacionCodigos}/>
                                <Route path="/ventas_corporativas/linea_credito" name="Dashboard"
                                       component={ConsultaLineaCredito}/>

                                <Redirect from="/" to="/dashboard"/>
                            </Switch>
                        </Container>
                    </main>
                    <Aside/>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default Full;
