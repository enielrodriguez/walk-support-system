import React from 'react';
import {spring, TransitionMotion} from 'react-motion';

import API from 'lib-app/api-call';
import i18n from 'lib-app/i18n';

import ActivityRow from 'app-components/activity-row';
import Header from 'core-components/header';
import Menu from 'core-components/menu';
import SubmitButton from 'core-components/submit-button';
import {connect} from "react-redux";
import FormField from "../../../../core-components/form-field";
import Form from "../../../../core-components/form";
import Button from "../../../../core-components/button";
import AreYouSure from "../../../../app-components/are-you-sure";
import InfoTooltip from "../../../../core-components/info-tooltip";
import DateTransformer from "../../../../lib-core/date-transformer";

class AdminPanelActivity extends React.Component {

    static childContextTypes = {
        loading: React.PropTypes.bool
    };

    getChildContext() {
        return {
            loading: this.state.loading
        };
    }

    state = {
        activities: [],
        page: 1,
        limit: false,
        loading: false,
        mode: 'staff',
        dateRange: {startDate: this.getStartDate(), endDate: this.getEndDate()},
        applyFilter: false
    };

    getStartDate() {
        let date = new Date();
        let formattedDate = `${date.getFullYear()}01010000`;
        return +formattedDate;
    }

    getEndDate() {
        return +`${DateTransformer.getDateToday()}2359`;
    }

    componentDidMount() {
        this.retrieveNextPage();
    }

    render() {
        return (
            <div className="admin-panel-activity">
                <Header title={i18n('LAST_ACTIVITY')}/>
                <Menu {...this.getMenuProps()} />
                {this.renderList()}
            </div>
        );
    }

    getMenuProps() {
        let props = {
            className: 'admin-panel-activity__menu',
            type: 'horizontal-list-bright',
            onItemClick: this.onMenuItemClick.bind(this),
            tabbable: true,
            items: [
                {
                    content: i18n('MY_NOTIFICATIONS'),
                    icon: ''
                }
            ]
        };

        if (+this.props.level === 3) {
            props.items[1] = {
                content: i18n('ALL_NOTIFICATIONS'),
                icon: ''
            }
        }

        return props;
    }

    renderList() {
        return (
            <div>
                <TransitionMotion styles={this.getStyles()} willEnter={this.getEnterStyle.bind(this)}>
                    {this.renderActivityList.bind(this)}
                </TransitionMotion>
                {(!this.state.limit) ? this.renderButton() : null}
            </div>
        );
    }

    renderActivityList(styles) {
        return (
            <div>

                <Form values={{dateRange: this.state.dateRange}}
                      onSubmit={this.onApplyFilter.bind(this)}
                      onChange={form => this.setState({dateRange: form.dateRange})}>
                    <div className="admin-panel-activity__form-field-container">
                        <div className="admin-panel-activity__form-field-item">
                            <FormField name="dateRange" field="date-range"/>
                        </div>

                        <div className="admin-panel-activity__form-field-item">
                            <SubmitButton size="extra-small" type="secondary">{i18n('FILTER')}</SubmitButton>
                        </div>

                        <div className="admin-panel-activity__form-field-item-clear">
                            <Button disabled={!this.state.applyFilter} type="clean"
                                    onClick={this.clearFilter.bind(this)}>
                                {i18n('CLEAR')}
                            </Button>
                        </div>

                        <div className="admin-panel-activity__form-field-item-delete">
                            <Button disabled={!this.state.applyFilter} type="clean"
                                    onClick={this.onDeleteLogs.bind(this)}>
                                {i18n('DELETE')}
                            </Button>
                            {this.renderDeleteInfo()}
                        </div>
                    </div>
                </Form>

                {styles.map(this.renderAnimatedItem.bind(this))}
            </div>
        );
    }

    renderDeleteInfo() {
        return (
            <InfoTooltip className="admin-panel-activity__tooltip"
                         text={i18n('DELETE_LOGS_INFO')}/>
        );
    }

    onApplyFilter(form) {
        let state = {
            page: 1,
            activities: []
        };

        if (!this.state.applyFilter) {
            state.applyFilter = true;
        }
        this.setState(state, () => this.retrieveNextPage())
    }

    clearFilter(event) {
        event.preventDefault();
        if (this.state.applyFilter) {
            this.setState({
                dateRange: {startDate: this.getStartDate(), endDate: this.getEndDate()},
                applyFilter: false,
                page: 1,
                activities: []
            }, () => this.retrieveNextPage());
        }
    }

    onDeleteLogs(event) {
        event.preventDefault();
        AreYouSure.openModal(i18n('DELETE_LOGS_WARNING'), this.deleteLogs.bind(this));
    }

    deleteLogs() {
        API.call({
            path: (this.state.mode === 'staff') ? '/staff/delete-events' : '/system/delete-logs',
            data: {
                dateRange: `[${this.state.dateRange.startDate},${this.state.dateRange.endDate}]`
            }
        }).then(result => {
            this.setState({
                dateRange: {startDate: this.getStartDate(), endDate: this.getEndDate()},
                applyFilter: false,
                page: 1,
                activities: []
            }, () => this.onRetrieveSuccess(result));
        });


    }

    renderAnimatedItem(config, index) {
        return (
            <div style={config.style} key={config.key}>
                {this.renderRow(config.data, index)}
            </div>
        );
    }

    renderButton() {
        return (
            <SubmitButton type="secondary" onClick={this.retrieveNextPage.bind(this)}>
                {i18n('LOAD_MORE')}
            </SubmitButton>
        );
    }

    renderRow(row, index) {
        return (
            <ActivityRow key={index} mode={this.state.mode} {...row} />
        );
    }

    getStyles() {
        return this.state.activities.map((item, index) => ({
            key: index + '',
            data: item,
            style: {marginTop: spring(0), opacity: spring(1)}
        }));
    }

    getEnterStyle() {
        return {
            marginTop: -20,
            opacity: 0
        };
    }

    onMenuItemClick(index) {
        this.setState({
            page: 1,
            mode: (index === 0) ? 'staff' : 'system',
            activities: [],
            dateRange: {startDate: this.getStartDate(), endDate: this.getEndDate()},
            applyFilter: false
        }, this.retrieveNextPage.bind(this));
    }

    retrieveNextPage() {
        this.setState({loading: true});
        let data = {page: this.state.page}

        if (this.state.applyFilter) {
            data.dateRange = `[${this.state.dateRange.startDate},${this.state.dateRange.endDate}]`;
        }

        API.call({
            path: (this.state.mode === 'staff') ? '/staff/last-events' : '/system/get-logs',
            data: data
        }).then(this.onRetrieveSuccess.bind(this));
    }

    onRetrieveSuccess(result) {
        this.setState({
            activities: this.state.activities.concat(result.data),
            page: this.state.page + 1,
            limit: (result.data.length !== 10),
            loading: false
        });
    }
}

export default connect((store) => {
    return {
        level: store.session.userLevel
    };
})(AdminPanelActivity);
