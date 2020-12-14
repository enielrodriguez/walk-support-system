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
import ConfigActions from "../../actions/config-actions";
import CustomComponent from "../../lib-core/Component";

class InstallStep3Database extends CustomComponent {

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
        currentDbName: ''
    };

    componentDidMount() {
        this.retrieveData();
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
                      onChange={form => this.setState({form})}
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
                               infoMessage={this.props.installed ? i18n('LEAVE_EMPTY_TO_KEEP_CURRENT') : null}
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
        this.setState({loading: true});

        let data = _.clone(form);
        if (_.isEmpty(data.dbPassword)) {
            delete data.dbPassword;
        }

        API.call({
            path: '/system/init-database',
            data: data
        })
            .then((result) => {
                this.handleResult(form, result);
            })
            .catch(({message}) => {
                this.setState({
                    loading: false,
                    errorMessage: message
                });
            });

    }

    retrieveData() {
        // Can't restrict the api call (if (this.props.installed))
        // because it's necessary in case of changing the db to an empty one, or leave the
        // installation process just after having configured the DB.
        // Otherwise, in this situation, the form will reload empty (without the db settings)
        this.setState({loading: true});
        API.call({
            path: '/system/get-db-settings'
        })
            .then((result) => {
                const data = result.data;
                let state = _.extend(this.state, {
                    form: data,
                    currentHost: data['dbHost'],
                    currentDbName: data['dbName'],
                    loading: false,
                    errorMessage: ''
                });
                this.setState(state);
            })
            .catch((error) => this.setState({
                loading: false,
                errorMessage: error.message
            }));
    }

    handleResult(dataSubmitted, result) {
        const currentInstalled = this.props.installed;
        const installed = result.data;

        API.call({
            path: '/system/get-settings'
        }).then(result => {

            if ((this.state.currentHost && dataSubmitted.dbHost !== this.state.currentHost) || (this.state.currentDbName && dataSubmitted.dbName !== this.state.currentDbName)) {
                this.props.dispatch(ConfigActions.checkInstallation(installed));
                this.props.dispatch(ConfigActions.updateData(installed ? result.data : null))
            }

            if (result.data.language && this.props.language !== result.data.language) {
                this.props.dispatch(ConfigActions.changeLanguage(result.data.language));
            }

            if (!currentInstalled && !installed) {
                history.push('/install/step/4');
            } else if (!installed) {
                history.push('/install/step/1');
            } else {
                this.setState({
                    currentHost: dataSubmitted['dbHost'],
                    currentDbName: dataSubmitted['dbName'],
                    loading: false,
                    errorMessage: ''
                });
            }
        }).catch(({message}) => {
            this.setState({
                loading: false,
                errorMessage: message
            });
        });
    }
}

export default connect((store) => {
    return {
        installerLogged: !!store.config.installerLogged,
        installed: !!store.config.installed,
        language: store.config.language
    };
})(InstallStep3Database);
