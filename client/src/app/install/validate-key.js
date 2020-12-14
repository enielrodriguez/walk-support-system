import React from 'react';
import {connect} from 'react-redux'

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';
import Message from 'core-components/message';
import Widget from 'core-components/widget';
import store from "../store";
import ConfigActions from "../../actions/config-actions";
import CustomComponent from "../../lib-core/Component";

class ValidateKey extends CustomComponent {

    state = {
        sideToShow: 'front',
        loading: false,
        errorMessage: null
    };

    render() {
        return (
            <div className="install-key">
                <div className="install-key__container">
                    {this.renderLogin()}
                </div>
            </div>
        );
    }

    renderLogin() {
        return (
            <div>
                <Widget className="install-key__content">
                    <div className="install-key__image">
                        <img width="100%"
                             src={API.getURL() + '/images/logo.png'}
                             alt="Admin Panel"/>
                    </div>

                    <div className="install-key__login-form-container">
                        <Form {...this.getLoginFormProps()}>
                            <div className="install-key__login-form-container__login-form__fields">
                                <FormField
                                    name="key"
                                    label={i18n('INSTALLATION_KEY')}
                                    className="install-key__login-form-container__login-form__fields__key"
                                    field="input"
                                    fieldProps={{autoComplete: 'off', size: 'large'}}/>
                            </div>
                            <div className="install-key__login-form-container__login-form__submit-button">
                                <SubmitButton>{i18n('SUBMIT')}</SubmitButton>
                            </div>
                        </Form>
                    </div>

                    {this.state.errorMessage &&
                    <Message className="install-key__error" type="error">
                        {i18n(this.state.errorMessage)}
                    </Message>
                    }

                </Widget>
            </div>
        );
    }

    getLoginFormProps() {
        return {
            loading: this.state.loading,
            className: 'install-key__login-form-container__login-form',
            onSubmit: this.onLoginFormSubmit.bind(this)
        };
    }

    onLoginFormSubmit(formState) {
        this.setState({
            loading: true
        });

        API.call({
            path: '/system/validate-key',
            data: {
                key: formState.key
            }
        })
            .then(() => store.dispatch(ConfigActions.updateData()))
            .catch(({message}) => this.setState({
                loading: false,
                errorMessage: message
            }));
    }
}

export default connect((store) => {
    return {
        config: store.config
    }
})(ValidateKey);
