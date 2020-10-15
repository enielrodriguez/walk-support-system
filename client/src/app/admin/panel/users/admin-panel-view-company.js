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
import UserList from "../../../../app-components/user-list";

class AdminPanelViewCompany extends React.Component {

    state = {
        company: {admin: {}},
        loading: true,
        message: ''
    };

    componentDidMount() {
        this.retrieveCompany();
    }

    render() {
        return (
            <div className="admin-panel-view-company">
                <Header title={i18n('COMPANY_VIEW_TITLE', {companyId: this.props.params.companyId})}
                        description={i18n('COMPANY_VIEW_DESCRIPTION')}/>
                {this.renderCompanyInfo()}
            </div>
        );
    }

    renderCompanyInfo() {
        return (
            <div className="admin-panel-view-company__content">
                <div className="admin-panel-view-company__info">
                    <div className="admin-panel-view-company__info-item">
                        {i18n('BUSINESS_NAME')}
                        <div className="admin-panel-view-company__info-box">
                            {this.state.company.business_name}
                        </div>
                    </div>
                    <div className="admin-panel-view-company__info-item">
                        {i18n('NIT')}
                        <div className="admin-panel-view-company__info-box">
                            {this.state.company.nit}
                        </div>
                    </div>
                    <div className="admin-panel-view-company__info-item">
                        {i18n('PHONE')}
                        <div className="admin-panel-view-company__info-box">
                            {this.state.company.phone}
                        </div>
                    </div>
                    <div className="admin-panel-view-company__info-item">
                        {i18n('CONTACT_NAME')}
                        <div className="admin-panel-view-company__info-box">
                            {this.state.company.contact_name}
                        </div>
                    </div>

                    <div className="admin-panel-view-company__action-buttons">
                        <Button className="admin-panel-view-company__action-button"
                                onClick={this.onDeleteClick.bind(this)} size="medium">
                            {i18n('DELETE')}
                        </Button>
                    </div>
                </div>
                <span className="separator"/>
                <div className="admin-panel-view-company__info">
                    <div className="admin-panel-view-company__info-item">
                        {i18n('COMPANY_ADMIN')}
                        <div className="admin-panel-view-company__info-box">
                            {i18n('NAME') + ': ' + this.state.company.admin.name}
                        </div>
                    </div>
                    <div className="admin-panel-view-company__info-item">
                        <div className="admin-panel-view-company__info-box">
                            {i18n('EMAIL') + ': ' + this.state.company.admin.email}
                        </div>
                    </div>
                </div>
                <span className="separator"/>
                <div className="admin-panel-view-company__users">
                    <div className="admin-panel-view-user__users-title">{i18n('USERS')}</div>
                    <UserList {...this.getUserListProps()}/>
                </div>
            </div>
        );
    }

    getUserListProps() {
        return {
            users: this.state.users,
            loading: this.state.loading,
            userPath: '/admin/panel/users/view-user/'
        };
    }

    onCompanyRetrieved(result) {
        this.setState({
            company: result.data.company,
            users: result.data.users,
            loading: false
        });
    }

    onDeleteClick() {
        AreYouSure.openModal(i18n('DELETE_COMPANY_DESCRIPTION'), this.deleteCompany.bind(this))
    }

    deleteCompany() {
        return API.call({
            path: '/user/delete-company',
            data: {
                companyId: this.props.params.companyId
            }
        }).then(() => history.push('/admin/panel/users/companies'));
    }

    retrieveCompany() {
        API.call({
            path: '/user/get-company',
            data: {
                companyId: this.props.params.companyId
            }
        }).then(this.onCompanyRetrieved.bind(this)).catch(() => this.setState({
            invalid: true
        }));
    }
}

export default AdminPanelViewCompany;
