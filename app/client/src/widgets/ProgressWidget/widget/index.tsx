import React from "react";

import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { DerivedPropertiesMap } from "utils/WidgetFactory";

import ProgressComponent from "../component";
import { ProgressType, ProgressVariant } from "../constants";
import { ValidationTypes } from "constants/WidgetValidation";
import { Colors } from "constants/Colors";

class ProgressWidget extends BaseWidget<ProgressWidgetProps, WidgetState> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "General",
        children: [
          {
            helpText:
              "Determines if progress indicator will be determinate or not",
            propertyName: "isIndeterminate",
            label: "Infinite Loading",
            controlType: "SWITCH",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            helpText: "Determines the shape of the progress indicator",
            propertyName: "progressType",
            label: "Type",
            controlType: "DROP_DOWN",
            options: [
              {
                label: "Circular",
                value: ProgressType.CIRCULAR,
              },
              {
                label: "Linear",
                value: ProgressType.LINEAR,
              },
            ],
            defaultValue: ProgressType.LINEAR,
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            helpText: "Sets the value of the progress indicator",
            propertyName: "value",
            label: "Progress",
            controlType: "INPUT_TEXT",
            placeholderText: "Enter progress value",
            isBindProperty: true,
            isTriggerProperty: false,
            isJSConvertible: true,
            defaultValue: 50,
            validation: {
              type: ValidationTypes.NUMBER,
              params: { min: 0, max: 100, default: 50 },
            },
            hidden: (props: ProgressWidgetProps) => props.isIndeterminate,
            dependencies: ["isIndeterminate"],
          },
          {
            helpText: "Sets the number of steps",
            propertyName: "steps",
            label: "Number of steps",
            controlType: "INPUT_TEXT",
            placeholderText: "Enter number of steps",
            isBindProperty: true,
            isTriggerProperty: false,
            isJSConvertible: true,
            validation: {
              type: ValidationTypes.NUMBER,
              params: { min: 1, max: 100, default: 1, natural: true },
            },
            hidden: (props: ProgressWidgetProps) => props.isIndeterminate,
            dependencies: ["isIndeterminate"],
          },
          {
            propertyName: "counterClockwise",
            helpText: "Whether to rotate in counterclockwise direction",
            label: "Counterclockwise",
            controlType: "SWITCH",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
            hidden: (props: ProgressWidgetProps) =>
              props.progressType === ProgressType.LINEAR ||
              props.isIndeterminate,
            dependencies: ["isIndeterminate", "progressType"],
          },
          {
            helpText:
              "Controls the visibility with the value of progress indicator",
            propertyName: "showResult",
            label: "Show Result",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
            hidden: (props: ProgressWidgetProps) => props.isIndeterminate,
            dependencies: ["isIndeterminate"],
          },
          {
            helpText: "Controls the visibility of the widget",
            propertyName: "isVisible",
            label: "Visible",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
        ],
      },
      {
        sectionName: "Styles",
        children: [
          {
            helpText: "Sets the color of the progress indicator",
            propertyName: "fillColor",
            label: "Fill Color",
            controlType: "COLOR_PICKER",
            defaultColor: Colors.GREEN,
            isBindProperty: true,
            isJSConvertible: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                regex: /^(?![<|{{]).+/,
              },
            },
          },
        ],
      },
    ];
  }

  static getDerivedPropertiesMap(): DerivedPropertiesMap {
    return {};
  }

  static getDefaultPropertiesMap(): Record<string, string> {
    return {};
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {};
  }

  getPageView() {
    const {
      counterClockwise,
      fillColor,
      isIndeterminate,
      progressType,
      showResult,
      steps,
      value,
    } = this.props;
    const { componentHeight, componentWidth } = this.getComponentDimensions();
    const isScaleY = componentHeight > componentWidth;

    return (
      <ProgressComponent
        counterClockwise={counterClockwise}
        fillColor={fillColor}
        isScaleY={isScaleY}
        showResult={showResult}
        steps={steps}
        type={progressType}
        value={value}
        variant={
          isIndeterminate
            ? ProgressVariant.INDETERMINATE
            : ProgressVariant.DETERMINATE
        }
      />
    );
  }

  static getWidgetType(): string {
    return "PROGRESS_WIDGET";
  }
}

export interface ProgressWidgetProps extends WidgetProps {
  isIndeterminate: boolean;
  progressType: ProgressType;
  value: number;
  steps: number;
  showResult: boolean;
  counterClockwise: boolean;
  fillColor: string;
}

export default ProgressWidget;
