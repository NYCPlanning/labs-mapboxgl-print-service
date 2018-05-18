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
  <label className="editable-input">
    <WrappedAutosizeInput
      value={props.value}
      id={props.id}
      onChange={props.onChange}
    />
    <FaIcon icon="edit" className="hidden-control" />
  </label>
);

const ToggleableElement = (props) => {
  if (props.visible && (props.editable !== false)) {
    return (
      <div className="toggleable-element">
        {props.children}
        <button className="button--hide unstyled-button hidden-control" onClick={() => { props.onChange(props.id); }}><FaIcon weight="s" icon="times" /></button>
      </div>
    );
  }

  if (props.visible) {
    return (
      <div className="toggleable-element">
        {props.children}
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
      titleEditable: true,
      subtitle: '',
      subtitleVisible: true,
      subtitleEditable: true,
      content: null,
      contentVisible: true,
      contentEditable: true,
      source: '',
      sourceVisible: true,
      sourceEditable: true,
      bearing: 0,
      pitch: 0,
      legendConfig: null,
      legendVisible: true,
      legendEditable: true,
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
      titleEditable,
      logo = '',
      subtitle = null,
      subtitleEditable,
      source = '',
      sourceEditable,
      content = '',
      contentEditable,
      legendConfig = null,
      legendEditable,
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

    map.on('pitch', () => {
      this.setState({ pitch: map.getPitch() });
    });

    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'top-left');

    const scale = new mapboxgl.ScaleControl();
    map.addControl(scale, 'bottom-right');

    this.setState({
      logo,
      title,
      titleEditable,
      subtitle,
      subtitleEditable,
      source,
      sourceEditable,
      bearing,
      content,
      contentEditable,
      legendConfig,
      legendEditable,
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

  render() {
    const {
      logo,
      title,
      titleEditable,
      subtitle,
      subtitleVisible,
      subtitleEditable,
      content,
      contentVisible,
      contentEditable,
      bearing,
      pitch,
      source,
      sourceVisible,
      sourceEditable,
      legendConfig,
      legendVisible,
      legendEditable,
    } = this.state;

    const transform = `rotateX(${pitch}deg) rotate(${360 - bearing}deg)`;

    let titleInput = <EditableTextInput value={title} id="title" onChange={this.handleInputChange} />;
    if (titleEditable === false) {
      titleInput = <span id="title"><span className="text-box">{title}</span></span>;
    }

    let subtitleInput = <EditableTextInput value={subtitle} id="subtitle" onChange={this.handleInputChange} />;
    if (subtitleEditable === false) {
      subtitleInput = <span id="subtitle"><span className="text-box">{subtitle}</span></span>;
    }

    let sourceInput = <EditableTextInput value={source} id="source" onChange={this.handleInputChange} />;
    if (sourceEditable === false) {
      sourceInput = <span id="source"><span className="text-box">{source}</span></span>;
    }

    return (
      <div id="map-printer">
        <h1 className="preview-header hide-for-print">Print Preview</h1>
        <section className="sheet padding-10mm">
          <div className="container">

            <header className="header">
              {logo && <img src={logo} alt="logo" className="header-logo" />}
              <div className={subtitleVisible ? 'header-text clearfix' : 'header-text clearfix no-subtitle'}>
                <span className="title">{titleInput}</span>
                <div className="subtitle-container">
                  <ToggleableElement
                    id="subtitleVisible"
                    visible={subtitleVisible}
                    label="Show Subtitle"
                    onChange={this.toggleVisibility}
                    editable={subtitleEditable}
                  >
                    <span className="subtitle">{subtitleInput}</span>
                  </ToggleableElement>
                </div>
              </div>
            </header>

            <div id="map" />

            <div id="north-arrow-container">
              <div id="north-arrow" style={{ transform }}><span className="n">N</span></div>
            </div>

            <div className="legend-container">
              <ToggleableElement
                id="legendVisible"
                visible={legendVisible}
                label="Show Legend"
                onChange={this.toggleVisibility}
                editable={legendEditable}
              >
                {legendConfig && <Legend sections={legendConfig} editable={legendEditable} />}
              </ToggleableElement>
            </div>

            <div className="content-container">
              <ToggleableElement
                id="contentVisible"
                visible={contentVisible}
                label="Show Content"
                onChange={this.toggleVisibility}
                editable={contentEditable}
              >
                <div className="content">{content}</div>
              </ToggleableElement>
            </div>

            <div className="source-container">
              <ToggleableElement
                id="sourceVisible"
                visible={sourceVisible}
                label="Show Source"
                onChange={this.toggleVisibility}
                editable={sourceEditable}
              >
                <div className="source">{sourceInput}</div>
              </ToggleableElement>
            </div>

          </div>
        </section>
      </div>
    );
  }
}
