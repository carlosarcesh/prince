/**
 * Created by Carlos Arce Sherader on 2/08/2018.
 */
import React, {Component} from 'react';
import {Input, Button, ListGroup, ListGroupItem} from 'reactstrap';

class SearchBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            selectedValue: null,
            selectedText: null,
            inputText: null
        };
    }

    setSelected(param) {
        this.setState({
            selectedValue: param.value
        });
    }

    filter() {
        var q = this.state.inputText;
        var data = this.props.dataList;
        var new_data = [];
        data.forEach(function (m) {
            if (m.text.toUpperCase().indexOf(q.toUpperCase()) > -1) {
                new_data.push(m);
            }
        });

        this.setState({
            dataList: new_data
        });
    }

    onSelect(text, value) {
        this.props.onSelect(text, value);
    }

    cleanInput(e) {
        e.preventDefault();
        this.setState({
            selectedText: null,
            selectedValue: null,
            inputText: '',
            dataList: this.props.dataList
        }, () => {
            this.onSelect(null, null);
        });
    }

    componentWillMount() {
        if (this.props.dataList != null || this.props.dataList.length > 0) {
            this.setState({
                dataList: this.props.dataList
            });
        }
    }

    componentDidUpdate() {
        if (this.props.dataList != null) {
            this.setState((prevState, props) => {
                this.state.dataList = props.dataList;
            });
        }
    }

    render() {
        return (
            <div>
                <div className="position-relative">
                    <Input type="text"
                           placeholder={this.props.placeHolder}
                           value={this.state.inputText}
                           className="search-box--input"
                           onChange={(e) => {
                               this.setState({
                                   inputText: e.target.value
                               }, () => {
                                   this.filter()
                               });
                           }}
                    />
                    <a href="#"
                       className="search-box--close"
                       onClick={(e) => {
                           this.cleanInput(e);
                       }}
                    >X</a>
                </div>
                {(this.props.dataList.length > 0) &&
                <ListGroup className="list-group-search">
                    {
                        this.state.dataList.map((param, i) =>
                            <ListGroupItem
                                tag="a"
                                active={(param.value === this.state.selectedValue)}
                                onClick={() => {
                                    this.setState({
                                        selectedText: param.text,
                                        selectedValue: param.value,
                                        inputText: param.text
                                    }, () => {
                                        this.onSelect(param.text, param.value);
                                    });
                                }}
                                key={i}
                                action>{param.text}</ListGroupItem>
                        )
                    }
                </ListGroup>
                }
                {(this.state.dataList.length === 0) && 'No hay información para mostrar.'}
            </div>
        );
    }
}

export default SearchBox;