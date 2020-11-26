<?php

use Respect\Validation\Validator as DataValidator;

DataValidator::with('CustomValidations', true);

/**
 * @api {post} /user/add-company Create company
 * @apiVersion 4.8.0
 *
 * @apiName Create company
 *
 * @apiGroup User
 *
 * @apiDescription This path creates a new company.
 *
 * @apiPermission staff3
 *
 *
 * @apiSuccess {Object} data Empty object
 *
 */
class AddCompanyController extends Controller
{
    const PATH = '/add-company';
    const METHOD = 'POST';

    private $adminEmail;
    private $adminName;
    private $token;

    private Company $company;

    private $businessName;
    private $nit;
    private $phone;
    private $contactName;
    private $companyUsersLimit;

    public function validations()
    {
        return [
            'permission' => 'staff_3',
            'requestData' => [
                'business_name' => [
                    'validation' => [
                        [
                            'validation' => DataValidator::notBlank()->length(2, 100),
                            'error' => ERRORS::INVALID_NAME
                        ],
                        [
                            'validation' => DataValidator::checkLimit('companies'),
                            'error' => ERRORS::COMPANIES_LIMIT_REACHED
                        ]
                    ]
                ], 'nit' => [
                    'validation' => DataValidator::notBlank()->length(2, 100),
                    'error' => ERRORS::INVALID_NIT
                ], 'phone' => [
                    'validation' => DataValidator::notBlank()->length(6, 100),
                    'error' => ERRORS::INVALID_PHONE
                ], 'contact_name' => [
                    'validation' => DataValidator::oneOf(
                        DataValidator::notBlank()->length(5, 100),
                        DataValidator::falseVal()
                    ),
                    'error' => ERRORS::INVALID_CONTACT_NAME
                ], 'users_limit' => [
                    'validation' => DataValidator::intVal()->min(0),
                    'error' => ERRORS::INVALID_USERS_LIMIT
                ],
                'admin_name' => [
                    'validation' => [
                        [
                            'validation' => DataValidator::oneOf(
                                DataValidator::notBlank()->length(2, 100),
                                DataValidator::falseVal()
                            ),
                            'error' => ERRORS::INVALID_NAME
                        ],
                        [
                            'validation' => DataValidator::checkLimit('users'),
                            'error' => ERRORS::USERS_LIMIT_REACHED
                        ]
                    ]
                ],
                'admin_email' => [
                    'validation' => DataValidator::oneOf(
                        DataValidator::email(),
                        DataValidator::falseVal()
                    ),
                    'error' => ERRORS::INVALID_ADMIN_EMAIL
                ],
            ]
        ];
    }

    public function handler()
    {
        $this->businessName = Controller::request('business_name');
        $this->nit = Controller::request('nit');
        $this->phone = Controller::request('phone');
        $this->contactName = Controller::request('contact_name');
        $this->companyUsersLimit = (int)Controller::request('users_limit');

        $this->adminName = Controller::request('admin_name');
        $this->adminEmail = Controller::request('admin_email');

        if ($this->adminName xor $this->adminEmail) {
            throw new RequestException(ERRORS::INVALID_USER);
        }


        $globalUsersLimit = PlanLimit::findOne()->users;
        if ($globalUsersLimit > 0) {
            $usersInDefaultCompany = User::count(' company_id = ? ', [1]);
            $companiesLimit = (int)Company::getCell('SELECT SUM(users_limit) FROM company');

            $availablePositions = $globalUsersLimit - $companiesLimit - $usersInDefaultCompany;

            if ($this->companyUsersLimit > $availablePositions) {
                throw new RequestException(ERRORS::INVALID_USERS_LIMIT);
            }

            // $availablePositions should never be < 0, however, I don't know if due to concurrency
            // issues there is any possibility that it will happen (the users limit is exceeded).
            if ($this->companyUsersLimit === 0 && $availablePositions <= 0 && $this->adminName) {
                throw new RequestException(ERRORS::USERS_LIMIT_REACHED);
            }
        }


        $this->createCompany();

        if ($this->adminName) {
            try {
                $userAdmin = $this->createUserAdmin();
                $this->company->setProperties(array('admin' => $userAdmin));
                $this->company->store();
            } catch (Exception $e) {
                $this->company->delete();
                throw $e;
            }
        }

        Log::createLog('ADD_COMPANY', $this->businessName);

        Response::respondSuccess();
    }


    public function createCompany()
    {
        if (!Company::getDataStore($this->nit, 'nit')->isNull()) {
            throw new RequestException(ERRORS::COMPANY_EXISTS);
        }

        $this->company = new Company();

        $this->company->setProperties([
            'business_name' => $this->businessName,
            'nit' => $this->nit,
            'phone' => $this->phone,
            'contact_name' => $this->contactName,
            'users_limit' => $this->companyUsersLimit
        ]);

        $this->company->store();
    }


    public function createUserAdmin()
    {
        $this->checkIfUserExists();

        $userAdmin = new User();

        $userAdmin->setProperties([
            'name' => $this->adminName,
            'tickets' => 0,
            'email' => $this->adminEmail,
            'password' => Hashing::hashPassword(Hashing::generateRandomToken()),
            'verificationToken' => null,
            'company' => $this->company
        ]);

        $userAdmin->store();

        $this->sendInvitationMail();

        Log::createLog('ADD_USER', $userAdmin->name);

        return $userAdmin;
    }


    public function sendInvitationMail()
    {
        $this->token = Hashing::generateRandomToken();
        $recoverPassword = new RecoverPassword();
        $recoverPassword->setProperties(array(
            'email' => $this->adminEmail,
            'token' => $this->token,
            'staff' => false
        ));
        $recoverPassword->store();


        $mailSender = MailSender::getInstance();
        $mailSender->setTemplate(MailTemplate::USER_INVITE, [
            'to' => $this->adminEmail,
            'name' => $this->adminName,
            'url' => Setting::getSetting('url')->getValue(),
            'token' => $this->token
        ]);

        $mailSender->send();
    }


    private function checkIfUserExists()
    {
        $existentUser = User::getUser($this->adminEmail, 'email');

        if (!$existentUser->isNull()) {
            throw new RequestException(ERRORS::USER_EXISTS);
        }

        $banRow = Ban::getDataStore($this->adminEmail, 'email');

        if (!$banRow->isNull()) {
            throw new RequestException(ERRORS::ALREADY_BANNED);
        }
    }
}
