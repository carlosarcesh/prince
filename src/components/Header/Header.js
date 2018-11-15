import React, {Component} from 'react';
import {
    Nav,
    NavItem,
    NavbarToggler,
    NavbarBrand,
    NavLink
} from 'reactstrap';

class Header extends Component {

    sidebarToggle(e) {
        e.preventDefault();
        document.body.classList.toggle('sidebar-hidden');
    }

    sidebarMinimize(e) {
        e.preventDefault();
        document.body.classList.toggle('sidebar-minimized');
    }

    mobileSidebarToggle(e) {
        e.preventDefault();
        document.body.classList.toggle('sidebar-mobile-show');
    }

    asideToggle(e) {
        e.preventDefault();
        document.body.classList.toggle('aside-menu-hidden');
    }

    render() {
        return (
            <header className="app-header navbar">
                <NavbarToggler className="d-lg-none" onClick={this.mobileSidebarToggle}>
                    <span className="navbar-toggler-icon"></span>
                </NavbarToggler>
                <NavbarBrand href="#"></NavbarBrand>
                <NavbarToggler className="d-md-down-none mr-auto" onClick={this.sidebarToggle}>
                    <span className="navbar-toggler-icon"></span>
                </NavbarToggler>
                <Nav className="ml-auto" navbar>
                    {/*<NavItem className="d-md-down-none">*/}
                    <NavItem>
                        <NavLink href={'http://' + location.hostname + "/logout"} className="logout-lnk"><i className="icon-logout"></i> Logout</NavLink>
                    </NavItem>
                </Nav>
            </header>
        );
    }
}

export default Header;