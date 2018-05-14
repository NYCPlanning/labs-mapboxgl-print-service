const LegendSymbol = (props) => {
  // defaults
  const {
    fill,
    stroke = '#cdcdcd',
    strokeWidth = 1,
    strokeDasharray = 'none',
    strokeLinecap = 'butt',
  } = props.style;

  return (
    <svg className="legend-icon" width="16" height="8" viewBox="0 0 16 8" preserveAspectRatio="xMinYMid">
      {(props.type === 'area') && (
        <rect width="6" height="6" fill={fill} stroke={stroke} strokeWidth={strokeWidth} x="5" y="1" rx="1" ry="1" />
      )}

      {(props.type === 'line') && (
        <path
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinecap={strokeLinecap}
          d="M0 4 l215 0"
        />
      )}

      {(props.type === 'point') && (
        <circle cx="8" cy="4" r="2.5" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      )}
    </svg>
  );
};

const Legend = (props) => {
  const sections = props.config;
  if (sections === null) return (null);
  console.log(sections)

  return (
    <div className="legend">
      <h3 className="legend-header">Legend</h3>
      {/* render sections */}
      {sections.map((section) => {
        const {
          id,
          label,
          labelIcon,
          items,
        } = section;

        return (
          <div className="legend-section" key={id}>
            <h4 className="legend-section-header">
              {label}
            </h4>

            {/* render legendItems */}
            {items && items.map((item) => {
              const { type, label: itemLabel, style } = item;

              return (
                <div className="legend-item" key={itemLabel}>
                  <LegendSymbol type={type} style={style} />
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
