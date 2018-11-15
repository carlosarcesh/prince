import React, { Component } from 'react';
import cookie from 'react-cookies';

class Dashboard extends Component {

    render() {
        return (
            <div className="animated bounceIn">
                Bienvenid@ <b>{cookie.load('user')}!</b>
            </div>
        )
    }
}

export default Dashboard;