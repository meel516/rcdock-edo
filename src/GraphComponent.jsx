import React, { useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';

const GraphComponent = ({ data, settings, graphType }) => {
  console.log(settings, 'settings1');
  const chartRef = useRef(null);

  const processDataForChart = (
    data,
    chartType,
    xAxisKey,
    yAxisKey,
    groupBy
  ) => {
    switch (chartType) {
      case 'line':
      case 'bar':
      case 'area':
        return {
          xAxisData: data.map((item) => item[xAxisKey]),
          seriesData: {
            name: settings.yAxis,
            data: data.map((item) => item[yAxisKey]),
            type: chartType === 'area' ? 'line' : chartType,
            areaStyle: chartType === 'area' ? {} : null,
          },
        };
      case 'scatter':
        return data.map((item) => [item[xAxisKey], item[yAxisKey]]);
      case 'pie':
      case 'doughnut':
        return data.reduce((acc, item) => {
          const existing = acc.find((i) => i.name === item[xAxisKey]);
          if (existing) {
            existing.value += item[yAxisKey];
          } else {
            acc.push({ name: item[xAxisKey], value: item[yAxisKey] });
          }
          return acc;
        }, []);
      case 'stacked-bar':
      case 'stacked-horizontal-bar': {
        // Step 1: Aggregate the data
        const aggregatedData = data.reduce((acc, item) => {
          const key = `${item[xAxisKey]}-${item[groupBy]}`;
          if (!acc[key]) {
            acc[key] = { ...item };
          } else {
            acc[key][yAxisKey] += item[yAxisKey];
          }
          return acc;
        }, {});

        // Step 2: Transform the aggregated data into the required format
        const transformedData = Object.values(aggregatedData);

        // Get unique x-axis values  and groups
        const uniqueData = [
          ...new Set(transformedData.map((item) => item[xAxisKey])),
        ];
        const uniquePlatforms = [
          ...new Set(transformedData.map((item) => item[groupBy])),
        ];

        // Create the series data
        const seriesData = uniquePlatforms.map((platform) => {
          return {
            name: platform,
            type: 'bar',
            stack: 'total',
            data: uniqueData.map((year) => {
              const foundItem = transformedData.find(
                (item) => item[xAxisKey] === year && item[groupBy] === platform
              );
              return foundItem ? foundItem[yAxisKey] : 0;
            }),
          };
        });

        return {
          xAxisData: uniqueData,
          seriesData,
        };
      }
      case 'stacked-area':
        // Retrieve unique x-axis values (months)
        const uniqueXAxisValues = [
          ...new Set(data.map((item) => item[xAxisKey])),
        ];

        // Adjusted logic for stacked area chart
        const uniqueGroups = [...new Set(data.map((item) => item[groupBy]))];

        const transformedData = uniqueGroups.map((group) => {
          return {
            name: group,
            type: 'line',
            stack: 'total',
            areaStyle: { opacity: 0.5 }, // Adjust the opacity as needed
            data: uniqueXAxisValues.map((xAxisValue) => {
              const matchingDataPoint = data.find(
                (item) =>
                  item[xAxisKey] === xAxisValue && item[groupBy] === group
              );
              return matchingDataPoint ? matchingDataPoint[yAxisKey] : 0;
            }),
          };
        });

        return {
          xAxisData: uniqueXAxisValues,
          seriesData: transformedData,
        };

      case 'nightingale':
        return data.reduce((acc, item) => {
          const existing = acc.find((i) => i.name === item[groupBy]);
          if (existing) {
            existing.value += item[yAxisKey];
          } else {
            acc.push({ name: item[groupBy], value: item[yAxisKey] });
          }
          return acc;
        }, []);
      default:
        return {};
    }
  };

  const chartData = processDataForChart(
    data,
    graphType,
    settings.xAxis,
    settings.yAxis,
    settings.groupBy
  );

  const getOption = () => {
    switch (graphType) {
      case 'line':
      case 'bar':
      case 'area':
        return {
          tooltip: settings.tooltip ? { trigger: 'axis' } : null,
          legend: settings.legend
            ? { textStyle: { fontSize: settings.legendFontSize } }
            : null,
          xAxis: {
            type: 'category',
            data: chartData.xAxisData,
            axisLabel: { fontSize: settings.xAxisFontSize },
          },
          yAxis: {
            type: 'value',
            axisLabel: { fontSize: settings.yAxisFontSize },
          },
          series: [chartData.seriesData],
        };
      case 'scatter':
        return {
          tooltip: settings.tooltip ? { trigger: 'item' } : null,
          legend: settings.legend
            ? { textStyle: { fontSize: settings.legendFontSize } }
            : null,
          xAxis: {
            type: 'category',
            axisLabel: { fontSize: settings.xAxisFontSize },
          },
          yAxis: {
            type: 'value',
            axisLabel: { fontSize: settings.yAxisFontSize },
          },
          series: [
            {
              name: settings.yAxis,
              data: chartData,
              type: 'scatter',
            },
          ],
        };
      case 'pie':
      case 'doughnut':
        return {
          tooltip: settings.tooltip ? { trigger: 'item' } : null,
          legend: settings.legend
            ? { textStyle: { fontSize: settings.legendFontSize } }
            : null,
          series: [
            {
              name: settings.yAxis,
              type: 'pie',
              top: '10%',
              radius: graphType === 'doughnut' ? ['40%', '70%'] : '70%',
              data: chartData,
            },
          ],
        };
      case 'stacked-bar':
        return {
          tooltip: settings.tooltip ? { trigger: 'axis' } : null,
          legend: settings.legend
            ? { textStyle: { fontSize: settings.legendFontSize } }
            : null,
          xAxis: {
            type: 'category',
            data: chartData.xAxisData,
            axisLabel: { fontSize: settings.xAxisFontSize },
          },
          yAxis: {
            type: 'value',
            axisLabel: { fontSize: settings.yAxisFontSize },
          },
          series: chartData.seriesData,
        };
      case 'stacked-horizontal-bar':
        return {
          tooltip: settings.tooltip ? { trigger: 'axis' } : null,
          legend: settings.legend
            ? { textStyle: { fontSize: settings.legendFontSize } }
            : null,
          yAxis: {
            type: 'category',
            data: chartData.xAxisData || chartData.yAxisData,
            axisLabel: { fontSize: settings.yAxisFontSize },
          },
          xAxis: {
            type: 'value',
            axisLabel: { fontSize: settings.xAxisFontSize },
          },
          series: chartData.seriesData,
        };

      case 'stacked-area':
        return {
          tooltip: settings.tooltip ? { trigger: 'axis' } : null,
          legend: settings.legend
            ? { textStyle: { fontSize: settings.legendFontSize } }
            : null,
          xAxis: {
            type: 'category',
            data: chartData.xAxisData,
            axisLabel: { fontSize: settings.xAxisFontSize },
          },
          yAxis: {
            type: 'value',
            axisLabel: { fontSize: settings.yAxisFontSize },
          },
          series: chartData.seriesData.map((series, index) => ({
            ...series,
          })),
        };

      case 'nightingale':
        return {
          tooltip: settings.tooltip ? { trigger: 'item' } : null,
          legend: settings.legend
            ? { textStyle: { fontSize: settings.legendFontSize } }
            : null,
          series: [
            {
              name: settings.yAxis,
              type: 'pie',
              top: '12%',
              radius: ['20%', '80%'],
              roseType: 'area',
              data: chartData,
              label: {
                fontSize: settings.tooltipFontSize,
              },
            },
          ],
        };
      default:
        return {};
    }
  };

  useEffect(() => {
    if (chartRef.current) {
      const echartsInstance = chartRef.current.getEchartsInstance();
      echartsInstance.clear();
      echartsInstance.setOption(getOption());
    }
  }, [data, settings, graphType]);

  return <ReactECharts ref={chartRef} option={getOption()} />;
};

export default GraphComponent;
