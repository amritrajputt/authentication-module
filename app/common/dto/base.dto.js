class BaseDto {
    static schema = Joi.object({})
    static validate(data) {
        const { error, value } = this.schema.validate(data, { abortEarly: false, allowUnknown: true, stripUnknown: true })
        if (error) {
            const error = error.details.map((detail) => detail.message).join(", ")
            return { data: null, error }
        }
        return { data: value, error: null }
    }
}
export default BaseDto