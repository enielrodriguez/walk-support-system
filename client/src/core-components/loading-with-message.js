import React from "react";
import Loading from "./loading";
import i18n from "../lib-app/i18n";
import Message from "./message";

class LoadingWithMessage extends React.Component {

    static propTypes = {
        showMessage: React.PropTypes.bool,
        messageKey: React.PropTypes.string
    };

    static defaultProps = {
        showMessage: false,
        messageKey: 'UNKNOWN_ERROR'
    };

    render() {
        return (
            <div>
                {!this.props.showMessage ? <Loading backgrounded/>
                    : <Message className="admin-panel-edit-company__message"
                               type="error">{i18n(this.props.messageKey)}</Message>
                }
            </div>
        );
    }
}

export default LoadingWithMessage;
