<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /user/edit-email Edit email
 * @apiVersion 4.8.0
 *
 * @apiName Edit email
 *
 * @apiGroup User
 *
 * @apiDescription This path changes the email of an user.
 *
 * @apiPermission user
 *
 * @apiParam {String} newEmail The new email that the user wants to change.
 * @apiParam {Number} userId Optional. The user id whose email is to be changed. This option is for staffs and company admins to manage other users.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_EMAIL
 * 
 * @apiSuccess {Object} data Empty object
 *
 */

class EditEmail extends Controller{
    const PATH = '/edit-email';
    const METHOD = 'POST';

    private $user;

    public function validations() {
        return [
            'permission' => 'user',
            'requestData' => [
                'newEmail' => [
                    'validation' => DataValidator::email(),
                    'error' => ERRORS::INVALID_EMAIL
                ]
            ]
        ];
    }
    
    public function handler() {

        $newEmail = Controller::request('newEmail');
        $userId = Controller::request('userId');

        if (!$userId) {
            $this->user = Controller::getLoggedUser();
        } else if (Controller::isStaffLogged() || Controller::isCompanyAdminLogged()) {
            $this->setupForSomeUser($userId);
        } else {
            throw new RequestException(ERRORS::NO_PERMISSION);
        }

        $oldEmail = $this->user->email;
        $this->user->email = $newEmail;
        $this->user->store();
        
        $mailSender = MailSender::getInstance();
        $mailSender->setTemplate('USER_EMAIL', [
            'to'=>$oldEmail,
            'newemail'=>$this->user->email,
            'name'=>$this->user->name
        ]);
        $mailSender->send();
        
        Response::respondSuccess();
    }

    private function setupForSomeUser(string $userId)
    {
        $this->user = User::getUser($userId);

        if ($this->user->isNull()) {
            throw new RequestException(ERRORS::INVALID_USER);
        }

        $loggedUser = Controller::getLoggedUser();
        if (Controller::isCompanyAdminLogged() && ($this->user->company->id !== $loggedUser->company->id)) {
            throw new RequestException(ERRORS::NO_PERMISSION);
        }
    }
}
