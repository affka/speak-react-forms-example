import * as React from 'react';
import Form from './Form';
import Field from './Field';
import InputField from './InputField';

export default function example() {
    return (
        <Form
            formId='foo'
            initialValues={{
                name: 'Hello',
            }}
        >
            <Field
                attribute='name'
                component={InputField}
            />
            <InputField
                attribute='description'

            />
        </Form>
    );
}