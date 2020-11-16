<?php

namespace CustomValidations;

use Respect\Validation\Rules\AbstractRule;

class CheckLimit extends AbstractRule
{
    private $limitToCheck;

    public function __construct($limitToCheck = '')
    {
        if ($this->isLimitNameValid($limitToCheck)) {
            $this->limitToCheck = $limitToCheck;
        } else {
            throw new \Exception("Invalid limit : $limitToCheck");
        }
    }

    public function validate($dataStoreId)
    {
        $planLimit = \PlanLimit::findOne()->toArray();
        $passedLimit = false;

        switch ($this->limitToCheck) {
            case 'users':
                $passedLimit = \User::count() >= $planLimit['users'];
                break;
            case 'companies':
                // > because there is a default company
                $passedLimit = \Company::count() > $planLimit['companies'];
                break;
            case 'staff':
                // > because there is a default staff (system admin)
                $passedLimit = \Staff::count() > $planLimit['staff'];
                break;
            case 'departments':
                // > because there is a default department
                $passedLimit = \Department::count() > $planLimit['departments'];
                break;
        }

        return !$passedLimit;
    }

    private function isLimitNameValid($dataStoreName)
    {
        return in_array($dataStoreName, [
            'users',
            'companies',
            'staff',
            'departments'
        ]);
    }
}
