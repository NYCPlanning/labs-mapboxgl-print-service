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

class MapPrinter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logo: null,
      title: '',
      subtitle: '',
      content: null,
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

  hideSubtitle = () => {
    this.setState({ subtitle: null });
  }

  showSubtitle = () => {
    this.setState({ subtitle: 'Subtitle' });
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


    return (
      <div id="map-printer">
        <section className="sheet padding-10mm">
          <div className="container">
            <header className="header">
              {logo && <img src={logo} alt="logo" className="header-logo" />}
              <div className={subtitle === null ? 'header-text no-subtitle clearfix' : 'header-text clearfix'}>
                <span className="title">
                  <EditableTextInput value={title} id="title" onChange={this.handleInputChange} />
                </span>
                {subtitle !== null ? (
                  <span className="subtitle">
                    <EditableTextInput value={subtitle} id="subtitle"  onChange={this.handleInputChange} />
                    <button className="unstyled-button hidden-control" onClick={this.hideSubtitle}><FaIcon weight="s" icon="times" /></button>
                  </span>
                ) : (
                  <div className="hidden-control">
                    <button className="unstyled-button button--add-subtitle" onClick={this.showSubtitle}>
                      <FaIcon weight="s" icon="plus-square" />&nbsp;Add Subtitle
                    </button>
                  </div>
                )}
              </div>
            </header>
            <div id="map">
              <div id="north-arrow" style={{ transform }}><span className="n">N</span></div>
              {legendConfig && <Legend config={legendConfig} /> }
            </div>
            {content && <div className="content">{content}</div>}
            <div className="source">
              <EditableTextInput value={source} id="source" onChange={this.handleInputChange} />
            </div>
          </div>
        </section>
      </div>
    );
  }
}
