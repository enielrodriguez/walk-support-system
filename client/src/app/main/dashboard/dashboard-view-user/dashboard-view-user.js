import React from 'react';
import {connect} from 'react-redux';
import history from 'lib-app/history';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import TicketList from 'app-components/ticket-list';
import AreYouSure from 'app-components/are-you-sure';

import Header from 'core-components/header';
import Button from 'core-components/button';
import Message from 'core-components/message';
import InfoTooltip from 'core-components/info-tooltip';
import {Link} from "react-router";

class DashboardViewUser extends React.Component {

    state = {
        name: '',
        email: '',
        verified: true,
        tickets: [],
        customfields: [],
        invalid: false,
        loading: true,
        disabled: false,
        userList: [],
        message: ''
    };

    componentDidMount() {
        this.retrieveUser();
    }

    render() {
        return (
            <div className="dashboard-view-user">
                <Header title={i18n('USER_VIEW_TITLE', {userId: this.props.params.userId})}
                        description={i18n('USER_VIEW_DESCRIPTION')}/>
                {(this.state.invalid) ? this.renderInvalid() : this.renderUserInfo()}
            </div>
        );
    }

    renderInvalid() {
        return (
            <div className="dashboard-view-user__invalid">
                <Message type="error">{i18n('INVALID_USER')}</Message>
            </div>
        );
    }

    renderUserInfo() {
        return (
            <div className="dashboard-view-user__content">
                <div className="dashboard-view-user__info">
                    <div className="dashboard-view-user__info-item">
                        {i18n('NAME')}
                        <div className="dashboard-view-user__info-box">
                            {this.state.name}
                            {(this.state.disabled) ? this.renderDisabled() : null}
                        </div>
                    </div>
                    <div className="dashboard-view-user__info-item">
                        {i18n('EMAIL')}
                        <div className="dashboard-view-user__info-box">
                            {this.state.email}
                            {(!this.state.verified) ? this.renderNotVerified() : null}
                        </div>
                    </div>
                    {this.state.customfields.map(this.renderCustomField.bind(this))}
                    <div className="dashboard-view-user__action-buttons">
                        <Button
                            className="dashboard-view-user__action-button"
                            onClick={this.onDisableClick.bind(this)}
                            size="medium"
                            type={this.state.disabled ? 'tertiary' : 'primary'}>
                            {i18n(this.state.disabled ? 'ENABLE_USER' : 'DISABLE_USER')}
                        </Button>
                        <Button className="dashboard-view-user__action-button" onClick={this.onDeleteClick.bind(this)}
                                size="medium">
                            {i18n('DELETE')}
                        </Button>

                        <Link className="dashboard-view-user__link"
                              to={{
                                  pathname: '/dashboard/users/edit/' + this.props.params.userId,
                                  state: {
                                      name: this.state.name,
                                      email: this.state.email,
                                      customfields: this.state.customfields
                                  }
                              }}>
                            {i18n('EDIT')}
                        </Link>
                    </div>
                </div>
                <span className="separator"/>
                <div className="dashboard-view-user__tickets">
                    <div className="dashboard-view-user__tickets-title">{i18n('TICKETS')}</div>
                    <TicketList {...this.getTicketListProps()}/>
                </div>
            </div>
        );
    }


    renderNotVerified() {
        return (
            <InfoTooltip className="dashboard-view-user__unverified" type="warning" text={i18n('UNVERIFIED_EMAIL')}/>
        );
    }

    renderDisabled() {
        return (
            <InfoTooltip className="dashboard-view-user__unverified" type="warning" text={i18n('USER_DISABLED')}/>
        );
    }

    renderCustomField(customfield) {
        return (
            <div className="dashboard-view-user__info-item" key={customfield.id}>
                {customfield.customfield}
                <div className="dashboard-view-user__info-box">
                    {customfield.value}
                </div>
            </div>
        );
    }

    getTicketListProps() {
        return {
            type: 'secondary',
            tickets: this.state.tickets,
            loading: this.state.loading,
            departments: this.props.departments,
            ticketPath: '/dashboard/ticket/'
        };
    }

    onUserRetrieved(result) {
        this.setState({
            name: result.data.name,
            email: result.data.email,
            company: result.data.company,
            verified: result.data.verified,
            tickets: result.data.tickets,
            disabled: result.data.disabled,
            customfields: result.data.customfields,
            loading: false
        });
    }

    onDisableClick() {
        AreYouSure.openModal(
            i18n(this.state.disabled ? 'ENABLE_USER_DESCRIPTION' : 'DISABLE_USER_DESCRIPTION'),
            this.disableUser.bind(this)
        );
    }

    onDeleteClick() {
        AreYouSure.openModal(i18n('DELETE_USER_DESCRIPTION'), this.deleteUser.bind(this))
    }

    disableUser() {
        return API.call({
            path: this.state.disabled ? '/user/enable' : '/user/disable',
            data: {
                userId: this.props.params.userId
            }
        }).then(this.retrieveUser.bind(this));
    }

    deleteUser() {
        return API.call({
            path: '/user/delete',
            data: {
                userId: this.props.params.userId
            }
        }).then(() => history.push('/dashboard/users'));
    }

    retrieveUser() {
        API.call({
            path: '/user/get-user',
            data: {
                userId: this.props.params.userId
            }
        }).then(this.onUserRetrieved.bind(this)).catch(() => this.setState({
            invalid: true
        }));
    }
}

export default connect((store) => {
    return {
        departments: store.session.userDepartments
    };
})(DashboardViewUser);
