import _has from 'lodash-es/has';
import {useCallback, useContext, useMemo} from 'react';
import * as React from 'react';
import _get from 'lodash-es/get';
import {useComponents, useSelector} from '@steroidsjs/core/hooks';
import {FormContext} from './Form';
import {mergeLayoutProp} from '@steroidsjs/core/utils/form';
import {FieldLayout} from '@steroidsjs/core/ui/form';
import useDispatch from '@steroidsjs/core/hooks/useDispatch';
import {formChange} from './actions/form';

const createDynamicField = (componentId, Component) => {
    const DynamicField = (props: any) => {
        const components = useComponents();

        // Get full name (attribute with prefix)
        const name = [props.prefix, props.attribute].filter(Boolean).join('.');

        // Get context, formId
        const context = useContext(FormContext);
        const formId = props.formId || context?.formId || null;
        const model = props.model || context?.model || null;

        // Register field
        components.ui.registerField(formId, name, componentId);

        // -------
        // ----------------------------------------
        // Resolve data provider
        const dispatch = useDispatch(); // eslint-disable-line react-hooks/rules-of-hooks
        const {value, error} = useSelector(state => ({
            error: _get(state, ['form', formId, 'errors', name]),
            value: _get(state, ['form', formId, 'values', name]),
        }));
        // ----------------------------------------
        // -------

        const setValue = useCallback(
            value => dispatch(formChange(formId, name, value)),
            [dispatch, formId, name],
        );

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
        const context = useContext(FormContext);
        const layout = useMemo(() => mergeLayoutProp(context.layout, props.layout), [context.layout, props.layout]);

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
