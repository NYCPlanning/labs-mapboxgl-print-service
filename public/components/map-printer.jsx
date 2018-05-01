const FaIcon = props => {
  const weight = props.weight ? props.weight : 'r';
  console.log(weight)
  const iconClass = `fa${weight} fa-${props.icon}`;
  return <i className={iconClass}/>
}

MapPrinter = React.createClass({
  getInitialState() {
    return {
      logo: '',
      title: 'My Map',
      subtitle: '',
      content: '',
      source: '',
      bearing: 0,
    }
  },

  setupLayout(config) {
    console.log(config);
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
  },

  componentDidMount() {
    fetch('http://localhost:3000/config', {
      credentials: 'include'
    })
      .then(d => d.json())
      .then((config) => {
        this.setupLayout(config)
      })
  },

  handleInputChange(property, e) {
    var obj = {};
    obj[property]= e.target.value;
    this.setState(obj);
  },

  render: function() {
    const { logo, title, subtitle, content, bearing, source } = this.state;

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

            <div className="content">{content}</div>
            <div className="source">{source}</div>
          </div>
        </section>
      </div>
    );
  }
});
