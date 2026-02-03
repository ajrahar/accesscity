import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { fromLonLat } from 'ol/proj';

const SimpleMap = ({ routeGeometry }) => {
    const mapRef = useRef();
    const mapInstance = useRef(null);
    const vectorSource = useRef(new VectorSource());

    useEffect(() => {
        // Initialize Map
        const vectorLayer = new VectorLayer({
            source: vectorSource.current,
            style: new Style({
                stroke: new Stroke({
                    color: '#28a745', // Green for safe route
                    width: 5,
                }),
            }),
        });

        const map = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                vectorLayer
            ],
            view: new View({
                center: fromLonLat([110.390, -7.750]), // Yogyakarta
                zoom: 14,
            }),
        });

        mapInstance.current = map;

        return () => map.setTarget(null);
    }, []);

    // Update map when routeGeometry changes
    useEffect(() => {
        if (routeGeometry && mapInstance.current) {
            const format = new GeoJSON({
                featureProjection: 'EPSG:3857'
            });
            const feature = format.readFeature(routeGeometry);

            vectorSource.current.clear();
            vectorSource.current.addFeature(feature);

            // Zoom to fit route
            const extent = feature.getGeometry().getExtent();
            mapInstance.current.getView().fit(extent, { padding: [50, 50, 50, 50] });
        }
    }, [routeGeometry]);

    return (
        <div ref={mapRef} style={{ width: '100%', height: '500px', border: '1px solid #ccc' }}></div>
    );
};

export default SimpleMap;
