import React, {Component} from 'react';

// компонент получает имя пользователя при загрузке приложения
class Start_page extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {  // перехватывает событие кливи энтер и сообщение
        let fn = this.change_name;
        let this_ = this;
        this.refs.input.addEventListener("keyup", function (event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                fn.apply(this_);
            }
        })
    }
    change_name() { // вызывает chatApp для сохранения имени юзера
        let name = this.refs.input.value;
        if (name && name != '')
            this.props.chatApp.changeName(name)
        this.refs.input.value = '';
    }

    render() {

        return (<div className="Start_page">
            <div className="Header">Hello, enter you nickname</div>
            <div className="Info"></div>
            <div className="input_panel">
                <div><input ref="input" placeholder="Enter nickName"/></div>
                <div><div className="Button" onClick={() => {
                        this.change_name();
                    }}>change nick</div></div>
            </div></div>)
    }
}



export default Start_page;