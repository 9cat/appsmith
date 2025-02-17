import React, { useCallback, useContext, useMemo, useState } from "react";
import styled from "styled-components";
import {
  DefaultValueType,
  LabelValueType,
} from "rc-select/lib/interface/generator";
import { useController } from "react-hook-form";
import { isNil } from "lodash";

import Field from "../component/Field";
import FormContext from "../FormContext";
import MultiSelect from "widgets/MultiSelectWidgetV2/component";
import useEvents from "./useBlurAndFocusEvents";
import useRegisterFieldValidity from "./useRegisterFieldValidity";
import useUpdateInternalMetaState from "./useUpdateInternalMetaState";
import { Layers } from "constants/Layers";
import {
  BaseFieldComponentProps,
  FieldComponentBaseProps,
  FieldEventProps,
} from "../constants";
import { DropdownOption } from "widgets/MultiSelectTreeWidget/widget";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { isPrimitive, validateOptions } from "../helper";

type MultiSelectComponentProps = FieldComponentBaseProps &
  FieldEventProps & {
    allowSelectAll?: boolean;
    defaultValue?: string[];
    isFilterable: boolean;
    onFilterChange?: string;
    onFilterUpdate?: string;
    onOptionChange?: string;
    options: DropdownOption[];
    placeholderText?: string;
    serverSideFiltering: boolean;
  };

export type MultiSelectFieldProps = BaseFieldComponentProps<
  MultiSelectComponentProps
>;

const COMPONENT_DEFAULT_VALUES: MultiSelectComponentProps = {
  isDisabled: false,
  isFilterable: false,
  isRequired: false,
  isVisible: true,
  label: "",
  serverSideFiltering: false,
  options: [
    { label: "Blue", value: "BLUE" },
    { label: "Green", value: "GREEN" },
    { label: "Red", value: "RED" },
  ],
};

const StyledMultiSelectWrapper = styled.div`
  width: 100%;
`;

const isValid = (
  schemaItem: MultiSelectFieldProps["schemaItem"],
  value: unknown[],
) => !schemaItem.isRequired || Boolean(value.length);

const DEFAULT_DROPDOWN_STYLES = {
  zIndex: Layers.dropdownModalWidget,
};

const fieldValuesToComponentValues = (
  values: LabelValueType["value"][],
  options: LabelValueType[] = [],
) => {
  return values.map((value) => {
    const option = options.find((option) => option.value === value);

    return option ? option : { value, label: value };
  });
};

const componentValuesToFieldValues = (componentValues: LabelValueType[] = []) =>
  componentValues.map(({ value }) => value);

function MultiSelectField({
  fieldClassName,
  name,
  passedDefaultValue,
  schemaItem,
}: MultiSelectFieldProps) {
  const {
    fieldType,
    isRequired,
    onBlur: onBlurDynamicString,
    onFocus: onFocusDynamicString,
  } = schemaItem;
  const { executeAction, updateWidgetMetaProperty } = useContext(FormContext);
  const [filterText, setFilterText] = useState<string>();

  const {
    field: { onBlur, onChange, value },
    fieldState: { isDirty },
  } = useController({
    name,
  });

  const inputValue: LabelValueType["value"][] =
    (Array.isArray(value) && value) || [];

  const { onBlurHandler, onFocusHandler } = useEvents<HTMLInputElement>({
    fieldBlurHandler: onBlur,
    onFocusDynamicString,
    onBlurDynamicString,
  });

  const isValueValid = isValid(schemaItem, inputValue);

  useRegisterFieldValidity({
    isValid: isValueValid,
    fieldName: name,
    fieldType,
  });

  useUpdateInternalMetaState({
    propertyName: `${name}.filterText`,
    propertyValue: filterText,
  });

  const fieldDefaultValue = useMemo(() => {
    const values: LabelValueType["value"][] | LabelValueType[] = (() => {
      if (!isNil(passedDefaultValue) && validateOptions(passedDefaultValue)) {
        return passedDefaultValue;
      }

      if (
        !isNil(schemaItem.defaultValue) &&
        validateOptions(schemaItem.defaultValue)
      ) {
        return schemaItem.defaultValue;
      }

      return [];
    })();

    if (values.length && isPrimitive(values[0])) {
      return values as LabelValueType["value"][];
    } else {
      return componentValuesToFieldValues(values as LabelValueType[]);
    }
  }, [schemaItem.defaultValue, passedDefaultValue]);

  const componentValues = fieldValuesToComponentValues(
    inputValue,
    schemaItem.options,
  );

  const onFilterChange = useCallback(
    (value: string) => {
      setFilterText(value);

      if (schemaItem.onFilterUpdate) {
        executeAction({
          triggerPropertyName: "onFilterUpdate",
          dynamicString: schemaItem.onFilterUpdate,
          event: {
            type: EventType.ON_FILTER_UPDATE,
          },
        });
      }
    },
    [updateWidgetMetaProperty, executeAction, schemaItem.onFilterUpdate],
  );

  const onOptionChange = useCallback(
    (values: DefaultValueType) => {
      onChange(componentValuesToFieldValues(values as LabelValueType[]));

      if (schemaItem.onOptionChange && executeAction) {
        executeAction({
          triggerPropertyName: "onOptionChange",
          dynamicString: schemaItem.onOptionChange,
          event: {
            type: EventType.ON_OPTION_CHANGE,
          },
        });
      }
    },
    [executeAction, schemaItem.onOptionChange],
  );

  const fieldComponent = useMemo(() => {
    return (
      <StyledMultiSelectWrapper>
        <MultiSelect
          allowSelectAll={schemaItem.allowSelectAll}
          compactMode={false}
          disabled={schemaItem.isDisabled}
          dropDownWidth={90}
          dropdownStyle={DEFAULT_DROPDOWN_STYLES}
          filterText={filterText}
          isFilterable={schemaItem.isFilterable}
          isValid={isDirty ? isValueValid : true}
          loading={false}
          onBlur={onBlurHandler}
          onChange={onOptionChange}
          onFilterChange={onFilterChange}
          onFocus={onFocusHandler}
          options={schemaItem.options || []}
          placeholder={schemaItem.placeholderText || ""}
          serverSideFiltering={schemaItem.serverSideFiltering}
          value={componentValues}
          widgetId={name}
          width={100}
        />
      </StyledMultiSelectWrapper>
    );
  }, [
    componentValues,
    filterText,
    isDirty,
    isValueValid,
    name,
    onBlurHandler,
    onFilterChange,
    onFocusHandler,
    onOptionChange,
    schemaItem.allowSelectAll,
    schemaItem.isDisabled,
    schemaItem.isFilterable,
    schemaItem.options,
    schemaItem.placeholderText,
    schemaItem.serverSideFiltering,
  ]);

  return (
    <Field
      accessor={schemaItem.accessor}
      defaultValue={fieldDefaultValue}
      fieldClassName={fieldClassName}
      isRequiredField={isRequired}
      label={schemaItem.label}
      labelStyle={schemaItem.labelStyle}
      labelTextColor={schemaItem.labelTextColor}
      labelTextSize={schemaItem.labelTextSize}
      name={name}
      tooltip={schemaItem.tooltip}
    >
      {fieldComponent}
    </Field>
  );
}

MultiSelectField.componentDefaultValues = COMPONENT_DEFAULT_VALUES;

export default MultiSelectField;
