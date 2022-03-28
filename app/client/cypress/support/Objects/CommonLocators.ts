export class CommonLocators {
    _addNewDataSource = ".datasources .t--entity-add-btn"
    _integrationCreateNew = "[data-cy=t--tab-CREATE_NEW]"
    _loading = "#loading"
    _queryName = ".t--action-name-edit-field span"
    _queryNameTxt = ".t--action-name-edit-field input"
    _dsName = ".t--edit-datasource-name span"
    _dsNameTxt = ".t--edit-datasource-name input"
    _homeIcon = ".t--appsmith-logo"
    _homePageAppCreateBtn = ".t--applications-container .createnew"
    _saveStatusSuccess = ".t--save-status-success"
    _codeMirrorTextArea = ".CodeMirror textarea"
    _codeMirrorCode = ".CodeMirror-code"
    _codeEditorTargetTextArea = ".CodeEditorTarget textarea"
    _codeEditorTarget = "div.CodeEditorTarget"
    _entityExplorersearch = "#entity-explorer-search"
    _propertyControl = ".t--property-control-"
    _textWidget = ".t--draggable-textwidget span"
    _inputWidget = ".t--draggable-inputwidgetv2 input"
    _publishButton = ".t--application-publish-btn"
    _textWidgetInDeployed = ".t--widget-textwidget span"
    _inputWidgetInDeployed = ".t--widget-inputwidgetv2 input"
    _backToEditor = ".t--back-to-editor"
    _newPage = ".pages .t--entity-add-btn"
    _toastMsg = ".t--toast-action"
    _empty = "span[name='no-response']"
    _openWidget = ".widgets .t--entity-add-btn"
    _dropHere = "#comment-overlay-wrapper-0"
    _activeTab = "span:contains('Active')"
    _createQuery = ".t--create-query"
    _entityNameInExplorer = (entityNameinLeftSidebar: string) => "//div[contains(@class, 't--entity-name')][text()='" + entityNameinLeftSidebar + "']"
    _expandCollapseArrow = (entityNameinLeftSidebar: string) => "//div[text()='" + entityNameinLeftSidebar + "']/ancestor::div/preceding-sibling::a[contains(@class, 't--entity-collapse-toggle')]"
    _entityProperties = (entityNameinLeftSidebar: string) => "//div[text()='" + entityNameinLeftSidebar + "']/ancestor::div[contains(@class, 't--entity-item')]/following-sibling::div//div[contains(@class, 't--entity-property')]//code"
    _contextMenu = (entityNameinLeftSidebar: string) => "//div[text()='" + entityNameinLeftSidebar + "']/ancestor::div[1]/following-sibling::div//div[contains(@class, 'entity-context-menu-icon')]"
    _contextMenuItem = (item: string) => "//div[text()='" + item + "']/ancestor::a[contains(@class, 'single-select')]"
    _entityNameEditing = (entityNameinLeftSidebar: string) => "//span[text()='" + entityNameinLeftSidebar + "']/parent::div[contains(@class, 't--entity-name editing')]/input"
    _jsToggle = (controlToToggle: string) => ".t--property-control-" + controlToToggle + " .t--js-toggle"
    _spanButton = (btnVisibleText: string) => "//span[text()='" + btnVisibleText + "']/parent::button"
    _selectPropDropdown = (ddName: string) => "//div[contains(@class, 't--property-control-" + ddName + "')]//button"
    _dropDownValue = (ddOption: string) => ".single-select:contains('" + ddOption + "')"
    _selectOptionValue = (ddOption: string) => ".menu-item-link:contains('" + ddOption + "')"
    _actionTextArea = (actionName: string) => "//label[text()='" + actionName + "']/following-sibling::div//div[contains(@class, 'CodeMirror')]//textarea"
    _existingDefaultTextInput = ".t--property-control-defaulttext .CodeMirror-code"
    _widgetPageIcon = (widgetType: string) => `.t--widget-card-draggable-${widgetType}`
    _widgetInCanvas = (widgetType: string) => `.t--draggable-${widgetType}`
    _widgetInDeployed = (widgetType: string) => `.t--widget-${widgetType}`
    _propertyToggle = (controlToToggle: string) => ".t--property-control-" + controlToToggle + " input[type='checkbox']"
    _openNavigationTab = (tabToOpen: string) => `#switcher--${tabToOpen}`
    _selectWidgetDropdown = (widgetType: string) => "//div[contains(@class, 't--draggable-" + widgetType + "')]//button"
    _createNewPlgin = (pluginName: string) => ".t--plugin-name:contains('" + pluginName + "')"
    _inputFieldByName = (fieldName: string) => "//p[text()='" + fieldName + "']/parent::label/following-sibling::div"
    _evaluatedCurrentValue = "div:last-of-type .t--CodeEditor-evaluatedValue > div:last-of-type pre"
    _tableRowColumn = (rowNum: number, colNum: number) => `.t--widget-tablewidget .tbody .td[data-rowindex=${rowNum}][data-colindex=${colNum}] div div`
    _crossBtn = "span.cancel-icon"
    _createNew = ".t--entity-add-btn.group.files"

}
