import networkx as nx
import osmnx as ox
from typing import List, Dict, Tuple

class RouteEngine:
    def __init__(self):
        # Configuration for OSMnx
        ox.settings.use_cache = True
        ox.settings.log_console = False

    def calculate_cost(self, distance: float, slope: float, surface: str) -> float:
        """
        Calculate the 'impedance' or cost of traversing a segment.
        """
        penalty = 1.0
        
        # Simulated Slope Logic (since we don't have DEM raster linked yet)
        # In production, we'd look up the exact elevation difference here.
        if slope > 8.0:
            penalty += 1000.0
        elif slope > 5.0:
            penalty += 5.0
        elif slope > 2.0:
            penalty += 1.5
            
        return distance * penalty

    def find_safe_route(self, start_node: Tuple[float, float], end_node: Tuple[float, float]) -> Dict:
        """
        Find the path with the lowest cost using OSMnx.
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
                # Randomly simulate some slope if data missing, or default to 0
                slope = data.get('grade', 0.0) 
                
                # Apply our specific calculation
                data['impedance'] = self.calculate_cost(length, slope, "asphalt")

            # 4. Find Shortest Path
            route_nodes = nx.shortest_path(G, orig_node, dest_node, weight='impedance')

            # 5. Convert to GeoJSON
            # Get the coordinates for each node in the path
            coords = []
            for node_id in route_nodes:
                node = G.nodes[node_id]
                coords.append([node['x'], node['y']])

            return {
                "type": "LineString",
                "coordinates": coords,
                "properties": {
                    "total_nodes": len(route_nodes),
                    "safety_level": "calculated_via_osm"
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
