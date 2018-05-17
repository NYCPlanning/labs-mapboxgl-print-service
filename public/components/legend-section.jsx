const { DragSource, DropTarget } = ReactDnD;

const FaIcon = (props) => {
  const weight = props.weight ? props.weight : 'r';
  const iconClass = `fa${weight} fa-${props.icon} ${props.className}`;
  return <i className={iconClass} />;
};

const sectionSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
    };
  },

  // if section is not visble, it cannot be moved
  canDrag(props) {
    return props.visible;
  },
};

const sectionTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = ReactDOM.findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.moveSection(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex; // eslint-disable-line
  },
};

class LegendSection extends React.Component {
  render() {
    const {
      label,
      visible,
      editable,
      id,
      items,
      isDragging,
      connectDragSource,
      connectDropTarget,
      onVisibilityToggle,
    } = this.props;

    const opacity = isDragging ? 0 : 1;

    let sectionControls = (
      <div className="controls">
        <button className="button--hide unstyled-button" onClick={() => { onVisibilityToggle(id); }}><FaIcon weight="s" icon="times" /></button>
        <div className="drag-handle">
          <FaIcon weight="s" icon="arrows-alt-v" />&nbsp;
          <FaIcon weight="s" icon="ellipsis-v" />
          <FaIcon weight="s" icon="ellipsis-v" />
        </div>
      </div>
    );
    if (editable === false) {
      sectionControls = '';
    }

    const section = (
      <div className="legend-section" style={{ opacity }}>
        {sectionControls}

        <h4 className="legend-section-header">
          {label}
        </h4>

        {/* render legendItems */}
        {items && items.map((item) => {
            const { type, label: itemLabel, style } = item;

            return (
              <div className="legend-item" key={itemLabel}>
                <LegendSymbol type={type} style={style} />
                {itemLabel}
              </div>
            );
          })}
      </div>
    );

    return connectDragSource(connectDropTarget(section));
  }
}

LegendSection = DragSource('legend-section', sectionSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(LegendSection);

LegendSection = DropTarget('legend-section', sectionTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))(LegendSection);
