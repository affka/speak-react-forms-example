import * as React from 'react';
import Field from './Field';
import InputField from './InputField';

export default function example() {
    return (
        <div>
            <Field
                attribute='name'
                component={InputField}
            />
            <InputField
                attribute='description'
            />
        </div>
    );
}