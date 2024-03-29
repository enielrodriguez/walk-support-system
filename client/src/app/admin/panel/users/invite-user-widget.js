import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import Captcha from 'app/main/captcha';
import SubmitButton from 'core-components/submit-button';
import Message from 'core-components/message';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import Widget from 'core-components/widget';
import Header from 'core-components/header';
import CompanyDropdown from "../../../../app-components/company-dropdown";
import LoadingWithMessage from "../../../../core-components/loading-with-message";

class InviteUserWidget extends React.Component {

    static propTypes = {
        onSuccess: React.PropTypes.func,
        className: React.PropTypes.string
    };

    state = {
        loading: false,
        email: null,
        customFields: [],
        companies: [],
        loadingData: true,
        errorRetrievingData: false
    };

    componentDidMount() {
        this.retrieveData();
    }

    render() {
        return (
            <Widget className={this.getClass()}>
                <Header title={i18n('INVITE_USER')} description={i18n('INVITE_USER_VIEW_DESCRIPTION')}/>

                {this.state.loadingData ?
                    <LoadingWithMessage showMessage={this.state.errorRetrievingData}/>
                    :
                    <Form {...this.getFormProps()} >
                        <div className="invite-user-widget__inputs">
                            <FormField {...this.getInputProps()} label={i18n('FULL_NAME')} name="name" validation="NAME"
                                       required/>
                            <FormField {...this.getInputProps()} label={i18n('EMAIL')} name="email" validation="EMAIL"
                                       required/>
                            {
                                !this.props.companyId &&
                                <FormField {...this.getInputProps()} label={i18n('COMPANY')} name="companyIndex"
                                           field="select"
                                           decorator={CompanyDropdown} fieldProps={
                                    {
                                        companies: this.state.companies,
                                        size: "medium"
                                    }
                                }/>
                            }
                            {this.state.customFields.map(this.renderCustomField.bind(this))}
                        </div>
                        <div className="invite-user-widget__captcha">
                            <Captcha ref="captcha"/>
                        </div>
                        <SubmitButton type="primary">{i18n('INVITE_USER')}</SubmitButton>
                    </Form>
                }

                {this.renderMessage()}
            </Widget>
        );
    }

    retrieveData() {
        API.call({
            path: '/system/get-custom-fields',
            data: {}
        }).then((result) => {
            this.setState({customFields: result.data});
            this.retrieveCompanies();
        }).catch(() => this.setState({errorRetrievingData: true}));
    }

    retrieveCompanies() {
        API.call({
            path: '/user/get-companies',
            data: {
                getAll: true
            }
        }).then(result => this.setState({
            companies: result.data.companies,
            loadingData: false
        })).catch(() => this.setState({errorRetrievingData: true}));
    }

    renderCustomField(customField, key) {
        if (customField.type === 'text') {
            return (
                <FormField {...this.getInputProps()}
                           name={`customfield_${customField.name}`}
                           key={key}
                           label={customField.name}
                           infoMessage={customField.description}
                           field="input"/>
            );
        } else {
            const items = customField.options.map(option => ({content: option.name, value: option.name}));

            return (
                <FormField
                    name={`customfield_${customField.name}`}
                    key={key}
                    label={customField.name}
                    infoMessage={customField.description}
                    field="select"
                    fieldProps={{size: 'medium', items}}/>
            );
        }
    }

    renderMessage() {
        let messageKey = 'UNKNOWN_ERROR';
        let type = 'error';

        switch (this.state.message) {
            case undefined:
                return null;
            case 'success':
                messageKey = 'INVITE_USER_SUCCESS';
                type = 'success';
                break;
            case 'USER_EXISTS':
                messageKey = 'EMAIL_EXISTS';
                break;
            case 'INVALID_COMPANY':
                messageKey = 'INVALID_COMPANY';
                break;
            case 'INVALID_NAME':
                messageKey = 'ERROR_NAME';
                break;
            case 'USERS_LIMIT_REACHED':
                messageKey = 'USERS_LIMIT_REACHED';
                break;
        }

        return <Message type={type}>{i18n(messageKey)}</Message>;
    }

    getClass() {
        let classes = {
            'invite-user-widget': true,
            [this.props.className]: this.props.className
        };
        return classNames(classes);
    }

    getFormProps() {
        return {
            loading: this.state.loading,
            className: 'invite-user-widget__form',
            onSubmit: this.onInviteUserFormSubmit.bind(this)
        };
    }

    getInputProps(password) {
        return {
            className: 'invite-user-widget__input',
            fieldProps: {
                size: 'medium',
                password: password
            }
        };
    }

    onInviteUserFormSubmit(formState) {
        const captcha = this.refs.captcha.getWrappedInstance();

        if (!captcha.getValue()) {
            captcha.focus();
        } else {
            this.setState({
                loading: true
            });

            const form = _.clone(formState);

            form['companyId'] = this.props.companyId ?? this.state.companies[form['companyIndex']].id;

            delete form['companyIndex'];

            this.state.customFields.forEach(customField => {
                if (customField.type === 'select') {
                    form[`customfield_${customField.name}`] = customField.options[form[`customfield_${customField.name}`]].name;
                }
            })

            API.call({
                path: '/user/invite',
                data: _.extend({captcha: captcha.getValue()}, form)
            }).then(this.onInviteUserSuccess.bind(this)).catch(this.onInviteUserFail.bind(this));
        }
    }

    onInviteUserSuccess() {
        this.setState({
            loading: false,
            message: 'success'
        });
        if (this.props.onSuccess)
            this.props.onSuccess();
    }

    onInviteUserFail(reason) {
        this.setState({
            loading: false,
            message: reason ? reason.message : 'fail'
        });
    }
}

export default InviteUserWidget;
