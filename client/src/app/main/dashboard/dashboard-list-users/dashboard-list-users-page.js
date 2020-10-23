import React from 'react';
import {connect} from 'react-redux';

import SessionActions from 'actions/session-actions';

import i18n from 'lib-app/i18n';

import Header from 'core-components/header';

import UserList from "app-components/user-list";

class DashboardListUsersPage extends React.Component {

    state = {
        page: 1
    };

    componentDidMount() {
        this.retrieveUserData();
    }

    render() {
        return (
            <div className="dashboard-ticket-list">
                <Header title={i18n('USER_LIST')} description={i18n('USER_LIST_DESCRIPTION')}/>
                <UserList {...this.getUserListProps()}/>
            </div>
        );
    }

    getUserListProps() {
        const userUsers = this.props.userUsers;

        const page = this.state.page;

        return {
            users: userUsers.slice((page - 1) * 10, page * 10 + 1),
            userPath: '/dashboard/users/view-user/',
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
}


export default connect((store) => {
    return {
        userUsers: store.session.userUsers || []
    };
})(DashboardListUsersPage);
