import * as React from 'react';
import { useMemo} from 'react';
import fieldWrapper from './fieldWrapper';
import {useComponents} from '@steroidsjs/core/hooks';


function InputField(props: any) {
    const components = useComponents();

    const inputProps = useMemo(() => ({
        type: props.type,
        name: props.input.name,
        value: props.input.value || '',
        onChange: value => props.input.onChange(value),
        ...props.inputProps,
    }), []);

    return <input qwe={inputProps} />;
    /*return components.ui.renderView(props.view || 'form.InputFieldView', {
        ...props,
        inputProps,
    });*/
}

export default fieldWrapper('InputField', InputField);
