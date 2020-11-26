import React from 'react';
import {connect} from 'react-redux';

import API from 'lib-app/api-call';
import i18n from 'lib-app/i18n';

import Header from 'core-components/header';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';
import Message from 'core-components/message';
import LoadingWithMessage from "../../../../core-components/loading-with-message";
import ConfigActions from "../../../../actions/config-actions";


class AdminPanelEditCompany extends React.Component {

    state = {
        company: {},
        usersInCompany: 0,
        currentUsersLimit: 0,
        submitting: false,
        message: '',
        loadingData: true,
        errorRetrievingData: false,
        hasAdmin: false,
        limitReached: false
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.planLimit['unassigned_users_quota'] !== this.props.planLimit['unassigned_users_quota']) {
            if (this.props.planLimit['unassigned_users_quota'] === 0) {
                this.setState({limitReached: true});
            } else {
                this.setState({limitReached: false});
            }
        }
    }

    componentDidMount() {
        this.retrieveData();
    }

    render() {
        return this.state.loadingData ?
            <LoadingWithMessage showMessage={this.state.errorRetrievingData}/>
            : (
                <div className="admin-panel-edit-company-cont">
                    <Header title={i18n('EDIT_COMPANY')} description={i18n('EDIT_COMPANY_DESCRIPTION')}/>
                    <div className="admin-panel-edit-company">
                        <Form loading={this.state.submitting}
                              onSubmit={this.onSubmitEditCompany.bind(this)}
                              values={this.state.company}
                              onChange={form => this.setState({company: form})}>

                            <FormField name="business_name" label={i18n('BUSINESS_NAME')} field="input"
                                       fieldProps={{size: 'large'}} required/>

                            <FormField name="nit" label={i18n('NIT')} field="input"
                                       fieldProps={{size: 'large'}} required/>

                            <FormField name="phone" label={i18n('PHONE')} validation="PHONE"
                                       field="input" fieldProps={{size: 'large'}} required/>

                            <FormField name="contact_name" label={i18n('CONTACT_NAME')} field="input"
                                       fieldProps={{size: 'large'}}/>


                            <div className="admin-panel-edit-company__field-header">
                                {i18n('USERS_LIMIT')}
                            </div>
                            {this.getUsersLimitDescription()}
                            <FormField label={i18n('USERS_LIMIT')}
                                       name="users_limit"
                                       infoMessage={this.getUsersLimitInfo()}
                                       validation='NOT_SIGNED_INT'
                                       fieldProps={{size: 'large'}}
                                       required/>

                            <div className="admin-panel-edit-company__field-header">
                                {i18n('WARNING_COMPANY_EDIT_ADMIN')}
                            </div>

                            <FormField name="new_admin_name" label={i18n('ADMIN_NAME')} field="input"
                                       infoMessage={this.getEditAdminInfo()} fieldProps={{size: 'large'}}/>

                            <FormField name="new_admin_email" label={i18n('ADMIN_EMAIL')} field="input"
                                       fieldProps={{size: 'large'}}/>

                            <div className="admin-panel-edit-company__row">
                                <SubmitButton>{i18n('SAVE')}</SubmitButton>
                            </div>
                        </Form>
                    </div>

                    {this.renderMessageResponse()}

                </div>
            );
    }

    retrieveData() {
        API.call({
            path: '/user/get-company',
            data: {
                companyId: this.props.params.companyId
            }
        }).then(this.onCompanyRetrieved.bind(this)).catch(() => this.setState({
                errorRetrievingData: true
            })
        );
    }

    onCompanyRetrieved(result) {
        result.data.company['new_admin_name'] = '';
        result.data.company['new_admin_email'] = '';

        // delete current admin data
        delete result.data.company['admin'];

        this.setState({
            company: result.data.company,
            usersInCompany: result.data.users.length,
            currentUsersLimit: result.data.company.users_limit,
            loadingData: false
        });
    }

    onSubmitEditCompany(formState) {
        this.setState({
            submitting: true
        });

        return API.call({
            path: "/user/edit-company",
            data: {
                ...formState
            }
        }).then(() => {
            this.props.dispatch(ConfigActions.updateData());

            let company = _.clone(formState);
            company['new_admin_name'] = '';
            company['new_admin_email'] = '';

            this.setState({
                company: company,
                currentUsersLimit: company.users_limit,
                submitting: false,
                message: "success"
            });
        }).catch((r) => {
            this.setState({
                submitting: false,
                message: r.message
            })
        });
    }

    renderMessageError() {
        return <Message className="admin-panel-edit-company__message"
                        type="error">{i18n('UNKNOWN_ERROR')}</Message>
    }

    renderMessageResponse() {
        let messageKey = 'UNKNOWN_ERROR';
        let type = 'error';

        switch (this.state.message) {
            case '':
                return null;
            case 'success':
                messageKey = 'CHANGES_SAVED';
                type = 'success';
                break;
            case 'COMPANY_EXISTS':
                messageKey = 'ERROR_NIT_EXISTS';
                break;
            case 'USER_EXISTS':
                messageKey = 'ERROR_ADMIN_EXISTS';
                break;
            case 'INVALID_USER':
                messageKey = 'ERROR_USER_FROM_OTHER_COMPANY';
                break;
            case 'USER_ALREADY_ADMIN':
                messageKey = 'ERROR_ALREADY_ADMIN';
                break;
            case 'INVALID_NAME':
                messageKey = 'ERROR_BUSINESS_NAME';
                break;
            case 'INVALID_NIT':
                messageKey = 'ERROR_INVALID_NIT';
                break;
            case 'INVALID_PHONE':
                messageKey = 'ERROR_PHONE';
                break;
            case 'INVALID_CONTACT_NAME':
                messageKey = 'ERROR_CONTACT_NAME';
                break;
            case 'INVALID_ADMIN_NAME':
            case 'INVALID_ADMIN_EMAIL':
                messageKey = 'ERROR_COMPANY_ADMIN';
                break;
            case 'USERS_LIMIT_REACHED':
                messageKey = 'USERS_LIMIT_REACHED';
                break;
            case 'INVALID_USERS_LIMIT':
                messageKey = 'INVALID_USERS_LIMIT';
                break;
            default:
                return <Message type="error">{i18n('UNKNOWN_ERROR')}</Message>;
        }
        return <Message type={type}>{i18n(messageKey)}</Message>;
    }


    getEditAdminInfo() {
        return (
            <div className="admin-panel-edit-company__edit-admin-info">
                <div className="admin-panel-edit-company__edit-admin-info-box">
                    <span className="admin-panel-edit-company__edit-admin-info-description">
                        {i18n('WARNING_COMPANY_EDIT_ADMIN_DESC')}
                    </span>
                </div>
            </div>
        );
    }

    getUsersLimitDescription() {
        return (
            <div className="admin-panel-edit-company__users-limit-description">
                <div>
                    {i18n('PLAN_DOTS')}
                    {
                        this.props.planLimit['users'] || i18n('UNLIMITED')
                    }
                </div>
                <div>
                    {i18n('AVAILABLE')}
                    {
                        this.props.planLimit['users'] ?
                            this.state.limitReached ? i18n('LIMIT_REACHED') : this.props.planLimit['unassigned_users_quota']
                            : i18n('UNLIMITED')
                    }
                </div>
                <div>
                    {i18n('USERS_IN_COMPANY', {'users': this.state.usersInCompany})}
                </div>
                <div>
                    {i18n('MIN_VALUE_ALLOWED', {'value': this.state.usersInCompany})}
                </div>
                <div>
                    {i18n('MAX_VALUE_ALLOWED', {
                            'value': this.props.planLimit['users'] ?
                                (this.state.limitReached ? i18n('LIMIT_REACHED') : this.state.usersInCompany + this.props.planLimit['unassigned_users_quota'])
                                : i18n('UNLIMITED')
                        }
                    )}
                </div>
            </div>
        );
    }

    getUsersLimitInfo() {
        return (
            <div className="admin-panel-edit-company__limit-info">
                <div className="admin-panel-edit-company__limit-info-box">
                    <span className="admin-panel-edit-company__limit-info-title"> - </span>
                    <span
                        className="admin-panel-edit-company__limit-info-description">{i18n('COMPANY_USERS_LIMIT_INFO_1')}</span>
                </div>
                <div className="admin-panel-edit-company__limit-info-box">
                    <span className="admin-panel-edit-company__limit-info-title"> - </span>
                    <span
                        className="admin-panel-edit-company__limit-info-description">{i18n('COMPANY_USERS_LIMIT_INFO_2')}</span>
                </div>
                <div className="admin-panel-edit-company__limit-info-box">
                    <span className="admin-panel-edit-company__limit-info-title"> - </span>
                    <span
                        className="admin-panel-edit-company__limit-info-description">{i18n('COMPANY_USERS_LIMIT_INFO_3')}</span>
                </div>
            </div>
        );
    }
}

export default connect((store) => {
    let config = store.config;
    return {
        config: config,
        planLimit: config.plan_limit || {}
    };
})(AdminPanelEditCompany);
