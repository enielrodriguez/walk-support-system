import React from 'react';
import ReactDOM from 'react-dom';
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

class AddUserWidget extends React.Component {

    static propTypes = {
        onSuccess: React.PropTypes.func,
        className: React.PropTypes.string
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            email: null,
            customFields: []
        };
    }

    componentDidMount() {
        this.setState({loading: true});

        API.call({
            path: '/system/get-custom-fields',
            data: {}
        }).then((result) => {
            this.setState({customFields: result.data, loading: false});
        });
    }

    render() {
        return (
            <Widget className={this.getClass()}>
                <Header title={i18n('INVITE_USER')} description={i18n('INVITE_USER_VIEW_DESCRIPTION')}/>
                <Form {...this.getFormProps()}>
                    <div className="add-user-widget__inputs">
                        <FormField {...this.getInputProps()} label={i18n('FULL_NAME')} name="name" validation="NAME"
                                   required/>
                        <FormField {...this.getInputProps()} label={i18n('EMAIL')} name="email" validation="EMAIL"
                                   required/>
                        {this.state.customFields.map(this.renderCustomField.bind(this))}
                    </div>
                    <div className="add-user-widget__captcha">
                        <Captcha ref="captcha"/>
                    </div>
                    <SubmitButton type="primary">{i18n('INVITE_USER')}</SubmitButton>
                </Form>

                {this.renderMessage()}
            </Widget>
        );
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
        switch (this.state.message) {
            case undefined:
                return null;
            case 'success':
                return <Message type="success">{i18n('INVITE_USER_SUCCESS')}</Message>;
            case 'USER_EXISTS':
                return <Message type="error">{i18n('EMAIL_EXISTS')}</Message>;
            case 'INVALID_NAME':
                return <Message type="error">{i18n('ERROR_NAME')}</Message>;
            default:
                return <Message type="error">{i18n('UNKNOWN_ERROR')}</Message>;
        }
    }

    getClass() {
        let classes = {
            'add-user-widget': true,
            [this.props.className]: this.props.className
        };
        return classNames(classes);
    }

    getFormProps() {
        return {
            loading: this.state.loading,
            className: 'add-user-widget__form',
            onSubmit: this.onInviteUserFormSubmit.bind(this)
        };
    }

    getInputProps(password) {
        return {
            className: 'add-user-widget__input',
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

export default AddUserWidget;
