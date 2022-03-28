import { Alignment, Classes, Switch } from "@blueprintjs/core";
import { BlueprintControlTransform } from "constants/DefaultTheme";
import React from "react";
import styled from "styled-components";
import { ComponentProps } from "widgets/BaseComponent";
import { AlignWidget } from "widgets/constants";

export interface SwitchComponentProps extends ComponentProps {
  label: string;
  isSwitchedOn: boolean;
  onChange: (isSwitchedOn: boolean) => void;
  isLoading: boolean;
  alignWidget: AlignWidget;
  backgroundColor: string;
  inputRef?: (ref: HTMLInputElement | null) => any;
}

const SwitchComponentContainer = styled.div<{
  backgroundColor: string;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  &.${Alignment.RIGHT} {
    justify-content: flex-end;
  }
  ${BlueprintControlTransform}
`;

export const StyledSwitch = styled(Switch)<{
  backgroundColor: string;
}>`
  &.${Classes.CONTROL} {
    margin: 0;
  }

  &.${Classes.CONTROL} {
    & input:checked ~ .${Classes.CONTROL_INDICATOR} {
      background: ${({ backgroundColor }) => `${backgroundColor}`} !important;
      border: 1px solid ${({ backgroundColor }) => `${backgroundColor}`} !important;
    }
  }

  &.${Classes.SWITCH} {
    & input:not(:disabled):active:checked ~ .${Classes.CONTROL_INDICATOR} {
      background: ${({ backgroundColor }) => `${backgroundColor}`} !important;
    }
  }
`;

export function SwitchComponent({
  alignWidget,
  backgroundColor,
  inputRef,
  isDisabled,
  isLoading,
  isSwitchedOn,
  label,
  onChange,
}: SwitchComponentProps) {
  const switchAlignClass =
    alignWidget === "RIGHT" ? Alignment.RIGHT : Alignment.LEFT;

  return (
    <SwitchComponentContainer
      backgroundColor={backgroundColor}
      className={switchAlignClass}
    >
      <StyledSwitch
        alignIndicator={switchAlignClass}
        backgroundColor={backgroundColor}
        checked={isSwitchedOn}
        className={
          isLoading
            ? `${Classes.SKELETON} t--switch-widget-loading`
            : `${
                isSwitchedOn
                  ? "t--switch-widget-active"
                  : "t--switch-widget-inactive"
              }`
        }
        disabled={isDisabled}
        inputRef={inputRef}
        label={label}
        onChange={() => onChange(!isSwitchedOn)}
      />
    </SwitchComponentContainer>
  );
}
