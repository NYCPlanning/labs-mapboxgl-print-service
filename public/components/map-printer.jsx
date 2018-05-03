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
        type='text'
        value={value}
        onChange={this.handleChange}
        injectStyles={false}
      />
    );
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
      legendConfig: null,
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
      legendConfig
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
      legendConfig,
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
      legendConfig,
    } = this.state;

    const transform = `rotate(${360 - bearing}deg)`;

    const { handleChange } = this;

    return (
      <div id="map-printer">
        <section className="sheet padding-10mm">
          <div className="container">
            <header className="header">
              <img src={logo} alt="logo" className="header-logo" />
              <div className="header-text no-sub clearfix">
                <label className="title">
                  <WrappedAutosizeInput
                    value={title}
                    id="title"
                    onChange={this.handleInputChange}
                  />
                  <FaIcon icon="edit" />
                </label>
                <label className="subtitle">
                  <WrappedAutosizeInput
                    value={subtitle}
                    id="subtitle"
                    onChange={this.handleInputChange}
                  />
                  <FaIcon icon="edit" />
                  <FaIcon weight="s" icon="times" />
                </label>
              </div>
            </header>
            <div id="map">
              <div id="north-arrow" style={{ transform }}><span className="n">N</span></div>
              {legendConfig && <Legend config={legendConfig} /> }
            </div>
            <div className="content">
              {content}
            </div>
            <div className="source">{source}</div>
          </div>
        </section>
      </div>
    );
  }
}
