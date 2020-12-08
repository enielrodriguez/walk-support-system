import React from 'react';
import {connect} from 'react-redux';

import classNames from 'classnames';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import SubmitButton from 'core-components/submit-button';
import Message from 'core-components/message';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import Widget from 'core-components/widget';
import Header from 'core-components/header';

class AddCompanyWidget extends React.Component {

    static propTypes = {
        onSuccess: React.PropTypes.func,
        className: React.PropTypes.string,
    };

    state = {
        loading: false,
        limitReached: false
    };

    componentDidMount() {
        if (this.props.planLimit['unassigned_users_quota'] === 0) {
            this.setState({limitReached: true});
        }
    }

    render() {
        return (
            <Widget className={this.getClass()}>
                <Header title={i18n('ADD_COMPANY')} description={i18n('ADD_COMPANY_DESCRIPTION')}/>
                <Form {...this.getFormProps()}>
                    <div className="add-company-widget__inputs">
                        <FormField {...this.getInputProps()} label={i18n('BUSINESS_NAME')} name="business_name"
                                   required/>
                        <FormField {...this.getInputProps()} label={i18n('NIT')} name="nit" required/>
                        <FormField {...this.getInputProps()} label={i18n('PHONE')} name="phone" validation="PHONE"
                                   required/>

                        <FormField {...this.getInputProps()} label={i18n('CONTACT_NAME')} name="contact_name"/>

                        <div className="add-company-widget__limit-label">
                            {i18n('USERS_LIMIT')}
                        </div>
                        {this.getUsersLimitDescription()}
                        <FormField {...this.getInputProps(this.state.limitReached)}
                                   label={i18n('USERS_LIMIT')}
                                   name="users_limit"
                                   infoMessage={this.getUsersLimitInfo()}
                                   validation='NOT_SIGNED_INT'
                                   value='0'
                                   required/>

                        <Header title={i18n('COMPANY_ADMIN')} description={i18n('COMPANY_ADMIN_WARNING')}/>
                        <FormField {...this.getInputProps(this.state.limitReached)} label={i18n('NAME')}
                                   name="admin_name"/>
                        <FormField {...this.getInputProps(this.state.limitReached)} label={i18n('EMAIL')}
                                   name="admin_email"
                                   validation="EMAIL"/>
                    </div>

                    {this.state.limitReached &&
                    <div className="add-company-widget__warning">
                        {i18n('ADD_COMPANY_WITH_LIMIT_REACHED_INFO')}
                    </div>
                    }

                    <SubmitButton type="primary">{i18n('ADD_COMPANY')}</SubmitButton>
                </Form>

                {this.renderMessage()}
            </Widget>
        );
    }


    renderMessage() {
        let messageKey = 'UNKNOWN_ERROR';
        let type = 'error';

        switch (this.state.message) {
            case undefined:
                return null;
            case 'success':
                messageKey = 'ADD_COMPANY_SUCCESS';
                type = 'success';
                break;
            case 'COMPANY_EXISTS':
                messageKey = 'ERROR_NIT_EXISTS';
                break;
            case 'USER_EXISTS':
                messageKey = 'ERROR_ADMIN_EXISTS';
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
            case 'COMPANIES_LIMIT_REACHED':
                messageKey = 'COMPANIES_LIMIT_REACHED';
                break;
            case 'USERS_LIMIT_REACHED':
                messageKey = 'USERS_LIMIT_REACHED';
                break;
            case 'INVALID_USERS_LIMIT':
                messageKey = 'INVALID_USERS_LIMIT';
                break;
        }

        return <Message type={type}>{i18n(messageKey)}</Message>;
    }

    getClass() {
        let classes = {
            'add-company-widget': true,
            [this.props.className]: this.props.className
        };
        return classNames(classes);
    }

    getFormProps() {
        return {
            loading: this.state.loading,
            className: 'add-company-widget__form',
            onSubmit: this.onAddCompanyFormSubmit.bind(this)
        };
    }

    getInputProps(disabled = false) {
        return {
            className: 'add-company-widget__input',
            fieldProps: {
                size: 'medium',
                disabled: disabled
            }
        };
    }

    onAddCompanyFormSubmit(formState) {

        if (!!(!!formState.admin_name ^ !!formState.admin_email)) {
            this.setState({
                message: 'INVALID_ADMIN_NAME'
            });
            return;
        }

        this.setState({
            loading: true
        });

        API.call({
            path: '/user/add-company',
            data: formState
        }).then(this.onAddCompanySuccess.bind(this)).catch(this.onAddCompanyFail.bind(this));
    }

    onAddCompanySuccess() {
        this.setState({
            loading: false,
            message: 'success'
        });
        if (this.props.onSuccess)
            this.props.onSuccess();
    }

    onAddCompanyFail(reason) {
        this.setState({
            loading: false,
            message: reason ? reason.message : 'fail'
        });
    }

    getUsersLimitDescription() {
        return (
            <div className="add-company-widget__users-limit-description">
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
            </div>
        );
    }

    getUsersLimitInfo() {
        return (
            <div className="add-company-widget__limit-info">
                <div className="add-company-widget__limit-info-box">
                    <span className="add-company-widget__limit-info-title"> - </span>
                    <span
                        className="add-company-widget__limit-info-description">{i18n('COMPANY_USERS_LIMIT_INFO_1')}</span>
                </div>
                <div className="add-company-widget__limit-info-box">
                    <span className="add-company-widget__limit-info-title"> - </span>
                    <span
                        className="add-company-widget__limit-info-description">{i18n('COMPANY_USERS_LIMIT_INFO_2')}</span>
                </div>
                <div className="add-company-widget__limit-info-box">
                    <span className="add-company-widget__limit-info-title"> - </span>
                    <span
                        className="add-company-widget__limit-info-description">{i18n('COMPANY_USERS_LIMIT_INFO_3')}</span>
                </div>
            </div>
        );
    }
}

export default connect((store) => {
    return {
        planLimit: store.config.plan_limit || {}
    };
})(AddCompanyWidget);
