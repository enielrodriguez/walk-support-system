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
import Autocomplete from 'core-components/autocomplete';
import Tag from "../../../../core-components/tag";

class AdminPanelViewUser extends React.Component {

    state = {
        name: '',
        email: '',
        company: '',
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
            <div className="admin-panel-view-user">
                <Header title={i18n('USER_VIEW_TITLE', {userId: this.props.params.userId})}
                        description={i18n('USER_VIEW_DESCRIPTION')}/>
                {(this.state.invalid) ? this.renderInvalid() : this.renderUserInfo()}
            </div>
        );
    }

    renderInvalid() {
        return (
            <div className="admin-panel-view-user__invalid">
                <Message type="error">{i18n('INVALID_USER')}</Message>
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
                            {(this.state.disabled) ? this.renderDisabled() : null}
                        </div>
                    </div>
                    <div className="admin-panel-view-user__info-item">
                        {i18n('EMAIL')}
                        <div className="admin-panel-view-user__info-box">
                            {this.state.email}
                            {(!this.state.verified) ? this.renderNotVerified() : null}
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
                                onClick={this.onDeleteAndBanClick.bind(this)} size="medium">
                            {i18n('DELETE_AND_BAN')}
                        </Button>
                        <Button className="admin-panel-view-user__action-button" onClick={this.onDeleteClick.bind(this)}
                                size="medium">
                            {i18n('DELETE')}
                        </Button>
                    </div>
                </div>
                <span className="separator"/>

                {this.state.isCompanyAdmin && this.renderSupervisedView()}
                {this.state.isCompanyAdmin && <span className="separator"/>}

                <div className="admin-panel-view-user__tickets">
                    <div className="admin-panel-view-user__tickets-title">{i18n('TICKETS')}</div>
                    <TicketList {...this.getTicketListProps()}/>
                </div>
            </div>
        );
    }

    renderSupervisedUserMessage() {
        if (this.state.message) {
            if (this.state.message != 'success') {
                return (
                    <div className="admin-panel-view-user__supervised-users-message">
                        <Message type="error">{i18n(this.state.message)}</Message>
                    </div>
                )
            } else {
                return (
                    <div className="admin-panel-view-user__supervised-users-message">
                        <Message type="success">{i18n('SUPERVISED_USERS_UPDATED')}</Message>
                    </div>
                )
            }
        }
    }

    renderSupervisedView() {
        return (
            <div className="admin-panel-view-user">
                <div className="admin-panel-view-user__supervised-users">
                    <div className="admin-panel-view-user__supervised-users-header">
                        {i18n('SUPERVISED_USER')}
                    </div>
                    <div className="admin-panel-view-user__supervised-users-desc">
                        {i18n('SUPERVISED_USER_WARNING')}
                    </div>
                </div>

                <div className="admin-panel-view-user__supervised-users-content">
                    <div className="admin-panel-view-user__supervised-users-content-list">
                        {this.renderSupervisedUsers()}
                    </div>

                    <Button
                        disabled={this.state.loading}
                        className="admin-panel-view-user__submit-button"
                        onClick={this.onClickSupervisorUserButton.bind(this)}
                        size="medium"
                    >
                        {i18n('APPLY_CHANGES')}
                    </Button>
                </div>
                {this.renderSupervisedUserMessage()}
            </div>
        )
    }

    renderSupervisedUsers() {
        return this.state.userList.map(user => this.renderSupervisedUser(user));
    }

    renderSupervisedUser(user) {
        return <Tag
            name={user.name}
            color="grey"
            showDeleteButton
            onRemoveClick={this.onRemoveSupervisedUserClick.bind(this, user.id)}
            key={"tagId__" + user.id}/>
    }

    onRemoveSupervisedUserClick(userId) {
        const newList = this.state.userList.filter(
            user => user.id !== userId
        );
        this.setState({userList: newList});
    }

    onClickSupervisorUserButton() {
        this.setState({
            loading: true
        });

        const userIdList = this.state.userList.map((item) => {
            return item.id;
        });

        API.call({
            path: '/user/edit-supervised-list',
            data: {
                userIdList: JSON.stringify(userIdList),
                userId: this.props.params.userId
            }
        }).then(r => {
            this.setState({
                loading: false,
                message: 'success'
            })
        }).catch((r) => {
            this.setState({
                loading: false,
                message: r.message
            })
        });
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

    renderCustomField(customfield) {
        return (
            <div className="admin-panel-view-user__info-item">
                {customfield.customfield}
                <div className="admin-panel-view-user__info-box">
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
            loading: false,
            userList: result.data.userList
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
            invalid: true
        }));
    }
}

export default connect((store) => {
    return {
        departments: store.session.userDepartments
    };
})(AdminPanelViewUser);
