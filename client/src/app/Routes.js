import React from 'react';
import {Router, Route, IndexRoute, IndexRedirect} from 'react-router';
import asyncComponent from './async-component';

import App from './App';
import history from 'lib-app/history';

import MainLayout from './main/main-layout';
import MainHomePage from './main/main-home/main-home-page';

const MainSignUpPage = asyncComponent(() => import('./main/main-signup/main-signup-page'));
const MainVerifyTokenPage = asyncComponent(() => import('./main/main-verify-token-page'));
const MainRecoverPasswordPage = asyncComponent(() => import('./main/main-recover-password/main-recover-password-page'));
const MainMaintenancePage = asyncComponent(() => import('./main/main-maintenance-page'));
const MainCheckTicketPage = asyncComponent(() => import('./main/main-check-ticket-page'));
const MainViewTicketPage = asyncComponent(() => import('./main/main-view-ticket-page'));

const DashboardLayout = asyncComponent(() => import('./main/dashboard/dashboard-layout'));
const DashboardListTicketsPage = asyncComponent(() => import('./main/dashboard/dashboard-list-tickets/dashboard-list-tickets-page'));
const DashboardListArticlesPage = asyncComponent(() => import('./main/dashboard/dashboard-list-articles/dashboard-list-articles-page'));
const DashboardCreateTicketPage = asyncComponent(() => import('./main/dashboard/dashboard-create-ticket/dashboard-create-ticket-page'));
const DashboardEditProfilePage = asyncComponent(() => import('./main/dashboard/dashboard-edit-profile/dashboard-edit-profile-page'));
const DashboardArticlePage = asyncComponent(() => import('./main/dashboard/dashboard-article/dashboard-article-page'));
const DashboardTicketPage = asyncComponent(() => import('./main/dashboard/dashboard-ticket/dashboard-ticket-page'));
const DashboardEditUser = asyncComponent(() => import('./main/dashboard/dashboard-edit-user/dashboard-edit-user'));
const DashboardViewUser = asyncComponent(() => import('./main/dashboard/dashboard-view-user/dashboard-view-user'));
const DashboardListUsersPage = asyncComponent(() => import('./main/dashboard/dashboard-list-users/dashboard-list-users-page'));


// ADMIN PANEL
const AdminPanelLayout = asyncComponent(() => import('./admin/panel/admin-panel-layout'));
const AdminLoginPage = asyncComponent(() => import('./admin/admin-login-page'));

const AdminPanelStats = asyncComponent(() => import('./admin/panel/dashboard/admin-panel-stats'));
const AdminPanelActivity = asyncComponent(() => import('./admin/panel/dashboard/admin-panel-activity'));
const AdminPanelMyAccount = asyncComponent(() => import('./admin/panel/dashboard/admin-panel-my-account'));
const AdminPanelPlan = asyncComponent(() => import('./admin/panel/dashboard/admin-panel-plan'));

const AdminPanelMyTickets = asyncComponent(() => import('./admin/panel/tickets/admin-panel-my-tickets'));
const AdminPanelNewTickets = asyncComponent(() => import('./admin/panel/tickets/admin-panel-new-tickets'));
const AdminPanelSearchTickets = asyncComponent(() => import('./admin/panel/tickets/admin-panel-search-tickets'));
const AdminPanelViewTicket = asyncComponent(() => import('./admin/panel/tickets/admin-panel-view-ticket'));
const AdminPanelCustomResponses = asyncComponent(() => import('./admin/panel/tickets/admin-panel-custom-responses'));

const AdminPanelListUsers = asyncComponent(() => import('./admin/panel/users/admin-panel-list-users'));
const AdminPanelViewUser = asyncComponent(() => import('./admin/panel/users/admin-panel-view-user'));
const AdminPanelBanUsers = asyncComponent(() => import('./admin/panel/users/admin-panel-ban-users'));
const AdminPanelCustomFields = asyncComponent(() => import('./admin/panel/users/admin-panel-custom-fields'));
const AdminPanelCompanies = asyncComponent(() => import('./admin/panel/users/admin-panel-companies'));

const AdminPanelListArticles = asyncComponent(() => import('./admin/panel/articles/admin-panel-list-articles'));
const AdminPanelViewArticle = asyncComponent(() => import('./admin/panel/articles/admin-panel-view-article'));

const AdminPanelStaffMembers = asyncComponent(() => import('./admin/panel/staff/admin-panel-staff-members'));
const AdminPanelDepartments = asyncComponent(() => import('./admin/panel/staff/admin-panel-departments'));
const AdminPanelViewStaff = asyncComponent(() => import('./admin/panel/staff/admin-panel-view-staff'));

const AdminPanelSystemPreferences = asyncComponent(() => import('./admin/panel/settings/admin-panel-system-preferences'));
const AdminPanelAdvancedSettings = asyncComponent(() => import('./admin/panel/settings/admin-panel-advanced-settings'));
const AdminPanelEmailSettings = asyncComponent(() => import('./admin/panel/settings/admin-panel-email-settings'));
const AdminPanelCustomTags = asyncComponent(() => import('./admin/panel/settings/admin-panel-custom-tags'));

const AdminPanelEditCompany = asyncComponent(() => import('./admin/panel/users/admin-panel-edit-company'));
const AdminPanelViewCompany = asyncComponent(() => import('./admin/panel/users/admin-panel-view-company'));
const AdminPanelEditUser = asyncComponent(() => import('./admin/panel/users/admin-panel-edit-user'));


// INSTALLATION
const InstallLayout = asyncComponent(() => import('./install/install-layout'));
const ValidateKey = asyncComponent(() => import('./install/validate-key'));
const InstallStep1Language = asyncComponent(() => import('./install/install-step-1-language'));
const InstallStep2Requirements = asyncComponent(() => import('./install/install-step-2-requirements'));
const InstallStep3Database = asyncComponent(() => import('./install/install-step-3-database'));
const InstallStep4UserSystem = asyncComponent(() => import('./install/install-step-4-user-system'));
const InstallStep5Settings = asyncComponent(() => import('./install/install-step-5-settings'));
const InstallStep6PlanLimits = asyncComponent(() => import('./install/install-step-6-plan-limits'));
const InstallStep7Admin = asyncComponent(() => import('./install/install-step-7-admin'));
const InstallCompleted = asyncComponent(() => import('./install/install-completed'));


export default (
    <Router history={history}>
        <Route component={App}>
            <Route path='/' component={MainLayout}>
                <IndexRoute component={MainHomePage}/>
                <Route path='signup' component={MainSignUpPage}/>
                <Route path='verify-token/:email/:token' component={MainVerifyTokenPage}/>
                <Route path='recover-password' component={MainRecoverPasswordPage}/>
                <Route path='maintenance' component={MainMaintenancePage}/>

                <Route path='create-ticket' component={DashboardCreateTicketPage}/>
                <Route path='check-ticket(/:ticketNumber/:email)' component={MainCheckTicketPage}/>
                <Route path='view-ticket/:ticketNumber' component={MainViewTicketPage}/>
                <Route path='articles' component={DashboardListArticlesPage}/>
                <Route path='article/:articleId' component={DashboardArticlePage}/>

                <Route path='dashboard' component={DashboardLayout}>
                    <IndexRoute component={DashboardListTicketsPage}/>
                    <Route path='articles' component={DashboardListArticlesPage}/>

                    <Route path='create-ticket' component={DashboardCreateTicketPage}/>
                    <Route path='edit-profile' component={DashboardEditProfilePage}/>

                    <Route path='article/:articleId' component={DashboardArticlePage}/>
                    <Route path='ticket/:ticketNumber' component={DashboardTicketPage}/>

                    <Route path='users' component={DashboardListUsersPage}/>
                    <Route path='users/:userId' component={DashboardViewUser}/>
                    <Route path="users/edit/:userId" component={DashboardEditUser}
                           render={props => <DashboardEditUser {...props} />}/>
                </Route>
            </Route>
            <Route path="install">
                <IndexRoute component={ValidateKey}/>
                <Route path="step" component={InstallLayout}>
                    <IndexRedirect to="1"/>
                    <Route path="1" component={InstallStep1Language}/>
                    <Route path="2" component={InstallStep2Requirements}/>
                    <Route path="3" component={InstallStep3Database}/>
                    <Route path="4" component={InstallStep4UserSystem}/>
                    <Route path="5" component={InstallStep5Settings}/>
                    <Route path="6" component={InstallStep6PlanLimits}/>
                    <Route path="7" component={InstallStep7Admin}/>
                </Route>
                <Route path="completed" component={InstallCompleted}/>
            </Route>
            <Route path="admin">
                <IndexRoute component={AdminLoginPage}/>
                <Route path="panel" component={AdminPanelLayout}>
                    <IndexRedirect to="activity"/>
                    <Route path="stats" component={AdminPanelStats}/>
                    <Route path="activity" component={AdminPanelActivity}/>
                    <Route path="plan" component={AdminPanelPlan}/>
                    <Route path="my-account" component={AdminPanelMyAccount}/>

                    <Route path="tickets">
                        <IndexRedirect to="my-tickets"/>
                        <Route path="my-tickets" component={AdminPanelMyTickets}/>
                        <Route path="new-tickets" component={AdminPanelNewTickets}/>
                        <Route path="search-tickets" component={AdminPanelSearchTickets}/>
                        <Route path="custom-responses" component={AdminPanelCustomResponses}/>
                        <Route path="view-ticket/:ticketNumber" component={AdminPanelViewTicket}/>
                    </Route>

                    <Route path="users">
                        <IndexRedirect to="list-users"/>

                        <Route path="list-users" component={AdminPanelListUsers}/>
                        <Route path="view-user/:userId" component={AdminPanelViewUser}/>
                        <Route path="edit-user/:userId" component={AdminPanelEditUser}/>
                        <Route path="ban-users" component={AdminPanelBanUsers}/>
                        <Route path="custom-fields" component={AdminPanelCustomFields}/>

                        <Route path="companies" component={AdminPanelCompanies}/>
                        <Route path="view-company/:companyId" component={AdminPanelViewCompany}/>
                        <Route path="edit-company/:companyId" component={AdminPanelEditCompany}/>
                    </Route>

                    <Route path="articles">
                        <IndexRedirect to="list-articles"/>
                        <Route path="list-articles" component={AdminPanelListArticles}/>
                        <Route path="view-article/:articleId" component={AdminPanelViewArticle}/>
                    </Route>

                    <Route path="staff">
                        <IndexRedirect to="staff-members"/>
                        <Route path="staff-members" component={AdminPanelStaffMembers}/>
                        <Route path="view-staff/:staffId" component={AdminPanelViewStaff}/>
                        <Route path="departments" component={AdminPanelDepartments}/>
                    </Route>

                    <Route path="settings">
                        <IndexRedirect to="system-preferences"/>
                        <Route path="system-preferences" component={AdminPanelSystemPreferences}/>
                        <Route path="advanced-settings" component={AdminPanelAdvancedSettings}/>
                        <Route path="email-settings" component={AdminPanelEmailSettings}/>
                        <Route path="custom-tags" component={AdminPanelCustomTags}/>
                    </Route>
                </Route>
            </Route>

        </Route>
    </Router>
);
