import React from 'react';
import {connect} from 'react-redux'

import history from 'lib-app/history';
import i18n from 'lib-app/i18n';
import ConfigActions from 'actions/config-actions';

import ToggleButton from 'app-components/toggle-button';
import Header from 'core-components/header';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';
import Button from "../../core-components/button";
import Message from "../../core-components/message";
import API from "../../lib-app/api-call";

class InstallStep4UserSystem extends React.Component {

    state = {
        loading: false,
        form: {
            'mandatory-login': this.props.mandatoryLogin,
            'registration': this.props.registration
        },
        errorMessage: ''
    };

    render() {
        const {loading, form} = this.state
        return (
            <div className="install-step-4">
                <Header title={i18n('STEP_TITLE', {title: i18n('USER_SYSTEM'), current: 4, total: 7})}
                        description={i18n('STEP_4_DESCRIPTION')}/>

                {this.state.errorMessage &&
                <Message className="install-step-4__message" type="error">
                    {i18n('ERROR_UPDATING_SETTINGS')}: {this.state.errorMessage}
                </Message>
                }

                <Form loading={loading}
                      onSubmit={this.onSubmit.bind(this)}
                      values={form}
                      onChange={form => this.setState({form})}>

                    <div className="install-step-4__container">
                        <FormField
                            name="mandatory-login"
                            label={i18n('ENABLE_MANDATORY_LOGIN')}
                            decorator={ToggleButton}
                            fieldProps={{disabled: !form['registration']}}/>
                        <FormField
                            name="registration"
                            label={i18n('ENABLE_USER_REGISTRATION')}
                            decorator={ToggleButton}
                            fieldProps={{disabled: !form['mandatory-login']}}/>
                    </div>

                    <div className="install-step-4__buttons">
                        {!this.props.installed &&
                        <Button className="install-step-4__skip"
                                size="medium"
                                route={{to: '/install/step/3'}}>
                            {i18n('PREVIOUS')}
                        </Button>
                        }

                        <SubmitButton className="install-step-4__next" size="medium"
                                      type="secondary">
                            {i18n(this.props.installed ? 'SAVE' : 'NEXT')}
                        </SubmitButton>
                    </div>

                </Form>
            </div>
        );
    }

    onSubmit(form) {
        let data = {
            'mandatory-login': form['mandatory-login'] * 1,
            'registration': form['registration'] * 1
        }

        if (!this.props.installed) {
            this.props.dispatch(ConfigActions.updateUserSystemSettings(data));
            history.push('/install/step/5')
        } else {
            this.setState({loading: true});
            API.call({
                path: '/system/init-settings',
                data: data
            })
                .then(() => {
                    this.setState({loading: false, errorMessage: ''});
                    this.props.dispatch(ConfigActions.updateUserSystemSettings(data));
                })
                .catch(({message}) => this.setState({
                    loading: false,
                    errorMessage: message
                }));
        }
    }
}

export default connect((store) => {
    return {
        mandatoryLogin: !!store.config.installed ? store.config['mandatory-login'] : true,
        registration: !!store.config.installed ? store.config.registration : true,
        installed: !!store.config.installed
    };
})(InstallStep4UserSystem);
