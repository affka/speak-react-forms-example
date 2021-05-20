import _has from 'lodash-es/has';
import {useMemo, useState} from 'react';
import * as React from 'react';
import {useComponents} from '@steroidsjs/core/hooks';
import {FieldLayout} from '@steroidsjs/core/ui/form';
import {reducerItem} from './reducers/form';
import {formInitialize} from './actions/form';

const createDynamicField = (componentId, Component) => {
    const DynamicField = (props: any) => {
        const components = useComponents();

        // Get full name (attribute with prefix)
        const name = [props.prefix, props.attribute].filter(Boolean).join('.');

        // Get formId
        const formId = props.formId || null;
        const model = props.model || null;

        // -------
        // ----------------------------------------
        // Resolve data provider
        const initialState = reducerItem({}, formInitialize(null, props.value));
        const [value, setValue] = useState(initialState);
        const error = props.error;
        // ----------------------------------------
        // -------

        // Input object
        const input = useMemo(() => ({
            name,
            value,
            onChange: setValue,
        }), [name, setValue, value]);

        // Result wrapper props
        const wrapperProps = {
            componentId,
            formId,
            error,
            input,
        };

        return components.ui.renderView(Component, {
            ...props,
            ...components.ui.getFieldProps(componentId, model, props.attribute),
            ...wrapperProps,
        });
    };
    DynamicField.displayName = componentId;
    return DynamicField;
};

// Field Wrapper
export default function fieldWrapper<T extends any>(componentId, Component: T, options: any = {}) {
    return (props): T | any => {
        // Get UI props and create Field Class dynamically (for add field props - input, error, model, ...)
        const metaProps = useComponents().ui.getFieldProps(componentId, props.model, props.attribute);
        const DynamicField = createDynamicField(componentId, Component);

        // Resolve layout
        // -------
        // ----------------------------------------
        const layout = props.layout;
        // ----------------------------------------
        // -------

        if (layout) {
            return (
                <FieldLayout
                    {...layout}
                    required={_has(props, 'required') ? props.required : metaProps.required}
                    label={options.label === false ? null : (_has(props, 'label') ? props.label : metaProps.label)}
                    hint={_has(props, 'hint') ? props.hint : metaProps.hint}
                    error={props.error}
                >
                    <DynamicField {...props} />
                </FieldLayout>
            );
        }

        return (
            <DynamicField {...props} />
        );
    };
}
