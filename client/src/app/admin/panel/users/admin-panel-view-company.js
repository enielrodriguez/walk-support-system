import React from 'react';
import history from 'lib-app/history';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import AreYouSure from 'app-components/are-you-sure';

import Header from 'core-components/header';
import Button from 'core-components/button';
import UserList from "../../../../app-components/user-list";
import Icon from "../../../../core-components/icon";
import ModalContainer from "../../../../app-components/modal-container";
import InviteUserWidget from "./invite-user-widget";

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
                            {i18n('NAME') + ': ' + (this.state.company.admin.name ?
                                this.state.company.admin.name
                                : '')}
                        </div>
                    </div>
                    <div className="admin-panel-view-company__info-item">
                        <div className="admin-panel-view-company__info-box">
                            {i18n('EMAIL') + ': ' + (this.state.company.admin.email ?
                                this.state.company.admin.email
                                : '')}
                        </div>
                    </div>
                </div>
                <span className="separator"/>
                <div className="admin-panel-view-company__users">
                    <div className="admin-panel-view-company__users-title">{i18n('USERS')}</div>
                    <UserList {...this.getUserListProps()}/>
                    <div style={{textAlign: 'right', marginTop: 10}}>
                        <Button onClick={this.onInviteUser.bind(this)} type="secondary" size="medium">
                            <Icon size="sm" name="plus"/> {i18n('INVITE_USER')}
                        </Button>
                    </div>
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

    onInviteUser() {
        ModalContainer.openModal(
            <div className="admin-panel-view-company__invite-user-form">
                <InviteUserWidget onSuccess={this.onInviteUserSuccess.bind(this)}
                                  companyId={this.props.params.companyId}/>
                <div style={{textAlign: 'center'}}>
                    <Button onClick={ModalContainer.closeModal} type="link">{i18n('CLOSE')}</Button>
                </div>
            </div>
        );
    }

    onInviteUserSuccess() {
        this.componentDidMount();
    }
}

export default AdminPanelViewCompany;
