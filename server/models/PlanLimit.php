<?php

/**
 * @api {OBJECT} PlanLimit PlanLimit
 * @apiVersion 4.8.0
 * @apiGroup Data Structures
 * @apiParam {Number}  name The name of the tag.
 * @apiParam {Object}  color The color of the tag.
 */
class PlanLimit extends DataStore
{
    const TABLE = 'plan_limit';

    public static function getProps()
    {
        return [
            'users',
            'company'
        ];
    }

    public function toArray($minimized = false)
    {
        if ($minimized) {
            return $this->company;
        }

        return [
            'id' => $this->id,
            'users' => $this->users,
            'company' => $this->companyToArray()
        ];
    }

    public function companyToArray()
    {
        $company = $this->company;

        if ($company && !$company->isNull()) {
            return [
                'id' => $company->id,
                'business_name' => $company->business_name,
                'nit' => $company->nit
            ];
        }

        return null;
    }
}
