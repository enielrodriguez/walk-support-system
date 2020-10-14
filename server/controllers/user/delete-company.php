<?php

use Respect\Validation\Validator as DataValidator;
use RedBeanPHP\Facade as RedBean;

DataValidator::with('CustomValidations', true);

/**
 * @api {post} /user/delete-company Remove tag
 * @apiVersion 4.8.0
 *
 * @apiName Delete company
 *
 * @apiGroup User
 *
 * @apiDescription This path deletes a company.
 *
 * @apiPermission staff_3
 *
 * @apiParam {Number} companyId The id of the company to delete.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_COMPANY
 *
 * @apiSuccess {Object} data Empty object
 *ulp d
 */
class DeleteCompanyController extends Controller
{
    const PATH = '/delete-company';
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
        $company = Company::getCompany(Controller::request('companyId'));

        Log::createLog('DELETE_COMPANY', $company->nit);

        $this->deleteUsers($company);

        $company->delete();

        Response::respondSuccess();
    }


    private function deleteUsers($company)
    {

        $users = User::find(' company_id = ? ', [$company->id]);

        foreach ($users as $user) {
            Log::createLog('DELETE_USER', $user->name);
            RedBean::exec('DELETE FROM log WHERE author_user_id = ?', [$user->id]);

            foreach ($user->sharedTicketList as $ticket) {
                $ticket->delete();
            }

            $user->delete();
        }
    }
}
