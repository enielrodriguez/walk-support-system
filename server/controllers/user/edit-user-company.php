<?php

use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /user/edit-user-company Edit user company
 * @apiVersion 4.8.0
 *
 * @apiName Edit user company
 *
 * @apiGroup User
 *
 * @apiDescription This path changes the company of an user.
 *
 * @apiPermission staff_1
 *
 * @apiParam {Number} newCompanyId The new company.
 * @apiParam {Number} userId The user id whose company is to be changed
 *
 *
 * @apiSuccess {Object} data Empty object
 *
 */
class EditUserCompany extends Controller
{
    const PATH = '/edit-user-company';
    const METHOD = 'POST';

    public function validations()
    {
        return [
            'permission' => 'staff_1',
            'requestData' => [
                'newCompanyId' => [
                    'validation' => DataValidator::dataStoreId('company'),
                    'error' => ERRORS::INVALID_COMPANY
                ],
                'userId' => [
                    'validation' => DataValidator::dataStoreId('user'),
                    'error' => ERRORS::INVALID_USER
                ]
            ]
        ];
    }

    public function handler()
    {
        $newCompanyId = Controller::request('newCompanyId');
        $userId = Controller::request('userId');
        $user = User::getUser($userId);
        $oldCompany = $user->company;
        $oldCompanyAdmin = $user->company->admin;

        if ($oldCompanyAdmin && ($oldCompanyAdmin->id === $userId)) {
            throw new RequestException(ERRORS::INVALID_USER);
        }

        if ($oldCompany->id === $newCompanyId) {
            Response::respondSuccess();
        }


        if ($oldCompanyAdmin) {
            $oldCompanyAdmin->supervisedrelation->sharedUserList->remove($user);
            $oldCompanyAdmin->supervisedrelation->store();
        }


        $newCompany = Company::getCompany($newCompanyId);
        $user->company = $newCompany;
        $user->store();


        $companyAdmin = $newCompany->admin;
        if (!$companyAdmin->supervisedrelation) {
            $companyAdmin->supervisedrelation = new Supervisedrelation();
            $companyAdmin->store();
        }
        $companyAdmin->supervisedrelation->sharedUserList->add($user);
        $companyAdmin->supervisedrelation->store();


        Response::respondSuccess();
    }
}
