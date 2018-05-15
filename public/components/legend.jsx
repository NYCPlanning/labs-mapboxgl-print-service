const { DragSource, DropTarget, DragDropContext } = ReactDnD;

const LegendSymbol = (props) => {
  // defaults
  const {
    fill,
    stroke = '#cdcdcd',
    strokeWidth = 1,
    strokeDasharray = 'none',
    strokeLinecap = 'butt',
  } = props.style;

  return (
    <svg className="legend-icon" width="16" height="8" viewBox="0 0 16 8" preserveAspectRatio="xMinYMid">
      {(props.type === 'area') && (
        <rect width="6" height="6" fill={fill} stroke={stroke} strokeWidth={strokeWidth} x="5" y="1" rx="1" ry="1" />
      )}

      {(props.type === 'line') && (
        <path
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinecap={strokeLinecap}
          d="M0 4 l215 0"
        />
      )}

      {(props.type === 'point') && (
        <circle cx="8" cy="4" r="2.5" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      )}
    </svg>
  );
};

const sectionSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
    };
  },
};

const sectionTarget = {
  hover(props, monitor, component) {
    console.log('sectionTarget hover');
    console.log(props, monitor)

    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    console.log(dragIndex, hoverIndex)

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = ReactDOM.findDOMNode(component).getBoundingClientRect();

    console.log('bounding rect', hoverBoundingRect)
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
    monitor.getItem().index = hoverIndex;
  },
};

class Section extends React.Component { // eslint-disable-line
  render() {
    const {
      label,
      items,
      isDragging,
      connectDragSource,
      connectDropTarget,
    } = this.props;

    const opacity = isDragging ? 0 : 1;

    return connectDragSource(connectDropTarget(<div className="legend-section" style={{ opacity }}>
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
                                               </div>));
  }
}

Section = DragSource('section', sectionSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(Section);

Section = DropTarget('section', sectionTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))(Section);

class Legend extends React.Component { // eslint-disable-line
  constructor(props) {
    super(props);
    this.moveSection = this.moveSection.bind(this)

    console.log(props)
    const { config: sections } = props;

    this.state = {
      sections,
    };
  }

  moveSection(dragIndex, hoverIndex) {
    const { sections } = this.state;
    const dragSection = sections[dragIndex];

    sections.splice(dragIndex, 1);
    sections.splice(hoverIndex, 0, dragSection);

    this.setState({ sections });
  }

  render() {
    const { sections } = this.state;
    if (sections === null) return (null);

    return (
      <div className="legend">
        <h3 className="legend-header">Legend</h3>
        {/* render sections */}
        {sections.map((section, i) => {
          console.log(section);
          const { id, label, items } = section;
          return <Section key={id} index={i} id={id} label={label} items={items} moveSection={this.moveSection} />;
        })}
      </div>
    );
  }
}

Legend = DragDropContext(ReactDnDHTML5Backend)(Legend); // eslint-disable-line
