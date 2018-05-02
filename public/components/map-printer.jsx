const FaIcon = props => {
  const weight = props.weight ? props.weight : 'r';
  const iconClass = `fa${weight} fa-${props.icon}`;
  return <i className={iconClass}/>
}

class Legend extends React.Component {
  render() {
    const sections = this.props.config;

    return (
      <div className="legend">
        <h3>Legend</h3>
          {sections.map((section, i) => {
            const { label, items } = section;

            return (
              <div key={label}>
                <h4>{label}</h4>

                {items.map((item) => {
                  const { type, label, style } = item;
                  const { fill, stroke='#cdcdcd', strokeWidth=1} = style;

                  return (
                    <div key={label}>
                      <svg width="16" height="16">
                        {(type === 'area') && <rect width="14" height="14" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />}
                        {(type === 'point') && <circle cx="7" cy="7" r="7" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />}
                      </svg>
                      {label}
                    </div>
                  );
                })}
              </div>

            )
          })}
      </div>
    )
  }
}

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

  setupLayout(config) {
    const { mapConfig, logo, title, subtitle, source, content } = config;
    const { style, center, zoom, bearing, pitch } = mapConfig;

    const map = new mapboxgl.Map({
      container: 'map',
      style,
      center,
      zoom,
      bearing,
      pitch,
    });

    map.on('rotate', () => {
      const bearing = map.getBearing();
      this.setState({ bearing });
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
      content
    });
  }

  componentDidMount() {
    fetch('http://localhost:3000/config', {
      credentials: 'include'
    })
      .then(d => d.json())
      .then((config) => {
        this.setupLayout(config)
      })
  }

  handleInputChange(property, e) {
    var obj = {};
    obj[property]= e.target.value;
    this.setState(obj);
  }

  render() {
    const { logo, title, subtitle, content, bearing, source } = this.state;

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
          }
        ]
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
          }
        ]
      }
    ];

    const transform = `rotate(${360 - bearing}deg)`;

    const handleChange = this.handleChange;

    return (
      <div id="map-printer">
        <section className="sheet padding-10mm">
          <div className="container">
            <header className="header">
              <img src={logo} alt="logo" className="header-logo" />
              <div className="header-text no-sub clearfix">
                <span className="title">
                  <AutosizeInput
                    value={title}
                    onChange={ this.handleInputChange.bind(this, 'title') }
                  />
                  <FaIcon icon="edit" />
                </span>
                <span className="subtitle">
                  <AutosizeInput
                    value={subtitle}
                    onChange={ this.handleInputChange.bind(this, 'subtitle') }
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
            <Legend config={legendConfig}/>
          </div>
        </section>
      </div>
    );
  }
};
