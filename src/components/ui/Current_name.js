import React, {Component} from 'react';
//копонент для отображения и смены ника
class Current_name extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() { //перехват события enter в эл-те инпут и вызов функции смены имени
        let fn = this.change_name;
        let this_ = this;
        this.refs.input.addEventListener("keyup", function (event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                fn.apply(this_);
            }
        })
    }
    change_name() {//смена имени
        let name = this.refs.input.value;
        if (name && name != '')
            this.props.chatApp.changeName(name)
        this.refs.input.value = '';
    }
    render() {
        let current_name = null;
        if (this.props.current_name != "")
            current_name = <div className="Header">Wilcome, {this.props.current_name}</div>;
        return (<div className="Current_name">
            {current_name}
            <div className="Info"></div>
            <div className="input_panel">
                <div><input ref="input" placeholder="Enter nickName"/></div>
                <div><div className="Button" onClick={() => this.change_name()}>change nick</div></div>
            </div></div>)
    }
}


export default Current_name;