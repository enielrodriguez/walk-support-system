<?php

use RedBeanPHP\Facade as RedBean;
use Respect\Validation\Validator as DataValidator;

DataValidator::with('CustomValidations', true);

/**
 * @api {post} /system/init-plan Init plan limits
 * @apiVersion 4.8.0
 *
 * @apiName Init plan limits
 *
 * @apiGroup System
 *
 * @apiDescription This path sets the plan limits. It can only be used once during installation.
 *
 * @apiPermission any
 *
 *
 * @apiSuccess {Object} data Empty object
 *
 */
class InitPlanController extends Controller
{
    const PATH = '/init-plan';
    const METHOD = 'POST';

    public function validations()
    {
        return [
            'permission' => 'installer',
            'requestData' => [
                'users' => [
                    'validation' => [
                        [
                            'validation' => DataValidator::intVal()->min(0),
                            'error' => ERRORS::INVALID_LIMIT
                        ],
                        [
                            'validation' => DataValidator::checkLimit('users'),
                            'error' => ERRORS::USERS_LIMIT_REACHED
                        ]
                    ]
                ],
                'companies' => [
                    'validation' => [
                        [
                            'validation' => DataValidator::intVal()->min(0),
                            'error' => ERRORS::INVALID_LIMIT
                        ],
                        [
                            'validation' => DataValidator::checkLimit('companies'),
                            'error' => ERRORS::COMPANIES_LIMIT_REACHED
                        ]
                    ]
                ],
                'staff' => [
                    'validation' => [
                        [
                            'validation' => DataValidator::intVal()->min(0),
                            'error' => ERRORS::INVALID_LIMIT
                        ],
                        [
                            'validation' => DataValidator::checkLimit('staff'),
                            'error' => ERRORS::STAFF_LIMIT_REACHED
                        ]
                    ]
                ],
                'departments' => [
                    'validation' => [
                        [
                            'validation' => DataValidator::intVal()->min(0),
                            'error' => ERRORS::INVALID_LIMIT
                        ],
                        [
                            'validation' => DataValidator::checkLimit('departments'),
                            'error' => ERRORS::DEPARTMENTS_LIMIT_REACHED
                        ]
                    ]
                ]
            ]
        ];
    }

    public function handler()
    {
        $this->storePlanLimit();
        Response::respondSuccess();
    }

    private function storePlanLimit()
    {
        $this->validateUsersLimit();

        RedBean::wipe('planlimit');
        $plan = new PlanLimit();
        $plan->setProperties([
            'users' => Controller::request('users'),
            'companies' => Controller::request('companies'),
            'staff' => Controller::request('staff'),
            'departments' => Controller::request('departments')
        ]);

        $plan->store();
    }

    private function validateUsersLimit()
    {
        $usersLimit = Controller::request('users');
        if ($usersLimit > 0) {
            $usersInCompaniesWithoutLimit = (int)RedBean::getCell('SELECT COUNT(u.id) FROM `user` u INNER JOIN company c  ON u.company_id = c.id WHERE c.users_limit = 0 ');
            $companiesLimit = (int)Company::getCell('SELECT SUM(users_limit) FROM company');
            $minimumLimit = $usersInCompaniesWithoutLimit + $companiesLimit;

            if ($usersLimit < $minimumLimit) {
                throw new ValidationException(ERRORS::USERS_LIMIT_REACHED);
            }
        }
    }
}
