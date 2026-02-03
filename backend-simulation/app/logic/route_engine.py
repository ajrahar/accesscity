import networkx as nx
import osmnx as ox
from typing import List, Dict, Tuple
from functools import lru_cache
import random

class RouteEngine:
    def __init__(self):
        # Configuration for OSMnx
        ox.settings.use_cache = True
        ox.settings.log_console = False

    def geocode_location(self, query: str) -> Dict:
        """
        Convert a text query (e.g., 'Monas, Jakarta') to coordinates.
        """
        try:
            # ox.geocode returns (lat, lon)
            lat, lon = ox.geocode(query)
            return {"lat": lat, "lon": lon, "address": query}
        except Exception as e:
            print(f"Geocoding error for '{query}': {e}")
            raise Exception(f"Location not found: {query}")

    def get_elevation(self, lat: float, lon: float) -> float:
        """
        Mock Elevation Data Service.
        In production, this would query a DEM Raster (e.g., SRTM) via PostGIS or Rasterio.
        """
        # Deterministic pseudo-random based on coordinates to simulate terrain
        random.seed(lat + lon)
        base_elevation = 100.0  # meters
        variation = random.uniform(-10.0, 10.0)
        return base_elevation + variation

    def calculate_cost(self, distance: float, slope: float, surface: str, profile: str = "wheelchair") -> float:
        """
        Calculate the 'impedance' or cost of traversing a segment based on User Profile.
        """
        penalty = 1.0
        
        # Profile-based Logic
        if profile == "wheelchair":
            if slope > 8.0: penalty += 1000.0   # Impossible
            elif slope > 5.0: penalty += 10.0   # Hard
            elif slope > 2.0: penalty += 2.0    # Moderate
            
            if surface == "cobblestone" or surface == "grass":
                penalty += 5.0

        elif profile == "cane": # Elderly / Walking Stick
             # Distance is a huge factor, slope is moderate factor
             if slope > 8.0: penalty += 5.0
             penalty += 0.5 # Add general fatigue factor per meter

        elif profile == "visual": # Blind / Low Vision
             # Smooth surfaces preferred, tactile paving needed (mocked as 'paved')
             if surface == "unpaved": penalty += 5.0
        
        return distance * penalty

    @lru_cache(maxsize=128)
    def find_safe_route(self, start_node: Tuple[float, float], end_node: Tuple[float, float], profile: str = "wheelchair") -> Dict:
        """
        Find the path with the lowest cost using OSMnx. Cached for performance.
        """
        # 1. Download Graph for the area (with cushion to ensure connectivity)
        # In a real app, we would cache this graph or load a .osm.pbf file.
        # For now, we fetch it live for the specific bounding box.
        try:
            # Create a graph from the point, expanding distance to cover start/end
            # Using 'walk' network type specifically for accessibility
            G = ox.graph_from_point(start_node, dist=2000, network_type='walk')
            
            # 2. Get Nearest Nodes on the Graph
            orig_node = ox.distance.nearest_nodes(G, start_node[1], start_node[0])
            dest_node = ox.distance.nearest_nodes(G, end_node[1], end_node[0])

            # 3. Calculate Route (Dijkstra/A*)
            # Note: OSMnx edges have 'length'. We can add custom weights here.
            
            # Simple simulation: Add 'impedance' attribute to edges
            # For this demo, we assume flat terrain but prepared for slope
            for u, v, k, data in G.edges(keys=True, data=True):
                length = data.get('length', 10.0)
                
                # Mock Slope Calculation from Elevation
                node_u = G.nodes[u]
                node_v = G.nodes[v]
                elev_u = self.get_elevation(node_u['y'], node_u['x'])
                elev_v = self.get_elevation(node_v['y'], node_v['x'])
                
                rise = abs(elev_v - elev_u)
                run = length if length > 0 else 0.1
                slope = (rise / run) * 100.0 # Percentage
                
                surface = data.get('surface', 'paved')
                
                # Apply our specific calculation with profile
                data['impedance'] = self.calculate_cost(length, slope, surface, profile)
                data['grade'] = slope # Store for debug

            # 4. Find Shortest Path
            route_nodes = nx.shortest_path(G, orig_node, dest_node, weight='impedance')

            # 5. Convert to GeoJSON & Generate Instructions
            # Get the coordinates for each node in the path
            coords = []
            instructions = []
            last_name = None
            
            for i, node_id in enumerate(route_nodes):
                node = G.nodes[node_id]
                coords.append([node['x'], node['y']])
                
                # Simple instruction generation (Proto)
                if i < len(route_nodes) - 1:
                    u = route_nodes[i]
                    v = route_nodes[i+1]
                    # Get edge data
                    edge_data = G.get_edge_data(u, v)[0]
                    street_name = edge_data.get('name', 'Jalan Tanpa Nama')
                    if isinstance(street_name, list):
                        street_name = street_name[0]
                        
                    if street_name != last_name:
                        instructions.append(f"Go along {street_name}")
                        last_name = street_name

            return {
                "type": "LineString",
                "coordinates": coords,
                "properties": {
                    "total_nodes": len(route_nodes),
                    "safety_level": "calculated_via_osm",
                    "instructions": instructions
                }
            }
            
        except Exception as e:
            print(f"Error finding route: {e}")
            # Fallback for demo if OSM fails or no path found
            return {
                "type": "LineString",
                "coordinates": [
                    [start_node[1], start_node[0]],
                    [end_node[1], end_node[0]]
                ],
                "properties": {
                    "note": "FALLBACK_ROUTE_ERROR"
                }
            }
