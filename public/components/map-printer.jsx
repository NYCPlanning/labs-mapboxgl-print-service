MapPrinter = React.createClass({
  getInitialState() {
    return {
      logo: '',
      title: 'My Map',
      content: 'Lorem ipsum dolor',
      bearing: 0,
    }
  },

  setupLayout(config) {
    console.log(config);
    const { style, center, zoom, bearing, pitch, logo, title } = config;
    const map = new mapboxgl.Map({
      container: 'map',
      style,
      center,
      zoom,
      bearing,
      pitch,
    });

    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'top-left');

    const scale = new mapboxgl.ScaleControl();
    map.addControl(scale, 'bottom-right');
    this.setState({ logo, title, bearing });
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

  render: function() {
    const { logo, title, content, bearing } = this.state;

    return (
      <div id="map-printer">
        <section className="sheet padding-10mm">
          <div className="container">
            <h1 className="header">
              <img src={logo} alt="logo" className="header-logo" />
              <span contenteditable="true">{title}</span>
            </h1>
            <div id="map">
              <div id="north-arrow" style={{transform:'rotate(0deg)'}}><span className="n">N</span></div>
            </div>
            <div className="content">{content}</div>
          </div>
        </section>

      </div>
    );
  }
});
