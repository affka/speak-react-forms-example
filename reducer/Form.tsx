import * as React from 'react';
import {useCallback, useReducer} from 'react';
import {formInitialize, formSetErrors} from '@steroidsjs/core/actions/form';
import {useComponents} from '@steroidsjs/core/hooks';
import {reducerItem} from 'reducers/form';

export const FormContext = React.createContext<any>({});

// -------
// ----------------------------------------
export const FormReducerContext = React.createContext<[any, React.Dispatch<any>]>(null);
// ----------------------------------------
// -------

export default function Form(props: any) {
    // Form ID
    const formId = props.formId;

    // -------
    // ----------------------------------------
    // Init
    const initialState = reducerItem({}, formInitialize(formId, props.initialValues));
    const reducer = useReducer(reducerItem, initialState);
    const [state, dispatch] = reducer;

    // Get state
    const {values, isInvalid, isSubmitting} = state;
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

    const components = useComponents();
    const content = (
        <FormContext.Provider
            value={{
                formId: props.formId,
                model: props.model,
                prefix: props.prefix,
                layout: props.layout,
                globalState: props.globalState,
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

    // Render context and form
    // -------
    // ----------------------------------------
    return (
        <FormReducerContext.Provider value={reducer}>
            {content}
        </FormReducerContext.Provider>
    );
    // ----------------------------------------
    // -------
}
