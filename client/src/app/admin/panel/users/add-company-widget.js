import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
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
        className: React.PropTypes.string
    };

    state = {
        loading: false
    };

    render() {
        return (
            <Widget className={this.getClass()}>
                <Header title={i18n('ADD_COMPANY')} description={i18n('ADD_COMPANY_VIEW_DESCRIPTION')}/>
                <Form {...this.getFormProps()}>
                    <div className="add-company-widget__inputs">
                        <FormField {...this.getInputProps()} label={i18n('BUSINESS_NAME')} name="business_name"
                                   required/>
                        <FormField {...this.getInputProps()} label={i18n('NIT')} name="nit" required/>
                        <FormField {...this.getInputProps()} label={i18n('PHONE')} name="phone" validation="PHONE"
                                   required/>
                        <FormField {...this.getInputProps()} label={i18n('CONTACT_NAME')} name="contact_name" required/>

                        <Header title={i18n('COMPANY_ADMIN')} description={i18n('COMPANY_ADMIN_WARNING')}/>
                        <FormField {...this.getInputProps()} label={i18n('NAME')} name="admin_name" required/>
                        <FormField {...this.getInputProps()} label={i18n('EMAIL')} name="admin_email" required/>
                    </div>

                    <SubmitButton type="primary">{i18n('ADD_COMPANY')}</SubmitButton>
                </Form>

                {this.renderMessage()}
            </Widget>
        );
    }


    renderMessage() {
        switch (this.state.message) {
            case undefined:
                return null;
            case 'success':
                return <Message type="success">{i18n('ADD_COMPANY_SUCCESS')}</Message>;
            case 'COMPANY_EXISTS':
                return <Message type="error">{i18n('ERROR_NIT_EXISTS')}</Message>;
            case 'USER_EXISTS':
                return <Message type="error">{i18n('ERROR_ADMIN_EXISTS')}</Message>;
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

    getInputProps() {
        return {
            className: 'add-company-widget__input',
            fieldProps: {
                size: 'medium'
            }
        };
    }

    onAddCompanyFormSubmit(formState) {

        this.setState({
            loading: true
        });

        const form = _.clone(formState);

        API.call({
            path: '/user/add-company',
            data: form
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
}

export default AddCompanyWidget;
