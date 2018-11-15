import React, {Component} from 'react';
import Loading from '../../components/Loading/Loading';
import {UncontrolledAlert} from 'reactstrap';

class CardWrap extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return(
            <div className="animated fadeIn">
                <Loading show={this.props.loading || false}/>
                <div className="card">
                    <div className="card-header">
                        {this.props.title}
                    </div>
                    <div className="card-body">
                        <UncontrolledAlert color={this.props.alertType || 'danger'} isOpen={this.props.alert || false}>
                            {this.props.alertMsg}
                        </UncontrolledAlert>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

export default CardWrap;
