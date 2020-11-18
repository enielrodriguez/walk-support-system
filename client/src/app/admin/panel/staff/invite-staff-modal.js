import React from 'react';
import _ from 'lodash';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';
import SessionStore from 'lib-app/session-store';

import Header from 'core-components/header'
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';
import Button from 'core-components/button';
import Icon from 'core-components/icon';
import Message from "../../../../core-components/message";

class InviteStaffModal extends React.Component {

    static contextTypes = {
        closeModal: React.PropTypes.func
    };

    static propTypes = {
        onSuccess: React.PropTypes.func
    };

    state = {
        loading: false,
        errors: {},
        error: null,
        generalError: null,
        departments: [],
        departmentsSelected: [],
        willBeAdmin: false
    };

    componentDidMount() {
        this.getDepartments();
    }

    render() {
        return (
            <div className="invite-staff-modal">
                <Header title={i18n('INVITE_STAFF')} description={i18n('INVITE_STAFF_DESCRIPTION')}/>

                <Form onSubmit={this.onSubmit.bind(this)}
                      errors={this.getErrors()}
                      onValidateErrors={errors => this.setState({errors})}
                      loading={this.state.loading}
                      onChange={this.onFormChange.bind(this)}
                      values={{departments: this.state.departmentsSelected}}>

                    <div className="row">
                        <div className="col-md-7">
                            <FormField name="name" label={i18n('NAME')} fieldProps={{size: 'large'}} validation="NAME"
                                       required/>
                            <FormField name="email" label={i18n('EMAIL')} fieldProps={{size: 'large'}}
                                       validation="EMAIL" required/>
                            <div className="invite-staff-modal__level-selector">
                                <FormField name="level" label={i18n('LEVEL')} field="select"
                                           fieldProps={{
                                               items: [
                                                   {content: i18n('LEVEL_1')},
                                                   {content: i18n('LEVEL_2')},
                                                   {content: i18n('LEVEL_3')}
                                               ],
                                               size: 'large'
                                           }}/>
                            </div>
                        </div>

                        <div className="col-md-5">
                            <div className="invite-staff-modal__departments">
                                <div className="invite-staff-modal__departments-title">{i18n('DEPARTMENTS')}</div>
                                <FormField name="departments" field="checkbox-group"
                                           fieldProps={{
                                               items: this.state.departments,
                                               disabled: this.state.willBeAdmin
                                           }}/>
                            </div>
                        </div>

                    </div>

                    <SubmitButton type="secondary" size="small">
                        {i18n('SAVE')}
                    </SubmitButton>

                    <Button type="clean" onClick={this.onCancelClick.bind(this)}>
                        {i18n('CANCEL')}
                    </Button>

                    {this.state.generalError &&
                    <div className="invite-staff-modal__message">
                        <Message type='error'>
                            {this.state.generalError}
                        </Message>
                    </div>
                    }

                </Form>
            </div>
        );
    }

    getDepartments() {
        this.setState({
            departments: SessionStore.getDepartments().map(department => {
                if (department.private * 1) {
                    return <span>{department.name} <Icon name='user-secret'/> </span>
                } else {
                    return department.name;
                }
            })
        });
    }

    onSubmit(form) {
        let departments = _.filter(SessionStore.getDepartments(), (department, index) => {
            return _.includes(form.departments, index);
        }).map(department => department.id);

        this.setState({loading: true});

        API.call({
            path: '/staff/invite',
            data: {
                name: form.name,
                email: form.email,
                level: form.level + 1,
                departments: JSON.stringify(departments)
            }
        }).then(() => {
            this.context.closeModal();

            if (this.props.onSuccess) {
                this.props.onSuccess();
            }
        }).catch((result) => {
            this.setErrors(result.message);
        });
    }

    onCancelClick(event) {
        event.preventDefault();
        this.context.closeModal();
    }

    setErrors(message) {
        let state = {'loading': false};

        if (message === 'ALREADY_A_STAFF') {
            state['error'] = message;
        } else {
            let msgKey = 'UNKNOWN_ERROR';

            switch (message) {
                case 'STAFF_LIMIT_EXCEEDED':
                    msgKey = message;
                    break;
            }

            state['generalError'] = i18n(msgKey);
        }

        this.setState(state);
    }

    getErrors() {
        let errors = _.extend({}, this.state.errors);

        if (this.state.error === 'ALREADY_A_STAFF') {
            errors.email = i18n('EMAIL_EXISTS');
        }

        return errors;
    }

    onFormChange(form) {
        let departments = form.departments;
        let willBeAdmin = this.state.willBeAdmin;
        let state = {};

        if (this.state.departmentsSelected !== departments) {
            state['departmentsSelected'] = departments;
        }

        if (form.level === 2 && !willBeAdmin) {
            state['departmentsSelected'] = this.state.departments.map((depart, key) => key);
            state['willBeAdmin'] = true;
        }

        if (form.level !== 2 && willBeAdmin) {
            state['willBeAdmin'] = false;
        }

        this.setState(state);
    }
}

export default InviteStaffModal;
