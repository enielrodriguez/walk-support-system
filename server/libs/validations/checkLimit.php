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

    public function validate($value)
    {
        // Useful in cases in which it is not mandatory to create an
        // entity that is subject to limits.
        // Eg. admin (a user, which is subject to plan limits) in add-company
        // is not required.
        if (!$value) {
            return true;
        }

        $planLimit = \PlanLimit::findOne();
        if ($planLimit->isNull()) {
            return true;
        }

        $planLimit = $planLimit->toArray();
        $itsUnlimited = (int)$planLimit[$this->limitToCheck] === 0;

        if (!$itsUnlimited) {
            switch ($this->limitToCheck) {
                case 'users':
                    $itsUnlimited = \User::count() < $planLimit['users'];
                    break;
                case 'companies':
                    // <= because there is a default company (required to add users without defining a company)
                    $itsUnlimited = \Company::count() <= $planLimit['companies'];
                    break;
                case 'staff':
                    // <= because there is a default staff (system admin)
                    $itsUnlimited = \Staff::count() <= $planLimit['staff'];
                    break;
                case 'departments':
                    // there is a default department but it can be edited and deleted
                    $itsUnlimited = \Department::count() < $planLimit['departments'];
                    break;
            }
        }

        return $itsUnlimited;
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
