import React from "react";
import Loading from "./loading";
import i18n from "../lib-app/i18n";
import Message from "./message";

class LoadingWithError extends React.Component {

    static propTypes = {
        backgrounded: React.PropTypes.bool,
        size: React.PropTypes.oneOf(['small', 'medium', 'large']),
        loading: React.PropTypes.bool.required,
        errorRetrievingData: React.PropTypes.bool,
        messageKey: React.PropTypes.string
    };

    static defaultProps = {
        size: 'small',
        backgrounded: false,
        errorRetrievingData: false,
        messageKey: 'UNKNOWN_ERROR'
    };

    render() {
        return (
            <div>
                {this.props.loading && <Loading backgrounded/>}
                {this.props.errorRetrievingData &&
                <Message className="admin-panel-edit-company__message"
                         type="error">{i18n(this.props.messageKey)}</Message>
                }
            </div>
        );
    }
}

export default LoadingWithError;
