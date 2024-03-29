import React from 'react';

import store from 'app/store';
import ConfigActions from 'actions/config-actions';
import i18n from 'lib-app/i18n';

import Message from 'core-components/message';
import SessionActions from "../../actions/session-actions";
import {connect} from "react-redux/src";
import CustomComponent from "../../lib-core/Component";

class InstallCompleted extends CustomComponent {

    componentDidMount() {
        store.dispatch(ConfigActions.init());

        this.props.dispatch(SessionActions.logout());

        setTimeout(() => {
            store.dispatch(ConfigActions.checkInstallation());
        }, 3000);
    }

    render() {
        return (
            <div className="install-completed">
                <Message title={i18n('INSTALLATION_COMPLETED')} type="success">
                    {i18n('INSTALLATION_COMPLETED_DESCRIPTION')}
                </Message>
            </div>
        );
    }
}

export default connect((store) => {
    return {}
})(InstallCompleted);
