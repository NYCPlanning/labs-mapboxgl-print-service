const FaIcon = (props) => {
  const weight = props.weight ? props.weight : 'r';
  const iconClass = `fa${weight} fa-${props.icon}`;
  return <i className={iconClass} />;
};

class WrappedAutosizeInput extends React.Component {
  handleChange = (e) => {
    const { id } = this.props;
    const { value } = e.target;
    this.props.onChange(id, value);
  }

  render() {
    const { value } = this.props;
    return (
      <AutosizeInput
        value={value}
        onChange={this.handleChange}
      />
    );
  }
}

const Legend = (props) => {
  const sections = props.config;

  return (
    <div className="legend">
      <h3>Legend</h3>
      {/* render sections */}
      {sections.map((section) => {
        const { label, items } = section;

        return (
          <div key={label}>
            <h4>{label}</h4>

            {/* render legendItems */}
            {items.map((item) => {
              const { type, label: itemLabel, style } = item;
              const { fill, stroke = '#cdcdcd', strokeWidth = 1 } = style;

              return (
                <div key={itemLabel}>
                  <svg width="16" height="16">
                    {(type === 'area') && <rect width="14" height="14" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />}
                    {(type === 'point') && <circle cx="7" cy="7" r="7" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />}
                  </svg>
                  {itemLabel}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

class MapPrinter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logo: '',
      title: 'My Map',
      subtitle: '',
      content: '',
      source: '',
      bearing: 0,
    };
  }

  componentDidMount() {
    fetch('http://localhost:3000/config', {
      credentials: 'include',
    })
      .then(d => d.json())
      .then((config) => {
        this.setupLayout(config);
      });
  }

  setupLayout(config) {
    const {
      mapConfig,
      logo,
      title,
      subtitle,
      source,
      content,
    } = config;

    const {
      style,
      center,
      zoom,
      bearing,
      pitch,
    } = mapConfig;

    const map = new mapboxgl.Map({
      container: 'map',
      style,
      center,
      zoom,
      bearing,
      pitch,
    });

    map.on('rotate', () => {
      this.setState({ bearing: map.getBearing() });
    });

    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'top-left');

    const scale = new mapboxgl.ScaleControl();
    map.addControl(scale, 'bottom-right');

    this.setState({
      logo,
      title,
      subtitle,
      source,
      bearing,
      content,
    });
  }

  handleInputChange = (id, value) => {
    const obj = {};
    obj[id] = value;
    this.setState(obj);
  }

  render() {
    const {
      logo,
      title,
      subtitle,
      content,
      bearing,
      source,
    } = this.state;

    const legendConfig = [
      {
        label: 'Section 1',
        items: [
          {
            type: 'area',
            label: 'Foo Areas',
            style: {
              fill: '#33C4FF',
              stroke: '#cdcdcd',
            },
          },
          {
            type: 'area',
            label: 'Bar Areas',
            style: {
              fill: '#3CFF33',
              stroke: '#cdcdcd',
            },
          },
          {
            type: 'point',
            label: 'Fizz Points',
            style: {
              fill: '#3333FF',
              stroke: '#7DFF33',
            },
          },
        ],
      },
      {
        label: 'Section 2',
        items: [
          {
            type: 'area',
            label: 'Foo Areas',
            style: {
              fill: '#33C4FF',
              stroke: '#cdcdcd',
            },
          },
          {
            type: 'area',
            label: 'Bar Areas',
            style: {
              fill: '#3CFF33',
              stroke: '#cdcdcd',
            },
          },
          {
            type: 'point',
            label: 'Fizz Points',
            style: {
              fill: '#3333FF',
              stroke: '#7DFF33',
            },
          },
        ],
      },
    ];

    const transform = `rotate(${360 - bearing}deg)`;

    const { handleChange } = this;

    return (
      <div id="map-printer">
        <section className="sheet padding-10mm">
          <div className="container">
            <header className="header">
              <img src={logo} alt="logo" className="header-logo" />
              <div className="header-text no-sub clearfix">
                <span className="title">
                  <WrappedAutosizeInput
                    value={title}
                    id="title"
                    onChange={this.handleInputChange}
                  />
                  <FaIcon icon="edit" />
                </span>
                <span className="subtitle">
                  <WrappedAutosizeInput
                    value={subtitle}
                    id="subtitle"
                    onChange={this.handleInputChange}
                  />
                  <FaIcon icon="edit" />
                  <FaIcon weight="s" icon="times" />
                </span>
              </div>
            </header>
            <div id="map">
              <div id="north-arrow" style={{ transform }}><span className="n">N</span></div>
            </div>

            <div className="content">
              {content}
            </div>
            <div className="source">{source}</div>
            <Legend config={legendConfig} />
          </div>
        </section>
      </div>
    );
  }
}
