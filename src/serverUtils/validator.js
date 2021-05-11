const Joi = require('joi');

const configSchema = Joi.object({
    version: Joi.number().required(),
    defaultLanguage: Joi.string().default('cpp').required(),
    languages: Joi.object().pattern(
        /.*/,
        Joi.object({
            name: Joi.string().required(),
            isinterpreted: Joi.boolean().default(false).required(),
            fileName: Joi.string().min(3).required(),
            compile: Joi.string(),
            comments: Joi.string().min(1),
            run: Joi.object({
                win32: Joi.string().required(),
                unix: Joi.string().required()
            }),
            templates: Joi.array().items(
                Joi.object().keys({
                    name: Joi.string().required(),
                    isFromFile: Joi.boolean().required(),
                    content: Joi.string().required()
                })
            ),
            template: Joi.string().required(),
            templateId: Joi.number().default(-1).min(-1).required()
        })
    ),
    mountPoint: Joi.string().required()
});

exports.validateConfig = (config) => {
    const { error, value } = configSchema.validate(config);
    if (error) throw error;
    if (!Object.keys(value.languages).includes(value.defaultLanguage)) {
        throw new Error(
            'Default Language must be one of the given lang : ' +
                Object.keys(value.languages).join(', ')
        );
    }
    return value;
};
