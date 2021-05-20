import * as React from 'react';
import {useSelector} from 'react-redux';
import _get from 'lodash-es/get';
import {useCallback} from 'react';
import {useEffectOnce} from 'react-use';
import {formInitialize, formSetErrors} from '@steroidsjs/core/actions/form';
import useDispatch from '@steroidsjs/core/hooks/useDispatch';
import {useComponents} from '@steroidsjs/core/hooks';

export const FormContext = React.createContext<any>({});

export default function Form(props: any) {
    // Form ID
    const formId = props.formId;

    // -------
    // ----------------------------------------
    // Init
    const dispatch = useDispatch();
    useEffectOnce(() => {
        dispatch(formInitialize(formId, props.initialValues));
    });

    // Get state
    const {values, isInvalid, isSubmitting} = useSelector(state => _get(state, ['form', formId]));
    // ----------------------------------------
    // -------

    // Errors setter
    const setErrors = useCallback(
        errors => dispatch(formSetErrors(formId, errors)),
        [dispatch, formId],
    );

    // OnSubmit handler
    const onSubmit = useCallback(async () => {
        // Http request...
    }, []);

    // Render context and form
    const components = useComponents();
    const content = (
        <FormContext.Provider
            value={{
                formId: props.formId,
                model: props.model,
                prefix: props.prefix,
                layout: props.layout,
            }}
        >
            {components.ui.renderView(props.view || 'form.FormView', {
                isInvalid,
                isSubmitting,
                onSubmit,
                children: props.children,
            })}
        </FormContext.Provider>
    );

    return content;
}
