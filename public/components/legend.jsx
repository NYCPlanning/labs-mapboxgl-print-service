const { DragDropContext } = ReactDnD;

class Legend extends React.Component { // eslint-disable-line
  constructor(props) {
    super(props);
    this.moveSection = this.moveSection.bind(this);

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
          const { id, label, items } = section;
          return (
            <LegendSection
              key={id}
              index={i}
              id={id}
              label={label}
              items={items}
              moveSection={this.moveSection}
            />
          );
        })}
      </div>
    );
  }
}

Legend = DragDropContext(ReactDnDHTML5Backend)(Legend); // eslint-disable-line
