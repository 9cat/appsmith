import Icon, { IconSize } from "components/ads/Icon";
import Text, { TextType } from "components/ads/Text";
import { Colors } from "constants/Colors";
import { Datasource } from "entities/Datasource";
import { PluginImage } from "pages/Editor/DataSourceEditor/JSONtoForm";
import React from "react";
import styled from "styled-components";

const ListItem = styled.div<{ disabled?: boolean }>`
  display: flex;
  height: 64px;
  width: 100%;
  padding: 10px 18px;
  margin-bottom: 10px;
  cursor: pointer;
  opacity: ${(props) => (props.disabled ? 0.4 : 1)};
  &.active,
  &:hover {
    background-color: ${Colors.GEYSER_LIGHT};
  }
  img {
    width: 24pxx;
    height: 22.5px;
    margin-right: ${(props) => props.theme.spaces[3]}px;
  }
`;

const ListLabels = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  .t--ds-list-description {
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .cs-icon {
    margin-left: ${(props) => props.theme.spaces[2]}px;
  }
`;

function ListItemWrapper(props: {
  ds: Datasource;
  selected?: boolean;
  plugin: {
    image: string;
    name: string;
  };
  onClick: (ds: Datasource) => void;
}) {
  const { ds, onClick, plugin, selected } = props;
  return (
    <ListItem
      className={`t--ds-list ${selected ? "active" : ""}`}
      onClick={() => onClick(ds)}
    >
      <PluginImage alt="Datasource" src={plugin.image} />
      <ListLabels>
        <Text
          color={Colors.GRAY_800}
          style={{ marginBottom: 2, display: "flex" }}
          type={TextType.H4}
        >
          {ds.name}
          <Icon
            fillColor={ds.isConfigured ? Colors.GREEN : Colors.ERROR_RED}
            name={ds.isConfigured ? "oval-check" : "info"}
            size={IconSize.MEDIUM}
          />
        </Text>
        <Text
          className="t--ds-list-description"
          color={Colors.GRAY_700}
          type={TextType.H5}
        >
          {plugin.name}
        </Text>
      </ListLabels>
    </ListItem>
  );
}

export default ListItemWrapper;
