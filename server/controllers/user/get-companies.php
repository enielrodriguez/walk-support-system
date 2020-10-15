<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /user/get-companies Get companies
 * @apiVersion 4.8.0
 *
 * @apiName Get companies
 *
 * @apiGroup User
 *
 * @apiDescription This path returns all the companies.
 *
 * @apiPermission staff3
 *
 * @apiUse NO_PERMISSION
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class GetCompaniesController extends Controller {
    const PATH = '/get-companies';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => []
        ];
    }

    public function handler() {
        $companies = $this->getCompanyList();

        Response::respondSuccess([
            'companies' => $companies->toArray(),
            'pages' => $this->getPagesQuantity(),
            'page' => Controller::request('page'),
            'orderBy' => Controller::request('orderBy'),
            'desc' => Controller::request('desc'),
            'search' => Controller::request('search')
        ]);
    }

    private function getCompanyList()
    {
        $query = $this->getSearchQuery();

        return Company::find($query, [
            '%' . Controller::request('search') . '%',
            '%' . Controller::request('search') . '%',
            Controller::request('search') . '%',
            Controller::request('search') . '%'
        ]);
    }

    private function getPagesQuantity()
    {
        $query = '';

        if (Controller::request('search')) {
            $query .= " (business_name LIKE ? OR nit LIKE ? )";
        }

        $companiesQuantity = Company::count($query, [
            '%' . Controller::request('search') . '%',
            '%' . Controller::request('search') . '%'
        ]);

        return ceil($companiesQuantity / 10);
    }

    private function getSearchQuery()
    {
        $query = '';

        if (Controller::request('search')) {
            $query .= " (business_name LIKE ? OR nit LIKE ? )";
            $query .= " ORDER BY CASE WHEN (business_name LIKE ? OR nit LIKE ?)";
            $query .= " THEN 1 ELSE 2 END ASC,";
        } else {
            $query .= " ORDER BY ";
        }

        $query .= $this->getOrderAndLimit();

        return $query;
    }

    private function getOrderAndLimit()
    {
        $query = '';

        if (Controller::request('orderBy') === 'business_name') {
            $query .= 'business_name';
        } else {
            $query .= 'id';
        }

        if (Controller::request('desc')) {
            $query .= ' desc';
        } else {
            $query .= ' asc';
        }
        $query .= " LIMIT 10 OFFSET " . ((Controller::request('page') - 1) * 10);

        return $query;
    }
}
