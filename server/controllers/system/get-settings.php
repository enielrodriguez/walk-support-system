<?php

use RedBeanPHP\Facade as RedBean;

/**
 * @api {post} /system/get-settings Get settings
 * @apiVersion 4.8.0
 *
 * @apiName Get settings
 *
 * @apiGroup System
 *
 * @apiDescription This path retrieves all the settings.
 *
 * @apiPermission any
 *
 * @apiParam {Boolean} allSettings Indicates if you want the regular settings list or a complete settings list. Complete list only available for staff level3.
 *
 * @apiSuccess {Object} data Contains the information about the settings
 *
 */
class GetSettingsController extends Controller
{
    const PATH = '/get-settings';
    const METHOD = 'POST';

    public function validations()
    {
        return [
            'permission' => 'any',
            'requestData' => []
        ];
    }

    public function handler()
    {
        $settingsList = [];

        if (InstallationDoneController::isInstallationDone()) {
            if (Controller::request('allSettings') && Controller::isStaffLogged(3)) {
                $settingsList = [
                    'language' => Setting::getSetting('language')->getValue(),
                    'reCaptchaKey' => Setting::getSetting('recaptcha-public')->getValue(),
                    'reCaptchaPrivate' => Setting::getSetting('recaptcha-private')->getValue(),
                    'maintenance-mode' => (int)Setting::getSetting('maintenance-mode')->getValue(),
                    'layout' => Setting::getSetting('layout')->getValue(),
                    'allow-attachments' => (int)Setting::getSetting('allow-attachments')->getValue(),
                    'max-size' => Setting::getSetting('max-size')->getValue(),
                    'url' => Setting::getSetting('url')->getValue(),
                    'title' => Setting::getSetting('title')->getValue(),
                    'server-email' => Setting::getSetting('server-email')->getValue(),
                    'smtp-host' => Setting::getSetting('smtp-host')->getValue(),
                    'smtp-user' => Setting::getSetting('smtp-user')->getValue(),
                    'imap-host' => Setting::getSetting('imap-host')->getValue(),
                    'imap-user' => Setting::getSetting('imap-user')->getValue(),
                    'imap-token' => Setting::getSetting('imap-token')->getValue(),
                    'registration' => Setting::getSetting('registration')->getValue(),
                    'departments' => Department::getAllDepartmentNames(),
                    'supportedLanguages' => Language::getSupportedLanguages(),
                    'allowedLanguages' => Language::getAllowedLanguages(),
                    'session-prefix' => Setting::getSetting('session-prefix')->getValue(),
                    'mail-template-header-image' => Setting::getSetting('mail-template-header-image')->getValue(),
                    'tags' => Tag::getAll()->toArray(),
                    'mandatory-login' => Setting::getSetting('mandatory-login')->getValue(),
                    'default-department-id' => Setting::getSetting('default-department-id')->getValue(),
                    'default-is-locked' => Setting::getSetting('default-is-locked')->getValue()
                ];
            } else {
                $settingsList = [
                    'language' => Setting::getSetting('language')->getValue(),
                    'reCaptchaKey' => Setting::getSetting('recaptcha-public')->getValue(),
                    'maintenance-mode' => intval(Setting::getSetting('maintenance-mode')->getValue()),
                    'layout' => Setting::getSetting('layout')->getValue(),
                    'allow-attachments' => intval(Setting::getSetting('allow-attachments')->getValue()),
                    'max-size' => Setting::getSetting('max-size')->getValue(),
                    'title' => Setting::getSetting('title')->getValue(),
                    'registration' => Setting::getSetting('registration')->getValue(),
                    'departments' => Controller::isStaffLogged() ? Department::getAllDepartmentNames() : Department::getPublicDepartmentNames(),
                    'supportedLanguages' => Language::getSupportedLanguages(),
                    'allowedLanguages' => Language::getAllowedLanguages(),
                    'session-prefix' => Setting::getSetting('session-prefix')->getValue(),
                    'tags' => Tag::getAll()->toArray(),
                    'mandatory-login' => Setting::getSetting('mandatory-login')->getValue(),
                    'default-department-id' => Setting::getSetting('default-department-id')->getValue(),
                    'default-is-locked' => Setting::getSetting('default-is-locked')->getValue()
                ];
            }

            if (Controller::isStaffLogged(3) || (InstallationDoneController::isInstallationDone() && Session::getInstance()->isInstallerLogged())) {
                $settingsList['plan_limit'] = $this->getPlanLimit();
            } else if (Controller::isCompanyAdminLogged()) {
                $settingsList['users_limit'] = Controller::getLoggedUser()->company->users_limit;
            }
        }

        if($logged = Session::getInstance()->isInstallerLogged()) {
            $settingsList['installerLogged'] = $logged;
        }

        Response::respondSuccess($settingsList);
    }

    private function getPlanLimit()
    {
        $planLimit = PlanLimit::findOne()->toArray();

        $totalUsersCurrently = User::count();
        // -1 because there is a default entity
        $totalStaffCurrently = Staff::count() - 1;
        $totalCompaniesCurrently = Company::count() - 1;
        $totalDepartmentsCurrently = Department::count();

        $planLimit['unassigned_users_quota'] = null;
        $planLimit['total_users_currently'] = $totalUsersCurrently;
        $planLimit['total_staff_currently'] = $totalStaffCurrently;
        $planLimit['total_companies_currently'] = $totalCompaniesCurrently;
        $planLimit['total_departments_currently'] = $totalDepartmentsCurrently;

        if ($planLimit['users'] > 0) {
            $usersInCompaniesWithoutLimit = (int)RedBean::getCell('SELECT COUNT(u.id) FROM `user` u INNER JOIN company c  ON u.company_id = c.id WHERE c.users_limit = 0 ');
            $companiesLimit = (int)Company::getCell('SELECT SUM(users_limit) FROM company');
            $unassignedUsersQuota = $planLimit['users'] - $companiesLimit - $usersInCompaniesWithoutLimit;

            $planLimit['unassigned_users_quota'] = $unassignedUsersQuota;
        }

        return $planLimit;
    }
}
