<?php

/**
 * @api {OBJECT} PlanLimit PlanLimit
 * @apiVersion 4.8.0
 * @apiGroup Data Structures
 */
class PlanLimit extends DataStore
{
    const TABLE = 'plan_limit';

    public static function getProps()
    {
        return [
            'users',
            'companies'
        ];
    }

    public function toArray()
    {
        return [
            'users' => $this->users,
            'companies' => $this->companies
        ];
    }
}
