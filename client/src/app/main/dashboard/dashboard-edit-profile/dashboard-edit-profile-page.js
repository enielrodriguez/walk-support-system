import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

import API from 'lib-app/api-call';
import i18n from 'lib-app/i18n';
import {getCustomFieldParamName} from 'lib-core/APIUtils';

import SessionActions from 'actions/session-actions';
import AreYouSure from 'app-components/are-you-sure';

import Header from 'core-components/header';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';
import Message from 'core-components/message';

class DashboardEditProfilePage extends React.Component {

    static propTypes = {
        userCustomFields: React.PropTypes.object,
        name: React.PropTypes.string
    };

    static defaultProps = {
        userCustomFields: {},
        name: ''
    };

    state = {
        loadingName: false,
        loadingPass: false,
        messageName: '',
        messagePass: '',
        customFields: [],
        customFieldsFrom: {},
        loadingCustomFields: false,
    };

    componentDidMount() {
        this.retrieveCustomFields();
    }

    render() {
        return (
            <div className="edit-profile-page">
                <Header title={i18n('EDIT_PROFILE')} description={i18n('EDIT_PROFILE_VIEW_DESCRIPTION')}/>
                <div className="edit-profile-page__title">{i18n('EDIT_NAME')}</div>
                <Form loading={this.state.loadingName} onSubmit={this.onSubmitEditName.bind(this)}>
                    <FormField name="newName" value={this.props.name} label={i18n('NEW_NAME')} field="input"
                               fieldProps={{size: 'large'}} required/>
                    <SubmitButton>{i18n('CHANGE_NAME')}</SubmitButton>
                    {this.renderMessageName()}
                </Form>
                <div className="edit-profile-page__title">{i18n('EDIT_PASSWORD')}</div>
                <Form loading={this.state.loadingPass} onSubmit={this.onSubmitEditPassword.bind(this)}>
                    <FormField name="oldPassword" label={i18n('OLD_PASSWORD')} field="input" validation="PASSWORD"
                               fieldProps={{password: true, size: 'large'}} required/>
                    <FormField name="password" label={i18n('NEW_PASSWORD')} field="input" validation="PASSWORD"
                               fieldProps={{password: true, size: 'large'}} required/>
                    <FormField name="repeatNewPassword" label={i18n('REPEAT_NEW_PASSWORD')} field="input"
                               validation="REPEAT_PASSWORD" fieldProps={{password: true, size: 'large'}} required/>
                    <SubmitButton>{i18n('CHANGE_PASSWORD')}</SubmitButton>
                    {this.renderMessagePass()}
                </Form>
                {this.state.customFields.length ? this.renderCustomFields() : null}
            </div>
        );
    }

    renderCustomFields() {
        return (
            <div>
                <div className="edit-profile-page__title">{i18n('ADDITIONAL_FIELDS')}</div>
                <Form loading={this.state.loadingCustomFields} values={this.state.customFieldsFrom}
                      onChange={form => this.setState({customFieldsFrom: form})}
                      onSubmit={this.onCustomFieldsSubmit.bind(this)}>
                    <div className="edit-profile-page__custom-fields">
                        {this.state.customFields.map(this.renderCustomField.bind(this))}
                    </div>
                    <div className="row">
                        <SubmitButton>{i18n('SAVE')}</SubmitButton>
                    </div>
                </Form>
            </div>
        );
    }

    renderCustomField(customField, key) {
        if (customField.type === 'text') {
            return (
                <div className="edit-profile-page__custom-field" key={key}>
                    <FormField name={customField.name} label={customField.name} infoMessage={customField.description}
                               field="input" fieldProps={{size: 'small'}}/>
                </div>
            );
        } else {
            const items = customField.options.map(option => ({content: option.name, value: option.name}));

            return (
                <div className="edit-profile-page__custom-field" key={key}>
                    <FormField name={customField.name} label={customField.name} infoMessage={customField.description}
                               field="select" fieldProps={{size: 'small', items}}/>
                </div>
            );
        }
    }

    renderMessageName() {
        switch (this.state.messageName) {
            case 'success':
                return <Message className="edit-profile-page__message" type="success">{i18n('NAME_CHANGED')}</Message>;
            case 'fail':
                return <Message className="edit-profile-page__message" type="error">{i18n('INVALID_NAME')}</Message>;
            default:
                return null;
        }

    }

    renderMessagePass() {
        switch (this.state.messagePass) {
            case 'success':
                return <Message className="edit-profile-page__message"
                                type="success">{i18n('PASSWORD_CHANGED')}</Message>;
            case 'fail':
                return <Message className="edit-profile-page__message"
                                type="error">{i18n('OLD_PASSWORD_INCORRECT')}</Message>;
            default:
                return null;
        }
    }

    onCustomFieldsSubmit(form) {
        const {customFields} = this.state;
        const parsedFrom = {}

        customFields.forEach(customField => {
            if (customField.type === 'select') {
                parsedFrom[getCustomFieldParamName(customField.name)] = customField.options[form[customField.name]].name;
            } else {
                parsedFrom[getCustomFieldParamName(customField.name)] = form[customField.name];
            }
        });

        this.setState({
            loadingCustomFields: true,
        });

        API.call({
            path: '/user/edit-custom-fields',
            data: parsedFrom
        }).then(() => {
            this.setState({loadingCustomFields: false});
            this.props.dispatch(SessionActions.getUserData());
        });

    }

    onSubmitEditName(formState) {
        AreYouSure.openModal(i18n('NAME_WILL_CHANGE'), this.callEditNameAPI.bind(this, formState));
    }

    onSubmitEditPassword(formState) {
        AreYouSure.openModal(i18n('PASSWORD_WILL_CHANGE'), this.callEditPassAPI.bind(this, formState));
    }

    callEditNameAPI(formState) {
        this.setState({
            loadingName: true
        });
        return API.call({
            path: "/user/edit-name",
            data: {
                newName: formState.newName
            }
        }).then(function () {
            this.setState({
                loadingName: false,
                messageName: "success"
            });

            this.props.dispatch(SessionActions.getUserData(null, null, false));

        }.bind(this)).catch(function () {
            this.setState({
                loadingName: false,
                messageName: 'fail'
            })
        }.bind(this));
    }

    callEditPassAPI(formState) {
        this.setState({
            loadingPass: true
        });
        return API.call({
            path: "/user/edit-password",
            data: {
                oldPassword: formState.oldPassword,
                newPassword: formState.password
            }
        }).then(function () {
            this.setState({
                loadingPass: false,
                messagePass: "success"
            });
        }.bind(this)).catch(function () {
            this.setState({
                loadingPass: false,
                messagePass: 'fail'
            })
        }.bind(this));
    }

    retrieveCustomFields() {
        API.call({
            path: '/system/get-custom-fields',
            data: {}
        })
            .then(result => {
                const customFieldsFrom = {};
                const {userCustomFields} = this.props;
                result.data.forEach(customField => {
                    if (customField.type === 'select') {
                        const index = _.indexOf(customField.options.map(option => option.name), userCustomFields[customField.name]);
                        customFieldsFrom[customField.name] = (index === -1 ? 0 : index);
                    } else {
                        customFieldsFrom[customField.name] = userCustomFields[customField.name] || '';
                    }
                });

                this.setState({
                    customFields: result.data,
                    customFieldsFrom,
                });
            });
    }
}

export default connect((store) => {
    const userCustomFields = {};

    store.session.userCustomFields.forEach(customField => {
        userCustomFields[customField.customfield] = customField.value;
    });

    return {
        userCustomFields: userCustomFields || {},
        name: store.session.userName
    };
})(DashboardEditProfilePage);
