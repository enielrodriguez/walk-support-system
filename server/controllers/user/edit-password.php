<?php

use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /user/edit-password Edit password
 * @apiVersion 4.8.0
 *
 * @apiName Edit password
 *
 * @apiGroup User
 *
 * @apiDescription This path edits the password of an user.
 *
 * @apiPermission user
 *
 * @apiParam {String} newPassword The new password that the user wants to change.
 * @apiParam {String} oldPassword The actual password of the user.
 * @apiParam {Number} userId Optional. The user id whose password is to be changed. This option is for administrators to manage other users.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_PASSWORD
 * @apiUse INVALID_OLD_PASSWORD
 *
 * @apiSuccess {Object} data Empty object
 *
 */
class EditPassword extends Controller
{
    const PATH = '/edit-password';
    const METHOD = 'POST';

    private $newPassword;
    private $user;

    public function validations()
    {
        return [
            'permission' => 'user',
            'requestData' => [
                'newPassword' => [
                    'validation' => DataValidator::notBlank()->length(5, 200),
                    'error' => ERRORS::INVALID_PASSWORD
                ]
            ]
        ];
    }

    public function handler()
    {
        $this->newPassword = Controller::request('newPassword');
        $userId = Controller::request('userId');

        if (!$userId) {
            $this->setupForLoggedUser();
        } else if (Controller::isStaffLogged() || Controller::isCompanyAdminLogged()) {
            $this->setupForSomeUser($userId);
        } else {
            throw new RequestException(ERRORS::NO_PERMISSION);
        }

        $this->changePassword();

        Response::respondSuccess();
    }


    private function setupForLoggedUser()
    {
        $this->user = Controller::getLoggedUser();
        $oldPassword = Controller::request('oldPassword');

        if (!Hashing::verifyPassword($oldPassword, $this->user->password)) {
            throw new RequestException(ERRORS::INVALID_OLD_PASSWORD);
        }
    }


    private function setupForSomeUser($userId)
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


    private function changePassword()
    {
        $this->user->password = Hashing::hashPassword($this->newPassword);
        $this->user->store();

        $mailSender = MailSender::getInstance();
        $mailSender->setTemplate('USER_PASSWORD', [
            'to' => $this->user->email,
            'name' => $this->user->name
        ]);
        $mailSender->send();
    }
}
