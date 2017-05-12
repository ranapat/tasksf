/**
 * Map for tasks
 *
 * Map is used to match parameters with tasks. Every map shall
 * match and return Match class unique for parameters. In case
 * of Match overlapping the one with bigger priority will be
 * selected.
 *
 * This class is the base for all Map classes. Cannot be used
 * directly. Extend to use.
 *
 * @abstract
 */
class Map {
  /**
   * Match argument with a specific tasks
   *
   * @return {Match} match
   */
  match(...args) {
    return undefined;
  }
}

export default Map;
