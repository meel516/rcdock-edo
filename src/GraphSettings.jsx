import React, { useState } from 'react';
import './GraphSettings.css';

const GraphSettings = ({ onSave, dummyData, setShowSettingsForm }) => {
  const [xAxis, setXAxis] = useState(Object.keys(dummyData[0])[0]);
  const [yAxis, setYAxis] = useState(Object.keys(dummyData[0])[0]);
  const [groupBy, setGroupBy] = useState(Object.keys(dummyData[0])[0]);
  const [legend, setLegend] = useState(true);
  const [tooltip, setTooltip] = useState(true);
  const [xAxisFontSize, setXAxisFontSize] = useState(10);
  const [yAxisFontSize, setYAxisFontSize] = useState(10);
  const [legendFontSize, setLegendFontSize] = useState(10);
  const [tooltipFontSize, setTooltipFontSize] = useState(10);

  const handleSave = (e) => {
    e.preventDefault();
    const settings = {
      xAxis,
      yAxis,
      legend,
      groupBy,
      tooltip,
      xAxisFontSize,
      yAxisFontSize,
      legendFontSize,
      tooltipFontSize,
    };
    setShowSettingsForm(false);
    onSave(settings);
  };

  return (
    <div className="settings-part">
      {' '}
      <div className="settings-form">
        <h4 className="graph-settings">Graph Settings</h4>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>X-Axis</label>
            <select value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
              {Object.keys(dummyData[0]).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Y-Axis</label>
            <select value={yAxis} onChange={(e) => setYAxis(e.target.value)}>
              {Object.keys(dummyData[0]).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Group-BY</label>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
            >
              {Object.keys(dummyData[0]).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Legend</label>
            <input
              type="checkbox"
              checked={legend}
              onChange={(e) => setLegend(e.target.checked)}
            />
          </div>
          <div className="form-group">
            <label>Tooltip</label>
            <input
              type="checkbox"
              checked={tooltip}
              onChange={(e) => setTooltip(e.target.checked)}
            />
          </div>
          <div className="form-group">
            <label>X-Axis Font Size</label>
            <input
              type="number"
              value={xAxisFontSize}
              onChange={(e) => setXAxisFontSize(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>Y-Axis Font Size</label>
            <input
              type="number"
              value={yAxisFontSize}
              onChange={(e) => setYAxisFontSize(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>Legend Font Size</label>
            <input
              type="number"
              value={legendFontSize}
              onChange={(e) => setLegendFontSize(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>Tooltip Font Size</label>
            <input
              type="number"
              value={tooltipFontSize}
              onChange={(e) => setTooltipFontSize(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <button type="submit" className="save-button">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GraphSettings;
