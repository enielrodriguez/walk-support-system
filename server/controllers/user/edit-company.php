<?php

use Respect\Validation\Validator as DataValidator;
use RedBeanPHP\Facade as RedBean;

DataValidator::with('CustomValidations', true);

/**
 * @api {post} /user/edit-company Edit company
 * @apiVersion 4.8.0
 *
 * @apiName Edit company
 *
 * @apiGroup User
 *
 * @apiDescription This path edits a company
 *
 * @apiPermission staff3
 *
 * @apiParam {Number} id Company id
 * @apiParam {String} business_name
 * @apiParam {String} nit
 * @apiParam {String} phone
 * @apiParam {String} contact_name
 * @apiParam {String} new_admin_name This parameter is only taken into account if new_admin_email is non-null and valid.
 * @apiParam {String} new_admin_email This parameter is only taken into account if new_admin_name is non-null and valid.
 *
 * @apiSuccess {Object} data Empty object
 *
 */
class EditCompanyController extends Controller
{
    const PATH = '/edit-company';
    const METHOD = 'POST';

    private Company $company;
    private User $companyAdmin;

    private $companyId;
    private $businessName;
    private $nit;
    private $phone;
    private $contactName;
    private $companyUsersLimit;

    private $newAdminName;
    private $newAdminEmail;


    public function validations()
    {
        return [
            'permission' => 'staff_3',
            'requestData' => [
                'id' => [
                    'validation' => DataValidator::dataStoreId('company'),
                    'error' => ERRORS::INVALID_COMPANY
                ],
                'business_name' => [
                    'validation' => DataValidator::notBlank()->length(2, 100),
                    'error' => ERRORS::INVALID_NAME
                ], 'nit' => [
                    'validation' => DataValidator::notBlank()->length(2, 100),
                    'error' => ERRORS::INVALID_NIT
                ], 'phone' => [
                    'validation' => DataValidator::notBlank()->length(6, 100),
                    'error' => ERRORS::INVALID_PHONE
                ], 'contact_name' => [
                    'validation' => DataValidator::optional(
                        DataValidator::notBlank()->length(5, 100)
                    ),
                    'error' => ERRORS::INVALID_CONTACT_NAME
                ], 'users_limit' => [
                    'validation' => DataValidator::intVal()->min(0),
                    'error' => ERRORS::INVALID_USERS_LIMIT
                ],
                'new_admin_name' => [
                    'validation' => [
                        [
                            'validation' => DataValidator::optional(
                                DataValidator::notBlank()->length(2, 100)
                            ),
                            'error' => ERRORS::INVALID_ADMIN_NAME
                        ],
                        [
                            'validation' => DataValidator::checkLimit('users'),
                            'error' => ERRORS::USERS_LIMIT_REACHED
                        ]
                    ]
                ],
                'new_admin_email' => [
                    'validation' => DataValidator::optional(
                        DataValidator::email()
                    ),
                    'error' => ERRORS::INVALID_ADMIN_EMAIL
                ],
            ]
        ];
    }

    public function handler()
    {
        $this->companyId = Controller::request('id');
        $this->businessName = Controller::request('business_name');
        $this->nit = Controller::request('nit');
        $this->phone = Controller::request('phone');
        $this->contactName = Controller::request('contact_name');
        $this->companyUsersLimit = (int)Controller::request('users_limit');

        $this->newAdminName = Controller::request('new_admin_name');
        $this->newAdminEmail = Controller::request('new_admin_email');

        $this->company = Company::getCompany($this->companyId);

        if ($this->company->nit === 'default_company') {
            throw new RequestException(ERRORS::INVALID_COMPANY);
        }

        $this->validateData();

        $this->updateCompany();

        Log::createLog('EDIT_COMPANY', $this->businessName);

        Response::respondSuccess();
    }


    public function updateCompany()
    {
        $this->company->setProperties([
            'business_name' => $this->businessName,
            'nit' => $this->nit,
            'phone' => $this->phone,
            'contact_name' => $this->contactName,
            'users_limit' => $this->companyUsersLimit
        ]);

        if ($this->newAdminEmail) {
            $this->createUserAdmin();
            $this->company->setProperties(array('admin' => $this->companyAdmin));
        }

        $this->company->store();
    }


    public function createUserAdmin()
    {
        $desiredCompanyAdmin = User::getUser($this->newAdminEmail, 'email');
        $oldAdmin = $this->company->admin;

        if ($desiredCompanyAdmin->isNull()) {
            $desiredCompanyAdmin = new User();
            $desiredCompanyAdmin->setProperties([
                'name' => $this->newAdminName,
                'tickets' => 0,
                'email' => $this->newAdminEmail,
                'password' => Hashing::hashPassword(Hashing::generateRandomToken()),
                'verificationToken' => null
            ]);
            $desiredCompanyAdmin->store();

            Log::createLog('ADD_USER', $desiredCompanyAdmin->name);

            $this->sendInvitationMail();
        }

        $desiredCompanyAdmin->setProperties([
            'company' => $this->company
        ]);

        $desiredCompanyAdmin->store();

        if ($oldAdmin) {
            Log::createLog('DELETE_USER', $oldAdmin->name);
            RedBean::exec('DELETE FROM log WHERE author_user_id = ?', [$oldAdmin->id]);

            foreach ($oldAdmin->sharedTicketList as $ticket) {
                $ticket->delete();
            }
            $oldAdmin->delete();
        }

        $this->companyAdmin = $desiredCompanyAdmin;
    }


    public function sendInvitationMail()
    {
        $token = Hashing::generateRandomToken();
        $recoverPassword = new RecoverPassword();
        $recoverPassword->setProperties(array(
            'email' => $this->newAdminEmail,
            'token' => $token,
            'staff' => false
        ));
        $recoverPassword->store();

        $mailSender = MailSender::getInstance();
        $mailSender->setTemplate(MailTemplate::USER_INVITE, [
            'to' => $this->newAdminEmail,
            'name' => $this->newAdminName,
            'url' => Setting::getSetting('url')->getValue(),
            'token' => $token
        ]);

        $mailSender->send();
    }

    private function validateData()
    {
        $existingCompany = Company::getDataStore($this->nit, 'nit');
        if (!$existingCompany->isNull() && ($existingCompany->id !== $this->companyId)) {
            throw new RequestException(ERRORS::COMPANY_EXISTS);
        }


        $desiredCompanyAdmin = User::getUser($this->newAdminEmail, 'email');
        if (!$desiredCompanyAdmin->isNull()) {
            if ($this->newAdminName) {
                throw new RequestException(ERRORS::USER_EXISTS);
            }

            $oldAdmin = $this->company->admin;
            if ($oldAdmin && $oldAdmin->id === $desiredCompanyAdmin->id) {
                throw new RequestException(ERRORS::USER_ALREADY_ADMIN);
            }

            if ($desiredCompanyAdmin->company->id !== $this->companyId) {
                throw new RequestException(ERRORS::INVALID_USER);
            }

        } else {
            if ($this->newAdminEmail && !$this->newAdminName) {
                throw new RequestException(ERRORS::INVALID_ADMIN_NAME);
            }

            if (!$this->newAdminEmail && $this->newAdminName) {
                throw new RequestException(ERRORS::INVALID_ADMIN_EMAIL);
            }
        }

        $banRow = Ban::getDataStore($this->newAdminEmail, 'email');

        if (!$banRow->isNull()) {
            throw new RequestException(ERRORS::ALREADY_BANNED);
        }

        $this->checkLimits();
    }


    private function checkLimits()
    {
        $company = $this->company;
        $oldAdmin = $this->company->admin;
        $usersInCompany = User::count(' company_id = ? ', [$company->id]);

        $globalUsersLimit = PlanLimit::findOne()->users;

        // These companies do not have reserved user positions (limit), so the actual number of users they have is the "reserved" positions they have.
        // Do not include the users of the current company (if it is a company without limits), as they would be part of the possible limit to be established.
        $usersInCompaniesWithoutLimit = (int)RedBean::getCell('SELECT COUNT(u.id) FROM `user` u INNER JOIN company c  ON u.company_id = c.id WHERE c.users_limit = 0 and c.id != ? ', [$this->companyId]);

        // The sum of all companies users-limit (reserved positions)
        // Do not include the limit of the current company (if it is a company with limit), as it would be part of the possible limit to be established.
        $companiesLimit = (int)Company::getCell('SELECT SUM(users_limit) FROM company WHERE id != ?', [$this->companyId]);

        // This is the number of positions that are not reserved (reserved = the companies users_limit) or occupied,
        // plus the number of reserved positions in the current company (or the number of users in the company, if it has no users_limit).
        $availablePositions = $globalUsersLimit - $companiesLimit - $usersInCompaniesWithoutLimit;

        // If there is an admin, it will be replaced by the new one (no problem here),
        // if not, a new admin (user) will be created (+1 user for the company and this can affect the users_limit)
        $tryingToAddNewAdmin = !$oldAdmin && $this->newAdminName;
        if ($tryingToAddNewAdmin) {
            $usersInCompany++;
        }


        // If tying to set a new users_limit
        if ($this->companyUsersLimit !== (int)$company->users_limit) {

            // If there is a global limit (zero = unlimited) and the there is not available positions
            if ($globalUsersLimit > 0 && $this->companyUsersLimit > $availablePositions) {
                throw new RequestException(ERRORS::INVALID_USERS_LIMIT);
            }

            // If the new limit does not cover existing users (including the new admin, in case of trying to
            // modify the users_limit and the admin at the same time)
            if ($this->companyUsersLimit > 0 && $this->companyUsersLimit < $usersInCompany) {

                // If the new limit match with the current number of users in the company (minus the new user that is not in the DB yet)
                if ($tryingToAddNewAdmin && $this->companyUsersLimit === ($usersInCompany - 1)) {
                    throw new RequestException(ERRORS::USERS_LIMIT_REACHED);
                }
                // else the problem is the new limit, is too low
                throw new RequestException(ERRORS::INVALID_USERS_LIMIT);
            }
        }


        // If trying to add a new admin (+1 user for the company)
        if ($tryingToAddNewAdmin) {
            // available user positions, excluding those of this company (-1 for the new user that is not in the DB yet)
            $realAvailablePositions = $availablePositions - ($usersInCompany - 1);

            // If the company does not have a user limit, but there is not available positions (plan limit reached).
            if ($this->companyUsersLimit === 0 && $realAvailablePositions === 0) {
                throw new RequestException(ERRORS::USERS_LIMIT_REACHED);
            }

            // If the new number of users (remember: + 1 for the new admin) is going to exceed the limit
            if ($this->companyUsersLimit > 0 && $usersInCompany > $this->companyUsersLimit) {
                throw new RequestException(ERRORS::USERS_LIMIT_REACHED);
            }
        }
    }
}
