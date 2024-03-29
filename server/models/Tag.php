<?php
/**
 * @api {OBJECT} Tag Tag
 * @apiVersion 4.8.0
 * @apiGroup Data Structures
 * @apiParam {String}  name The name of the tag.
 * @apiParam {String}  color The color of the tag.
 */
class Tag extends DataStore {
    const TABLE = 'tag';

    public static function getProps() {
        return [
            'name',
            'color'
        ];
    }

    public function toArray($minimized = false) {
        if($minimized){
            return $this->name;
        }

        return [
            'id'=> $this->id,
            'name'=> $this->name,
            'color' => $this->color
        ];
    }
}
