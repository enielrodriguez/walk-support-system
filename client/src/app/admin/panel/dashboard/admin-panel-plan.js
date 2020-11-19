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
                        <div>
                            <span>{i18n('USERS')}: {this.getLimit(planLimit.users)}</span>
                        </div>
                        <div>
                            <span>{i18n('COMPANIES')}: {this.getLimit(planLimit.companies)}</span>
                        </div>
                        <div>
                            <span>
                                {i18n('STAFF_MEMBERS')}: {this.getLimit(planLimit.staff)}
                            </span>
                        </div>
                        <div>
                            <span>{i18n('DEPARTMENTS')}: {this.getLimit(planLimit.departments)}</span>
                        </div>
                    </div>
                }
            </div>
        );
    }

    getLimit(limit) {
        if (limit == 0) {
            return i18n('UNLIMITED');
        }
        return i18n('UP_TO', {'number': limit})
    }
}

export default connect((store) => {
    return {
        planLimit: store.config.plan_limit || {}
    };
})(AdminPanelPlan);
