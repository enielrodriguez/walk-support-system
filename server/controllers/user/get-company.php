<?php

use Respect\Validation\Validator as DataValidator;

DataValidator::with('CustomValidations', true);

/**
 * @api {post} /user/get-company Get company information
 * @apiVersion 4.8.0
 *
 * @apiName Get company information
 *
 * @apiGroup User
 *
 * @apiDescription This path retrieves information about a specific company.
 *
 * @apiPermission staff3
 *
 * @apiParam {String} companyId The id of the company to find information of.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_COMPANY
 *
 * @apiSuccess {Object} data Information about an company
 */
class GetCompanyByIdController extends Controller
{
    const PATH = '/get-company';
    const METHOD = 'POST';

    public function validations()
    {
        return [
            'permission' => 'staff_3',
            'requestData' => [
                'companyId' => [
                    'validation' => DataValidator::dataStoreId('company'),
                    'error' => ERRORS::INVALID_COMPANY
                ]
            ]
        ];
    }

    public function handler()
    {
        $companyId = Controller::request('companyId');
        $company = Company::getCompany($companyId);

        $users = User::find(' company_id = ? ', [$companyId]);

        $listUsers = [];
        $listTickets = [];

        foreach ($users as $user) {
            $listUsers [] = $user->toArray(true);
            array_push($listTickets, ...$user->sharedTicketList->toArray(true));
        }

        Response::respondSuccess([
            'company' => $company->toArray(),
            'users' => $listUsers,
            'tickets' => $listTickets
        ]);
    }
}
