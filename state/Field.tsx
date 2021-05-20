import * as React from 'react';
import {useContext} from 'react';
import _isString from 'lodash-es/isString';
import _isFunction from 'lodash-es/isFunction';

import {useComponents} from '@steroidsjs/core/hooks';

export default function Field(props: any) {
    const components = useComponents();

    // Get model
    const model = props.model;

    // Get component
    const component = props.component
        || components.ui.getModel(model)?.fields?.[props.attribute]?.component
        || 'InputField';
    const ComponentField = _isString(component)
        ? components.ui.getField(`form.${component}`)
        : component;

    // Render
    return _isFunction(ComponentField)
        ? ComponentField(props)
        : <ComponentField {...props} />;
}
