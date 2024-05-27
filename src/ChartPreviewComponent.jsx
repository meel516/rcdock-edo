import React, { useState, useRef } from 'react';
import './ChartPreview.css';
import GraphSettings from './GraphSettings';
import GraphComponent from './GraphComponent';
import linechart from './images/linechart.png';
import barchart from './images/barchart.png';
import piechart from './images/piechart.png';
import areachart from './images/areachart.png';
import scatterchart from './images/scatterchart.png';
import doughnutchart from './images/doughnutchart.png';
import verticalbar from './images/verticalBar.png';
import horizontalbar from './images/horizontalBar.png';
import stackedarea from './images/stackedarea.png';
import nightingale from './images/nightingale.png';
const EditableChartName = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [chartName, setChartName] = useState('Untitled Chart');
  const inputRef = useRef(null);

  const handleTextClick = () => {
    setIsEditing(true);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    setChartName(e.target.value);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };

  return (
    <div className="editable-chart-name" onClick={handleTextClick}>
      {isEditing ? (
        <div style={{ textAlign: 'left' }}>
          <input
            ref={inputRef}
            type="text"
            value={chartName}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyPress={handleInputKeyPress}
            autoFocus
            className="editable-input"
          />
        </div>
      ) : (
        <div style={{ textAlign: 'left', marginBottom: '5px' }}>
          {chartName}
        </div>
      )}
    </div>
  );
};

const ChartPreviewComponent = React.memo(() => {
  const [showSettingsForm, setShowSettingsForm] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [graphType, setGraphType] = useState('line');
  const iconsContainerRef = useRef(null);

  const [graphSettings, setGraphSettings] = useState({
    xAxis: '',
    yAxis: '',
    legend: true,
    tooltip: true,
    xAxisFontSize: 12,
    yAxisFontSize: 12,
    legendFontSize: 12,
    tooltipFontSize: 12,
  });

  const chartData = [
    { name: 'line', url: linechart },
    { name: 'bar', url: barchart },
    { name: 'pie', url: piechart },
    { name: 'area', url: areachart },
    { name: 'scatter', url: scatterchart },
    { name: 'doughnut', url: doughnutchart },
    { name: 'stacked-bar', url: verticalbar },
    { name: 'stacked-horizontal-bar', url: horizontalbar },
    { name: 'stacked-area', url: stackedarea },
    { name: 'nightingale', url: nightingale },
  ];

  const handleIconClick = (index, graphname) => {
    setGraphType(graphname);
    setSelectedIcon(index);
  };

  const handleScroll = () => {
    if (iconsContainerRef.current) {
      iconsContainerRef.current.scrollBy({ top: 100, behavior: 'smooth' });
    }
  };

  const handleSettingsClick = () => {
    setShowSettingsForm(true);
  };

  const handleSaveSettings = (settings) => {
    setGraphSettings(settings);
    console.log(settings, 'sravan');
  };

  const dummyData = [
    {
      year: '2024',
      Mobius_PI_Direct_PlatformName: 'Big Query',
      total_cost: 1234.56,
    },
    {
      year: '2024',
      Mobius_PI_Direct_PlatformName: 'Snowflake',
      total_cost: 987.65,
    },
    {
      year: '2023',
      Mobius_PI_Direct_PlatformName: 'Azure',
      total_cost: 2345.67,
    },
    {
      year: '2023',
      Mobius_PI_Direct_PlatformName: 'OpenAI',
      total_cost: 876.54,
    },
    {
      year: '2022',
      Mobius_PI_Direct_PlatformName: 'Big Query',
      total_cost: 1000.0,
    },
    {
      year: '2022',
      Mobius_PI_Direct_PlatformName: 'Snowflake',
      total_cost: 2000.0,
    },
    {
      year: '2021',
      Mobius_PI_Direct_PlatformName: 'Azure',
      total_cost: 3000.0,
    },
    {
      year: '2021',
      Mobius_PI_Direct_PlatformName: 'OpenAI',
      total_cost: 4000.0,
    },
    {
      year: '2020',
      Mobius_PI_Direct_PlatformName: 'Big Query',
      total_cost: 5000.0,
    },
    {
      year: '2020',
      Mobius_PI_Direct_PlatformName: 'Snowflake',
      total_cost: 6000.0,
    },
    {
      year: '2019',
      Mobius_PI_Direct_PlatformName: 'Azure',
      total_cost: 7000.0,
    },
    {
      year: '2019',
      Mobius_PI_Direct_PlatformName: 'OpenAI',
      total_cost: 8000.0,
    },
  ];

  return (
    <div className="container">
      <div className="chart-container">
        <div className="heading-container">
          <div className="text-container">
            <h4>Chart</h4>
            <div className="settings-icon" onClick={handleSettingsClick}>
              <img
                width="24"
                height="24"
                src="https://img.icons8.com/ios-filled/50/000000/settings.png"
                alt="Settings"
              />
            </div>
          </div>
          <div className="button-container">
            <button
              style={{
                border: 'none',
                backgroundColor: 'white',
                color: 'blue',
              }}
            >
              Cancel
            </button>
            <button style={{ backgroundColor: 'blue', color: 'white' }}>
              Save to Dashboard
            </button>
          </div>
        </div>
        <div className="chart-preview">
          <EditableChartName />
          {showSettingsForm ? (
            <GraphSettings
              dummyData={dummyData}
              onSave={handleSaveSettings}
              setShowSettingsForm={setShowSettingsForm}
            />
          ) : (
            <>
              <GraphComponent
                data={dummyData}
                settings={graphSettings}
                graphType={graphType}
              />
            </>
          )}
        </div>
      </div>
      <div className="graphSidebar">
        <div ref={iconsContainerRef} className="icons-container">
          {chartData.map((chart, index) => (
            <div
              key={index}
              className={`icon ${selectedIcon === index ? 'selected' : ''}`}
              onClick={() => handleIconClick(index, chart.name)}
            >
              <img src={chart.url} alt={chart.name} />
            </div>
          ))}
        </div>
        <div className="scroll-button" onClick={handleScroll}>
          <img
            src="https://img.icons8.com/ios-filled/50/000000/expand-arrow.png"
            alt="Scroll Down"
            style={{ height: '20px', width: '20px' }}
          />
        </div>
      </div>
    </div>
  );
});

export default ChartPreviewComponent;
