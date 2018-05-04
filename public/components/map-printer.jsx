const FaIcon = (props) => {
  const weight = props.weight ? props.weight : 'r';
  const iconClass = `fa${weight} fa-${props.icon} ${props.className}`;
  return <i className={iconClass} />;
};

class WrappedAutosizeInput extends React.Component {
  handleChange = (e) => {
    const { id, onChange } = this.props;
    const { value } = e.target;
    onChange(id, value);
  }

  render() {
    const { value } = this.props;
    return (
      <AutosizeInput
        type="text"
        value={value}
        onChange={this.handleChange}
        injectStyles={false}
        onFocus={(e) => { e.target.select(); }}
      />
    );
  }
}

const EditableTextInput = props => (
  <label>
    <WrappedAutosizeInput
      value={props.value}
      id={props.id}
      onChange={props.onChange}
    />
    <FaIcon icon="edit" className="hidden-control" />
  </label>
);

const ToggleableElement = (props) => {
  if (props.visible) {
    return (
      <div className="toggleable-element">
        {props.children}
        <button className="button--hide unstyled-button hidden-control" onClick={() => { props.onChange(props.id); }}><FaIcon weight="s" icon="times" /></button>
      </div>
    );
  }

  return (
    <button className="button--show unstyled-button hidden-control" onClick={() => { props.onChange(props.id); }}>
      <FaIcon weight="s" icon="plus-square" />&nbsp;{props.label}
    </button>
  );
};

class MapPrinter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logo: null,
      title: '',
      subtitle: '',
      subtitleVisible: true,
      content: null,
      contentVisible: true,
      source: '',
      sourceVisible: true,
      bearing: 0,
      legendConfig: null,
      legendVisible: true,
    };
  }

  componentDidMount() {
    fetch('/config', {
      credentials: 'include',
    })
      .then(d => d.json())
      .then((config) => {
        this.setupLayout(config);
      });
  }

  setupLayout(config) {
    // set defaults for non-required properties
    const {
      mapConfig,
      title,
      logo = '',
      subtitle = null,
      source = '',
      content = '',
      legendConfig = null,
    } = config;

    const {
      style,
      center,
      zoom,
      bearing = null,
      pitch = null,
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

  toggleVisibility = (id) => {
    const visible = this.state[id];
    const obj = {};
    obj[id] = !visible;
    this.setState(obj);
  }

  // hideSubtitle = () => {
  //   this.setState({ subtitleVisible: false });
  // }
  //
  // showSubtitle = () => {
  //   this.setState({ subtitleVisible: true });
  // }

  render() {
    const {
      logo,
      title,
      subtitle,
      subtitleVisible,
      content,
      contentVisible,
      bearing,
      source,
      sourceVisible,
      legendConfig,
      legendVisible,
    } = this.state;

    const transform = `rotate(${360 - bearing}deg)`;


    return (
      <div id="map-printer">
        <section className="sheet padding-10mm">
          <div className="container">

            <header className="header">
              {logo && <img src={logo} alt="logo" className="header-logo" />}
              <div className={subtitleVisible ? 'header-text clearfix' : 'header-text clearfix no-subtitle'}>
                <span className="title">
                  <EditableTextInput value={title} id="title" onChange={this.handleInputChange} />
                </span>
                <div className="subtitle-container">
                  <ToggleableElement
                    id="subtitleVisible"
                    visible={subtitleVisible}
                    label="Add Subtitle"
                    onChange={this.toggleVisibility}
                  >
                    <span className="subtitle">
                      <EditableTextInput value={subtitle} id="subtitle" onChange={this.handleInputChange} />
                    </span>
                  </ToggleableElement>
                </div>
              </div>
            </header>

            <div id="map" />

            <div id="north-arrow" style={{ transform }}><span className="n">N</span></div>

            <div className="legend-container">
              <ToggleableElement
                id="legendVisible"
                visible={legendVisible}
                label="Show Legend"
                onChange={this.toggleVisibility}
              >
                <Legend config={legendConfig} />
              </ToggleableElement>
            </div>

            <div className="content-container">
              <ToggleableElement
                id="contentVisible"
                visible={contentVisible}
                label="Show Content"
                onChange={this.toggleVisibility}
              >
                <div className="content">{content}</div>
              </ToggleableElement>
            </div>

            <div className="source-container">
              <ToggleableElement
                id="sourceVisible"
                visible={sourceVisible}
                label="Add Source"
                onChange={this.toggleVisibility}
              >
                <div className="source">
                  <EditableTextInput value={source} id="source" onChange={this.handleInputChange} />
                </div>
              </ToggleableElement>
            </div>

          </div>
        </section>
      </div>
    );
  }
}
