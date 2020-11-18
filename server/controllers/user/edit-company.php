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
                    'validation' => DataValidator::oneOf(
                        DataValidator::notBlank()->length(5, 100),
                        DataValidator::falseVal()
                    ),
                    'error' => ERRORS::INVALID_CONTACT_NAME
                ],
                'new_admin_name' => [
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
                            'error' => ERRORS::USERS_LIMIT_EXCEEDED
                        ]
                    ]
                ],
                'new_admin_email' => [
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
        $this->companyId = Controller::request('id');
        $this->businessName = Controller::request('business_name');
        $this->nit = Controller::request('nit');
        $this->phone = Controller::request('phone');
        $this->contactName = Controller::request('contact_name');

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
            'contact_name' => $this->contactName
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
                throw new RequestException(ERRORS::INVALID_NAME);
            }

            if (!$this->newAdminEmail && $this->newAdminName) {
                throw new RequestException(ERRORS::INVALID_EMAIL);
            }
        }

        $banRow = Ban::getDataStore($this->newAdminEmail, 'email');

        if (!$banRow->isNull()) {
            throw new RequestException(ERRORS::ALREADY_BANNED);
        }
    }
}
