<?php

use Respect\Validation\Validator as DataValidator;

DataValidator::with('CustomValidations', true);

/**
 * @api {post} /system/init-admin Init admin
 * @apiVersion 4.8.0
 *
 * @apiName Init admin
 *
 * @apiGroup System
 *
 * @apiDescription This path creates the main administrator account. It can only be used once during installation
 *
 * @apiPermission any
 *
 * @apiParam {String} name Name of the administrator.
 * @apiParam {String} email Email of the administrator.
 * @apiParam {String} password Password of the administrator.
 *
 * @apiUse INVALID_NAME
 * @apiUse INVALID_EMAIL
 * @apiUse INVALID_PASSWORD
 *
 * @apiSuccess {Object} data Empty object
 *
 */
class InitAdminController extends Controller
{
    const PATH = '/init-admin';
    const METHOD = 'POST';

    public function validations()
    {
        return [
            'permission' => 'installer',
            'requestData' => [
                'name' => [
                    'validation' => DataValidator::notBlank()->length(2, 55),
                    'error' => ERRORS::INVALID_NAME
                ],
                'email' => [
                    'validation' => DataValidator::email(),
                    'error' => ERRORS::INVALID_EMAIL
                ],
                'password' => [
                    'validation' => DataValidator::oneOf(
                        DataValidator::notBlank()->length(6, 200),
                        DataValidator::nullType()
                    ),
                    'error' => ERRORS::INVALID_PASSWORD
                ],
            ]
        ];
    }

    public function handler()
    {
        $admin = Staff::findOne(' super_user = 1 ');
        $password = Controller::request('password');

        if ($admin->isNull()) {

            if ($password === null) {
                throw new ValidationException(ERRORS::INVALID_PASSWORD);
            }

            $admin = new Staff();
            $admin->setProperties([
                'profilePic' => '',
                'level' => 3,
                'superUser' => 1,
                'sharedDepartmentList' => Department::getAll(),
                'sharedTicketList' => [],
                'sendEmailOnNewTicket' => 1
            ]);

            foreach (Department::getAll() as $department) {
                $department->owners++;
                $department->store();
            }
        }

        $props = [
            'name' => Controller::request('name'),
            'email' => Controller::request('email')
        ];

        // If editing the installation this can be null (means keep the current pass)
        // In fresh installation can't be null (throws an exception at the beginning of this function)
        if ($password !== null) {
            $props['password'] = Hashing::hashPassword($password);
        }

        $admin->setProperties($props);

        $admin->store();

        Response::respondSuccess();
    }
}
