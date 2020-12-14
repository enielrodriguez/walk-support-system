import React from 'react';
import {connect} from 'react-redux';

import i18n from 'lib-app/i18n';
import ConfigActions from 'actions/config-actions';

import LanguageSelector from 'app-components/language-selector';
import Header from 'core-components/header';
import API from "../../lib-app/api-call";
import Message from "../../core-components/message";
import history from "../../lib-app/history";
import Form from "../../core-components/form";
import SubmitButton from "../../core-components/submit-button";
import CustomComponent from "../../lib-core/Component";

class InstallStep1Language extends CustomComponent {

    state = {
        loading: false,
        errorMessage: ''
    };

    render() {
        return (
            <div className="install-step-1">
                <Header title={i18n('STEP_TITLE', {title: i18n('SELECT_LANGUAGE'), current: 1, total: 7})}
                        description={i18n('STEP_1_DESCRIPTION')}/>

                {this.state.errorMessage &&
                <Message className="install-step-1__message" type="error">
                    {i18n('ERROR_UPDATING_SETTINGS')}: {this.state.errorMessage}
                </Message>
                }

                <Form loading={this.state.loading} onSubmit={this.submitOptions.bind(this)}>

                    <LanguageSelector {...this.getLanguageSelectorProps()} />

                    <div className="install-step-1__button">
                        <SubmitButton {...this.getButtonProps()} >
                            {i18n(this.props.installed ? 'SAVE' : 'NEXT')}
                        </SubmitButton>
                    </div>
                </Form>
            </div>
        );
    }

    getButtonProps() {
        return {
            size: "medium",
            type: "secondary",
        }
    }

    getLanguageSelectorProps() {
        return {
            className: 'install-step-1__languages',
            value: this.props.config.language,
            type: 'allowed',
            onChange: this.changeLanguage.bind(this)
        };
    }

    changeLanguage(event) {
        this.props.dispatch(ConfigActions.changeLanguage(event.target.value));
    }

    submitOptions(form) {
        if (!this.props.installed) {
            history.push('/install/step/2');
        } else {
            this.setState({loading: true});

            API.call({
                path: '/system/init-settings',
                data: {
                    'language': this.props.config.language
                }
            })
                .then(() => this.setState({
                    loading: false,
                    errorMessage: '',
                }))
                .catch(({message}) => this.setState({
                    loading: false,
                    errorMessage: message
                }));
        }
    }
}


export default connect((store) => {
    return {
        config: store.config,
        installed: !!store.config.installed
    };
})(InstallStep1Language);
