import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

import DropDown from 'core-components/drop-down';
import Icon from 'core-components/icon';

class CompanyDropdown extends React.Component {
    static propTypes = {
        value: React.PropTypes.number,
        onChange: React.PropTypes.func,
        companies: React.PropTypes.array
    }

    render() {
        return <DropDown {...this.props} onChange={this.onChange.bind(this)} items={this.getCompanies()} />
    }

    getCompanies() {
        let companies = this.props.companies.map((company) => {
             return {content: company.business_name};
        });

        return companies;
    }

    onChange(event) {
        if(this.props.onChange) {
            this.props.onChange({
                index: event.index,
                target: {
                    value: event.index
                }
            });
        }
    }
}

export default CompanyDropdown;
