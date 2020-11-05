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
    private User $userAdmin;

    private $business_name;
    private $nit;
    private $phone;
    private $contact_name;

    public function validations()
    {
        return [
            'permission' => 'staff_3',
            'requestData' => [
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
                'admin_name' => [
                    'validation' => DataValidator::notBlank()->length(2, 100),
                    'error' => ERRORS::INVALID_ADMIN_NAME
                ],
                'admin_email' => [
                    'validation' => DataValidator::email(),
                    'error' => ERRORS::INVALID_ADMIN_EMAIL
                ],
            ]
        ];
    }

    public function handler()
    {
        $this->business_name = Controller::request('business_name');
        $this->nit = Controller::request('nit');
        $this->phone = Controller::request('phone');
        $this->contact_name = Controller::request('contact_name');

        $this->adminName = Controller::request('admin_name');
        $this->adminEmail = Controller::request('admin_email');


        $this->createCompany();
        try {
            $this->createUserAdmin();
        } catch (Exception $e) {
            $this->company->delete();
            throw $e;
        }

        $this->company->setProperties(array('admin' => $this->userAdmin));
        $this->company->store();


        $this->token = Hashing::generateRandomToken();

        $recoverPassword = new RecoverPassword();
        $recoverPassword->setProperties(array(
            'email' => $this->adminEmail,
            'token' => $this->token,
            'staff' => false
        ));
        $recoverPassword->store();

        $this->sendInvitationMail();


        Response::respondSuccess();
    }


    public function createCompany()
    {
        if (!Company::getDataStore($this->nit, 'nit')->isNull()) {
            throw new RequestException(ERRORS::COMPANY_EXISTS);
        }

        $this->company = new Company();

        $this->company->setProperties([
            'business_name' => $this->business_name,
            'nit' => $this->nit,
            'phone' => $this->phone,
            'contact_name' => $this->contact_name
        ]);

        $this->company->store();
    }


    public function createUserAdmin()
    {
        $this->checkIfUserExists();

        $this->userAdmin = new User();

        $this->userAdmin->setProperties([
            'name' => $this->adminName,
            'tickets' => 0,
            'email' => $this->adminEmail,
            'password' => Hashing::hashPassword(Hashing::generateRandomToken()),
            'verificationToken' => null,
            'company' => $this->company
        ]);

        $this->userAdmin->store();
    }


    public function sendInvitationMail()
    {
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
