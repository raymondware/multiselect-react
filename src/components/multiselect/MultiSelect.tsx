import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useMemo,
  useId,
} from "react";
import styled, { css, keyframes } from "styled-components";
import { useCombobox, UseComboboxStateChange } from "downshift";

// ============================================================================
// Types
// ============================================================================

export interface MultiSelectOption {
  id: string;
  content: string;
  disabled?: boolean;
}

export interface MultiSelectProps {
  /** Array of option items (can be React nodes or MultiSelectOption objects) */
  children?: React.ReactNode;
  /** Options array (alternative to children) */
  options?: MultiSelectOption[];
  /** Label for the select */
  label: string;
  /** Placeholder when no items selected */
  placeholder?: string;
  /** Whether the select is editable/interactive */
  isEditable?: boolean;
  /** Show Select All / Clear All buttons */
  hasButton?: boolean;
  /** Disable the entire component */
  disabled?: boolean;
  /** Show loading spinner */
  loading?: boolean;
  /** Error message to display */
  error?: string;
  /** Enable search/filter functionality */
  searchable?: boolean;
  /** Search input placeholder */
  searchPlaceholder?: string;
  /** Maximum number of selections allowed */
  maxSelections?: number;
  /** Custom class for the wrapper */
  classList?: string;
  /** Custom class for items */
  itemClassList?: string;
  /** Custom class for selected items */
  selectedItemClassList?: string;
  /** Text for the done button */
  buttonText?: string;
  /** Callback when items change */
  sendItems?: (items: React.ReactNode[]) => void;
  /** Initial selected items */
  initialSelectedItemList?: React.ReactNode[];
  /** Callback for selected items updates */
  updateSelectedItems: (items: React.ReactNode[]) => void;
  /** Custom styles to merge */
  customStyles?: ReturnType<typeof css>;
}

export interface MultiSelectRef {
  setSelectedItemsList: (items: React.ReactNode[]) => void;
  setSelectedItemsListFromIds: (items: { id: string }[]) => void;
  toggleItem: (item: React.ReactNode) => void;
  clearAll: () => void;
  selectAll: () => void;
  getSelectedItems: () => React.ReactNode[];
}

// ============================================================================
// Styled Components
// ============================================================================

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const MultiSelectWrapper = styled.div<{
  $disabled?: boolean;
  $hasError?: boolean;
  $customStyles?: ReturnType<typeof css>;
}>`
  .select-list__wrapper {
    position: relative;
    width: 100%;
  }

  .select-list__toggle {
    background-color: #ffffff;
    border: 1px solid ${props => props.$hasError ? '#dc3545' : '#cccccc'};
    border-radius: 6px;
    cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 24px;
    position: relative;
    opacity: ${props => props.$disabled ? 0.6 : 1};
    transition: border-color 0.2s, box-shadow 0.2s;

    &:focus-within {
      border-color: ${props => props.$hasError ? '#dc3545' : '#00acca'};
      box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(220, 53, 69, 0.25)' : 'rgba(0, 172, 202, 0.25)'};
      outline: none;
    }

    &.is-open {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  .select-list__items {
    background-color: #f5f5f5;
    border: 1px solid #cccccc;
    border-top: none;
    border-radius: 0 0 6px 6px;
    height: auto;
    max-height: 300px;
    list-style-type: none;
    overflow: auto;
    padding: 8px;
    position: absolute;
    margin: 0;
    width: 100%;
    box-sizing: border-box;
    z-index: 10;
  }

  .select-list__item {
    background-color: #ffffff;
    border-radius: 6px;
    padding: 12px 16px;
    transition: background-color 150ms ease;
    margin-bottom: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;

    &:last-child {
      margin-bottom: 0;
    }

    &:hover:not(.is-disabled) {
      background-color: #e8f7fa;
    }

    &:focus {
      outline: 2px solid #00acca;
      outline-offset: -2px;
    }

    &.is-active {
      background-color: #00acca;
      color: #ffffff;
    }

    &.is-highlighted {
      background-color: #d9f3f7;
    }

    &.is-disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .select-list__checkbox {
    width: 18px;
    height: 18px;
    border: 2px solid currentColor;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .select-list__check-icon {
    opacity: 0;
    transition: opacity 100ms;
  }

  .is-active .select-list__check-icon {
    opacity: 1;
  }

  .select-list__search {
    padding: 8px;
    border-bottom: 1px solid #e0e0e0;
  }

  .select-list__search-input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #cccccc;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #00acca;
    }
  }

  .select-list__actions {
    display: flex;
    gap: 8px;
    padding: 8px;
    border-top: 1px solid #e0e0e0;
    justify-content: flex-end;
  }

  .select-list__spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #cccccc;
    border-top-color: #00acca;
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
  }

  .select-list__error {
    color: #dc3545;
    font-size: 12px;
    margin-top: 4px;
  }

  .select-list__dropdown-icon {
    transition: transform 200ms;
  }

  .select-list__toggle.is-open .select-list__dropdown-icon {
    transform: rotate(180deg);
  }

  label {
    display: block;
    margin-bottom: 6px;
    font-weight: 600;
    font-size: 14px;
  }

  .btn {
    padding: 8px 16px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 150ms;
  }

  .btn-primary {
    background-color: #00acca;
    color: white;

    &:hover {
      background-color: #0096b3;
    }
  }

  .btn-ghost {
    background-color: transparent;
    color: #00acca;
    border: 1px solid #00acca;

    &:hover {
      background-color: rgba(0, 172, 202, 0.1);
    }
  }

  ${props => props.$customStyles}
`;

// ============================================================================
// Icons (inline SVG - no external deps)
// ============================================================================

const ChevronDownIcon = () => (
  <svg
    className="select-list__dropdown-icon"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 6L8 10L12 6" />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="select-list__check-icon"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2 6L5 9L10 3" />
  </svg>
);

// ============================================================================
// Component
// ============================================================================

const MultiSelect = forwardRef<MultiSelectRef, MultiSelectProps>((props, ref) => {
  const {
    children: items,
    options,
    label,
    placeholder = "Select items...",
    isEditable = true,
    hasButton = true,
    disabled = false,
    loading = false,
    error,
    searchable = false,
    searchPlaceholder = "Search...",
    maxSelections,
    classList = "",
    itemClassList = "",
    selectedItemClassList = "",
    buttonText = "Done",
    sendItems = () => {},
    initialSelectedItemList = [],
    updateSelectedItems,
    customStyles,
  } = props;

  const [selectedItems, setSelectedItems] = useState<React.ReactNode[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Generate unique IDs for accessibility
  const labelId = useId();
  const listboxId = useId();
  const errorId = useId();

  // Normalize items - support both children and options prop
  const normalizedItems = useMemo(() => {
    if (options) {
      return options.map(opt => (
        <span key={opt.id} id={opt.id} data-content={opt.content} data-disabled={opt.disabled}>
          {opt.content}
        </span>
      ));
    }
    return React.Children.toArray(items);
  }, [items, options]);

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!searchable || !searchQuery.trim()) {
      return normalizedItems;
    }
    const query = searchQuery.toLowerCase();
    return normalizedItems.filter((item) => {
      if (React.isValidElement(item)) {
        const content = item.props.content || item.props.children;
        return String(content).toLowerCase().includes(query);
      }
      return true;
    });
  }, [normalizedItems, searchQuery, searchable]);

  const getNodeItemsFromIds = useCallback(
    (sentItems: { id: string }[]) => {
      const results: React.ReactNode[] = [];
      sentItems.forEach((item) =>
        normalizedItems.forEach((i) => {
          if (React.isValidElement(i) && i.props.id === item.id.toString()) {
            results.push(i);
          }
        })
      );
      return results;
    },
    [normalizedItems]
  );

  useEffect(() => {
    setSelectedItems(initialSelectedItemList);
  }, []);

  useEffect(() => {
    sendItems(selectedItems);
    updateSelectedItems(selectedItems);
  }, [selectedItems, sendItems, updateSelectedItems]);

  const getItemId = (item: React.ReactNode): string => {
    if (React.isValidElement(item)) {
      return item.props.id || "";
    }
    return "";
  };

  const isItemDisabled = (item: React.ReactNode): boolean => {
    if (React.isValidElement(item)) {
      return item.props.disabled || item.props["data-disabled"] === true;
    }
    return false;
  };

  const handleSelectedItemChange = useCallback(
    ({ selectedItem }: UseComboboxStateChange<React.ReactNode>) => {
      if (!selectedItem || disabled) return;

      const itemId = getItemId(selectedItem);
      const isItemAlreadySelected = selectedItems.some(
        (item) => getItemId(item) === itemId
      );

      if (isItemAlreadySelected) {
        setSelectedItems(
          selectedItems.filter((item) => getItemId(item) !== itemId)
        );
      } else {
        if (maxSelections && selectedItems.length >= maxSelections) {
          return; // Don't add more if at max
        }
        setSelectedItems([...selectedItems, selectedItem]);
      }
    },
    [selectedItems, disabled, maxSelections]
  );

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
    items: filteredItems,
    onSelectedItemChange: handleSelectedItemChange,
    stateReducer: (state, actionAndChanges) => {
      const { changes, type } = actionAndChanges;
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            highlightedIndex: state.highlightedIndex,
            isOpen: true,
          };
        case useCombobox.stateChangeTypes.InputBlur:
          if (state.isOpen) {
            return { ...changes, isOpen: true };
          }
          break;
      }
      return changes;
    },
  });

  // Imperative handle for parent control
  useImperativeHandle(
    ref,
    () => ({
      setSelectedItemsList(sentItems) {
        setSelectedItems(sentItems);
      },
      setSelectedItemsListFromIds(sentItems) {
        setSelectedItems(getNodeItemsFromIds(sentItems));
      },
      toggleItem(item) {
        selectItem(item);
      },
      clearAll() {
        setSelectedItems([]);
      },
      selectAll() {
        setSelectedItems(normalizedItems);
      },
      getSelectedItems() {
        return selectedItems;
      },
    }),
    [getNodeItemsFromIds, normalizedItems, selectItem, selectedItems]
  );

  const handleMainWrapperBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    const wrapperTarget = e.currentTarget;
    setTimeout(() => {
      const focusedElement = document.activeElement;
      const isChildElementFocused = wrapperTarget.contains(focusedElement);
      if (!isChildElementFocused) {
        closeMenu();
        setSearchQuery("");
      } else {
        setHighlightedIndex(-1);
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (!isOpen && (e.key === " " || e.key === "Enter" || e.key === "ArrowDown")) {
      e.preventDefault();
      openMenu();
    }
  };

  const isItemSelected = (item: React.ReactNode): boolean => {
    const itemId = getItemId(item);
    return selectedItems.some((selected) => getItemId(selected) === itemId);
  };

  const getSelectedText = (): string => {
    if (selectedItems.length === 0) return placeholder;
    if (selectedItems.length === 1) {
      const item = selectedItems[0];
      if (React.isValidElement(item)) {
        return item.props.content || item.props.children || "1 selected";
      }
      return "1 selected";
    }
    return `${selectedItems.length} selected`;
  };

  const openClass = isOpen ? "is-open" : "";

  return (
    <MultiSelectWrapper
      $disabled={disabled}
      $hasError={!!error}
      $customStyles={customStyles}
    >
      <div
        {...getComboboxProps()}
        className={`select-list form-group ${classList}`}
        onBlur={handleMainWrapperBlur}
        onKeyDown={handleKeyDown}
      >
        <label id={labelId} {...getLabelProps()}>
          {label}
        </label>

        <div className="select-list__wrapper">
          <div
            className={`select-list__toggle ${openClass}`}
            onClick={() => isEditable && !disabled && !isOpen && openMenu()}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls={listboxId}
            aria-labelledby={labelId}
            aria-describedby={error ? errorId : undefined}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            {...getInputProps()}
            {...getToggleButtonProps()}
          >
            <div className="select-list__selected-items">
              {loading ? (
                <div className="select-list__spinner" aria-label="Loading..." />
              ) : (
                <span>{getSelectedText()}</span>
              )}
            </div>

            <ChevronDownIcon />
          </div>

          <ul
            id={listboxId}
            className="select-list__items"
            role="listbox"
            aria-labelledby={labelId}
            aria-multiselectable="true"
            {...getMenuProps()}
            style={!isOpen ? { display: "none" } : {}}
          >
            {isOpen && searchable && (
              <li className="select-list__search" role="presentation">
                <input
                  type="text"
                  className="select-list__search-input"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Search options"
                />
              </li>
            )}

            {isOpen &&
              filteredItems.map((item, index) => {
                const itemDisabled = isItemDisabled(item);
                const selected = isItemSelected(item);
                const highlighted = highlightedIndex === index;

                return (
                  <li
                    key={getItemId(item) || index}
                    className={`select-list__item ${itemClassList} ${
                      selected ? `is-active ${selectedItemClassList}` : ""
                    } ${highlighted ? "is-highlighted" : ""} ${
                      itemDisabled ? "is-disabled" : ""
                    }`}
                    role="option"
                    aria-selected={selected}
                    aria-disabled={itemDisabled}
                    {...getItemProps({
                      item,
                      index,
                      disabled: itemDisabled,
                    })}
                  >
                    <span className="select-list__checkbox">
                      <CheckIcon />
                    </span>
                    {item}
                  </li>
                );
              })}

            {isOpen && filteredItems.length === 0 && (
              <li className="select-list__item is-disabled" role="presentation">
                No options found
              </li>
            )}

            {isOpen && hasButton && (
              <li className="select-list__actions" role="presentation">
                {selectedItems.length === 0 ? (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setSelectedItems(normalizedItems)}
                    disabled={disabled}
                  >
                    Select All
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setSelectedItems([])}
                    disabled={disabled}
                  >
                    Clear All
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={closeMenu}
                >
                  {buttonText}
                </button>
              </li>
            )}
          </ul>
        </div>

        {error && (
          <div id={errorId} className="select-list__error" role="alert">
            {error}
          </div>
        )}
      </div>
    </MultiSelectWrapper>
  );
});

MultiSelect.displayName = "MultiSelect";

export default MultiSelect;
