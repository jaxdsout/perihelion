declare module "@mapbox/mapbox-gl-draw" {
  import type { IControl } from "mapbox-gl";

  interface MapboxDrawOptions {
    displayControlsDefault?: boolean;
    controls?: {
      point?: boolean;
      line_string?: boolean;
      polygon?: boolean;
      trash?: boolean;
      combine_features?: boolean;
      uncombine_features?: boolean;
    };
    [key: string]: unknown;
  }

  class MapboxDraw implements IControl {
    constructor(options?: MapboxDrawOptions);
    onAdd(map: mapboxgl.Map): HTMLElement;
    onRemove(map: mapboxgl.Map): void;
    getAll(): GeoJSON.FeatureCollection;
    getSelected(): GeoJSON.FeatureCollection;
    add(feature: GeoJSON.Feature | GeoJSON.FeatureCollection): string[];
    delete(ids: string | string[]): this;
    deleteAll(): this;
    set(featureCollection: GeoJSON.FeatureCollection): string[];
    trash(): this;
    combineFeatures(): this;
    uncombineFeatures(): this;
    getMode(): string;
    changeMode(mode: string, options?: object): this;
    getSelectedIds(): string[];
    getFeature(id: string): GeoJSON.Feature;
  }

  export default MapboxDraw;
}
