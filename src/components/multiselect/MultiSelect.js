import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import styled from 'styled-components'
import { useCombobox } from "downshift";
import ConditionalDisplay from '../ConditionalDisplay'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

const MultiSelectWrapper = styled.div`
  .select-list__wrapper {
    position: relative;
    width: 100%;
  }

  .select-list__toggle {
    background-color: #ffffff;
    border: 1px solid #cccccc;
    border-radius: 6px;
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 24px;
    padding-top: 15px;
    padding-bottom: 15px;
    position: relative;

    &.is-open {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  .select-list__items {
    background-color: #f5f5f5;
    border: 1px solid #cccccc;
    border-top-color: rgb(204, 204, 204);
    border-top-style: solid;
    border-top-width: 1px;
    border-top: none;
    height: auto;
    max-height: 70vh;
    list-style-type: none;
    overflow: auto;
    padding: 16px;
    position: absolute;
    margin-top: 0;
    z-index: 10;
  }

  .select-list__item {
    background-color: #ffffff;
    border-radius: 6px;
    padding: 15px 24px;
    transition: background-color 250ms cubic-bezier(0.165, 0.84, 0.44, 1);
    margin-bottom: 16px;
    cursor: pointer;

    &.is-active {
      background-color: #00acca;
      color: #ffffff;
    }
  }

  label {
    display: inline-block;
    max-width: 100%;
    margin-bottom: 5px;
    font-weight: bold;
  }

  ${props => props.customStyles ? props.customStyles : null}
`

/** Use to create custom styled select lists for UI components. This component uses Downshift to create accessible select lists. */
const MultiSelect = forwardRef((props, ref) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const {
    children: items,
    label,
    isEditable,
    hasButton,
    classList,
    itemClassList,
    selectedItemClassList,
    buttonText,
    sendItems,
    initialSelectedItemList,
    updateSelectedItems,
  } = props;

  const getNodeItemsFromIds = (sentItems) => {
    const results = [];
    sentItems.map((item) => items.map((i) => (i.props.id === item.id.toString() ? results.push(i) : null)));
    return results;
  };

  useEffect(() => {
    setSelectedItems(initialSelectedItemList);
  }, []);

  useEffect(() => {
    sendItems(selectedItems);
    updateSelectedItems(selectedItems);
  }, [selectedItems]);

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    openMenu,
    closeMenu,
    setHighlightedIndex,
    selectItem,
  } = useCombobox({
    items,
    onSelectedItemChange: ({ selectedItem }) => {
      if (!selectedItem) {
        return;
      }
      const selectedItemAlreadySelected =
        selectedItems.length > 0 && selectedItem
          ? selectedItems.find((item) => item.props.id === selectedItem.props.id)
          : false;

      if (selectedItemAlreadySelected && selectedItems.length >= 1) {
        setSelectedItems(
          selectedItems.map((item) => (item.props.id !== selectedItem.props.id ? item : null)).filter(Boolean)
        );
      } else {
        setSelectedItems([...selectedItems, selectedItem]);
      }
    },
    stateReducer: (state, actionAndChanges) => {
      const { changes, type } = actionAndChanges;
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            highlightedIndex: changes.selectedItem.props.id - 1,
            isOpen: true, // keep the menu open after selection.
          };
        case useCombobox.stateChangeTypes.ItemMouseMove:
        case useCombobox.stateChangeTypes.MenuMouseLeave:
        case useCombobox.stateChangeTypes.InputBlur:
          if (isOpen) {
            // Fixes open flash when tabbing past dropdown
            return {
              ...changes,
              isOpen: true,
            }; // Allows tabbing within dropdown
          }
          break;
        default:
          break;
      }
      return changes;
    },
  });

  const openClass = isOpen ? "is-open" : "";

  /**
   * Uses Downshift's internal state to determine whether to render a done button or an icon.
   *
   * @returns
   */
  const renderToggleButton = () => (<div>
    <ConditionalDisplay display={isOpen && hasButton}>
      <div className="select-list__actions">
        <ConditionalDisplay display={selectedItems.length === 0}>
          <button
            className="select-list__button--open btn btn-ghost-orange" // Had to do it this way, when checking isOpen above for some reason the buttons don't work
            onClick={() => setSelectedItems(items)}
          >
            Select All
          </button>
        </ConditionalDisplay>

        <ConditionalDisplay display={selectedItems.length !== 0}>
          <button className="btn btn-ghost-orange select-list__button--open" onClick={() => setSelectedItems([])}>
            Clear All
          </button>
        </ConditionalDisplay>

        <button
          {...getToggleButtonProps()}
          tabIndex={0}
          className="select-list__button--open btn btn-primary"
          {...getMenuProps()}
        >
          {buttonText}
        </button>
      </div>
    </ConditionalDisplay>

    <ConditionalDisplay display={!isOpen}>
      <span className="select-list__dropdown-button" {...getToggleButtonProps()}>
        <FontAwesomeIcon icon={faAngleDown} />
      </span>
    </ConditionalDisplay>
  </div>)

  const handleMainWrapperBlur = (e) => {
    const wrapperTarget = e.currentTarget;

    setTimeout(() => {
      const focusedElement = document.activeElement;
      const isChildElementFocused = wrapperTarget.contains(focusedElement);
      if (!isChildElementFocused) {
        closeMenu(); // Close menu if child element is not focused within wrapper element
      } else {
        setHighlightedIndex(-1);
      }
    }, 0);
  };

  const handleItemKeyboardEvent = (e, item) => {
    const keyToLowerCase = e.key.toLowerCase();
    const isProperKeyEvent = keyToLowerCase === "enter" || keyToLowerCase === "spacebar" || keyToLowerCase === " ";

    if (isProperKeyEvent) {
      selectItem(item);
    }
  };

  // Methods available to parent here
  useImperativeHandle(ref, () => ({
    setSelectedItemsList(sentItems) {
      setSelectedItems(sentItems);
    },
    setSelectedItemsListFromIds(sentItems) {
      setSelectedItems(getNodeItemsFromIds(sentItems));
    },
    toggleItem(item) {
      selectItem(item);
    },
  }));

  const itemClass = (item) => {
    return selectedItems && selectedItems.find((i) => i.props.id === item.props.id)
      ? `is-active ${selectedItemClassList}`
      : "";
  };

  return (
    <MultiSelectWrapper>
      <div ref={ref}>
        <div
          {...getComboboxProps()}
          aria-label="select an option"
          className={`select-list form-group ${classList}`}
          onBlur={(e) => handleMainWrapperBlur(e)}
          onKeyUp={(e) =>
            !isOpen &&
            (e.key.toLocaleLowerCase() === " " ||
              e.key.toLocaleLowerCase() === "space" ||
              e.key.toLocaleLowerCase() === "enter")
              ? openMenu()
              : null
          }
        >
          <label id="select-list-label" className="select-list__label" {...getLabelProps()}>
            {label}
          </label>
          <div className="select-list__wrapper">
            <div
              className={`select-list__toggle ${openClass}`}
              onClick={() => (isEditable && !isOpen ? openMenu() : "")}
              tabIndex={0}
              role="input"
              aria-labelledby="select-list-label"
              {...getInputProps()}
            >
              <div className="select-list__selected-items" tabIndex={-1}>
                <ConditionalDisplay display={selectedItems.length >= 1}>
                  <div>
                    <div>{selectedItems.length} selected</div>
                    <em>{selectedItems.map((item) => item.props.content).join(", ")}</em>
                  </div>
                </ConditionalDisplay>

                <ConditionalDisplay display={selectedItems.length === 0}>
                  {`0 selected`}
                </ConditionalDisplay>
              </div>

              {renderToggleButton()}
            </div>

            <ul
              className="select-list__items"
              role="combobox"
              tabIndex={-1}
              {...getMenuProps()}
              style={!isOpen ? { display: "none" } : {}}
            >
              {isOpen &&
                items.map((item, index) => (
                  <li
                    className={`select-list__item ${itemClassList} ${itemClass(item)}`}
                    tabIndex={0}
                    onKeyUp={(e) => handleItemKeyboardEvent(e, item)}
                    {...getItemProps({
                      item,
                      index,
                      key: `${item.props.id}`,
                      style: {
                        backgroundColor: highlightedIndex === index ? "#d9f3f7" : "",
                      },
                    })}
                  >
                    {item}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </MultiSelectWrapper>
  );
});

MultiSelect.defaultProps = {
  classList: "",
  itemClassList: "",
  selectedItemClassList: "",
  hasButton: true,
  buttonText: "Done",
  isEditable: true,
  initialIndex: -1,
  sendItems() {},
  initialSelectedItemList: [],
};

MultiSelect.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  isEditable: PropTypes.bool,
  hasButton: PropTypes.bool,
  classList: PropTypes.string,
  buttonText: PropTypes.string,
  initialIndex: PropTypes.number,
  itemClassList: PropTypes.string,
  selectedItemClassList: PropTypes.string,
  sendItems: PropTypes.func,
  initialSelectedItemList: PropTypes.array,
  updateSelectedItems: PropTypes.func.isRequired,
};

export default MultiSelect;
