const { DragDropContext } = ReactDnD;

class Legend extends React.Component { // eslint-disable-line
  constructor(props) {
    super(props);
    this.moveSection = this.moveSection.bind(this);
    this.handleVisibilityToggle = this.handleVisibilityToggle.bind(this);

    const { editable } = props;
    let { sections } = props;

    sections = sections.map((d) => {
      d.visible = true;
      d.editable = editable;
      return d;
    });

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

  handleVisibilityToggle(id) {
    const { sections } = this.state;

    // find the section to be toggled, remove it from the array
    const thisSectionIndex = sections.findIndex(d => d.id === id);
    const thisSection = sections.splice(thisSectionIndex, 1)[0];

    // toggle the section's visibility
    thisSection.visible = !thisSection.visible;

    // find the first hidden section, insert our section before it
    const lastVisibleIndex = sections.reduce((acc, curr, i) => { // eslint-disable-line
      return curr.visible ? i : acc;
    });
    const insertPosition = thisSection.visible ? lastVisibleIndex + 1 : lastVisibleIndex + 1;
    sections.splice(insertPosition, 0, thisSection);

    this.setState({ sections });
  }

  render() {
    const { sections } = this.state;
    if (sections === null) return (null);

    const visibleSections = sections.filter(d => d.visible);
    const hiddenSections = sections.filter(d => !d.visible);

    return (
      <div className="legend">
        <h3 className="legend-header">Legend</h3>
        {/* render sections */}
        {visibleSections.map((section, i) => {
          const {
            id,
            label,
            items,
            visible,
            editable,
          } = section;
          return (
            <LegendSection
              key={id}
              index={i}
              id={id}
              label={label}
              items={items}
              visible={visible}
              moveSection={this.moveSection}
              onVisibilityToggle={this.handleVisibilityToggle}
              editable={editable}
            />
          );
        })}
        {hiddenSections.map((section, i) => {
          const {
            id,
            label,
            items,
            visible,
          } = section;
          return (
            <div key={id} className="legend-section hidden">
              <h4 className="legend-section-header">
                {label}
              </h4>
              <div className="controls">
                <button className="button--hide unstyled-button" onClick={() => { this.handleVisibilityToggle(id); }}><FaIcon weight="s" icon="plus-square" /></button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

Legend = DragDropContext(ReactDnDHTML5Backend)(Legend); // eslint-disable-line
