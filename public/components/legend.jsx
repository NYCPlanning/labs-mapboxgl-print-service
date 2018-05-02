const Legend = (props) => {
  const sections = props.config;

  return (
    <div className="legend">
      <h3 className="legend-header">Legend</h3>
      {/* render sections */}
      {sections.map((section) => {
        const { label, items } = section;

        return (
          <div className="legend-section" key={label}>
            <h4 className="legend-section-header">{label}</h4>

            {/* render legendItems */}
            {items.map((item) => {
              const { type, label: itemLabel, style } = item;
              const {
                fill,
                stroke = '#cdcdcd',
                strokeWidth = 1,
                strokeDasharray = 1,
                strokeLinecap = 'butt',
              } = style;

              return (
                <div className="legend-item" key={itemLabel}>
                  <svg width="16" height="8" viewBox="0 0 16 8" preserveAspectRatio="xMinYMid">
                    {(type === 'area') && (
                      <rect width="6" height="6" fill={fill} stroke={stroke} strokeWidth={strokeWidth} x="5" y="1" rx="1" ry="1" />
                    )}

                    {(type === 'line') && (
                      <path
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                        strokeDasharray={strokeDasharray}
                        strokeLinecap={strokeLinecap}
                        d="M0 4 l215 0"
                      />
                    )}

                    {(type === 'point') && (
                      <circle cx="8" cy="4" r="2.5" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
                    )}
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
