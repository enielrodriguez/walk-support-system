import React from 'react';
import _ from 'lodash';

import API from 'lib-app/api-call';
import i18n from 'lib-app/i18n';
import {getCustomFieldParamName} from 'lib-core/APIUtils';

import Header from 'core-components/header';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';
import Message from 'core-components/message';
import LoadingWithMessage from "../../../../core-components/loading-with-message";


class AdminPanelEditUser extends React.Component {

    state = {
        name: '',
        email: '',
        loadingName: false,
        loadingEmail: false,
        loadingPass: false,
        loadingCustomFields: false,
        messageName: '',
        messageEmail: '',
        messageCustomFields: '',
        messagePass: '',
        customFields: [],
        customFieldsFormValues: {},
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
                <div className="admin-panel-edit-user-cont">
                    <Header title={i18n('EDIT_USER')} description={i18n('EDIT_USER_DESCRIPTION')}/>
                    <div className="admin-panel-edit-user">
                        <Form loading={this.state.loadingName}
                              onSubmit={this.onSubmitEditName.bind(this)}
                              values={{newName: this.state.name}}
                              onChange={form => this.setState({name: form.newName})}>
                            <FormField name="newName" label={i18n('EDIT_NAME')} field="input"
                                       fieldProps={{size: 'large'}} required/>
                            <div className="admin-panel-edit-user__row">
                                <SubmitButton>{i18n('CHANGE_NAME')}</SubmitButton>
                            </div>
                            {this.renderMessageName()}
                        </Form>

                        <Form loading={this.state.loadingEmail}
                              onSubmit={this.onSubmitEditEmail.bind(this)}
                              values={{newEmail: this.state.email}}
                              onChange={form => this.setState({email: form.newEmail})}>
                            <FormField name="newEmail" label={i18n('EDIT_EMAIL')} validation="EMAIL"
                                       fieldProps={{size: 'large'}} required/>
                            <div className="admin-panel-edit-user__row">
                                <SubmitButton>{i18n('CHANGE_EMAIL')}</SubmitButton>
                            </div>
                            {this.renderMessageEmail()}
                        </Form>

                        <Form loading={this.state.loadingPass} onSubmit={this.onSubmitEditPassword.bind(this)}>
                            <FormField name="password" label={i18n('NEW_PASSWORD')} field="input" validation="PASSWORD"
                                       fieldProps={{password: true, size: 'large'}} required/>
                            <FormField name="repeatNewPassword" label={i18n('REPEAT_NEW_PASSWORD')} field="input"
                                       validation="REPEAT_PASSWORD" fieldProps={{password: true, size: 'large'}}
                                       required/>
                            <div className="admin-panel-edit-user__row">
                                <SubmitButton>{i18n('CHANGE_PASSWORD')}</SubmitButton>
                            </div>
                            {this.renderMessagePass()}
                        </Form>

                        {this.state.customFields.length && this.renderCustomFields()}
                    </div>
                </div>
            );
    }

    renderCustomFields() {
        return (
            <div>
                <div className="admin-panel-edit-user__title">{i18n('ADDITIONAL_FIELDS')}</div>
                <Form loading={this.state.loadingCustomFields} values={this.state.customFieldsFormValues}
                      onChange={form => this.setState({customFieldsFormValues: form})}
                      onSubmit={this.onSubmitCustomFields.bind(this)}>
                    <div className="admin-panel-edit-user__custom-fields">
                        {this.state.customFields.map(this.renderCustomField.bind(this))}
                    </div>
                    <div className="admin-panel-edit-user__row">
                        <SubmitButton>{i18n('SAVE')}</SubmitButton>
                    </div>
                    {this.renderMessageCustomFields()}
                </Form>
            </div>
        );
    }

    renderCustomField(customField, key) {
        if (customField.type === 'text') {
            return (
                <div className="admin-panel-edit-user__custom-field" key={key}>
                    <FormField name={customField.name} label={customField.name} infoMessage={customField.description}
                               field="input" fieldProps={{size: 'small'}}/>
                </div>
            );
        } else {
            const items = customField.options.map(option => ({content: option.name, value: option.name}));

            return (
                <div className="admin-panel-edit-user__custom-field" key={key}>
                    <FormField name={customField.name} label={customField.name} infoMessage={customField.description}
                               field="select" fieldProps={{size: 'small', items}}/>
                </div>
            );
        }
    }


    renderMessageName() {
        switch (this.state.messageName) {
            case 'success':
                return <Message className="admin-panel-edit-user__message"
                                type="success">{i18n('NAME_CHANGED')}</Message>;
            case 'fail':
                return <Message className="admin-panel-edit-user__message"
                                type="error">{i18n('INVALID_NAME')}</Message>;
            default:
                return null;
        }

    }

    renderMessageEmail() {
        switch (this.state.messageEmail) {
            case 'success':
                return <Message className="admin-panel-edit-user__message"
                                type="success">{i18n('EMAIL_CHANGED')}</Message>;
            case 'fail':
                return <Message className="admin-panel-edit-user__message"
                                type="error">{i18n('ERROR_EMAIL')}</Message>;
            default:
                return null;
        }

    }

    renderMessagePass() {
        switch (this.state.messagePass) {
            case 'success':
                return <Message className="admin-panel-edit-user__message"
                                type="success">{i18n('PASSWORD_CHANGED')}</Message>;
            case 'fail':
                return <Message className="admin-panel-edit-user__message"
                                type="error">{i18n('OLD_PASSWORD_INCORRECT')}</Message>;
            default:
                return null;
        }
    }

    renderMessageCustomFields() {
        switch (this.state.messageCustomFields) {
            case 'success':
                return <Message className="admin-panel-edit-user__message"
                                type="success">{i18n('CHANGES_SAVED')}</Message>;
            case 'fail':
                return <Message className="admin-panel-edit-user__message"
                                type="error">{i18n('UNKNOWN_ERROR')}</Message>;
            default:
                return null;
        }

    }

    onSubmitCustomFields(form) {
        const customFields = this.state.customFields;
        const parsedFormValues = {}

        customFields.forEach(customField => {
            if (customField.type === 'select') {
                parsedFormValues[getCustomFieldParamName(customField.name)] = customField.options[form[customField.name]].name;
            } else {
                parsedFormValues[getCustomFieldParamName(customField.name)] = form[customField.name];
            }
        });

        parsedFormValues['userId'] = this.props.params.userId;

        this.setState({
            loadingCustomFields: true,
        });

        API.call({
            path: '/user/edit-custom-fields',
            data: parsedFormValues
        }).then(() => {
            this.setState({
                loadingCustomFields: false,
                messageCustomFields: 'success'
            });
        }).catch(() => {
            this.setState({
                loadingCustomFields: false,
                messageCustomFields: 'fail'
            })
        });

    }


    onSubmitEditName(formState) {
        this.setState({
            loadingName: true
        });

        API.call({
            path: "/user/edit-name",
            data: {
                newName: formState.newName,
                userId: this.props.params.userId

            }
        }).then(() => {
            this.setState({
                loadingName: false,
                messageName: "success"
            });
        }).catch(() => {
            this.setState({
                loadingName: false,
                messageName: 'fail'
            })
        });
    }

    onSubmitEditEmail(formState) {
        this.setState({
            loadingEmail: true
        });

        API.call({
            path: "/user/edit-email",
            data: {
                newEmail: formState.newEmail,
                userId: this.props.params.userId
            }
        }).then(() => {
            this.setState({
                loadingEmail: false,
                messageEmail: "success"
            });
        }).catch(() => {
            this.setState({
                loadingEmail: false,
                messageEmail: 'fail'
            })
        });
    }

    onSubmitEditPassword(formState) {
        this.setState({
            loadingPass: true
        });

        API.call({
            path: "/user/edit-password",
            data: {
                newPassword: formState.password,
                userId: this.props.params.userId
            }
        }).then(() => {
            this.setState({
                loadingPass: false,
                messagePass: "success"
            });
        }).catch(() => {
            this.setState({
                loadingPass: false,
                messagePass: 'fail'
            })
        });
    }

    retrieveData() {
        API.call({
            path: '/user/get-user',
            data: {
                userId: this.props.params.userId
            }
        }).then(result => {
                this.setState({
                    name: result.data.name,
                    email: result.data.email
                });
                this.retrieveCustomFields(result.data.customfields);
            }
        ).catch(() => this.setState({
                errorRetrievingData: true
            })
        );
    }

    // customfields contains the name and the value of the fields, but it does not contain
    // the (field) type, and in case of select fields, it does not contain all the options either.
    // That is why it is necessary to make a request to the server.
    retrieveCustomFields(customfields) {
        API.call({
            path: '/system/get-custom-fields',
            data: {}
        }).then(result => {
            const customFieldsFormValues = {};
            const userCustomFieldsValues = {};

            customfields.forEach(cf => {
                userCustomFieldsValues[cf.customfield] = cf.value;
            });

            result.data.forEach(customField => {
                if (customField.type === 'select') {
                    const index = _.indexOf(customField.options.map(option => option.name), userCustomFieldsValues[customField.name]);
                    customFieldsFormValues[customField.name] = (index === -1 ? 0 : index);
                } else {
                    customFieldsFormValues[customField.name] = userCustomFieldsValues[customField.name] || '';
                }
            });

            this.setState({
                customFields: result.data,
                customFieldsFormValues: customFieldsFormValues,
                loadingData: false
            });
        }).catch(() => this.setState({
            errorRetrievingData: true
        }));
    }
}

export default AdminPanelEditUser;
