import React from 'react';
import {connect} from 'react-redux';

import i18n from 'lib-app/i18n';

import Table from 'core-components/table';
import Button from 'core-components/button';

class UserList extends React.Component {
    static propTypes = {
        loading: React.PropTypes.bool,
        userPath: React.PropTypes.string,
        users: React.PropTypes.arrayOf(React.PropTypes.object)
    };

    static defaultProps = {
        loading: false,
        users: [],
        userPath: ''
    };

    render() {
        return (
            <div className="user-list">
                <Table {...this.getTableProps()} />
            </div>
        );
    }

    getTableProps() {
        const {
            loading,
            page,
            pages,
            onPageChange,
        } = this.props;

        return {
            loading,
            headers: this.getTableHeaders(),
            rows: this.getTableRows(),
            pageSize: 10,
            page,
            pages,
            onPageChange
        };
    }


    getTableHeaders() {
        return [
            {
                key: 'name',
                value: i18n('NAME'),
                className: 'user-list__table-name col-md-4'
            },
            {
                key: 'email',
                value: i18n('EMAIL'),
                className: 'user-list__table-email col-md-4'
            },
            {
                key: 'tickets',
                value: i18n('TICKETS'),
                className: 'user-list__table-tickets col-md-2'
            }
        ];
    }

    getTableRows() {
        return this.props.users.map(this.gerCompanyTableObject.bind(this));
    }

    gerCompanyTableObject(user) {

        return {
            name: (
                <div>
                    <Button className="user-list__title-link" type="clean"
                            route={{to: this.props.userPath + user.id}}>
                        {user.name}
                    </Button>
                </div>
            ),
            email: (
                <span className="user-list__email">
                    {user.email}
                </span>
            ),
            tickets: (
                <span className="user-list__tickets-number">
                    {user.tickets ? user.tickets : 0}
                </span>
            )
        };
    }
}

export default UserList;
