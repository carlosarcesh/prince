/**
 * Created by Carlos Arce Sherader on 9/01/2018.
 */
import React, { Component } from 'react';

class Loading extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if(this.props.show == false) {
            return null;
        }

        return (
            <div className="loader"></div>
        )
    }
}

export default Loading;
