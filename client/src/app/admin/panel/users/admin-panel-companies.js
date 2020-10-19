import React from 'react';
import {connect} from 'react-redux';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import Header from 'core-components/header';
import Table from 'core-components/table';
import SearchBox from 'core-components/search-box';
import Button from 'core-components/button';
import Message from 'core-components/message';
import Icon from 'core-components/icon';
import ModalContainer from 'app-components/modal-container';
import AddCompanyWidget from "./add-company-widget";

class AdminPanelCompanies extends React.Component {
    state = {
        loading: true,
        companies: [],
        orderBy: 'id',
        desc: true,
        error: false,
        page: 1,
        pages: 1
    };

    componentDidMount() {
        this.retrieveCompanies({
            page: 1,
            orderBy: 'id',
            desc: true,
            search: ''
        });
    }

    render() {
        return (
            <div className="admin-panel-companies">
                <Header title={i18n('LIST_COMPANIES')} description={i18n('LIST_COMPANIES_DESCRIPTION')} />
                {(this.state.error) ? <Message type="error">{i18n('ERROR_RETRIEVING_COMPANIES')}</Message> : this.renderTableAndAddButton()}
            </div>
        );
    }

    renderTableAndAddButton() {
        return (
            <div>
                <SearchBox className="admin-panel-companies__search-box" placeholder={i18n('SEARCH_COMPANIES')} onSearch={this.onSearch.bind(this)} />
                <Table {...this.getTableProps()}/>
                <div style={{textAlign: 'right', marginTop: 10}}>
                    <Button onClick={this.onAddCompany.bind(this)} type="secondary" size="medium">
                        <Icon size="sm" name="plus"/> {i18n('ADD_COMPANY')}
                    </Button>
                </div>
            </div>
        );
    }

    getTableProps() {
        return {
            className: 'admin-panel-companies__table',
            loading: this.state.loading,
            headers: this.getTableHeaders(),
            rows: this.state.companies.map(this.getCompanyRow.bind(this)),
            pageSize: 10,
            page: this.state.page,
            pages: this.state.pages,
            onPageChange: this.onPageChange.bind(this)
        };
    }

    getTableHeaders() {
        return [
            {
                key: 'business_name',
                value: i18n('BUSINESS_NAME'),
                className: 'admin-panel-companies__table-name col-md-3',
                order: true,
                onOrderUp: this.orderByName.bind(this, 0),
                onOrderDown: this.orderByName.bind(this, 1)
            },
            {
                key: 'nit',
                value: i18n('NIT'),
                className: 'admin-panel-companies__table-nit col-md-3',
                order: true,
                onOrderUp: this.orderByNIT.bind(this, 0),
                onOrderDown: this.orderByNIT.bind(this, 1)
            },
            {
                key: 'phone',
                value: i18n('PHONE'),
                className: 'admin-panel-companies__table-phone col-md-2'
            },
            {
                key: 'contact_name',
                value: i18n('CONTACT_NAME'),
                className: 'admin-panel-companies__table-contact_name col-md-2'
            }
        ];
    }

    getCompanyRow(company) {
        return {
            business_name: (
                <div>
                    <Button className="admin-panel-companies__name-link" type="link" route={{to: '/admin/panel/users/view-company/' + company.id}}>
                        {company.business_name}
                    </Button>
                </div>
            ),
            nit: company.nit,
            phone: company.phone,
            contact_name: company.contact_name
        };
    }

    onSearch(query) {
        this.retrieveCompanies({
            page: 1,
            orderBy: 'id',
            desc: true,
            search: query
        });
    }

    onPageChange(event) {
        this.retrieveCompanies({
            page: event.target.value,
            orderBy: this.state.orderBy,
            desc: this.state.desc,
            search: this.state.search
        });
    }


    orderByName(desc) {
        this.retrieveCompanies({
            page: 1,
            orderBy: 'business_name',
            desc: desc,
            search: this.state.search
        });
    }

    orderByNIT(desc) {
        this.retrieveCompanies({
            page: 1,
            orderBy: 'nit',
            desc: desc,
            search: this.state.search
        });
    }

    retrieveCompanies(data) {
        this.setState({
            loading: true
        });

        API.call({
            path: '/user/get-companies',
            data: data
        }).catch(this.onCompaniesRejected.bind(this)).then(this.onCompaniesRetrieved.bind(this));
    }

    onAddCompany() {
        ModalContainer.openModal(
            <div className="admin-panel-companies__add-company-form">
                <AddCompanyWidget onSuccess={this.onAddCompanySuccess.bind(this)} />
                <div style={{textAlign: 'center'}}>
                    <Button onClick={ModalContainer.closeModal} type="link">{i18n('CLOSE')}</Button>
                </div>
            </div>
        );
    }

    onAddCompanySuccess() {
        this.componentDidMount();
    }

    onCompaniesRetrieved(result) {
        this.setState({
            page: result.data.page * 1,
            pages: result.data.pages * 1,
            companies: result.data.companies,
            orderBy: result.data.orderBy,
            desc: (result.data.desc*1),
            error: false,
            loading: false
        });
    }

    onCompaniesRejected() {
        this.setState({
            error: true,
            loading: false
        });
    }
}

export default connect((store) => {
    return {
        config: store.config
    };
})(AdminPanelCompanies);
