import React from 'react';
import {connect} from 'react-redux';

import SessionActions from 'actions/session-actions';

import i18n from 'lib-app/i18n';

import Header from 'core-components/header';

import UserList from "app-components/user-list";
import ModalContainer from "../../../../app-components/modal-container";
import Button from "../../../../core-components/button";
import AddUserWidget from "./add-user-widget";
import Icon from "../../../../core-components/icon";

class DashboardListUsersPage extends React.Component {

    state = {
        page: 1
    };

    componentDidMount() {
        this.retrieveUserData();
    }

    render() {
        return (
            <div className="dashboard-user-list">
                <Header title={i18n('USER_LIST')} description={i18n('USER_LIST_DESCRIPTION')}/>
                <UserList {...this.getUserListProps()}/>
                {this.renderAddButton()}
            </div>
        );
    }

    getUserListProps() {
        const userUsers = this.props.userUsers;

        const page = this.state.page;

        return {
            users: userUsers.slice((page - 1) * 10, page * 10 + 1),
            userPath: '/dashboard/users/',
            onPageChange: this.onPageChange.bind(this),
            page: page,
            pages: userUsers.length / 10
        };
    }

    retrieveUserData() {
        this.props.dispatch(SessionActions.getUserData());
    }

    onPageChange(e) {
        this.setState({
            page: e.target.value
        });
    }

    renderAddButton() {
        return (
            <div style={{textAlign: 'right', marginTop: 10}}>
                <Button onClick={this.onAddUser.bind(this)} type="secondary" size="medium">
                    <Icon size="sm" name="plus"/> {i18n('INVITE_USER')}
                </Button>
            </div>
        );
    }

    onAddUser() {
        ModalContainer.openModal(
            <div className="dashboard-user-list__add-user-form">
                <AddUserWidget onSuccess={this.onAddUserSuccess.bind(this)}/>
                <div style={{textAlign: 'center'}}>
                    <Button onClick={ModalContainer.closeModal} type="link">{i18n('CLOSE')}</Button>
                </div>
            </div>
        );
    }

    onAddUserSuccess() {
        this.componentDidMount();
    }
}


export default connect((store) => {
    return {
        userUsers: store.session.userUsers || []
    };
})(DashboardListUsersPage);
