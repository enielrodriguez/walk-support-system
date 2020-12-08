import React from 'react';
import {connect} from "react-redux";
import classNames from 'classnames';
import _ from 'lodash';
import DocumentTitle from 'react-document-title';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import Widget from 'core-components/widget';
import Icon from 'core-components/icon';
import {Link} from "react-router";
import Button from "../../core-components/button";
import SessionActions from "../../actions/session-actions";

const steps = [
    'LANGUAGE',
    'SERVER_REQUIREMENTS',
    'DATABASE_CONFIGURATION',
    'USER_SYSTEM',
    'SETTINGS',
    'PLAN',
    'ADMIN_SETUP',
    'COMPLETED'
];

class InstallLayout extends React.Component {

    render() {
        return (
            <DocumentTitle title="Installation">
                <Widget className="install-layout">
                    <div className="install-layout__header row">
                        <div className="install-layout__header-logo col-md-4">
                            <img width="100%" src={API.getURL() + '/images/logo.png'} alt="Installer"/>
                        </div>
                        <div className="install-layout__header-text  col-md-8">
                            <div className="install-layout__header-title">
                                {i18n('INSTALL_HEADER_TITLE')}
                            </div>
                            <div className="install-layout__header-description">
                                {i18n('INSTALL_HEADER_DESCRIPTION')}
                            </div>
                        </div>
                    </div>
                    <span className="separator"/>
                    <div className="install-layout__body row">
                        <div className="col-md-3">
                            <ul className="install-layout__steps">
                                {steps.map(this.renderStep.bind(this))}
                            </ul>
                            <Button className="install-layout__logout"
                                    size="medium"
                                    type="link"
                                    onClick={this.closeSession.bind(this)}>
                                {i18n('CLOSE_SESSION')}
                            </Button>
                        </div>
                        <div className="install-layout__content col-md-9">
                            {this.props.children}
                        </div>
                    </div>
                </Widget>
            </DocumentTitle>
        );
    }

    renderStep(key, index) {
        if (index === 7 && this.props.installed) {
            return;
        }

        let currentStep = this.getCurrentStep();

        let classes = {
            'install-layout__step': true,
            'install-layout__step_current': index === currentStep,
            'install-layout__step_previous': index < currentStep || (index !== currentStep && this.props.installed)
        };

        let icon = 'circle-thin';

        if (index === currentStep) {
            icon = 'arrow-circle-right';
        } else if (index < this.getCurrentStep() || this.props.installed) {
            icon = 'check-circle';
        }

        return (
            <li className={classNames(classes)} key={index}>
                <Icon name={icon} size="sm" className="install-layout__step-icon"/>
                {this.props.installed && (index + 1) !== 8 ?
                    <Link type="link"
                          to={'/install/step/' + (index + 1)}>
                        {index + 1}. {i18n(key)}
                    </Link>
                    : <span className="install-layout__step-text">
                        {index + 1}. {i18n(key)}
                    </span>
                }
            </li>
        )
    }

    getCurrentStep() {
        const pathname = this.props.location.pathname;

        if (_.includes(pathname, '1')) {
            return 0;
        } else if (_.includes(pathname, '2')) {
            return 1;
        } else if (_.includes(pathname, '3')) {
            return 2;
        } else if (_.includes(pathname, '4')) {
            return 3;
        } else if (_.includes(pathname, '5')) {
            return 4;
        } else if (_.includes(pathname, '6')) {
            return 5;
        } else if (_.includes(pathname, '7')) {
            return 6;
        } else if (_.includes(pathname, '8')) {
            return 7;
        }
    }

    closeSession() {
        this.props.dispatch(SessionActions.logout());
        window.location.reload(true);
    }
}

export default connect((store) => {
    return {
        installed: !!store.config.installed
    };
})(InstallLayout);
