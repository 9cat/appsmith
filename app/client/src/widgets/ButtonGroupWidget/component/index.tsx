import React from "react";
import { sortBy, uniqueId } from "lodash";
import {
  Alignment,
  Icon,
  Menu,
  MenuItem,
  Classes as CoreClass,
} from "@blueprintjs/core";
import { Classes, Popover2 } from "@blueprintjs/popover2";
import { IconName } from "@blueprintjs/icons";
import tinycolor from "tinycolor2";
import { darkenActive, darkenHover } from "constants/DefaultTheme";
import {
  ButtonStyleType,
  ButtonVariant,
  ButtonVariantTypes,
  ButtonPlacement,
} from "components/constants";
import { ThemeProp } from "components/ads/common";
import styled, { createGlobalStyle } from "styled-components";
import { Colors } from "constants/Colors";
import {
  getCustomBackgroundColor,
  getCustomBorderColor,
  getCustomTextColor,
  getCustomJustifyContent,
  WidgetContainerDiff,
} from "widgets/WidgetUtils";
import { RenderMode } from "constants/WidgetConstants";
import { DragContainer } from "widgets/ButtonWidget/component/DragContainer";
import { buttonHoverActiveStyles } from "../../ButtonWidget/component/utils";

interface WrapperStyleProps {
  isHorizontal: boolean;
  borderRadius?: string;
  boxShadow?: string;
  buttonVariant: ButtonVariant;
}

const ButtonGroupWrapper = styled.div<ThemeProp & WrapperStyleProps>`
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: stretch;
  align-items: stretch;
  overflow: hidden;
  cursor: not-allowed;
  gap: ${({ buttonVariant }) =>
    `${buttonVariant === ButtonVariantTypes.PRIMARY ? "1px" : "0px"}`};

  ${(props) =>
    props.isHorizontal ? "flex-direction: row" : "flex-direction: column"};
  box-shadow: ${({ boxShadow }) => boxShadow};
  border-radius: ${({ borderRadius }) => borderRadius};

  & > *:first-child,
  & > *:first-child button {
    border-radius: ${({ borderRadius, isHorizontal }) =>
      isHorizontal
        ? `${borderRadius} 0px 0px ${borderRadius}`
        : `${borderRadius} ${borderRadius} 0px 0px`};
  }

  & > *:last-child,
  & > *:last-child button {
    border-radius: ${({ borderRadius, isHorizontal }) =>
      isHorizontal
        ? `0px ${borderRadius} ${borderRadius} 0`
        : `0px 0px ${borderRadius} ${borderRadius}`};
  }
`;

const MenuButtonWrapper = styled.div`
  flex: 1 1 auto;

  & > .${Classes.POPOVER2_TARGET} > button {
    width: 100%;
    height: 100%;
  }

  & > .${Classes.POPOVER2_TARGET} {
    height: 100%;
  }
`;

const PopoverStyles = createGlobalStyle<{
  parentWidth: number;
  menuDropDownWidth: number;
  id: string;
  borderRadius?: string;
}>`
  .button-group-menu-popover, .button-group-menu-popover.${Classes.POPOVER2} {
      background: none;
      box-shadow: 0 6px 20px 0px rgba(0, 0, 0, 0.15) !important;
      margin-top: 8px !important;
      border-radius: ${({ borderRadius }) =>
        borderRadius === "1.5rem" ? `0.375rem` : borderRadius};
      box-shadow: none;
      overflow: hidden;
    }

.button-group-menu-popover > .${Classes.POPOVER2_CONTENT} {
    background: none;
  }
  ${({ id, menuDropDownWidth, parentWidth }) => `
  .menu-button-width-${id} {

    max-width: ${
      menuDropDownWidth > parentWidth
        ? `${menuDropDownWidth}px`
        : `${parentWidth}px`
    } !important;
    min-width: ${
      parentWidth > menuDropDownWidth ? parentWidth : menuDropDownWidth
    }px !important;
  }
`}
`;

interface ButtonStyleProps {
  isHorizontal: boolean;
  borderRadius?: string;
  buttonVariant?: ButtonVariant; // solid | outline | ghost
  buttonColor?: string;
  iconAlign?: string;
  placement?: ButtonPlacement;
  isLabel: boolean;
}

/*
  Don't use buttonHoverActiveStyles in a nested function it won't work -

  const buttonHoverActiveStyles = css ``

  const Button = styled.button`
  // won't work
    ${({ buttonColor, theme }) => {
      &:hover, &:active {
        ${buttonHoverActiveStyles}
      }
    }}

  // will work
  &:hover, &:active {
    ${buttonHoverActiveStyles}
  }`
*/

const StyledButton = styled.button<ThemeProp & ButtonStyleProps>`
  flex: 1 1 auto;
  display: flex;
  justify-content: stretch;
  align-items: center;
  padding: 0px 10px;

  &:hover,
  &:active {
    ${buttonHoverActiveStyles}
  }

  ${({ buttonColor, buttonVariant, iconAlign, isLabel, theme }) => `
    & {
      background: ${
        getCustomBackgroundColor(buttonVariant, buttonColor) !== "none"
          ? getCustomBackgroundColor(buttonVariant, buttonColor)
          : buttonVariant === ButtonVariantTypes.PRIMARY
          ? theme.colors.button.primary.primary.bgColor
          : "none"
      } !important;
      flex-direction : ${iconAlign === "right" ? "row-reverse" : "row"};
      .bp3-icon {
        ${
          isLabel
            ? iconAlign === "right"
              ? "margin-left: 10px"
              : "margin-right: 10px"
            : ""
        };
      }
    }


    border: ${
      getCustomBorderColor(buttonVariant, buttonColor) !== "none"
        ? `1px solid ${getCustomBorderColor(buttonVariant, buttonColor)}`
        : buttonVariant === ButtonVariantTypes.SECONDARY
        ? `1px solid ${theme.colors.button.primary.secondary.borderColor}`
        : "none"
    } ${buttonVariant === ButtonVariantTypes.PRIMARY ? "" : "!important"};

    & span {
      color: ${
        buttonVariant === ButtonVariantTypes.PRIMARY
          ? getCustomTextColor(theme, buttonColor)
          : getCustomBackgroundColor(ButtonVariantTypes.PRIMARY, buttonColor)
      } !important;
    }


    &:disabled {
      cursor: not-allowed;
      border: 1px solid ${Colors.ALTO2} !important;
      background: ${theme.colors.button.disabled.bgColor} !important;
      span {
        color: ${theme.colors.button.disabled.textColor} !important;
      }
    }

  `}
`;

const StyledButtonContent = styled.div<{
  iconAlign: string;
  placement?: ButtonPlacement;
}>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: ${({ placement }) => getCustomJustifyContent(placement)};
  flex-direction: ${({ iconAlign }) =>
    iconAlign === Alignment.RIGHT ? "row-reverse" : "row"};
`;

export interface BaseStyleProps {
  backgroundColor?: string;
  borderRadius?: string;
  boxShadow?: string;
  buttonColor?: string;
  buttonStyle?: ButtonStyleType;
  buttonVariant?: ButtonVariant;
  textColor?: string;
}

const BaseMenuItem = styled(MenuItem)<ThemeProp & BaseStyleProps>`
  padding: 8px 10px !important;
  border-radius: 0px;
  ${({ backgroundColor, theme }) =>
    backgroundColor
      ? `
      background-color: ${backgroundColor} !important;
      &:hover {
        background-color: ${darkenHover(backgroundColor)} !important;
      }
      &:active {
        background-color: ${darkenActive(backgroundColor)} !important;
      }
  `
      : `
    background: none !important
      &:hover {
        background-color: ${tinycolor(
          theme.colors.button.primary.primary.textColor,
        )
          .darken()
          .toString()} !important;
      }
      &:active {
        background-color: ${tinycolor(
          theme.colors.button.primary.primary.textColor,
        )
          .darken()
          .toString()} !important;
      }
    `}
  ${({ textColor }) =>
    textColor &&
    `
      color: ${textColor} !important;
  `}
`;

const StyledMenu = styled(Menu)`
  padding: 0;
  min-width: 0px;
`;

interface PopoverContentProps {
  menuItems: Record<
    string,
    {
      widgetId: string;
      id: string;
      index: number;
      isVisible?: boolean;
      isDisabled?: boolean;
      label?: string;
      backgroundColor?: string;
      textColor?: string;
      iconName?: IconName;
      iconColor?: string;
      iconAlign?: Alignment;
      onClick?: string;
    }
  >;
  onItemClicked: (onClick: string | undefined) => void;
}

function PopoverContent(props: PopoverContentProps) {
  const { menuItems, onItemClicked } = props;

  let items = Object.keys(menuItems)
    .map((itemKey) => menuItems[itemKey])
    .filter((item) => item.isVisible === true);
  // sort btns by index
  items = sortBy(items, ["index"]);

  const listItems = items.map((menuItem) => {
    const {
      backgroundColor,
      iconAlign,
      iconColor,
      iconName,
      id,
      isDisabled,
      label,
      onClick,
      textColor,
    } = menuItem;
    if (iconAlign === Alignment.RIGHT) {
      return (
        <BaseMenuItem
          backgroundColor={backgroundColor}
          disabled={isDisabled}
          key={id}
          labelElement={<Icon color={iconColor} icon={iconName} />}
          onClick={() => onItemClicked(onClick)}
          text={label}
          textColor={textColor}
        />
      );
    }
    return (
      <BaseMenuItem
        backgroundColor={backgroundColor}
        disabled={isDisabled}
        icon={<Icon color={iconColor} icon={iconName} />}
        key={id}
        onClick={() => onItemClicked(onClick)}
        text={label}
        textColor={textColor}
      />
    );
  });

  return <StyledMenu>{listItems}</StyledMenu>;
}

class ButtonGroupComponent extends React.Component<ButtonGroupComponentProps> {
  onButtonClick = (onClick?: string) => {
    this.props.buttonClickHandler(onClick);
  };

  render = () => {
    const {
      buttonVariant,
      groupButtons,
      isDisabled,
      menuDropDownWidth,
      orientation,
      width,
    } = this.props;
    const isHorizontal = orientation === "horizontal";

    let items = Object.keys(groupButtons)
      .map((itemKey) => groupButtons[itemKey])
      .filter((item) => item.isVisible === true);
    // sort btns by index
    items = sortBy(items, ["index"]);

    return (
      <ButtonGroupWrapper
        borderRadius={this.props.borderRadius}
        boxShadow={this.props.boxShadow}
        buttonVariant={this.props.buttonVariant}
        className="t--buttongroup-widget"
        isHorizontal={isHorizontal}
      >
        {items.map((button) => {
          const isButtonDisabled = button.isDisabled || isDisabled;

          if (button.buttonType === "MENU" && !isButtonDisabled) {
            const { menuItems } = button;
            const id = uniqueId();

            return (
              <MenuButtonWrapper key={button.id}>
                <PopoverStyles
                  borderRadius={this.props.borderRadius}
                  id={id}
                  menuDropDownWidth={menuDropDownWidth}
                  parentWidth={width - WidgetContainerDiff}
                />
                <Popover2
                  content={
                    <PopoverContent
                      menuItems={menuItems || {}}
                      onItemClicked={this.onButtonClick}
                    />
                  }
                  disabled={button.isDisabled}
                  fill
                  minimal
                  placement="bottom-end"
                  popoverClassName={`menu-button-popover menu-button-width-${id} button-group-menu-popover`}
                >
                  <DragContainer
                    buttonColor={button.buttonColor || this.props.primaryColor}
                    buttonVariant={buttonVariant}
                    disabled={isButtonDisabled}
                    renderMode={this.props.renderMode}
                  >
                    <StyledButton
                      borderRadius={this.props.borderRadius}
                      buttonColor={
                        button.buttonColor || this.props.primaryColor
                      }
                      buttonVariant={buttonVariant}
                      disabled={isButtonDisabled}
                      iconAlign={button.iconAlign}
                      isHorizontal={isHorizontal}
                      isLabel={!!button.label}
                      key={button.id}
                    >
                      <StyledButtonContent
                        iconAlign={button.iconAlign || "left"}
                        placement={button.placement}
                      >
                        {button.iconName && <Icon icon={button.iconName} />}
                        {!!button.label && (
                          <span className={CoreClass.BUTTON_TEXT}>
                            {button.label}
                          </span>
                        )}
                      </StyledButtonContent>
                    </StyledButton>
                  </DragContainer>
                </Popover2>
              </MenuButtonWrapper>
            );
          }
          return (
            <DragContainer
              buttonColor={button.buttonColor}
              buttonVariant={buttonVariant}
              disabled={isButtonDisabled}
              key={button.id}
              onClick={() => {
                if (isButtonDisabled) return;
                this.onButtonClick(button.onClick);
              }}
              renderMode={this.props.renderMode}
              style={{ flex: "1 1 auto" }}
            >
              <StyledButton
                borderRadius={this.props.borderRadius}
                buttonColor={button.buttonColor || this.props.primaryColor}
                buttonVariant={buttonVariant}
                disabled={isButtonDisabled}
                iconAlign={button.iconAlign}
                isHorizontal={isHorizontal}
                isLabel={!!button.label}
                onClick={() => this.onButtonClick(button.onClick)}
              >
                <StyledButtonContent
                  iconAlign={button.iconAlign || "left"}
                  placement={button.placement}
                >
                  {button.iconName && <Icon icon={button.iconName} />}
                  {!!button.label && (
                    <span className={CoreClass.BUTTON_TEXT}>
                      {button.label}
                    </span>
                  )}
                </StyledButtonContent>
              </StyledButton>
            </DragContainer>
          );
        })}
      </ButtonGroupWrapper>
    );
  };
}

interface GroupButtonProps {
  widgetId: string;
  id: string;
  index: number;
  isVisible?: boolean;
  isDisabled?: boolean;
  label?: string;
  buttonType?: string;
  buttonColor?: string;
  iconName?: IconName;
  iconAlign?: Alignment;
  placement?: ButtonPlacement;
  onClick?: string;
  menuItems: Record<
    string,
    {
      widgetId: string;
      id: string;
      index: number;
      isVisible?: boolean;
      isDisabled?: boolean;
      label?: string;
      backgroundColor?: string;
      textColor?: string;
      iconName?: IconName;
      iconColor?: string;
      iconAlign?: Alignment;
      onClick?: string;
    }
  >;
}

export interface ButtonGroupComponentProps {
  borderRadius?: string;
  boxShadow?: string;
  buttonVariant: ButtonVariant;
  buttonClickHandler: (onClick: string | undefined) => void;
  groupButtons: Record<string, GroupButtonProps>;
  isDisabled: boolean;
  menuDropDownWidth: number;
  orientation: string;
  renderMode: RenderMode;
  width: number;
  primaryColor?: string;
}

export default ButtonGroupComponent;
