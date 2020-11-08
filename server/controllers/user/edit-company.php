<?php

use Respect\Validation\Validator as DataValidator;

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
    private $token;


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
                    'validation' => DataValidator::notBlank()->length(5, 100),
                    'error' => ERRORS::INVALID_CONTACT_NAME
                ],
                'new_admin_name' => [
                    'validation' => DataValidator::oneOf(
                        DataValidator::notBlank()->length(2, 100),
                        DataValidator::nullType(),
                        DataValidator::length(0)
                    ),
                    'error' => ERRORS::INVALID_ADMIN_NAME
                ],
                'new_admin_email' => [
                    'validation' => DataValidator::oneOf(
                        DataValidator::email(),
                        DataValidator::nullType(),
                        DataValidator::length(0)
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

        // The company Default (the only one without an administrator) cannot be edited
        if (!$this->company->admin) {
            throw new RequestException(ERRORS::INVALID_COMPANY);
        }

        $this->updateCompany();

        if ($this->newAdminName || $this->newAdminEmail) {
            $this->createUserAdmin();

            $oldAdmin = User::getUser($this->company->admin->id);

            $this->company->setProperties(array('admin' => $this->companyAdmin));
            $this->company->store();

            $oldAdmin->supervisedrelation->delete();
            $oldAdmin->delete();
        }

        Response::respondSuccess();
    }


    public function updateCompany()
    {
        $existingCompany = Company::getDataStore($this->nit, 'nit');
        if (!$existingCompany->isNull() && ($existingCompany->id !== $this->companyId)) {
            throw new RequestException(ERRORS::COMPANY_EXISTS);
        }

        $this->company->setProperties([
            'business_name' => $this->businessName,
            'nit' => $this->nit,
            'phone' => $this->phone,
            'contact_name' => $this->contactName
        ]);

        $this->company->store();
    }


    public function createUserAdmin()
    {
        $desiredCompanyAdmin = User::getUser($this->newAdminEmail, 'email');

        if (!$desiredCompanyAdmin->isNull()) {
            if ($this->newAdminName) {
                throw new RequestException(ERRORS::USER_EXISTS);
            }

            if ($desiredCompanyAdmin->id === $this->company->admin->id) {
                throw new RequestException(ERRORS::USER_ALREADY_ADMIN);
            }

            if ($desiredCompanyAdmin->company->id !== $this->companyId) {
                throw new RequestException(ERRORS::INVALID_USER);
            }
        }

        $banRow = Ban::getDataStore($this->newAdminEmail, 'email');

        if (!$banRow->isNull()) {
            throw new RequestException(ERRORS::ALREADY_BANNED);
        }

        if ($desiredCompanyAdmin->isNull()) {
            $desiredCompanyAdmin = new User();
            $desiredCompanyAdmin->setProperties([
                'name' => $this->newAdminName,
                'tickets' => 0,
                'email' => $this->newAdminEmail,
                'password' => Hashing::hashPassword(Hashing::generateRandomToken()),
                'verificationToken' => null
            ]);
        }

        $desiredCompanyAdmin->setProperties([
            'company' => $this->company
        ]);

        $oldAdmin = User::getUser($this->company->admin->id);
        $companyUsers = $oldAdmin->supervisedrelation->sharedUserList;
        $desiredCompanyAdmin->supervisedrelation = new Supervisedrelation();
        $desiredCompanyAdmin->supervisedrelation->sharedUserList = $companyUsers;

        $desiredCompanyAdmin->supervisedrelation->store();
        $desiredCompanyAdmin->store();

        $this->companyAdmin = $desiredCompanyAdmin;

        $this->token = Hashing::generateRandomToken();

        $recoverPassword = new RecoverPassword();
        $recoverPassword->setProperties(array(
            'email' => $this->newAdminEmail,
            'token' => $this->token,
            'staff' => false
        ));
        $recoverPassword->store();

        $this->sendInvitationMail();
    }


    public function sendInvitationMail()
    {
        $mailSender = MailSender::getInstance();

        $mailSender->setTemplate(MailTemplate::USER_INVITE, [
            'to' => $this->newAdminEmail,
            'name' => $this->newAdminName,
            'url' => Setting::getSetting('url')->getValue(),
            'token' => $this->token
        ]);

        $mailSender->send();
    }
}
