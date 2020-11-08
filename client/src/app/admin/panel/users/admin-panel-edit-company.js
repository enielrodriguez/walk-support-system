import React from 'react';
import _ from 'lodash';

import API from 'lib-app/api-call';
import i18n from 'lib-app/i18n';

import Header from 'core-components/header';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';
import Message from 'core-components/message';
import LoadingWithMessage from "../../../../core-components/loading-with-message";


class AdminPanelEditCompany extends React.Component {

    state = {
        company: {},
        submitting: false,
        message: '',
        loadingData: true,
        errorRetrievingData: false
    };

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
                                       fieldProps={{size: 'large'}} required/>


                            <div className="admin-panel-edit-company__warning">
                                {i18n('WARNING_COMPANY_EDIT_ADMIN')}
                            </div>

                            <FormField name="new_admin_name" label={i18n('ADMIN_NAME')} field="input"
                                       infoMessage={this.getEditAdminInfo()} fieldProps={{size: 'large'}}/>

                            <FormField name="new_admin_email" label={i18n('ADMIN_EMAIL')} field="input"
                                       validation="EMAIL" fieldProps={{size: 'large'}}/>

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
        this.setState({
            company: result.data.company,
            loadingData: false
        });
    }

    onSubmitEditCompany(formState) {
        this.setState({
            submitting: true
        });

        const data = _.clone(formState);

        delete data['admin'];

        return API.call({
            path: "/user/edit-company",
            data: {
                ...data
            }
        }).then(() => {
            this.setState({
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
        switch (this.state.message) {
            case '':
                return null;
            case 'success':
                return <Message type="success">{i18n('CHANGES_SAVED')}</Message>;
            case 'COMPANY_EXISTS':
                return <Message type="error">{i18n('ERROR_NIT_EXISTS')}</Message>;
            case 'USER_EXISTS':
                return <Message type="error">{i18n('ERROR_ADMIN_EXISTS')}</Message>;
            case 'INVALID_USER':
                return <Message type="error">{i18n('ERROR_USER_FROM_OTHER_COMPANY')}</Message>;
            case 'USER_ALREADY_ADMIN':
                return <Message type="error">{i18n('ERROR_ALREADY_ADMIN')}</Message>;
            case 'INVALID_NAME':
                return <Message type="error">{i18n('ERROR_BUSINESS_NAME')}</Message>;
            case 'INVALID_NIT':
                return <Message type="error">{i18n('ERROR_INVALID_NIT')}</Message>;
            case 'INVALID_PHONE':
                return <Message type="error">{i18n('ERROR_PHONE')}</Message>;
            case 'INVALID_CONTACT_NAME':
                return <Message type="error">{i18n('ERROR_CONTACT_NAME')}</Message>;
            case 'INVALID_ADMIN_NAME':
            case 'INVALID_ADMIN_EMAIL':
                return <Message type="error">{i18n('ERROR_COMPANY_ADMIN')}</Message>;
            default:
                return <Message type="error">{i18n('UNKNOWN_ERROR')}</Message>;
        }
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
}

export default AdminPanelEditCompany;
