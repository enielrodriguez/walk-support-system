import Validator from 'lib-app/validations/validator';

class NotSignedIntValidator extends Validator {
    constructor(errorKey = 'INVALID_VALUE', validator = null) {
        super(validator);

        this.errorKey = errorKey;
    }

    validate(value, form) {
        if (value === '' || Number.isNaN(+value) || +value < 0) return this.getError(this.errorKey);
    }
}

export default NotSignedIntValidator;
