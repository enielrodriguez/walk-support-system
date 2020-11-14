import React from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router";

import history from 'lib-app/history';
import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import TicketList from 'app-components/ticket-list';
import AreYouSure from 'app-components/are-you-sure';

import Header from 'core-components/header';
import Button from 'core-components/button';
import InfoTooltip from 'core-components/info-tooltip';
import UserList from "../../../../app-components/user-list";
import LoadingWithMessage from "../../../../core-components/loading-with-message";


class AdminPanelViewUser extends React.Component {

    state = {
        name: '',
        email: '',
        company: '',
        verified: true,
        tickets: [],
        customfields: [],
        disabled: false,
        userList: [],
        isCompanyAdmin: false,
        message: '',
        loading: true,
        errorRetrievingData: false,

    };

    componentDidMount() {
        this.retrieveUser();
    }

    componentDidUpdate(prevProps, prevState,) {
        if (prevProps.params.userId !== this.props.params.userId) {
            this.retrieveUser();
        }
    }

    render() {
        return this.state.loading ?
            <LoadingWithMessage showMessage={this.state.errorRetrievingData}/>
            : (
                <div className="admin-panel-view-user">
                    <Header title={i18n('USER_VIEW_TITLE', {userId: this.props.params.userId})}
                            description={i18n('USER_VIEW_DESCRIPTION')}/>
                    {this.renderUserInfo()}
                </div>
            );
    }

    renderUserInfo() {
        return (
            <div className="admin-panel-view-user__content">
                <div className="admin-panel-view-user__info">
                    <div className="admin-panel-view-user__info-item">
                        {i18n('NAME')}
                        <div className="admin-panel-view-user__info-box">
                            {this.state.name}
                            {this.state.isCompanyAdmin && this.renderAdmin()}
                            {this.state.disabled && this.renderDisabled()}
                        </div>
                    </div>
                    <div className="admin-panel-view-user__info-item">
                        {i18n('EMAIL')}
                        <div className="admin-panel-view-user__info-box">
                            {this.state.email}
                            {!this.state.verified && this.renderNotVerified()}
                        </div>
                    </div>
                    <div className="admin-panel-view-user__info-item">
                        {i18n('COMPANY')}
                        <div className="admin-panel-view-user__info-box">
                            {this.state.company.business_name}
                        </div>
                    </div>

                    {this.state.customfields.map(this.renderCustomField.bind(this))}

                    <div className="admin-panel-view-user__action-buttons">
                        <Button
                            className="admin-panel-view-user__action-button"
                            onClick={this.onDisableClick.bind(this)}
                            size="medium"
                            type={this.state.disabled ? 'tertiary' : 'primary'}>
                            {i18n(this.state.disabled ? 'ENABLE_USER' : 'DISABLE_USER')}
                        </Button>
                        <Button className="admin-panel-view-user__action-button"
                                onClick={this.onDeleteAndBanClick.bind(this)}
                                size="medium">
                            {i18n('DELETE_AND_BAN')}
                            {this.state.isCompanyAdmin && this.renderForbiddenDelete()}
                        </Button>
                        <Button className="admin-panel-view-user__action-button" onClick={this.onDeleteClick.bind(this)}
                                size="medium">
                            {i18n('DELETE')}
                            {this.state.isCompanyAdmin && this.renderForbiddenDelete()}
                        </Button>

                        <Link className="admin-panel-view-user__link"
                              to={'/admin/panel/users/edit-user/' + this.props.params.userId}>
                            {i18n('EDIT')}
                        </Link>

                    </div>
                </div>

                <span className="separator"/>

                {this.state.isCompanyAdmin && this.renderSupervisedUsers()}

                {
                    this.state.isCompanyAdmin &&
                    <span className="separator"/>
                }

                <div className="admin-panel-view-user__tickets">
                    <div className="admin-panel-view-user__tickets-title">{i18n('TICKETS')}</div>
                    <TicketList {...this.getTicketListProps()}/>
                </div>
            </div>
        );
    }

    renderSupervisedUsers() {
        return (
            <div className="admin-panel-view-user">
                <div className="admin-panel-view-user__supervised-users">
                    <div className="admin-panel-view-user__supervised-users-header">
                        {i18n('SUPERVISED_USER')}
                    </div>
                    <div className="admin-panel-view-user__supervised-users-desc">
                        {i18n('SUPERVISED_USERS_INFO')}
                    </div>
                </div>
                <UserList {...this.getUserListProps()}/>
            </div>
        )
    }

    getUserListProps() {
        return {
            users: this.state.userList,
            userPath: '/admin/panel/users/view-user/'
        };
    }

    renderNotVerified() {
        return (
            <InfoTooltip className="admin-panel-view-user__unverified" type="warning" text={i18n('UNVERIFIED_EMAIL')}/>
        );
    }

    renderDisabled() {
        return (
            <InfoTooltip className="admin-panel-view-user__unverified" type="warning" text={i18n('USER_DISABLED')}/>
        );
    }

    renderAdmin() {
        return (
            <InfoTooltip className="admin-panel-view-user__unverified" type="user-plus" size="sm"
                         text={i18n('COMPANY_ADMIN_DESCRIPTION')}/>
        );
    }

    renderForbiddenDelete() {
        return (
            <InfoTooltip className="admin-panel-view-user__unverified" type="warning"
                         text={i18n('COMPANY_ADMIN_DESCRIPTION')}/>
        );
    }

    renderCustomField(customfield) {
        return (
            <div className="admin-panel-view-user__info-item" key={customfield.id}>
                {customfield.customfield}
                <div className="admin-panel-view-user__info-box">
                    {customfield.value || '-'}
                </div>
            </div>
        );
    }

    getTicketListProps() {
        return {
            type: 'secondary',
            tickets: this.state.tickets,
            departments: this.props.departments,
            ticketPath: '/admin/panel/tickets/view-ticket/'
        };
    }

    onUserRetrieved(result) {
        this.setState({
            name: result.data.name,
            email: result.data.email,
            company: result.data.company,
            isCompanyAdmin: result.data.isCompanyAdmin,
            verified: result.data.verified,
            tickets: result.data.tickets,
            disabled: result.data.disabled,
            customfields: result.data.customfields,
            userList: result.data.userList,
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

    onDeleteAndBanClick() {
        AreYouSure.openModal(i18n('DELETE_BAN_USER_DESCRIPTION'), this.deleteAndBanUser.bind(this))
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
        }).then(() => history.push('/admin/panel/users/list-users'));
    }

    deleteAndBanUser() {
        return API.call({
            path: '/user/delete',
            data: {
                userId: this.props.params.userId
            }
        }).then(() => {
            API.call({
                path: '/user/ban',
                data: {
                    email: this.state.email
                }
            }).then(() => history.push('/admin/panel/users/list-users'));
        });
    }

    retrieveUser() {
        API.call({
            path: '/user/get-user',
            data: {
                userId: this.props.params.userId
            }
        }).then(this.onUserRetrieved.bind(this)).catch(() => this.setState({
            errorRetrievingData: true
        }));
    }
}

export default connect((store) => {
    return {
        departments: store.session.userDepartments
    };
})(AdminPanelViewUser);
