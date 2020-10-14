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

class AddCompanyController extends Controller {
    const PATH = '/add-company';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => [
                'business_name' => [
                    'validation' => DataValidator::notBlank()->length(2, 100),
                    'error' => ERRORS::INVALID_NAME
                ],'nit' => [
                    'validation' => DataValidator::notBlank()->length(2, 100),
                    'error' => ERRORS::INVALID_NIT
                ],'phone' => [
                    'validation' => DataValidator::notBlank()->length(6, 100),
                    'error' => ERRORS::INVALID_PHONE
                ],'contact_name' => [
                    'validation' => DataValidator::notBlank()->length(5, 100),
                    'error' => ERRORS::INVALID_CONTACT_NAME
                ],
            ]
        ];
    }

    public function handler() {

        $business_name = Controller::request('business_name');
        $nit = Controller::request('nit');
        $phone = Controller::request('phone');
        $contact_name = Controller::request('contact_name');


        if (!Company::getDataStore($nit, 'nit')->isNull()) {
            throw new RequestException(ERRORS::COMPANY_EXISTS);
        }

        $companyInstance = new Company();

        $companyInstance->setProperties([
            'business_name' => $business_name,
            'nit' => $nit,
            'phone' => $phone,
            'contact_name' => $contact_name
        ]);

        $companyInstance->store();

        Response::respondSuccess();
    }
}
