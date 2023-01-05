class Optional {
    constructor(value) {
        this.value = value;
    }

    static of(value) {
        return new Optional(value);
    }

    map(optionalFunction) {
        if (this.value !== undefined && this.value !== null && this.value !== "") {
            return Optional.of(optionalFunction(this.value));
        }
        return this;
    }

    else(elseValue) {
        if (this.value !== undefined && this.value !== null && this.value !== "") {
            return this.value;
        }
        return elseValue;
    }
}