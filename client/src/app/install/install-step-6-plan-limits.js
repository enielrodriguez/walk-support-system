import React from 'react';
import {connect} from 'react-redux'

import history from 'lib-app/history';
import i18n from 'lib-app/i18n';

import Header from 'core-components/header';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';
import API from "../../lib-app/api-call";
import Message from "../../core-components/message";
import ConfigActions from "../../actions/config-actions";

class InstallStep6PlanLimits extends React.Component {

    state = {
        loading: false,
        form: {
            'users': '0',
            'companies': '0',
            'staff': '0',
            'departments': '0'
        },
        errorMessage: ''
    };

    componentDidMount() {
        if (this.props.installed) {
            this.setState({
                form: {
                    'users': this.props.planLimit.users + '',
                    'companies': this.props.planLimit.companies + '',
                    'staff': this.props.planLimit.staff + '',
                    'departments': this.props.planLimit.departments + ''
                }
            });
        }
    }

    render() {
        const {loading, form} = this.state;

        return (
            <div className="install-step-6">
                <Header title={i18n('STEP_TITLE', {title: i18n('PLAN'), current: 6, total: 7})}
                        description={i18n('STEP_6_DESCRIPTION')}/>

                {this.state.errorMessage &&
                <Message className="install-step-6__message" type="error">
                    {i18n('ERROR_UPDATING_SETTINGS')}: {this.state.errorMessage}
                </Message>
                }

                <Form loading={loading}
                      onSubmit={this.onSubmit.bind(this)}
                      values={form}
                      onChange={form => this.setState({form})}>

                    <div className="install-step-6__container">
                        <FormField
                            name="users"
                            label={i18n('USERS_LIMIT')}
                            validation='NOT_SIGNED_INT'
                            infoMessage={this.getLimitInfo()}
                            required
                        />

                        <FormField
                            name="companies"
                            label={i18n('COMPANIES_LIMIT')}
                            validation='NOT_SIGNED_INT'
                            infoMessage={this.getLimitInfo(true)}
                            required
                        />

                        <FormField
                            name="staff"
                            label={i18n('STAFF_LIMIT')}
                            validation='NOT_SIGNED_INT'
                            infoMessage={this.getLimitInfo(true)}
                            required
                        />

                        <FormField
                            name="departments"
                            label={i18n('DEPARTMENTS_LIMIT')}
                            validation='NOT_SIGNED_INT'
                            infoMessage={this.getLimitInfo()}
                            required
                        />
                    </div>
                    <div className="install-step-6__buttons">
                        <SubmitButton className="install-step-6__next" size="medium"
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

        API.call({
            path: '/system/init-plan',
            data: form
        })
            .then(() => {
                this.props.dispatch(ConfigActions.updateData());
                if (!this.props.installed)
                    history.push('/install/step/7')
                else
                    this.setState({loading: false, errorMessage: ''});
            })
            .catch(({message}) => this.setState({
                loading: false,
                errorMessage: message
            }));
    }

    getLimitInfo(defaultEntity = false) {
        return (
            <div>
                {0 + ' = ' + i18n('UNLIMITED')}

                {defaultEntity &&
                <div>
                    {i18n('PLAN_LIMIT_HAS_DEFAULT_INFO')}
                </div>
                }
            </div>
        );
    }
}

export default connect((store) => {
    return {
        planLimit: store.config.plan_limit || {},
        installed: !!store.config.installed
    };
})
(InstallStep6PlanLimits);
