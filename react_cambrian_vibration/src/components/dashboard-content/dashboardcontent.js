import React from "react"

import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map.js";
import * as am5xy from "@amcharts/amcharts5/xy.js";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5geodata_singaporeHigh from '@amcharts/amcharts5-geodata/singaporeHigh';
import moment from 'moment'
import { Grid } from '@mui/material';
import { useRef } from "react"
import { useEffect, useState } from "react";
import VibrationDataService from "../../services/vibration.service.js";
import './dashboardcontent.css'
//import Searchbox from "./searchbox.js";

const DashboardContent = (props) => {

  const [mapData, setmapData] = useState(null);
  const [xychatData, setxychatData] = useState(null);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);

  async function fetchMapData(root) {
    try {
      const response = await VibrationDataService.getSensorDetailsForDashboardMapByClient();
      const data = response.data;
      setmapData(data);
      am5.ready(function () {
        // Set themes
        root.setThemes([
          am5themes_Animated.new(root)
        ]);
        const chart = root.container.children.push(
          am5map.MapChart.new(root, {})
        );

        chart.series.push(
          am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_singaporeHigh,
            exclude: ["AQ"]
          })
        );
        chart.set("zoomControl", am5map.ZoomControl.new(root, {}));

        const pointSeriesGreen = chart.series.push(am5map.MapPointSeries.new(root, {
          latitudeField: "latitude",
          longitudeField: "longitude",
        }));
        const pointSeriesRed = chart.series.push(am5map.MapPointSeries.new(root, {
          latitudeField: "latitude",
          longitudeField: "longitude",
        }));
        const pointSeriesOrange = chart.series.push(am5map.MapPointSeries.new(root, {
          latitudeField: "latitude",
          longitudeField: "longitude",
        }));

        for (let i = 0; i < data.length; i++) {
          const point = data[i];
          const pointSerie = {
            longitude: point.location_lng,
            latitude: point.location_lat,
            name: `${point.sensor_id} - freq:${point.frequency} - Lat:${point.location_lat} - Lng:${point.location_lng}`,
          }

          if (point.frequency > 5) {
            pointSeriesRed.data.push(pointSerie);
          } else {
            if (point.frequency >= 3) {
              pointSeriesOrange.data.push(pointSerie);
            } else {
              pointSeriesGreen.data.push(pointSerie);
            }
          }
        }

        const tooltipText = "[fontSize: 12px]{name}"

        pointSeriesGreen.bullets.push(function (value) {
          const circle = am5.Circle.new(root, {
            radius: 5,
            fill: am5.color(0x4CAF50),
            tooltipText: tooltipText
          });

          return am5.Bullet.new(root, {
            sprite: circle
          });
        });

        pointSeriesRed.bullets.push(function (value) {
          const circle = am5.Circle.new(root, {
            radius: 5,
            fill: am5.color(0xFB1C07),
            tooltipText: tooltipText
          });

          return am5.Bullet.new(root, {
            sprite: circle
          });
        });

        pointSeriesOrange.bullets.push(function (value) {
          const circle = am5.Circle.new(root, {
            radius: 5,
            fill: am5.color(0xF7891C),
            tooltipText: tooltipText
          });

          return am5.Bullet.new(root, {
            sprite: circle
          });
        });

          // Legend
          const legend = chart.children.push(am5.Legend.new(root, {
            nameField: "name",
            fillField: "color",
            strokeField: "color",
            useDefaultMarker: true,
            centerX: am5.p100,
            maxWidth: 100,
            x: am5.p100,
            centerY: am5.p100,
            y: am5.percent(20),
            dx: 0,
            dy: 0,
            background: am5.RoundedRectangle.new(root, {
              fill: am5.color(0xffffff),
              fillOpacity: 0.3
            })
          }));
  
          legend.data.setAll([{
            name: "0 < 3",
            color: am5.color(0x4CAF50),
          }, {
            name: "3 < 5",
            color: am5.color(0xFB1C07),
          }, {
            name: "> 5",
            color: am5.color(0xF7891C),
          }]);
  

        // update data after every 5 minutes
        async function updateData() {
          const response = await VibrationDataService.getSensorDetailsForDashboardMapByClient();
          const data = response.data;
          setmapData(data);


          for (let i = 0; i < data.length; i++) {
            const point = data[i];
            const pointSerie = {
              longitude: point.location_lng,
              latitude: point.location_lat,
              sensorId: point.sensor_id,
              name: `${point.sensor_id} - freq:${point.frequency} - Lat:${point.location_lat} - Lng:${point.location_lng}`,
            }

            if (point.frequency > 5) {
              for (let i = 0; i < pointSeriesRed.data.length; i++) {
                if (pointSeriesRed.data.values[i].sensorId === pointSerie.sensorId) {
                  pointSeriesRed.data.setIndex(i, {
                    ...pointSeriesRed.data.values[i],
                    ...pointSerie
                  })
                } else {
                  pointSeriesRed.data.push(pointSerie);
                }
              }
            } else {
              if (point.frequency >= 3) {
                for (let i = 0; i < pointSeriesOrange.data.length; i++) {
                  if (pointSeriesOrange.data.values[i].sensorId === pointSerie.sensorId) {
                    pointSeriesOrange.data.setIndex(i, {
                      ...pointSeriesOrange.data.values[i],
                      ...pointSerie
                    })
                  } else {
                    pointSeriesOrange.data.push(pointSerie);
                  }
                }
              } else {
                for (let i = 0; i < pointSeriesGreen.data.length; i++) {
                  if (pointSeriesGreen.data.values[i].sensorId === pointSerie.sensorId) {
                    pointSeriesGreen.data.setIndex(i, {
                      ...pointSeriesGreen.data.values[i],
                      ...pointSerie
                    })
                  } else {
                    pointSeriesGreen.data.push(pointSerie);
                  }

                }

              }
            }
          }

        }

        setInterval(function () {
          updateData();
        }, 1000 * 60 * 5)
      });
    } catch (error) {
      setError(error);
    }
  }


  useEffect(() => {
    const root = am5.Root.new("chartdiv5");
    fetchMapData(root);
    return () => {
      root.dispose()
    }
  }, [])


  return (
    <div>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, md: 2 }}>
        <Grid item xs={12} md={6} >
          <div className="map-container">
            <div id="chartdiv5" style={{ width: "100%", height: "500px", border: '1px solid gray' }}>
            </div>
            <div className="label">Map: Time limit exceeded</div>
          </div>
        </Grid>
        <Grid item xs={12} md={6} >
          <div className="map-container">
            <AllSensorsMap />
            <div className="label">Map: Time of latest value</div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}


export default DashboardContent;

const AllSensorsMap = () => {
  useEffect(() => {
    let root = am5.Root.new("all-sensor-map");
    VibrationDataService.getSensorDetailsForDashboardMap().then((response) => {
      const data = response.data;
      am5.ready(function () {
        // // Set themes
        const chart = root.container.children.push(
          am5map.MapChart.new(root, {})
        );

        chart.series.push(
          am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_singaporeHigh,
            exclude: ["AQ"]
          })
        );

        chart.set("zoomControl", am5map.ZoomControl.new(root, {}));

        const bubbleSeries = chart.series.push(
          am5map.MapPointSeries.new(root, {
            valueField: 'value',
            latitudeField: 'latitude',
            longitudeField: 'longitude',
            calculateAggregates: true
          })
        );

        for (let i = 0; i < data.length; i++) {
          const point = data[i];
          const pointSerie = {
            longitude: point.location_lng,
            latitude: point.location_lat,
            value: moment(point.maxdate).format('LLL'),
            name: `${point.sensor_id}`,
          }

          bubbleSeries.data.push(pointSerie);

        }

        const circleTemplate = am5.Template.new({});

        bubbleSeries.bullets.push(function (root) {
          const container = am5.Container.new(root, {});

          const circle = container.children.push(
            am5.Circle.new(root, {
              radius: 5,
              fillOpacity: 0.7,
              fill: am5.color(0x4CAF50),
              cursorOverStyle: "pointer",
              tooltipText: `{name}: [bold]{value}[/]`
            }, circleTemplate)
          );

          const countryLabel = container.children.push(
            am5.Label.new(root, {
              text: "{name}",
              paddingLeft: 5,
              populateText: true,
              fontWeight: "bold",
              fontSize: 13,
              centerY: am5.p50
            })
          );

          circle.on("radius", function (radius) {
            countryLabel.set("x", radius);
          })

          return am5.Bullet.new(root, {
            sprite: container,
            dynamic: true
          });
        });


        // bubbleSeries.bullets.push(function (root, series, dataItem) {
        //   return am5.Bullet.new(root, {
        //     sprite: am5.Label.new(root, {
        //       text: "[fontSize: 12px]{value.formatNumber('#.')}",
        //       fill: am5.color(0xffffff),
        //       populateText: true,
        //       centerX: am5.p50,
        //       centerY: am5.p50,
        //       textAlign: "center",
        //     }),
        //     dynamic: true
        //   });
        // });

        // minValue and maxValue must be set for the animations to work
        bubbleSeries.set("heatRules", [
          {
            target: circleTemplate,
            dataField: "value",
            min: 5,
            max: 20,
            minValue: 0,
            maxValue: 20,
            key: "radius"
          }
        ]);


        async function updateData() {
          const response = await VibrationDataService.getSensorDetailsForDashboardMap();
          const data = response.data;

          for (let i = 0; i < data.length; i++) {
            const point = data[i];
            const pointSerie = {
              longitude: point.location_lng,
              latitude: point.location_lat,
              value: `${point.maxdate.toString()}`,
              name: `${point.sensor_id}`,
            }

            for (let i = 0; i < bubbleSeries.data.length; i++) {
              if (bubbleSeries.data.values[i].name === pointSerie.name) {
                bubbleSeries.data.setIndex(i, {
                  ...bubbleSeries.data.values[i],
                  ...pointSerie,
                })
              } else {
                bubbleSeries.data.push(pointSerie);
              }
            }
          }
        }

        setInterval(function () {
          updateData();
        }, 1000 * 60 * 5)
      });
    })

    return () => {
      root.dispose()
    }
  }, [])
  
  return (
    <div id="all-sensor-map" style={{ width: "100%", height: "500px", border: '1px solid gray' }}>
    </div>
  )
}

