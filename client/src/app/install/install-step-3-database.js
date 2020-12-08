import React from 'react';
import _ from 'lodash';

import history from 'lib-app/history';
import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import Button from 'core-components/button';
import Header from 'core-components/header';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';
import Message from 'core-components/message';
import {connect} from "react-redux";

class InstallStep3Database extends React.Component {

    state = {
        loading: false,
        errorMessage: '',
        form: {
            dbHost: '',
            dbPort: '',
            dbName: '',
            dbUser: ''
        },
        currentHost: '',
        currentName: '',
        partialInstalled: false
    };

    componentDidMount() {
        if (this.props.installed) {
            this.customSetState({loading: true});
            API.call({
                path: '/system/get-db-settings'
            })
                .then((result) => {
                    const data = result.data;
                    let state = _.extend(this.state, {
                        form: data,
                        currentHost: data['dbHost'],
                        currentName: data['dbName'],
                        loading: false,
                        errorMessage: ''
                    });
                    if (data.dbName && !this.props.installed) {
                        state.partialInstalled = true;
                    }
                    this.customSetState(state);
                })
                .catch(() => this.customSetState({
                    loading: false,
                    errorMessage: 'UNKNOWN_ERROR'
                }));
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
            <div className="install-step-3">
                <Header title={i18n('STEP_TITLE', {title: i18n('DATABASE_CONFIGURATION'), current: 3, total: 7})}
                        description={i18n('STEP_3_DESCRIPTION')}/>

                {this.state.errorMessage &&
                <Message className="install-step-3__message" type="error">
                    {i18n('ERROR_UPDATING_SETTINGS')}: {this.state.errorMessage}
                </Message>
                }

                <Form loading={loading}
                      values={form}
                      onChange={form => this.customSetState({form})}
                      onSubmit={this.onSubmit.bind(this)}>
                    <FormField name="dbHost" label={i18n('DATABASE_HOST')}
                               fieldProps={{size: 'large'}} required/>
                    <FormField name="dbPort" label={i18n('DATABASE_PORT')}
                               fieldProps={{size: 'large'}}
                               infoMessage={i18n('DEFAULT_PORT')}/>
                    <FormField name="dbName" label={i18n('DATABASE_NAME')}
                               fieldProps={{size: 'large'}} required/>
                    <FormField name="dbUser" label={i18n('DATABASE_USER')}
                               fieldProps={{size: 'large'}} required/>
                    <FormField name="dbPassword" label={i18n('DATABASE_PASSWORD')}
                               fieldProps={{size: 'large', password: true}}/>

                    <div className="install-step-3__buttons">
                        {!this.props.installed &&
                        <Button className="install-step-3__previous"
                                disabled={loading}
                                size="medium"
                                route={{to: '/install/step/2'}}>
                            {i18n('PREVIOUS')}
                        </Button>
                        }

                        <SubmitButton className="install-step-3__next" size="medium"
                                      type="secondary">
                            {i18n(this.props.installed ? 'SAVE' : 'NEXT')}
                        </SubmitButton>
                    </div>
                </Form>
            </div>
        );
    }

    onSubmit(form) {
        this.customSetState({loading: true});

        API.call({
            path: '/system/init-database',
            data: _.extend({}, form, {dbPort: form.dbPort || 3306})
        })
            .then(() => {
                if (!this.props.installed || this.state.partialInstalled)
                    history.push('/install/step/4')
                else {
                    if (form.dbHost !== this.state.currentHost || form.dbName !== this.state.currentName) {
                        window.location.reload(true);
                    } else {
                        this.customSetState({loading: false, errorMessage: ''});
                    }
                }
            })
            .catch(({message}) => {
                this.customSetState({
                    loading: false,
                    errorMessage: message
                });
            });

    }
}

export default connect((store) => {
    return {
        installerLogged: !!store.config.installerLogged,
        installed: !!store.config.installed
    };
})(InstallStep3Database);
