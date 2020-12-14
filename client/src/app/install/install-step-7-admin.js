import React from 'react';

import history from 'lib-app/history';
import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import Header from 'core-components/header';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';
import Message from 'core-components/message';
import {connect} from "react-redux";
import _ from "lodash";
import CustomComponent from "../../lib-core/Component";

class InstallStep7Admin extends CustomComponent {

    state = {
        loading: false,
        touched: false,
        errorMessage: '',
        form: {},
        formErrors: {}
    };

    componentDidMount() {
        if (this.props.installed) {
            this.setState({loading: true});
            API.call({
                path: '/system/get-admin-settings'
            })
                .then((result) => {
                    this.setState({form: result.data, loading: false});
                })
                .catch(() => this.setState({errorMessage: 'UNKNOWN_ERROR', loading: false}));
        }
    }
    
    render() {
        const {loading, form} = this.state;
        return (
            <div className="install-step-7">
                <Header title={i18n('STEP_TITLE', {title: i18n('ADMIN_SETUP'), current: 7, total: 7})}
                        description={i18n('STEP_7_DESCRIPTION')}/>

                {this.state.errorMessage &&
                <Message className="install-step-7__message" type="error">
                    {i18n('ERROR_UPDATING_SETTINGS')}: {this.state.errorMessage}
                </Message>
                }

                <Form loading={loading}
                      takeExternalErrors
                      onSubmit={this.onSubmit.bind(this)}
                      values={form}
                      errors={this.getFormErrors()}
                      onChange={form => this.setState({form})}
                      onValidateErrors={this.onValidateErrors.bind(this)}
                >
                    <FormField name="name" validation="NAME" label={i18n('ADMIN_NAME')} fieldProps={{size: 'large'}}
                               required/>
                    <FormField name="email" validation="EMAIL" label={i18n('ADMIN_EMAIL')} fieldProps={{size: 'large'}}
                               required/>
                    <FormField name="password"
                               label={i18n('ADMIN_PASSWORD')}
                               infoMessage={this.props.installed ? i18n('LEAVE_EMPTY_TO_KEEP_CURRENT') : i18n('ADMIN_PASSWORD_DESCRIPTION')}
                               fieldProps={{size: 'large', autoComplete: 'off'}}
                    />

                    <div className="install-step-7__buttons">
                        <SubmitButton className="install-step-7__next" size="medium"
                                      type="secondary">
                            {i18n(this.props.installed ? 'SAVE' : 'NEXT')}
                        </SubmitButton>
                    </div>
                </Form>
            </div>
        );
    }

    onSubmit(form) {
        this.setState({loading: true});

        let data = _.clone(form);
        if (_.isEmpty(data.password)) {
            delete data.password;
        }

        API.call({
            path: '/system/init-admin',
            data: data
        })
            .then(() => {
                if (!this.props.installed)
                    history.push('/install/completed')
                else
                    this.setState({loading: false, errorMessage: ''});
            })
            .catch(({message}) => this.setState({
                loading: false,
                errorMessage: message
            }));

    }

    onValidateErrors(errors) {
        let state = {
            formErrors: errors
        };

        if (!this.state.touched) {
            state.touched = true;
        }

        this.setState(state);
    }

    getFormErrors() {
        let errors = _.clone(this.state.formErrors);
        errors.password = undefined;
        const password = this.state.form.password;

        if (!this.props.installed && this.state.touched && _.isEmpty(password)) {
            errors.password = i18n('ERROR_EMPTY');
        }

        if (!_.isEmpty(password) && password.length < 6) {
            errors.password = i18n('ERROR_PASSWORD');
        }

        return errors;
    }
}

export default connect((store) => {
    return {
        installerLogged: !!store.config.installerLogged,
        installed: !!store.config.installed
    };
})(InstallStep7Admin);
