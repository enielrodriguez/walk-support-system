import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import Icon from 'core-components/icon';
import Button from 'core-components/button';
import Header from 'core-components/header';
import Table from 'core-components/table';
import {connect} from "react-redux";
import CustomComponent from "../../lib-core/Component";

class InstallStep2Requirements extends CustomComponent {

    state = {
        loading: true,
        requirements: {
            phpVersion: {},
            PDO: {},
            files: {},
            configFile: {}
        }
    };

    componentDidMount() {
        this.retrieveRequirements();
    }

    render() {
        return (
            <div className="install-step-2">
                <Header title={i18n('STEP_TITLE', {title: i18n('SERVER_REQUIREMENTS'), current: 2, total: 7})}
                        description={i18n('STEP_2_DESCRIPTION')}/>

                <div className="install-step-2__refresh">
                    <Button className="install-step-2__refresh-button" type="secondary" size="medium"
                            onClick={this.retrieveRequirements.bind(this)}>
                        <Icon className="install-step-2__refresh-icon" name="refresh"/> {i18n('REFRESH')}
                    </Button>
                </div>

                <Table {...this.getTableProps()} />

                <div className="install-step-2__buttons">

                    {!this.props.installed &&
                    <div className="install-step-2__previous">
                        <Button size="medium" route={{to: '/install/step/1'}}>
                            {i18n('PREVIOUS')}
                        </Button>
                    </div>
                    }

                    <div className="install-step-2__next">
                        {!this.props.installed &&
                        <Button disabled={!this.isAllOk()}
                                size="medium"
                                type="secondary"
                                route={{to: '/install/step/3'}}>
                            {i18n('NEXT')}
                        </Button>
                        }
                    </div>

                </div>
            </div>
        );
    }

    getTableProps() {
        return {
            className: 'install-step-2__requirement-list',
            pageSize: 30,
            loading: this.state.loading,
            headers: [
                {key: 'name', value: i18n('REQUIREMENT'), className: 'col-md-3'},
                {key: 'value', value: i18n('VALUE'), className: 'col-md-9'}
            ],
            rows: Object.keys(this.state.requirements).map(this.getRequirement.bind(this))
        };
    }

    getRequirement(key) {
        const requirement = this.state.requirements[key];

        return {
            className: this.getRequirementClass(requirement),
            name: requirement.name,
            value: (
                <div className="install-step-2__requirement-value">
                    {requirement.value}
                    <Icon name={(requirement.ok) ? 'check' : 'times'} className="install-step-2__requirement-assert"/>
                </div>
            )
        };
    }

    getRequirementClass(requirement) {
        let classes = {
            'install-step-2__requirement': true,
            'install-step-2__requirement_error': !requirement.ok
        };

        return classNames(classes);
    }

    isAllOk() {
        return _.every(this.state.requirements, {ok: true});
    }

    retrieveRequirements() {
        this.setState({loading: true}, () => API.call({path: '/system/check-requirements'}).then(({data}) => this.setState({
            requirements: data,
            loading: false
        })));
    }
}

export default connect((store) => {
    return {
        installed: !!store.config.installed
    };
})(InstallStep2Requirements);
