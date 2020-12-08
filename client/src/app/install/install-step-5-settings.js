import React from 'react';
import _ from 'lodash';
import {connect} from 'react-redux'

import history from 'lib-app/history';
import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import PopupMessage from 'app-components/popup-message';
import Button from 'core-components/button';
import Header from 'core-components/header';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';
import Message from 'core-components/message';
import ConfigActions from "../../actions/config-actions";

class InstallStep5Settings extends React.Component {

    state = {
        loading: false,
        form: {},
        errorMessage: ''
    };

    componentDidMount() {
        if (this.props.installed) {
            this.customSetState({loading: true});

            API.call({
                path: '/system/get-email-settings'
            })
                .then((result) => {
                    result.data['title'] = this.props.title;
                    result.data['allow-attachments'] = this.props['allow-attachments'];
                    this.customSetState({form: result.data, loading: false});
                })
                .catch(() => this.customSetState({errorMessage: 'UNKNOWN_ERROR', loading: false}));
        }
    }

    customSetState(state) {
        if (this.props.installerLogged) {
            this.setState(state);
        }
    }

    render() {
        const {loading, form} = this.state;

        return (
            <div className="install-step-5">
                <Header title={i18n('STEP_TITLE', {title: i18n('SETTINGS'), current: 5, total: 7})}
                        description={i18n('STEP_5_DESCRIPTION')}/>

                {this.state.errorMessage &&
                <Message className="install-step-5__message" type="error">
                    {i18n('ERROR_UPDATING_SETTINGS')}: {this.state.errorMessage}
                </Message>
                }

                <Form loading={loading}
                      onSubmit={this.onSubmit.bind(this)}
                      values={form}
                      onChange={(form) => this.customSetState({form})}>

                    <FormField name="title" label={i18n('TITLE')} fieldProps={{size: 'large'}} required/>
                    <FormField className="install-step-5__attachments-field" name="allow-attachments"
                               label={i18n('ALLOW_FILE_ATTACHMENTS')} field="checkbox" fieldProps={{size: 'large'}}/>
                    <FormField name="server-email" label={i18n('EMAIL_SERVER_ADDRESS')} fieldProps={{size: 'large'}}
                               infoMessage={i18n('EMAIL_SERVER_ADDRESS_DESCRIPTION')}/>

                    <div className="install-step-5__smtp-block">
                        <Header title={i18n('SMTP_SERVER')} description={i18n('SMTP_SERVER_DESCRIPTION')}/>
                        <FormField name="smtp-host" label={i18n('SMTP_SERVER')} fieldProps={{size: 'large'}}/>
                        <FormField name="smtp-user" label={i18n('SMTP_USER')} fieldProps={{size: 'large'}}/>
                        <FormField name="smtp-pass" label={i18n('SMTP_PASSWORD')}
                                   fieldProps={{size: 'large', password: true}}/>
                        <SubmitButton className="install-step-5__test-connection" size="medium"
                                      onClick={this.onTestSMTPClick.bind(this)} disabled={loading}>
                            {i18n('TEST_SMTP_CONNECTION')}
                        </SubmitButton>
                    </div>

                    <div className="install-step-5__buttons">

                        {!this.props.installed &&
                        <Button
                            className="install-step-5__previous"
                            size="medium"
                            disabled={loading}
                            route={{to: '/install/step/4'}}>
                            {i18n('PREVIOUS')}
                        </Button>
                        }

                        <SubmitButton className="install-step-5__next" size="medium" type="secondary">
                            {i18n(this.props.installed ? 'SAVE' : 'NEXT')}
                        </SubmitButton>
                    </div>

                </Form>
            </div>
        );
    }

    onTestSMTPClick(event) {
        event.preventDefault();

        this.customSetState({
            loading: true
        });

        API.call({
            path: '/system/test-smtp',
            data: this.state.form
        })
            .then(() => {
                PopupMessage.open({
                    title: i18n('SETTINGS_UPDATED'),
                    children: i18n('SMTP_SUCCESS'),
                    type: 'success',
                    loading: false

                });
                this.customSetState({loading: false});
            })
            .catch(result => {
                PopupMessage.open({
                    title: i18n('ERROR_UPDATING_SETTINGS'),
                    children: result.message,
                    type: 'error',
                    loading: false
                });
                this.customSetState({loading: false});
            });
    }

    onSubmit(form) {
        this.customSetState({loading: true});

        let data = _.clone(form);
        data['allow-attachments'] = data['allow-attachments'] * 1;

        if (!this.props.installed) {
            data = _.extend({}, data, {
                'mandatory-login': this.props['mandatory-login'] ? 1 : 0,
                'registration': this.props['registration'] ? 1 : 0,
                'language': this.props['language'],
                'url': root
            });
        }

        API.call({
            path: '/system/init-settings',
            data: data
        })
            .then(() => {
                this.props.dispatch(ConfigActions.updateData());
                if (!this.props.installed)
                    history.push('/install/step/6')
                else
                    this.customSetState({loading: false, errorMessage: ''});
            })
            .catch(({message}) => this.customSetState({
                loading: false,
                errorMessage: message
            }));
    }
}

export default connect((store) => {
    return {
        'mandatory-login': store.config['mandatory-login'],
        'allow-attachments': store.config['allow-attachments'],
        'registration': store.config.registration,
        title: store.config.title,
        language: store.config.language,
        timezone: store.config.timezone,
        installed: !!store.config.installed,
        installerLogged: !!store.config.installerLogged
    };
})(InstallStep5Settings);
