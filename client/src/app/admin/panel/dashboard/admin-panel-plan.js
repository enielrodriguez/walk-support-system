import React from 'react';
import Header from "../../../../core-components/header";
import {connect} from "react-redux";
import i18n from 'lib-app/i18n';
import Loading from "../../../../core-components/loading";

class AdminPanelPlan extends React.Component {

    render() {
        const planLimit = this.props.planLimit;
        return (
            <div className="admin-panel-plan">
                <Header title={i18n('PLAN')} description={i18n('PLAN_LIMITS')}/>
                {_.isEmpty(planLimit) ? <Loading/> :
                    <div>
                        <div className="admin-panel-plan__item">
                            <div className="admin-panel-plan__item-title">
                                {i18n('USERS')}
                            </div>
                            <div>
                                {this.getLimit(planLimit.users)}
                            </div>
                            <div>
                                {i18n('TOTAL_USERS_CURRENTLY', {'value': planLimit.total_users_currently})}
                            </div>

                            {planLimit.unassigned_users_quota !== null &&
                            <div>
                                {i18n('USERS_PLAN_RESERVED', {'value': planLimit.users - planLimit.unassigned_users_quota})}
                            </div>
                            }

                            {planLimit.unassigned_users_quota !== null &&
                            <div>
                                {i18n('FREE_QUOTA', {'value': planLimit.unassigned_users_quota})}
                            </div>
                            }

                            {planLimit.unassigned_users_quota !== null &&
                            <div>
                                {i18n('ASSIGNED_QUOTA_NOT_USED', {'value': planLimit.users - planLimit.unassigned_users_quota - planLimit.total_users_currently})}
                            </div>
                            }

                            {planLimit.users > 0 &&
                            <div>
                                {i18n('TOTAL_USERS_PLAN_FREE', {'value': planLimit.users - planLimit.total_users_currently})}
                            </div>
                            }

                        </div>

                        <div className="admin-panel-plan__item">
                            <div className="admin-panel-plan__item-title">
                                {i18n('COMPANIES')}
                            </div>
                            <div>
                                {this.getLimit(planLimit.companies)}
                            </div>
                            <div>
                                {i18n('PLAN_USED', {'value': planLimit.total_companies_currently})}
                            </div>
                        </div>

                        <div className="admin-panel-plan__item">
                            <div className="admin-panel-plan__item-title">
                                {i18n('STAFF_MEMBERS')}
                            </div>
                            <div>
                                {this.getLimit(planLimit.staff)}
                            </div>
                            <div>
                                {i18n('PLAN_USED', {'value': planLimit.total_staff_currently})}
                            </div>
                        </div>

                        <div className="admin-panel-plan__item">
                            <div className="admin-panel-plan__item-title">
                                {i18n('DEPARTMENTS')}
                            </div>
                            <div>
                                {this.getLimit(planLimit.departments)}
                            </div>
                            <div>
                                {i18n('PLAN_USED', {'value': planLimit.total_departments_currently})}
                            </div>
                        </div>

                    </div>
                }
            </div>
        );
    }

    getLimit(limit) {
        if (limit === 0) {
            limit = i18n('UNLIMITED');
        }
        return i18n('UP_TO', {'number': limit})
    }
}

export default connect((store) => {
    return {
        planLimit: store.config.plan_limit || {}
    };
})(AdminPanelPlan);
